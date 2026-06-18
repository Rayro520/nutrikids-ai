import React, { useState, useEffect } from "react";
import { 
  Baby, 
  HelpCircle, 
  AlertTriangle, 
  Bell, 
  Clock, 
  Check, 
  Sparkles, 
  Heart, 
  Smartphone, 
  X,
  Plus
} from "lucide-react";
import { AGE_MILESTONES } from "../utils/nutritionData";
import { AgeMilestone, ChildProfile } from "../types";

// Custom tailored tips per age milestone to satisfy "dicas para crianças de acordo com a faixa etária"
const AGE_EXCLUSIVES: Record<AgeMilestone["category"], {
  tipTitle: string;
  tipText: string;
  warningTitle: string;
  warningText: string;
  colorTheme: string;
  emoji: string;
}> = {
  "0-6_months": {
    tipTitle: "Livre Demanda e Sinais de Saciedade",
    tipText: "Amamente em livre demanda. O bebê sinaliza saciedade virando o rosto ou adormecendo. Não há necessidade de estipular horários rígidos nem dar água ou chás nestes primeiros meses.",
    warningTitle: "Evite Água e Chás Precocemente",
    warningText: "Até os 6 meses, os rins da criança são imaturos. Oferecer água ou chá pode sobrecarregar o rim e desregular a amamentação de forma grave.",
    colorTheme: "blue",
    emoji: "👶",
  },
  "6-12_months": {
    tipTitle: "Como Estimular a Mastigação",
    tipText: "Ofereça alimentos amassados com o garfo. Evite bater no liquidificador ou passar na peneira, para que o bebê treine o tônus muscular facial e a gengiva.",
    warningTitle: "Cuidado com o Risco de Engasgos",
    warningText: "Sempre corte uvas, tomates-cereja e grãos redondos em quatro partes (corte longitudinal). Nunca ofereça alimentos redondos inteiros durinhos.",
    colorTheme: "amber",
    emoji: "🍼",
  },
  "1-2_years": {
    tipTitle: "Inclusão na Mesa da Família",
    tipText: "A criança já pode comer a consistência normal da família. Evite preparar pratos separados. O melhor aprendizado nesta fase é ver os pais comendo alimentos saudáveis.",
    warningTitle: "Proibição Absoluta do Açúcar Adicionado",
    warningText: "As diretrizes oficiais da SBP proíbem açúcares refinados, doces e ultraprocessados até os 2 anos. Isso evita programação metabólica prejudicial.",
    colorTheme: "emerald",
    emoji: "🧸",
  },
  "2-5_years": {
    tipTitle: "Lidando com a Seletividade Alimentar",
    tipText: "É comum que a velocidade do crescimento diminua e a apetite oscile. Continue expondo o alimento recusado de maneiras divertidas (ex: assado, raspado, no recheio).",
    warningTitle: "Evite Embutidos e Ultraprocessados",
    warningText: "Salsicha, presunto, lombo e nuggets contêm corantes e nitratos cancerígenos pesados para o fígado do seu filho.",
    colorTheme: "purple",
    emoji: "🎨",
  },
  "5-10_years": {
    tipTitle: "Merenda Escolar Nutritiva",
    tipText: "Substitua biscoitos açucarados e achocolatados por frutas inteiras, panquecas de aveia e sucos naturais com fibras para melhorar a concentração e foco escolar.",
    warningTitle: "Atenção ao Sedentarismo e Peneira de Telas",
    warningText: "O hábito de comer em frente a telas bloqueia os sinais cerebrais de saciedade, induzindo à obesidade infantil e ganho excessivo de peso.",
    colorTheme: "indigo",
    emoji: "🎒",
  },
};

interface AgeQuickGuideWithRemindersProps {
  activeProfile: ChildProfile | null;
  currentCategory: AgeMilestone["category"];
  addSystemNotification: (msg: string) => void;
  language: "pt" | "en" | "es";
}

