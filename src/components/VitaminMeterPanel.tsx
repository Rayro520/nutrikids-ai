/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ChildProfile, DailyFoodLog, VitaminValue } from "../types";
import { getRecommendedVitamins, calculateChildMetrics, NUTRIENT_METADATA } from "../utils/nutritionData";
import { Sparkles, Plus, Trash2, AlertTriangle, CheckCircle2, Award, Info, Smile } from "lucide-react";

interface VitaminMeterPanelProps {
  activeProfile: ChildProfile | null;
  onAddLogMessage?: (msg: string) => void;
}

export default function VitaminMeterPanel({ activeProfile, onAddLogMessage }: VitaminMeterPanelProps) {
  const metrics = activeProfile ? calculateChildMetrics(activeProfile.birthDate) : null;
  const currentCategory = metrics?.category || "6-12_months";
  const rdaTargets = getRecommendedVitamins(currentCategory);

  // States to represent logged foods and vitamins
  const [logs, setLogs] = useState<DailyFoodLog[]>(() => {
    const saved = localStorage.getItem("nutrikids_food_logs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    // Seed default logs for demonstrating
    return [
      {
        id: "log_seed_1",
        foodName: "Mamão Papaia Amassado",
        portionSize: "1/2 mamão pequeno",
        calories: 60,
        vitaminsAndMinerals: {
          "Vitamina A": 140,
          "Vitamina C": 35,
          "Potássio": 120,
        },
        timestamp: new Date().toISOString(),
      },
      {
        id: "log_seed_2",
        foodName: "Gema de Ovo Cozida",
        portionSize: "1 gema",
        calories: 55,
        vitaminsAndMinerals: {
          "Ferro": 1.2,
          "Zinco": 0.6,
          "Vitamina D": 1.5,
          "Vitamina B12": 0.3,
        },
        timestamp: new Date().toISOString(),
      },
    ];
  });

  const [inputFood, setInputFood] = useState("");
  const [inputPortion, setInputPortion] = useState("1 porção");

  // Save logs to localStorage on changes
  useEffect(() => {
    localStorage.setItem("nutrikids_food_logs", JSON.stringify(logs));
  }, [logs]);

  // Aggregate current values logged today
  const [dailyTotals, setDailyTotals] = useState<Record<string, number>>({});

  useEffect(() => {
    const totals: Record<string, number> = {
      "Vitamina A": 0,
      "Vitamina C": 0,
      "Vitamina D": 0,
      "Vitamina B12": 0,
      "Ferro": 0,
      "Zinco": 0,
      "Magnésio": 0,
      "Cálcio": 0,
      "Potássio": 0,
    };

    logs.forEach((log) => {
      Object.entries(log.vitaminsAndMinerals).forEach(([vit, val]) => {
        if (totals[vit] !== undefined) {
          totals[vit] += val || 0;
        }
      });
    });

    setDailyTotals(totals);
  }, [logs]);

  // Handle dynamic nutrient prediction of typed foods
  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputFood.trim()) return;

    // Fast keyword mapper to estimate vitamins
    const clean = inputFood.toLowerCase();
    const vitamins: DailyFoodLog["vitaminsAndMinerals"] = {};
    let cal = 50;

    if (clean.includes("banana")) {
      vitamins["Vitamina C"] = 8;
      vitamins["Potássio"] = 350;
      vitamins["Magnésio"] = 27;
      cal = 90;
    } else if (clean.includes("mamão") || clean.includes("mamao")) {
      vitamins["Vitamina A"] = 150;
      vitamins["Vitamina C"] = 40;
      vitamins["Potássio"] = 150;
      cal = 50;
    } else if (clean.includes("cenoura") || clean.includes("cenourinha")) {
      vitamins["Vitamina A"] = 380;
      vitamins["Vitamina C"] = 4;
      vitamins["Cálcio"] = 30;
      cal = 30;
    } else if (clean.includes("abóbora") || clean.includes("abobora")) {
      vitamins["Vitamina A"] = 230;
      vitamins["Vitamina C"] = 8;
      vitamins["Potássio"] = 200;
      cal = 35;
    } else if (clean.includes("frango") || clean.includes("franguinho")) {
      vitamins["Ferro"] = 1.1;
      vitamins["Zinco"] = 0.9;
      vitamins["Vitamina B12"] = 0.25;
      cal = 120;
    } else if (clean.includes("carne") || clean.includes("moída") || clean.includes("moida")) {
      vitamins["Ferro"] = 2.4;
      vitamins["Zinco"] = 2.1;
      vitamins["Vitamina B12"] = 0.8;
      cal = 140;
    } else if (clean.includes("ovo")) {
      vitamins["Ferro"] = 1.3;
      vitamins["Zinco"] = 0.7;
      vitamins["Vitamina D"] = 1.6;
      vitamins["Vitamina B12"] = 0.45;
      cal = 70;
    } else if (clean.includes("feijão") || clean.includes("feijao")) {
      vitamins["Ferro"] = 1.8;
      vitamins["Zinco"] = 0.8;
      vitamins["Magnésio"] = 35;
      vitamins["Potássio"] = 240;
      cal = 85;
    } else if (clean.includes("espinafre") || clean.includes("couve") || clean.includes("brócolis") || clean.includes("brocolis")) {
      vitamins["Vitamina A"] = 180;
      vitamins["Vitamina C"] = 15;
      vitamins["Ferro"] = 0.8;
      vitamins["Cálcio"] = 45;
      cal = 20;
    } else if (clean.includes("leite") || clean.includes("fórmula") || clean.includes("formula")) {
      vitamins["Cálcio"] = 120;
      vitamins["Vitamina D"] = 2.0;
      vitamins["Vitamina B12"] = 0.4;
      vitamins["Potássio"] = 140;
      cal = 100;
    } else {
      // General balanced guess if unknown
      vitamins["Vitamina C"] = 5;
      vitamins["Cálcio"] = 15;
      vitamins["Ferro"] = 0.3;
      cal = 40;
    }

    const newLog: DailyFoodLog = {
      id: Math.random().toString(36).substring(7),
      foodName: inputFood.trim(),
      portionSize: inputPortion.trim(),
      calories: cal,
      vitaminsAndMinerals: vitamins,
      timestamp: new Date().toISOString(),
    };

    setLogs((prev) => [newLog, ...prev]);
    setInputFood("");
    setInputPortion("1 porção");

    if (onAddLogMessage) {
      onAddLogMessage(`Alimento "${newLog.foodName}" registrado com sucesso! Atualizando Vitaminômetro copilado.`);
    }
  };

  const handleRemoveLog = (id: string) => {
    setLogs((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearLogs = () => {
    if (confirm("Gostaria de limpar todo o diário alimentar de hoje?")) {
      setLogs([]);
    }
  };

  // Convert map to layout data
  const renderVitamins: VitaminValue[] = [
    { label: "Vitamina A", current: dailyTotals["Vitamina A"] || 0, target: rdaTargets.vitaminA, unit: "mcg", color: "bg-orange-500" },
    { label: "Vitamina C", current: dailyTotals["Vitamina C"] || 0, target: rdaTargets.vitaminC, unit: "mg", color: "bg-amber-400" },
    { label: "Vitamina D", current: dailyTotals["Vitamina D"] || 0, target: rdaTargets.vitaminD, unit: "mcg", color: "bg-orange-400" },
    { label: "Vitamina B12", current: dailyTotals["Vitamina B12"] || 0, target: rdaTargets.vitaminB12, unit: "mcg", color: "bg-yellow-400" },
    { label: "Ferro", current: dailyTotals["Ferro"] || 0, target: rdaTargets.iron, unit: "mg", color: "bg-rose-450" },
    { label: "Zinco", current: dailyTotals["Zinco"] || 0, target: rdaTargets.zinc, unit: "mg", color: "bg-orange-600" },
    { label: "Magnésio", current: dailyTotals["Magnésio"] || 0, target: rdaTargets.magnesium, unit: "mg", color: "bg-amber-600" },
    { label: "Cálcio", current: dailyTotals["Cálcio"] || 0, target: rdaTargets.calcium, unit: "mg", color: "bg-amber-500" },
    { label: "Potássio", current: dailyTotals["Potássio"] || 0, target: rdaTargets.potassium, unit: "mg", color: "bg-orange-355" },
  ];

  // Dynamic status alerts based on logs
  const getDailyAlerts = () => {
    const activeAlerts: string[] = [];

    if (activeProfile) {
      // SBP/OMS special alert: completed exactly 6 months
      const diffMonths = metrics?.ageMonths || 0;
      if (diffMonths === 6 && logs.length === 0) {
        activeAlerts.push("Seu filho completou 6 meses recentemente. É hora ideal de planejar a Introdução Alimentar de transição com bananas, batata doce e legumes.");
      }
    }

    // Low iron alert
    const ironVal = dailyTotals["Ferro"] || 0;
    if (ironVal < rdaTargets.iron * 0.4 && currentCategory === "6-12_months") {
      activeAlerts.push(`O ferro diário está consideravelmente abaixo do recomendado de ${rdaTargets.iron}mg recomendados pela SBP para esta fase crítica de desenvolvimento.`);
    }

    // Low Vit D alert
    const vitDVal = dailyTotals["Vitamina D"] || 0;
    if (vitDVal < rdaTargets.vitaminD * 0.3) {
      activeAlerts.push("Os níveis corporais de absorção de Vitamina D estão abaixo das referências diárias recomendadas.");
    }

    // Safe chocking hazard general checklist
    const containsHazards = logs.some((l) => {
      const fn = l.foodName.toLowerCase();
      return fn.includes("uva") || fn.includes("pipoca") || fn.includes("castanha") || fn.includes("balas") || fn.includes("tomate cereja");
    });

    if (containsHazards) {
      activeAlerts.push("Atenção: Alguns dos alimentos lançados podem apresentar riscos de engasgo/asfixia dependendo de como as porções forem fatiadas e oferecidas!");
    }

    return activeAlerts;
  };

  const activeAlerts = getDailyAlerts();

  return (
    <div id="vitamin-meter-panel" className="bg-white rounded-3xl border border-orange-100/40 shadow-xs overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-400 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white leading-tight">Vitaminômetro</h2>
              <p className="text-[9px] text-white/75 font-medium mt-0.5">Metas diárias OMS/SBP · {currentCategory.replace(/_/g, " ")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-5">

        {/* ── Vitamin bars ── */}
        <div className="space-y-2.5">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Metas diárias</p>
          {renderVitamins.map((vit) => {
            const percentage = Math.min(100, Math.round((vit.current / vit.target) * 100));
            const isOk = percentage >= 70;
            const isLow = percentage < 35;
            return (
              <div key={vit.label} className="flex items-center gap-3">
                {/* Name + desc */}
                <div className="w-24 shrink-0">
                  <span className="text-[11px] font-black text-slate-700 block leading-none">{vit.label}</span>
                  <span className="text-[8.5px] text-gray-400 leading-tight block mt-0.5 truncate" title={NUTRIENT_METADATA[vit.label]?.desc}>
                    {NUTRIENT_METADATA[vit.label]?.desc}
                  </span>
                </div>
                {/* Bar */}
                <div className="flex-1 min-w-0">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${vit.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-[8.5px] text-gray-400 font-medium mt-0.5 block">
                    {vit.current.toFixed(1)} / {vit.target} {vit.unit}
                  </span>
                </div>
                {/* % badge */}
                <span className={`text-[10px] font-extrabold w-9 text-right shrink-0 ${isOk ? "text-emerald-600" : isLow ? "text-rose-500" : "text-amber-600"}`}>
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>

        {/* ── Alerts ── */}
        {activeAlerts.length > 0 && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3.5 space-y-2">
            <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest block">⚠️ Alertas Nutricionais</span>
            {activeAlerts.map((alert, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[11px] text-amber-900 leading-snug font-medium">
                <AlertTriangle className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                <span>{alert}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Food diary ── */}
        <div className="bg-orange-50/30 border border-orange-100/60 rounded-2xl overflow-hidden">
          {/* Section header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-orange-100/50">
            <span className="text-[10px] font-black text-orange-700 uppercase tracking-widest">Diário de Alimentação</span>
            {logs.length > 0 && (
              <button onClick={handleClearLogs} className="text-[10px] font-bold text-rose-400 hover:text-rose-600 transition-colors">
                Limpar tudo
              </button>
            )}
          </div>

          <div className="p-3 space-y-3">
            {/* Input form */}
            <form onSubmit={handleAddFood} className="flex gap-2">
              <div className="flex-1 min-w-0 space-y-1.5">
                <input
                  type="text"
                  required
                  placeholder="Alimento oferecido hoje…"
                  value={inputFood}
                  onChange={(e) => setInputFood(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-orange-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-400 font-semibold"
                />
                <input
                  type="text"
                  placeholder="Porção (ex: 1 banana)"
                  value={inputPortion}
                  onChange={(e) => setInputPortion(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-orange-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-300 font-medium text-gray-600"
                />
              </div>
              <button
                type="submit"
                className="shrink-0 w-10 h-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all active:scale-95 flex items-center justify-center shadow-xs"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {/* Log list */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <div key={log.id} className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-xs">
                    <div className="flex-1 min-w-0">
                      <span className="block font-bold text-xs text-slate-800 truncate">{log.foodName}</span>
                      <span className="text-[9px] text-gray-400 font-medium">{log.portionSize} · {log.calories} kcal</span>
                    </div>
                    <div className="flex gap-0.5 shrink-0">
                      {Object.keys(log.vitaminsAndMinerals).slice(0, 3).map((vit) => (
                        <span key={vit} className="text-[7.5px] bg-orange-50 border border-orange-100 text-orange-600 px-1 py-0.5 rounded font-bold">
                          {vit.split(" ")[1] || vit}
                        </span>
                      ))}
                    </div>
                    <button onClick={() => handleRemoveLog(log.id)} className="p-1 text-gray-300 hover:text-rose-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 border border-dashed border-orange-100 rounded-xl">
                  <Smile className="w-6 h-6 text-orange-200 mx-auto mb-1.5" />
                  <p className="text-xs text-gray-400 font-semibold">Nenhum alimento lançado hoje</p>
                  <p className="text-[10px] text-gray-300 mt-0.5">Adicione para acumular vitaminas!</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>{/* end p-4 */}
    </div>
  );
}
