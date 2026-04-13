# ToneShift — Text Tone Transformer

> Transform any text into platform-native formats instantly. No AI API. No data sent. Fully browser-side.

![ToneShift](https://text-tone-shift.vercel.app)

---

## What it does

ToneShift takes any piece of text and rewrites it to match the tone, structure, and vocabulary of a specific platform or writing style — in milliseconds, entirely in your browser.

Paste a paragraph. Pick a tone. Done.

---

## Supported Formats

**Platforms**
- LinkedIn — hooks, bullet points, hashtags, CTA
- Reddit — bold title, casual body, TL;DR, discussion prompt
- Instagram — emoji-accented lines, hashtag stack
- Twitter / X — auto-split numbered thread (≤280 chars)
- Quora — expert answer with example and structured sections
- Blog Post — headline, subheadings, intro hook, conclusion
- Gmail — greeting, body paragraphs, professional sign-off
- WhatsApp — short chunked messages with natural emoji

**Writing Styles**
- Professional, Formal, Casual, Friendly
- Confident, Empathetic, Humorous, Persuasive
- Academic, Storytelling, Gen Z, Pirate

---

## How it works

No black box. No API. Just rules.

The engine is a pure JavaScript NLP pipeline:

- **Sentence parser** — splits on `.!?` while respecting abbreviations
- **Vocabulary maps** — 200+ substitution rules per tone (formal, casual, power words, Gen Z slang, pirate vocab, etc.)
- **Contraction engine** — expands (`I'm → I am`) or collapses (`do not → don't`) depending on tone
- **Keyword extractor** — pulls top keywords using frequency analysis + a 100-word stoplist for hashtag generation
- **Structural templates** — each platform has its own output skeleton (hook, body, CTA, tags)
- **Hedge remover** — strips `I think / maybe / kind of` for the Confident tone

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js (App Router) |
| Language | JavaScript (JSX) |
| Styling | Inline styles + CSS variables |
| Fonts | Syne, DM Sans via Google Fonts |
| Deployment | Vercel (static export) |
| AI / APIs | None |

---

## Project Structure

```
toneshift/
│
├── app/
│   ├── globals.css          # Base reset, fonts, scrollbar
│   ├── layout.jsx           # Root layout
│   └── page.jsx             # Entry route
│
├── components/
│   ├── ToneShiftApp.jsx     # Root client component, all state
│   ├── ToneSelector.jsx     # Platform + style tone picker
│   ├── ToneButton.jsx       # Individual pill button
│   ├── ToneDescription.jsx  # Active tone info bar
│   ├── EditorPanel.jsx      # Input + Output panels
│   ├── ActionBar.jsx        # Transform / Copy / Clear
│   ├── CopyButton.jsx       # Clipboard copy with flash
│   └── WordCount.jsx        # Live word + char counter
│
└── lib/
    └── engine.js            # Full NLP transformation engine
```

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/yourusername/toneshift.git
cd toneshift

# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Key Features

- **20 tone formats** — 8 platforms + 12 writing styles
- **Auto-retransform** — switching tone instantly re-runs on existing text
- **Ctrl+Enter** shortcut to transform
- **One-click copy** — clipboard copy with visual flash feedback
- **Live counters** — word and character count on both panels
- **3 example texts** — load instantly to try any tone
- **100% private** — your text never leaves the browser
- **Static export** — no server, no backend, deploys anywhere

---

## Live Demo

[text-tone-shift.vercel.app](https://text-tone-shift.vercel.app)

---

## License

MIT
