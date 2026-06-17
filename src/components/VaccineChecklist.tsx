/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ChildProfile } from "../types";
import { calculateChildMetrics } from "../utils/nutritionData";
import { ShieldCheck, CheckCircle2, Circle, Info, AlertTriangle } from "lucide-react";
import { useLanguage } from "../utils/LanguageContext";

interface VaccineItem {
  name: string;
  alias: string;
  ageMonths: number;
  dose: string;
  isBooster?: boolean;
  notes?: string;
}

const VACCINE_SCHEDULE: VaccineItem[] = [
  { name: "BCG", alias: "Tuberculose", ageMonths: 0, dose: "Dose única" },
  { name: "Hepatite B", alias: "HB", ageMonths: 0, dose: "1ª dose" },
  { name: "Penta (DTP+Hib+HB)", alias: "Pentavalente", ageMonths: 2, dose: "1ª dose" },
  { name: "VIP (Pólio injetável)", alias: "Poliomelite", ageMonths: 2, dose: "1ª dose" },
  { name: "Rotavírus (VRH)", alias: "Diarreia", ageMonths: 2, dose: "1ª dose" },
  { name: "Pneumocócica 10v (PCV10)", alias: "Pneumonia", ageMonths: 2, dose: "1ª dose" },
  { name: "Meningocócica C", alias: "Meningite C", ageMonths: 2, dose: "1ª dose" },
  { name: "Penta (DTP+Hib+HB)", alias: "Pentavalente", ageMonths: 3, dose: "2ª dose" },
  { name: "VIP (Pólio injetável)", alias: "Poliomelite", ageMonths: 3, dose: "2ª dose" },
  { name: "Meningocócica C", alias: "Meningite C", ageMonths: 3, dose: "2ª dose" },
  { name: "Penta (DTP+Hib+HB)", alias: "Pentavalente", ageMonths: 4, dose: "3ª dose" },
  { name: "VIP (Pólio injetável)", alias: "Poliomelite", ageMonths: 4, dose: "3ª dose" },
  { name: "Rotavírus (VRH)", alias: "Diarreia", ageMonths: 4, dose: "2ª dose" },
  { name: "Pneumocócica 10v (PCV10)", alias: "Pneumonia", ageMonths: 4, dose: "2ª dose" },
  { name: "Meningocócica C", alias: "Meningite C", ageMonths: 5, dose: "3ª dose" },
  { name: "Influenza (Gripe)", alias: "Gripe", ageMonths: 6, dose: "1ª dose", notes: "Anual após o 1º ano" },
  { name: "Febre Amarela", alias: "FA", ageMonths: 9, dose: "1ª dose", notes: "Reforço aos 4 anos" },
  { name: "SCR (Tríplice viral)", alias: "Sarampo/Caxumba/Rubéola", ageMonths: 12, dose: "1ª dose" },
  { name: "Pneumocócica 10v (PCV10)", alias: "Pneumonia", ageMonths: 12, dose: "Reforço", isBooster: true },
  { name: "Meningocócica C", alias: "Meningite C", ageMonths: 12, dose: "Reforço", isBooster: true },
  { name: "Varicela (Catapora)", alias: "Catapora", ageMonths: 12, dose: "1ª dose" },
  { name: "DTP (Tríplice bacteriana)", alias: "Difteria/Tétano/Coqueluche", ageMonths: 15, dose: "1º Reforço", isBooster: true },
  { name: "VOP (Pólio oral)", alias: "Poliomelite oral", ageMonths: 15, dose: "1º Reforço", isBooster: true },
  { name: "Hepatite A", alias: "HA", ageMonths: 15, dose: "Dose única" },
  { name: "DTP (Tríplice bacteriana)", alias: "Difteria/Tétano/Coqueluche", ageMonths: 48, dose: "2º Reforço", isBooster: true },
  { name: "VOP (Pólio oral)", alias: "Poliomelite oral", ageMonths: 48, dose: "2º Reforço", isBooster: true },
  { name: "SCR (Tríplice viral)", alias: "Sarampo/Caxumba/Rubéola", ageMonths: 48, dose: "2ª dose" },
  { name: "Varicela (Catapora)", alias: "Catapora", ageMonths: 48, dose: "2ª dose" },
];

const AGE_LABELS: Record<number, string> = {
  0: "Ao Nascer",
  2: "2 meses",
  3: "3 meses",
  4: "4 meses",
  5: "5 meses",
  6: "6 meses",
  9: "9 meses",
  12: "12 meses (1 ano)",
  15: "15 meses",
  48: "4 anos",
};

interface VaccineChecklistProps {
  activeProfile: ChildProfile | null;
}

