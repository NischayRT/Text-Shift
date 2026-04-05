"use client";

import { WordCount } from "./WordCount";
import { CopyButton } from "./CopyButton";

const panelStyle = {
  background: "#0f0f1a",
  border: "1px solid #252540",
  borderRadius: "14px",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 14px",
  borderBottom: "1px solid #252540",
  background: "#151525",
};

const headerLabel = {
  fontFamily: "monospace",
  fontSize: "11px",
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  color: "#606090",
};

export function InputPanel({ value, onChange, onTransform }) {
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      onTransform();
    }
  };

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        <span style={headerLabel}>Input Text</span>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <WordCount text={value} />
          {value && (
            <button
              onClick={() => onChange("")}
              style={{
                background: "none",
                border: "none",
                fontSize: "12px",
                color: "#606090",
                cursor: "pointer",
                padding: "0 2px",
              }}
            >
              ✕ clear
            </button>
          )}
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={"Paste or type your text here…\n\nTip: Press Ctrl+Enter to transform"}
        style={{
          flex: 1,
          minHeight: "240px",
          background: "transparent",
          border: "none",
          outline: "none",
          padding: "16px",
          color: "#eeeef8",
          fontFamily: "inherit",
          fontSize: "14px",
          lineHeight: 1.75,
          resize: "vertical",
          caretColor: "#7c6ef0",
        }}
      />
    </div>
  );
}

export function OutputPanel({ value, isLoading, toneConfig }) {
  const label = toneConfig
    ? `${toneConfig.emoji} ${toneConfig.label} Output`
    : "Output";

  return (
    <div style={{ ...panelStyle, opacity: isLoading ? 0.5 : 1, transition: "opacity 0.2s" }}>
      <div style={headerStyle}>
        <span style={headerLabel}>{label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <WordCount text={value} />
          <CopyButton text={value} />
        </div>
      </div>
      <div
        style={{
          flex: 1,
          minHeight: "240px",
          padding: "16px",
          fontSize: "14px",
          lineHeight: 1.75,
          overflowY: "auto",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          color: value ? "#eeeef8" : "#606090",
          fontStyle: value ? "normal" : "italic",
          fontFamily: "inherit",
        }}
      >
        {isLoading
          ? "Transforming…"
          : value || "Your transformed text will appear here."}
      </div>
    </div>
  );
}
