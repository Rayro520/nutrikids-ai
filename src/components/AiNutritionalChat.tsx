/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Message, ChildProfile } from "../types";
import { Send, Sparkles, AlertCircle, Trash2, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "../utils/LanguageContext";

interface AiNutritionalChatProps {
  activeProfile: ChildProfile | null;
}

function buildWelcome(profile: ChildProfile | null, lang: string): string {
  if (lang === "en") {
    return profile
      ? `Hi! I'm **NutriKids AI** 👋\n\nI'm connected to **${profile.name}**'s profile and ready to help with any feeding question — age, allergies, portions, and more.\n\nWhat would you like to know?`
      : `Hi! I'm **NutriKids AI**, trained on WHO, SBP and UNICEF guidelines.\n\nRegister a child profile for 100% personalized answers, or ask any general infant nutrition question!`;
  }
  if (lang === "es") {
    return profile
      ? `¡Hola! Soy **NutriKids AI** 👋\n\nEstoy conectada al perfil de **${profile.name}** y lista para responder sobre alimentación — edad, alergias, porciones y más.\n\n¿En qué te puedo ayudar?`
      : `¡Hola! Soy **NutriKids AI**, entrenada con directrices de la OMS, SBP y UNICEF.\n\n¡Registra un perfil infantil para respuestas 100% personalizadas!`;
  }
  return profile
    ? `Olá! Sou a **NutriKids AI** 👋\n\nEstou conectada ao perfil de **${profile.name}** e pronta para tirar qualquer dúvida sobre alimentação — idade, alergias, porções e muito mais.\n\nO que você quer saber?`
    : `Olá! Sou a **NutriKids AI**, treinada nas diretrizes da OMS, SBP e UNICEF.\n\nCadastre um perfil infantil para respostas 100% personalizadas, ou pergunte qualquer coisa sobre nutrição infantil!`;
}

export default function AiNutritionalChat({ activeProfile }: AiNutritionalChatProps) {
  const { language } = useLanguage();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessages([{ role: "model", text: buildWelcome(activeProfile, language), timestamp: new Date() }]);
    setStreamingText("");
    setError(null);
  }, [activeProfile?.id, language]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, streamingText]);

  const getAgeMonths = () => {
    if (!activeProfile?.birthDate) return 12;
    const dob = new Date(activeProfile.birthDate);
    const now = new Date();
    return Math.max(1, (now.getFullYear() - dob.getFullYear()) * 12 + now.getMonth() - dob.getMonth());
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { role: "user", text: textToSend.trim(), timestamp: new Date() };
    const historyForApi = messages.filter((m) => m.role !== "model" || messages.indexOf(m) > 0);

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);
    setStreamingText("");
    setError(null);

    const payloadProfile = activeProfile ? {
      name: activeProfile.name,
      ageMonths: getAgeMonths(),
      weight: activeProfile.weight,
      isPremature: activeProfile.isPremature,
      allergies: activeProfile.allergies,
      restrictions: activeProfile.restrictions,
      specialConditions: activeProfile.specialConditions,
    } : null;

    try {
      const response = await fetch("/api/chat-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: historyForApi.map((m) => ({ role: m.role, text: m.text })),
          childProfile: payloadProfile,
          lang: language,
        }),
      });

      if (!response.ok || !response.body) throw new Error("Erro ao conectar.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      setLoading(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const raw = decoder.decode(value);
        for (const line of raw.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) throw new Error(parsed.error);
            fullText += parsed.text ?? "";
            setStreamingText(fullText);
          } catch (e: any) {
            if (e.message && !e.message.includes("JSON")) throw e;
          }
        }
      }

      setMessages((prev) => [...prev, { role: "model", text: fullText, timestamp: new Date() }]);
      setStreamingText("");
    } catch (err: any) {
      setLoading(false);
      console.error(err);
      setError(language === "en" ? "Connection failed. Please try again." : language === "es" ? "Conexión fallida. Intente de nuevo." : "Ops! A conexão falhou. Tente novamente.");
    }
  };

  const suggestions = language === "en"
    ? ["🍓 Strawberry in baby food?", "🥩 Iron-rich foods?", "🧀 Introducing dairy?"]
    : language === "es"
    ? ["🍓 ¿Fresa en la papilla?", "🥩 ¿Alimentos con hierro?", "🧀 ¿Cómo introducir lácteos?"]
    : ["🍓 Morango na Introdução Alimentar?", "🥩 Qual alimento é rico em Ferro?", "🧀 Como introduzir laticínios?"];

  const clearChat = () => {
    setMessages([{ role: "model", text: buildWelcome(activeProfile, language), timestamp: new Date() }]);
    setStreamingText("");
    setError(null);
  };

  return (
    <div id="ai-chat-section" className="bg-white rounded-3xl border border-orange-100/50 shadow-xs overflow-hidden flex flex-col" style={{ height: 500 }}>

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-400 px-4 pt-4 pb-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* AI avatar */}
            <div className="w-9 h-9 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-sm flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white leading-tight tracking-tight">
                {language === "en" ? "AI Nutritional Pediatrician" : "Pediatra Nutricional IA"}
              </h2>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                <span className="text-[9px] text-white/80 font-bold">
                  {language === "en" ? "Online · OMS/SBP" : language === "es" ? "En línea · OMS/SBP" : "Online · OMS/SBP"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Profile chip with photo */}
            {activeProfile && (
              <div className="flex items-center gap-1.5 bg-white/20 border border-white/30 px-2 py-1 rounded-xl">
                <div className="w-4 h-4 rounded-full bg-white/30 overflow-hidden flex items-center justify-center text-white text-[7px] font-black shrink-0">
                  {activeProfile.photo
                    ? <img src={activeProfile.photo} alt={activeProfile.name} className="w-full h-full object-cover" />
                    : activeProfile.name[0].toUpperCase()
                  }
                </div>
                <span className="text-[9px] text-white font-black truncate max-w-[60px]">{activeProfile.name}</span>
              </div>
            )}

            {messages.length > 1 && (
              <button
                onClick={clearChat}
                title="Limpar conversa"
                className="p-1.5 bg-white/15 hover:bg-white/25 rounded-xl transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Messages Feed ── */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 select-text">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "model" && (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center shrink-0 mb-0.5">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            )}
            <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
              m.role === "user"
                ? "bg-orange-500 text-white rounded-br-sm shadow-xs"
                : "bg-gray-50 border border-gray-100 text-gray-700 rounded-bl-sm"
            }`}>
              <div className="markdown-body prose prose-xs max-w-none">
                <ReactMarkdown>{m.text}</ReactMarkdown>
              </div>
              <span className={`block text-[8px] mt-1 text-right ${m.role === "user" ? "text-orange-200" : "text-gray-300"}`}>
                {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}

        {/* Streaming bubble */}
        {streamingText && (
          <div className="flex items-end gap-2 justify-start">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center shrink-0 mb-0.5">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <div className="max-w-[82%] rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-xs leading-relaxed bg-gray-50 border border-gray-100 text-gray-700">
              <div className="markdown-body prose prose-xs max-w-none">
                <ReactMarkdown>{streamingText}</ReactMarkdown>
              </div>
              <span className="block text-[8px] mt-1 text-right text-orange-400 animate-pulse">digitando…</span>
            </div>
          </div>
        )}

        {loading && !streamingText && (
          <div className="flex items-end gap-2 justify-start">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center shrink-0 mb-0.5">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-sm px-3.5 py-2.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:100ms]" />
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:200ms]" />
            </div>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 px-3 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* ── Suggestion chips ── */}
      {messages.length === 1 && !loading && (
        <div className="px-4 pb-2 shrink-0">
          <p className="text-[8.5px] font-black text-gray-400 uppercase tracking-widest mb-2">
            {language === "en" ? "Quick questions" : language === "es" ? "Preguntas rápidas" : "Perguntas rápidas"}
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSend(s.replace(/^[^ ]+ /, "").trim())}
                className="shrink-0 text-[10px] bg-orange-50 hover:bg-orange-100 border border-orange-100 rounded-2xl px-3 py-1.5 text-orange-700 font-bold transition-all whitespace-nowrap active:scale-95"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input bar ── */}
      <div className="px-4 pb-4 pt-2 shrink-0 border-t border-gray-100/80">
        <div className="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-2xl px-3 py-1.5 focus-within:border-orange-300 focus-within:bg-white transition-all">
          <input
            type="text"
            placeholder={
              activeProfile
                ? (language === "pt" ? `Pergunte sobre ${activeProfile.name}…` : language === "en" ? `Ask about ${activeProfile.name}…` : `Pregunta sobre ${activeProfile.name}…`)
                : (language === "en" ? "Ask about infant nutrition…" : language === "es" ? "Pregunta sobre nutrición…" : "Pergunte sobre nutrição infantil…")
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(inputText)}
            disabled={loading}
            className="flex-1 bg-transparent text-xs font-semibold text-gray-700 placeholder:text-gray-400 focus:outline-none py-1"
          />
          <button
            onClick={() => handleSend(inputText)}
            disabled={loading || !inputText.trim()}
            className="w-8 h-8 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all shadow-sm active:scale-95 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