export default function VaccineChecklist({ activeProfile }: VaccineChecklistProps) {
  const { language } = useLanguage();
  const metrics = activeProfile ? calculateChildMetrics(activeProfile.birthDate) : null;
  const childAgeMonths = metrics?.ageMonths ?? 0;

  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(`nutrikids_vaccines_${activeProfile?.id || "global"}`);
    return saved ? JSON.parse(saved) : {};
  });

  const toggleVaccine = (key: string) => {
    const updated = { ...checked, [key]: !checked[key] };
    setChecked(updated);
    localStorage.setItem(`nutrikids_vaccines_${activeProfile?.id || "global"}`, JSON.stringify(updated));
  };

  const ageGroups = [...new Set(VACCINE_SCHEDULE.map((v) => v.ageMonths))].sort((a, b) => a - b);

  const totalDone = VACCINE_SCHEDULE.filter((v) => checked[`${v.name}_${v.ageMonths}_${v.dose}`]).length;
  const totalDue = VACCINE_SCHEDULE.filter((v) => v.ageMonths <= childAgeMonths).length;
  const progressPct = totalDue > 0 ? Math.round((totalDone / totalDue) * 100) : 0;

  const label = (key: "title" | "sub" | "progress" | "due" | "upcoming" | "done" | "noProfile" | "tap" | "notes") => {
    const t: Record<typeof key, string[]> = {
      title: ["Calendário de Vacinas", "Vaccine Calendar", "Calendario de Vacunas"],
      sub: ["SBP 2024 — marque as doses aplicadas", "SBP 2024 — mark applied doses", "SBP 2024 — marque las dosis aplicadas"],
      progress: ["vacinas em dia", "vaccines on time", "vacunas al día"],
      due: ["Já devidas", "Already due", "Ya debidas"],
      upcoming: ["Próximas", "Upcoming", "Próximas"],
      done: ["Concluída", "Done", "Hecha"],
      noProfile: ["Cadastre um perfil para acompanhar as vacinas da faixa etária.", "Register a profile to track vaccines by age.", "Registra un perfil para seguir las vacunas por edad."],
      tap: ["Toque para marcar como aplicada", "Tap to mark as applied", "Toca para marcar como aplicada"],
      notes: ["Obs.", "Note:", "Nota:"],
    };
    const idx = language === "en" ? 1 : language === "es" ? 2 : 0;
    return t[key][idx];
  };

  return (
    <div className="bg-white rounded-3xl border border-orange-100/40 shadow-xs p-5 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-orange-500" />
            <h2 className="text-base font-black text-gray-800 tracking-tight">{label("title")}</h2>
          </div>
          <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{label("sub")}</p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-lg font-black text-orange-500">{totalDone}</span>
          <span className="text-[9px] text-gray-400 font-bold block leading-none">{label("progress")}</span>
        </div>
      </div>

      {/* Progress bar */}
      {activeProfile && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-[9px] font-bold text-gray-400">
            <span>{label("due")}: {totalDue}</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {!activeProfile && (
        <div className="bg-orange-50/40 border border-orange-100/50 rounded-2xl p-3 text-[11px] text-orange-700 font-medium flex items-center gap-2">
          <Info className="w-4 h-4 text-orange-400 shrink-0" />
          {label("noProfile")}
        </div>
      )}

      {/* Vaccine groups */}
      <div className="space-y-4">
        {ageGroups.map((ageGroup) => {
          const vaccines = VACCINE_SCHEDULE.filter((v) => v.ageMonths === ageGroup);
          const isDue = ageGroup <= childAgeMonths;
          const isNext = !isDue && ageGroup <= childAgeMonths + 3;

          return (
            <div key={ageGroup}>
              {/* Age label */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                  isDue
                    ? "bg-orange-50 text-orange-600 border-orange-100"
                    : isNext
                    ? "bg-amber-50 text-amber-700 border-amber-100"
                    : "bg-gray-50 text-gray-400 border-gray-100"
                }`}>
                  {AGE_LABELS[ageGroup] ?? `${ageGroup}m`}
                </span>
                {isNext && (
                  <span className="text-[8px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-full animate-pulse">
                    {label("upcoming")}
                  </span>
                )}
              </div>

              <div className="space-y-1.5 pl-1">
                {vaccines.map((v) => {
                  const key = `${v.name}_${v.ageMonths}_${v.dose}`;
                  const isChecked = !!checked[key];

                  return (
                    <button
                      key={key}
                      onClick={() => toggleVaccine(key)}
                      title={label("tap")}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl border text-left transition-all active:scale-[0.98] ${
                        isChecked
                          ? "bg-emerald-50 border-emerald-200"
                          : isDue
                          ? "bg-white border-orange-100 hover:border-orange-200"
                          : "bg-gray-50/50 border-gray-100 opacity-60"
                      }`}
                    >
                      {isChecked
                        ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        : <Circle className={`w-4 h-4 shrink-0 ${isDue ? "text-orange-300" : "text-gray-200"}`} />
                      }
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[11px] font-black ${isChecked ? "text-emerald-700 line-through" : isDue ? "text-slate-800" : "text-gray-400"}`}>
                            {v.name}
                          </span>
                          <span className="text-[8.5px] font-bold text-gray-400">{v.dose}</span>
                          {isChecked && <span className="text-[8px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded-full">{label("done")}</span>}
                          {v.isBooster && <span className="text-[8px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded-full border border-amber-100">Reforço</span>}
                        </div>
                        <p className="text-[9px] text-gray-400 font-medium leading-none mt-0.5">{v.alias}</p>
                        {v.notes && <p className="text-[9px] text-amber-600 font-semibold mt-0.5">{label("notes")} {v.notes}</p>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 bg-amber-50/40 border border-amber-100/50 rounded-2xl p-3">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[9.5px] text-amber-800 font-semibold leading-relaxed">
          {language === "en"
            ? "This calendar is based on SBP 2024 guidelines for Brazil's public health network (SUS). Always follow your pediatrician's schedule."
            : language === "es"
            ? "Este calendario se basa en las pautas SBP 2024 para la red pública de salud de Brasil. Siga siempre el calendario de su pediatra."
            : "Este calendário é baseado nas diretrizes SBP 2024 para a rede pública brasileira (SUS). Siga sempre o calendário orientado pelo seu pediatra."}
        </p>
      </div>
    </div>
  );
}
