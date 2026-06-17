import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

// Allow ample body sizes for base64 images (camera scan)
app.use(express.json({ limit: "15mb" }));

// Initialize Gemini client on server-side only
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Prompt context helper for WHO / UNICEF / SBP standards
const SYSTEM_INSTRUCTION_BASE = `
Você é o NutriKids AI, um pediatra e especialista em nutrição infantil digital auxiliar.
Suas respostas são altamente confiáveis, baseadas em diretrizes científicas oficiais da OMS (Organização Mundial da Saúde), UNICEF, Sociedade Brasileira de Pediatria (SBP) e Ministério da Saúde do Brasil.

Instruções para o chat/pesquisa:
- Sempre mencione qual é a recomendação oficial do órgão científico para a idade indicada.
- Use linguagem acolhedora, empática, porém técnica e precisa.
- Divida as informações em pontos claros e fáceis de ler para mães e pais cansados.
- Sempre que houver riscos (como botulismo, asfixia/engasgo, reações alérgicas importantes, sobrecarga renal), explique cientificamente o motivo e destaque o risco claramente.
- Se o alimento não for ideal, recomende alternativas de alimentos seguros e adequados para a idade da criança.
- Adicione referências científicas ou fontes no final em um bloco simples.
`;

function getLangInstruction(lang: string) {
  if (lang === "en") {
    return "Respond STRICTLY in English. Ensure all output descriptions, food ratings (like 'RECOMMENDED', 'MODERATE', 'NOT RECOMMENDED'), titles, explanations, risks, alternative names, lists, and instructions are fully written in English. Do not write in Portuguese.";
  }
  if (lang === "es") {
    return "Responde ESTRICTAMENTE en Español. Asegúrate de que todas las descripciones, calificaciones de alimentos (como 'RECOMENDADO', 'CONSUMO MODERADO', 'NO RECOMENDADO'), títulos, explicaciones, riesgos, nombres alternativos, listas e instrucciones estén completamente escritos en español. No escribas en portugués.";
  }
  return "Responda ESTRITAMENTE em Português do Brasil. Toda a saída, qualificações, justificativas, descrições e instruções devem estar em português.";
}

