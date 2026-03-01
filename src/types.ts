
export type Language = 'en' | 'pt';

export type MessageType = 'email' | 'sms' | 'both';

export type Status = 'sent' | 'pending' | 'failed' | 'scheduled';

export interface SMTPConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  fromEmail: string;
}

export interface APIConfig {
  apiKey: string;
  webhookUrl?: string;
}

export type PlanType = 'free' | 'pro' | 'enterprise';

export interface Plan {
  id: PlanType;
  name: string;
  price: string;
  features: string[];
  limits: {
    emails: number;
    sms: number;
  };
}

export interface ContactGroup {
  id: string;
  name: string;
  contactIds: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'individual' | 'company';
  companyName?: string;
  language: Language;
  smtpConfig?: SMTPConfig;
  apiConfig?: APIConfig;
  plan: PlanType;
  credits: {
    emails: number;
    sms: number;
  };
}

export interface Template {
  id: string;
  name: string;
  subject?: string;
  content: string;
  type: MessageType;
  language: Language;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  type: MessageType;
  subject?: string;
  content: string;
  status: Status;
  timestamp: string;
  language: Language;
}

export interface Translation {
  dashboard: string;
  messages: string;
  templates: string;
  recipients: string;
  sendNew: string;
  email: string;
  sms: string;
  status: string;
  date: string;
  to: string;
  subject: string;
  content: string;
  send: string;
  individual: string;
  company: string;
  all: string;
  settings: string;
  profile: string;
  smtp: string;
  api: string;
  bulkUpload: string;
  companyName: string;
  save: string;
  apiKey: string;
  host: string;
  port: string;
  username: string;
  password: string;
  fromEmail: string;
  heroTitle: string;
  heroSub: string;
  getStarted: string;
  login: string;
  register: string;
  features: string;
  emailSmsService: string;
  emailSmsDesc: string;
  bulkService: string;
  bulkDesc: string;
  apiSmtpService: string;
  apiSmtpDesc: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  testUsers: string;
  pricing: string;
  plans: string;
  groups: string;
  createGroup: string;
  importAndCreate: string;
  createClientsPrompt: string;
  selectGroup: string;
  templateSms: string;
  templateEmail: string;
  templateBoth: string;
  both: string;
  allContacts: string;
  createGroupExcel: string;
  createGroupSelect: string;
  groupName: string;
  selectContacts: string;
  addContact: string;
  downloadTemplate: string;
  phonePlaceholder: string;
  emailPlaceholder: string;
}

