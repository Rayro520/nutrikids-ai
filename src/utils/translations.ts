/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = "pt" | "en" | "es";

export interface TranslationDictionary {
  appName: string;
  subTitle: string;
  sealText: string;
  trustTitle: string;
  trustDesc: string;
  trustSealHeader: string;
  trustSealDesc: string;
  vibeCheckHeader: string;
  vibeCheckDesc: string;
  allRightsReserved: string;
  backToMore: string;
  moreTools: string;
  moreToolsDesc: string;
  profileTabName: string;
  alertTabName: string;
  labelsTabName: string;
  menuTabName: string;
  moreTabName: string;
  updateNotificationTitle: string;
  crescimentoName: string;
  crescimentoDesc: string;
  vitaminometroName: string;
  vitaminometroDesc: string;
  comunidadeName: string;
  comunidadeDesc: string;
  seloCientificoName: string;
  seloCientificoDesc: string;
  introImpactTitle: string;
  introImpactPhrase: string;
  introRegisterCTA: string;
  
  // Profile
  profileHeader: string;
  profileFormTitle: string;
  profileFormDesc: string;
  profileSelectChild: string;
  profileAddNew: string;
  profileEdit: string;
  profileNameLabel: string;
  profileBirthLabel: string;
  profileGenderLabel: string;
  profileGenderM: string;
  profileGenderF: string;
  profilePrematureLabel: string;
  profilePrematureYes: string;
  profilePrematureNo: string;
  profileWeightLabel: string;
  profileHeightLabel: string;
  profileAllergiesLabel: string;
  profileAllergiesPlaceholder: string;
  profileRestrictionsLabel: string;
  profileRestrictionsPlaceholder: string;
  profileConditionsLabel: string;
  profileConditionsPlaceholder: string;
  profileSaveBtn: string;
  profileDeleteBtn: string;
  profileEmpty: string;
  profileCreatedNotify: string;
  profileRemovedNotify: string;
  profileInfoTitle: string;
  profileGenderText: string;
  profileMonthsText: string;
  profileDaysText: string;

  // Chat
  chatHeader: string;
  chatDefaultWelcome: string;
  chatProfileWelcome: string;
  chatAnalyzes: string;
  chatCommonQuestion: string;
  chatInputPlaceholder: string;
  chatSuggestion1: string;
  chatSuggestion1Label: string;
  chatSuggestion2: string;
  chatSuggestion2Label: string;
  chatSuggestion3: string;
  chatSuggestion3Label: string;
  chatConnectionFail: string;

  // Milestones
  milestoneHeader: string;
  milestoneDesc: string;
  milestoneAllowed: string;
  milestoneProhibited: string;
  milestoneFocus: string;
  milestoneNote: string;

  // Food Search
  searchHeader: string;
  searchSub: string;
  searchPlaceholder: string;
  searchBtn: string;
  searchFastTitle: string;
  searchAgeLimit: string;
  searchReason: string;
  searchRisks: string;
  searchBenefits: string;
  searchAlternatives: string;
  searchHowTo: string;
  searchSource: string;
  searchNoResults: string;
  searchNoResultsDesc: string;

  // Scanner
  scanHeader: string;
  scanSub: string;
  scanPlaceholder: string;
  scanImageBtn: string;
  scanTextBtn: string;
  scanSimulatedHeader: string;
  scanSimulatedDesc: string;
  scanVerdict: string;
  scanSugar: string;
  scanSodium: string;
  scanAdditives: string;
  scanFats: string;
  scanAnalyzing: string;

  // Menu Planner
  menuHeader: string;
  menuSub: string;
  menuAITitle: string;
  menuAIDesc: string;
  menuAIPlaceholder: string;
  menuAIGenBtn: string;
  menuAILoadingBtn: string;
  menuAILoadingMsg: string;
  menuAllergiesWarn: string;
  menuPortion: string;
  menuIngredients: string;
  menuPrep: string;
  menuBenefit: string;
  menuPediatricNote: string;
  vibeCheck: string;

  // Vitaminometer
  vitaminHeader: string;
  vitaminSub: string;
  vitaminPercentage: string;
  vitaminAlertTitle: string;
  vitaminTitle: string;
  vitaminFoodLabel: string;
  vitaminFoodPlaceholder: string;
  vitaminPortionLabel: string;
  vitaminPortionPlaceholder: string;
  vitaminSubmitBtn: string;
  vitaminClearAll: string;
  vitaminEmptyLogs: string;

  // Growth Curve
  growthHeader: string;
  growthSub: string;
  growthWeightTab: string;
  growthHeightTab: string;
  growthP85: string;
  growthP50: string;
  growthP15: string;
  growthChildRecord: string;
  growthHelpTitle: string;
  growthHelpText: string;
  growthControlTitle: string;
  growthRecordsCount: string;
  growthSubmitFieldsTitle: string;
  growthAgeLabel: string;
  growthSubmitBtn: string;
  growthNoProfileWarn: string;

