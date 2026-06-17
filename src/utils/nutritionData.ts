import { ChildProfile, AgeMilestone, FoodAnalysis, ForumPost } from "../types";

// Official scientific guidelines base data
export const OFFICIAL_RESPONSIBILITIES = [
  {
    org: "Sociedade Brasileira de Pediatria (SBP)",
    guideline: "Guia Prático de Introdução Alimentar e Aleitamento",
    lastUpdated: "2024",
    evidenceLevel: "Grau de Recomendação A (Altamente Recomendado)",
  },
  {
    org: "Organização Mundial da Saúde (OMS)",
    guideline: "Infant and Young Child Feeding Guidelines",
    lastUpdated: "2023",
    evidenceLevel: "Diretriz Global",
  },
  {
    org: "Ministério da Saúde - Brasil",
    guideline: "Guia Alimentar para Crianças Brasileiras Menores de 2 Anos",
    lastUpdated: "2021",
    evidenceLevel: "Políticas Públicas Baseadas em Evidências",
  },
  {
    org: "UNICEF",
    guideline: "Improving Child Nutrition and Development Guidelines",
    lastUpdated: "2023",
    evidenceLevel: "Evidência de Alto Impacto",
  },
];

// Age Milestone specific rules
export const AGE_MILESTONES: AgeMilestone[] = [
  {
    category: "0-6_months",
    title: "0 a 6 Meses - Lactante Exclusivo",
    ageRange: "Nascimento até 6 meses",
    focus: "Aleitamento Materno Exclusivo / Fórmulas Infantis",
    permitted: [
      "Leite Materno (Padrão Ouro absoluto)",
      "Fórmula Infantil adequada (se indicado por pediatra)",
    ],
    prohibited: [
      "Leite de Vaca integral (causa microssangramentos intestinais)",
      "Mel de abelha (risco gravíssimo de Botulismo infantil)",
      "Água em excesso (pode causar intoxicação por água ou saciedade artificial)",
      "Chás (podem interferir na absorção de ferro; risco de irritabilidade)",
      "Sucos (alta concentração de frutose sem fibras, excesso calórico precoce)",
      "Refrigerantes e Açúcar (altíssimo risco de obesidade e desregulação metabólica)",
      "Sal (conduz a sobrecarga renal severa do sistema renal imaturo)",
    ],
    alerts: [
      "Leite materno até 6 meses dispensa água ou chás, mesmo em dias muito quentes.",
      "A introdução alimentar precoce aumenta o risco de alergias e problemas gastrointestinais.",
    ],
    nutrientsToMonitor: ["Vitamina D (geralmente suplementada)", "Ferro (conforme orientação médica pós-natal)"],
  },
  {
    category: "6-12_months",
    title: "6 a 12 Meses - Introdução Alimentar",
    ageRange: "6 meses a 1 ano",
    focus: "Apresentação de texturas, sabores e novos grupos alimentares",
    permitted: [
      "Banana amassada",
      "Mamão, Abacate, Maçã cozida",
      "Abóbora, Batata-doce, Mandioquinha raspados",
      "Frango desfiado / moído",
      "Feijão amassado",
      "Ovo cozido (excelente fonte de colina e proteína)",
    ],
    prohibited: [
      "Mel (risco de botulismo)",
      "Açúcar de adição e doces",
      "Sal excessivo",
      "Frituras de qualquer natureza",
      "Sucos industriais ou refrigerantes",
      "Alimentos com alto teor de sódio ou conservantes",
    ],
    alerts: [
      "Risco de engasgo: Evite dar pedaços arredondados inteiros, como uvas ou tomate cereja sem cortar em 4.",
      "Introduza um alimento novo de cada vez para poder rastrear possíveis reações alérgicas.",
      "Não amasse a comida no liquidificador. Respeite o desenvolvimento da mastigação oferecendo comida amassada com garfo.",
    ],
    nutrientsToMonitor: ["Ferro", "Zinco", "Vitamina C (para absorver o ferro)", "Vitamina A"],
  },
  {
    category: "1-2_years",
    title: "1 a 2 Anos - Transição para Comida da Família",
    ageRange: "12 meses a 24 meses",
    focus: "Inserção gradativa na rotina da mesa, consistência padrão",
    permitted: [
      "Frutas variadas sólidas inteiras ou cortadas",
      "Verduras folhosas cozidas ou bem higienizadas picadas",
      "Cereais e tubérculos (Arroz, Aveia, Mandioca)",
      "Proteínas de alta qualidade (Peixe sem espinhos, Ovo, Carne moída)",
      "Água (Lembre de oferecer constantemente na rotina)",
    ],
    prohibited: [
      "Ultraprocessados (biscoitos recheados, salgadinhos)",
      "Balas, pirulitos, marshmallows e chicletes (risco extremo de asfixia e cáries)",
      "Refrigerantes ou Achocolatados do comércio",
      "Alimentos fritos e excesso de temperos condimentados industriais",
    ],
    alerts: [
      "A partir de 1 ano, a velocidade de crescimento cai ligeiramente e a criança pode comer menos. Não force a alimentação.",
      "Açúcar de adição continua proibido por padrão ouro até os 2 anos de idade pelas diretrizes SBP.",
    ],
    nutrientsToMonitor: ["Cálcio", "Vitamina D", "Ferro", "Zinco", "Magnésio"],
  },
  {
    category: "2-5_years",
    title: "2 a 5 Anos - Autonomia e Hábitos",
    ageRange: "2 anos a 5 anos",
    focus: "Seletividade alimentar e consolidação dos hábitos",
    permitted: [
      "Refeições equilibradas contendo todos os grupos da pirâmide alimentar",
      "Legumes de texturas variadas para incentivar a aceitação",
      "Cálcio de fontes ricas (Laticínios de qualidade ou vegetais verdes escuros)",
    ],
    prohibited: [
      "Excesso de sucos açucarados artificiais",
      "Embutidos (Salsicha, Presunto, Lombo - contêm corantes e nitratos cancerígenos)",
      "Refeições ricas em gorduras trans",
    ],
    alerts: [
      "Período comum de seletividade alimentar: continue oferecendo o mesmo alimento de formas diferentes.",
      "Estimule seu filho a comer de forma autônoma.",
    ],
    nutrientsToMonitor: ["Ferro", "Zinco", "Vitamina D", "Vitamina A", "Cálcio", "Fibras"],
  },
  {
    category: "5-10_years",
    title: "5 a 10 Anos - Escolar e Ativo",
    ageRange: "5 anos a 10 anos",
    focus: "Concentração nos estudos, energia para atividades esportivas e socialização",
    permitted: [
      "Lanches escolares saudáveis (frutas secas, sanduíches naturais)",
      "Oleaginosas (castanhas, nozes) sob vigilância",
      "Água de coco e sucos naturais moderados",
    ],
    prohibited: [
      "Fast food como rotina alimentar",
      "Bebidas energéticas ou refrigerantes de cola",
      "Consumo rotineiro de doces e frituras no ambiente escolar",
    ],
    alerts: [
      "A alimentação nesta fase impacta diretamente o rendimento escolar e foco intelectual.",
      "A obesidade infantil costuma se instalar de forma silenciosa nesses anos se houver sedentarismo e comidas calóricas ultraprocessadas.",
    ],
    nutrientsToMonitor: ["Vitamina B12", "Cálcio", "Ferro", "Potássio", "Zinco"],
  },
];

