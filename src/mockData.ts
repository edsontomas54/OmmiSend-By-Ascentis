
import { User, Message, Template, Plan, ContactGroup } from './types';

export const mockPlans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    features: ['100 Emails/mo', '10 SMS/mo', 'Basic Templates'],
    limits: { emails: 100, sms: 10 }
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29',
    features: ['5000 Emails/mo', '500 SMS/mo', 'Bulk Upload', 'Custom SMTP', 'API Access'],
    limits: { emails: 5000, sms: 500 }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$99',
    features: ['Unlimited Emails', 'Unlimited SMS', 'Priority Support', 'Dedicated Account Manager'],
    limits: { emails: 999999, sms: 999999 }
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+1234567890',
    type: 'individual',
    language: 'en',
    plan: 'free',
    credits: { emails: 50, sms: 5 }
  },
  {
    id: '2',
    name: 'Tech Corp Admin',
    email: 'admin@techcorp.com',
    phone: '+1987654321',
    type: 'company',
    companyName: 'Tech Corp',
    language: 'en',
    plan: 'pro',
    credits: { emails: 4500, sms: 480 }
  },
  {
    id: '3',
    name: 'João Silva',
    email: 'joao@exemplo.pt',
    phone: '+351912345678',
    type: 'individual',
    language: 'pt',
    plan: 'free',
    credits: { emails: 10, sms: 2 }
  },
];

export const mockContactGroups: ContactGroup[] = [
  {
    id: 'g1',
    name: 'VIP Customers',
    contactIds: ['1', '3']
  },
  {
    id: 'g2',
    name: 'Marketing List',
    contactIds: ['1']
  }
];

export const mockTemplates: Template[] = [
  {
    id: 't1',
    name: 'Welcome Email',
    subject: 'Welcome to our platform!',
    content: 'Hello {{name}}, welcome to OmniSend!',
    type: 'email',
    language: 'en',
  },
  {
    id: 't2',
    name: 'Bem-vindo',
    subject: 'Bem-vindo à nossa plataforma!',
    content: 'Olá {{name}}, bem-vindo ao OmniSend!',
    type: 'email',
    language: 'pt',
  },
  {
    id: 't3',
    name: 'OTP SMS',
    content: 'Your verification code is: {{code}}',
    type: 'sms',
    language: 'en',
  },
];

export const mockMessages: Message[] = [
  {
    id: 'm1',
    senderId: 'system',
    recipientId: '1',
    type: 'email',
    subject: 'Welcome',
    content: 'Hello Alice, welcome to OmniSend!',
    status: 'sent',
    timestamp: '2024-02-21T10:00:00Z',
    language: 'en',
  },
  {
    id: 'm2',
    senderId: 'system',
    recipientId: '3',
    type: 'sms',
    content: 'Seu código é 1234',
    status: 'sent',
    timestamp: '2024-02-21T10:05:00Z',
    language: 'pt',
  },
  {
    id: 'm3',
    senderId: '2',
    recipientId: '1',
    type: 'email',
    subject: 'Invoice #123',
    content: 'Your invoice for February is ready.',
    status: 'pending',
    timestamp: '2024-02-21T11:00:00Z',
    language: 'en',
  },
];
