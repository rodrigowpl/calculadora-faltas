"use client";

import { useState, useMemo, useCallback } from "react";
import styles from "./Calculator.module.css";

interface CalcResult {
  diasNecessarios: number;
  faltasPermitidas: number;
  faltasPorMes: string;
  percentualFaltas: string;
  status: "safe" | "warning" | "danger";
}

const QUICK_REF = [60, 70, 75, 80, 85, 90] as const;

export function Calculator() {
  const [diasLetivos, setDiasLetivos] = useState(200);
  const [presencaMinima, setPresencaMinima] = useState(75);

  const calc = useMemo<CalcResult>(() => {
    const diasNecessarios = Math.ceil(diasLetivos * (presencaMinima / 100));
    const faltasPermitidas = diasLetivos - diasNecessarios;
    const faltasPorMes =
      diasLetivos > 0 ? (faltasPermitidas / 10).toFixed(1) : "0";
    const percentualFaltas =
      diasLetivos > 0
        ? ((faltasPermitidas / diasLetivos) * 100).toFixed(1)
        : "0";

    let status: CalcResult["status"] = "safe";
    if (faltasPermitidas <= 10) status = "danger";
    else if (faltasPermitidas <= 25) status = "warning";

    return {
      diasNecessarios,
      faltasPermitidas,
      faltasPorMes,
      percentualFaltas,
      status,
    };
  }, [diasLetivos, presencaMinima]);

  const handleDiasChange = useCallback((v: number) => {
    if (v >= 100 && v <= 300) setDiasLetivos(v);
  }, []);

  const handlePresencaChange = useCallback((v: number) => {
    if (v >= 50 && v <= 100) setPresencaMinima(v);
  }, []);

  return (
    <main className={styles.container}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <span className={styles.headerLabel}>Calculadora</span>
          <h1 className={styles.title}>Faltas Escolares</h1>
          <p className={styles.formula}>
            faltas = dias_letivos − ⌈dias_letivos × (presença / 100)⌉
          </p>
        </header>

        <div className={styles.card}>
          <SliderInput
            label="Dias Letivos"
            value={diasLetivos}
            onChange={handleDiasChange}
            min={100}
            max={300}
            unit="dias"
            color="#00D4AA"
          />
          <div className={styles.spacer} />
          <SliderInput
            label="Presença Mínima"
            value={presencaMinima}
            onChange={handlePresencaChange}
            min={50}
            max={100}
            unit="%"
            color="#00A3FF"
          />
        </div>

        <div className={`${styles.resultCard} ${styles[calc.status]}`}>
          <div className={styles.resultGlow} />
          <span className={styles.resultLabel}>Pode faltar até</span>
          <div className={styles.resultNumber}>{calc.faltasPermitidas}</div>
          <span className={styles.resultUnit}>
            {calc.faltasPermitidas === 1 ? "dia" : "dias"} no ano
          </span>
        </div>

        <div className={styles.statsGrid}>
          <StatCard
            label="Presença obrigatória"
            value={String(calc.diasNecessarios)}
            unit="dias"
          />
          <StatCard
            label="Média por mês"
            value={calc.faltasPorMes}
            unit="faltas"
            sub="(~10 meses)"
          />
          <StatCard
            label="% de faltas"
            value={`${calc.percentualFaltas}%`}
            unit="do total"
          />
        </div>

        <div className={styles.card}>
          <span className={styles.refTitle}>Referência rápida</span>
          <div className={styles.refList}>
            {QUICK_REF.map((p) => {
              const needed = Math.ceil(diasLetivos * (p / 100));
              const allowed = diasLetivos - needed;
              const isActive = p === presencaMinima;
              return (
                <button
                  key={p}
                  className={`${styles.refItem} ${isActive ? styles.refActive : ""}`}
                  onClick={() => setPresencaMinima(p)}
                >
                  <span className={styles.refPercent}>{p}% presença</span>
                  <span className={styles.refValue}>{allowed} faltas</span>
                </button>
              );
            })}
          </div>
        </div>

        <footer className={styles.footer}>
          LDB Art. 24 — frequência mínima de 75% do total de horas letivas
        </footer>
      </div>
    </main>
  );
}

function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  unit,
  color,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  unit: string;
  color: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className={styles.sliderGroup}>
      <div className={styles.sliderHeader}>
        <span className={styles.sliderLabel}>{label}</span>
        <div className={styles.sliderValueWrap}>
          <input
            type="number"
            inputMode="numeric"
            value={value}
            onChange={(e) => {
              const v = parseInt(e.target.value);
              if (!isNaN(v)) onChange(v);
            }}
            className={styles.sliderInput}
          />
          <span className={styles.sliderUnit}>{unit}</span>
        </div>
      </div>
      <div className={styles.sliderTrack}>
        <div
          className={styles.sliderFill}
          style={{
            width: `${pct}%`,
            background: color,
            boxShadow: `0 0 12px ${color}44`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className={styles.sliderRange}
          style={{ "--slider-color": color } as React.CSSProperties}
        />
        <div
          className={styles.sliderThumb}
          style={{
            left: `${pct}%`,
            background: color,
            boxShadow: `0 0 8px ${color}66`,
          }}
        />
      </div>
      <div className={styles.sliderBounds}>
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
  sub,
}: {
  label: string;
  value: string;
  unit: string;
  sub?: string;
}) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statUnit}>{unit}</div>
      <div className={styles.statLabel}>{label}</div>
      {sub && <div className={styles.statSub}>{sub}</div>}
    </div>
  );
}