// Presets for faster searches (Alerta Mamãe / Consulta de Alimentos)
export const FAST_FOOD_QUERIES: Record<string, FoodAnalysis> = {
  mel: {
    rating: "NAO_RECOMENDADO",
    ageLimitation: "Contraindicado para menores de 1 ano (12 meses).",
    reason: "O mel de abelha bruto pode conter esporos da bactéria Clostridium botulinum. Devido ao fato de que o sistema digestivo e a microbiota do bebê menor de 1 ano ainda estão imaturos, esses esporos podem germinar no intestino e produzir a toxina botulínica, desencadeando o Botulismo Infantil.",
    risks: [
      "Botulismo infantil (paralisia muscular progressiva, constipação severa, fraqueza, letargia)",
      "Dificuldade respiratória gravíssima",
    ],
    benefits: ["Suporte imunológico (após 1 ano de idade)", "Alívio suave de tosses (após 1 ano de idade)"],
    alternatives: ["Não adoce alimentos de bebês menores de 1 ano.", "Frutas Naturally adocicadas amassadas (ex: banana madura) para receitas."],
    howToIntroduce: "Apenas introduza após o primeiro aniversário da criança, de preferência de forma moderada, priorizando mel pasteurizado e orgânico de boa procedência.",
    source: "Sociedade Brasileira de Pediatria (SBP) e Ministério da Saúde do Brasil.",
  },
  ninho: {
    rating: "NAO_RECOMENDADO",
    ageLimitation: "Não indicado para bebês menores de 1 ano.",
    reason: "O leite Ninho convencional é leite de vaca integral de base. Cientificamente, o leite de vaca estimula microssangramentos na parede intestinal do bebê menor de 1 ano, causando anemia ferropriva. Além disso, tem alta taxa de proteínas pesadas e sódio, causando sobrecarga renal e elevando o risco de alergias alimentar precoce.",
    risks: [
      "Anemia ferropriva silenciosa por perda crônica de sangue nas fezes",
      "Sobrecarga dos rins (rins imaturos para lidar com tanto mineral)",
      "Alergia à Proteína do Leite de Vaca (APLV)",
    ],
    benefits: ["Fonte rica de Cálcio e proteínas (apenas após 1 ano)"],
    alternatives: ["Leite Materno exclusivo", "Fórmula Infantil do segmento adequado (Fase 1 ou Fase 2) prescrita por pediatra ou nutricionista."],
    howToIntroduce: "Leite de vaca integral em pó ou líquido só deve ser utilizado como bebida a partir de 1 ano completo, se o aleitamento materno não for possível.",
    source: "Organização Mundial da Saúde (OMS) e SBP.",
  },
  "leite ninho": {
    rating: "NAO_RECOMENDADO",
    ageLimitation: "Não indicado para bebês menores de 1 ano.",
    reason: "O leite Ninho convencional é leite de vaca integral de base. Cientificamente, o leite de vaca estimula microssangramentos na parede intestinal do bebê menor de 1 ano, causando anemia ferropriva. Além disso, tem alta taxa de proteínas pesadas e sódio, causando sobrecarga renal e elevando o risco de alergias alimentar precoce.",
    risks: [
      "Anemia ferropriva silenciosa por perda crônica de sangue nas fezes",
      "Sobrecarga dos rins (rins imaturos para lidar com tanto mineral)",
      "Alergia à Proteína do Leite de Vaca (APLV)",
    ],
    benefits: ["Fonte rica de Cálcio e proteínas (apenas após 1 ano)"],
    alternatives: ["Leite Materno exclusivo", "Fórmula Infantil do segmento adequado (Fase 1 ou Fase 2) prescrita por pediatra ou nutricionista."],
    howToIntroduce: "Leite de vaca integral em pó ou líquido só deve ser utilizado como bebida a partir de 1 ano completo, se o aleitamento materno não for possível.",
    source: "Organização Mundial da Saúde (OMS) e SBP.",
  },
  ovo: {
    rating: "RECOMENDADO",
    ageLimitation: "Permitido a partir de 6 meses de idade completo.",
    reason: "Antigamente havia atraso por medo de alergias, mas pesquisas modernas comprovam que a introdução precoce do ovo (a partir de 6 meses) ajuda a criar tolerância imunológica, reduzindo o risco futuro de alergias. É rico em Proteínas, Ferro e Colina, essencial para o cérebro.",
    risks: [
      "Risco de infecção por Salmonella se dado cru ou mal cozido",
      "Risco de engasgo se o ovo for oferecido muito seco sem amassar",
    ],
    benefits: [
      "Rico em Colina, essencial para o desenvolvimento cerebral infantil",
      "Ferro heme de boa absorção e proteínas completas",
    ],
    alternatives: ["Tofu cozido", "Frango bem desfiado com caldinho para hidratação"],
    howToIntroduce: "O ovo deve estar completamente cozido (gema e clara firmes). Nunca dê cru ou gema mole. Amasse bem com garfo e incorpore um pouco de leite materno ou água se ficar muito pastoso/seco para evitar asfixia.",
    source: "Departamento de Nutrologia da Sociedade Brasileira de Pediatria (SBP).",
  },
  "leite de vaca": {
    rating: "NAO_RECOMENDADO",
    ageLimitation: "Contraindicado absolutamente para menores de 1 ano.",
    reason: "O leite de vaca in natura ou integral contém alta concentração de proteínas grandes (difíceis de digerir) e sódio, causando microlesões no intestino do bebê (causando anemia). Além disso, não possui as quantidades de ferro, zinco e ácidos graxos essenciais que o cérebro do bebê precisa.",
    risks: [
      "Anemia Ferropriva Crônica",
      "Sobrecarga renal aguda ou de longo prazo",
      "Constipação severa ou diarreias frequentes",
    ],
    benefits: ["Excelente fonte de Cálcio para crianças maiores de 2 anos"],
    alternatives: ["Aleitamento Materno", "Fórmula Infantil 1 ou 2 baseada no peso e idade"],
    howToIntroduce: "Nesta fase primordial da vida (até 12 meses), prefira leite materno ou fórmulas modificadas específicas.",
    source: "Ministério da Saúde - Guia 2021",
  },
};

