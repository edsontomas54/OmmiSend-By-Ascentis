import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Send, 
  FileText, 
  Users, 
  Settings as SettingsIcon, 
  Mail, 
  MessageSquare, 
  Plus, 
  Search,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Globe,
  Building2,
  User as UserIcon,
  Upload,
  Key,
  Server,
  ShieldCheck,
  FileSpreadsheet,
  Trash2,
  Copy,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  BarChart3,
  Zap,
  MoreVertical,
  Filter,
  Download,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Edit,
  Eye,
  Code,
  Layers,
  LogOut,
  UserPlus,
  Lock,
  MailQuestion,
  Activity,
  Webhook as WebhookIcon,
  ShieldAlert,
  Image
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { 
  Language, 
  MessageType, 
  MessageStatus, 
  User, 
  Template, 
  LogEntry,
  Contact,
  Segment,
  TeamMember,
  Webhook,
  APIKey,
  translations
} from './types';
import { 
  mockUser, 
  mockTemplates, 
  mockContacts, 
  mockLogs, 
  mockSegments, 
  mockTeam, 
  mockWebhooks, 
  mockAPIKeys, 
  mockChartData 
} from './mockData';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'error' | 'info' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20',
    error: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20',
    info: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20',
  };
  
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", variants[variant])}>
      {children}
    </span>
  );
};

const Card = ({ children, className, noPadding = false }: { children: React.ReactNode, className?: string, noPadding?: boolean, key?: React.Key }) => (
  <div className={cn("bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl card-shadow overflow-hidden", className)}>
    <div className={cn(noPadding ? "" : "p-6")}>
      {children}
    </div>
  </div>
);

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  icon: Icon,
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger',
  size?: 'sm' | 'md' | 'lg',
  icon?: any
}) => {
  const variants = {
    primary: 'btn-primary-gradient',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700',
    outline: 'bg-transparent border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800',
    ghost: 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm shadow-rose-200 dark:shadow-none',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  return (
    <button 
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 18} />}
      {children}
    </button>
  );
};

const Input = ({ label, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string, error?: string }) => (
  <div className="space-y-1.5">
    {label && <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>}
    <input 
      className={cn(
        "w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10 focus:border-slate-900 dark:focus:border-white dark:text-white",
        error && "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500"
      )}
      {...props}
    />
    {error && <p className="text-[10px] font-medium text-rose-500">{error}</p>}
  </div>
);

