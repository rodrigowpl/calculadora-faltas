"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./AbsenceTracker.module.css";

interface Absence {
  id: string;
  date: string;
  reason: string;
  created_at: string;
}

export function AbsenceTracker() {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchAbsences = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("absences")
      .select("*")
      .order("date", { ascending: false });

    if (!error && data) {
      setAbsences(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAbsences();
  }, [fetchAbsences]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !reason.trim()) return;

    if (!supabase) return;
    setSubmitting(true);

    if (editingId) {
      const { error } = await supabase
        .from("absences")
        .update({ date, reason: reason.trim() })
        .eq("id", editingId);

      if (!error) {
        setEditingId(null);
        setDate("");
        setReason("");
        await fetchAbsences();
      }
    } else {
      const { error } = await supabase
        .from("absences")
        .insert({ date, reason: reason.trim() });

      if (!error) {
        setDate("");
        setReason("");
        await fetchAbsences();
      }
    }
    setSubmitting(false);
  };

  const handleEdit = (absence: Absence) => {
    setEditingId(absence.id);
    setDate(absence.date);
    setReason(absence.reason);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDate("");
    setReason("");
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from("absences").delete().eq("id", id);
    if (!error) {
      setAbsences((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const total = absences.length;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.headerLabel}>Registro</span>
        <h2 className={styles.title}>Faltas do Eric</h2>
      </div>

      <div className={styles.counterCard}>
        <span className={styles.counterLabel}>Total de faltas registradas</span>
        <div className={styles.counterNumber}>{total}</div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="absence-date">
            Data
          </label>
          <input
            id="absence-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            data-has-value={date ? "true" : "false"}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="absence-reason">
            Motivo
          </label>
          <input
            id="absence-reason"
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={styles.input}
            placeholder="Ex: consulta médica"
            required
          />
        </div>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={submitting || !date || !reason.trim()}
        >
          {submitting
            ? "Salvando..."
            : editingId
              ? "Salvar alteração"
              : "Registrar falta"}
        </button>
      </form>

      <div className={styles.list}>
        {loading ? (
          <div className={styles.empty}>Carregando...</div>
        ) : absences.length === 0 ? (
          <div className={styles.empty}>Nenhuma falta registrada</div>
        ) : (
          absences.map((a) => (
            <div
              key={a.id}
              className={`${styles.item} ${editingId === a.id ? styles.itemEditing : ""}`}
            >
              <div className={styles.itemInfo}>
                <span className={styles.itemDate}>
                  {new Date(a.date + "T00:00:00").toLocaleDateString("pt-BR")}
                </span>
                <span className={styles.itemReason}>{a.reason}</span>
              </div>
              <div className={styles.itemActions}>
                <button
                  className={styles.editBtn}
                  onClick={() => handleEdit(a)}
                  aria-label="Editar falta"
                >
                  &#9998;
                </button>
                <button
                  className={editingId === a.id ? styles.cancelEditBtn : styles.deleteBtn}
                  onClick={() =>
                    editingId === a.id ? handleCancelEdit() : handleDelete(a.id)
                  }
                  aria-label={editingId === a.id ? "Cancelar edição" : "Remover falta"}
                >
                  &times;
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
