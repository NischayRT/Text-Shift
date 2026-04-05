"use client";

import { useState } from "react";

export function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!text || !text.trim()) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      disabled={!text || !text.trim()}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "6px 12px",
        borderRadius: "8px",
        border: "1px solid #252540",
        background: "#151525",
        fontSize: "12px",
        fontWeight: 500,
        color: copied ? "#52d68a" : "#606090",
        borderColor: copied ? "#52d68a" : "#252540",
        cursor: text && text.trim() ? "pointer" : "not-allowed",
        opacity: text && text.trim() ? 1 : 0.35,
        transition: "all 0.18s",
        fontFamily: "inherit",
      }}
    >
      <span>{copied ? "✓" : "⎘"}</span>
      <span>{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
}
