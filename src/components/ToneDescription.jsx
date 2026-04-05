"use client";
import { getToneIcon } from "@/lib/icons"; // Adjust path as needed

export function ToneDescription({ config }) {
  if (!config) return null;
  const icon = getToneIcon(config.key);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "16px 20px",
        background: "#111827",
        border: "1px solid #1F2937",
        borderLeft: `4px solid ${config.color || '#6366F1'}`,
        borderRadius: "8px",
        marginBottom: "24px",
      }}
    >
      <span style={{ fontSize: "24px", color: config.color || '#6366F1', flexShrink: 0, display: "flex" }}>
        {icon}
      </span>
      <div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "11px",
            fontWeight: 600,
            color: config.color || '#6366F1',
            marginBottom: "4px",
            letterSpacing: "0.5px",
          }}
        >
          {config.label.toUpperCase()}
        </div>
        <div style={{ fontSize: "14px", color: "#9CA3AF", lineHeight: 1.5 }}>
          {config.description}
        </div>
      </div>
    </div>
  );
}