// API 1: Chat Nutricional Inteligente (non-streaming fallback)
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [], childProfile, lang = "pt" } = req.body;

    let childContext = "Criança Geral";
    if (childProfile) {
      const { name, ageMonths, isPremature, allergies, restrictions, specialConditions } = childProfile;
      childContext = `Criança: ${name || "Sem nome"}, Idade: ${ageMonths} meses, Prematuro: ${isPremature ? "Sim" : "Não"}, Alergias: ${allergies || "Nenhuma"}, Restrições: ${restrictions || "Nenhuma"}, Condições especiais: ${specialConditions || "Nenhuma"}.`;
    }

    const fullInstruction = `${SYSTEM_INSTRUCTION_BASE}\nContexto atual da criança:\n${childContext}\n\n${getLangInstruction(lang)}`;

    // Build multi-turn contents from history + new message
    const contents = [
      ...history.map((h: { role: string; text: string }) => ({
        role: h.role === "model" ? "model" : "user",
        parts: [{ text: h.text }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
      config: {
        systemInstruction: fullInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "Desculpe, não consegui obter uma resposta adequada. Tente novamente.";
    res.json({ reply });
  } catch (error: any) {
    console.error("Erro na rota /api/chat:", error);
    res.status(500).json({ error: error.message || "Erro interno do servidor" });
  }
});

// API 1b: Chat com Streaming (SSE)
app.post("/api/chat-stream", async (req, res) => {
  try {
    const { message, history = [], childProfile, lang = "pt" } = req.body;

    let childContext = "Criança Geral";
    if (childProfile) {
      const { name, ageMonths, isPremature, allergies, restrictions, specialConditions } = childProfile;
      childContext = `Criança: ${name || "Sem nome"}, Idade: ${ageMonths} meses, Prematuro: ${isPremature ? "Sim" : "Não"}, Alergias: ${allergies || "Nenhuma"}, Restrições: ${restrictions || "Nenhuma"}, Condições especiais: ${specialConditions || "Nenhuma"}.`;
    }

    const fullInstruction = `${SYSTEM_INSTRUCTION_BASE}\nContexto atual da criança:\n${childContext}\n\n${getLangInstruction(lang)}`;

    const contents = [
      ...history.map((h: { role: string; text: string }) => ({
        role: h.role === "model" ? "model" : "user",
        parts: [{ text: h.text }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const stream = await ai.models.generateContentStream({
      model: "gemini-2.0-flash",
      contents,
      config: { systemInstruction: fullInstruction, temperature: 0.7 },
    });

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error: any) {
    console.error("Erro na rota /api/chat-stream:", error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// API 2: Alerta Mamãe / Consulta Direta de Alimentos
app.post("/api/alerta-mamae", async (req, res) => {
  try {
    const { foodName, ageMonths, lang = "pt" } = req.body;

    if (!foodName) {
      return res.status(400).json({ error: "Nome do alimento é obrigatório" });
    }

    const prompt = `Analise o alimento "${foodName}" para uma criança de ${ageMonths || 6} meses de idade.
    Sua resposta deve seguir estritamente o formato JSON de exemplo abaixo:
    {
      "rating": "NÃO RECOMENDADO" | "RECOMENDADO" | "CONSUMO MODERADO" (ou equivalente traduzido se lang for en/es: ex. 'NOT RECOMMENDED', 'RECOMMENDED', 'MODERATE CONSUMPTION'),
      "ageLimitation": "Não recomendado para menores de X anos/meses" ou "Permitido",
      "reason": "Explicar cientificamente por que este alimento é classificado assim para essa faixa etária.",
      "risks": ["Risco 1", "Risco 2"] (se houver, por exemplo: 'Sobrecarga renal', 'Risco de engasgo', 'Anemia', 'Sódio excessivo'),
      "benefits": ["Benefício 1", "Benefício 2"] (se houver),
      "alternatives": ["Alternativa segura 1", "Alternativa segura 2"],
      "howToIntroduce": "Explicação curta de como introduzir este alimento (se for recomendado ou moderado) ou quando introduzir futuramente.",
      "source": "Mencione fontes como SBP, OMS, UNICEF ou Ministério da Saúde"
    }`;

    const langModifier = getLangInstruction(lang);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction: `${SYSTEM_INSTRUCTION_BASE}\nSua resposta DEVE ser estritamente em formato JSON válido, respeitando o esquema solicitado. Não adicione markdown externo além das propriedades JSON.\n\n${langModifier}`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rating: { type: Type.STRING },
            ageLimitation: { type: Type.STRING },
            reason: { type: Type.STRING },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
            alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
            howToIntroduce: { type: Type.STRING },
            source: { type: Type.STRING },
          },
          required: ["rating", "ageLimitation", "reason", "risks", "benefits", "alternatives", "howToIntroduce", "source"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Erro na rota /api/alerta-mamae:", error);
    res.status(500).json({ error: error.message || "Erro interno do servidor" });
  }
});

// API 3: Escaneamento Inteligente de Produtos (Suporte a imagem ou descrição nutricional)
app.post("/api/scan-product", async (req, res) => {
  try {
    const { imageBase64, mimeType, textDescription, ageMonths, lang = "pt" } = req.body;

    const systemPrompt = `${SYSTEM_INSTRUCTION_BASE}
    Você é um scanner inteligente de rótulo / produto alimentício infantil.
    Você deve analisar a imagem do produto, rótulo ou a lista de ingredientes/tabela nutricional passada pela mãe e retornar seu veredito e explicações científicas sobre o teor de Açúcar, Sódio, Conservantes, Gorduras Trans/Saturadas e Corantes.
    
    Retorne a análise estritamente no seguinte formato JSON:
    {
      "productName": "Nome identificado do produto ou 'Desconhecido'",
      "rating": "Não recomendado" | "Recomendado" | "Consumo moderado" (ou equivalente traduzido se en/es),
      "highlights": {
        "sugar": "Alto" | "Moderado" | "Baixo/Inexistente",
        "sodium": "Alto" | "Moderado" | "Baixo/Inexistente",
        "additives": "Alto (conservantes/corantes)" | "Moderado" | "Isento",
        "fats": "Alto (gorduras ruins)" | "Moderado" | "Baixo"
      },
      "evaluation": "Explicação científica de por que este alimento é bom, moderado ou ruim para uma criança de ${ageMonths || 12} meses.",
      "risks": "Lista de riscos do consumo precoce ou excessivo.",
      "alternatives": ["Alternativa saudável 1", "Alternativa saudável 2"],
      "source": "Órgão regulador ou diretriz (ex: SBP / OMS / Anvisa)"
    }\n\n${getLangInstruction(lang)}`;

    let response;

    if (imageBase64 && mimeType) {
      // Multimodal processing
      const imagePart = {
        inlineData: {
          mimeType: mimeType,
          data: imageBase64,
        },
      };
      const textPart = {
        text: `Seguindo o formato JSON configurado no sistema, analise esta imagem de produto alimentício infantil para uma faixa etária de ${ageMonths || 12} meses. Analise o que puder ler no rótulo, embalagem ou ingredientes.`,
      };

      response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: { parts: [imagePart, textPart] },
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              productName: { type: Type.STRING },
              rating: { type: Type.STRING },
              highlights: {
                type: Type.OBJECT,
                properties: {
                  sugar: { type: Type.STRING },
                  sodium: { type: Type.STRING },
                  additives: { type: Type.STRING },
                  fats: { type: Type.STRING },
                },
                required: ["sugar", "sodium", "additives", "fats"],
              },
              evaluation: { type: Type.STRING },
              risks: { type: Type.STRING },
              alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
              source: { type: Type.STRING },
            },
            required: ["productName", "rating", "highlights", "evaluation", "risks", "alternatives", "source"],
          }
        },
      });
    } else {
      // Text analytical fallback
      const textPrompt = `Analise a descrição/ingredientes do produto infantil: "${textDescription || "Leite em pó com açúcar"}" para uma criança de ${ageMonths || 12} meses.`;
      response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: textPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              productName: { type: Type.STRING },
              rating: { type: Type.STRING },
              highlights: {
                type: Type.OBJECT,
                properties: {
                  sugar: { type: Type.STRING },
                  sodium: { type: Type.STRING },
                  additives: { type: Type.STRING },
                  fats: { type: Type.STRING },
                },
                required: ["sugar", "sodium", "additives", "fats"],
              },
              evaluation: { type: Type.STRING },
              risks: { type: Type.STRING },
              alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
              source: { type: Type.STRING },
            },
            required: ["productName", "rating", "highlights", "evaluation", "risks", "alternatives", "source"],
          }
        }
      });
    }

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Erro na rota /api/scan-product:", error);
    res.status(500).json({ error: error.message || "Erro interno do servidor" });
  }
});

// API 4: Geração de Cardápios Inteligentes Personalizados via IA
app.post("/api/generate-menu", async (req, res) => {
  try {
    const { ageMonths, weight, allergies, restrictions, preferences, lang = "pt" } = req.body;

    const prompt = `Gere um cardápio semanal completo de 1 dia (Lanche da manhã/Café, Lanche, Almoço, Jantar) para uma criança saudável de ${ageMonths} meses de idade, pesando ${weight || "adequado"} kg.
    Alergias passadas e limitações: ${allergies || "Nenhuma"}.
    Restrições: ${restrictions || "Nenhuma"}.
    Preferências ou ingredientes disponíveis: ${preferences || "Variados"}.
    
    Retorne obrigatoriamente um formato JSON estruturado como abaixo:
    {
      "meals": [
        {
          "type": "Café da Manhã (or translated meal type if lang is en/es)",
          "time": "08:00",
          "title": "Nome da receita/alimento sugerido",
          "ingredients": ["Ingrediente 1", "Ingrediente 2"],
          "instructions": "Modo de preparo simples e focado em manter os nutrientes.",
          "portion": "Ex: 1 banana amassada, ou 120ml de leite",
          "nutritionalBenefits": "Explicação de quais vitaminas e minerais este prato foca (ex: rico em Cálcio, Vitamina C)."
        },
        ...
      ],
      "pediatricNote": "Nota atenciosa contendo dicas de introdução, hidratação e cuidados baseados na faixa etária.",
      "vibeCheck": "Explicação científica curta da adequação baseada nas diretrizes SBP/OMS."
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction: `${SYSTEM_INSTRUCTION_BASE}\nCrie sugestões práticas de preparar, seguras contra engasgo, ricas em micronutrientes correspondentes à idade fornecida. Responda de forma estritamente serializada em JSON.\n\n${getLangInstruction(lang)}`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            meals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  time: { type: Type.STRING },
                  title: { type: Type.STRING },
                  ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                  instructions: { type: Type.STRING },
                  portion: { type: Type.STRING },
                  nutritionalBenefits: { type: Type.STRING },
                },
                required: ["type", "time", "title", "ingredients", "instructions", "portion", "nutritionalBenefits"],
              },
            },
            pediatricNote: { type: Type.STRING },
            vibeCheck: { type: Type.STRING },
          },
          required: ["meals", "pediatricNote", "vibeCheck"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Erro na rota /api/generate-menu:", error);
    res.status(500).json({ error: error.message || "Erro interno do servidor" });
  }
});

// Configure Vite or Static Assets based on environment
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[NutriKids API] Servidor rodando em http://localhost:${PORT}`);
    if (!apiKey) {
      console.warn("⚠️ ALERTA: GEMINI_API_KEY não encontrada no ambiente! Algumas funções de IA retornarão erros.");
    }
  });
}

startServer();
