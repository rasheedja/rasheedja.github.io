#!/usr/bin/env node

/**
 * Updates star counts in portfolio.json from GitHub API
 * Run with: node scripts/update-stars.mjs
 * Or add to package.json: "update-stars": "node scripts/update-stars.mjs"
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const portfolioPath = join(__dirname, "../src/data/portfolio.json");

async function getStars(repoUrl) {
  // Extract owner/repo from GitHub URL
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) {
    console.warn(`Could not parse GitHub URL: ${repoUrl}`);
    return null;
  }

  const [, owner, repo] = match;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "portfolio-star-updater",
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        console.warn(`Rate limited. Try again later or use a GitHub token.`);
        return null;
      }
      console.warn(`Failed to fetch ${owner}/${repo}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.stargazers_count;
  } catch (error) {
    console.warn(`Error fetching ${owner}/${repo}:`, error.message);
    return null;
  }
}

async function main() {
  console.log("Reading portfolio.json...");
  const portfolio = JSON.parse(readFileSync(portfolioPath, "utf-8"));

  console.log("Fetching star counts from GitHub...\n");

  let updated = 0;
  for (const project of portfolio.projects) {
    const stars = await getStars(project.url);

    if (stars !== null && stars !== project.stars) {
      console.log(`${project.name}: ${project.stars} → ${stars}`);
      project.stars = stars;
      updated++;
    } else if (stars !== null) {
      console.log(`${project.name}: ${stars} (unchanged)`);
    }

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  if (updated > 0) {
    writeFileSync(portfolioPath, JSON.stringify(portfolio, null, 2) + "\n");
    console.log(`\n✓ Updated ${updated} project(s) in portfolio.json`);
  } else {
    console.log("\n✓ All star counts are up to date");
  }
}

main().catch(console.error);
