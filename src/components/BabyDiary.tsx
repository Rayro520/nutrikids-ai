/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ChildProfile } from "../types";
import { BookHeart, Plus, Trash2, Smile, Frown, AlertTriangle, Milk, Apple, Moon, Droplets } from "lucide-react";
import { useLanguage } from "../utils/LanguageContext";

type EntryType = "meal" | "sleep" | "breast" | "water" | "note";
type Reaction = "loved" | "ok" | "refused" | "allergy";

interface DiaryEntry {
  id: string;
  type: EntryType;
  text: string;
  reaction?: Reaction;
  time: string;
  date: string;
}

const REACTION_CONFIG: Record<Reaction, { icon: string; label: string; bg: string; text: string }> = {
  loved:   { icon: "😍", label: "Adorou",     bg: "bg-emerald-50",  text: "text-emerald-700" },
  ok:      { icon: "😐", label: "Comeu ok",   bg: "bg-amber-50",    text: "text-amber-700"   },
  refused: { icon: "😢", label: "Recusou",    bg: "bg-slate-50",    text: "text-slate-600"   },
  allergy: { icon: "⚠️", label: "Atenção!",  bg: "bg-rose-50",     text: "text-rose-700"    },
};

const TYPE_CONFIG: Record<EntryType, { icon: React.ReactNode; label: string; color: string }> = {
  meal:   { icon: <Apple className="w-3.5 h-3.5" />,  label: "Refeição",        color: "text-orange-500" },
  breast: { icon: <Milk className="w-3.5 h-3.5" />,   label: "Amamentação",     color: "text-pink-500"   },
  sleep:  { icon: <Moon className="w-3.5 h-3.5" />,   label: "Sono",            color: "text-indigo-500" },
  water:  { icon: <Droplets className="w-3.5 h-3.5" />, label: "Água/Hidratação", color: "text-sky-500"  },
  note:   { icon: <BookHeart className="w-3.5 h-3.5" />, label: "Nota",          color: "text-violet-500" },
};

interface BabyDiaryProps {
  activeProfile: ChildProfile | null;
}

