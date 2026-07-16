export const BRAND = {
  red: "#057143",
  redDark: "#045A36",
  yellow: "#FFB81C",
  yellowLight: "#FFD966",
  white: "#FFFFFF",
  gray50: "#F8F9FA",
  gray100: "#F1F3F5",
  gray200: "#E9ECEF",
  gray300: "#DEE2E6",
  gray400: "#ADB5BD",
  gray500: "#6C757D",
  gray600: "#495057",
  gray700: "#343A40",
  gray800: "#212529",
  gray900: "#1A1D20",
} as const;

export const ROUTES = {
  home: "/",
  registar: "/registar",
  interno: "/interno",
  login: "/login",
  dashboard: "/dashboard",
  dashboardInteresses: "/dashboard/interesses",
  myPumangol: "/my-pumangol",
} as const;

export const CONTACT_TYPES = [
  "Cliente",
  "Potencial Cliente",
  "Parceiro",
  "Fornecedor",
  "Investidor",
  "Outro",
] as const;

export const INTEREST_AREAS = [
  "Frota+",
  "Combustíveis",
  "Lubrificantes",
  "Rede de Postos",
  "Soluções Empresariais",
  "Parcerias Comerciais",
] as const;

export const HOW_KNOWN_OPTIONS = [
  "Já é cliente",
  "FILDA",
  "Redes sociais",
  "Indicação",
  "Outro",
] as const;

export const INTEREST_LEVELS = [
  "Muito Alto",
  "Alto",
  "Médio",
  "Baixo",
] as const;

export const PRODUCTS = [
  "Frota+",
  "Lubrificantes",
  "Combustíveis",
  "Parcerias",
  "Outro",
] as const;

export const PURCHASE_HORIZONS = [
  "Imediato",
  "30 dias",
  "60 dias",
  "90 dias",
  "Mais de 90 dias",
] as const;

export const BUSINESS_POTENTIAL = ["Alto", "Médio", "Baixo"] as const;

export const PIPELINE_STAGES = [
  "Captada",
  "Contactada",
  "Qualificada",
  "Proposta Enviada",
  "Negociação",
  "Convertida",
] as const;

export const PRODUCTS_HIGHLIGHT = [
  {
    title: "Frota+",
    description:
      "Gestão inteligente de frotas com controlo total de combustível, relatórios e economia operacional.",
    icon: "truck",
  },
  {
    title: "Cartão Combustível",
    description:
      "Solução flexível para empresas com cobertura nacional e controlo de despesas em tempo real.",
    icon: "card",
  },
  {
    title: "Lubrificantes",
    description:
      "Produtos de alta performance para veículos e equipamentos industriais em todo o território.",
    icon: "oil",
  },
  {
    title: "Soluções Empresariais",
    description:
      "Pacotes corporativos personalizados para optimizar operações e reduzir custos energéticos.",
    icon: "building",
  },
  {
    title: "Parcerias Comerciais",
    description:
      "Oportunidades de colaboração estratégica para expandir a rede e criar valor partilhado.",
    icon: "handshake",
  },
] as const;

export const BENEFITS = [
  {
    title: "Gestão de Frotas",
    description: "Controlo completo dos seus veículos e consumos.",
  },
  {
    title: "Controlo de Despesas",
    description: "Visibilidade total sobre custos operacionais.",
  },
  {
    title: "Cobertura Nacional",
    description: "Rede de postos em todo o território angolano.",
  },
  {
    title: "Apoio Especializado",
    description: "Equipa dedicada ao acompanhamento corporativo.",
  },
  {
    title: "Soluções Corporativas",
    description: "Produtos adaptados às necessidades do seu negócio.",
  },
] as const;
