"use client";

import { CopyButton } from "./CopyButton";

export function ActionBar({ onTransform, onClear, output, inputEmpty, isLoading }) {
  const canTransform = !inputEmpty && !isLoading;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        flexWrap: "wrap",
        marginBottom: "40px",
      }}
    >
      {/* Transform button */}
      <button
        onClick={onTransform}
        disabled={!canTransform}
        onMouseEnter={(e) => {
          if (canTransform) e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
        }}
        style={{
          fontFamily: "inherit",
          fontSize: "15px",
          fontWeight: 700,
          letterSpacing: "0.3px",
          padding: "12px 30px",
          borderRadius: "99px",
          border: "none",
          cursor: canTransform ? "pointer" : "not-allowed",
          background: canTransform
            ? "linear-gradient(135deg, #7c6ef0, #e86cbb)"
            : "#1c1c30",
          color: canTransform ? "#fff" : "#606090",
          boxShadow: canTransform ? "0 4px 24px rgba(124,110,240,0.35)" : "none",
          transition: "all 0.2s",
        }}
      >
        ⚡ Transform
      </button>

      {/* Copy output */}
      <CopyButton text={output} />

      {/* Clear all */}
      <button
        onClick={onClear}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#e86cbb";
          e.currentTarget.style.borderColor = "#e86cbb";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#606090";
          e.currentTarget.style.borderColor = "#252540";
        }}
        style={{
          fontFamily: "inherit",
          fontSize: "13px",
          fontWeight: 500,
          padding: "11px 20px",
          borderRadius: "99px",
          border: "1px solid #252540",
          background: "#0f0f1a",
          color: "#606090",
          cursor: "pointer",
          transition: "all 0.18s",
        }}
      >
        ✕ Clear All
      </button>

      {/* Shortcut hint */}
      <span
        style={{
          marginLeft: "auto",
          fontFamily: "monospace",
          fontSize: "11px",
          color: "#606090",
        }}
      >
        Ctrl+Enter to transform
      </span>
    </div>
  );
}