// Calculates exact age, milestone category and nutritional details
export function calculateChildMetrics(birthDateStr: string): {
  ageMonths: number;
  ageYears: number;
  exactAgeStr: string;
  category: AgeMilestone["category"];
} {
  if (!birthDateStr) {
    return { ageMonths: 0, ageYears: 0, exactAgeStr: "Sem data", category: "0-6_months" };
  }
  const dob = new Date(birthDateStr);
  const now = new Date();
  
  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();
  let days = now.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    const dummyDate = new Date(now.getFullYear(), now.getMonth(), 0);
    days += dummyDate.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const totalMonths = Math.max(0, years * 12 + months);

  let exactAgeStr = "";
  if (years > 0) {
    exactAgeStr += `${years} ${years === 1 ? "ano" : "anos"}`;
    if (months > 0) exactAgeStr += ` e ${months} ${months === 1 ? "mês" : "meses"}`;
  } else {
    exactAgeStr += `${totalMonths} ${totalMonths === 1 ? "mês" : "meses"}`;
    if (days > 0) exactAgeStr += ` e ${days} ${days === 1 ? "dia" : "dias"}`;
  }

  let category: AgeMilestone["category"] = "0-6_months";
  if (totalMonths >= 6 && totalMonths < 12) {
    category = "6-12_months";
  } else if (totalMonths >= 12 && totalMonths < 24) {
    category = "1-2_years";
  } else if (totalMonths >= 24 && totalMonths < 60) {
    category = "2-5_years";
  } else if (totalMonths >= 60) {
    category = "5-10_years";
  }

  return {
    ageMonths: totalMonths,
    ageYears: years,
    exactAgeStr,
    category,
  };
}

