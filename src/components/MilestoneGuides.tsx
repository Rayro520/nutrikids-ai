/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AGE_MILESTONES, NUTRIENT_METADATA } from "../utils/nutritionData";
import { AgeMilestone } from "../types";
import { Check, X, AlertOctagon, HelpCircle, Eye, Info } from "lucide-react";

interface MilestoneGuidesProps {
  activeMilestoneCategory: AgeMilestone["category"];
}

export default function MilestoneGuides({ activeMilestoneCategory }: MilestoneGuidesProps) {
  const [selectedCategory, setSelectedCategory] = useState<AgeMilestone["category"]>(activeMilestoneCategory);
  
  // Keep selected tab in sync if parent changes child profile, but let parent manually browse other stages as well!
  React.useEffect(() => {
    setSelectedCategory(activeMilestoneCategory);
  }, [activeMilestoneCategory]);

  const currentMilestone = AGE_MILESTONES.find((m) => m.category === selectedCategory) || AGE_MILESTONES[0];

  return (
    <div id="milestone-guides-section" className="bg-white rounded-3xl border border-orange-100/40 shadow-xs p-5">
      <div className="flex items-center gap-2 mb-3">
        <Info className="w-5 h-5 text-orange-500" />
        <h2 className="text-base font-black text-gray-800 tracking-tight font-display">Guias por Faixa Etária</h2>
      </div>

      <p className="text-xs text-gray-400 mb-5 leading-normal">
        Navegue pelos marcos de alimentação recomendados por pediatras oficiais ou selecione o perfil da criança para abrir automaticamente.
      </p>

      {/* Tabs list */}
      <div className="flex flex-wrap gap-2 border-b border-orange-50/50 pb-4 mb-5">
        {AGE_MILESTONES.map((m) => (
          <button
            key={m.category}
            onClick={() => setSelectedCategory(m.category)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
              m.category === selectedCategory
                ? "bg-slate-900 border-slate-950 text-white shadow-xs"
                : "bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100"
            }`}
          >
            {m.category.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Milestone details board */}
      <div className="space-y-6">
        <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-100 inline-block mb-1.5">
              {currentMilestone.ageRange}
            </span>
            <h3 className="text-sm font-black text-gray-800 font-display">{currentMilestone.title}</h3>
            <p className="text-[11px] text-gray-500 font-bold mt-1">Foco Principal: {currentMilestone.focus}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pode Consumir */}
          <div className="bg-orange-50/20 border border-orange-100 rounded-2xl p-5">
            <h4 className="flex items-center gap-2 font-bold text-orange-850 text-sm mb-3">
              <span className="w-5 h-5 bg-orange-100 text-orange-700 font-bold rounded-full flex items-center justify-center text-xs">✓</span>
              Alimentos Permitidos / Recomendados
            </h4>
            <ul className="space-y-2">
              {currentMilestone.permitted.map((p, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-gray-750 font-medium">
                  <Check className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Não Pode Consumir */}
          <div className="bg-rose-50/20 border border-rose-100 rounded-2xl p-5">
            <h4 className="flex items-center gap-2 font-bold text-rose-800 text-sm mb-3">
              <span className="w-5 h-5 bg-rose-100 text-rose-700 font-bold rounded-full flex items-center justify-center text-xs">✗</span>
              NÃO Recomendados ou Proibidos
            </h4>
            <ul className="space-y-2">
              {currentMilestone.prohibited.map((p, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <X className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Informações Extras de Micronutrientes a monitorar */}
        {currentMilestone.nutrientsToMonitor && (
          <div className="border border-indigo-100 bg-indigo-50/10 p-5 rounded-2xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-3 flex items-center gap-1">
              <HelpCircle className="w-4 h-4" />
              Micronutrientes Chave para Monitoramento nesta Fase:
            </h4>
            <div className="flex flex-wrap gap-2">
              {currentMilestone.nutrientsToMonitor.map((nut, idx) => {
                const metadata = NUTRIENT_METADATA[nut];
                return (
                  <div key={idx} className="group relative bg-white border border-indigo-50 hover:border-indigo-200 p-3 rounded-xl shadow-xs transition-all flex xl:w-[230px] flex-col">
                    <span className="font-bold text-sm text-indigo-800">{nut}</span>
                    <span className="text-[10px] text-gray-500 leading-tight mt-1">{metadata?.desc || "Nutriente de alta prioridade."}</span>
                    <span className="text-[9px] font-semibold text-indigo-600 bg-slate-50 rounded px-1.5 py-0.5 w-fit mt-2">
                      Fonte: {metadata?.source?.split(", ")[0]}...
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Alertas Automáticos */}
        <div className="bg-amber-50/50 rounded-2xl border border-amber-100 p-5">
          <h4 className="flex items-center gap-2 font-bold text-amber-800 text-xs uppercase tracking-widest mb-3">
            <AlertOctagon className="w-4 h-4 text-amber-600 shrink-0" />
            Alertas Importantes e Segurança
          </h4>
          <div className="space-y-2 text-xs text-amber-900 leading-relaxed">
            {currentMilestone.alerts.map((alert, idx) => (
              <p key={idx} className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5 font-bold shrink-0">•</span>
                <span>{alert}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
