import { Prompt, Category, Template, XMLTag } from "./types";

// Storage keys
const STORAGE_KEYS = {
  PROMPTS: "prompts",
  CATEGORIES: "categories",
  TEMPLATES: "templates",
  CUSTOM_TAGS: "customTags",
} as const;

// This abstraction allows easy swapping to Vercel KV or Postgres later
class StorageAdapter {
  private isClient = typeof window !== "undefined";

  async get<T>(key: string): Promise<T | null> {
    if (!this.isClient) return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    if (!this.isClient) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
    }
  }

  async remove(key: string): Promise<void> {
    if (!this.isClient) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  }
}

const storage = new StorageAdapter();

// Prompts
export async function getPrompts(): Promise<Prompt[]> {
  const prompts = await storage.get<Prompt[]>(STORAGE_KEYS.PROMPTS);
  return prompts || [];
}

export async function savePrompt(prompt: Prompt): Promise<void> {
  const prompts = await getPrompts();
  const index = prompts.findIndex((p) => p.id === prompt.id);
  
  if (index >= 0) {
    prompts[index] = { ...prompt, updatedAt: new Date().toISOString() };
  } else {
    prompts.push(prompt);
  }
  
  await storage.set(STORAGE_KEYS.PROMPTS, prompts);
}

export async function deletePrompt(id: string): Promise<void> {
  const prompts = await getPrompts();
  const filtered = prompts.filter((p) => p.id !== id);
  await storage.set(STORAGE_KEYS.PROMPTS, filtered);
}

export async function getPromptById(id: string): Promise<Prompt | null> {
  const prompts = await getPrompts();
  return prompts.find((p) => p.id === id) || null;
}

// Categories
export async function getCategories(): Promise<Category[]> {
  const categories = await storage.get<Category[]>(STORAGE_KEYS.CATEGORIES);
  return categories || getDefaultCategories();
}

export async function saveCategory(category: Category): Promise<void> {
  const categories = await getCategories();
  const index = categories.findIndex((c) => c.id === category.id);
  
  if (index >= 0) {
    categories[index] = category;
  } else {
    categories.push(category);
  }
  
  await storage.set(STORAGE_KEYS.CATEGORIES, categories);
}

export async function deleteCategory(id: string): Promise<void> {
  const categories = await getCategories();
  const filtered = categories.filter((c) => c.id !== id);
  await storage.set(STORAGE_KEYS.CATEGORIES, filtered);
}

function getDefaultCategories(): Category[] {
  return [
    { id: "coding", name: "Coding Assistant", color: "#3b82f6" },
    { id: "analysis", name: "Data Analysis", color: "#8b5cf6" },
    { id: "creative", name: "Creative Writing", color: "#ec4899" },
    { id: "general", name: "General", color: "#6b7280" },
  ];
}

// Templates
export async function getTemplates(): Promise<Template[]> {
  const templates = await storage.get<Template[]>(STORAGE_KEYS.TEMPLATES);
  return templates || getDefaultTemplates();
}

export async function saveTemplate(template: Template): Promise<void> {
  const templates = await getTemplates();
  const index = templates.findIndex((t) => t.id === template.id);
  
  if (index >= 0) {
    templates[index] = template;
  } else {
    templates.push(template);
  }
  
  await storage.set(STORAGE_KEYS.TEMPLATES, templates);
}

export async function deleteTemplate(id: string): Promise<void> {
  const templates = await getTemplates();
  const filtered = templates.filter((t) => t.id !== id);
  await storage.set(STORAGE_KEYS.TEMPLATES, filtered);
}

function getDefaultTemplates(): Template[] {
  return [
    {
      id: "coding-assistant",
      name: "Coding Assistant",
      description: "A structured prompt for code-related tasks",
      category: "coding",
      content: `<instructions>
You are an expert software engineer. Help the user with their coding task.

## Guidelines
- Write clean, maintainable code
- Follow best practices for the language/framework
- Provide explanations for complex logic
- Consider edge cases and error handling
</instructions>

<context>
Project context goes here...
</context>

<constraints>
- Use TypeScript
- Follow the existing code style
- Write tests for new functionality
</constraints>`,
    },
    {
      id: "data-analysis",
      name: "Data Analysis",
      description: "Template for data analysis and insights",
      category: "analysis",
      content: `<instructions>
Analyze the provided data and generate insights.

## Analysis Steps
1. Data validation and cleaning
2. Exploratory data analysis
3. Statistical analysis
4. Visualization recommendations
5. Key findings and recommendations
</instructions>

<context>
Dataset description:
[Describe your dataset here]
</context>

<output>
Provide:
- Summary statistics
- Key insights
- Actionable recommendations
- Suggested visualizations
</output>`,
    },
    {
      id: "creative-writing",
      name: "Creative Writing",
      description: "Template for creative writing tasks",
      category: "creative",
      content: `<instructions>
Create engaging creative content based on the requirements.

## Writing Guidelines
- Maintain consistent tone and style
- Use vivid, descriptive language
- Ensure logical flow and structure
- Consider the target audience
</instructions>

<context>
Genre: [Genre]
Target audience: [Audience]
Tone: [Tone]
</context>

<constraints>
- Word count: [Count]
- Perspective: [First/Third person]
- Additional requirements: [Requirements]
</constraints>`,
    },
  ];
}

// Custom Tags
export async function getCustomTags(): Promise<XMLTag[]> {
  const tags = await storage.get<XMLTag[]>(STORAGE_KEYS.CUSTOM_TAGS);
  return tags || [];
}

export async function saveCustomTag(tag: XMLTag): Promise<void> {
  const tags = await getCustomTags();
  const index = tags.findIndex((t) => t.name === tag.name);
  
  if (index >= 0) {
    tags[index] = tag;
  } else {
    tags.push({ ...tag, isCustom: true });
  }
  
  await storage.set(STORAGE_KEYS.CUSTOM_TAGS, tags);
}

export async function deleteCustomTag(name: string): Promise<void> {
  const tags = await getCustomTags();
  const filtered = tags.filter((t) => t.name !== name);
  await storage.set(STORAGE_KEYS.CUSTOM_TAGS, filtered);
}

// Export/Import
export async function exportData(): Promise<string> {
  const prompts = await getPrompts();
  const categories = await getCategories();
  const templates = await getTemplates();
  const customTags = await getCustomTags();
  
  return JSON.stringify(
    {
      version: "1.0.0",
      exportDate: new Date().toISOString(),
      data: { prompts, categories, templates, customTags },
    },
    null,
    2
  );
}

export async function importData(jsonString: string): Promise<void> {
  try {
    const parsed = JSON.parse(jsonString);
    const { prompts, categories, templates, customTags } = parsed.data;
    
    if (prompts) await storage.set(STORAGE_KEYS.PROMPTS, prompts);
    if (categories) await storage.set(STORAGE_KEYS.CATEGORIES, categories);
    if (templates) await storage.set(STORAGE_KEYS.TEMPLATES, templates);
    if (customTags) await storage.set(STORAGE_KEYS.CUSTOM_TAGS, customTags);
  } catch (error) {
    throw new Error("Invalid import file format");
  }
}