  // Forum / Community
  forumHeader: string;
  forumSub: string;
  forumCreateTitle: string;
  forumCategoryLabel: string;
  forumTitleLabel: string;
  forumContentLabel: string;
  forumContentPlaceholder: string;
  forumSubmitBtn: string;
  forumOpinionTitle: string;
  forumModeratorWaiting: string;
  forumVoteBtn: string;
  forumCommentPlaceholder: string;
  forumAddCommentBtn: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  pt: {
    appName: "NutriKids AI",
    subTitle: "Nutrição inteligente para seu filho",
    sealText: "Pediatra Auxiliar",
    trustTitle: "Área de Confiança",
    trustDesc: "Assegurando as diretrizes nacionais e recomendadas internacionais",
    trustSealHeader: "👨‍⚕️ Parecer De Revisores Médicos:",
    trustSealDesc: "A alimentação na primeira infância (até os 10 anos) molda de forma irreversível a plasticidade cerebral, a modulação imunológica e o peso metabólico do adulto de amanhã. O NutriKids AI atua como um pediatra nutricional digital constante para desmistificar com total base na ciência as dúvidas. Sempre acompanhe seu filho em consultas periódicas presenciais.",
    vibeCheckHeader: "Diretriz Geral",
    vibeCheckDesc: "Toda recomendação de alimentos (permitidos, proibidos ou moderados), contagens diárias de micronutrientes, e gráficos percentuais neste aplicativo são extraídos estritamente das diretrizes de nutrologia em vigor das maiores autoridades médicas e infantis brasileiras e globais.",
    allRightsReserved: "Associação de Nutropediatria e Nutrologia Pediátrica Conveniada, Junho de 2026.",
    backToMore: "← Voltar para Mais",
    moreTools: "Mais Ferramentas",
    moreToolsDesc: "Acesse dados integrados e painéis do aplicativo de forma simples e intuitiva de pediatria digital.",
    profileTabName: "Início",
    alertTabName: "Alerta",
    labelsTabName: "Rótulos",
    menuTabName: "Pratinho",
    moreTabName: "Mais",
    updateNotificationTitle: "Atualizações & Notificações",
    crescimentoName: "Crescimento",
    crescimentoDesc: "Acompanhe peso e altura comparados OMS.",
    vitaminometroName: "Vitaminômetro",
    vitaminometroDesc: "Acompanhe as vitaminas e nutrientes do bebê.",
    comunidadeName: "Comunidade",
    comunidadeDesc: "Partilha de mães moderada por profissionais.",
    seloCientificoName: "Selo Científico",
    seloCientificoDesc: "Embasamento científico do aplicativo.",
    introImpactTitle: "Primeira Infância",
    introImpactPhrase: "Nossos filhos são as sementes do amanhã. Nutrir com amor e amparo científico é o maior investimento para um futuro brilhante, saudável e pleno.",
    introRegisterCTA: "Registrar Meu Filho",

    // Profile
    profileHeader: "Painel Infantil",
    profileFormTitle: "Cadastrar Perfil Infantil",
    profileFormDesc: "Insira os dados do bebê para obter um acompanhamento personalizado pelas diretrizes SBP/OMS.",
    profileSelectChild: "Selecionar Criança",
    profileAddNew: "Cadastrar Nova Criança",
    profileEdit: "Editar Perfil",
    profileNameLabel: "Nome do Bebê / Criança",
    profileBirthLabel: "Data de Nascimento",
    profileGenderLabel: "Gênero Biológico",
    profileGenderM: "Masculino",
    profileGenderF: "Feminino",
    profilePrematureLabel: "Nasceu Prematuro?",
    profilePrematureYes: "Sim",
    profilePrematureNo: "Não",
    profileWeightLabel: "Peso Atual (kg)",
    profileHeightLabel: "Altura Atual (cm)",
    profileAllergiesLabel: "Alergias Alimentares conhecidas",
    profileAllergiesPlaceholder: "Ex: Leite de vaca, ovo, glúten (deixe em branco se nenhuma)",
    profileRestrictionsLabel: "Restrições alimentares ou preferências",
    profileRestrictionsPlaceholder: "Ex: Vegano, vegetariano, sem açúcar artificial",
    profileConditionsLabel: "Condições Especiais / Observações médicas",
    profileConditionsPlaceholder: "Ex: Refluxo gastroesofágico, intolerância à lactose",
    profileSaveBtn: "Gravar Dados do Perfil",
    profileDeleteBtn: "Remover Perfil",
    profileEmpty: "Nenhum perfil cadastrado. Adicione o perfil do seu bebê para habilitar o acompanhamento!",
    profileCreatedNotify: "Perfil de {name} cadastrado com sucesso!",
    profileRemovedNotify: "Um perfil infantil foi removido da sua lista.",
    profileInfoTitle: "Médias de Desenvolvimento",
    profileGenderText: "Gênero: {gender}",
    profileMonthsText: "Idade: {months} meses",
    profileDaysText: "{days} dias",

    // Chat
    chatHeader: "Pediatra Nutricional IA",
    chatDefaultWelcome: "Olá! Sou o assistente de inteligência nutricional do **NutriKids AI**, treinado nas diretrizes da OMS, SBP e UNICEF. \n\nCadastre ou selecione um perfil infantil acima para receber respostas 100% personalizadas! Mas de qualquer forma, sinta-se à vontade para me fazer perguntas de nutrição infantil geral.",
    chatProfileWelcome: "Olá! Sou o assistente de inteligência nutricional do **NutriKids AI**. \n\nVejo que você selecionou o perfil de **{name}**. Estou pronta para responder a qualquer dúvida sobre a alimentação dele(a), considerando sua idade, peso, restrições e alergias. \n\nComo posso ajudar você hoje?",
    chatAnalyzes: "NutriKids analisando...",
    chatCommonQuestion: "Perguntas comuns",
    chatInputPlaceholder: "Pergunte sobre nutrição...",
    chatSuggestion1: "Meu filho tem 8 meses, pode comer morango?",
    chatSuggestion1Label: "🍓 Morango na Introdução Alimentar?",
    chatSuggestion2: "Qual alimento tem mais ferro para combater anemia?",
    chatSuggestion2Label: "🥩 Qual alimento é rico em Ferro?",
    chatSuggestion3: "Como posso introduzir queijo e iogurte para meu pequeno?",
    chatSuggestion3Label: "🧀 Introdução de Laticínios?",
    chatConnectionFail: "Ups! A conexão falhou. Por favor, tente enviar novamente.",

    // Milestones
    milestoneHeader: "Guias por Faixa Etária",
    milestoneDesc: "Navegue pelos marcos de alimentação recomendados por pediatras oficiais ou selecione o perfil da criança para abrir automaticamente.",
    milestoneAllowed: "Alimentos Permitidos / Recomendados",
    milestoneProhibited: "Alimentos Proibidos / Evitados",
    milestoneFocus: "Foco Principal: {focus}",
    milestoneNote: "Metas recomendadas em vigência do desenvolvimento alimentar infantil.",

    // Food Search
    searchHeader: "Alerta Mamãe / Consulta de Alimentos",
    searchSub: "Pesquise qualquer ingrediente e saiba se o bebê pode ingerir baseado na sua idade atual e riscos associados.",
    searchPlaceholder: "Digite o alimento (ex: Mel, Ovo, Ninho...)",
    searchBtn: "Analisar Segurança",
    searchFastTitle: "Buscas Rápidas Comuns:",
    searchAgeLimit: "Faixa Permitida: {limit}",
    searchReason: "Explicação Científica:",
    searchRisks: "⚠️ Riscos Detectados para a Idade:",
    searchBenefits: "✓ Benefícios do Alimento:",
    searchAlternatives: "💡 Alternativas Saudáveis Recomendadas:",
    searchHowTo: "📖 Como Oferecer com Segurança:",
    searchSource: "Fonte de Referência Científica:",
    searchNoResults: "Nenhum resultado local rápido encontrado.",
    searchNoResultsDesc: "Estamos analisando o ingrediente com nossa Inteligência Artificial baseada em pediatria...",

    // Scanner
    scanHeader: "Scanner de Rótulos & Ingredientes",
    scanSub: "Analise a fotos de rótulos dos produtos do supermercado para desmascarar aditivos químicos e açúcares ocultos.",
    scanPlaceholder: "Cole os ingredientes ou texto do rótulo aqui para análise de suporte...",
    scanImageBtn: "Foto do Rótulo",
    scanTextBtn: "Analisar por Texto",
    scanSimulatedHeader: "Simulações de Rótulos Comuns:",
    scanSimulatedDesc: "Toque em um produto abaixo para simular o escaneamento:",
    scanVerdict: "Veredito Nutricional:",
    scanSugar: "Açúcares:",
    scanSodium: "Sódio:",
    scanAdditives: "Aditivos:",
    scanFats: "Gorduras:",
    scanAnalyzing: "Scanner de IA lendo componentes...",

    // Menu Planner
    menuHeader: "Cardápios SBP Inteligentes",
    menuSub: "Refeições saudáveis personalizadas para idade com inteligência artificial",
    menuAITitle: "NutriKids AI Customizer",
    menuAIDesc: "Alimente com o que tem em casa! Digite os ingredientes abaixo para receitas:",
    menuAIPlaceholder: "Ex: adicione batata-doce, sem polpa grossa...",
    menuAIGenBtn: "Gerar com IA",
    menuAILoadingBtn: "Calculando...",
    menuAILoadingMsg: "Alinhando ingredientes com as necessidades de {months} meses sob as diretrizes de engasgo e asfixia da SBP...",
    menuAllergiesWarn: "IA ciente de: Alergia ({allergies}) e Restrição ({restrictions})",
    menuPortion: "Porção: {portion}",
    menuIngredients: "Ingredientes:",
    menuPrep: "Modo de preparo / Dica:",
    menuBenefit: "Benefício Nutricional:",
    menuPediatricNote: "Observação Médico-Pediatra",
    vibeCheck: "Vibe Check",

    // Vitaminometer
    vitaminHeader: "Vitaminômetro Kids",
    vitaminSub: "Recomendação OMS/SBP: {category}",
    vitaminPercentage: "Cobertura de Micronutrientes",
    vitaminAlertTitle: "⚠️ Alertas Nutricionais",
    vitaminTitle: "Diário de Alimentação",
    vitaminFoodLabel: "Qual alimento deu hoje?",
    vitaminFoodPlaceholder: "Ex: Banana amassada, Gema de ovo...",
    vitaminPortionLabel: "Porção oferecida",
    vitaminPortionPlaceholder: "Ex: 1 banana, 1 gema...",
    vitaminSubmitBtn: "Lançar Alimento",
    vitaminClearAll: "Excluir Tudo",
    vitaminEmptyLogs: "Nenhum alimento lançado no diário hoje ainda.",

    // Growth Curve
    growthHeader: "Curva de Crescimento",
    growthSub: "Marcas oficiais de evolução (OMS / SBP)",
    growthWeightTab: "Peso (kg)",
    growthHeightTab: "Altura (cm)",
    growthP85: "P85 (Superior)",
    growthP50: "P50 (Mediana SBP)",
    growthP15: "P15 (Inferior)",
    growthChildRecord: "Child Record",
    growthHelpTitle: "Percentis WHO / SBP:",
    growthHelpText: "A linha do meio P50 (Laranja) é a mediana perfeita calculada cientificamente pela Organização Mundial da Saúde baseada em amostragem infantil saudável. Flutuar confortavelmente entre as réguas pontilhadas P15 e P85 (Amarelas) indica um crescimento natural, seguro e pleno. Sempre consulte seu pediatra de confiança.",
    growthControlTitle: "Controle de Medidas",
    growthRecordsCount: "Histórico ({count})",
    growthSubmitFieldsTitle: "Registrar Medidas",
    growthAgeLabel: "Idade correspondente (meses)",
    growthSubmitBtn: "Plotar na Curva",
    growthNoProfileWarn: "Selecione ou cadastre um perfil infantil acima para habilitar o registro de medições e plotagem da curva de percentis.",

    // Forum
    forumHeader: "Fórum da Comunidade",
    forumSub: "Troca de experiências seguras com supervisão e moderação médica SBP/OMS",
    forumCreateTitle: "Criar Nova Discussão",
    forumCategoryLabel: "Categoria do Tópico",
    forumTitleLabel: "Título da mensagem",
    forumContentLabel: "Sua dúvida / postagem",
    forumContentPlaceholder: "Digite aqui a mensagem que deseja enviar para discussões...",
    forumSubmitBtn: "Publicar Tópico",
    forumOpinionTitle: "PARECER SEGURO SBP/OMS",
    forumModeratorWaiting: "Aguardando parecer nutrológico da moderatriz Dra. Marina...",
    forumVoteBtn: "Votar ({votes})",
    forumCommentPlaceholder: "Responder dúvida de pais...",
    forumAddCommentBtn: "Comentar"
  },
  en: {
    appName: "NutriKids AI",
    subTitle: "Growing healthy with AI",
    sealText: "Pediatric Assistant",
    trustTitle: "Trust Center",
    trustDesc: "Ensuring adherence to national and international pediatric guidelines",
    trustSealHeader: "👨‍⚕️ Medical Reviewers Statement:",
    trustSealDesc: "Nutrition in early childhood (up to 10 years old) irreversibly shapes tomorrow's brain plasticity, immune modulation, and metabolic weight. NutriKids AI acts as a constant digital nutritional pediatrician to demystify questions based fully on science. Always accompany your child with regular face-to-face consultations.",
    vibeCheckHeader: "General Guidelines",
    vibeCheckDesc: "All food recommendations (allowed, prohibited, or moderate), daily micronutrient counts, and percentile charts in this application are extracted strictly from the active pediatric nutrition guidelines of the major national and global medical authorities.",
    allRightsReserved: "Affiliated Association of Pediatric Nutrology and Pediatrics, June 2026.",
    backToMore: "← Back to More",
    moreTools: "More Tools",
    moreToolsDesc: "Access integrated data and dashboard tools easily in our digital pediatric workspace.",
    profileTabName: "Home",
    alertTabName: "Alert",
    labelsTabName: "Labels",
    menuTabName: "Plate",
    moreTabName: "More",
    updateNotificationTitle: "Updates & Notifications",
    crescimentoName: "Growth",
    crescimentoDesc: "Track weight and height compared to WHO guidelines.",
    vitaminometroName: "Vitamins Meter",
    vitaminometroDesc: "Monitor your baby's vitamins and core nutrients daily.",
    comunidadeName: "Community",
    comunidadeDesc: "Parent forum moderated by pediatric healthcare professionals.",
    seloCientificoName: "Scientific Seal",
    seloCientificoDesc: "Scientific base and clinical evidence of the app.",
    introImpactTitle: "Early Childhood",
    introImpactPhrase: "Our children are the seeds of tomorrow. Nourishing them with love and scientific evidence is the greatest investment for a bright, healthy, and full future.",
    introRegisterCTA: "Register My Child",

    // Profile
    profileHeader: "Child Dashboard",
    profileFormTitle: "Register Child Profile",
    profileFormDesc: "Enter the baby's details to get personalized tracking according to WHO/SBP guidelines.",
    profileSelectChild: "Select Child",
    profileAddNew: "Register New Child",
    profileEdit: "Edit Profile",
    profileNameLabel: "Baby / Child Name",
    profileBirthLabel: "Date of Birth",
    profileGenderLabel: "Biological Gender",
    profileGenderM: "Male",
    profileGenderF: "Female",
    profilePrematureLabel: "Born Premature?",
    profilePrematureYes: "Yes",
    profilePrematureNo: "No",
    profileWeightLabel: "Current Weight (kg)",
    profileHeightLabel: "Current Height (cm)",
    profileAllergiesLabel: "Known Food Allergies",
    profileAllergiesPlaceholder: "E.g. Cow's milk, egg, gluten (leave blank if none)",
    profileRestrictionsLabel: "Dietary restrictions or preferences",
    profileRestrictionsPlaceholder: "E.g. Vegan, vegetarian, sugar-free, etc.",
    profileConditionsLabel: "Special Conditions / Medical notes",
    profileConditionsPlaceholder: "E.g. Acid reflux, lactose intolerance",
    profileSaveBtn: "Save Profile Data",
    profileDeleteBtn: "Delete Profile",
    profileEmpty: "No child profiles registered. Add your baby's details to activate custom tracking!",
    profileCreatedNotify: "Profile for {name} registered successfully!",
    profileRemovedNotify: "A child profile was removed from your list.",
    profileInfoTitle: "Development Averages",
    profileGenderText: "Gender: {gender}",
    profileMonthsText: "Age: {months} months",
    profileDaysText: "{days} days",

    // Chat
    chatHeader: "Pediatric Nutrition AI",
    chatDefaultWelcome: "Hello! I am the nutritional intelligence assistant for **NutriKids AI**, trained on WHO, SBP, and UNICEF guidelines. \n\nRegister or select a child profile above to receive 100% personalized answers! However, feel free to ask me general child nutrition questions.",
    chatProfileWelcome: "Hello! I am the nutritional intelligence assistant for **NutriKids AI**. \n\nI see you selected **{name}**'s profile. I am ready to answer any questions about their diet, considering age, weight, restrictions, and allergies. \n\nHow can I help you today?",
    chatAnalyzes: "NutriKids analyzing...",
    chatCommonQuestion: "Common Questions",
    chatInputPlaceholder: "Ask about child nutrition...",
    chatSuggestion1: "Meu filho tem 8 meses, pode comer morango?",
    chatSuggestion1Label: "🍓 Strawberries in Baby Diet?",
    chatSuggestion2: "Qual alimento tem mais ferro para combater anemia?",
    chatSuggestion2Label: "🥩 Which foods are rich in Iron?",
    chatSuggestion3: "Como posso introduzir queijo e iogurte para meu pequeno?",
    chatSuggestion3Label: "🧀 Review Dairy Introduction?",
    chatConnectionFail: "Oops! Visual connection failed. Please try sending again.",

    // Milestones
    milestoneHeader: "Age Milestone Guides",
    milestoneDesc: "Browse recommended food milestones designed by official pediatricians or select a child profile to select automatically.",
    milestoneAllowed: "Allowed / Recommended Foods",
    milestoneProhibited: "Avoided / Prohibited Foods",
    milestoneFocus: "Core Focus: {focus}",
    milestoneNote: "Recommended dietary targets in force for healthy child development.",

    // Food Search
    searchHeader: "Mom's Guide / Food Safety",
    searchSub: "Search any ingredient to check safety rules, age range permissions, and associated risks for child health.",
    searchPlaceholder: "Type an ingredient (e.g. Honey, Egg, Milk...)",
    searchBtn: "Analyze Safety",
    searchFastTitle: "Quick Search Shortcuts:",
    searchAgeLimit: "Allowed Age: {limit}",
    searchReason: "Scientific Reason:",
    searchRisks: "⚠️ Detected Risks for Age:",
    searchBenefits: "✓ Food Benefits:",
    searchAlternatives: "💡 Suggested Safe Alternatives:",
    searchHowTo: "📖 How to Serve Safely:",
    searchSource: "Scientific Reference Source:",
    searchNoResults: "No quick local results found.",
    searchNoResultsDesc: "Analyzing the ingredient using our pediatric expert intelligence models...",

    // Scanner
    scanHeader: "Rótulo Chemical Scanner",
    scanSub: "Analyze grocery product ingredient lists to unmask hidden corporate sugars and unsafe chemicals.",
    scanPlaceholder: "Paste product ingredients text here for advanced clinical analysis...",
    scanImageBtn: "Upload Label Photo",
    scanTextBtn: "Analyze Ingredients Text",
    scanSimulatedHeader: "Common Product Simulators:",
    scanSimulatedDesc: "Tap an item below to simulate a digital scan mockup:",
    scanVerdict: "Nutritional Verdict:",
    scanSugar: "Sugars:",
    scanSodium: "Sodium:",
    scanAdditives: "Chemical Additives:",
    scanFats: "Fats / Lipids:",
    scanAnalyzing: "AI Scanner analyzing compounds...",

    // Menu Planner
    menuHeader: "Intelligent Menus",
    menuSub: "Healthy, age-appropriate menus customized dynamically using intelligence models",
    menuAITitle: "NutriKids AI Customizer",
    menuAIDesc: "Feed your baby with what you have in the fridge! Enter ingredients to get recipes:",
    menuAIPlaceholder: "E.g. sweet potato, smooth texture, no small pieces...",
    menuAIGenBtn: "Generate with AI",
    menuAILoadingBtn: "Calculating...",
    menuAILoadingMsg: "Optimizing ingredients for a kid of {months} months following pediatric asphyxia and choking preventions...",
    menuAllergiesWarn: "AI alert: Allergy ({allergies}) & Restriction ({restrictions})",
    menuPortion: "Portion size: {portion}",
    menuIngredients: "Ingredients:",
    menuPrep: "Directions / Culinary Tip:",
    menuBenefit: "Nutritional Focus:",
    menuPediatricNote: "Pediatric Reviewer Note",
    vibeCheck: "Vibe Check",

    // Vitaminometer
    vitaminHeader: "NutriMeter Kids",
    vitaminSub: "WHO/SBP Standards: {category}",
    vitaminPercentage: "Nutrient Coverage Progress",
    vitaminAlertTitle: "⚠️ Nutritional Alerts",
    vitaminTitle: "Food Intake Log",
    vitaminFoodLabel: "What did the baby eat today?",
    vitaminFoodPlaceholder: "E.g. mashed banana, cooked egg yolk...",
    vitaminPortionLabel: "Portion size",
    vitaminPortionPlaceholder: "E.g. 1 banana, half egg yolk...",
    vitaminSubmitBtn: "Log Food Item",
    vitaminClearAll: "Clear All Logs",
    vitaminEmptyLogs: "No food registered in the diary today yet.",

    // Growth Curve
    growthHeader: "Growth Curve Tracker",
    growthSub: "Official World Health Organization reference curves",
    growthWeightTab: "Weight (kg)",
    growthHeightTab: "Height (cm)",
    growthP85: "P85 (Upper Bound)",
    growthP50: "P50 (Standard WHO)",
    growthP15: "P15 (Lower Bound)",
    growthChildRecord: "Plotted Record",
    growthHelpTitle: "WHO / SBP Percentiles Guidelines:",
    growthHelpText: "The middle P50 line (Orange) represents the perfect healthy average calculated globally by the WHO. Staying securely inside the P15 and P85 lines (Yellow dashed lines) represents standard natural development. Always consult your trusted child physician.",
    growthControlTitle: "Register Logs",
    growthRecordsCount: "History logs ({count})",
    growthSubmitFieldsTitle: "Add New Record",
    growthAgeLabel: "Current age (months)",
    growthSubmitBtn: "Add to Curve",
    growthNoProfileWarn: "Please select or create a child profile above to enable custom monthly weight and height percentiles.",

    // Forum
    forumHeader: "Community Forum",
    forumSub: "Discuss safely with other parents with active professional pediatric moderation",
    forumCreateTitle: "Start New Topic",
    forumCategoryLabel: "Topic Focus Group",
    forumTitleLabel: "Message Title",
    forumContentLabel: "Your Question / Message",
    forumContentPlaceholder: "Type here questions or recipes you want to share...",
    forumSubmitBtn: "Post Discussion",
    forumOpinionTitle: "SBP/WHO SCIENTIFIC VERDICT",
    forumModeratorWaiting: "Waiting for medical feedback from community lead nurse Dra. Marina...",
    forumVoteBtn: "Upvote ({votes})",
    forumCommentPlaceholder: "Shed light or answer parents...",
    forumAddCommentBtn: "Comment"
  },
  es: {
    appName: "NutriKids AI",
    subTitle: "Creciendo saludable con IA",
    sealText: "Pediatra de Apoyo",
    trustTitle: "Centro de Confianza",
    trustDesc: "Asegurando el cumplimiento de las recomendaciones pediátricas oficiales",
    trustSealHeader: "👨‍⚕️ Declaración de los Revisores Médicos:",
    trustSealDesc: "La nutrición en la primera infancia (hasta los 10 años) determina la plasticidad cerebral, la modulación inmunológica y el peso metabólico del adulto de mañana. NutriKids AI actúa como un pediatra nutricional digital constante para aclarar dudas basadas científicamente. Siempre mantenga consultas físicas periódicas.",
    vibeCheckHeader: "Pautas Generales",
    vibeCheckDesc: "Todas las sugerencias alimenticias (permitidas, prohibidas o moderadas), recuentos de microelementos y tablas en esta aplicación provienen de las más altas guías de salud mundiales y locales.",
    allRightsReserved: "Asociación Afiliada de Nutrología Infantil y Pediatría, Junio de 2026.",
    backToMore: "← Volver a Más",
    moreTools: "Más Herramientas",
    moreToolsDesc: "Acceda a módulos nutricionales y herramientas integradas de forma intuitiva.",
    profileTabName: "Inicio",
    alertTabName: "Alerta",
    labelsTabName: "Etiquetas",
    menuTabName: "Menú",
    moreTabName: "Más",
    updateNotificationTitle: "Novedades & Alertas",
    crescimentoName: "Crecimiento",
    crescimentoDesc: "Tabla comparativa de porcentaje según OMS.",
    vitaminometroName: "Nutriómetro",
    vitaminometroDesc: "Vigila los micronutrientes diarios de tus pequeños.",
    comunidadeName: "Comunidad",
    comunidadeDesc: "Preguntas de madres con moderación científica especializada.",
    seloCientificoName: "Sello Científico",
    seloCientificoDesc: "Soporte clínico y referencias autorizadas.",
    introImpactTitle: "Primera Infancia",
    introImpactPhrase: "Nuestros hijos son las semillas del mañana. Nutrir con amor y base científica es la inversión más grande para un futuro brillante, saludable y pleno.",
    introRegisterCTA: "Registrar a mi Hijo",

    // Profile
    profileHeader: "Panel Infantil",
    profileFormTitle: "Registrar Perfil del Bebé",
    profileFormDesc: "Ingrese los datos para configurar recomendaciones en base a las pautas de OMS/SBP.",
    profileSelectChild: "Seleccionar Niño",
    profileAddNew: "Registrar Nuevo Bebé",
    profileEdit: "Editar Perfil",
    profileNameLabel: "Nombre del Bebé",
    profileBirthLabel: "Fecha de Nacimiento",
    profileGenderLabel: "Género Biológico",
    profileGenderM: "Masculino",
    profileGenderF: "Femenino",
    profilePrematureLabel: "¿Nació Prematuro?",
    profilePrematureYes: "Sí",
    profilePrematureNo: "No",
    profileWeightLabel: "Peso Actual (kg)",
    profileHeightLabel: "Altura Actual (cm)",
    profileAllergiesLabel: "Alergias Alimentarias diagnosticadas",
    profileAllergiesPlaceholder: "Ej: Alergia a la leche, huevo, soya (dejar en blanco si no tiene)",
    profileRestrictionsLabel: "Restricciones de nutrición o gustos",
    profileRestrictionsPlaceholder: "Ej: Vegano, vegetariano, etc.",
    profileConditionsLabel: "Condiciones Especiales / Notas Clínicas",
    profileConditionsPlaceholder: "Ej: Reflujo gástrico, intolerancia a la lactosa",
    profileSaveBtn: "Guardar Datos del Perfil",
    profileDeleteBtn: "Eliminar Perfil",
    profileEmpty: "¡No hay perfiles activos! Registre los datos de su pequeño para iniciar los cálculos nutricionales y el seguimiento.",
    profileCreatedNotify: "¡Perfil de {name} guardado correctamente!",
    profileRemovedNotify: "Se eliminó de la lista un perfil del bebé.",
    profileInfoTitle: "Crecimiento Estándar",
    profileGenderText: "Género: {gender}",
    profileMonthsText: "Edad: {months} meses",
    profileDaysText: "{days} días",

    // Chat
    chatHeader: "Pediatra Nutricional IA",
    chatDefaultWelcome: "¡Hola! Soy el tutor de inteligencia nutricional **NutriKids AI**, instruido en los parámetros de la OMS, SBP y UNICEF. \n\n¡Registre o elija un perfil infantil arriba para habilitar respuestas personalizadas! Si lo prefiere, pregúnteme dudas sobre lactancia o papillas en general.",
    chatProfileWelcome: "¡Hola! Soy el tutor de inteligencia nutricional **NutriKids AI**. \n\nVeo que seleccionó el perfil de **{name}**. Estoy lista para guiarle sobre su menú diario, tomando en cuenta peso, meses, alergias metabólicas y restricciones. \n\n¿En qué le puedo asistir hoy?",
    chatAnalyzes: "NutriKids analizando...",
    chatCommonQuestion: "Preguntas Frecuentes",
    chatInputPlaceholder: "Escriba una duda nutricional...",
    chatSuggestion1: "Meu filho tem 8 meses, pode comer morango?",
    chatSuggestion1Label: "🍓 ¿Fresas en la Introducción Alimenticia?",
    chatSuggestion2: "Qual alimento tem mais ferro para combater anemia?",
    chatSuggestion2Label: "🥩 Alimentos ricos en Hierro para niños",
    chatSuggestion3: "Como posso introduzir queijo e iogurte para meu pequeno?",
    chatSuggestion3Label: "🧀 ¿Cómo introducir los lácteos?",
    chatConnectionFail: "Oops! Problemas de red. Intente enviar de nuevo, por favor.",

    // Milestones
    milestoneHeader: "Guía de Desarrollo Alimenticio",
    milestoneDesc: "Explore las metas estándar diseñadas por asociaciones oficiales o registre el perfil de su pequeño para configurarlas al instante.",
    milestoneAllowed: "Alimentos Permitidos / Seguros",
    milestoneProhibited: "Alimentos Prohibidos / Contraindicados",
    milestoneFocus: "Foco Principal: {focus}",
    milestoneNote: "Metas de pediatría recomendadas actualmente para el desarrollo de la masticación.",

    // Food Search
    searchHeader: "Alerta Mamá / Guía de Comidas",
    searchSub: "Consulte cualquier elemento para determinar si su pequeño puede consumirlo basándose en sus meses y riesgos digestivos.",
    searchPlaceholder: "Escriba un ingrediente (ej: Miel, Huevo, Leche...)",
    searchBtn: "Verificar Seguridad",
    searchFastTitle: "Consultas Rápidas Habituales:",
    searchAgeLimit: "Habilitado desde: {limit}",
    searchReason: "Sustento Científico:",
    searchRisks: "⚠️ Riesgos Registrados para la Edad:",
    searchBenefits: "✓ Beneficios Nutricionales:",
    searchAlternatives: "💡 Alternativas Saludables Sugeridas:",
    searchHowTo: "📖 Cómo Servir con Seguridad:",
    searchSource: "Pautas Médicas de Origen:",
    searchNoResults: "Fórmula local no encontrada.",
    searchNoResultsDesc: "Estamos analizando el alimento con nuestra Inteligência Artificial basada en pediatria...",

    // Scanner
    scanHeader: "Escáner de Componentes",
    scanSub: "Analice ingredientes en fotos de etiquetas para advertir sobre exceso de endulzantes artificiales y agregados dañinos.",
    scanPlaceholder: "Pegue el listado de ingredientes del producto para evaluar por el pediatra digital...",
    scanImageBtn: "Foto del Rótulo",
    scanTextBtn: "Evaluar Ingredientes",
    scanSimulatedHeader: "Simulaciones Disponibles:",
    scanSimulatedDesc: "Toca un alimento para probar el análisis interactivo de etiqueta:",
    scanVerdict: "Veredicto Nutricional:",
    scanSugar: "Azúcares:",
    scanSodium: "Sodio:",
    scanAdditives: "Químicos / Aditivos:",
    scanFats: "Grasas / Lípidos:",
    scanAnalyzing: "Analizando compuestos del rótulo...",

    // Menu Planner
    menuHeader: "Menús Médicos de IA",
    menuSub: "Generador inteligente de papillas y comidas ajustadas por edad con tecnología de IA",
    menuAITitle: "Diseñador de Platos NutriKids",
    menuAIDesc: "¡Prepare comida con lo que hay en casa! Ingrese los ingredientes para recetas optimizadas:",
    menuAIPlaceholder: "Ej: camote licuado, consistencia muy suave...",
    menuAIGenBtn: "Generar Menú",
    menuAILoadingBtn: "Calculando...",
    menuAILoadingMsg: "Ajustando porciones según la edad de {months} meses previniendo asfixias accidentales según reglamentos SBP...",
    menuAllergiesWarn: "IA Alerta: Alergia ({allergies}) & Restricción ({restrictions})",
    menuPortion: "Porción sugerida: {portion}",
    menuIngredients: "Ingredientes:",
    menuPrep: "Preparación / Consejos:",
    menuBenefit: "Soporte Nutricional:",
    menuPediatricNote: "Nota del Revisor Pediátrico",
    vibeCheck: "Vibe Check",

    // Vitaminometer
    vitaminHeader: "Nutriómetro Infantil",
    vitaminSub: "Guías OMS/SBP: {category}",
    vitaminPercentage: "Porcentaje de Cobertura Diaria",
    vitaminAlertTitle: "⚠️ Alertas Micronutricionales",
    vitaminTitle: "Diario de Dieta Infantil",
    vitaminFoodLabel: "¿Qué alimento consumió hoy?",
    vitaminFoodPlaceholder: "Ej: Puré de plátano, yema de huevo...",
    vitaminPortionLabel: "Tamaño de Porción",
    vitaminPortionPlaceholder: "Ej: 1 plátano entero, media yema...",
    vitaminSubmitBtn: "Loguear Comida",
    vitaminClearAll: "Limpiar Todo",
    vitaminEmptyLogs: "Ninguna comida ha sido agregada al diario hoy todavía.",

    // Growth Curve
    growthHeader: "Curva de Percentiles",
    growthSub: "Estadísticas oficiales médicas de la Organización Mundial de la Salud",
    growthWeightTab: "Peso (kg)",
    growthHeightTab: "Estatura (cm)",
    growthP85: "P85 (Superior)",
    growthP50: "P50 (Promedio OMS)",
    growthP15: "P15 (Inferior)",
    growthChildRecord: "Gráfico del Bebé",
    growthHelpTitle: "Uso de Percentiles OMS:",
    growthHelpText: "La curva central P50 (Laranja) representa la mediana perfecta indicada para bebés por la Organización Mundial de la Salud. Estar en la franja de P15 y P85 (Líneas divisorias amarillas) indica una evolución típica ejemplar. Consulte con su nutriólogo infantil.",
    growthControlTitle: "Registrar Gráficos",
    growthRecordsCount: "Historial ({count})",
    growthSubmitFieldsTitle: "Agregar Medición",
    growthAgeLabel: "Meses de la medición",
    growthSubmitBtn: "Graficar en Curva",
    growthNoProfileWarn: "Añada un perfil infantil en Inicio para habilitar el guardado de controles mensuales y la creación de percentiles.",

    // Forum
    forumHeader: "Foro de Padres",
    forumSub: "Comparta experiencias y recetas con supervisión y dictamen de pediatras certificados",
    forumCreateTitle: "Empezar Nueva Pregunta",
    forumCategoryLabel: "Sección del Tema",
    forumTitleLabel: "Título de la Consulta",
    forumContentLabel: "Detalle de su Consulta",
    forumContentPlaceholder: "Escriba aquí sus dudas de lactancia, cólicos y papillas...",
    forumSubmitBtn: "Publicar Tema",
    forumOpinionTitle: "DICTAMEN MÉDICO OMS/SBP",
    forumModeratorWaiting: "Esperando opinión clínica de la pediatra de guardia Dra. Marina...",
    forumVoteBtn: "Apoyar ({votes})",
    forumCommentPlaceholder: "Ayudar a otra mamá...",
    forumAddCommentBtn: "Comentar"
  }
};
