// Simple encryption for API key storage
// Note: This provides basic obfuscation, not cryptographic security
// For production, consider more robust solutions

const STORAGE_KEY = "anthropic_api_key";

function simpleEncrypt(text: string): string {
  // Base64 encode with simple XOR
  const key = "prompt-manager-2025";
  let encrypted = "";
  for (let i = 0; i < text.length; i++) {
    encrypted += String.fromCharCode(
      text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return btoa(encrypted);
}

function simpleDecrypt(encrypted: string): string {
  try {
    const key = "prompt-manager-2025";
    const decoded = atob(encrypted);
    let decrypted = "";
    for (let i = 0; i < decoded.length; i++) {
      decrypted += String.fromCharCode(
        decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return decrypted;
  } catch {
    return "";
  }
}

export function saveApiKey(apiKey: string): void {
  if (typeof window === "undefined") return;
  
  if (!apiKey) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  
  const encrypted = simpleEncrypt(apiKey);
  localStorage.setItem(STORAGE_KEY, encrypted);
}

export function getApiKey(): string | null {
  if (typeof window === "undefined") return null;
  
  const encrypted = localStorage.getItem(STORAGE_KEY);
  if (!encrypted) return null;
  
  return simpleDecrypt(encrypted);
}

export function removeApiKey(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function hasApiKey(): boolean {
  return !!getApiKey();
}

