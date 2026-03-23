"use client";

import { useState } from "react";
import { Calculator } from "@/components/Calculator";
import { AbsenceTracker } from "@/components/AbsenceTracker";

const tabs = [
  { id: "calc", label: "Calculadora" },
  { id: "tracker", label: "Registro" },
] as const;

type Tab = (typeof tabs)[number]["id"];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("calc");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        padding: "20px 16px 0",
        background: "linear-gradient(to bottom, #0F1419 80%, transparent)",
      }}>
        <div style={{
          display: "flex",
          gap: 4,
          background: "#1A2332",
          border: "1px solid #2A3A4E",
          borderRadius: 10,
          padding: 4,
          width: "100%",
          maxWidth: 480,
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: "10px 0",
                border: "none",
                borderRadius: 8,
                fontFamily: "inherit",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.5px",
                cursor: "pointer",
                transition: "all 0.2s",
                background: activeTab === tab.id
                  ? "linear-gradient(135deg, #00D4AA, #00A3FF)"
                  : "transparent",
                color: activeTab === tab.id ? "#0F1419" : "#7A8BA3",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {activeTab === "calc" ? (
        <Calculator />
      ) : (
        <div style={{ maxWidth: 480, width: "100%", padding: "24px 16px 40px" }}>
          <AbsenceTracker />
        </div>
      )}
    </div>
  );
}
