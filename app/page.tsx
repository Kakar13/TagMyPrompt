import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ArrowRight, 
  Code2, 
  FileText, 
  Tag, 
  Zap, 
  Shield, 
  Database, 
  Sparkles, 
  Brain,
  Check,
  Github,
  BookOpen,
  Key,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-purple-950/10">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/yourusername/tagmyprompt" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <Link href="/editor">
              <Button size="sm" className="gradient-primary hover-lift">
                Launch Editor
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-24 md:pt-32 md:pb-32">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-medium mb-8 hover-lift">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span>Now with AI-powered formatting</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Structure</span> your AI prompts
            <br />
            with <span className="gradient-text">precision</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Professional prompt engineering tool with <span className="font-mono text-foreground">&lt;XML&gt;</span> tagging, 
            Markdown support, and AI-powered formatting using Claude API
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/editor">
              <Button size="lg" className="gradient-primary hover-lift text-lg px-8 py-6 h-auto">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Tagging Free
              </Button>
            </Link>
            <a 
              href="https://github.com/yourusername/tagmyprompt"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto hover-lift">
                <Github className="mr-2 h-5 w-5" />
                View on GitHub
              </Button>
            </a>
          </div>

          {/* Editor Preview */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative glass rounded-2xl p-6 md:p-8 border-2 border-purple-500/20">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-auto text-xs text-muted-foreground font-mono">editor.xml</span>
              </div>
              <div className="bg-background/50 rounded-lg p-6 text-left font-mono text-sm overflow-x-auto">
                <pre className="text-muted-foreground">
                  <span className="text-blue-400">&lt;instructions&gt;</span>{"\n"}
                  <span className="text-foreground">  You are an expert AI assistant.</span>{"\n"}
                  {"\n"}
                  <span className="text-muted-foreground">  ## Guidelines</span>{"\n"}
                  <span className="text-foreground">  - Be clear and concise</span>{"\n"}
                  <span className="text-foreground">  - Provide examples when helpful</span>{"\n"}
                  <span className="text-blue-400">&lt;/instructions&gt;</span>{"\n"}
                  {"\n"}
                  <span className="text-blue-400">&lt;context&gt;</span>{"\n"}
                  <span className="text-foreground">  Context goes here...</span>{"\n"}
                  <span className="text-blue-400">&lt;/context&gt;</span>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              AI-Powered <span className="gradient-text">Intelligence</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform rough notes into well-structured prompts with one click
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-purple-500/20 hover-lift bg-gradient-to-br from-purple-950/20 to-transparent">
              <CardHeader className="p-6">
                <div className="p-3 gradient-primary rounded-xl w-fit mb-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl">AI Format Assistant</CardTitle>
                <CardDescription className="text-base mt-2">
                  Automatically enhance your prompts with proper XML structure and Markdown formatting. 
                  Uses Claude API with context engineering best practices built-in.
                </CardDescription>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Instant structure optimization</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Smart tag placement</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Keyboard shortcut: Cmd/Ctrl + Shift + F</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-2 border-blue-500/20 hover-lift bg-gradient-to-br from-blue-950/20 to-transparent">
              <CardHeader className="p-6">
                <div className="p-3 gradient-secondary rounded-xl w-fit mb-4">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Smart Tag Suggestions</CardTitle>
                <CardDescription className="text-base mt-2">
                  Get AI recommendations on which XML tags would benefit your prompt most. 
                  Learn best practices as you build.
                </CardDescription>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Context-aware suggestions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Explanations for each recommendation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>One-click tag insertion</span>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Everything you need to <span className="gradient-text">build better prompts</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover-lift">
              <CardHeader>
                <div className="p-2 bg-purple-500/10 rounded-lg w-fit mb-3">
                  <Code2 className="h-6 w-6 text-purple-400" />
                </div>
                <CardTitle>Smart Editor</CardTitle>
                <CardDescription>
                  Monaco-powered editor with syntax highlighting, auto-completion, and real-time XML validation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <div className="p-2 bg-blue-500/10 rounded-lg w-fit mb-3">
                  <Tag className="h-6 w-6 text-blue-400" />
                </div>
                <CardTitle>XML Tag System</CardTitle>
                <CardDescription>
                  10+ pre-built tags plus custom tag creation. Insert tags with one click.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <div className="p-2 bg-green-500/10 rounded-lg w-fit mb-3">
                  <FileText className="h-6 w-6 text-green-400" />
                </div>
                <CardTitle>Template Library</CardTitle>
                <CardDescription>
                  Ready-to-use templates for coding, analysis, and creative tasks
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <div className="p-2 bg-yellow-500/10 rounded-lg w-fit mb-3">
                  <Zap className="h-6 w-6 text-yellow-400" />
                </div>
                <CardTitle>Token Counter</CardTitle>
                <CardDescription>
                  Real-time token counting with cl100k_base to optimize context usage
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <div className="p-2 bg-purple-500/10 rounded-lg w-fit mb-3">
                  <Database className="h-6 w-6 text-purple-400" />
                </div>
                <CardTitle>Prompt Library</CardTitle>
                <CardDescription>
                  Save, search, and organize unlimited prompts with categories and tags
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <div className="p-2 bg-blue-500/10 rounded-lg w-fit mb-3">
                  <Shield className="h-6 w-6 text-blue-400" />
                </div>
                <CardTitle>Privacy First</CardTitle>
                <CardDescription>
                  All data stored locally in your browser. No servers, no tracking
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How it <span className="gradient-text">works</span>
          </h2>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-xl font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Write or paste your prompt</h3>
                <p className="text-muted-foreground">
                  Start with a rough draft, notes, or an existing prompt. Don't worry about structure yet.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-xl font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Use AI or manual tagging</h3>
                <p className="text-muted-foreground">
                  Click "✨ AI Format" for instant structure, or manually insert XML tags from the palette.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-xl font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Save and export</h3>
                <p className="text-muted-foreground">
                  Save to your library for reuse, or export as JSON to share with your team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center glass p-12 md:p-16 rounded-3xl border-2 border-purple-500/20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to <span className="gradient-text">level up</span> your prompts?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join developers building better AI prompts with TagMyPrompt
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/editor">
              <Button size="lg" className="gradient-primary hover-lift text-lg px-8 py-6 h-auto">
                <Sparkles className="mr-2 h-5 w-5" />
                Launch Editor Now
              </Button>
            </Link>
            <a 
              href="https://console.anthropic.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto hover-lift">
                <Key className="mr-2 h-5 w-5" />
                Get API Key
              </Button>
            </a>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            Free to use • No account required • Privacy-focused
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Logo size="sm" className="mb-4" />
              <p className="text-sm text-muted-foreground max-w-sm">
                Professional prompt engineering tool with AI-powered formatting and structured tagging.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="https://github.com/yourusername/tagmyprompt" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    Get API Key
                  </a>
                </li>
                <li>
                  <Link href="/editor" className="hover:text-foreground transition-colors">
                    Launch Editor
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="https://github.com/yourusername/tagmyprompt" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    GitHub
                  </a>
                </li>
                <li>
                  <Link href="/editor" className="hover:text-foreground transition-colors">
                    Editor
                  </Link>
                </li>
                <li>
                  <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    Deploy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/50 mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>
              Open source prompt engineering tool • MIT Licensed
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