const Modal = ({ isOpen, onClose, title, children, size = 'md' }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode, size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn("relative w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]", sizes[size])}
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <Plus className="rotate-45" size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const SidebarItem = ({ icon: Icon, label, active, collapsed, onClick }: { icon: any, label: string, active: boolean, collapsed: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group relative",
      active ? "sidebar-item-active" : "sidebar-item-inactive"
    )}
  >
    <Icon size={20} className={cn("shrink-0", active ? "text-slate-900 dark:text-white" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200")} />
    {!collapsed && <span className="text-sm font-medium truncate">{label}</span>}
    {collapsed && (
      <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
        {label}
      </div>
    )}
  </button>
);

// --- Views ---

const OverviewView = ({ t, onNewCampaign }: { t: any, onNewCampaign: () => void }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Overview</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Real-time performance of your campaigns.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={Download}>Export Report</Button>
          <Button variant="primary" icon={Plus} onClick={onNewCampaign}>New Campaign</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Sent', value: '1.2M', icon: Send, trend: '+12%', color: 'indigo' },
          { label: 'Delivered', value: '98.2%', icon: CheckCircle2, trend: '+0.4%', color: 'emerald' },
          { label: 'Open Rate', value: '24.5%', icon: Mail, trend: '-2%', color: 'amber' },
          { label: 'Click Rate', value: '3.8%', icon: Zap, trend: '+1.2%', color: 'indigo' },
          { label: 'Bounces', value: '0.5%', icon: ShieldAlert, trend: '-0.1%', color: 'rose' },
        ].map((stat, i) => (
          <Card key={i} className="relative group">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
              <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-lg", stat.trend.startsWith('+') ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400")}>
                {stat.trend}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Chart Section */}
      <Card noPadding>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white">Email Activity (30 Days)</h3>
          <div className="flex gap-2">
            <Badge variant="info">Sent</Badge>
            <Badge variant="success">Opened</Badge>
          </div>
        </div>
        <div className="h-[350px] w-full p-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockChartData}>
              <defs>
                <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8' }} 
                tickFormatter={(val) => val.split('-')[2]}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-card)' }}
              />
              <Area type="monotone" dataKey="sent" stroke="#0f172a" strokeWidth={2} fill="url(#colorSent)" />
              <Area type="monotone" dataKey="opened" stroke="#10b981" strokeWidth={2} fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card noPadding>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white">Recent Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recipient</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Campaign</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {mockLogs.slice(0, 5).map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{log.recipient}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{log.subject}</td>
                  <td className="px-6 py-4"><Badge variant={log.status === 'delivered' ? 'success' : log.status === 'opened' ? 'info' : 'error'}>{log.status}</Badge></td>
                  <td className="px-6 py-4 text-xs text-slate-400">{format(new Date(log.date), 'h:mm a')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const TemplatesView = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [editorTab, setEditorTab] = useState<'builder' | 'html'>('builder');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Templates</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Design beautiful emails with our builder.</p>
        </div>
        <Button variant="primary" icon={Plus}>Create Template</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTemplates.map(template => (
          <Card key={template.id} noPadding className="group cursor-pointer hover:border-slate-400 transition-all">
            <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
              {template.thumbnail ? (
                <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <FileText size={48} />
                </div>
              )}
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button variant="secondary" size="sm" icon={Eye} onClick={() => { setSelectedTemplate(template); setIsPreviewOpen(true); }}>Preview</Button>
                <Button variant="secondary" size="sm" icon={Edit}>Edit</Button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-slate-900 dark:text-white">{template.name}</h3>
                <Badge variant={template.type === 'email' ? 'info' : 'success'}>{template.type}</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Last modified {format(new Date(template.lastModified), 'MMM d, yyyy')}</p>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title={selectedTemplate?.name || 'Preview'} size="xl">
        <div className="flex flex-col h-[70vh]">
          <div className="flex gap-4 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
            <button 
              onClick={() => setEditorTab('builder')}
              className={cn("text-sm font-bold pb-2 border-b-2 transition-all", editorTab === 'builder' ? "border-slate-900 text-slate-900 dark:border-white dark:text-white" : "border-transparent text-slate-400")}
            >
              Visual Builder
            </button>
            <button 
              onClick={() => setEditorTab('html')}
              className={cn("text-sm font-bold pb-2 border-b-2 transition-all", editorTab === 'html' ? "border-slate-900 text-slate-900 dark:border-white dark:text-white" : "border-transparent text-slate-400")}
            >
              HTML Editor
            </button>
          </div>
          
          <div className="flex-1 bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            {editorTab === 'builder' ? (
              <div className="flex h-full">
                <div className="w-64 border-r border-slate-200 dark:border-slate-800 p-4 space-y-4 overflow-y-auto hidden md:block">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Components</p>
                  {[
                    { icon: Mail, label: 'Text Block' },
                    { icon: Image, label: 'Image' },
                    { icon: Zap, label: 'Button' },
                    { icon: Layers, label: 'Divider' },
                    { icon: Users, label: 'Social' },
                  ].map((comp, i) => (
                    <div key={i} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-3 cursor-move hover:border-slate-400 transition-colors">
                      <comp.icon size={16} className="text-slate-400" />
                      <span className="text-xs font-medium">{comp.label}</span>
                    </div>
                  ))}
                </div>
                <div className="flex-1 p-8 overflow-y-auto flex justify-center">
                  <div className="w-full max-w-2xl bg-white shadow-xl min-h-full p-12 text-slate-900">
                    <div dangerouslySetInnerHTML={{ __html: selectedTemplate?.content || '' }} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full font-mono text-sm p-4 overflow-y-auto bg-slate-900 text-emerald-400">
                <pre>{selectedTemplate?.content}</pre>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

const MessagesView = ({ onNewMessage }: { onNewMessage: () => void }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Messages</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Detailed history of all sent notifications.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search recipient..." 
              className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
          <Button variant="outline" icon={Filter}>Filters</Button>
          <Button variant="primary" icon={Plus} onClick={onNewMessage}>Send New</Button>
        </div>
      </div>

      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recipient</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {mockLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{log.recipient}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{log.subject}</td>
                  <td className="px-6 py-4">
                    <Badge variant={
                      log.status === 'delivered' ? 'success' : 
                      log.status === 'opened' ? 'info' : 
                      log.status === 'bounced' ? 'warning' : 'error'
                    }>
                      {log.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      {log.type === 'email' ? <Mail size={14} /> : <MessageSquare size={14} />}
                      <span className="text-xs capitalize">{log.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">{format(new Date(log.date), 'MMM d, h:mm a')}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const ContactsView = ({ onAddSegment, onNewMessage }: { onAddSegment: () => void, onNewMessage: () => void }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Contacts</h1>
          <Badge variant="info">My Awesome Company</Badge>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900/10 w-64"
            />
          </div>
          <Button variant="primary" icon={Plus} onClick={onNewMessage}>Send New</Button>
        </div>
      </div>

      {/* Groups Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Groups</h2>
          <button 
            onClick={onAddSegment}
            className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <Plus size={16} /> Create Group
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSegments.map(segment => (
            <Card key={segment.id} className="group hover:border-indigo-400 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Users size={24} />
                </div>
                <span className="text-xs font-bold text-slate-400">{segment.contactCount} Contacts</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">{segment.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6">Send messages to everyone in this group.</p>
              <Button variant="outline" className="w-full py-2 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20 hover:bg-indigo-50 dark:hover:bg-indigo-500/10">
                View Group
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Contacts Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Contacts</h2>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <Plus size={16} /> Add Contact
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockContacts.map(contact => (
            <Card key={contact.id} className="relative group hover:border-indigo-400 transition-all">
              <div className="absolute top-4 right-4">
                <Badge variant="info">{contact.id === 'c2' ? 'COMPANY' : 'INDIVIDUAL'}</Badge>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  {contact.id === 'c2' ? <Building2 size={24} /> : <UserIcon size={24} />}
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-white">{contact.name}</h3>
                  {contact.id === 'c2' && <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Tech Corp</p>}
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Mail size={12} />
                    <span>{contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <MessageSquare size={12} />
                    <span>{contact.phone}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Contact">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
          <Input label="Full Name" placeholder="Jane Doe" required />
          <Input label="Email Address" type="email" placeholder="jane@example.com" required />
          <Input label="Phone Number" placeholder="+1 (555) 000-0000" />
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Contact</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const SettingsView = () => {
  const [activeSection, setActiveSection] = useState<'profile' | 'api' | 'webhooks' | 'team'>('profile');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your account and team preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-1">
          {[
            { id: 'profile', label: 'Profile', icon: UserIcon },
            { id: 'api', label: 'API Keys', icon: Key },
            { id: 'webhooks', label: 'Webhooks', icon: WebhookIcon },
            { id: 'team', label: 'Team Members', icon: Users },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                activeSection === item.id ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-soft" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-6">
          {activeSection === 'profile' && (
            <Card>
              <h3 className="font-bold text-slate-900 dark:text-white mb-6">Profile Settings</h3>
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 relative group overflow-hidden">
                  <img src={mockUser.avatar} alt={mockUser.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Upload className="text-white" size={20} />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{mockUser.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{mockUser.email}</p>
                  <Button variant="outline" size="sm" className="mt-2">Change Avatar</Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Full Name" defaultValue={mockUser.name} />
                <Input label="Email Address" defaultValue={mockUser.email} />
                <Input label="Company Name" defaultValue={mockUser.companyName} />
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Language</label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900/10 dark:text-white">
                    <option>English</option>
                    <option>Portuguese</option>
                  </select>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button variant="primary">Save Changes</Button>
              </div>
            </Card>
          )}

          {activeSection === 'api' && (
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white">API Keys</h3>
                <Button variant="primary" size="sm" icon={Plus}>Generate New Key</Button>
              </div>
              <div className="space-y-4">
                {mockAPIKeys.map(key => (
                  <div key={key.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{key.name}</p>
                      <code className="text-sm font-mono text-slate-700 dark:text-slate-300">{key.key}</code>
                      <p className="text-[10px] text-slate-400 mt-1">Last used on {key.lastUsed}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><Copy size={18} /></button>
                      <button className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeSection === 'webhooks' && (
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white">Webhooks</h3>
                <Button variant="primary" size="sm" icon={Plus}>Add Webhook</Button>
              </div>
              <div className="space-y-4">
                {mockWebhooks.map(webhook => (
                  <div key={webhook.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-sm font-mono text-slate-700 dark:text-slate-300">{webhook.url}</code>
                      <Badge variant={webhook.status === 'active' ? 'success' : 'default'}>{webhook.status}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {webhook.events.map((event, i) => (
                        <span key={i} className="text-[10px] bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500">{event}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeSection === 'team' && (
            <Card noPadding>
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white">Team Members</h3>
                <Button variant="primary" size="sm" icon={UserPlus}>Invite Member</Button>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {mockTeam.map(member => (
                  <div key={member.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{member.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={member.role === 'admin' ? 'info' : 'default'}>{member.role}</Badge>
                      <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot' | null>('login');
  const [activeTab, setActiveTab] = useState<'overview' | 'templates' | 'logs' | 'contacts' | 'settings'>('overview');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isSegmentModalOpen, setIsSegmentModalOpen] = useState(false);
  const [campaignTab, setCampaignTab] = useState<'Single' | 'Bulk Upload' | 'Groups'>('Single');
  const [campaignChannel, setCampaignChannel] = useState<'Email' | 'SMS' | 'Both'>('Email');
  const [groupTab, setGroupTab] = useState<'Select' | 'Excel'>('Select');

  const t = translations[currentLang];

  // Handle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  if (authView) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 dark:bg-white rounded-2xl shadow-xl mb-6">
              <Send className="text-white dark:text-slate-900" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {authView === 'login' && 'Welcome Back'}
              {authView === 'register' && 'Create Account'}
              {authView === 'forgot' && 'Reset Password'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              {authView === 'login' && 'The modern platform for email and SMS.'}
              {authView === 'register' && 'Start sending beautiful campaigns today.'}
              {authView === 'forgot' && 'We will send you a reset link.'}
            </p>
          </div>

          <Card className="p-8">
            {authView === 'login' && (
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setAuthView(null); }}>
                <Input label="Email Address" type="email" placeholder="name@company.com" required />
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Password</label>
                    <button type="button" onClick={() => setAuthView('forgot')} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Forgot?</button>
                  </div>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10 focus:border-slate-900 dark:focus:border-white dark:text-white"
                  />
                </div>
                <Button variant="primary" className="w-full py-3" type="submit">Sign In</Button>
                <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-sm text-slate-500">
                    New here? <button type="button" onClick={() => setAuthView('register')} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Create an account</button>
                  </p>
                </div>
              </form>
            )}

            {authView === 'register' && (
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setAuthView(null); }}>
                <Input label="Full Name" placeholder="Alex Rivera" required />
                <Input label="Email Address" type="email" placeholder="name@company.com" required />
                <Input label="Password" type="password" placeholder="••••••••" required />
                <Button variant="primary" className="w-full py-3" type="submit">Create Account</Button>
                <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-sm text-slate-500">
                    Already have an account? <button type="button" onClick={() => setAuthView('login')} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Sign in</button>
                  </p>
                </div>
              </form>
            )}

            {authView === 'forgot' && (
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setAuthView('login'); }}>
                <Input label="Email Address" type="email" placeholder="name@company.com" required />
                <Button variant="primary" className="w-full py-3" type="submit">Send Reset Link</Button>
                <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button type="button" onClick={() => setAuthView('login')} className="text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Back to Login</button>
                </div>
              </form>
            )}
          </Card>

          <div className="flex items-center justify-center gap-4">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setCurrentLang(currentLang === 'en' ? 'pt' : 'en')} className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors">
              {currentLang}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Sidebar */}
      <aside className={cn(
        "bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 z-30",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center shrink-0">
              <Send className="text-white dark:text-slate-900" size={18} />
            </div>
            {isSidebarOpen && <span className="font-bold text-lg tracking-tight dark:text-white">OmniSend</span>}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <SidebarItem icon={LayoutDashboard} label="Overview" active={activeTab === 'overview'} collapsed={!isSidebarOpen} onClick={() => setActiveTab('overview')} />
          <SidebarItem icon={FileText} label="Templates" active={activeTab === 'templates'} collapsed={!isSidebarOpen} onClick={() => setActiveTab('templates')} />
          <SidebarItem icon={MessageSquare} label="Messages" active={activeTab === 'logs'} collapsed={!isSidebarOpen} onClick={() => setActiveTab('logs')} />
          <SidebarItem icon={Users} label="Contacts" active={activeTab === 'contacts'} collapsed={!isSidebarOpen} onClick={() => setActiveTab('contacts')} />
          <SidebarItem icon={SettingsIcon} label="Settings" active={activeTab === 'settings'} collapsed={!isSidebarOpen} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={() => setAuthView('login')}
            className={cn("w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all", !isSidebarOpen && "justify-center")}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <LayoutDashboard size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
              <span>Home</span>
              <ChevronRight size={14} />
              <span className="text-slate-900 dark:text-white font-semibold capitalize">{activeTab}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-64 pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{mockUser.name}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{mockUser.plan} Plan</p>
              </div>
              <img src={mockUser.avatar} alt={mockUser.name} className="w-8 h-8 rounded-full ring-2 ring-slate-100 dark:ring-slate-800" referrerPolicy="no-referrer" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'overview' && <OverviewView t={t} onNewCampaign={() => setIsCampaignModalOpen(true)} />}
                {activeTab === 'templates' && <TemplatesView />}
                {activeTab === 'logs' && <MessagesView onNewMessage={() => setIsCampaignModalOpen(true)} />}
                {activeTab === 'contacts' && <ContactsView onAddSegment={() => setIsSegmentModalOpen(true)} onNewMessage={() => setIsCampaignModalOpen(true)} />}
                {activeTab === 'settings' && <SettingsView />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Send New Modal */}
      <Modal 
        isOpen={isCampaignModalOpen} 
        onClose={() => setIsCampaignModalOpen(false)} 
        title="Send New"
        size="md"
      >
        <div className="space-y-6">
          {/* Recipient Type Tabs */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {(['Single', 'Bulk Upload', 'Groups'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setCampaignTab(tab)}
                className={cn(
                  "flex-1 py-1.5 text-xs font-bold rounded-lg transition-all",
                  campaignTab === tab 
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Channel Tabs */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {(['Email', 'SMS', 'Both'] as const).map((channel) => (
              <button
                key={channel}
                onClick={() => setCampaignChannel(channel)}
                className={cn(
                  "flex-1 py-1.5 text-xs font-bold rounded-lg transition-all",
                  campaignChannel === channel 
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                )}
              >
                {channel === 'Both' ? 'Both (Email + SMS)' : channel}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {campaignTab === 'Single' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">To</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10 dark:text-white">
                  <option value="">Select recipient...</option>
                  {mockContacts.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                  ))}
                </select>
              </div>
            )}

            {campaignTab === 'Bulk Upload' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Upload CSV/Excel</label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                  <Upload className="mx-auto text-slate-400 mb-2" size={24} />
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Click to upload or drag and drop</p>
                  <p className="text-[10px] text-slate-400 mt-1">CSV, XLSX up to 10MB</p>
                </div>
              </div>
            )}

            {campaignTab === 'Groups' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Select Group</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10 dark:text-white">
                  <option value="">Select group...</option>
                  {mockSegments.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.contactCount} contacts)</option>
                  ))}
                </select>
              </div>
            )}

            <Input label="Subject" placeholder="Enter subject..." />

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Content</label>
              <textarea 
                rows={4}
                placeholder="Type your message... use {{name}} for dynamic names"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10 dark:text-white resize-none"
              />
            </div>
          </div>

          <Button variant="primary" className="w-full py-3 bg-indigo-400 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600" icon={Send} onClick={() => setIsCampaignModalOpen(false)}>
            Send
          </Button>
        </div>
      </Modal>

      {/* Create Group Modal */}
      <Modal 
        isOpen={isSegmentModalOpen} 
        onClose={() => setIsSegmentModalOpen(false)} 
        title="Create Group"
      >
        <div className="space-y-6">
          <Input label="Group Name" placeholder="Enter group name..." required />
          
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setGroupTab('Select')}
              className={cn(
                "flex-1 py-1.5 text-xs font-bold rounded-lg transition-all",
                groupTab === 'Select' 
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              )}
            >
              Select from Contacts
            </button>
            <button
              onClick={() => setGroupTab('Excel')}
              className={cn(
                "flex-1 py-1.5 text-xs font-bold rounded-lg transition-all",
                groupTab === 'Excel' 
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              )}
            >
              Create via Excel
            </button>
          </div>

          {groupTab === 'Select' ? (
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Select Contacts</p>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {mockContacts.map(contact => (
                  <div key={contact.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{contact.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{contact.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Upload Excel/CSV</p>
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                <Upload className="mx-auto text-slate-400 mb-2" size={32} />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Click to upload or drag and drop</p>
              </div>
              <button className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                <FileSpreadsheet size={16} /> Download Template
              </button>
            </div>
          )}

          <Button variant="primary" className="w-full py-3 bg-indigo-400 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600" onClick={() => setIsSegmentModalOpen(false)}>
            Create Group
          </Button>
        </div>
      </Modal>
    </div>
  );
}
