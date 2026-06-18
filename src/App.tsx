/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ChildProfile } from "./types";
import { calculateChildMetrics, OFFICIAL_RESPONSIBILITIES } from "./utils/nutritionData";
import { useLanguage } from "./utils/LanguageContext";

// Components
import ChildProfileForm from "./components/ChildProfileForm";
import AlertaMamaeSearch from "./components/AlertaMamaeSearch";
import ProductScanner from "./components/ProductScanner";
import AiNutritionalChat from "./components/AiNutritionalChat";
import VitaminMeterPanel from "./components/VitaminMeterPanel";
import GrowthCurveChart from "./components/GrowthCurveChart";
import MenuPlanner from "./components/MenuPlanner";
import MotherCommunity from "./components/MotherCommunity";
import AgeQuickGuideWithReminders from "./components/AgeQuickGuideWithReminders";
import VaccineChecklist from "./components/VaccineChecklist";
import BabyDiary from "./components/BabyDiary";

// Icons
import {
  Baby,
  Search,
  Camera,
  Home,
  ChefHat,
  Activity,
  Users,
  ShieldCheck,
  Sparkles,
  Award,
  Bell,
  Syringe,
  BookHeart,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";

export default function App() {
  const { language, setLanguage, t } = useLanguage();

  // Navigation index
  const [activeTab, setActiveTab ] = useState<string>("dashboard");

  // Child Profiles State loaded from localStorage
  const [profiles, setProfiles] = useState<ChildProfile[]>(() => {
    const saved = localStorage.getItem("nutrikids_profiles");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [activeProfileId, setActiveProfileId] = useState<string | null>(() => {
    const saved = localStorage.getItem("nutrikids_active_profile_id");
    return saved || null;
  });

  const [isAddingNewChild, setIsAddingNewChild] = useState(false);

  // Dynamic system notifications / toast logs state
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (language === "pt") {
      setNotifications([
        "Dica do dia: Bebês menores de 2 anos não devem receber açúcar na mamadeira ou papinha.",
        "Lembrou de pesar e medir seu pequeno hoje? Atualize o gráfico na aba 'Curva de Crescimento'!",
      ]);
    } else if (language === "en") {
      setNotifications([
        "Tip of the day: Babies under 2 years old should not be given added sugar in bottles or purees.",
        "Remember to weigh and measure your little one today? Update the graph under 'Growth Curve'!",
      ]);
    } else {
      setNotifications([
        "Consejo del día: Los bebés menores de 2 años no deben recibir azúcar añadida en biberones o papillas.",
        "¿Se acordó de pesar y medir a su pequeño hoy? ¡Actualice el gráfico en la pestaña 'Curva de Crecimiento'!",
      ]);
    }
  }, [language]);

  // Persist profiles
  useEffect(() => {
    localStorage.setItem("nutrikids_profiles", JSON.stringify(profiles));
    if (profiles.length > 0 && !activeProfileId) {
      setActiveProfileId(profiles[0].id);
    }
  }, [profiles]);

  useEffect(() => {
    if (activeProfileId) {
      localStorage.setItem("nutrikids_active_profile_id", activeProfileId);
    } else {
      localStorage.removeItem("nutrikids_active_profile_id");
    }
  }, [activeProfileId]);

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || null;
  const metrics = activeProfile ? calculateChildMetrics(activeProfile.birthDate) : null;
  
  // Custom notifications push on action
  const addSystemNotification = (msg: string) => {
    setNotifications((prev) => [msg, ...prev.slice(0, 5)]); // limit to 6
  };

  const handleSaveProfile = (newProfile: ChildProfile) => {
    setProfiles((prev) => {
      const exists = prev.some((p) => p.id === newProfile.id);
      if (exists) {
        return prev.map((p) => (p.id === newProfile.id ? newProfile : p));
      }
      return [...prev, newProfile];
    });
    setActiveProfileId(newProfile.id);
    const successMsg = t.profileCreatedNotify.replace("{name}", newProfile.name);
    addSystemNotification(successMsg);
  };

  const handleDeleteProfile = (id: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    if (activeProfileId === id) {
      setActiveProfileId(profiles.length > 1 ? profiles.filter((p) => p.id !== id)[0].id : null);
    }
    addSystemNotification(t.profileRemovedNotify);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5EF] via-[#FFF9F6] to-[#FFEFE6] flex flex-col items-center justify-center font-sans text-gray-800 antialiased selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden sm:p-2 md:p-3">
      
      {/* Smartphone Device Simulator on wider screens, standard 100% fullscreen on actual mobile phones */}
      <div className="w-full sm:max-w-[412px] sm:h-[max(600px,min(845px,94vh))] h-dvh sm:rounded-[44px] sm:border-[10px] sm:border-slate-800 sm:shadow-[0_24px_60px_-15px_rgba(249,115,22,0.18)] bg-[#FFFDFC] flex flex-col overflow-hidden relative sm:ring-1 sm:ring-slate-900/10 sm:my-auto">
        
        {/* Cute iPhone Notch / Dynamic Island Detail (Hidden on actual mobile view for maximum usability) */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 h-5 w-32 bg-slate-800 rounded-b-xl z-50"></div>

        {/* Header */}
        <header className="bg-white/95 backdrop-blur-md border-b border-orange-50 sticky top-0 z-30 shrink-0 pt-2 sm:pt-4 pb-2 px-4">
          <div className="flex items-center justify-between gap-2">
            {/* Logo + active child chip */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-sm shadow-orange-200 shrink-0">
                <Baby className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <h1 className="text-xs font-black text-slate-800 tracking-tight flex items-center gap-1 leading-tight">
                  {t.appName}
                  <span className="text-[7px] bg-orange-50 text-orange-600 font-extrabold px-1 rounded border border-orange-100/60">SBP/OMS</span>
                </h1>
                {activeProfile ? (
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className="flex items-center gap-1 mt-0.5 bg-orange-50 hover:bg-orange-100 border border-orange-100 px-1.5 py-0.5 rounded-full transition-all"
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-orange-400 flex items-center justify-center text-white text-[7px] font-black shrink-0 overflow-hidden">
                      {activeProfile.photo ? (
                        <img src={activeProfile.photo} alt={activeProfile.name} className="w-full h-full object-cover" />
                      ) : (
                        activeProfile.name[0].toUpperCase()
                      )}
                    </span>
                    <span className="text-[8px] font-black text-orange-700 truncate max-w-[80px]">{activeProfile.name}</span>
                    <span className="text-[7px] text-orange-400 font-bold">{metrics?.ageMonths}m</span>
                  </button>
                ) : (
                  <p className="text-[8px] text-gray-400 font-medium truncate leading-none pt-0.5">{t.subTitle}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <div className="flex gap-0.5 bg-gray-50 p-0.5 rounded-lg border border-gray-100 text-[8px] font-black">
                {(["pt", "en", "es"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-1.5 py-0.5 rounded-md transition-all cursor-pointer ${
                      language === lang ? "bg-orange-500 text-white" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {lang === "pt" ? "PT" : lang === "en" ? "EN" : "ES"}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-full border border-orange-100/50">
                <ShieldCheck className="w-3 h-3 text-orange-500" />
                <span className="text-[8px] font-black text-orange-700 hidden sm:block">{t.sealText}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Display Area - Scrollable Content with Peach Tone */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#FFFDFB] via-[#FFFDFB] to-[#FFFBF9]">
          
          {/* Elegant Back button at top of active sub-tab in "More" list */}
          {["growth", "vitamins", "forum", "resources", "vaccines", "diary"].includes(activeTab) && (
            <button
              onClick={() => setActiveTab("more")}
              className="flex items-center gap-1.5 text-[11px] text-orange-600 font-black bg-white hover:bg-orange-50 px-3 py-1.5 rounded-full transition-all border border-orange-100 w-fit active:scale-95 shadow-xs"
            >
              {t.backToMore}
            </button>
          )}

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-4">
              {!activeProfile ? (
                /* ── ONBOARDING: nenhum filho cadastrado ── */
                <>
                  {/* Hero de boas-vindas */}
                  <div className="bg-gradient-to-br from-orange-500/10 to-amber-400/10 border border-orange-100 rounded-3xl p-5 relative overflow-hidden">
                    <div className="absolute -top-8 -right-8 w-28 h-28 bg-orange-300 rounded-full filter blur-3xl opacity-20" />
                    <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-amber-300 rounded-full filter blur-3xl opacity-20" />
                    <div className="relative space-y-3">
                      <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-widest">
                        {t.introImpactTitle}
                      </span>
                      <h2 className="text-xl font-black text-slate-800 leading-tight">
                        {language === "pt" ? "Bem-vinda ao NutriKids AI! 👋" : language === "en" ? "Welcome to NutriKids AI! 👋" : "¡Bienvenida a NutriKids AI! 👋"}
                      </h2>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed border-l-2 border-orange-400 pl-3 italic">
                        &ldquo;{t.introImpactPhrase}&rdquo;
                      </p>
                      <button
                        onClick={() => { setIsAddingNewChild(true); setActiveProfileId(null); }}
                        className="w-full py-3 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm shadow-orange-200"
                      >
                        <Baby className="w-4 h-4" />
                        {t.introRegisterCTA}
                      </button>
                    </div>
                  </div>

                  {/* 3 passos de onboarding */}
                  <div className="bg-white border border-orange-100/50 rounded-3xl p-4 space-y-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {language === "pt" ? "Como funciona" : language === "en" ? "How it works" : "Cómo funciona"}
                    </p>
                    {[
                      {
                        step: "1", icon: <Baby className="w-4 h-4" />,
                        title: language === "pt" ? "Cadastre seu filho" : language === "en" ? "Register your child" : "Registra tu hijo",
                        desc:  language === "pt" ? "Nome, nascimento, peso, alergias e restrições." : language === "en" ? "Name, birthday, weight, allergies and restrictions." : "Nombre, nacimiento, peso, alergias y restricciones.",
                      },
                      {
                        step: "2", icon: <Search className="w-4 h-4" />,
                        title: language === "pt" ? "Pesquise alimentos" : language === "en" ? "Search foods" : "Busca alimentos",
                        desc:  language === "pt" ? "Veredito científico OMS/SBP sobre qualquer alimento." : language === "en" ? "WHO/SBP scientific verdict on any food." : "Veredicto científico OMS/SBP sobre cualquier alimento.",
                      },
                      {
                        step: "3", icon: <MessageCircle className="w-4 h-4" />,
                        title: language === "pt" ? "Converse com a IA" : language === "en" ? "Chat with AI" : "Conversa con la IA",
                        desc:  language === "pt" ? "Tire dúvidas com o pediatra digital 24h." : language === "en" ? "Ask the digital pediatrician anytime." : "Consulta al pediatra digital las 24h.",
                      },
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-full bg-orange-500 text-white text-xs font-black flex items-center justify-center shrink-0">{item.step}</span>
                        <div>
                          <p className="text-xs font-black text-slate-800 flex items-center gap-1">{item.icon}{item.title}</p>
                          <p className="text-[10px] text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick actions mesmo sem perfil */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: language === "pt" ? "🔍 Pesquisar Alimento" : language === "en" ? "🔍 Search Food" : "🔍 Buscar Alimento", tab: "search", color: "bg-orange-50 border-orange-100 text-orange-700" },
                      { label: language === "pt" ? "💬 Perguntar à IA" : language === "en" ? "💬 Ask the AI" : "💬 Preguntar a la IA", tab: "dashboard", color: "bg-slate-50 border-slate-100 text-slate-700" },
                    ].map((a) => (
                      <button key={a.tab + a.label} onClick={() => { setActiveTab(a.tab); if (a.tab === "dashboard") { setTimeout(() => document.getElementById("ai-chat-section")?.scrollIntoView({ behavior: "smooth" }), 100); }}} className={`py-3 rounded-2xl border text-xs font-black transition-all active:scale-95 ${a.color}`}>
                        {a.label}
                      </button>
                    ))}
                  </div>

                  {/* Form de cadastro */}
                  <ChildProfileForm
                    profiles={profiles}
                    activeProfileId={activeProfileId}
                    onSelectProfile={setActiveProfileId}
                    onSaveProfile={handleSaveProfile}
                    onDeleteProfile={handleDeleteProfile}
                    isEditingExternal={isAddingNewChild}
                    setIsEditingExternal={setIsAddingNewChild}
                  />

                  {/* Guia de faixa etária (universal) */}
                  <AgeQuickGuideWithReminders
                    activeProfile={null}
                    currentCategory="0-6_months"
                    addSystemNotification={addSystemNotification}
                    language={language}
                  />
                </>
              ) : (
                /* ── DASHBOARD PERSONALIZADO: filho cadastrado ── */
                <>
                  {/* Card de saudação personalizado */}
                  <div className="bg-gradient-to-br from-orange-500/10 to-amber-400/10 border border-orange-100 rounded-3xl p-4 relative overflow-hidden">
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-orange-300 rounded-full filter blur-3xl opacity-20" />
                    <div className="relative flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-black text-xl shrink-0 shadow-sm overflow-hidden">
                        {activeProfile.photo ? (
                          <img src={activeProfile.photo} alt={activeProfile.name} className="w-full h-full object-cover" />
                        ) : (
                          activeProfile.name[0].toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] text-orange-500 font-extrabold uppercase tracking-widest leading-none">
                          {language === "pt" ? "Olá, mamãe! 👋" : language === "en" ? "Hello, mom! 👋" : "¡Hola, mamá! 👋"}
                        </p>
                        <h2 className="text-base font-black text-slate-800 truncate">{activeProfile.name}</h2>
                        <p className="text-[10px] text-gray-500 font-medium">
                          {metrics?.exactAgeStr} · {activeProfile.weight}kg · {activeProfile.height}cm
                        </p>
                      </div>
                      <button
                        onClick={() => { setIsAddingNewChild(false); }}
                        className="shrink-0 p-2 bg-white border border-orange-100 rounded-xl text-[9px] font-bold text-orange-600 hover:bg-orange-50 transition-all"
                        title={language === "pt" ? "Editar perfil" : "Edit profile"}
                      >
                        ✏️
                      </button>
                    </div>

                    {/* Quick action strip */}
                    <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-orange-100/40">
                      {[
                        { icon: <Search className="w-4 h-4" />, label: language === "pt" ? "Alimentos" : language === "en" ? "Foods" : "Alimentos", tab: "search" },
                        { icon: <Camera className="w-4 h-4" />, label: language === "pt" ? "Scanner" : "Scanner", tab: "scanner" },
                        { icon: <ChefHat className="w-4 h-4" />, label: language === "pt" ? "Cardápio" : language === "en" ? "Menu" : "Menú", tab: "meals" },
                        { icon: <Activity className="w-4 h-4" />, label: language === "pt" ? "Curva" : language === "en" ? "Growth" : "Curva", tab: "growth" },
                      ].map((a) => (
                        <button
                          key={a.tab}
                          onClick={() => setActiveTab(a.tab)}
                          className="flex flex-col items-center gap-1 py-2 bg-white/70 hover:bg-white rounded-xl border border-orange-100/50 transition-all active:scale-95"
                        >
                          <span className="text-orange-500">{a.icon}</span>
                          <span className="text-[8.5px] font-bold text-gray-600">{a.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Alergias alert */}
                    {activeProfile.allergies && (
                      <div className="mt-3 flex items-center gap-1.5 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl">
                        <span className="text-rose-500 text-xs">⚠️</span>
                        <span className="text-[10px] font-bold text-rose-700">
                          {language === "pt" ? "Alergia:" : language === "en" ? "Allergy:" : "Alergia:"} {activeProfile.allergies}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Guia de faixa etária personalizado para a criança */}
                  <AgeQuickGuideWithReminders
                    activeProfile={activeProfile}
                    currentCategory={metrics?.category || "0-6_months"}
                    addSystemNotification={addSystemNotification}
                    language={language}
                  />

                  {/* Chat IA imediatamente acessível */}
                  <AiNutritionalChat activeProfile={activeProfile} />

                  {/* Perfil + troca de criança */}
                  <ChildProfileForm
                    profiles={profiles}
                    activeProfileId={activeProfileId}
                    onSelectProfile={setActiveProfileId}
                    onSaveProfile={handleSaveProfile}
                    onDeleteProfile={handleDeleteProfile}
                    isEditingExternal={isAddingNewChild}
                    setIsEditingExternal={setIsAddingNewChild}
                  />

                </>
              )}
            </div>
          )}

          {/* Alerta Mamãe Food Search Tab */}
          {activeTab === "search" && (
            <AlertaMamaeSearch activeProfile={activeProfile} />
          )}

          {/* Product camera/ingredient scanner Tab */}
          {activeTab === "scanner" && (
            <ProductScanner activeProfile={activeProfile} />
          )}

          {/* Menu recipes planner Tab */}
          {activeTab === "meals" && (
            <MenuPlanner activeProfile={activeProfile} />
          )}

          {/* Curva de Crescimento Tab (Redirected from More) */}
          {activeTab === "growth" && (
            <GrowthCurveChart activeProfile={activeProfile} />
          )}

          {/* Vitaminometer progress dashboard Tab (Redirected from More) */}
          {activeTab === "vitamins" && (
            <VitaminMeterPanel
              activeProfile={activeProfile}
              onAddLogMessage={(msg) => addSystemNotification(msg)}
            />
          )}

          {/* Forum maternal community Tab (Redirected from More) */}
          {activeTab === "forum" && (
            <MotherCommunity activeProfile={activeProfile} />
          )}

          {/* Vaccine Checklist Tab */}
          {activeTab === "vaccines" && (
            <VaccineChecklist activeProfile={activeProfile} />
          )}

          {/* Baby Diary Tab */}
          {activeTab === "diary" && (
            <BabyDiary activeProfile={activeProfile} />
          )}

          {/* Área de Confiança - Scientific Reference center */}
          {activeTab === "resources" && (
            <div id="sources-references-area" className="bg-white rounded-3xl border border-orange-100/40 shadow-xs p-5 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-orange-500" />
                <div>
                  <h2 className="text-base font-extrabold text-slate-800 tracking-tight font-display">{t.trustTitle}</h2>
                  <p className="text-[10px] text-gray-500 font-medium">{t.trustDesc}</p>
                </div>
              </div>

              <p className="text-xs text-gray-650 leading-relaxed">
                {t.vibeCheckDesc}
              </p>

              {/* Grid block responsibilities */}
              <div className="space-y-3">
                {OFFICIAL_RESPONSIBILITIES.map((ref, idx) => {
                  let translatedGuideline = ref.guideline;
                  if (language === "en") {
                    translatedGuideline = ref.org.includes("Brasil") 
                      ? "Dietary Guidelines for Brazilian Children Under 2 Years" 
                      : ref.org.includes("OMS") 
                      ? "Global Infant Feeding Guidelines" 
                      : ref.org.includes("UNICEF")
                      ? "Early Childhood Micronutrient Standard Guidance"
                      : "Pediatric Nutritional Care Reference Practices";
                  } else if (language === "es") {
                    translatedGuideline = ref.org.includes("Brasil") 
                      ? "Guía Alimentaria para Niños Brasileños Menores de 2 Años" 
                      : ref.org.includes("OMS")
                      ? "Directrices Globales de Alimentación Infantil"
                      : ref.org.includes("UNICEF")
                      ? "Normas de Micronutrientes en la Primera Infancia"
                      : "Prácticas de Referencia de Nutrición Pediátrica";
                  }
                  return (
                    <div key={idx} className="p-3 bg-orange-50/20 border border-orange-100/30 rounded-2xl space-y-1.5">
                      <span className="text-[8px] font-extrabold text-orange-700 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full inline-block">
                        {ref.org}
                      </span>
                      <h3 className="font-extrabold text-xs text-slate-850 leading-tight">{translatedGuideline}</h3>
                      <div className="flex justify-between items-center text-[8.5px] text-gray-400 font-medium pt-0.5">
                        <span>{language === "en" ? "Update" : language === "es" ? "Actualizado" : "Atualização"}: {ref.lastUpdated}</span>
                        <span className="font-bold text-orange-600">
                          {language === "en" ? "Evidence Level A" : language === "es" ? "Evidencia Nivel A" : ref.evidenceLevel}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-orange-50/40 border border-orange-100/40 p-4 rounded-2xl space-y-1.5">
                <span className="text-[10px] font-black text-orange-850 block">{t.trustSealHeader}</span>
                <p className="text-[10px] text-orange-800 leading-relaxed font-semibold">
                  &ldquo;{t.trustSealDesc}&rdquo;
                </p>
                <div className="text-[8.5px] text-orange-600 font-bold block pt-0.5">
                  — {t.allRightsReserved}
                </div>
              </div>

            </div>
          )}

          {/* Grid Hub for More Options (Mais Tab) */}
          {activeTab === "more" && (
            <div className="space-y-5 py-2 px-0.5">
              <div className="text-center space-y-1">
                <h2 className="text-lg font-black text-slate-850 font-display">{t.moreTools}</h2>
                <p className="text-[10px] text-gray-400 font-semibold leading-relaxed max-w-[280px] mx-auto">
                  {t.moreToolsDesc}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { tab: "growth",    icon: <Activity className="w-5 h-5" />,   title: t.crescimentoName,    desc: language === "pt" ? "Peso & altura OMS" : language === "en" ? "WHO weight & height" : "Peso & altura OMS" },
                  { tab: "vitamins",  icon: <Award className="w-5 h-5" />,      title: t.vitaminometroName,  desc: language === "pt" ? "Vitaminas do dia" : language === "en" ? "Daily vitamins" : "Vitaminas del día" },
                  { tab: "forum",     icon: <Users className="w-5 h-5" />,      title: t.comunidadeName,     desc: language === "pt" ? "Comunidade mães" : language === "en" ? "Mom community" : "Comunidad madres" },
                  { tab: "vaccines",  icon: <Syringe className="w-5 h-5" />,    title: language === "pt" ? "Vacinas" : language === "en" ? "Vaccines" : "Vacunas",           desc: "SBP 2024" },
                  { tab: "diary",     icon: <BookHeart className="w-5 h-5" />,  title: language === "pt" ? "Diário" : language === "en" ? "Diary" : "Diario",               desc: language === "pt" ? "Refeições & sono" : language === "en" ? "Meals & sleep" : "Comidas & sueño" },
                  { tab: "resources", icon: <ShieldCheck className="w-5 h-5" />,title: t.seloCientificoName, desc: language === "pt" ? "Fontes científicas" : language === "en" ? "Scientific sources" : "Fuentes científicas" },
                ].map((item) => (
                  <button
                    key={item.tab}
                    onClick={() => setActiveTab(item.tab)}
                    className="p-3 bg-white border border-orange-100 rounded-2xl hover:border-orange-200 text-left transition-all active:scale-95 space-y-2 block w-full shadow-xs cursor-pointer"
                  >
                    <span className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500">
                      {item.icon}
                    </span>
                    <div>
                      <h4 className="font-black text-[10px] text-slate-800 tracking-tight block leading-tight">{item.title}</h4>
                      <p className="text-[8.5px] text-gray-400 font-medium leading-tight mt-0.5">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Quick Informational notifications box inside scrolling view */}
              <div className="bg-gradient-to-r from-orange-50/50 via-amber-50/10 to-orange-50/50 p-4 rounded-3xl border border-orange-100 mt-6 space-y-2.5">
                <span className="text-[9px] font-extrabold text-orange-850 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                  <Bell className="w-3.5 h-3.5 text-orange-500 animate-bounce" />
                  {t.updateNotificationTitle}
                </span>
                <div className="space-y-2 pr-1">
                  {notifications.map((not, idx) => (
                    <p key={idx} className="text-[10px] leading-relaxed text-gray-500 border-l border-orange-200 pl-2 font-semibold font-sans">
                      {not}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>

        {/* Bottom Nav */}
        <nav className="bg-white/95 backdrop-blur-md border-t border-orange-100/50 flex justify-around items-center shrink-0 shadow-[0_-5px_15px_-3px_rgba(0,0,0,0.03)] z-20 pb-[env(safe-area-inset-bottom,20px)] pt-2 sm:pb-5">
          {[
            { tab: "dashboard", icon: <Home className="w-5 h-5" />,        label: language === "pt" ? "Início"    : language === "en" ? "Home"     : "Inicio"   },
            { tab: "search",    icon: <Search className="w-5 h-5" />,      label: language === "pt" ? "Alimentos" : language === "en" ? "Foods"    : "Alimentos"},
            { tab: "scanner",   icon: <Camera className="w-5 h-5" />,      label: language === "pt" ? "Scanner"   : "Scanner"                                  },
            { tab: "meals",     icon: <ChefHat className="w-5 h-5" />,     label: language === "pt" ? "Cardápio"  : language === "en" ? "Menu"     : "Menú"     },
            { tab: "more",      icon: <Sparkles className="w-5 h-5" />,    label: language === "pt" ? "Mais"      : language === "en" ? "More"     : "Más"      },
          ].map(({ tab, icon, label }) => {
            const isActive = tab === "more"
              ? (activeTab === "more" || ["growth","vitamins","forum","resources","vaccines","diary"].includes(activeTab))
              : activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex flex-col items-center justify-center gap-0.5 transition-all w-16 active:scale-95 cursor-pointer ${isActive ? "text-orange-500" : "text-gray-400 hover:text-gray-500"}`}
              >
                {icon}
                <span className={`text-[8.5px] font-extrabold tracking-tight ${isActive ? "text-orange-500" : ""}`}>{label}</span>
                {isActive && <span className="w-1 h-1 rounded-full bg-orange-400 mt-0.5" />}
              </button>
            );
          })}
        </nav>

      </div>
    </div>
  );
}
