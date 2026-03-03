
export type Language = 'en' | 'pt';

export type MessageType = 'email' | 'sms';

export type MessageStatus = 'delivered' | 'opened' | 'bounced' | 'spam' | 'pending' | 'sent';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface APIKey {
  id: string;
  name: string;
  key: string;
  lastUsed: string;
}

export interface Segment {
  id: string;
  name: string;
  contactCount: number;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  createdAt: string;
}

export interface Template {
  id: string;
  name: string;
  subject?: string;
  content: string;
  type: MessageType;
  lastModified: string;
  thumbnail?: string;
}

export interface LogEntry {
  id: string;
  recipient: string;
  recipientAvatar?: string;
  subject: string;
  status: MessageStatus;
  date: string;
  type: MessageType;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  companyName?: string;
  plan: 'free' | 'pro' | 'enterprise';
}

export interface Translation {
  [key: string]: string;
}

export const translations: Record<Language, any> = {
  en: {
    dashboard: 'Dashboard',
    messages: 'Campaigns',
    templates: 'Templates',
    contacts: 'Contacts',
    logs: 'Email Logs',
    settings: 'Settings',
    login: 'Login',
    register: 'Register',
    forgotPassword: 'Forgot Password',
    totalSent: 'Total Sent',
    delivered: 'Delivered',
    openRate: 'Open Rate',
    clickRate: 'Click Rate',
    bounces: 'Bounces',
    recentActivity: 'Recent Activity',
    createTemplate: 'Create Template',
    addContact: 'Add Contact',
    importCsv: 'Import CSV',
    profile: 'Profile',
    apiKeys: 'API Keys',
    webhooks: 'Webhooks',
    team: 'Team Members',
  },
  pt: {
    dashboard: 'Painel',
    messages: 'Campanhas',
    templates: 'Modelos',
    contacts: 'Contatos',
    logs: 'Logs de E-mail',
    settings: 'Configurações',
    login: 'Entrar',
    register: 'Cadastrar',
    forgotPassword: 'Esqueci a Senha',
    totalSent: 'Total Enviado',
    delivered: 'Entregue',
    openRate: 'Taxa de Abertura',
    clickRate: 'Taxa de Clique',
    bounces: 'Rejeições',
    recentActivity: 'Atividade Recente',
    createTemplate: 'Criar Modelo',
    addContact: 'Adicionar Contato',
    importCsv: 'Importar CSV',
    profile: 'Perfil',
    apiKeys: 'Chaves de API',
    webhooks: 'Webhooks',
    team: 'Membros da Equipe',
  }
};
