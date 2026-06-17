/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { SmartMenu, ChildProfile, Meal } from "../types";
import { calculateChildMetrics } from "../utils/nutritionData";
import { FileHeart, Sparkles, AlertCircle, ChefHat, Clock, Compass, HelpCircle } from "lucide-react";

interface MenuPlannerProps {
  activeProfile: ChildProfile | null;
}

export default function MenuPlanner({ activeProfile }: MenuPlannerProps) {
  const metrics = activeProfile ? calculateChildMetrics(activeProfile.birthDate) : null;
  const currentMonths = metrics?.ageMonths || 6;

  const [promptPreferences, setPromptPreferences] = useState("");
  const [menu, setMenu] = useState<SmartMenu | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate baseline menu when child profile shifts
  useEffect(() => {
    // Elegant baseline menus based on current age group
    if (currentMonths < 6) {
      setMenu({
        meals: [
          {
            type: "Café da Manhã",
            time: "07:00",
            title: "Leite Materno exclusivo",
            ingredients: ["Apenas livre demanda de leite materno"],
            instructions: "Não necessita água, chás ou complementos de qualquer espécie.",
            portion: "Sob livre demanda",
            nutritionalBenefits: "Alimento padrão-ouro global contendo todos os anticorpos essenciais."
          },
          {
            type: "Lanche da Manhã",
            time: "10:00",
            title: "Leite Materno",
            ingredients: ["Livre demanda"],
            instructions: "Nenhum suco de frutas ou frutas devem ser oferecidos a esta idade.",
            portion: "Sob livre demanda",
            nutritionalBenefits: "Favorece a microbiota intestinal e hidratação perfeita."
          },
          {
            type: "Almoço",
            time: "12:30",
            title: "Leite Materno / Fórmula recomendada",
            ingredients: ["Fórmula infantil ou Leite materno"],
            instructions: "Se usar fórmula, prepare nas proporções indicadas de pó para volume de água.",
            portion: "120ml - 150ml (conforme indicação profissional)",
            nutritionalBenefits: "Sacie o bebê e fornece gorduras saudáveis para o cérebro."
          },
          {
            type: "Jantar",
            time: "19:00",
            title: "Leite Materno exclusivo",
            ingredients: ["Leite materno"],
            instructions: "Manter a livre demanda ideal de amamentação do bebê.",
            portion: "Sob livre demanda",
            nutritionalBenefits: "Nutrição integral perfeita para repouso seguro."
          }
        ],
        pediatricNote: "Abaixo de 6 meses as diretrizes oficiais de saúde (SBP, OMS, UNICEF) recomendam Aleitamento Materno EXCLUSIVO ou fórmula licenciada sob prescrição médica.",
        vibeCheck: "Recomendação Classe A em vigência"
      });
    } else if (currentMonths >= 6 && currentMonths < 12) {
      setMenu({
        meals: [
          {
            type: "Café da Manhã",
            time: "08:00",
            title: "Mamão Papaia Raspado",
            ingredients: ["1/2 mamão papaia pequeno fatiado"],
            instructions: "Lave bem a casca, corte ao meio, retire sementes e raspe as polpas com uma colher macia.",
            portion: "2 a 3 colheres de sopa",
            nutritionalBenefits: "Rico em Vitamina C, fibras ativas e enzimas facilitadoras do trânsito intestinal."
          },
          {
            type: "Lanche da Manhã",
            time: "10:30",
            title: "Purê de Banana da Terra amassado",
            ingredients: ["1 banana da terra ou banana prata pequena"],
            instructions: "Amasse completamente com um garfo limpo até eliminar grumos duros. Não bata no liquidificador.",
            portion: "3 colheres de sopa",
            nutritionalBenefits: "Excelente energia de carboidratos, potássio e vitaminas do complexo B."
          },
          {
            type: "Almoço",
            time: "12:30",
            title: "Papa Nutritiva de Abóbora, Feijão e Franguinho",
            ingredients: ["1 pedaço de abóbora cozida", "2 colheres de feijão preto cozido (sem caldo)", "1 colher de frango muito desfiado"],
            instructions: "Cozinhe tudo com água saudável, amasse no garfo posicionando os grupos individualizados no prato para que o bebê deguste sabores isolados.",
            portion: "4 a 5 colheres de sopa no total",
            nutritionalBenefits: "Rico em Ferro heme de alta absorção, proteínas musculares e betacaroteno."
          },
          {
            type: "Jantar",
            time: "18:30",
            title: "Batatinha e chuchu com gema de ovo amassada",
            ingredients: ["1/2 batata média", "1/2 chuchu pequeno", "1 gema de ovo cozida firme"],
            instructions: "Cozinhe a batata e chuchu bem macios. Amasse-os separadamente no garfo e misture delicadamente com a gema de ovo previamente amassadinha.",
            portion: "4 colheres de sopa",
            nutritionalBenefits: "Excelente fonte de Colina vegetal para o cérebro e minerais antioxidantes."
          }
        ],
        pediatricNote: "Aos 6 meses, inicia-se a introdução de novos sabores. Ofereça água mineral ou fervida nos intervalos.",
        vibeCheck: "Alinhado perfeitamente ao Guia de Alimentação Infantil do Ministério da Saúde"
      });
    } else {
      // 1-10 years baseline menu
      setMenu({
        meals: [
          {
            type: "Café da Manhã",
            time: "08:00",
            title: "Iogurte Natural com Farelo de Aveia e Morangos",
            ingredients: ["1 copo de iogurte natural integral", "1 colher de sopa de aveia em flocos finos", "3 morangos picadinhos"],
            instructions: "Misture a aveia ao iogurte e finalize com os morangos bem higienizados e picados.",
            portion: "1 taça média",
            nutritionalBenefits: "Rico em Cálcio para o crescimento ósseo, proteínas de alta fixação e fibras probióticas."
          },
          {
            type: "Almoço",
            time: "12:00",
            title: "Prato Completo Colorido: Arroz, Lentilha, Carne e Brócolis",
            ingredients: ["3 colheres de sopa de arroz integral", "2 colheres de lentilha cozida", "1 filé pequeno de patinho moído", "3 floretes de brócolis cozidos"],
            instructions: "Sirva as porções divididas no pratinho. Cozinhe o brócolis no vapor para preservar os minerais.",
            portion: "Prato infantil balanceado",
            nutritionalBenefits: "Aporte elevado de Ferro, Zinco, proteínas reguladoras de imunidade e fibras intestinais."
          },
          {
            type: "Lanche da Tarde",
            time: "15:30",
            title: "Salada de Frutas com Sementes de Chia",
            ingredients: ["1/2 banana picada", "1/2 maçã picada", "1/2 laranja espremida", "1 colher de chá de chia"],
            instructions: "Misture as frutas picadas com o suco de laranja natural e polvilhe a semente de chia para hidratar.",
            portion: "1 xícara média",
            nutritionalBenefits: "Aporte rico de Vitamina C, potássio, fibras solúveis e gorduras do tipo ômega-3."
          },
          {
            type: "Jantar",
            time: "19:00",
            title: "Omelete Nutritivo com Cenoura Ralada e Espinafre",
            ingredients: ["1 ovo inteiro batido", "1 colher de sopa de cenoura finamente ralada", "folhas de espinafre rasgadas"],
            instructions: "Prepare em frigideira antiaderente levemente untada com fio de azeite, misturando os legumes ao bater o ovo.",
            portion: "1 omelete médio bem cozido",
            nutritionalBenefits: "Proteínas completas, Carotenoides, Magnésio celular e Luteína para as retinas."
          }
        ],
        pediatricNote: "Nesta fase, a rotina de lanches e a ingestão de água constante são essenciais para evitar fadigas escolares e desidratação crônica.",
        vibeCheck: "Diretrizes SBP atualizadas para prevenção da obesidade infantil."
      });
    }
  }, [currentMonths]);

  // Request Customized Menu from Server-Side Gemini API
  const handleAIRequest = async () => {
    setLoading(true);
    setError(null);

    const allergiesStr = activeProfile?.allergies || "Nenhuma";
    const restrictionsStr = activeProfile?.restrictions || "Nenhuma";
    const weightStr = activeProfile?.weight ? `${activeProfile.weight}kg` : "peso adequado";

    try {
      const response = await fetch("/api/generate-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ageMonths: currentMonths,
          weight: weightStr,
          allergies: allergiesStr,
          restrictions: restrictionsStr,
          preferences: promptPreferences.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro de conexão com o servidor de IA.");
      }

      const data: SmartMenu = await response.json();
      setMenu(data);
    } catch (err: any) {
      console.error(err);
      setError("Ops! A nossa IA de cardápios não conseguiu processar a resposta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="menu-planner-section" className="bg-white rounded-3xl border border-orange-100/40 shadow-xs p-5">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-50/75 pb-3 mb-5">
        <div className="flex items-center gap-2">
          <FileHeart className="w-5 h-5 text-orange-500 animate-gentle-pulse" />
          <div>
            <h2 className="text-base font-black text-gray-800 tracking-tight font-display">Cardápios SBP Inteligentes</h2>
            <p className="text-[10px] text-gray-450 leading-none">Refeições saudáveis personalizadas para idade com inteligência artificial</p>
          </div>
        </div>

        {/* Dynamic target description */}
        <span className="text-[10px] bg-orange-50 border border-orange-100 text-orange-800 px-3 py-1 rounded-full font-black">
          Configurado: {currentMonths} meses
        </span>
      </div>

      {/* AI Personalization input bar */}
      <div className="bg-gradient-to-r from-orange-50/50 via-amber-25/30 to-rose-25/10 p-5 rounded-2xl border border-orange-100/50 mb-6 space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-150/15 rounded-full -mr-8 -mt-8"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              NutriKids AI Customizer
            </span>
            <p className="text-xs text-gray-650 font-bold leading-snug">
              Alimente com o que tem em casa! Digite os ingredientes abaixo para receitas:
            </p>
          </div>

          {/* Prompt options */}
          <div className="flex gap-2 w-full md:w-auto flex-1 md:max-w-md">
            <input
              type="text"
              placeholder="Ex: adicione batata-doce, sem polpa grossa..."
              value={promptPreferences}
              onChange={(e) => setPromptPreferences(e.target.value)}
              className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-450 font-semibold"
            />
            <button
              onClick={handleAIRequest}
              disabled={loading}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-650 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all disabled:opacity-40 flex items-center gap-1 shadow-2xs active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {loading ? "Calculando..." : "Gerar com IA"}
            </button>
          </div>
        </div>

        {activeProfile && (activeProfile.allergies || activeProfile.restrictions) && (
          <div className="flex items-center gap-1.5 text-[9px] uppercase font-black text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100 w-fit">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>IA ciente de: Alergia ({activeProfile.allergies || "Sem"}) e Restrição ({activeProfile.restrictions || "Sem"})</span>
          </div>
        )}
      </div>

      {loading && (
        <div className="py-20 flex flex-col items-center justify-center bg-slate-50 border border-dashed border-orange-100 rounded-3xl text-center">
          <div className="w-10 h-10 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mb-4"></div>
          <h3 className="font-extrabold text-gray-800 text-sm">Estruturando Cardápios Personalizados</h3>
          <p className="text-[11px] text-gray-500 mt-2 max-w-sm px-4 leading-relaxed">
            Alinhando ingredientes com as necessidades de {currentMonths} meses sob as diretrizes de engasgo e asfixia da SBP...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-xl text-xs font-semibold flex items-center gap-2 mb-6">
          <AlertCircle className="w-4 h-4 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Meals schedule cards display */}
      {!loading && menu && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {menu.meals.map((meal, idx) => (
              <div key={idx} className="bg-white border border-gray-100 hover:border-orange-200 p-4 rounded-2xl shadow-xs hover:shadow-sm transition-all flex flex-col justify-between relative group">
                
                {/* Meal header */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-2 mb-3">
                    <span className="font-black text-[10px] text-slate-800 uppercase tracking-widest flex items-center gap-1">
                      <ChefHat className="w-3.5 h-3.5 text-orange-500" />
                      {meal.type}
                    </span>
                    <span className="text-[9.5px] font-mono text-gray-400 font-bold bg-gray-50 px-2 py-0.5 rounded flex items-center gap-0.5 animate-pulse">
                      <Clock className="w-3 h-3 text-orange-400" />
                      {meal.time}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-gray-800 leading-snug">{meal.title}</h3>
                  <p className="text-[10px] font-black text-orange-600 mt-1 uppercase tracking-wider">Porção: {meal.portion}</p>
                </div>

                {/* Ingredients & Prep */}
                <div className="mt-4 space-y-3 pt-3 border-t border-gray-50/50">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest font-black text-gray-400">Ingredientes:</span>
                    <div className="flex flex-wrap gap-1">
                      {meal.ingredients.map((ing, iIdx) => (
                        <span key={iIdx} className="text-[10px] bg-slate-50 border border-slate-100 rounded-md px-1.5 py-0.5 text-gray-650 font-bold">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest font-black text-gray-400">Modo de preparo / Dica:</span>
                    <p className="text-[11px] leading-relaxed text-gray-500 truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:h-auto">
                      {meal.instructions}
                    </p>
                  </div>
                </div>

                {/* Nutritional Benefit footer */}
                <div className="mt-4 bg-orange-55/15 p-2.5 rounded-xl border border-orange-100/35">
                  <span className="text-[8.5px] uppercase font-black text-orange-850 block mb-0.5">Benefício Nutricional:</span>
                  <p className="text-[10.5px] leading-relaxed text-orange-900 font-bold">
                    {meal.nutritionalBenefits}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pediatric warning banner */}
          <div className="bg-slate-50 border border-gray-150 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-lg">
              🩺
            </span>
            <div className="flex-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Observação Médico-Pediatra</span>
              <p className="text-[11px] text-gray-605 font-medium leading-relaxed mt-0.5">
                {menu.pediatricNote}
              </p>
            </div>
            {menu.vibeCheck && (
              <span className="text-[9px] font-black bg-white border border-gray-200 text-slate-500 px-2 py-1 rounded-md mt-2 md:mt-0 shadow-2xs">
                {menu.vibeCheck}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
