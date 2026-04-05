"use client";

export function WordCount({ text }) {
  if (!text || !text.trim()) return null;
  const words = text.trim().split(/\s+/).length;
  const chars = text.length;
  return (
    <span
      style={{
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#606090",
      }}
    >
      {words}w · {chars}c
    </span>
  );
}
