/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { FAST_FOOD_QUERIES } from "../utils/nutritionData";
import { FoodAnalysis, ChildProfile } from "../types";
import { Search, ShieldCheck, AlertTriangle, AlertCircle, Sparkles, HelpCircle, FileText, ArrowRight } from "lucide-react";

interface AlertaMamaeSearchProps {
  activeProfile: ChildProfile | null;
}

export default function AlertaMamaeSearch({ activeProfile }: AlertaMamaeSearchProps) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<FoodAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default age group to search for if no children profiled
  const displayAge = activeProfile
    ? `${activeProfile.name} (${Math.round(activeProfile.weight)}kg, ${(
        activeProfile.birthDate
          ? Math.floor((new Date().getTime() - new Date(activeProfile.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 30.4))
          : 6
      )} meses)`
    : "6 meses";

  const getAgeInMonths = (): number => {
    if (!activeProfile || !activeProfile.birthDate) return 6;
    const dob = new Date(activeProfile.birthDate);
    const now = new Date();
    return Math.max(1, (now.getFullYear() - dob.getFullYear()) * 12 + now.getMonth() - dob.getMonth());
  };

  const handleSearch = async (foodName: string) => {
    if (!foodName.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const cleanQuery = foodName.trim().toLowerCase();
    
    // 1. Look up locally in our ultra-fast preselected medical database
    if (FAST_FOOD_QUERIES[cleanQuery]) {
      setTimeout(() => {
        setResult(FAST_FOOD_QUERIES[cleanQuery]);
        setLoading(false);
      }, 350); // Slight pleasant animation delay
      return;
    }

    // 2. Query our backend Express server that utilizes the real server-side Gemini 3.5 API
    try {
      const response = await fetch("/api/alerta-mamae", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          foodName: foodName.trim(),
          ageMonths: getAgeInMonths(),
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao consultar a base de dados inteligente.");
      }

      const data: FoodAnalysis = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError("Ops! Não foi possível processar a consulta via IA neste momento. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = (preset: string) => {
    setQuery(preset);
    handleSearch(preset);
  };

  const ratingStyles = (rating: FoodAnalysis["rating"]) => {
    switch (rating) {
      case "NAO_RECOMENDADO":
        return {
          bg: "bg-rose-50 border-rose-200",
          text: "text-rose-700",
          icon: <AlertTriangle className="w-8 h-8 text-rose-500" />,
          label: "🔴 NÃO RECOMENDADO / PROIBIDO",
          badge: "bg-rose-100 text-rose-800"
        };
      case "CONSUMO_MODERADO":
        return {
          bg: "bg-amber-50 border-amber-200",
          text: "text-amber-700",
          icon: <AlertCircle className="w-8 h-8 text-amber-500" />,
          label: "🟡 CONSUMO MODERADO / ATENÇÃO",
          badge: "bg-amber-100 text-amber-800"
        };
      case "RECOMENDADO":
      default:
        return {
          bg: "bg-orange-50 border-orange-150",
          text: "text-orange-950",
          icon: <ShieldCheck className="w-8 h-8 text-orange-500" />,
          label: "🟢 RECOMENDADO / SEGURO",
          badge: "bg-orange-100 text-orange-850"
        };
    }
  };

  return (
    <div id="alerta-mamae-search" className="bg-white rounded-3xl border border-orange-100/45 shadow-xs p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-orange-500 animate-gentle-pulse" />
        <h2 className="text-base font-black text-gray-850 tracking-tight">Alerta Mamãe - Search</h2>
      </div>

      <p className="text-[11px] text-gray-500 mb-4 font-semibold leading-relaxed">
        Digite um alimento para saber instantaneamente o veredito científico para a faixa de <strong className="text-orange-600 font-extrabold">{displayAge}</strong>.
      </p>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-1.5 mb-4 items-center">
        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider shrink-0">Favoritos:</span>
        <button onClick={() => handlePresetClick("Mel")} className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100/55 rounded-lg text-[10px] font-bold">
          🍯 Mel
        </button>
        <button onClick={() => handlePresetClick("Leite Ninho")} className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-100/55 rounded-lg text-[10px] font-bold">
          🥛 Leite Ninho
        </button>
        <button onClick={() => handlePresetClick("Ovo")} className="px-2 py-0.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-100 rounded-lg text-[10px] font-bold font-sans">
          🍳 Ovo
        </button>
        <button onClick={() => handlePresetClick("Leite de Vaca")} className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100/55 rounded-lg text-[10px] font-bold">
          🥛 Leite Vaca
        </button>
      </div>

      {/* Input bar */}
      <div className="flex gap-1.5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Ex: Abacaxi, Salsicha, Brócolis..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all font-semibold"
          />
        </div>
        <button
          onClick={() => handleSearch(query)}
          disabled={loading || !query.trim()}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-2xl transition-all disabled:opacity-40 flex items-center gap-1 shrink-0 active:scale-95 shadow-xs"
        >
          {loading ? "Busca..." : "Buscar"}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Search results display */}
      {loading && (
        <div className="mt-5 flex flex-col items-center justify-center py-8 bg-orange-50/10 rounded-2xl border border-dashed border-orange-100/40">
          <div className="w-7 h-7 rounded-full border-3 border-orange-500 border-t-transparent animate-spin mb-2.5"></div>
          <p className="text-[10px] text-orange-850 font-bold uppercase tracking-wider animate-pulse text-center px-4 leading-normal">Consolidando diretrizes SBP / OMS / UNICEF...</p>
        </div>
      )}

      {error && (
        <div className="mt-5 bg-rose-50 border border-rose-100 text-rose-700 p-3 rounded-2xl text-[10px] font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className={`mt-5 border p-5 rounded-3xl transition-all shadow-2xs ${ratingStyles(result.rating).bg}`}>
          {/* Header row */}
          <div className="flex gap-3 items-start border-b border-orange-100/35 pb-3 mb-3">
            <div className="shrink-0 mt-0.5">
              {ratingStyles(result.rating).icon}
            </div>
            <div className="min-w-0">
              <span className={`px-2 py-0.2 rounded-md text-[8.5px] font-black uppercase tracking-wider ${ratingStyles(result.rating).badge}`}>
                {result.rating.replace("_", " ")}
              </span>
              <h3 className="text-sm font-black text-gray-850 font-display mt-0.5 tracking-tight truncate">{query.toUpperCase()}</h3>
              <p className="text-[10px] text-gray-400 font-extrabold">Janela recomendada: {result.ageLimitation}</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs text-gray-750">
            {/* Scientific Explanation */}
            <div>
              <h4 className="font-extrabold text-gray-800 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1 leading-none">
                <FileText className="w-3.5 h-3.5 text-gray-400" />
                Explicação Científica
              </h4>
              <p className="text-[11px] leading-relaxed text-gray-650 bg-white/70 p-3 rounded-2xl border border-orange-100/20 font-semibold shadow-2xs">
                {result.reason}
              </p>
            </div>

            {/* Two-Column Grid: Risks vs Benefits */}
            <div className="space-y-3">
              <div>
                <h4 className="font-black text-rose-850 text-[10px] uppercase tracking-wider mb-1 leading-none">Riscos do alimento antes do tempo</h4>
                <div className="space-y-1">
                  {result.risks.length > 0 ? (
                    result.risks.map((r, idx) => (
                      <span key={idx} className="block text-[10.5px] text-rose-700 bg-rose-50/45 border border-rose-100/55 px-2.5 py-1 rounded-xl leading-snug font-semibold">
                        • {r}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-gray-400 italic">Sem riscos relevantes relatados.</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-black text-amber-950 text-[10px] uppercase tracking-wider mb-1 leading-none">Nutrientes e Benefícios</h4>
                <div className="space-y-1">
                  {result.benefits.length > 0 ? (
                    result.benefits.map((b, idx) => (
                      <span key={idx} className="block text-[10.5px] text-orange-800 bg-orange-50/35 border border-orange-100/35 px-2.5 py-1 rounded-xl leading-snug font-semibold">
                        • {b}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-gray-400 italic">Sem benefícios relevantes nesse estágio nutricional.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Alternatives */}
            {result.alternatives.length > 0 && (
              <div>
                <h4 className="font-bold text-slate-800 text-[10px] uppercase tracking-wider mb-1 leading-none">Alternativas Seguras</h4>
                <div className="flex flex-wrap gap-1">
                  {result.alternatives.map((alt, idx) => (
                    <span key={idx} className="bg-slate-50 border border-slate-200/60 text-slate-700 px-2.5 py-1 rounded-xl text-[10px] font-bold">
                      {alt}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* How to Introduce */}
            {result.howToIntroduce && (
              <div>
                <h4 className="font-bold text-gray-800 text-[10px] uppercase tracking-wider mb-1 leading-none">Como Introduzir Recomendadamente</h4>
                <p className="text-[10.5px] text-amber-900 bg-amber-50/40 px-3 py-2 rounded-2xl border border-amber-100/30 leading-snug font-semibold">
                  {result.howToIntroduce}
                </p>
              </div>
            )}

            {/* Scientific sources */}
            {result.source && (
              <div className="border-t border-orange-100/30 pt-2.5 flex items-center justify-between text-[9px] text-gray-400 font-semibold leading-none">
                <span className="flex items-center gap-1 font-semibold">
                  <HelpCircle className="w-3 h-3 text-gray-400" />
                  Fonte: {result.source}
                </span>
                <span>Última revisão científica: 2026</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
