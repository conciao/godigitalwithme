"use client";

import React from "react";

interface DashboardChartProps {
  title: string;
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
}

export default function DashboardChart({ title, data, color = "#7c3aed", height = 200 }: DashboardChartProps) {
  const safeData = (data || []).map(d => ({
    label: d.label || "",
    value: Number(d.value) || 0
  }));

  if (safeData.length === 0) return null;

  const maxVal = Math.max(...safeData.map(d => d.value), 1);
  const width = 100 / safeData.length;

  return (
    <div className="stat-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4 style={{ fontSize: "0.9rem", fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>{title}</h4>
      </div>
      
      <div style={{ 
        height: `${height}px`, 
        display: "flex", 
        alignItems: "flex-end", 
        gap: "4px",
        paddingTop: "20px"
      }}>
        {safeData.map((d, i) => {
          const barHeight = (d.value / maxVal) * 100;
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <div 
                style={{ 
                  width: "100%", 
                  height: `${barHeight}%`, 
                  background: `linear-gradient(to top, ${color}88, ${color})`,
                  borderRadius: "4px 4px 0 0",
                  transition: "height 0.3s ease",
                  position: "relative"
                }}
                title={`${d.label}: ${d.value}`}
              >
                {/* Value tooltip on top of bar */}
                {barHeight > 0 && (
                  <div style={{
                    position: "absolute",
                    top: "-20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "0.7rem",
                    color: "#fff",
                    whiteSpace: "nowrap"
                  }}>
                    {d.value}
                  </div>
                )}
              </div>
              <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
