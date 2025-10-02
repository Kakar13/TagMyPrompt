# TagMyPrompt

<div align="center">

![TagMyPrompt Logo](public/icon.svg)

**Structure your AI prompts with precision**

[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/tagmyprompt)

[Live Demo](https://tagmyprompt.vercel.app) • [Documentation](https://github.com/yourusername/tagmyprompt) • [Report Bug](https://github.com/yourusername/tagmyprompt/issues) • [Request Feature](https://github.com/yourusername/tagmyprompt/issues)

</div>

---

## 🎯 What is TagMyPrompt?

TagMyPrompt is a professional, open-source prompt engineering tool that helps you create better-structured AI prompts using XML tags and Markdown formatting. Built with modern web technologies and designed for developers who want to optimize their AI interactions.

### Key Features

✨ **AI-Powered Formatting** - Automatically structure prompts with proper XML tags using Claude API  
🏷️ **Smart Tag System** - 10+ pre-built XML tags plus custom tag creation  
📝 **Monaco Editor** - VS Code's editor with syntax highlighting and auto-completion  
📊 **Token Counter** - Real-time token counting with cl100k_base tokenizer  
💾 **Prompt Library** - Save, search, and organize unlimited prompts locally  
🎨 **Template System** - Ready-to-use templates for common use cases  
🔒 **Privacy First** - All data stored locally in your browser  
🌙 **Dark Mode** - Beautiful dark theme optimized for long editing sessions

---

## 🚀 Quick Start

### Try It Now

Visit [https://tagmyprompt.vercel.app](https://tagmyprompt.vercel.app) and start building better prompts instantly. No account required!

### Run Locally

```bash
# Clone the repository
git clone https://github.com/yourusername/tagmyprompt.git
cd tagmyprompt

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/tagmyprompt)

---

## 📖 How It Works

### 1. Write Your Prompt
Start with a rough draft or paste existing content. No need to worry about structure initially.

### 2. Use AI or Manual Tagging
- **AI Format**: Click the ✨ button for instant AI-powered structuring
- **Manual Tags**: Insert XML tags from the palette
- **Smart Suggestions**: Get AI recommendations on which tags to use

### 3. Save and Export
Save to your local library or export as JSON to share with your team.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **AI**: Claude API (Sonnet 4)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: Optimized for [Vercel](https://vercel.com/)

---

## 🎨 Features in Detail

### AI-Powered Features

**AI Format Assistant**
- Automatically structures prompts with proper XML tags
- Adds Markdown formatting for better readability
- Follows context engineering best practices
- Streaming responses for real-time feedback
- One-click undo functionality

**Smart Tag Suggestions**
- AI analyzes your content
- Recommends most beneficial XML tags
- Explains why each tag would help
- One-click tag insertion

### Editor Features

**Monaco Editor Integration**
- Syntax highlighting for XML and Markdown
- Auto-completion and IntelliSense
- Code folding for better organization
- Bracket pair colorization
- Real-time XML validation

**Token Counter**
- Uses cl100k_base tokenizer (same as GPT-4)
- Real-time character, word, and line count
- Helps optimize context window usage
- Prevents token limit issues

### Prompt Management

**Library System**
- Save unlimited prompts locally
- Search and filter by name/description
- Organize with categories
- Color-coded category badges
- Quick-load from sidebar

**Import/Export**
- Export all data as JSON
- Backup your prompts
- Share with team members
- Version control friendly

---

## 🔐 Privacy & Security

- **Local Storage**: All data stored in your browser
- **No Backend**: No server-side data collection
- **API Key**: Your Claude API key stored locally (encrypted)
- **Open Source**: Full transparency, audit the code
- **No Tracking**: No analytics or third-party trackers

---

## 📦 Project Structure

```
tagmyprompt/
├── app/                    # Next.js app directory
│   ├── api/                # API routes (Claude integration)
│   ├── editor/             # Editor page
│   ├── page.tsx            # Landing page
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── ui/                 # Base UI components
│   ├── logo.tsx            # Brand logo
│   ├── prompt-editor.tsx   # Monaco editor wrapper
│   ├── prompt-library.tsx  # Library management
│   └── tag-palette.tsx     # XML tag selector
├── lib/                    # Utilities and helpers
│   ├── storage.ts          # LocalStorage abstraction
│   ├── xml-tags.ts         # XML validation
│   ├── tokenizer.ts        # Token counting
│   └── brand.config.ts     # Brand configuration
└── public/                 # Static assets
```

---

## ⚙️ Configuration

### Environment Variables (Optional)

For server-side API key (if not using client-side):

```env
# .env.local
ANTHROPIC_API_KEY=your-api-key-here
```

### API Key Setup

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. In TagMyPrompt, click Settings (⚙️)
6. Paste your API key
7. Click "Test Connection"

**Note**: API calls are made directly from your browser to Anthropic. Your key is stored locally and encrypted.

---

## 🧪 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest features
- 📝 Improve documentation
- 🔧 Submit pull requests
- ⭐ Star the repository

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Editor powered by [Monaco](https://microsoft.github.io/monaco-editor/)
- AI features using [Claude API](https://www.anthropic.com/)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

## 📞 Support

- 📧 [Open an Issue](https://github.com/yourusername/tagmyprompt/issues)
- 💬 [GitHub Discussions](https://github.com/yourusername/tagmyprompt/discussions)
- 📖 [Documentation](https://github.com/yourusername/tagmyprompt/blob/main/README.md)

---

## 🗺️ Roadmap

- [ ] Light mode theme
- [ ] Collaborative editing
- [ ] More AI models support
- [ ] Prompt version history
- [ ] Advanced search & filters
- [ ] Export to various formats
- [ ] Browser extension
- [ ] API for programmatic access

---

<div align="center">

**[⬆ back to top](#tagmyprompt)**

Made with ❤️ by the open source community

[Website](https://tagmyprompt.vercel.app) • [GitHub](https://github.com/yourusername/tagmyprompt) • [Issues](https://github.com/yourusername/tagmyprompt/issues)

</div>
