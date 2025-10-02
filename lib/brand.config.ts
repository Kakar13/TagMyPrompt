// TagMyPrompt Brand Configuration

export const brand = {
  name: "TagMyPrompt",
  tagline: "Structure your AI prompts with precision",
  description: "Professional prompt engineering tool with XML/Markdown tagging and AI-powered formatting",
  
  colors: {
    primary: {
      brand: "#8B5CF6",
      deep: "#6D28D9",
      light: "#A78BFA",
    },
    secondary: {
      blue: "#3B82F6",
      green: "#10B981",
      amber: "#F59E0B",
    },
    neutral: {
      darkBg: "#0F172A",
      cardBg: "#1E293B",
      border: "#334155",
      textPrimary: "#F1F5F9",
      textSecondary: "#94A3B8",
    },
  },
  
  typography: {
    heading: "Inter, system-ui, sans-serif",
    body: "Inter, system-ui, sans-serif",
    code: "JetBrains Mono, Fira Code, monospace",
  },
  
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },
  
  borderRadius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
  },
  
  animation: {
    duration: {
      fast: "150ms",
      normal: "200ms",
      slow: "300ms",
    },
    easing: {
      ease: "ease",
      easeIn: "ease-in",
      easeOut: "ease-out",
      easeInOut: "ease-in-out",
    },
  },
} as const;

export type Brand = typeof brand;

