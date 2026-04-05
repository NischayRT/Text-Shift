"use client";

import { TONE_CONFIG } from "@/lib/engine";
import { ToneButton } from "./ToneButton";

const PLATFORMS = TONE_CONFIG.filter((t) => t.group === "platform");
const STYLES = TONE_CONFIG.filter((t) => t.group === "style");

const divider = {
  flex: 1,
  height: "1px",
  background: "#252540",
};

const groupLabel = {
  fontFamily: "monospace",
  fontSize: "10px",
  letterSpacing: "2px",
  textTransform: "uppercase",
  color: "#606090",
  whiteSpace: "nowrap",
};

export function ToneSelector({ activeTone, onSelect }) {
  return (
    <div
      style={{
        background: "#0f0f1a",
        border: "1px solid #252540",
        borderRadius: "20px",
        padding: "20px",
        marginBottom: "20px",
      }}
    >
      {/* Platforms group */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
        <span style={groupLabel}>Platforms</span>
        <div style={divider} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
        {PLATFORMS.map((cfg) => (
          <ToneButton
            key={cfg.key}
            config={cfg}
            active={activeTone === cfg.key}
            onClick={() => onSelect(cfg.key)}
          />
        ))}
      </div>

      {/* Styles group */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
        <span style={groupLabel}>Writing Styles</span>
        <div style={divider} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {STYLES.map((cfg) => (
          <ToneButton
            key={cfg.key}
            config={cfg}
            active={activeTone === cfg.key}
            onClick={() => onSelect(cfg.key)}
          />
        ))}
      </div>
    </div>
  );
}
