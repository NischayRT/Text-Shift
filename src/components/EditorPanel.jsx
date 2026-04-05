"use client";

import { WordCount } from "./WordCount";
import { CopyButton } from "./CopyButton";
import { LuX } from "react-icons/lu";
import { getToneIcon } from "@/lib/icons"; // Adjust path as needed

const panelStyle = {
  background: "#111827",
  border: "1px solid #1F2937",
  borderRadius: "12px",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
};

const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 16px",
  borderBottom: "1px solid #1F2937",
  background: "#1F2937",
};

const headerLabel = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "11px",
  letterSpacing: "1px",
  textTransform: "uppercase",
  color: "#9CA3AF",
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  gap: "8px"
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
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <WordCount text={value} />
          {value && (
            <button
              onClick={() => onChange("")}
              title="Clear input"
              style={{
                background: "none",
                border: "none",
                display: "flex",
                alignItems: "center",
                color: "#6B7280",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "4px",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#374151"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <LuX size={14} />
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
          minHeight: "260px",
          background: "transparent",
          border: "none",
          outline: "none",
          padding: "20px",
          color: "#F3F4F6",
          fontFamily: "inherit",
          fontSize: "15px",
          lineHeight: 1.6,
          resize: "vertical",
          caretColor: "#6366F1",
        }}
      />
    </div>
  );
}

export function OutputPanel({ value, isLoading, toneConfig }) {
  const icon = toneConfig ? getToneIcon(toneConfig.key) : null;
  
  return (
    <div style={{ ...panelStyle, opacity: isLoading ? 0.6 : 1, transition: "opacity 0.2s" }}>
      <div style={headerStyle}>
        <span style={headerLabel}>
          {icon && <span style={{ color: toneConfig.color }}>{icon}</span>}
          {toneConfig ? `${toneConfig.label} Output` : "Output"}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <WordCount text={value} />
          <CopyButton text={value} />
        </div>
      </div>
      <div
        style={{
          flex: 1,
          minHeight: "260px",
          padding: "20px",
          fontSize: "15px",
          lineHeight: 1.6,
          overflowY: "auto",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          color: value ? "#F3F4F6" : "#6B7280",
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