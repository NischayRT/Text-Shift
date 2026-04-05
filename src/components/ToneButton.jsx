"use client";
import { getToneIcon } from "@/lib/icons"; // Adjust path as needed

export function ToneButton({ config, active, onClick }) {
  const icon = getToneIcon(config.key);
  
  const activeStyle = {
    background: `color-mix(in srgb, ${config.color || '#6366F1'} 15%, transparent)`,
    border: `1px solid ${config.color || '#6366F1'}`,
    boxShadow: `0 0 12px color-mix(in srgb, ${config.color || '#6366F1'} 20%, transparent)`,
    color: "#F3F4F6",
  };

  const inactiveStyle = {
    background: "#111827",
    border: "1px solid #374151",
    color: "#9CA3AF",
  };

  return (
    <button
      onClick={onClick}
      title={config.description}
      style={{
        ...(active ? activeStyle : inactiveStyle),
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 16px",
        borderRadius: "8px",
        fontSize: "13px",
        fontWeight: 500,
        cursor: "pointer",
        whiteSpace: "nowrap",
        userSelect: "none",
        transition: "all 0.2s ease",
        fontFamily: "inherit",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = config.color || '#6366F1';
          e.currentTarget.style.color = "#D1D5DB";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = "#374151";
          e.currentTarget.style.color = "#9CA3AF";
        }
      }}
    >
      <span style={{ display: "flex", alignItems: "center", color: active ? (config.color || '#6366F1') : "inherit" }}>
        {icon}
      </span>
      <span>{config.label}</span>
    </button>
  );
}