
export interface Project {
  id: string;
  title: string;
  description: string;
  image: string; // Placeholder color or URL
  tech: string[];
  link: string;
}

export interface SkillCategory {
  title: string;
  icon: string; // Lucide icon name
  items: {
    label: string;
    value: string;
  }[];
}

export interface Report {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  summary: string;
  tags: string[];
}