// Recommended daily intake of vitamins & minerals by age milestone (WHO/SBP reference values)
export function getRecommendedVitamins(category: AgeMilestone["category"]): {
  vitaminA: number; // mcg
  vitaminC: number; // mg
  vitaminD: number; // mcg
  vitaminB12: number; // mcg
  iron: number; // mg
  zinc: number; // mg
  magnesium: number; // mg
  calcium: number; // mg
  potassium: number; // mg
} {
  switch (category) {
    case "0-6_months":
      return { vitaminA: 400, vitaminC: 40, vitaminD: 10, vitaminB12: 0.4, iron: 0.27, zinc: 2, magnesium: 30, calcium: 200, potassium: 400 };
    case "6-12_months":
      return { vitaminA: 500, vitaminC: 50, vitaminD: 10, vitaminB12: 0.5, iron: 11, zinc: 3, magnesium: 75, calcium: 260, potassium: 700 };
    case "1-2_years":
      return { vitaminA: 300, vitaminC: 15, vitaminD: 15, vitaminB12: 0.9, iron: 7, zinc: 3, magnesium: 80, calcium: 700, potassium: 1000 };
    case "2-5_years":
      return { vitaminA: 400, vitaminC: 25, vitaminD: 15, vitaminB12: 1.2, iron: 7, zinc: 5, magnesium: 130, calcium: 1000, potassium: 1200 };
    case "5-10_years":
      return { vitaminA: 500, vitaminC: 45, vitaminD: 15, vitaminB12: 1.8, iron: 8, zinc: 8, magnesium: 200, calcium: 1300, potassium: 1600 };
    default:
      return { vitaminA: 400, vitaminC: 25, vitaminD: 15, vitaminB12: 1.0, iron: 8, zinc: 5, magnesium: 100, calcium: 800, potassium: 1000 };
  }
}

