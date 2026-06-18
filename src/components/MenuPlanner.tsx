/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { SmartMenu, ChildProfile } from "../types";
import { calculateChildMetrics } from "../utils/nutritionData";
import { Sparkles, AlertCircle, ChefHat, Clock, Leaf } from "lucide-react";

interface MenuPlannerProps {
  activeProfile: ChildProfile | null;
}

const MEAL_COLORS: Record<string, { dot: string; label: string; bg: string; border: string }> = {
  "Café da Manhã":   { dot: "bg-amber-400",  label: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-100" },
  "Lanche da Manhã": { dot: "bg-green-400",  label: "text-green-700",  bg: "bg-green-50",  border: "border-green-100" },
  "Almoço":          { dot: "bg-orange-400", label: "text-orange-700", bg: "bg-orange-50", border: "border-orange-100" },
  "Lanche da Tarde": { dot: "bg-teal-400",   label: "text-teal-700",   bg: "bg-teal-50",   border: "border-teal-100"  },
  "Jantar":          { dot: "bg-indigo-400", label: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-100"},
};

function getMealColors(type: string) {
  return MEAL_COLORS[type] ?? { dot: "bg-gray-400", label: "text-gray-600", bg: "bg-gray-50", border: "border-gray-100" };
}

export default function MenuPlanner({ activeProfile }: MenuPlannerProps) {
  const metrics = activeProfile ? calculateChildMetrics(activeProfile.birthDate) : null;
  const currentMonths = metrics?.ageMonths || 6;

  const [promptPreferences, setPromptPreferences] = useState("");
  const [menu, setMenu] = useState<SmartMenu | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentMonths < 6) {
      setMenu({
        meals: [
          { type: "Café da Manhã", time: "07:00", title: "Leite Materno exclusivo", ingredients: ["Leite materno livre demanda"], instructions: "Nenhum complemento necessário nesta fase.", portion: "Livre demanda", nutritionalBenefits: "Padrão-ouro global com todos os anticorpos essenciais." },
          { type: "Almoço",        time: "12:30", title: "Leite Materno / Fórmula", ingredients: ["Leite materno ou fórmula infantil"], instructions: "Se usar fórmula, prepare nas proporções indicadas na embalagem.", portion: "120–150 ml", nutritionalBenefits: "Gorduras saudáveis fundamentais para o desenvolvimento cerebral." },
          { type: "Jantar",        time: "19:00", title: "Leite Materno exclusivo", ingredients: ["Leite materno"], instructions: "Manter a amamentação em livre demanda.", portion: "Livre demanda", nutritionalBenefits: "Nutrição integral para um sono seguro e tranquilo." },
        ],
        pediatricNote: "Abaixo de 6 meses: Aleitamento Materno EXCLUSIVO ou fórmula sob prescrição médica (SBP/OMS/UNICEF).",
        vibeCheck: "Recomendação Classe A"
      });
    } else if (currentMonths < 12) {
      setMenu({
        meals: [
          { type: "Café da Manhã", time: "08:00", title: "Mamão Papaia Raspado", ingredients: ["½ mamão papaia pequeno"], instructions: "Raspe a polpa com uma colher macia. Não bata no liquidificador.", portion: "2–3 colheres de sopa", nutritionalBenefits: "Rica em Vitamina C e fibras que facilitam o trânsito intestinal." },
          { type: "Lanche da Manhã", time: "10:30", title: "Purê de Banana amassada", ingredients: ["1 banana prata pequena"], instructions: "Amasse completamente com garfo até eliminar grumos. Nunca no liquidificador.", portion: "3 colheres de sopa", nutritionalBenefits: "Energia, potássio e vitaminas do complexo B." },
          { type: "Almoço",        time: "12:30", title: "Papa de Abóbora, Feijão e Frango", ingredients: ["1 pedaço de abóbora cozida", "2 col. feijão cozido", "1 col. frango desfiado"], instructions: "Cozinhe tudo e amasse no garfo. Sirva os grupos separados no prato.", portion: "4–5 colheres de sopa", nutritionalBenefits: "Ferro de alta absorção, proteínas e betacaroteno." },
          { type: "Jantar",        time: "18:30", title: "Batata, Chuchu e Gema de Ovo", ingredients: ["½ batata média", "½ chuchu pequeno", "1 gema cozida firme"], instructions: "Cozinhe bem, amasse separado e misture delicadamente com a gema.", portion: "4 colheres de sopa", nutritionalBenefits: "Colina para o cérebro e minerais antioxidantes." },
        ],
        pediatricNote: "Aos 6 meses inicia a introdução alimentar. Ofereça água filtrada ou fervida nos intervalos.",
        vibeCheck: "Guia Alimentar Infantil — Ministério da Saúde"
      });
    } else {
      setMenu({
        meals: [
          { type: "Café da Manhã", time: "08:00", title: "Iogurte com Aveia e Morangos", ingredients: ["1 copo iogurte natural integral", "1 col. aveia em flocos", "3 morangos picados"], instructions: "Misture a aveia ao iogurte e finalize com os morangos higienizados.", portion: "1 taça média", nutritionalBenefits: "Cálcio para os ossos, proteínas e fibras probióticas." },
          { type: "Almoço",        time: "12:00", title: "Arroz, Lentilha, Carne e Brócolis", ingredients: ["3 col. arroz integral", "2 col. lentilha cozida", "1 filé pequeno de patinho", "3 floretes de brócolis"], instructions: "Sirva dividido no pratinho. Cozinhe o brócolis no vapor para preservar os nutrientes.", portion: "Prato infantil balanceado", nutritionalBenefits: "Ferro, Zinco, proteínas e fibras para imunidade sólida." },
          { type: "Lanche da Tarde", time: "15:30", title: "Salada de Frutas com Chia", ingredients: ["½ banana picada", "½ maçã picada", "½ laranja espremida", "1 col. chá de chia"], instructions: "Misture as frutas com o suco de laranja e polvilhe a chia.", portion: "1 xícara média", nutritionalBenefits: "Vitamina C, potássio, fibras solúveis e ômega-3." },
          { type: "Jantar",        time: "19:00", title: "Omelete de Cenoura e Espinafre", ingredients: ["1 ovo inteiro", "1 col. cenoura ralada", "folhas de espinafre"], instructions: "Prepare em frigideira antiaderente com fio de azeite. Cozinhe bem.", portion: "1 omelete médio", nutritionalBenefits: "Proteínas completas, Magnésio e Luteína para a visão." },
        ],
        pediatricNote: "Nesta fase, rotina de lanches e hidratação constante evitam fadiga e desidratação.",
        vibeCheck: "Diretrizes SBP — prevenção da obesidade infantil"
      });
    }
  }, [currentMonths]);

  const handleAIRequest = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ageMonths: currentMonths,
          weight: activeProfile?.weight ? `${activeProfile.weight}kg` : "peso adequado",
          allergies: activeProfile?.allergies || "Nenhuma",
          restrictions: activeProfile?.restrictions || "Nenhuma",
          preferences: promptPreferences.trim() || undefined,
        }),
      });
      if (!response.ok) throw new Error();
      setMenu(await response.json());
    } catch {
      setError("Não foi possível gerar o cardápio. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="menu-planner-section" className="bg-white rounded-3xl border border-orange-100/40 shadow-xs overflow-hidden">

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-400 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white leading-tight">Cardápios SBP</h2>
              <p className="text-[9px] text-white/75 font-medium mt-0.5">Refeições para {currentMonths} meses · IA + OMS</p>
            </div>
          </div>
          <span className="text-[9px] font-black text-white/90 bg-white/20 border border-white/25 px-2.5 py-1 rounded-full">
            {currentMonths}m
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">

        {/* ── AI customizer ── */}
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-3.5 space-y-2.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-[10px] font-black text-orange-700 uppercase tracking-widest">Personalizar com IA</span>
          </div>
          <p className="text-xs text-gray-500 font-medium leading-snug">
            Tem ingredientes em casa? Diga aqui e a IA monta um cardápio exclusivo.
          </p>

          {activeProfile?.allergies && (
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-lg w-fit">
              <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />
              IA ciente: alergia a {activeProfile.allergies}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ex: batata-doce, sem carne vermelha..."
              value={promptPreferences}
              onChange={(e) => setPromptPreferences(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAIRequest()}
              className="flex-1 px-3 py-2 bg-white border border-orange-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
            />
            <button
              onClick={handleAIRequest}
              disabled={loading}
              className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-xl transition-all disabled:opacity-40 flex items-center gap-1.5 active:scale-95 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {loading ? "Gerando…" : "Gerar"}
            </button>
          </div>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="py-12 flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-3 border-orange-500 border-t-transparent animate-spin" />
            <p className="text-xs font-semibold text-gray-400 text-center">Montando cardápio personalizado…</p>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 px-3 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            {error}
          </div>
        )}

        {/* ── Meal cards ── */}
        {!loading && menu && (
          <div className="space-y-3">
            {menu.meals.map((meal, idx) => {
              const c = getMealColors(meal.type);
              return (
                <div key={idx} className={`rounded-2xl border ${c.border} ${c.bg} overflow-hidden`}>
                  {/* Meal header row */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/60">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${c.dot} shrink-0`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${c.label}`}>{meal.type}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                      <Clock className="w-3 h-3" />
                      {meal.time}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-4 py-3 space-y-3 bg-white/70">
                    <h3 className="text-sm font-black text-slate-800 leading-snug">{meal.title}</h3>

                    {/* Ingredients */}
                    <div className="flex flex-wrap gap-1.5">
                      {meal.ingredients.map((ing, i) => (
                        <span key={i} className="text-[10px] bg-white border border-gray-100 rounded-xl px-2.5 py-1 text-gray-600 font-semibold">
                          {ing}
                        </span>
                      ))}
                    </div>

                    {/* Prep */}
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">{meal.instructions}</p>

                    {/* Nutritional benefit + portion */}
                    <div className={`flex items-start gap-2 rounded-xl p-2.5 border ${c.border} ${c.bg}`}>
                      <Leaf className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${c.label}`} />
                      <div>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${c.label}`}>Benefício · {meal.portion}</span>
                        <p className="text-[11px] text-gray-600 leading-snug mt-0.5 font-medium">{meal.nutritionalBenefits}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Pediatric note */}
            <div className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
              <span className="text-base shrink-0 mt-0.5">🩺</span>
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Nota Pediátrica</span>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">{menu.pediatricNote}</p>
                {menu.vibeCheck && (
                  <span className="inline-block mt-1.5 text-[9px] font-black text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">{menu.vibeCheck}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
