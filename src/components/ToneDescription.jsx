"use client";

export function ToneDescription({ config }) {
  if (!config) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        background: "#0f0f1a",
        border: "1px solid #252540",
        borderLeft: `3px solid ${config.color}`,
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      <span style={{ fontSize: "22px", flexShrink: 0 }}>{config.emoji}</span>
      <div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "11px",
            fontWeight: 500,
            color: config.color,
            marginBottom: "3px",
            letterSpacing: "0.5px",
          }}
        >
          {config.label.toUpperCase()}
        </div>
        <div style={{ fontSize: "13px", color: "#b0b0d0", lineHeight: 1.5 }}>
          {config.description}
        </div>
      </div>
    </div>
  );
}