// Map vitamin names to description & standard units
export const NUTRIENT_METADATA: Record<string, { desc: string; source: string }> = {
  "Vitamina A": { desc: "Essencial para visão, imunidade primária e regeneração celular.", source: "Cenoura, abóbora, mamão, batata-doce, gemas." },
  "Vitamina C": { desc: "Excelente para imunidade das vias respiratórias e absorção de ferro de origem vegetal.", source: "Laranja, acerola, morango, goiaba, brócolis." },
  "Vitamina D": { desc: "Sintetização cálcica e saúde óssea estrutural e dentes.", source: "Exposição solar segura, leite enriquecido, ovos." },
  "Vitamina B12": { desc: "Saúde neurológica central e formulação dos glóbulos vermelhos.", source: "Carnes, ovos, fórmulas fortificadas." },
  "Ferro": { desc: "Previne a anemia infantil e oxigena o cérebro e musculatura.", source: "Feijões, carnes magras, folhas verdes escuras." },
  "Zinco": { desc: "Enzima digestiva, imunidade celular e crescimento linear.", source: "Carnes, feijão, sementes, ovos." },
  "Magnésio": { desc: "Equilíbrio muscular, condução de estímulos e densidade dos dentes.", source: "Espinafre, aveia, banana, sementes." },
  "Cálcio": { desc: "Fundamental para mineralização óssea do estirão infantil.", source: "Gergelim, iogurte, vegetais folhosos escuros." },
  "Potássio": { desc: "Função nervosa-motora, hidratação celular e tônus muscular.", source: "Banana, batata-doce, abacate, água de coco." },
};

// WHO standard percentile database for Boys vs Girls (Months 0 to 120) for charts representation
// Simplified curves showcasing 15th, 50th (median), and 85th percentiles of Weight (kg) and Height (cm)
export interface WHOPercentiles {
  ageMonths: number;
  weightP15: number;
  weightP50: number; // Median
  weightP85: number;
  heightP15: number;
  heightP50: number; // Median
  heightP85: number;
}

export const WHO_BOY_GROWTH_CURVES: WHOPercentiles[] = [
  { ageMonths: 0, weightP15: 2.8, weightP50: 3.3, weightP85: 3.9, heightP15: 47.9, heightP50: 49.9, heightP85: 51.8 },
  { ageMonths: 2, weightP15: 4.8, weightP50: 5.6, weightP85: 6.3, heightP15: 56.4, heightP50: 58.4, heightP85: 60.4 },
  { ageMonths: 4, weightP15: 6.2, weightP50: 7.0, weightP85: 7.8, heightP15: 62.1, heightP50: 63.9, heightP85: 65.7 },
  { ageMonths: 6, weightP15: 7.1, weightP50: 7.9, weightP85: 8.8, heightP15: 65.5, heightP50: 67.6, heightP85: 69.8 },
  { ageMonths: 8, weightP15: 7.9, weightP50: 8.6, weightP85: 9.6, heightP15: 68.4, heightP50: 70.6, heightP85: 72.8 },
  { ageMonths: 10, weightP15: 8.4, weightP50: 9.2, weightP85: 10.2, heightP15: 71.0, heightP50: 73.3, heightP85: 75.6 },
  { ageMonths: 12, weightP15: 8.9, weightP50: 9.6, weightP85: 10.8, heightP15: 73.4, heightP50: 75.7, heightP85: 78.1 },
  { ageMonths: 18, weightP15: 10.1, weightP50: 10.9, weightP85: 12.2, heightP15: 79.6, heightP50: 82.3, heightP85: 85.0 },
  { ageMonths: 24, weightP15: 11.2, weightP50: 12.2, weightP85: 13.6, heightP15: 85.4, heightP50: 87.8, heightP85: 90.4 },
  { ageMonths: 36, weightP15: 13.1, weightP50: 14.3, weightP85: 15.9, heightP15: 93.3, heightP50: 96.1, heightP85: 98.9 },
  { ageMonths: 48, weightP15: 15.0, weightP50: 16.3, weightP85: 18.2, heightP15: 100.1, heightP50: 103.3, heightP85: 106.5 },
  { ageMonths: 60, weightP15: 16.8, weightP50: 18.3, weightP85: 20.6, heightP15: 106.2, heightP50: 110.0, heightP85: 113.8 },
  { ageMonths: 72, weightP15: 18.6, weightP50: 20.5, weightP85: 23.2, heightP15: 112.1, heightP50: 116.1, heightP85: 120.2 },
  { ageMonths: 84, weightP15: 20.8, weightP50: 22.9, weightP85: 26.2, heightP15: 117.8, heightP50: 121.7, heightP85: 126.1 },
  { ageMonths: 96, weightP15: 23.1, weightP50: 25.6, weightP85: 29.8, heightP15: 123.0, heightP50: 127.3, heightP85: 131.9 },
  { ageMonths: 108, weightP15: 25.8, weightP50: 28.7, weightP85: 33.9, heightP15: 128.0, heightP50: 132.6, heightP85: 137.6 },
  { ageMonths: 120, weightP15: 28.8, weightP50: 32.2, weightP85: 38.6, heightP15: 133.0, heightP50: 137.8, heightP85: 143.0 },
];

