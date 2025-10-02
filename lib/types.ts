export interface Prompt {
  id: string;
  name: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  category: string;
}

export interface XMLTag {
  name: string;
  description: string;
  example: string;
  isCustom?: boolean;
}

