"use client";

import { useState } from "react";
import { LuCopy, LuCheck } from "react-icons/lu";

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
        gap: "6px",
        padding: "6px 12px",
        borderRadius: "6px",
        border: "1px solid #374151",
        background: "#1F2937",
        fontSize: "12px",
        fontWeight: 500,
        color: copied ? "#34D399" : "#9CA3AF",
        borderColor: copied ? "#34D399" : "#374151",
        cursor: text && text.trim() ? "pointer" : "not-allowed",
        opacity: text && text.trim() ? 1 : 0.4,
        transition: "all 0.2s ease",
        fontFamily: "inherit",
      }}
    >
      {copied ? <LuCheck size={14} /> : <LuCopy size={14} />}
      <span>{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
}