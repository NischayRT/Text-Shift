"use client";

import { useState, useCallback } from "react";
import { transformText, TONE_CONFIG } from "@/lib/engine";
import { ToneSelector } from "./ToneSelector";
import { ToneDescription } from "./ToneDescription";
import { InputPanel, OutputPanel } from "./EditorPanel";
import { ActionBar } from "./ActionBar";

// Quick-load example texts
const EXAMPLES = {
  general:
    "I worked really hard on this project and I think it went really well. We tried a lot of new things and got some good results. It was tough sometimes but we figured it out in the end. I want to keep working on stuff like this because I feel like I'm getting better.",
  story:
    "I lost my job during the pandemic. I had no savings, two kids, and a mortgage. For three months I couldn't sleep. Then I decided to start something of my own. It was the hardest and best decision I ever made.",
  advice:
    "The best way to improve your writing is to read more. Read different genres and styles. Pay attention to how sentences are structured. Write every day, even if it's just a few sentences. Over time the improvement is undeniable.",
};

export function ToneShiftApp() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [activeTone, setActiveTone] = useState("linkedin");
  const [isLoading, setIsLoading] = useState(false);
  const [hasOutput, setHasOutput] = useState(false);

  const activeToneConfig = TONE_CONFIG.find((t) => t.key === activeTone);

  // Run transform
  const handleTransform = useCallback(() => {
    if (!input.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      const result = transformText(input, activeTone);
      setOutput(result);
      setHasOutput(true);
      setIsLoading(false);
    }, 80);
  }, [input, activeTone]);

  // Select tone — auto re-transform if output exists
  const handleToneSelect = (key) => {
    setActiveTone(key);
    if (input.trim() && hasOutput) {
      setIsLoading(true);
      setTimeout(() => {
        setOutput(transformText(input, key));
        setIsLoading(false);
      }, 80);
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setHasOutput(false);
  };

  const handleInputChange = (val) => {
    setInput(val);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#07070d",
        color: "#eeeef8",
        fontFamily:
          "'DM Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Ambient glow blobs */}
      <div
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
      >
        <div style={{ position: "absolute", top: "5%", left: "8%", width: 500, height: 500, background: "radial-gradient(circle, rgba(124,110,240,0.10) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "8%", right: "5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(232,108,187,0.08) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", width: 300, height: 300, background: "radial-gradient(circle, rgba(78,205,196,0.06) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(40px)", transform: "translate(-50%,-50%)" }} />
      </div>

      {/* Main content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1080px",
          margin: "0 auto",
          padding: "0 20px 60px",
        }}
      >
        {/* ── HEADER ── */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 0 16px",
            borderBottom: "1px solid #252540",
            marginBottom: "4px",
          }}
        >
          <div
            style={{
              fontFamily: "'Syne', 'DM Sans', sans-serif",
              fontWeight: 800,
              fontSize: "22px",
              letterSpacing: "-0.5px",
            }}
          >
            Tone<span style={{ color: "#7c6ef0" }}>Shift</span>
            <span style={{ color: "#e86cbb" }}>.</span>
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "11px",
              letterSpacing: "1.5px",
              padding: "4px 12px",
              border: "1px solid #2e2e50",
              borderRadius: "99px",
              color: "#606090",
              background: "#0f0f1a",
            }}
          >
            NO AI API · RULE-BASED
          </div>
        </header>

        {/* ── HERO ── */}
        <div style={{ textAlign: "center", padding: "44px 0 36px" }}>
          <h1
            style={{
              fontFamily: "'Syne', 'DM Sans', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(34px, 6.5vw, 60px)",
              lineHeight: 1.08,
              letterSpacing: "-2px",
              background: "linear-gradient(135deg, #eeeef8 0%, #a0a0d8 45%, #e86cbb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: 0,
            }}
          >
            Transform Any Text
            <br />
            To Any Tone
          </h1>
          <p
            style={{
              marginTop: "14px",
              color: "#606090",
              fontSize: "16px",
              fontWeight: 300,
              letterSpacing: "0.2px",
            }}
          >
            Platform-native formatting & vocabulary — zero API calls, fully browser-side.
          </p>

          {/* Example loaders */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginTop: "18px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: "#606090",
                letterSpacing: "1px",
              }}
            >
              TRY:
            </span>
            {Object.keys(EXAMPLES).map((key) => (
              <button
                key={key}
                onClick={() => {
                  setInput(EXAMPLES[key]);
                  setOutput("");
                  setHasOutput(false);
                }}
                style={{
                  padding: "6px 14px",
                  borderRadius: "99px",
                  border: "1px solid #252540",
                  background: "#0f0f1a",
                  color: "#606090",
                  fontSize: "12px",
                  cursor: "pointer",
                  textTransform: "capitalize",
                  transition: "all 0.18s",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#eeeef8";
                  e.currentTarget.style.borderColor = "#2e2e50";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#606090";
                  e.currentTarget.style.borderColor = "#252540";
                }}
              >
                {key} text
              </button>
            ))}
          </div>
        </div>

        {/* ── TONE SELECTOR ── */}
        <ToneSelector activeTone={activeTone} onSelect={handleToneSelect} />

        {/* ── ACTIVE TONE DESCRIPTION ── */}
        <ToneDescription config={activeToneConfig} />

        {/* ── EDITOR ROW ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <InputPanel
            value={input}
            onChange={handleInputChange}
            onTransform={handleTransform}
          />
          <OutputPanel
            value={output}
            isLoading={isLoading}
            toneConfig={activeToneConfig}
          />
        </div>

        {/* ── ACTIONS ── */}
        <ActionBar
          onTransform={handleTransform}
          onClear={handleClear}
          output={output}
          inputEmpty={!input.trim()}
          isLoading={isLoading}
        />

        {/* ── HOW IT WORKS ── */}
        <div
          style={{
            padding: "24px",
            background: "#0f0f1a",
            border: "1px solid #252540",
            borderRadius: "20px",
          }}
        >
          <h2
            style={{
              fontFamily: "'Syne', 'DM Sans', sans-serif",
              fontSize: "18px",
              fontWeight: 700,
              marginBottom: "16px",
              letterSpacing: "-0.5px",
            }}
          >
            How it works
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
            }}
          >
            {[
              {
                icon: "🧠",
                title: "NLP Rules Engine",
                desc: "Sentence parsing, vocabulary substitution maps, and structural templates — no black box, no API.",
              },
              {
                icon: "🔒",
                title: "100% Private",
                desc: "Your text never leaves the browser. No API calls, no logging, no tracking whatsoever.",
              },
              {
                icon: "⚡",
                title: "Instant Results",
                desc: "Transformations run client-side in milliseconds. No latency, no quota, no cost.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  padding: "16px",
                  background: "#151525",
                  borderRadius: "10px",
                  border: "1px solid #252540",
                }}
              >
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>{item.icon}</div>
                <div style={{ fontWeight: 600, fontSize: "14px", marginBottom: "5px" }}>
                  {item.title}
                </div>
                <div style={{ fontSize: "13px", color: "#606090", lineHeight: 1.6 }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: "1px solid #252540",
          padding: "20px",
          textAlign: "center",
          fontFamily: "monospace",
          fontSize: "11px",
          color: "#606090",
          position: "relative",
          zIndex: 1,
        }}
      >
        ToneShift · 100% browser-based · No data sent anywhere · Built with Next.js
      </footer>
    </div>
  );
}