export default function AgeQuickGuideWithReminders({
  activeProfile,
  currentCategory,
  addSystemNotification,
  language,
}: AgeQuickGuideWithRemindersProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<AgeMilestone["category"]>(currentCategory);
  const [reminders, setReminders] = useState<{ category: AgeMilestone["category"]; time: string; channel: string }[]>(() => {
    const saved = localStorage.getItem("nutrikids_configured_reminders");
    return saved ? JSON.parse(saved) : [];
  });

  const [reminderConfig, setReminderConfig] = useState({
    time: "09:00",
    channel: "app", // 'app', 'whatsapp', 'email'
  });

  const [showConfigId, setShowConfigId] = useState<string | null>(null);

  // Sync selected milestone if current baby profile changes
  useEffect(() => {
    if (currentCategory) {
      setSelectedMilestone(currentCategory);
    }
  }, [currentCategory]);

  const activeMilestoneDetail = AGE_MILESTONES.find((m) => m.category === selectedMilestone) || AGE_MILESTONES[0];
  const exclusiveTip = AGE_EXCLUSIVES[selectedMilestone] || AGE_EXCLUSIVES["0-6_months"];

  // Handle register reminder
  const handleRegisterReminder = () => {
    const isAlreadyConfigured = reminders.some(
      (r) => r.category === selectedMilestone && r.channel === reminderConfig.channel
    );

    if (isAlreadyConfigured) {
      const msg = language === "pt"
        ? `Você já tem um lembrete ativo por este canal para esta faixa etária!`
        : language === "en"
        ? `You already have an active reminder of this channel for this age range!`
        : `¡Ya tienes un recordatorio activo por este canal para este rango de edad!`;
      addSystemNotification(`⚠️ ${msg}`);
      return;
    }

    const newReminder = {
      category: selectedMilestone,
      time: reminderConfig.time,
      channel: reminderConfig.channel,
    };

    const updated = [...reminders, newReminder];
    setReminders(updated);
    localStorage.setItem("nutrikids_configured_reminders", JSON.stringify(updated));

    // Success notification triggers
    const milestoneTitle = activeMilestoneDetail.title.split(" - ")[0];
    const channelName = 
      reminderConfig.channel === "app" ? "Notificações de App" : 
      reminderConfig.channel === "whatsapp" ? "Alertas de WhatsApp SIM" : "Mensagens no E-mail";

    const notifyMsg = language === "pt"
      ? `🔔 Lembrete Ativado: Dicas de Nutrição para "${milestoneTitle}" configurado para ${reminderConfig.time} via ${channelName}.`
      : language === "en"
      ? `🔔 Reminder Configured: Nutrition tips for "${milestoneTitle}" scheduled at ${reminderConfig.time} via ${channelName}.`
      : `🔔 Recordatorio Activado: Consejos de nutrición para "${milestoneTitle}" fijado a las ${reminderConfig.time} por ${channelName}.`;

    addSystemNotification(notifyMsg);
    setShowConfigId(null);
  };

  const removeReminder = (index: number) => {
    const updated = reminders.filter((_, idx) => idx !== index);
    setReminders(updated);
    localStorage.setItem("nutrikids_configured_reminders", JSON.stringify(updated));
    
    const msg = language === "pt"
      ? "Lembrete cancelado com sucesso."
      : language === "en"
      ? "Reminder cancelled successfully."
      : "Recordatorio cancelado con éxito.";
    addSystemNotification(`🗑️ ${msg}`);
  };

  // Translation helpers
  const translationsLocal = {
    pt: {
      sectionTitle: "Guia Rápido de Faixa Etária",
      sectionSub: "Consulte rapidamente os marcos alimentares oficiais por idade para orientar com segurança.",
      activeProfileHint: "Idade do seu bebê cadastrado",
      exclusiveTipsTitle: "Dica e Alerta Crítico do Dia",
      activateReminderButton: "🔔 Lembrar-me de Avisos & Dicas",
      yourActiveReminders: "Seus Lembretes Configurados",
      configureTitle: "Configurar Notificações",
      chooseTime: "Horário Diário",
      chooseChannel: "Canal de Recebimento",
      cancel: "Cancelar",
      activate: "Ativar Notificações",
      focusLabel: "Foco Clínico",
      noReminders: "Nenhum lembrete ativado para esta fase ainda.",
      whatsappSimulated: "WhatsApp (Simulação)",
      channelApp: "Notificações na Tela (Toast)",
      channelEmail: "E-mail Nutritivo",
      dailyLabel: "Lembrete Diário",
      activeLabel: "Ativado"
    },
    en: {
      sectionTitle: "Age Milestone Quick Guide",
      sectionSub: "Quickly browse pediatric dietary guidelines by age to feed with confidence.",
      activeProfileHint: "Registered child's age group",
      exclusiveTipsTitle: "Exclusive Tip & Critical Alert",
      activateReminderButton: "🔔 Remind Me of Alerts & Tips",
      yourActiveReminders: "Your Configured Reminders",
      configureTitle: "Setup Notifications",
      chooseTime: "Daily Time",
      chooseChannel: "Notification Channel",
      cancel: "Cancel",
      activate: "Activate Notifications",
      focusLabel: "Clinical Focus",
      noReminders: "No reminders activated for this stage yet.",
      whatsappSimulated: "WhatsApp (Simulation)",
      channelApp: "On-Screen Notifications",
      channelEmail: "Nutrition Email",
      dailyLabel: "Daily Reminder",
      activeLabel: "Activated"
    },
    es: {
      sectionTitle: "Guía Rápida de Rango de Edad",
      sectionSub: "Consulte rápidamente las pautas oficiales por edad para alimentar con confianza.",
      activeProfileHint: "Edad de su niño registrado",
      exclusiveTipsTitle: "Consejo y Alerta Crítica del Día",
      activateReminderButton: "🔔 Recordarme Alertas y Consejos",
      yourActiveReminders: "Sus Recordatorios Activados",
      configureTitle: "Configurar Notificaciones",
      chooseTime: "Horario Diario",
      chooseChannel: "Canal de Recepción",
      cancel: "Cancelar",
      activate: "Activar Notificaciones",
      focusLabel: "Enfoque Clínico",
      noReminders: "Aún no hay recordatorios activados para esta etapa.",
      whatsappSimulated: "WhatsApp (Simulación)",
      channelApp: "Notificaciones de Pantalla",
      channelEmail: "Correo Informativo",
      dailyLabel: "Recordatorio Diario",
      activeLabel: "Activado"
    }
  };

  const localText = translationsLocal[language] || translationsLocal["pt"];

  // Get active reminder for currently highlighted milestone
  const currentCategoryReminders = reminders.filter(r => r.category === selectedMilestone);

  return (
    <div 
      id="quick-milestone-guide-section" 
      className="bg-white rounded-3xl border border-orange-100/50 shadow-xs p-5 space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-orange-50/50 pb-3">
        <div className="space-y-0.5">
          <span className="text-[9px] font-extrabold text-orange-500 uppercase tracking-widest flex items-center gap-1.5 leading-none">
            <Clock className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            {localText.sectionTitle}
          </span>
          <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
            {localText.sectionSub}
          </p>
        </div>
      </div>

      {/* 5 Age Milestone round buttons selection */}
      <div className="grid grid-cols-5 gap-2 pb-1 overflow-x-auto select-none">
        {AGE_MILESTONES.map((milestone) => {
          const isSelected = selectedMilestone === milestone.category;
          
          // Determine if this represents the registered child's active milestone category
          const isYourChildsCurrent = activeProfile && currentCategory === milestone.category;
          
          const details = AGE_EXCLUSIVES[milestone.category];
          
          let ringColor = "border-gray-100 hover:border-gray-200";
          let activeBg = "bg-orange-500 text-white";
          let badgeBg = "bg-gray-150 text-gray-500";
          if (details.colorTheme === "blue") {
            ringColor = isSelected ? "border-blue-500 ring-2 ring-blue-100" : "border-blue-100 hover:bg-blue-50/40 text-blue-800";
            activeBg = "bg-blue-500 text-white border-blue-600";
            badgeBg = "bg-blue-100 text-blue-700";
          } else if (details.colorTheme === "amber") {
            ringColor = isSelected ? "border-amber-500 ring-2 ring-amber-100" : "border-amber-100 hover:bg-amber-50/40 text-amber-800";
            activeBg = "bg-amber-500 text-white border-amber-600";
            badgeBg = "bg-amber-100 text-amber-700";
          } else if (details.colorTheme === "emerald") {
            ringColor = isSelected ? "border-emerald-500 ring-2 ring-emerald-100" : "border-emerald-100 hover:bg-emerald-50/40 text-emerald-800";
            activeBg = "bg-emerald-500 text-white border-emerald-600";
            badgeBg = "bg-emerald-100 text-emerald-700";
          } else if (details.colorTheme === "purple") {
            ringColor = isSelected ? "border-purple-500 ring-2 ring-purple-100" : "border-purple-100 hover:bg-purple-50/40 text-purple-800";
            activeBg = "bg-purple-500 text-white border-purple-600";
            badgeBg = "bg-purple-100 text-purple-700";
          } else if (details.colorTheme === "indigo") {
            ringColor = isSelected ? "border-indigo-500 ring-2 ring-indigo-100" : "border-indigo-100 hover:bg-indigo-50/40 text-indigo-800";
            activeBg = "bg-indigo-500 text-white border-indigo-600";
            badgeBg = "bg-indigo-100 text-indigo-700";
          }

          return (
            <button
              key={milestone.category}
              onClick={() => setSelectedMilestone(milestone.category)}
              className={`p-2 rounded-2xl border text-center flex flex-col items-center justify-between gap-1.5 transition-all text-xs cursor-pointer min-w-0 ${
                isSelected 
                  ? `${activeBg} shadow-sm scale-[1.03] font-black` 
                  : "bg-[#FFFDFB] text-gray-500 hover:scale-[1.01]"
              } ${ringColor}`}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-white/95 select-none shrink-0 shadow-xs">
                {details.emoji}
              </div>
              <div className="flex flex-col items-center leading-none">
                <span className="text-[10px] font-black tracking-tight leading-none whitespace-nowrap">
                  {(() => {
                    const labels: Record<AgeMilestone["category"], [string, string, string]> = {
                      "0-6_months":   ["0-6 meses",  "0-6 months",  "0-6 meses" ],
                      "6-12_months":  ["6-12 meses", "6-12 months", "6-12 meses"],
                      "1-2_years":    ["1-2 anos",   "1-2 years",   "1-2 años"  ],
                      "2-5_years":    ["2-5 anos",   "2-5 years",   "2-5 años"  ],
                      "5-10_years":   ["5-10 anos",  "5-10 years",  "5-10 años" ],
                    };
                    const idx = language === "en" ? 1 : language === "es" ? 2 : 0;
                    return labels[milestone.category][idx];
                  })()}
                </span>
                
                {isYourChildsCurrent && (
                  <span className="text-[7px] uppercase font-bold text-orange-500 bg-orange-50 border border-orange-100 px-1 py-0.5 rounded mt-1 whitespace-nowrap animate-pulse">
                    Sua Criança
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected category overview */}
      <div className="bg-[#FFFDFB] border border-orange-100/40 rounded-3xl p-4 space-y-4">
        <div>
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full inline-block leading-none">
            {activeMilestoneDetail.ageRange}
          </span>
          <h3 className="text-sm font-black text-slate-800 font-display mt-1">
            {activeMilestoneDetail.title}
          </h3>
        </div>

        {/* Setup notifications panel popped inline */}
        {showConfigId === selectedMilestone && (
          <div className="bg-orange-50/50 rounded-2xl border border-orange-100 p-4 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-orange-100/40 pb-2">
              <span className="text-xs font-black text-orange-850 flex items-center gap-1.5 leading-none">
                <Smartphone className="w-4 h-4 text-orange-500" />
                {localText.configureTitle} - {activeMilestoneDetail.title.split(" - ")[0]}
              </span>
              <button 
                onClick={() => setShowConfigId(null)}
                className="text-gray-400 hover:text-gray-500 cursor-pointer p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider block">
                  {localText.chooseTime}
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={reminderConfig.time}
                    onChange={(e) => setReminderConfig({ ...reminderConfig, time: e.target.value })}
                    className="w-full text-xs font-semibold px-3 py-2 bg-white rounded-xl border border-orange-200 outline-none focus:border-orange-400 text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider block">
                  {localText.chooseChannel}
                </label>
                <select
                  value={reminderConfig.channel}
                  onChange={(e) => setReminderConfig({ ...reminderConfig, channel: e.target.value })}
                  className="w-full text-xs font-bold px-3 py-2 bg-white rounded-xl border border-orange-200 outline-none focus:border-orange-400 text-slate-800 cursor-pointer"
                >
                  <option value="app">📱 {localText.channelApp}</option>
                  <option value="whatsapp">💬 {localText.whatsappSimulated}</option>
                  <option value="email">✉️ {localText.channelEmail}</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-orange-100/30">
              <button
                onClick={() => setShowConfigId(null)}
                className="px-3 py-1.5 text-slate-500 hover:bg-gray-100 font-bold text-[10px] rounded-xl transition-all cursor-pointer"
              >
                {localText.cancel}
              </button>
              <button
                onClick={handleRegisterReminder}
                className="px-3 py-1.5 bg-orange-500 text-white font-black text-[10px] rounded-xl transition-all hover:bg-orange-600 shadow-sm cursor-pointer"
              >
                {localText.activate}
              </button>
            </div>
          </div>
        )}

        {/* Interactive Exclusive Tips & Warnings Board for current select category */}
        <div className="flex flex-col gap-3">
          <div className="bg-orange-50/40 border border-orange-100 rounded-2xl p-4 space-y-2">
            <span className="text-[9px] font-extrabold text-orange-600 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              💡 {language === "pt" ? "Dica Prática" : language === "en" ? "Practical Food Tip" : "Consejo Práctico"}
            </span>
            <h4 className="text-sm font-black text-slate-800 leading-snug">
              {exclusiveTip.tipTitle}
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              {exclusiveTip.tipText}
            </p>
          </div>

          <div className="bg-rose-50/40 border border-rose-200 rounded-2xl p-4 space-y-2">
            <span className="text-[9px] font-extrabold text-rose-600 uppercase tracking-widest flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              🚨 {language === "pt" ? "Alerta Nutricional Crítico" : language === "en" ? "Critical Nutrition Alert" : "Alerta de Nutrición Crítica"}
            </span>
            <h4 className="text-sm font-black text-rose-800 leading-snug">
              {exclusiveTip.warningTitle}
            </h4>
            <p className="text-xs text-rose-900 leading-relaxed font-medium">
              {exclusiveTip.warningText}
            </p>
          </div>
        </div>

        {/* Show configured reminders specifically for this Milestone */}
        {currentCategoryReminders.length > 0 && (
          <div className="pt-2 border-t border-orange-100/30">
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider block mb-2">
              🔔 {localText.yourActiveReminders} ({currentCategoryReminders.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {reminders.map((rem, idx) => {
                if (rem.category !== selectedMilestone) return null;
                const indexInMain = reminders.indexOf(rem);
                return (
                  <div 
                    key={idx} 
                    className="flex items-center gap-2 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-xl text-[10px] font-bold text-orange-850"
                  >
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping"></span>
                    <span>
                      {rem.channel === "app" ? "📱 App" : rem.channel === "whatsapp" ? "💬 Whats" : "✉️ E-mail"} - {rem.time}
                    </span>
                    <button
                      onClick={() => removeReminder(indexInMain)}
                      className="hover:text-red-500 ml-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reminder CTA — 1 clique, 9:00 padrão */}
        {currentCategoryReminders.length === 0 ? (
          <div className="mt-2 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-800 leading-tight">
                {language === "pt" ? "Receber dica às 9h todos os dias" : language === "en" ? "Receive tip at 9am every day" : "Recibir consejo a las 9am"}
              </p>
              <p className="text-[9px] text-gray-400 font-medium mt-0.5">
                {language === "pt" ? "Dica nutricional + lembrete de atualizar dados" : language === "en" ? "Nutrition tip + data update reminder" : "Consejo + recordatorio de actualizar datos"}
              </p>
            </div>
            <button
              onClick={() => {
                const newReminder = { category: selectedMilestone, time: "09:00", channel: "app" };
                const updated = [...reminders, newReminder];
                setReminders(updated);
                localStorage.setItem("nutrikids_configured_reminders", JSON.stringify(updated));
                localStorage.setItem("nutrikids_reminder_activated_at", new Date().toISOString());
                addSystemNotification("🔔 Lembrete ativado! Você receberá dicas nutricionais todos os dias às 9h.");
              }}
              className="shrink-0 px-3 py-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-[10px] font-black rounded-xl transition-all cursor-pointer shadow-sm shadow-orange-200"
            >
              🔔 {language === "pt" ? "Ativar" : language === "en" ? "Activate" : "Activar"}
            </button>
          </div>
        ) : (
          <div className="mt-2 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-emerald-800 leading-tight">
                {language === "pt" ? "Lembrete ativo às 9h ✓" : language === "en" ? "Reminder active at 9am ✓" : "Recordatorio activo a las 9am ✓"}
              </p>
              <p className="text-[9px] text-emerald-600 font-medium mt-0.5">
                {language === "pt" ? "Dicas diárias de nutrição ativadas" : language === "en" ? "Daily nutrition tips activated" : "Consejos diarios de nutrición activados"}
              </p>
            </div>
            <button
              onClick={() => { removeReminder(reminders.findIndex(r => r.category === selectedMilestone)); }}
              className="shrink-0 px-3 py-2 bg-white border border-emerald-200 text-emerald-700 text-[10px] font-black rounded-xl transition-all cursor-pointer hover:bg-emerald-50"
            >
              {language === "pt" ? "Desativar" : language === "en" ? "Disable" : "Desactivar"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