export const translations: Record<Language, Translation> = {
  en: {
    dashboard: 'Dashboard',
    messages: 'Messages',
    templates: 'Templates',
    recipients: 'Contacts',
    sendNew: 'Send New',
    email: 'Email',
    sms: 'SMS',
    status: 'Status',
    date: 'Date',
    to: 'To',
    subject: 'Subject',
    content: 'Content',
    send: 'Send',
    individual: 'Individual',
    company: 'Company',
    all: 'All',
    settings: 'Settings',
    profile: 'Profile',
    smtp: 'SMTP Config',
    api: 'API Access',
    bulkUpload: 'Bulk Upload',
    companyName: 'Company Name',
    save: 'Save Changes',
    apiKey: 'API Key',
    host: 'SMTP Host',
    port: 'Port',
    username: 'Username',
    password: 'Password',
    fromEmail: 'From Email',
    heroTitle: 'Communicate with Precision',
    heroSub: 'The all-in-one platform for SMS and Email delivery. Scale your business with bulk sending, custom SMTP, and powerful APIs.',
    getStarted: 'Get Started',
    login: 'Login',
    register: 'Register',
    features: 'Features',
    emailSmsService: 'Email & SMS',
    emailSmsDesc: 'Send individual or bulk messages with ease across multiple channels.',
    bulkService: 'Bulk Upload',
    bulkDesc: 'Import your contacts from Excel or CSV and reach thousands in seconds.',
    apiSmtpService: 'API & SMTP',
    apiSmtpDesc: 'Integrate directly with your systems using our robust API and custom SMTP.',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    testUsers: 'Test Users',
    pricing: 'Pricing',
    plans: 'Plans',
    groups: 'Groups',
    createGroup: 'Create Group',
    importAndCreate: 'Import & Create Contacts',
    createClientsPrompt: 'Would you like to save these as new contacts?',
    selectGroup: 'Select Group',
    templateSms: 'Template: name, number',
    templateEmail: 'Template: name, email',
    templateBoth: 'Template: name, number, email',
    both: 'Both (Email + SMS)',
    allContacts: 'All Contacts',
    createGroupExcel: 'Create via Excel',
    createGroupSelect: 'Select from Contacts',
    groupName: 'Group Name',
    selectContacts: 'Select Contacts',
    addContact: 'Add Contact',
    downloadTemplate: 'Download Template',
    phonePlaceholder: '+1234567890',
    emailPlaceholder: 'customer@example.com',
  },
  pt: {
    dashboard: 'Painel',
    messages: 'Mensagens',
    templates: 'Modelos',
    recipients: 'Contatos',
    sendNew: 'Enviar Novo',
    email: 'E-mail',
    sms: 'SMS',
    status: 'Status',
    date: 'Data',
    to: 'Para',
    subject: 'Assunto',
    content: 'Conteúdo',
    send: 'Enviar',
    individual: 'Individual',
    company: 'Empresa',
    all: 'Todos',
    settings: 'Configurações',
    profile: 'Perfil',
    smtp: 'Configuração SMTP',
    api: 'Acesso API',
    bulkUpload: 'Envio em Massa',
    companyName: 'Nome da Empresa',
    save: 'Salvar Alterações',
    apiKey: 'Chave da API',
    host: 'Servidor SMTP',
    port: 'Porta',
    username: 'Usuário',
    password: 'Senha',
    fromEmail: 'E-mail de Origem',
    heroTitle: 'Comunique-se com Precisão',
    heroSub: 'A plataforma completa para envio de SMS e E-mail. Escale seu negócio com envios em massa, SMTP personalizado e APIs poderosas.',
    getStarted: 'Começar Agora',
    login: 'Entrar',
    register: 'Cadastrar',
    features: 'Recursos',
    emailSmsService: 'E-mail e SMS',
    emailSmsDesc: 'Envie mensagens individuais ou em massa com facilidade em vários canais.',
    bulkService: 'Envio em Massa',
    bulkDesc: 'Importe seus contatos de Excel ou CSV e alcance milhares em segundos.',
    apiSmtpService: 'API e SMTP',
    apiSmtpDesc: 'Integre diretamente com seus sistemas usando nossa API robusta e SMTP personalizado.',
    dontHaveAccount: 'Não tem uma conta?',
    alreadyHaveAccount: 'Já tem uma conta?',
    testUsers: 'Usuários de Teste',
    pricing: 'Preços',
    plans: 'Planos',
    groups: 'Grupos',
    createGroup: 'Criar Grupo',
    importAndCreate: 'Importar e Criar Contatos',
    createClientsPrompt: 'Deseja salvar estes dados como novos contatos?',
    selectGroup: 'Selecionar Grupo',
    templateSms: 'Modelo: nome, numero',
    templateEmail: 'Modelo: nome, email',
    templateBoth: 'Modelo: nome, numero, email',
    both: 'Ambos (E-mail + SMS)',
    allContacts: 'Todos os Contatos',
    createGroupExcel: 'Criar via Excel',
    createGroupSelect: 'Selecionar dos Contatos',
    groupName: 'Nome do Grupo',
    selectContacts: 'Selecionar Contatos',
    addContact: 'Adicionar Contato',
    downloadTemplate: 'Baixar Modelo',
    phonePlaceholder: '+5511999999999',
    emailPlaceholder: 'cliente@exemplo.com',
  },
};
