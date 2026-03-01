
import { User, Template, Contact, LogEntry, Segment, TeamMember, Webhook, APIKey } from './types';

export const mockUser: User = {
  id: 'u1',
  name: 'Alex Rivera',
  email: 'alex@omnisend.io',
  avatar: 'https://i.pravatar.cc/150?u=alex',
  companyName: 'OmniSend Inc.',
  plan: 'pro'
};

export const mockTemplates: Template[] = [
  {
    id: 't1',
    name: 'Welcome Series',
    subject: 'Welcome to the family!',
    content: '<h1>Hello {{name}}</h1><p>We are glad to have you here.</p>',
    type: 'email',
    lastModified: '2024-02-28T10:00:00Z',
    thumbnail: 'https://picsum.photos/seed/welcome/400/300'
  },
  {
    id: 't2',
    name: 'Monthly Newsletter',
    subject: 'Your monthly update',
    content: '<h1>Monthly Update</h1><p>Here is what happened this month.</p>',
    type: 'email',
    lastModified: '2024-02-25T15:30:00Z',
    thumbnail: 'https://picsum.photos/seed/news/400/300'
  },
  {
    id: 't3',
    name: 'OTP Verification',
    content: 'Your verification code is: {{code}}',
    type: 'sms',
    lastModified: '2024-02-20T09:15:00Z'
  }
];

export const mockContacts: Contact[] = [
  { id: 'c1', name: 'Alice Johnson', email: 'alice@example.com', phone: '+1234567890', status: 'active', createdAt: '2024-01-15' },
  { id: 'c2', name: 'Tech Corp Admin', email: 'admin@techcorp.com', phone: '+1987654321', status: 'active', createdAt: '2024-01-20' },
  { id: 'c3', name: 'João Silva', email: 'joao@exemplo.pt', phone: '+351912345678', status: 'bounced', createdAt: '2024-02-01' },
];

export const mockLogs: LogEntry[] = [
  { id: 'l1', recipient: 'alice@example.com', subject: 'Welcome Series', status: 'delivered', date: '2024-02-28T10:05:00Z', type: 'email' },
  { id: 'l2', recipient: 'admin@techcorp.com', subject: 'Monthly Newsletter', status: 'opened', date: '2024-02-28T11:20:00Z', type: 'email' },
  { id: 'l3', recipient: '+351912345678', subject: 'OTP Verification', status: 'delivered', date: '2024-02-28T12:00:00Z', type: 'sms' },
];

export const mockSegments: Segment[] = [
  { id: 's1', name: 'VIP Customers', contactCount: 2 },
  { id: 's2', name: 'Marketing List', contactCount: 1 },
];

export const mockTeam: TeamMember[] = [
  { id: 'tm1', name: 'Alex Rivera', email: 'alex@omnisend.io', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=alex' },
  { id: 'tm2', name: 'Sarah Chen', email: 'sarah@omnisend.io', role: 'editor', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  { id: 'tm3', name: 'Mike Ross', email: 'mike@omnisend.io', role: 'viewer', avatar: 'https://i.pravatar.cc/150?u=mike' },
];

export const mockWebhooks: Webhook[] = [
  { id: 'w1', url: 'https://api.myapp.com/webhooks/omnisend', events: ['email.delivered', 'email.opened'], status: 'active', createdAt: '2024-01-01' },
];

export const mockAPIKeys: APIKey[] = [
  { id: 'ak1', name: 'Production Key', key: 'os_live_••••••••••••••••', lastUsed: '2024-02-28' },
  { id: 'ak2', name: 'Testing Key', key: 'os_test_••••••••••••••••', lastUsed: '2024-02-25' },
];

export const mockChartData = Array.from({ length: 30 }, (_, i) => ({
  date: `2024-02-${String(i + 1).padStart(2, '0')}`,
  sent: Math.floor(Math.random() * 500) + 200,
  opened: Math.floor(Math.random() * 200) + 50,
}));