export default function BabyDiary({ activeProfile }: BabyDiaryProps) {
  const { language } = useLanguage();
  const storageKey = `nutrikids_diary_${activeProfile?.id || "global"}`;

  const [entries, setEntries] = useState<DiaryEntry[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<EntryType>("meal");
  const [text, setText] = useState("");
  const [reaction, setReaction] = useState<Reaction>("loved");

  const today = new Date().toISOString().split("T")[0];
  const todayEntries = entries.filter((e) => e.date === today);

  const save = (updated: DiaryEntry[]) => {
    setEntries(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const addEntry = () => {
    if (!text.trim()) return;
    const now = new Date();
    const entry: DiaryEntry = {
      id: Math.random().toString(36).substring(7),
      type,
      text: text.trim(),
      reaction: type === "meal" || type === "breast" ? reaction : undefined,
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: today,
    };
    save([entry, ...entries]);
    setText("");
    setShowForm(false);
  };

  const removeEntry = (id: string) => save(entries.filter((e) => e.id !== id));

  const t = (pt: string, en: string, es: string) =>
    language === "en" ? en : language === "es" ? es : pt;

  return (
    <div className="bg-white rounded-3xl border border-orange-100/40 shadow-xs p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookHeart className="w-5 h-5 text-orange-500" />
          <div>
            <h2 className="text-base font-black text-gray-800 tracking-tight">
              {t("Diário do Bebê", "Baby Diary", "Diario del Bebé")}
            </h2>
            <p className="text-[10px] text-gray-400 font-semibold">
              {t("Registros de hoje", "Today's entries", "Registros de hoy")} ({todayEntries.length})
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-[10px] font-black rounded-xl transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          {t("Registrar", "Add", "Registrar")}
        </button>
      </div>

      {/* Quick stats */}
      {todayEntries.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {(["meal","breast","sleep","water"] as EntryType[]).map((tp) => {
            const count = todayEntries.filter((e) => e.type === tp).length;
            const cfg = TYPE_CONFIG[tp];
            return (
              <div key={tp} className="bg-gray-50 border border-gray-100 rounded-2xl p-2 text-center">
                <span className={`block mx-auto w-fit ${cfg.color}`}>{cfg.icon}</span>
                <span className="text-base font-black text-slate-800 block">{count}</span>
                <span className="text-[8px] text-gray-400 font-bold">{cfg.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* New entry form */}
      {showForm && (
        <div className="bg-orange-50/40 border border-orange-100 rounded-2xl p-4 space-y-3">
          {/* Type selector */}
          <div className="flex flex-wrap gap-1.5">
            {(Object.entries(TYPE_CONFIG) as [EntryType, typeof TYPE_CONFIG[EntryType]][]).map(([tp, cfg]) => (
              <button
                key={tp}
                onClick={() => setType(tp)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[10px] font-bold transition-all ${
                  type === tp ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-500 border-gray-200"
                }`}
              >
                <span className={type === tp ? "text-white" : cfg.color}>{cfg.icon}</span>
                {cfg.label}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addEntry()}
            placeholder={
              type === "meal" ? t("Ex: Purê de batata com cenoura", "E.g. Mashed potato with carrot", "Ej: Puré de patata con zanahoria")
              : type === "breast" ? t("Ex: 15 min cada lado", "E.g. 15 min each side", "Ej: 15 min cada lado")
              : type === "sleep" ? t("Ex: Dormiu das 13h às 15h", "E.g. Slept 1pm to 3pm", "Ej: Durmió de 13h a 15h")
              : type === "water" ? t("Ex: 50ml de água", "E.g. 50ml of water", "Ej: 50ml de agua")
              : t("Anotação livre...", "Free note...", "Nota libre...")
            }
            className="w-full px-3 py-2 bg-white border border-orange-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
          />

          {/* Reaction picker (only for meal/breast) */}
          {(type === "meal" || type === "breast") && (
            <div className="flex gap-2">
              {(Object.entries(REACTION_CONFIG) as [Reaction, typeof REACTION_CONFIG[Reaction]][]).map(([r, cfg]) => (
                <button
                  key={r}
                  onClick={() => setReaction(r)}
                  className={`flex-1 flex flex-col items-center py-2 rounded-xl border text-[9px] font-bold transition-all ${
                    reaction === r ? `${cfg.bg} border-current ${cfg.text}` : "bg-white border-gray-100 text-gray-400"
                  }`}
                >
                  <span className="text-base">{cfg.icon}</span>
                  {cfg.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-3 py-1.5 text-gray-400 text-[10px] font-bold hover:bg-gray-100 rounded-xl transition-all">
              {t("Cancelar", "Cancel", "Cancelar")}
            </button>
            <button
              onClick={addEntry}
              disabled={!text.trim()}
              className="px-4 py-1.5 bg-orange-500 text-white text-[10px] font-black rounded-xl hover:bg-orange-600 disabled:opacity-40 transition-all"
            >
              {t("Salvar", "Save", "Guardar")}
            </button>
          </div>
        </div>
      )}

      {/* Entries list */}
      {todayEntries.length === 0 && !showForm ? (
        <div className="text-center py-8 bg-orange-50/20 rounded-2xl border border-dashed border-orange-100">
          <BookHeart className="w-8 h-8 text-orange-200 mx-auto mb-2" />
          <p className="text-gray-400 text-xs font-semibold">
            {t("Nenhum registro hoje.", "No entries today.", "Sin registros hoy.")}
          </p>
          <p className="text-[10px] text-gray-300 mt-1">
            {t("Anote refeições, amamentações e sono.", "Log meals, breastfeeding and sleep.", "Registra comidas, lactancia y sueño.")}
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
          {todayEntries.map((entry) => {
            const cfg = TYPE_CONFIG[entry.type];
            const rCfg = entry.reaction ? REACTION_CONFIG[entry.reaction] : null;
            return (
              <div key={entry.id} className={`flex items-start gap-3 p-3 rounded-2xl border ${rCfg?.bg || "bg-gray-50"} ${rCfg ? "border-current/10" : "border-gray-100"}`}>
                <span className={`mt-0.5 shrink-0 ${cfg.color}`}>{cfg.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-black text-slate-700 truncate">{entry.text}</span>
                    {rCfg && (
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${rCfg.bg} ${rCfg.text}`}>
                        {rCfg.icon} {rCfg.label}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-gray-400 font-medium">{cfg.label} · {entry.time}</span>
                </div>
                <button onClick={() => removeEntry(entry.id)} className="p-1 hover:text-rose-400 text-gray-300 transition-colors shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
