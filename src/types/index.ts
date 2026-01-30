export interface Profile {
  url: string;
  username: string;
}

export interface Basics {
  name: string;
  label: string;
  summary: string;
  email: string;
  phone: string;
  location: string;
  profiles: {
    github: Profile;
    linkedin: Profile;
  };
}

export interface Job {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  highlights: string[];
}

export interface Education {
  institution: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  location: string;
  grade?: string;
  description: string;
}

export interface SkillItem {
  name: string;
  description: string;
}

export interface SkillCategory {
  category: string;
  items: SkillItem[];
}

export interface Project {
  name: string;
  description: string;
  url: string;
  language: string;
  stars: number;
  role: "author" | "contributor";
  topics: string[];
}

export interface PublicationLinks {
  pdf?: string;
  arxiv?: string;
  doi?: string;
}

export interface Publication {
  type: "thesis" | "paper";
  title: string;
  authors: string[];
  venue: string;
  year: string;
  description: string;
  links: PublicationLinks;
}

export interface SectionTitles {
  experience: string;
  projects: string;
  publications: string;
  skills: string;
  education: string;
}

export interface Portfolio {
  sectionTitles: SectionTitles;
  basics: Basics;
  work: Job[];
  education: Education[];
  skills: SkillCategory[];
  projects: Project[];
  publications: Publication[];
}