export const WHO_GIRL_GROWTH_CURVES: WHOPercentiles[] = [
  { ageMonths: 0, weightP15: 2.7, weightP50: 3.2, weightP85: 3.7, heightP15: 47.3, heightP50: 49.1, heightP85: 50.9 },
  { ageMonths: 2, weightP15: 4.4, weightP50: 5.1, weightP85: 5.8, heightP15: 55.0, heightP50: 57.1, heightP85: 59.1 },
  { ageMonths: 4, weightP15: 5.7, weightP50: 6.4, weightP85: 7.2, heightP15: 60.5, heightP50: 62.1, heightP85: 63.8 },
  { ageMonths: 6, weightP15: 6.5, weightP50: 7.3, weightP85: 8.2, heightP15: 63.7, heightP50: 65.7, heightP85: 67.7 },
  { ageMonths: 8, weightP15: 7.2, weightP50: 8.0, weightP85: 9.0, heightP15: 66.5, heightP50: 68.7, heightP85: 70.9 },
  { ageMonths: 10, weightP15: 7.8, weightP50: 8.5, weightP85: 9.6, heightP15: 69.0, heightP50: 71.5, heightP85: 73.9 },
  { ageMonths: 12, weightP15: 8.2, weightP50: 8.9, weightP85: 10.1, heightP15: 71.4, heightP50: 74.0, heightP85: 76.6 },
  { ageMonths: 18, weightP15: 9.4, weightP50: 10.2, weightP85: 11.5, heightP15: 77.8, heightP50: 80.7, heightP85: 83.6 },
  { ageMonths: 24, weightP15: 10.6, weightP50: 11.5, weightP85: 13.0, heightP15: 83.6, heightP50: 86.4, heightP85: 89.2 },
  { ageMonths: 36, weightP15: 12.6, weightP50: 13.9, weightP85: 15.6, heightP15: 91.9, heightP50: 95.1, heightP85: 98.3 },
  { ageMonths: 48, weightP15: 14.5, weightP50: 16.1, weightP85: 18.2, heightP15: 99.0, heightP50: 102.7, heightP85: 106.4 },
  { ageMonths: 60, weightP15: 16.4, weightP50: 18.2, weightP85: 20.8, heightP15: 105.3, heightP50: 109.4, heightP85: 113.5 },
  { ageMonths: 72, weightP15: 18.2, weightP50: 20.2, weightP85: 23.4, heightP15: 111.4, heightP50: 115.7, heightP85: 120.0 },
  { ageMonths: 84, weightP15: 20.2, weightP50: 22.4, weightP85: 26.2, heightP15: 117.2, heightP50: 121.8, heightP85: 126.4 },
  { ageMonths: 96, weightP15: 22.4, weightP50: 25.0, weightP85: 29.5, heightP15: 122.5, heightP50: 127.3, heightP85: 132.2 },
  { ageMonths: 108, weightP15: 25.0, weightP50: 28.1, weightP85: 33.4, heightP15: 127.8, heightP50: 132.9, heightP85: 138.1 },
  { ageMonths: 120, weightP15: 27.8, weightP50: 31.6, weightP85: 37.8, heightP15: 133.0, heightP50: 138.2, heightP85: 143.5 },
];

