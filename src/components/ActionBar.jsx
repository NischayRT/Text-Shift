"use client";

import { CopyButton } from "./CopyButton";
import { LuZap, LuTrash2 } from "react-icons/lu";

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
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          fontFamily: "inherit",
          fontSize: "14px",
          fontWeight: 600,
          padding: "10px 24px",
          borderRadius: "8px",
          border: "none",
          cursor: canTransform ? "pointer" : "not-allowed",
          background: canTransform
            ? "linear-gradient(135deg, #6366F1, #8B5CF6)"
            : "#1F2937",
          color: canTransform ? "#FFFFFF" : "#6B7280",
          boxShadow: canTransform ? "0 4px 14px rgba(99, 102, 241, 0.25)" : "none",
          transition: "all 0.2s ease",
          transform: canTransform ? "translateY(0)" : "none",
        }}
        onMouseEnter={(e) => {
          if (canTransform) e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          if (canTransform) e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <LuZap size={16} fill={canTransform ? "currentColor" : "none"} />
        Transform
      </button>

      {/* Copy output */}
      <CopyButton text={output} />

      {/* Clear all */}
      <button
        onClick={onClear}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          fontFamily: "inherit",
          fontSize: "13px",
          fontWeight: 500,
          padding: "8px 16px",
          borderRadius: "6px",
          border: "1px solid #374151",
          background: "transparent",
          color: "#9CA3AF",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#EF4444";
          e.currentTarget.style.borderColor = "#EF4444";
          e.currentTarget.style.background = "rgba(239, 68, 68, 0.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#9CA3AF";
          e.currentTarget.style.borderColor = "#374151";
          e.currentTarget.style.background = "transparent";
        }}
      >
        <LuTrash2 size={14} />
        Clear All
      </button>

      {/* Shortcut hint */}
      <span
        style={{
          marginLeft: "auto",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "11px",
          color: "#6B7280",
        }}
      >
        Ctrl+Enter to transform
      </span>
    </div>
  );
}