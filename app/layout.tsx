import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TagMyPrompt - Structure your AI prompts with precision",
  description: "Professional prompt engineering tool with XML/Markdown tagging and AI-powered formatting. Build better prompts with structured context engineering.",
  keywords: ["AI", "prompts", "prompt engineering", "context engineering", "XML", "Markdown", "Claude API", "TagMyPrompt"],
  authors: [{ name: "TagMyPrompt" }],
  metadataBase: new URL("https://tagmyprompt.vkakar.com"),
  openGraph: {
    title: "TagMyPrompt - Structure your AI prompts with precision",
    description: "Professional prompt engineering tool with XML/Markdown tagging and AI-powered formatting",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TagMyPrompt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TagMyPrompt - Structure your AI prompts with precision",
    description: "Professional prompt engineering tool with XML/Markdown tagging and AI-powered formatting",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  themeColor: "#2563EB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