export const MOCK_PRESET_SCANS = [
  {
    id: "scan1",
    label: "Leite em pó Integral instantâneo",
    imgUrl: "🥛",
    ingredients: "Leite integral, vitaminas (A, C, D) e minerais (Ferro, Zinco).",
    analysis: {
      productName: "Leite de Vaca Integral em Pó",
      rating: "Consumo moderado",
      highlights: {
        sugar: "Baixo/Inexistente (apenas lactose)",
        sodium: "Moderado",
        additives: "Isento",
        fats: "Alto (gorduras saturadas naturais)"
      },
      evaluation: "O leite de vaca integral não é recomendado antes de 1 ano completo pelas diretrizes do Ministério da Saúde. Para crianças maiores de 1 e 2 anos, pode ser consumido de forma regulada pelo profissional de saúde.",
      risks: "Desenvolvimento de anemia se consumido prematuramente, irritações da mucosa intestinal e potencial alérgico elevado.",
      alternatives: ["Leite Materno", "Fórmula Infantil Recomendada", "Batidos de aveia caseiros após 1 ano"],
      source: "Sociedade Brasileira de Pediatria (SBP)"
    }
  },
  {
    id: "scan2",
    label: "Biscoito de Maizena Infantil",
    imgUrl: "🍪",
    ingredients: "Farinha de trigo enriquecida, açúcar, gordura vegetal, amido de milho, sal, fermentos, aromatizantes, conservantes.",
    analysis: {
      productName: "Biscoito Maizena Industrializado",
      rating: "Não recomendado",
      highlights: {
        sugar: "Alto (açúcar refinado de adição rápido)",
        sodium: "Alto",
        additives: "Alto (conservantes/aromas)",
        fats: "Alto (gordura vegetal hidrogenada)"
      },
      evaluation: "Praticamente açúcar e farinha branca de alta absorção. Não oferece nutrientes e introduz caloria vazia precocemente na infância, desregulando o paladar do bebê contra frutas e legumes nativos.",
      risks: "Obesidade infantil precoce, cáries estruturais dentárias e desregulação do apetite natural.",
      alternatives: ["Biscoito de aveia e banana caseiro sem açúcar de adição", "Fruta sólida (Pera ou Maçã macia)"],
      source: "Guia Alimentar para Crianças Brasileiras Menores de 2 Anos"
    }
  },
  {
    id: "scan3",
    label: "Achocolatado Cremoso de Caixinha",
    imgUrl: "🧃",
    ingredients: "Soro de leite, leite reconstituído, açúcar, cacau em pó, espessante, hidrocloridrico, emulsificante, aromatizantes artificiais.",
    analysis: {
      productName: "Achocolatado Industrializado em Calda",
      rating: "Não recomendado",
      highlights: {
        sugar: "Altíssimo (Excedente aos limites padrão da OMS)",
        sodium: "Moderado",
        additives: "Alto (estabilizantes e sabores artificiais)",
        fats: "Moderado"
      },
      evaluation: "Altíssima taxa de açúcares refinados por porção, contendo corantes e espessantes químicos pesados para o pâncreas imaturo do bebê/criança menor. Absolutamente inadequado para menores de 2 anos.",
      risks: "Sedentarismo, picos de insulina, hiperatividade temporária e dependência de paladar hiperpalatável.",
      alternatives: ["Cacau puro 100% batido com banana madura e leite vegetal pós 2 anos", "Suco natural de uva integral"],
      source: "Organização Mundial da Saúde (OMS)"
    }
  },
  {
    id: "scan4",
    label: "Papinha Pronta de Pera Orgânica em Pote",
    imgUrl: "🍯",
    ingredients: "Pure de pera orgânica fresca, suco concentrado de limão para conservação natural.",
    analysis: {
      productName: "Papinha Orgânica de Pera",
      rating: "Recomendado",
      highlights: {
        sugar: "Baixo (Apenas açúcar natural da fruta - frutose)",
        sodium: "Baixo/Inexistente",
        additives: "Isento",
        fats: "Baixo/Inexistente"
      },
      evaluation: "Produto de excelente pureza, apenas composto por pera orgânica sem caldas ou açúcares químicos de adição. Excelente recurso emergencial para lanches em passeios.",
      risks: "Nenhum risco relevante. Lembre-se apenas de estimular o bebê a treinar a textura da fruta macerada com o tempo.",
      alternatives: ["Pera amassada fresca orgânica (ainda mais rica em fibras naturais)"],
      source: "UNICEF / SBP"
    }
  }
];

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: "post1",
    author: "Juliana Silva (Mãe do Theo, 7 meses)",
    category: "Introdução Alimentar",
    title: "Theo rejeitou abóbora hoje, devo me preocupar?",
    content: "Oi mamães! Ontem começamos a introdução alimentar com abóbora amassadinha. Ele fez careta e cuspiu quase tudo. Hoje tentei de novo e ele fechou a boca. É normal? Devo trocar para outra fruta ou continuar insistindo? Help!",
    votes: 14,
    timestamp: "2026-06-16T10:00:00Z",
    isModerated: true,
    comments: [
      {
        id: "c1",
        author: "Mariana Costa",
        text: "Super normal! Minha filha levou umas 10 tentativas para aceitar brócolis. Não desista e vá de boa, sem forçar!",
        timestamp: "2026-06-16T11:15:00Z"
      }
    ],
    moderatorReply: {
      author: "Dra. Letícia Abreu",
      title: "Pediatria & Nutrologia Infantil SBP",
      text: "Olá Juliana! É perfeitamente normal. Chamamos isso de neofobia alimentar ou simplesmente adaptação a novas texturas. Cientificamente, um bebê pode precisar de 8 a 15 exposições a um mesmo alimento para aceitá-lo. Não pressione nem force, para não criar uma relação negativa. Tente novamente em outra refeição, e mude o corte ou a receita levemente (ex: abóbora assada em pedaço macio versus abóbora amassada). Parabéns pelo cuidado!",
      timestamp: "2026-06-16T14:30:00Z"
    }
  },
  {
    id: "post2",
    author: "Clara Mendes (Mãe do Léo, 1 ano e meio)",
    category: "Receitas Saudáveis",
    title: "Minha receita de biscoito de aveia e banana que o Léo AMA!",
    content: "Queridas, descobri uma receita maravilhosa e super rápida de biscoito de 2 ingredientes sem açúcar para os bebês que já têm dentinho ou gostam de morder: 2 bananas bem maduras amassadas + 1 xícara de aveia em flocos finos. Misture tudo, molde em disquinhos e asse no forno a 180°C por 15 minutos. Fica fofinho e doce de forma natural!",
    votes: 38,
    timestamp: "2026-06-15T09:00:00Z",
    isModerated: true,
    comments: [
      {
        id: "c2",
        author: "Fernanda Lima",
        text: "Gentee, fiz aqui em casa hoje pro lanche do Benjamin e ele devorou!! Adicionei canela em pó, ficou perfumado demais. Obrigada por compartilhar!",
        timestamp: "2026-06-15T12:00:00Z"
      }
    ],
    moderatorReply: {
      author: "Beatriz Nogueira",
      title: "Nutricionista Materno-Infantil CRN-4",
      text: "Excelente receita, Clara! Parabéns por priorizar os açúcares naturais da fruta (frutose) e evitar os açúcares industriais adicionados, o que respeita as recomendações do Ministério da Saúde de zero açúcar até 2 anos de idade. A aveia em flocos traz fibras complexas maravilhosas para a saúde do intestino e regula o índice glicêmico. Acrescentar uma pitada de canela é uma ótima dica de enriquecimento aromático sensorial!",
      timestamp: "2026-06-15T18:00:00Z"
    }
  }
];
