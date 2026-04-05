"use client";

export function ToneButton({ config, active, onClick }) {
  const activeStyle = {
    background: `color-mix(in srgb, ${config.color} 20%, #0f0f1a)`,
    border: `1px solid ${config.color}`,
    boxShadow: `0 0 0 1px ${config.color}, 0 0 16px color-mix(in srgb, ${config.color} 40%, transparent)`,
    color: "#fff",
  };

  const inactiveStyle = {
    background: "#0f0f1a",
    border: "1px solid #252540",
    color: "#606090",
  };

  return (
    <button
      onClick={onClick}
      title={config.description}
      style={active ? activeStyle : inactiveStyle}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = config.color;
          e.currentTarget.style.color = "#b0b0d0";
          e.currentTarget.style.background = `color-mix(in srgb, ${config.color} 8%, #0f0f1a)`;
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = "#252540";
          e.currentTarget.style.color = "#606090";
          e.currentTarget.style.background = "#0f0f1a";
        }
      }}
      style={{
        ...(active ? activeStyle : inactiveStyle),
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "8px 14px",
        borderRadius: "99px",
        fontSize: "13px",
        fontWeight: 500,
        cursor: "pointer",
        whiteSpace: "nowrap",
        userSelect: "none",
        transition: "all 0.18s",
        fontFamily: "inherit",
      }}
    >
      <span style={{ fontSize: "15px", lineHeight: 1 }}>{config.emoji}</span>
      <span>{config.label}</span>
    </button>
  );
}
