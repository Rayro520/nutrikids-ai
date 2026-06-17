/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FoodRating = "RECOMENDADO" | "CONSUMO_MODERADO" | "NAO_RECOMENDADO";

export interface ChildProfile {
  id: string;
  name: string;
  birthDate: string;
  gender: "M" | "F";
  weight: number; // in kg
  height: number; // in cm
  isPremature: boolean;
  allergies: string;
  restrictions: string;
  specialConditions: string;
  photo?: string; // base64 data URL
}

export interface AgeMilestone {
  category: "0-6_months" | "6-12_months" | "1-2_years" | "2-5_years" | "5-10_years";
  title: string;
  ageRange: string;
  focus: string;
  permitted: string[];
  prohibited: string[];
  alerts: string[];
  nutrientsToMonitor?: string[];
}

export interface FoodAnalysis {
  rating: FoodRating;
  ageLimitation: string;
  reason: string;
  risks: string[];
  benefits: string[];
  alternatives: string[];
  howToIntroduce: string;
  source: string;
}

export interface ProductScanResult {
  productName: string;
  rating: "Recomendado" | "Consumo moderado" | "Não recomendado";
  highlights: {
    sugar: string;
    sodium: string;
    additives: string;
    fats: string;
  };
  evaluation: string;
  risks: string;
  alternatives: string[];
  source: string;
}

export interface Meal {
  type: string;
  time: string;
  title: string;
  ingredients: string[];
  instructions: string;
  portion: string;
  nutritionalBenefits: string;
}

export interface SmartMenu {
  meals: Meal[];
  pediatricNote: string;
  vibeCheck?: string;
}

export interface Message {
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

export interface VitaminValue {
  label: string; // e.g., Vitamina A, Ferro
  current: number; // amount of mg/mcg/g logged
  target: number; // RDA target for the age milestone
  unit: string; // e.g. "mcg", "mg", "g"
  color: string; // Tailwind color class decoration
}

export interface DailyFoodLog {
  id: string;
  foodName: string;
  portionSize: string; // e.g. "1 fatia", "1 banana"
  calories: number;
  vitaminsAndMinerals: {
    "Vitamina A"?: number;
    "Vitamina C"?: number;
    "Vitamina D"?: number;
    "Vitamina B12"?: number;
    "Ferro"?: number;
    "Zinco"?: number;
    "Magnésio"?: number;
    "Cálcio"?: number;
    "Potássio"?: number;
  };
  timestamp: string; // ISO string
}

export interface GrowthRecord {
  id: string; 
  date: string;
  ageMonths: number;
  weight: number; // in kg
  height: number; // in cm
  bmi: number; // weight / (height/100)^2
}

export interface ForumComment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  isProfessional?: boolean; // verified pediatrician/nutricionista
  professionalTitle?: string; // e.g. "Dra. Ana - Pediatra"
}

export interface ForumPost {
  id: string;
  author: string;
  category: "Introdução Alimentar" | "Receitas Saudáveis" | "Alergias e Dúvidas" | "Geral";
  title: string;
  content: string;
  votes: number;
  comments: ForumComment[];
  timestamp: string;
  isModerated: boolean;
  moderatorReply?: {
    author: string;
    text: string;
    title: string;
    timestamp: string;
  };
}
