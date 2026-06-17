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
    <div id="vitamin-meter-panel" className="bg-white rounded-3xl border border-orange-100/40 shadow-xs p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Visual Vitamin Dashboard - 7 columns */}
      <div className="lg:col-span-7 space-y-4">
        <div className="flex items-center gap-2 border-b border-orange-50/70 pb-3 mb-1">
          <Award className="w-5 h-5 text-orange-500 animate-gentle-pulse" />
          <div>
            <h2 className="text-base font-black text-gray-800 tracking-tight font-display">Vitaminômetro Kids</h2>
            <p className="text-[10px] text-gray-450 leading-none">
              Recomendação OMS/SBP: <strong className="text-slate-700 font-bold">{currentCategory.replace("_", " ")}</strong>
            </p>
          </div>
        </div>

        {/* Vitamin/Mineral grid bars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {renderVitamins.map((vit) => {
            const percentage = Math.min(100, Math.round((vit.current / vit.target) * 100));
            return (
              <div key={vit.label} className="p-3 bg-gray-50/50 rounded-xl border border-gray-100/30 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-[11px] text-gray-700 block">{vit.label}</span>
                    <span className="text-[9px] text-gray-400 leading-tight block truncate max-w-[120px]" title={NUTRIENT_METADATA[vit.label]?.desc}>
                      {NUTRIENT_METADATA[vit.label]?.desc}
                    </span>
                  </div>
                  <span className="text-[9.5px] font-extrabold text-slate-800 shrink-0">
                    {percentage}%
                  </span>
                </div>

                <div className="mt-3">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                       className={`h-full rounded-full transition-all duration-500 ${vit.color}`}
                       style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-[9.5px] font-bold text-slate-500 mt-1 block">
                    {vit.current.toFixed(1)} / {vit.target} {vit.unit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Smart Alerts list */}
        {activeAlerts.length > 0 && (
          <div className="bg-amber-50/45 p-3.5 rounded-2xl border border-amber-100/70 mt-2 space-y-1.5">
            <span className="text-[9px] font-black text-amber-850 uppercase tracking-widest block leading-none">⚠️ Alertas Nutricionais</span>
            {activeAlerts.map((alert, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[11px] text-amber-900 leading-snug font-medium">
                <AlertTriangle className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                <span>{alert}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic Journal Registration - 5 columns */}
      <div className="lg:col-span-5 border-l border-gray-100 lg:pl-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-50 pb-3">
          <h3 className="font-black text-gray-800 text-xs uppercase tracking-wider font-display">Diário de Alimentação</h3>
          {logs.length > 0 && (
            <button
              onClick={handleClearLogs}
              className="text-[10px] font-bold text-rose-500 hover:underline"
            >
              Excluir Tudo
            </button>
          )}
        </div>

        {/* Logging Form */}
        <form onSubmit={handleAddFood} className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-gray-100/50">
          <div>
            <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Qual alimento deu hoje?</label>
            <input
              type="text"
              required
              placeholder="Ex: Banana amassada, Gema de ovo..."
              value={inputFood}
              onChange={(e) => setInputFood(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-400 font-semibold"
            />
          </div>

          <div>
            <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Porção oferecida</label>
            <input
              type="text"
              placeholder="Ex: 1 banana, 1 gema..."
              value={inputPortion}
              onChange={(e) => setInputPortion(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-400 font-semibold"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-xs flex items-center justify-center gap-1 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Lançar Alimento
          </button>
        </form>

        {/* Current list of items */}
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {logs.length > 0 ? (
            logs.map((log) => (
              <div key={log.id} className="p-3 bg-white border border-gray-100 rounded-xl flex items-center justify-between gap-2 shadow-xs">
                <div className="min-w-0">
                  <span className="block font-bold text-xs text-slate-800 truncate">{log.foodName}</span>
                  <div className="flex gap-2 items-center text-[10px] text-gray-400 font-medium mt-0.5">
                    <span>{log.portionSize}</span>
                    <span>•</span>
                    <span>{log.calories} kcal</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Micro list of added vitamins */}
                  <div className="flex flex-wrap gap-0.5 max-w-[90px] justify-end">
                    {Object.keys(log.vitaminsAndMinerals).map((vit) => (
                      <span key={vit} className="text-[8px] bg-slate-50 border border-slate-100 text-gray-500 px-1 py-0.2 rounded-sm shrink-0">
                        {vit.split(" ")[1] || vit}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => handleRemoveLog(log.id)}
                    className="p-1 hover:bg-rose-50 text-rose-450 hover:text-rose-600 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 border border-dashed border-gray-150 rounded-xl bg-gray-50/20">
              <Smile className="w-6 h-6 text-gray-300 mx-auto mb-1.5" />
              <p className="text-xs text-gray-400 font-semibold mb-0.5">Nenhum lançamento hoje</p>
              <p className="text-[10px] text-gray-400">Lance alimentos acima para acumular vitaminas!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
