"use client";

import { useState, useCallback } from "react";
import { transformText, TONE_CONFIG } from "@/lib/engine";
import { ToneSelector } from "./ToneSelector";
import { ToneDescription } from "./ToneDescription";
import { InputPanel, OutputPanel } from "./EditorPanel";
import { ActionBar } from "./ActionBar";
import { LuBrainCircuit, LuShieldCheck, LuZap } from "react-icons/lu";

const EXAMPLES = {
  general: "I worked really hard on this project and I think it went really well. We tried a lot of new things and got some good results...",
  story: "I lost my job during the pandemic. I had no savings, two kids, and a mortgage. For three months I couldn't sleep...",
  advice: "The best way to improve your writing is to read more. Read different genres and styles. Pay attention to how sentences are structured...",
};

export function ToneShiftApp() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [activeTone, setActiveTone] = useState("linkedin");
  const [isLoading, setIsLoading] = useState(false);
  const [hasOutput, setHasOutput] = useState(false);

  const activeToneConfig = TONE_CONFIG.find((t) => t.key === activeTone);

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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0B0F19",
        color: "#F3F4F6",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Sleek Grid Background */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 80%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1080px",
          margin: "0 auto",
          padding: "0 20px 60px",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 0 16px",
            borderBottom: "1px solid #1F2937",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: "20px",
              letterSpacing: "-0.5px",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <LuZap size={22} color="#6366F1" fill="#6366F1" />
            <span>Tone<span style={{ color: "#6366F1" }}>Shift</span></span>
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              letterSpacing: "1px",
              padding: "6px 12px",
              border: "1px solid #374151",
              borderRadius: "6px",
              color: "#9CA3AF",
              background: "#111827",
            }}
          >
            LOCAL ENGINE
          </div>
        </header>

        <div style={{ textAlign: "center", padding: "40px 0 48px" }}>
          <h1
            style={{
              fontWeight: 800,
              fontSize: "clamp(36px, 6vw, 56px)",
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
              color: "#F9FAFB",
              margin: 0,
            }}
          >
            Adapt Your Text.<br />
            <span style={{ 
              background: "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Keep Your Privacy.</span>
          </h1>
          <p
            style={{
              marginTop: "16px",
              color: "#9CA3AF",
              fontSize: "16px",
              maxWidth: "500px",
              margin: "16px auto 0",
              lineHeight: 1.5,
            }}
          >
            Platform-native formatting & vocabulary entirely in your browser. Zero API calls.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginTop: "24px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                color: "#6B7280",
                letterSpacing: "1px",
                marginRight: "4px"
              }}
            >
              LOAD EXAMPLE:
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
                  borderRadius: "6px",
                  border: "1px solid #374151",
                  background: "#111827",
                  color: "#D1D5DB",
                  fontSize: "13px",
                  cursor: "pointer",
                  textTransform: "capitalize",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#1F2937"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#111827"}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        <ToneSelector activeTone={activeTone} onSelect={handleToneSelect} />
        <ToneDescription config={activeToneConfig} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <InputPanel value={input} onChange={setInput} onTransform={handleTransform} />
          <OutputPanel value={output} isLoading={isLoading} toneConfig={activeToneConfig} />
        </div>

        <ActionBar
          onTransform={handleTransform}
          onClear={handleClear}
          output={output}
          inputEmpty={!input.trim()}
          isLoading={isLoading}
        />

        {/* How it works */}
        <div
          style={{
            padding: "32px",
            background: "#111827",
            border: "1px solid #1F2937",
            borderRadius: "16px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 700,
              marginBottom: "24px",
              color: "#F3F4F6"
            }}
          >
            Under the Hood
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
            }}
          >
            {[
              {
                icon: <LuBrainCircuit size={28} color="#6366F1" />,
                title: "NLP Rules Engine",
                desc: "Sentence parsing, vocabulary substitution maps, and structural templates—no black box.",
              },
              {
                icon: <LuShieldCheck size={28} color="#10B981" />,
                title: "100% Private",
                desc: "Your text never leaves the browser. No API calls, no logging, no tracking.",
              },
              {
                icon: <LuZap size={28} color="#F59E0B" />,
                title: "Instant Results",
                desc: "Transformations run client-side in milliseconds. No latency, no cost.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  padding: "20px",
                  background: "#1F2937",
                  borderRadius: "12px",
                  border: "1px solid #374151",
                }}
              >
                <div style={{ marginBottom: "12px" }}>{item.icon}</div>
                <div style={{ fontWeight: 600, fontSize: "15px", marginBottom: "8px", color: "#F9FAFB" }}>
                  {item.title}
                </div>
                <div style={{ fontSize: "14px", color: "#9CA3AF", lineHeight: 1.6 }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}