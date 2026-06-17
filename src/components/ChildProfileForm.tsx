/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { ChildProfile } from "../types";
import { Baby, Calendar, User, Activity, AlertTriangle, Sparkles, CheckCircle2, Camera } from "lucide-react";
import { calculateChildMetrics } from "../utils/nutritionData";

interface ChildProfileFormProps {
  profiles: ChildProfile[];
  activeProfileId: string | null;
  onSelectProfile: (id: string) => void;
  onSaveProfile: (profile: ChildProfile) => void;
  onDeleteProfile: (id: string) => void;
  isEditingExternal?: boolean;
  setIsEditingExternal?: (val: boolean) => void;
}

export default function ChildProfileForm({
  profiles,
  activeProfileId,
  onSelectProfile,
  onSaveProfile,
  onDeleteProfile,
  isEditingExternal,
  setIsEditingExternal,
}: ChildProfileFormProps) {
  const [localIsEditing, setLocalIsEditing] = useState(false);
  const isEditing = setIsEditingExternal !== undefined ? isEditingExternal : localIsEditing;
  const setIsEditing = (val: boolean) => {
    if (setIsEditingExternal !== undefined) {
      setIsEditingExternal(val);
    } else {
      setLocalIsEditing(val);
    }
  };

  const [name, setName] = useState("");
  const defaultBirthDate = () => {
    const d = new Date();
    d.setMonth(d.getMonth() - 6);
    return d.toISOString().split("T")[0];
  };
  const [birthDate, setBirthDate] = useState(defaultBirthDate);
  const [gender, setGender] = useState<"M" | "F">("M");
  const [weight, setWeight] = useState(7.5);
  const [height, setHeight] = useState(68);
  const [isPremature, setIsPremature] = useState(false);
  const [allergies, setAllergies] = useState("");
  const [restrictions, setRestrictions] = useState("");
  const [specialConditions, setSpecialConditions] = useState("");
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const activeProfile = profiles.find((p) => p.id === activeProfileId);
  const metrics = activeProfile ? calculateChildMetrics(activeProfile.birthDate) : null;

  React.useEffect(() => {
    if (isEditing && !activeProfile) {
      setName("");
      setBirthDate(defaultBirthDate());
      setGender("M");
      setWeight(7.5);
      setHeight(68);
      setIsPremature(false);
      setAllergies("");
      setRestrictions("");
      setSpecialConditions("");
      setPhoto(undefined);
    }
  }, [isEditing, activeProfileId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProfile: ChildProfile = {
      id: activeProfileId && !isEditing ? activeProfileId : Math.random().toString(36).substring(7),
      name: name.trim(),
      birthDate,
      gender,
      weight,
      height,
      isPremature,
      allergies: allergies.trim(),
      restrictions: restrictions.trim(),
      specialConditions: specialConditions.trim(),
      photo,
    };

    onSaveProfile(newProfile);
    setIsEditing(false);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setBirthDate(defaultBirthDate());
    setGender("M");
    setWeight(7.5);
    setHeight(68);
    setIsPremature(false);
    setAllergies("");
    setRestrictions("");
    setSpecialConditions("");
    setPhoto(undefined);
  };

  const handleEditClick = () => {
    if (activeProfile) {
      setName(activeProfile.name);
      setBirthDate(activeProfile.birthDate);
      setGender(activeProfile.gender);
      setWeight(activeProfile.weight);
      setHeight(activeProfile.height);
      setIsPremature(activeProfile.isPremature);
      setAllergies(activeProfile.allergies);
      setRestrictions(activeProfile.restrictions);
      setSpecialConditions(activeProfile.specialConditions);
      setPhoto(activeProfile.photo);
      setIsEditing(true);
    }
  };

  return (
    <div id="child-profile-section" className="bg-white rounded-3xl border border-orange-100/50 shadow-xs p-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-12 -mt-12 -z-0 opacity-40"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Baby className="w-5 h-5 text-orange-500" />
            <h2 className="text-base font-extrabold text-gray-800 tracking-tight font-display">Perfil da Criança</h2>
          </div>
          
          {!isEditing && (
            <button
              onClick={() => {
                resetForm();
                setIsEditing(true);
              }}
              className="px-3 py-1.5 bg-orange-50 text-orange-600 font-bold text-xs rounded-xl hover:bg-orange-100 transition-colors flex items-center gap-1 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Adicionar
            </button>
          )}
        </div>

        {/* Profile Selector tabs */}
        {profiles.length > 0 && !isEditing && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {profiles.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelectProfile(p.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all active:scale-95 ${
                  p.id === activeProfileId
                    ? "bg-orange-500 text-white shadow-sm shadow-orange-150"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100/60"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-extrabold text-gray-700 text-xs border-b border-gray-100 pb-2">
              {activeProfile ? `Ajustando perfil de ${activeProfile.name}` : "Cadastre uma nova criança"}
            </h3>

            {/* Photo upload */}
            <div className="flex justify-center mb-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-orange-300 bg-orange-50 flex items-center justify-center group hover:border-orange-400 transition-colors"
              >
                {photo ? (
                  <img src={photo} alt="Foto" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Camera className="w-6 h-6 text-orange-400" />
                    <span className="text-[9px] font-bold text-orange-400">Foto</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Nome</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Theo, Cecília..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Nascimento</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Sexo Biológico</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setGender("M")}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-xl border text-center transition-all ${
                      gender === "M"
                        ? "bg-orange-50 border-orange-450 text-orange-700"
                        : "bg-gray-50 border-gray-100 text-gray-500"
                    }`}
                  >
                    Menino
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender("F")}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-xl border text-center transition-all ${
                      gender === "F"
                        ? "bg-rose-50 border-rose-300 text-rose-700"
                        : "bg-gray-50 border-gray-100 text-gray-500"
                    }`}
                  >
                    Menina
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max="60"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Altura (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="160"
                    value={height}
                    onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 mt-2">
              <input
                type="checkbox"
                id="premature"
                checked={isPremature}
                onChange={(e) => setIsPremature(e.target.checked)}
                className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-400 mt-0.5"
              />
              <label htmlFor="premature" className="text-[11px] font-medium text-gray-650 cursor-pointer leading-tight">
                Nascido prematuro (ajusta marcos de acompanhamento)
              </label>
            </div>

            <div className="space-y-2 mt-2">
              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Alergias Alimentares</label>
                <input
                  type="text"
                  placeholder="Ex: Amendoim, APLV..."
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Restrições</label>
                <input
                  type="text"
                  placeholder="Ex: Vegetariano, Sem glúten..."
                  value={restrictions}
                  onChange={(e) => setRestrictions(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Condições Especiais</label>
                <input
                  type="text"
                  placeholder="Ex: Refluxo, Intolerância..."
                  value={specialConditions}
                  onChange={(e) => setSpecialConditions(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  resetForm();
                }}
                className="px-3.5 py-1.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-all shadow-xs"
              >
                Salvar Dados
              </button>
            </div>
          </form>
        ) : activeProfile && metrics ? (
          <div className="bg-gradient-to-br from-orange-50/70 to-amber-50/30 p-4 rounded-2xl border border-orange-100/50 flex flex-col justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0 font-extrabold text-lg overflow-hidden">
                {activeProfile.photo ? (
                  <img src={activeProfile.photo} alt={activeProfile.name} className="w-full h-full object-cover" />
                ) : (
                  activeProfile.name[0].toUpperCase()
                )}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h3 className="text-sm font-extrabold text-gray-850 truncate">{activeProfile.name}</h3>
                  <span className="px-1.5 py-0.2 rounded-md text-[8px] uppercase tracking-wider font-extrabold bg-orange-100/80 text-orange-850 border border-orange-100/40">
                    {activeProfile.gender === "M" ? "Menino" : "Menina"}
                  </span>
                  {activeProfile.isPremature && (
                    <span className="px-1.5 py-0.2 rounded-md text-[8px] uppercase tracking-wider font-extrabold bg-amber-100 text-amber-800">
                      Prematuro
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-gray-500 mt-0.5 leading-none font-medium">
                  Idade: <span className="font-bold text-gray-700">{metrics.exactAgeStr}</span>
                </p>

                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] text-gray-500 font-semibold">
                  <span className="flex items-center gap-0.5">
                    <Activity className="w-3 h-3 text-orange-500" />
                    {activeProfile.weight} kg
                  </span>
                  <span>•</span>
                  <span>{activeProfile.height} cm</span>
                  <span>•</span>
                  <span>IMC: {(activeProfile.weight / Math.pow(activeProfile.height / 100, 2)).toFixed(1)}</span>
                </div>

                {/* Allergies / Special conditions alerts */}
                {(activeProfile.allergies || activeProfile.restrictions || activeProfile.specialConditions) && (
                  <div className="mt-2.5 space-y-1">
                    {activeProfile.allergies && (
                      <div className="flex items-center gap-1 text-[9.5px] text-rose-650 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100 w-fit font-bold">
                        <AlertTriangle className="w-3 h-3 text-rose-500" />
                        <span>Alergia: {activeProfile.allergies}</span>
                      </div>
                    )}
                    {(activeProfile.restrictions || activeProfile.specialConditions) && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {activeProfile.restrictions && (
                          <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-md border border-slate-200">
                            Restrição: {activeProfile.restrictions}
                          </span>
                        )}
                        {activeProfile.specialConditions && (
                          <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.2 rounded-md">
                            Condição: {activeProfile.specialConditions}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 justify-end mt-1 border-t border-orange-100/30 pt-2 shrink-0">
              <button
                onClick={handleEditClick}
                className="px-3 py-1 bg-white border border-gray-200 rounded-xl text-[10px] font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-2xs"
              >
                Editar
              </button>
              <button
                onClick={() => {
                  if (confirm(`Excluir o perfil de ${activeProfile.name}?`)) {
                    onDeleteProfile(activeProfile.id);
                  }
                }}
                className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-650 rounded-xl text-[10px] font-bold transition-all"
              >
                Excluir
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 bg-orange-50/10 rounded-2xl border border-dashed border-orange-100">
            <Baby className="w-8 h-8 text-orange-200 mx-auto mb-2" />
            <p className="text-gray-500 text-xs font-semibold">Nenhum bebê cadastrado.</p>
            <p className="text-[10px] text-gray-400 mt-1 max-w-[200px] mx-auto">Adicione um perfil para receber recomendações de acordo com a idade.</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-3 px-3.5 py-1.5 bg-orange-500 text-white font-bold text-xs rounded-xl hover:bg-orange-600 transition-all shadow-xs"
            >
              Criar Perfil
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
