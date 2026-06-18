/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ChildProfile, GrowthRecord } from "../types";
import { WHO_BOY_GROWTH_CURVES, WHO_GIRL_GROWTH_CURVES, calculateChildMetrics } from "../utils/nutritionData";
import { TrendingUp, Plus, Trash2, Calendar, Scale, Ruler, Sparkles, HelpCircle } from "lucide-react";

interface GrowthCurveChartProps {
  activeProfile: ChildProfile | null;
}

export default function GrowthCurveChart({ activeProfile }: GrowthCurveChartProps) {
  const metrics = activeProfile ? calculateChildMetrics(activeProfile.birthDate) : null;
  const currentMonths = metrics?.ageMonths || 0;

  const [activeTab, setActiveTab] = useState<"weight" | "height">("weight");

  // Dynamic user-recorded growth milestones logs
  const [records, setRecords] = useState<GrowthRecord[]>(() => {
    const saved = localStorage.getItem(`nutrikids_growth_records_${activeProfile?.id || "global"}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Re-load records when profile switches
  useEffect(() => {
    const saved = localStorage.getItem(`nutrikids_growth_records_${activeProfile?.id || "global"}`);
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        setRecords([]);
      }
    } else if (activeProfile) {
      // Seed initial points representing birh values up to current profiled metrics
      const baseline: GrowthRecord[] = [
        {
          id: "r1",
          date: new Date(new Date(activeProfile.birthDate).setMonth(new Date(activeProfile.birthDate).getMonth() + 0)).toISOString().split("T")[0],
          ageMonths: 0,
          weight: activeProfile.gender === "M" ? 3.3 : 3.2,
          height: activeProfile.gender === "M" ? 50 : 49,
          bmi: activeProfile.gender === "M" ? 13.2 : 13.1,
        }
      ];
      // Seed second point at 1/2 of current age (if 4+ months)
      if (currentMonths >= 4) {
        const halfMonths = Math.floor(currentMonths / 2);
        baseline.push({
          id: "r2",
          date: new Date(new Date(activeProfile.birthDate).setMonth(new Date(activeProfile.birthDate).getMonth() + halfMonths)).toISOString().split("T")[0],
          ageMonths: halfMonths,
          weight: +(activeProfile.weight * 0.7).toFixed(1),
          height: +(activeProfile.height * 0.85).toFixed(1),
          bmi: +((activeProfile.weight * 0.7) / Math.pow((activeProfile.height * 0.85) / 100, 2)).toFixed(1),
        });
      }
      // Seed current point
      baseline.push({
        id: "r3",
        date: new Date().toISOString().split("T")[0],
        ageMonths: currentMonths,
        weight: activeProfile.weight,
        height: activeProfile.height,
        bmi: +(activeProfile.weight / Math.pow(activeProfile.height / 100, 2)).toFixed(1),
      });

      // Maintain sorted
      setRecords(baseline.sort((a,b) => a.ageMonths - b.ageMonths));
    } else {
      setRecords([]);
    }
  }, [activeProfile]);

  // Persist records to localStorage
  useEffect(() => {
    if (activeProfile) {
      localStorage.setItem(`nutrikids_growth_records_${activeProfile.id}`, JSON.stringify(records));
    }
  }, [records, activeProfile]);

  // Input states
  const [newAge, setNewAge] = useState(currentMonths);
  const [newWeight, setNewWeight] = useState(activeProfile?.weight || 7.5);
  const [newHeight, setNewHeight] = useState(activeProfile?.height || 68);

  useEffect(() => {
    if (activeProfile) {
      setNewAge(currentMonths);
      setNewWeight(activeProfile.weight);
      setNewHeight(activeProfile.height);
    }
  }, [activeProfile, currentMonths]);

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProfile) return;

    const bmi = +(newWeight / Math.pow(newHeight / 100, 2)).toFixed(1);
    const newRec: GrowthRecord = {
      id: Math.random().toString(36).substring(7),
      date: new Date().toISOString().split("T")[0],
      ageMonths: newAge,
      weight: newWeight,
      height: newHeight,
      bmi,
    };

    // Filter out if duplicate age recorded or override
    setRecords((prev) => {
      const filtered = prev.filter((r) => r.ageMonths !== newAge);
      return [...filtered, newRec].sort((a, b) => a.ageMonths - b.ageMonths);
    });
  };

  const handleRemoveRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  // Determine correct WHO curve reference based on gender
  const isBoy = activeProfile?.gender === "M";
  const whoCurves = isBoy ? WHO_BOY_GROWTH_CURVES : WHO_GIRL_GROWTH_CURVES;

  // Render SVG Chart helpers
  // We plot months on X axis (0 to 120), values on Y axis
  const maxMonths = 120; // Up to 10 years
  const xMin = 0;
  const xMax = maxMonths;

  // Dynamically determine Y min and max values based on tab
  const getMinMaxY = () => {
    if (activeTab === "weight") {
      return { yMin: 0, yMax: 45, unit: "kg", titleY: "Peso" };
    } else {
      return { yMin: 40, yMax: 155, unit: "cm", titleY: "Altura" };
    }
  };

  const { yMin, yMax, unit, titleY } = getMinMaxY();

  // Width & height inside SVG viewbox dimensions
  const svgW = 600;
  const svgH = 320;
  const paddingLeft = 50;
  const paddingRight = 40;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartW = svgW - paddingLeft - paddingRight;
  const chartH = svgH - paddingTop - paddingBottom;

  // Convert coordinate spaces
  const getX = (months: number) => paddingLeft + (months / xMax) * chartW;
  const getY = (val: number) => {
    const ratio = (val - yMin) / (yMax - yMin);
    return paddingTop + chartH - ratio * chartH;
  };

  // Generate polyline path coordinates for WHO guidelines
  let p15Path = "";
  let p50Path = "";
  let p85Path = "";

  whoCurves.forEach((pt) => {
    const x = getX(pt.ageMonths).toFixed(1);
    const valueY = activeTab === "weight" ? pt.weightP15 : pt.heightP15;
    const y = getY(valueY).toFixed(1);
    p15Path += `${x},${y} `;

    const valueY50 = activeTab === "weight" ? pt.weightP50 : pt.heightP50;
    const y50 = getY(valueY50).toFixed(1);
    p50Path += `${x},${y50} `;

    const valueY85 = activeTab === "weight" ? pt.weightP85 : pt.heightP85;
    const y85 = getY(valueY85).toFixed(1);
    p85Path += `${x},${y85} `;
  });

  return (
    <div id="growth-curve-section" className="bg-white rounded-3xl border border-orange-100/40 shadow-xs overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-400 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white leading-tight">Curva de Crescimento</h2>
              <p className="text-[9px] text-white/75 font-medium mt-0.5">Percentis oficiais OMS/SBP</p>
            </div>
          </div>
          {/* Tab triggers */}
          <div className="flex gap-1 bg-white/20 border border-white/25 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("weight")}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
              activeTab === "weight" ? "bg-white/90 text-slate-800 shadow-2xs" : "text-white/70 hover:text-white"
            }`}
          >
            Peso (kg)
          </button>
          <button
            onClick={() => setActiveTab("height")}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
              activeTab === "height" ? "bg-white/90 text-slate-800 shadow-2xs" : "text-white/70 hover:text-white"
            }`}
          >
            Altura (cm)
          </button>
        </div>
        </div>
      </div>

      <div className="p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SVG Graphic - 8 columns */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-50 p-2 sm:p-4 rounded-3xl border border-gray-100 flex items-center justify-center relative">
            
            {/* Legend guide flags overlay */}
            <div className="absolute top-3 right-3 flex flex-wrap gap-2 text-[9px] font-bold tracking-wider">
              <span className="flex items-center gap-1 text-amber-500">
                <span className="w-2.5 h-0.5 bg-amber-300 inline-block border-t border-dashed"></span>
                P85 (Superior)
              </span>
              <span className="flex items-center gap-1 text-orange-600">
                <span className="w-2.5 h-0.5 bg-orange-500 inline-block"></span>
                P50 (Mediana SBP)
              </span>
              <span className="flex items-center gap-1 text-amber-500">
                <span className="w-2.5 h-0.5 bg-amber-300 inline-block border-t border-dashed"></span>
                P15 (Inferior)
              </span>
              <span className="flex items-center gap-1 text-indigo-600">
                <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block"></span>
                Seu Filho
              </span>
            </div>
 
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto overflow-visible select-none">
              {/* Background grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const yVal = yMin + ratio * (yMax - yMin);
                const y = getY(yVal);
                return (
                  <g key={idx}>
                    <line x1={paddingLeft} y1={y} x2={svgW - paddingRight} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                    <text x={paddingLeft - 8} y={y + 3} textAnchor="end" className="text-[9px] fill-gray-400 font-bold font-mono">
                      {Math.round(yVal)} {unit}
                    </text>
                  </g>
                );
              })}
 
              {/* Month X grid axes labels */}
              {[0, 12, 24, 36, 48, 60, 72, 84, 96, 108, maxMonths].map((m) => {
                const x = getX(m);
                return (
                  <g key={m}>
                    <line x1={x} y1={paddingTop} x2={x} y2={svgH - paddingBottom} stroke="#f1f5f9" strokeWidth="1" />
                    <text x={x} y={svgH - paddingBottom + 14} textAnchor="middle" className="text-[9px] fill-gray-400 font-bold font-mono">
                      {m === 0 ? "nasc" : m}m
                    </text>
                  </g>
                );
              })}
 
              {/* WHO percentiles paths */}
              <polyline points={p15Path} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />
              <polyline points={p50Path} fill="none" stroke="#f97316" strokeWidth="2.2" />
              <polyline points={p85Path} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />
 
              {/* Plotted Child points line */}
              {records.length > 1 && (
                <polyline
                  points={records
                    .map((r) => {
                      const val = activeTab === "weight" ? r.weight : r.height;
                      return `${getX(r.ageMonths).toFixed(1)},${getY(val).toFixed(1)}`;
                    })
                    .join(" ")}
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                />
              )}
 
              {/* Render Dot plots */}
              {records.map((r) => {
                const val = activeTab === "weight" ? r.weight : r.height;
                const x = getX(r.ageMonths);
                const y = getY(val);
                return (
                  <g key={r.id} className="group cursor-pointer">
                    <circle cx={x} cy={y} r="5" fill="#4f46e5" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx={x} cy={y} r="8" fill="#4f46e5" opacity="0.1" className="hover:scale-150 transition-all duration-300" />
                    
                    {/* Floating coordinate tooltip */}
                    <text x={x} y={y - 10} textAnchor="middle" className="text-[8px] font-bold fill-indigo-800 bg-white px-1">
                      {val} {unit}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
 
          <div className="bg-orange-50/20 p-4 rounded-xl border border-orange-100/50">
            <span className="text-[10px] uppercase font-bold tracking-widest text-orange-850 flex items-center gap-1 mb-1.5">
              <HelpCircle className="w-4 h-4 text-orange-500" />
              Percentis WHO / SBP:
            </span>
            <p className="text-[11px] text-gray-500 leading-normal">
              A linha do meio <strong className="text-orange-600">P50 (Laranja)</strong> é a mediana perfeita calculada cientificamente pela Organização Mundial da Saúde baseada em amostragem infantil saudável. Flutuar confortavelmente entre as réguas pontilhadas <strong className="text-amber-700">P15 e P85 (Amarelas)</strong> indica um crescimento natural, seguro e pleno. Sempre consulte seu pediatra de confiança.
            </p>
          </div>
        </div>

        {/* Record Log form & records list - 4 columns */}
        <div className="lg:col-span-4 border-l border-gray-100 lg:pl-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-55 pb-3">
            <h3 className="font-black text-gray-800 text-xs uppercase tracking-wider font-display">Controle de Medidas</h3>
            <span className="text-[9px] text-slate-400 font-bold font-mono">Histórico ({records.length})</span>
          </div>

          {activeProfile ? (
            <form onSubmit={handleAddRecord} className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-gray-100/50">
              <span className="text-[10px] font-black text-orange-850 bg-orange-50/65 px-2 py-0.5 border border-orange-100/30 rounded-md uppercase tracking-wider block text-center">Registrar Medidas</span>
              
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Idade correspondente (meses)</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={newAge}
                  onChange={(e) => setNewAge(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-400 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max="60"
                     value={newWeight}
                    onChange={(e) => setNewWeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-400 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Altura (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="150"
                    value={newHeight}
                    onChange={(e) => setNewHeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-400 font-semibold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-xs active:scale-95"
              >
                Plotar na Curva
              </button>
            </form>
          ) : (
            <div className="p-4 bg-orange-50 border border-orange-100/50 rounded-2xl text-xs text-orange-850 font-medium leading-normal">
              Selecione ou cadastre um perfil infantil acima para habilitar o registro de medições e plotagem da curva de percentis.
            </div>
          )}

          {/* Historical List */}
          <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
            {records.map((r) => (
              <div key={r.id} className="p-2.5 bg-white border border-gray-100 rounded-lg flex items-center justify-between text-xs shadow-xs">
                <div>
                  <span className="font-bold text-gray-800">{r.ageMonths} meses</span>
                  <div className="flex gap-2 text-[10px] text-gray-400 mt-0.5 font-medium">
                    <span>{r.weight} kg</span>
                    <span>•</span>
                    <span>{r.height} cm</span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveRecord(r.id)}
                  className="p-1 hover:bg-rose-50 text-rose-550 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>
      </div>{/* end p-4 */}
    </div>
  );
}
