// ─── TONESHIFT ENGINE ─────────────────────────────────────────────────────────
// Rule-based NLP transformation engine. No AI APIs.

export const TONE_CONFIG = [
  // Platforms
  { key: "linkedin",     label: "LinkedIn",    emoji: "💼", group: "platform", color: "#0077B5", description: "Professional post with hooks, bullets, hashtags & CTA" },
  { key: "reddit",       label: "Reddit",      emoji: "🤖", group: "platform", color: "#FF4500", description: "Community-style post with title, TL;DR & discussion prompt" },
  { key: "instagram",    label: "Instagram",   emoji: "📸", group: "platform", color: "#E1306C", description: "Caption with emoji accents and hashtag stack" },
  { key: "twitter",      label: "Twitter / X", emoji: "🐦", group: "platform", color: "#1DA1F2", description: "Auto-split numbered thread ≤280 chars per tweet" },
  { key: "quora",        label: "Quora",       emoji: "❓", group: "platform", color: "#B92B27", description: "Expert answer with structured sections & example" },
  { key: "blog",         label: "Blog Post",   emoji: "✍️", group: "platform", color: "#FF6B35", description: "SEO-style post with headline, subheadings & conclusion" },
  { key: "gmail",        label: "Gmail",       emoji: "📧", group: "platform", color: "#D44638", description: "Clean email with greeting, body paragraphs & sign-off" },
  { key: "whatsapp",     label: "WhatsApp",    emoji: "💬", group: "platform", color: "#25D366", description: "Short chunked messages with natural emoji punctuation" },
  // Styles
  { key: "professional", label: "Professional", emoji: "🏛️", group: "style", color: "#4A90D9", description: "Polished vocabulary, zero filler, business-ready" },
  { key: "formal",       label: "Formal",       emoji: "🎩", group: "style", color: "#6C5B7B", description: "Elevated register, no contractions, official tone" },
  { key: "casual",       label: "Casual",       emoji: "😊", group: "style", color: "#F7B731", description: "Relaxed, conversational, feels like chatting" },
  { key: "friendly",     label: "Friendly",     emoji: "🤝", group: "style", color: "#26de81", description: "Warm, encouraging, approachable & supportive" },
  { key: "confident",    label: "Confident",    emoji: "💪", group: "style", color: "#FC5C65", description: "No hedging, direct assertions, strong CTA" },
  { key: "empathetic",   label: "Empathetic",   emoji: "🫂", group: "style", color: "#FDA7DF", description: "Acknowledges feelings, centers the reader" },
  { key: "humorous",     label: "Humorous",     emoji: "😂", group: "style", color: "#FFC312", description: "Comic timing, self-deprecating asides, witty" },
  { key: "persuasive",   label: "Persuasive",   emoji: "🎯", group: "style", color: "#EE5A24", description: "Power words, rhetorical questions, urgency CTA" },
  { key: "academic",     label: "Academic",     emoji: "🎓", group: "style", color: "#9980FA", description: "Scholarly framing, hedged claims, citation placeholders" },
  { key: "storytelling", label: "Storytelling", emoji: "📖", group: "style", color: "#1289A7", description: "Narrative arc with scene, tension & resolution" },
  { key: "genz",         label: "Gen Z",        emoji: "✨", group: "style", color: "#D980FA", description: "No cap bestie. Slay-coded, lowercase, chaotic energy" },
  { key: "pirate",       label: "Pirate",       emoji: "🏴‍☠️", group: "style", color: "#CD6133", description: "Arr matey! Sailing-ready nautical vocabulary" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function splitSentences(text) {
  const raw = text.match(/[^.!?…]+(?:[.!?…]+(?:\s|$))?/g) ?? [text];
  return raw.map((s) => s.trim()).filter(Boolean);
}

function splitParagraphs(text) {
  return text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
}

function countWords(text) {
  return text.trim().split(/\s+/).length;
}

function makeTitle(sentence) {
  const clean = sentence.replace(/[.!?]+$/, "").trim();
  const lower = ["a","an","the","and","but","or","for","nor","on","at","to","by","in","of","up","as","so","yet"];
  return clean
    .split(" ")
    .map((w, i) => (i === 0 || !lower.includes(w.toLowerCase()))
      ? w.charAt(0).toUpperCase() + w.slice(1)
      : w.toLowerCase()
    )
    .join(" ");
}

function extractKeywords(text, count = 5) {
  const stopwords = new Set([
    "the","a","an","and","or","but","in","on","at","to","for","of","is","it","this","that",
    "was","are","be","with","as","i","you","we","they","he","she","my","our","your","their",
    "have","has","had","not","from","by","which","what","so","if","its","been","will","would",
    "could","should","can","may","might","shall","do","did","does","than","then","when","where",
    "who","how","all","each","any","one","two","more","also","about","up","out","there","here",
    "some","into","just","like","very","too","now","over","after","before","while","because",
    "though","through","between","during","since","without","under","against","within","along",
    "following","across","behind","beyond","plus","except","around","down","off","above","near",
  ]);
  const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) ?? [];
  const freq = {};
  words.forEach((w) => { if (!stopwords.has(w)) freq[w] = (freq[w] ?? 0) + 1; });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map((e) => e[0]);
}

function generateHashtags(text, extras, prefix = "#", count = 8) {
  const keywords = extractKeywords(text, 4);
  const tags = [
    ...keywords.map((k) => prefix + k.charAt(0).toUpperCase() + k.slice(1)),
    ...extras.map((t) => prefix + t),
  ];
  return [...new Set(tags)].slice(0, count).join(" ");
}

function applyMap(text, map) {
  let result = text;
  for (const [pattern, replacement] of map) {
    result = result.replace(pattern, replacement);
  }
  return result.replace(/\s{2,}/g, " ").trim();
}

// ─── VOCABULARY MAPS ──────────────────────────────────────────────────────────

const CONTRACTIONS_EXPAND = [
  [/\bI'm\b/g, "I am"], [/\bI've\b/g, "I have"], [/\bI'll\b/g, "I will"], [/\bI'd\b/g, "I would"],
  [/\byou're\b/g, "you are"], [/\byou've\b/g, "you have"], [/\byou'll\b/g, "you will"], [/\byou'd\b/g, "you would"],
  [/\bwe're\b/g, "we are"], [/\bwe've\b/g, "we have"], [/\bwe'll\b/g, "we will"], [/\bwe'd\b/g, "we would"],
  [/\bthey're\b/g, "they are"], [/\bthey've\b/g, "they have"], [/\bthey'll\b/g, "they will"], [/\bthey'd\b/g, "they would"],
  [/\bhe's\b/g, "he is"], [/\bshe's\b/g, "she is"], [/\bit's\b/g, "it is"], [/\bthat's\b/g, "that is"],
  [/\bthere's\b/g, "there is"], [/\bwhat's\b/g, "what is"], [/\bwho's\b/g, "who is"], [/\blet's\b/g, "let us"],
  [/\bcan't\b/g, "cannot"], [/\bwon't\b/g, "will not"], [/\bdon't\b/g, "do not"], [/\bdoesn't\b/g, "does not"],
  [/\bdidn't\b/g, "did not"], [/\bhadn't\b/g, "had not"], [/\bhasn't\b/g, "has not"], [/\bhaven't\b/g, "have not"],
  [/\bisn't\b/g, "is not"], [/\baren't\b/g, "are not"], [/\bwasn't\b/g, "was not"], [/\bweren't\b/g, "were not"],
  [/\bshouldn't\b/g, "should not"], [/\bwouldn't\b/g, "would not"], [/\bcouldn't\b/g, "could not"],
  [/\bmightn't\b/g, "might not"], [/\bmustn't\b/g, "must not"], [/\bneedn't\b/g, "need not"],
];

const CONTRACTIONS_COLLAPSE = [
  [/\bI am\b/g, "I'm"], [/\bI have\b/g, "I've"], [/\bI will\b/g, "I'll"], [/\bI would\b/g, "I'd"],
  [/\byou are\b/g, "you're"], [/\byou have\b/g, "you've"], [/\bwe are\b/g, "we're"],
  [/\bthey are\b/g, "they're"], [/\bthat is\b/g, "that's"], [/\bit is\b/g, "it's"],
  [/\bthere is\b/g, "there's"], [/\bdo not\b/g, "don't"], [/\bcannot\b/g, "can't"],
  [/\bwill not\b/g, "won't"], [/\bdoes not\b/g, "doesn't"], [/\bdid not\b/g, "didn't"],
  [/\bis not\b/g, "isn't"], [/\bare not\b/g, "aren't"], [/\bwas not\b/g, "wasn't"],
  [/\bwere not\b/g, "weren't"], [/\blet us\b/g, "let's"],
];

const FORMAL_VOCAB = [
  [/\bget\b/gi, "obtain"], [/\bgot\b/gi, "obtained"], [/\bgets\b/gi, "obtains"],
  [/\bshow\b/gi, "demonstrate"], [/\bshowed\b/gi, "demonstrated"], [/\bshows\b/gi, "demonstrates"],
  [/\bask\b/gi, "inquire"], [/\btell\b/gi, "inform"], [/\btold\b/gi, "informed"],
  [/\bbig\b/gi, "substantial"], [/\bsmall\b/gi, "minimal"], [/\bold\b/gi, "longstanding"],
  [/\bnew\b/gi, "recent"], [/\bsee\b/gi, "observe"], [/\bsaw\b/gi, "observed"],
  [/\bmake\b/gi, "produce"], [/\bmade\b/gi, "produced"], [/\buse\b/gi, "utilize"],
  [/\bused\b/gi, "utilized"], [/\bstart\b/gi, "initiate"], [/\bstarted\b/gi, "initiated"],
  [/\bend\b/gi, "conclude"], [/\bended\b/gi, "concluded"], [/\btry\b/gi, "endeavor"],
  [/\btried\b/gi, "endeavored"], [/\bfind\b/gi, "ascertain"], [/\bfound\b/gi, "ascertained"],
  [/\bhelp\b/gi, "assist"], [/\bhelped\b/gi, "assisted"], [/\bneed\b/gi, "require"],
  [/\bneeded\b/gi, "required"], [/\bthink\b/gi, "consider"], [/\bthought\b/gi, "considered"],
  [/\bgood\b/gi, "favorable"], [/\bbad\b/gi, "unfavorable"], [/\bvery\b/gi, "considerably"],
  [/\blots of\b/gi, "numerous"], [/\ba lot of\b/gi, "a substantial number of"],
  [/\bpeople\b/gi, "individuals"], [/\bstuff\b/gi, "matters"], [/\bthings\b/gi, "aspects"],
];

const CASUAL_VOCAB = [
  [/\butilize\b/gi, "use"], [/\bdemonstrate\b/gi, "show"], [/\bassist\b/gi, "help"],
  [/\brequire\b/gi, "need"], [/\binitiate\b/gi, "kick off"], [/\bconclude\b/gi, "wrap up"],
  [/\bobtain\b/gi, "get"], [/\bpurchase\b/gi, "buy"], [/\bindividuals\b/gi, "people"],
  [/\bsubsequently\b/gi, "then"], [/\bnevertheless\b/gi, "but still"],
  [/\bhowever\b/gi, "but"], [/\btherefore\b/gi, "so"], [/\bthus\b/gi, "so"],
  [/\bfurthermore\b/gi, "also"], [/\bmoreover\b/gi, "plus"],
  [/\bconsequently\b/gi, "as a result"], [/\bperhaps\b/gi, "maybe"],
  [/\bascertain\b/gi, "find out"], [/\bcommence\b/gi, "start"],
];

const HEDGE_REMOVALS = [
  [/\bI think that\b/gi, ""], [/\bI think\b/gi, ""],
  [/\bI believe that\b/gi, ""], [/\bI believe\b/gi, ""],
  [/\bI feel like\b/gi, ""], [/\bI feel\b/gi, ""],
  [/\bperhaps\b/gi, ""], [/\bmaybe\b/gi, ""],
  [/\bpossibly\b/gi, ""], [/\bprobably\b/gi, ""],
  [/\bsort of\b/gi, ""], [/\bkind of\b/gi, ""],
  [/\ba bit\b/gi, ""], [/\ba little\b/gi, ""],
  [/\bsomewhat\b/gi, ""], [/\bseems to\b/gi, ""],
  [/\bseems like\b/gi, ""], [/\bappears to be\b/gi, ""],
  [/\bmight be\b/gi, "is"], [/\bcould be\b/gi, "is"],
  [/\bif that makes sense\b/gi, ""],
  [/\bI guess\b/gi, ""], [/\bI suppose\b/gi, ""],
];

const POWER_WORDS = [
  [/\bgood\b/gi, "exceptional"], [/\bgreat\b/gi, "remarkable"],
  [/\bimportant\b/gi, "critical"], [/\bchange\b/gi, "transform"],
  [/\bhelp\b/gi, "empower"], [/\buse\b/gi, "leverage"],
  [/\bstart\b/gi, "ignite"], [/\bshow\b/gi, "reveal"],
  [/\blearn\b/gi, "master"], [/\bwork\b/gi, "execute"],
  [/\bget\b/gi, "achieve"], [/\bnew\b/gi, "breakthrough"],
  [/\bfast\b/gi, "lightning-fast"], [/\bbetter\b/gi, "far superior"],
  [/\bsimple\b/gi, "effortless"], [/\bmore\b/gi, "exponentially more"],
];

const ACADEMIC_VOCAB = [
  [/\bshows\b/gi, "demonstrates"], [/\bproves\b/gi, "provides evidence that"],
  [/\bsays\b/gi, "posits"], [/\bthinks\b/gi, "theorizes"],
  [/\bimportant\b/gi, "significant"], [/\bbig\b/gi, "substantial"],
  [/\bsmall\b/gi, "negligible"], [/\bgood\b/gi, "favorable"],
  [/\bbad\b/gi, "adverse"], [/\bchange\b/gi, "transformation"],
  [/\buse\b/gi, "utilization"], [/\bstart\b/gi, "inception"],
  [/\bsee\b/gi, "observe"], [/\bmake\b/gi, "produce"],
  [/\bconnect\b/gi, "correlate"], [/\bfind\b/gi, "ascertain"],
  [/\btherefore\b/gi, "consequently"], [/\bbecause\b/gi, "due to the fact that"],
  [/\balso\b/gi, "furthermore"], [/\bbut\b/gi, "however"], [/\bso\b/gi, "thus"],
];

const GENZ_VOCAB = [
  [/\bgood\b/gi, "slay"], [/\bgreat\b/gi, "ate"], [/\bamazing\b/gi, "absolutely ate no crumbs"],
  [/\bbad\b/gi, "mid"], [/\bterrible\b/gi, "lowkey a disaster"],
  [/\bvery\b/gi, "so"], [/\breally\b/gi, "literally"],
  [/\bimportant\b/gi, "it's giving main character energy"],
  [/\bunderstand\b/gi, "vibe with"], [/\bpeople\b/gi, "bestiesss"],
  [/\bwork\b/gi, "the grind"], [/\bthink\b/gi, "feel like"],
  [/\bcool\b/gi, "fire 🔥"], [/\btrue\b/gi, "no cap"],
  [/\blove\b/gi, "am obsessed with"], [/\byes\b/gi, "periodt"],
  [/\bno\b/gi, "not it"], [/\bhappy\b/gi, "we're living for it"],
  [/\bsad\b/gi, "sending me"], [/\bfunny\b/gi, "giving me life 💀"],
  [/\bold\b/gi, "that's so cheugy"], [/\bnew\b/gi, "era"],
  [/\bbeautiful\b/gi, "serving looks"],
];

const PIRATE_VOCAB = [
  [/\bI am\b/gi, "I be"], [/\bI'm\b/gi, "I be"], [/\byou are\b/gi, "ye be"],
  [/\byou're\b/gi, "ye be"], [/\bmy\b/gi, "me"], [/\byour\b/gi, "yer"],
  [/\bthe\b/gi, "th'"], [/\byes\b/gi, "aye"], [/\byeah\b/gi, "aye"],
  [/\bno\b/gi, "nay"], [/\bnot\b/gi, "nay"], [/\bfriend\b/gi, "matey"],
  [/\bfriends\b/gi, "me crew"], [/\bpeople\b/gi, "landlubbers"],
  [/\bman\b/gi, "scallywag"], [/\bwoman\b/gi, "lass"],
  [/\bgo\b/gi, "set sail"], [/\bfind\b/gi, "plunder"],
  [/\bgood\b/gi, "worthy as gold doubloons"], [/\bbad\b/gi, "cursed"],
  [/\bvery\b/gi, "mightily"], [/\bgreat\b/gi, "grand"],
  [/\bcompany\b/gi, "vessel"], [/\bwork\b/gi, "swab the deck"],
  [/\bmoney\b/gi, "treasure"], [/\bhello\b/gi, "Ahoy"], [/\bhi\b/gi, "Ahoy"],
  [/\bbye\b/gi, "fair winds"], [/\bhouse\b/gi, "ship"],
  [/\bsee\b/gi, "spy with me eye"], [/\bunderstand\b/gi, "reckon"],
  [/\bknow\b/gi, "know from the depths"], [/\bbelieve\b/gi, "reckon"],
  [/\bthink\b/gi, "ponder on the high seas"], [/\bsay\b/gi, "holler"],
  [/\btell\b/gi, "speak"], [/\bget\b/gi, "plunder"], [/\bhave\b/gi, "possess"],
];

// ─── PLATFORM TRANSFORMERS ────────────────────────────────────────────────────

function transformLinkedIn(text) {
  const paragraphs = splitParagraphs(text);
  const sentences = splitSentences(text);
  const wc = countWords(text);

  const hooks = [
    "I used to believe the opposite of this. Here's what changed my mind:",
    "Most people get this completely wrong.",
    "Nobody told me this early in my career — and it cost me years.",
    "This took me a long time to figure out. I'm sharing it so you don't have to:",
    "3 years ago, I would have ignored this advice.",
    "The most underrated insight I've ever come across:",
    "Something shifted for me recently, and I had to share it.",
    "I made a mistake. Then I learned something I'll never forget:",
    "Here's what they don't teach you in school:",
    "This is the thing high performers do differently:",
  ];

  const hook = pick(hooks);

  let body;
  if (wc < 40) {
    body = sentences.map((s) => s.trim()).join("\n\n");
  } else {
    body = paragraphs
      .map((para) => {
        const sents = splitSentences(para);
        if (sents.length <= 2) return sents.join(" ");
        const bullets = sents.slice(1).map((s) => `→ ${s.trim()}`).join("\n");
        return `${sents[0].trim()}\n\n${bullets}`;
      })
      .join("\n\n");
  }

  const domainTags = ["Leadership","Growth","Career","Mindset","Success","Innovation","Business","Productivity","Learning","Strategy"];
  const hashtags = generateHashtags(text, domainTags.slice(0, 5), "#", 8);

  const ctas = [
    "What's your take? I'd love to hear in the comments 👇",
    "Drop a 🔥 if this resonated. And share it with someone who needs to hear this.",
    "What would you add? Let's discuss below.",
    "Tag someone who needs to see this today. 👇",
    "Agree or disagree? Let me know your thoughts.",
    "What's been your experience? Comment below.",
  ];

  const keyTakeaway = sentences[sentences.length - 1]?.trim() ?? "";

  return `${hook}\n\n${body}\n\n💡 Key takeaway: ${keyTakeaway}\n\n${pick(ctas)}\n\n${hashtags}`;
}

function transformReddit(text) {
  const sentences = splitSentences(text);
  const title = makeTitle(sentences[0] ?? text.slice(0, 80));
  let body = applyMap(text, CONTRACTIONS_COLLAPSE);

  body = body
    .replace(/\bvery\b/gi, "really")
    .replace(/\bexcellent\b/gi, "solid")
    .replace(/\bhowever\b/gi, "but tbh")
    .replace(/\btherefore\b/gi, "so basically")
    .replace(/\badditionally\b/gi, "also")
    .replace(/\bfurthermore\b/gi, "and also");

  const openers = [
    "So I've been thinking about this a lot lately and had to post.",
    "Okay genuine question for this subreddit:",
    "Not gonna lie, this hit different when I realized it.",
    "Long post but I think it's worth it — hear me out.",
    "Hot take incoming (and yes I'll die on this hill):",
    "I don't see this talked about enough here.",
  ];

  const tldr =
    sentences.length > 3
      ? `\n\n---\n**TL;DR:** ${sentences[0].trim()} ${sentences[sentences.length - 1].trim()}`
      : "";

  const closers = [
    "\n\nAnyone else feel this way? Legit curious what this sub thinks.",
    "\n\nEdit: wow this blew up, thanks for the awards and discussion everyone.",
    "\n\nHappy to discuss in comments. Please be civil lol.",
    "\n\nDrop your thoughts below. Upvote if you agree, downvote if you don't.",
  ];

  return `**${title}**\n\n${pick(openers)}\n\n${body}${tldr}${pick(closers)}`;
}

function transformInstagram(text) {
  const sentences = splitSentences(text);
  const emojiSets = [
    ["✨","💫","🌙","🌿","💛","🤍","🌸","🙌"],
    ["🔥","💪","👊","⚡","🎯","💯","🚀","🌟"],
    ["🫶","💭","🧠","🌊","🎨","🍃","💎","🌅"],
  ];
  const set = pick(emojiSets);
  const lines = sentences.map((s, i) => `${s.trim()} ${set[i % set.length]}`);
  const formatted = lines.join("\n.\n");
  const domainTags = ["inspo","motivation","mindset","lifestyle","aesthetic","quotes","growth","selfcare","daily","vibes"];
  const hashtags = generateHashtags(text, domainTags.slice(0, 6), "#", 10);
  const ctaOptions = [
    "💬 Tell me in the comments — does this resonate?",
    "💾 Save this for when you need it.",
    "👇 Tag someone who needs to see this today.",
    "❤️ Double tap if you agree.",
  ];
  return `${formatted}\n\n${pick(ctaOptions)}\n\n.\n.\n.\n${hashtags}`;
}

function transformTwitter(text) {
  const sentences = splitSentences(text);
  const tweets = [];
  let current = "";

  for (const s of sentences) {
    const candidate = current ? `${current} ${s.trim()}` : s.trim();
    if (candidate.length <= 260) {
      current = candidate;
    } else {
      if (current) tweets.push(current);
      current = s.trim().slice(0, 260);
    }
  }
  if (current) tweets.push(current);

  const total = tweets.length + 1;
  const thread = tweets.map((tw, i) => `${i + 1}/${total} ${tw}`);
  const hooks = ["🧵 A thread:", "🧵 Thread. Worth the read:", "🧵 Let me explain:", "🧵 Read this."];
  thread.unshift(pick(hooks));
  thread.push(`${total}/${total} That's the thread. RT if this was useful 🙏\n\nFollow for more like this →`);

  return thread.join("\n\n");
}

function transformQuora(text) {
  const sentences = splitSentences(text);
  const paragraphs = splitParagraphs(text);

  const intros = [
    "Great question — and one that most people overlook.",
    "This is something I've thought about deeply, so let me break it down.",
    "Having spent considerable time on this subject, here is what I know.",
    "I can answer this from both research and personal experience.",
    "Let me give you a thorough answer because this deserves more than a one-liner.",
  ];

  const body = paragraphs.map((p) => p.trim()).join("\n\n");
  const example = `**A practical example:** Consider a real-world scenario where ${sentences[0]?.toLowerCase().replace(/\.$/, "")}. In practice, the implications are significant — the choices made at this stage directly determine long-term outcomes.`;

  const summaries = [
    `**The bottom line:** ${sentences[sentences.length - 1]?.trim() ?? ""}`,
    `**In summary:** ${sentences[sentences.length - 1]?.trim() ?? ""}`,
    `**Key insight:** ${sentences[sentences.length - 1]?.trim() ?? ""}`,
  ];

  const closers = [
    "\nHope this helps! Feel free to follow up in the comments.",
    "\nIf you found this useful, please upvote — it helps others find this answer.",
    "\nHappy to go deeper on any of these points.",
  ];

  return `${pick(intros)}\n\n${body}\n\n${example}\n\n${pick(summaries)}${pick(closers)}`;
}

function transformBlog(text) {
  const sentences = splitSentences(text);
  const paragraphs = splitParagraphs(text);
  const title = `# ${makeTitle(sentences[0] ?? "Untitled")}`;

  const subSets = [
    ["Why This Matters","Breaking It Down","The Key Insight","What This Means for You","The Practical Side"],
    ["Understanding the Basics","The Real Picture","Unpacking the Details","Real-World Impact","The Takeaway"],
  ];
  const subSet = pick(subSets);

  const introLines = [
    "*Here's something most people don't think about — but probably should.*",
    "*This might be one of the most overlooked ideas in the space.*",
    "*You've probably come across this before, but not quite like this.*",
    "*Before we dive in, here's why this matters more than you think.*",
  ];

  const intro = `${pick(introLines)}\n\n${paragraphs[0] ?? sentences.slice(0, 2).join(" ")}`;

  let bodyIdx = 0;
  const body = paragraphs
    .slice(1)
    .map((para) => {
      const sub = subSet[bodyIdx % subSet.length];
      bodyIdx++;
      return `## ${sub}\n\n${para}`;
    })
    .join("\n\n");

  const conclusion = `## Final Thoughts\n\n${sentences[sentences.length - 1]?.trim() ?? ""}\n\nThe next step is entirely yours to take — and it starts with a single decision.\n\n*Found this valuable? Share it with someone who needs to read this today.*`;

  return `${title}\n\n${intro}\n\n${body || `## Why It Matters\n\n${text}`}\n\n---\n\n${conclusion}`;
}

function transformGmail(text) {
  const paragraphs = splitParagraphs(text);
  const sentences = splitSentences(text);

  const greetings = ["Hi,", "Hello,", "Hi there,", "Dear Reader,"];
  const openers = [
    "I hope this message finds you well.",
    "I wanted to reach out regarding the following.",
    "I'm writing to share something I think is worth your attention.",
    "Thank you for taking the time to read this.",
    "Following up as discussed, here are my thoughts.",
  ];
  const preclose = [
    "Please feel free to reach out if you have any questions or need clarification.",
    "I look forward to hearing your thoughts on this.",
    "Do let me know if you'd like to discuss further.",
    "I'm happy to jump on a call to talk through any of this in more detail.",
  ];
  const signoffs = ["Best regards,", "Kind regards,", "Warm regards,", "Thanks,", "All the best,"];

  const body =
    paragraphs.length > 1
      ? paragraphs.map((p) => p.trim()).join("\n\n")
      : sentences.map((s) => s.trim()).join("\n\n");

  return `${pick(greetings)}\n\n${pick(openers)}\n\n${body}\n\n${pick(preclose)}\n\n${pick(signoffs)}\n[Your Name]`;
}

function transformWhatsApp(text) {
  let result = applyMap(text, CONTRACTIONS_COLLAPSE);
  result = applyMap(result, CASUAL_VOCAB);

  const sentences = splitSentences(result);
  const emojis = ["😊","👍","🙌","💯","🔥","✅","👀","😄","💬","👋","🤙","😂","🥲","💀","✨","🫶","❤️","🤝","👏","😍"];

  const chunks = [];
  let current = "";
  for (const s of sentences) {
    if ((current + " " + s).length < 100) {
      current = (current + " " + s).trim();
    } else {
      if (current) chunks.push(current);
      current = s.trim();
    }
  }
  if (current) chunks.push(current);

  return chunks.map((c, i) => `${c} ${emojis[i % emojis.length]}`).join("\n\n");
}

// ─── STYLE TRANSFORMERS ───────────────────────────────────────────────────────

function transformProfessional(text) {
  let result = applyMap(text, CONTRACTIONS_EXPAND);
  result = applyMap(result, FORMAL_VOCAB);
  result = result
    .replace(/\bbasically\b/gi, "")
    .replace(/\bliterally\b/gi, "")
    .replace(/\bactually\b/gi, "")
    .replace(/\bjust\b/gi, "")
    .replace(/\breally\b/gi, "")
    .replace(/\bI mean\b/gi, "")
    .replace(/\byou know\b/gi, "")
    .replace(/\blike,\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  return result;
}

function transformFormal(text) {
  let result = applyMap(text, CONTRACTIONS_EXPAND);
  result = applyMap(result, FORMAL_VOCAB);
  result = result
    .replace(/\bin addition\b/gi, "Furthermore")
    .replace(/\balso\b/gi, "Additionally")
    .replace(/\bbut\b/gi, "However")
    .replace(/\bso\b/gi, "Therefore")
    .replace(/\btherefore\b/gi, "Consequently")
    .replace(/\s{2,}/g, " ")
    .trim();
  return `It is with due consideration that the following is hereby communicated:\n\n${result}`;
}

function transformCasual(text) {
  let result = applyMap(text, CONTRACTIONS_COLLAPSE);
  result = applyMap(result, CASUAL_VOCAB);
  const openers = ["Hey, so—", "Okay so,", "Just so you know,", "Quick thing—", "Heads up:", "Real talk —"];
  const closers = ["Pretty straightforward, right?", "Hope that makes sense!", "Let me know what you think!", "Sound good?", "Easy peasy.", "That's basically it!"];
  return `${pick(openers)} ${result} ${pick(closers)}`;
}

function transformFriendly(text) {
  let result = applyMap(text, CONTRACTIONS_COLLAPSE);
  result = applyMap(result, CASUAL_VOCAB);
  const openers = [
    "Hey! 😊", "Hi there! 👋", "Hey, great news —",
    "Something I really wanted to share with you:",
    "Hope you're having an amazing day! Here's something worth knowing:",
  ];
  const midInserts = [
    "Honestly, this is pretty cool.", "And here's the fun part:",
    "You're going to love this:", "I think you'll appreciate this:",
  ];
  const closers = [
    "Hope that helps! 🌟", "Let me know if you have questions — happy to help!",
    "You've got this! 💪", "Take care! 😊", "Rooting for you! 🙌",
  ];
  const sentences = splitSentences(result);
  const mid = sentences.length > 3 ? pick(midInserts) + " " : "";
  const body =
    sentences.slice(0, 2).join(" ") +
    (sentences.length > 2 ? `\n\n${mid}${sentences.slice(2).join(" ")}` : "");
  return `${pick(openers)}\n\n${body}\n\n${pick(closers)}`;
}

function transformConfident(text) {
  let result = applyMap(text, HEDGE_REMOVALS);
  result = result.replace(/\s{2,}/g, " ").trim();
  result = result.charAt(0).toUpperCase() + result.slice(1);
  const closers = [
    "\n\nThis is not a suggestion. This is the standard.",
    "\n\nThere's no debate here. This is how it works.",
    "\n\nDon't wait for permission. Move now.",
    "\n\nThe time for half-measures is over. Commit fully.",
    "\n\nEither you do this or you don't. Make the call.",
  ];
  return result + pick(closers);
}

function transformEmpathetic(text) {
  let result = applyMap(text, CONTRACTIONS_COLLAPSE);
  const openers = [
    "I completely understand where you're coming from.",
    "I hear you, and what you're feeling is entirely valid.",
    "This is something that truly matters — thank you for sharing it.",
    "First, I want you to know: you're not alone in this.",
    "I appreciate you opening up about this. It takes courage.",
  ];
  const bridges = [
    "It's completely normal to feel this way.",
    "Your experience deserves to be heard and respected.",
    "Many people go through exactly this — and it's okay.",
    "There's no right or wrong way to feel about this.",
  ];
  const closers = [
    "Please know that support is always available.",
    "Take all the time you need — there's no rush.",
    "I'm here whenever you need to talk through it.",
    "You deserve kindness — especially from yourself.",
    "Whatever you decide, know that you're doing the best you can.",
  ];
  return `${pick(openers)}\n\n${result}\n\n${pick(bridges)} ${pick(closers)}`;
}

function transformHumorous(text) {
  const sentences = splitSentences(text);
  const asides = [
    " (no pressure though, totally fine, everything is fine)",
    " (narrator: it was not, in fact, fine)",
    " (and yes, I said what I said)",
    " (said no one ever, until now)",
    " (we don't talk about that part)",
    " …allegedly",
    " (this is completely normal behavior)",
    " (insert surprised Pikachu face)",
  ];
  const openers = [
    "Buckle up. 🎢",
    "No one asked for this, but here we are. 🙃",
    "Grab a snack, this is a journey. 🍿",
    "*clears throat dramatically*",
    "Breaking: local person has Thoughts™.",
    "Hot take. Possibly cold take. Room temperature take, at best.",
  ];
  const insertIdx = Math.floor(sentences.length / 2);
  const modified = sentences.map((s, i) =>
    i === insertIdx ? s.trim() + pick(asides) : s.trim()
  );
  if (sentences.length > 4) {
    modified[sentences.length - 2] = modified[sentences.length - 2] + pick(asides);
  }
  const closers = [
    "\n\nAnyway. Please clap. 👏",
    "\n\nThis has been my TED talk. Goodnight. 🎤⬇️",
    "\n\nI'm accepting awards and criticism equally. Mostly criticism.",
    "\n\nIn conclusion: yes. Thank you for coming to my TED talk.",
  ];
  return `${pick(openers)}\n\n${modified.join(" ")}${pick(closers)}`;
}

function transformPersuasive(text) {
  let result = applyMap(text, POWER_WORDS);
  const sentences = splitSentences(result);
  const rhetorical = [
    "What if everything you thought you knew about this was wrong?",
    "Have you ever wondered why most people never achieve this?",
    "What separates those who succeed from those who don't?",
    "Can you afford to ignore this any longer?",
    "What would change if you fully committed to this today?",
  ];
  const urgency = [
    "\n\n⚠️ **The time to act is now.** Every day you wait is a compounding cost you'll never recover.",
    "\n\n🎯 **This window doesn't stay open forever.** The people who succeed are the ones who moved first.",
    "\n\n🔥 **Most people will read this and do nothing.** Don't be most people.",
    "\n\n⚡ **Action beats perfection every single time.** The first step is yours to take.",
  ];
  const ctas = [
    "\n\n→ **Take the first step. You won't regret it.**",
    "\n\n→ **Decide now. Future you will thank you.**",
    "\n\n→ **Start today. Not Monday. Today.**",
    "\n\n→ **The only question is: are you ready?**",
  ];
  return `${pick(rhetorical)}\n\n${result}${pick(urgency)}${pick(ctas)}`;
}

function transformAcademic(text) {
  let result = applyMap(text, CONTRACTIONS_EXPAND);
  result = applyMap(result, ACADEMIC_VOCAB);
  const keywords = extractKeywords(text, 3);
  const keywordStr = keywords.slice(0, 2).join(", ");
  return `**Abstract**\n\nThe following analysis examines the relationship between ${keywordStr || "the aforementioned concepts"} and their broader implications.\n\n**1. Introduction**\n\n${result}\n\n**2. Discussion**\n\nThis observation is consistent with prior literature on the matter (cf. Author, Year; Secondary Author, Year). The evidence presented herein suggests a multifaceted relationship between the variables under consideration. However, it would be premature to draw definitive conclusions without further empirical investigation.\n\n**3. Implications**\n\nThe findings carry significant implications for both theoretical frameworks and practical applications within the field.\n\n**4. Conclusion**\n\nIn summation, the evidence presented herein indicates that this topic warrants continued scholarly attention. Future studies should endeavor to address the limitations outlined above through more rigorous methodological approaches.\n\n**References**\n\n[Available upon request]`;
}

function transformStorytelling(text) {
  const sentences = splitSentences(text);
  const paragraphs = splitParagraphs(text);
  const sceneSetters = [
    "It started on an ordinary day — the kind you don't expect to remember.",
    "Nobody saw it coming. But looking back, the signs were always there.",
    "There are moments that split your life into before and after. This was one of them.",
    "The story begins, as most important stories do, with something small.",
  ];
  const transitions = [
    "But then — everything shifted.",
    "And that's when it hit like a freight train:",
    "What happened next changed the entire picture.",
    "Here's the part nobody ever talks about:",
  ];
  const resolutions = [
    "And that, in the end, made all the difference.",
    "It's a lesson that stays with you. The kind you carry.",
    "Some things you only truly understand by living through them.",
    "In the end, it wasn't what happened — it was what it meant.",
  ];
  const middle =
    paragraphs.length > 1
      ? paragraphs.slice(0, -1).join("\n\n")
      : sentences.slice(0, Math.ceil(sentences.length / 2)).join(" ");
  const closing = paragraphs[paragraphs.length - 1] || sentences[sentences.length - 1] || "";
  return `${pick(sceneSetters)}\n\n${middle}\n\n${pick(transitions)}\n\n${closing}\n\n*${pick(resolutions)}*`;
}

function transformGenZ(text) {
  let result = text.toLowerCase();
  result = applyMap(result, GENZ_VOCAB);
  result = applyMap(result, CONTRACTIONS_COLLAPSE);
  const openers = [
    "okay so,", "bestie,", "not me just realizing but,",
    "it's giving main character energy and,", "POV: you just understood that",
    "no but actually,", "the way this just hits different:",
  ];
  const closers = [
    "no cap 💅", "fr fr ✨", "bestie understood the assignment 🫶",
    "it's giving everything 💅🔥", "periodt 🙌",
    "we are NOT the same if you don't get this", "main character behavior only ✨", "slay 👑",
  ];
  const midInsert = pick([
    "and honestly? we love to see it 💅",
    "which like, obviously 🫡",
    "the math is mathing fr",
    "and that's on periodt",
  ]);
  const sentences = splitSentences(result);
  const midIdx = Math.floor(sentences.length / 2);
  if (sentences.length > 2) sentences.splice(midIdx, 0, midInsert);
  return `${pick(openers)} ${sentences.join(" ")} ${pick(closers)}`;
}

function transformPirate(text) {
  let result = applyMap(text, CONTRACTIONS_EXPAND);
  result = applyMap(result, PIRATE_VOCAB);
  const intros = [
    "Arr, gather 'round ye scallywags and heed these words!",
    "Ahoy! Lend me yer ears, ye barnacle-covered landlubbers!",
    "Shiver me timbers, I have a tale worth tellin'!",
    "By Davy Jones' locker, listen well to what I say!",
  ];
  const outros = [
    "Yo-ho-ho! Now weigh anchor and heed these words, or Davy Jones' locker awaits ye! ☠️",
    "And that be the honest truth, or me name isn't Captain of these here seas! 🏴‍☠️",
    "Now swab the deck and get to work! Fair winds and following seas to ye all! ⚓",
  ];
  return `${pick(intros)}\n\n${result}\n\n${pick(outros)}`;
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

export function transformText(text, tone) {
  const t = text.trim();
  if (!t) return "";
  switch (tone) {
    case "linkedin":      return transformLinkedIn(t);
    case "reddit":        return transformReddit(t);
    case "instagram":     return transformInstagram(t);
    case "twitter":       return transformTwitter(t);
    case "quora":         return transformQuora(t);
    case "blog":          return transformBlog(t);
    case "gmail":         return transformGmail(t);
    case "whatsapp":      return transformWhatsApp(t);
    case "professional":  return transformProfessional(t);
    case "formal":        return transformFormal(t);
    case "casual":        return transformCasual(t);
    case "friendly":      return transformFriendly(t);
    case "confident":     return transformConfident(t);
    case "empathetic":    return transformEmpathetic(t);
    case "humorous":      return transformHumorous(t);
    case "persuasive":    return transformPersuasive(t);
    case "academic":      return transformAcademic(t);
    case "storytelling":  return transformStorytelling(t);
    case "genz":          return transformGenZ(t);
    case "pirate":        return transformPirate(t);
    default:              return t;
  }
}
