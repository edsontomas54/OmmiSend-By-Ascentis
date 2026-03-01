/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
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
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Language, 
  MessageType, 
  Status, 
  User, 
  Message, 
  Template, 
  translations,
  SMTPConfig,
  APIConfig,
  Plan,
  ContactGroup,
  PlanType
} from './types';
import { mockUsers, mockMessages, mockTemplates, mockPlans, mockContactGroups } from './mockData';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState<'landing' | 'login' | 'register'>('landing');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'messages' | 'templates' | 'recipients' | 'settings'>('dashboard');
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [recipients, setRecipients] = useState<User[]>(mockUsers);
  const [contactGroups, setContactGroups] = useState<ContactGroup[]>(mockContactGroups);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Current User State (Simulating a logged-in user)
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'current-user',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1555000111',
    type: 'company',
    companyName: 'My Awesome Company',
    language: 'en',
    plan: 'pro',
    credits: {
      emails: 4500,
      sms: 480
    },
    smtpConfig: {
      host: 'smtp.example.com',
      port: 587,
      user: 'john@example.com',
      pass: '********',
      fromEmail: 'noreply@awesomecompany.com'
    },
    apiConfig: {
      apiKey: 'os_live_550e8400-e29b-41d4-a716-446655440000'
    }
  });

  const t = translations[currentLang];

  const stats = useMemo(() => {
    return {
      total: messages.length,
      sent: messages.filter(m => m.status === 'sent').length,
      pending: messages.filter(m => m.status === 'pending').length,
      failed: messages.filter(m => m.status === 'failed').length,
    };
  }, [messages]);

  const handleSendMessage = (newMessage: Partial<Message>) => {
    const types: MessageType[] = newMessage.type === 'both' ? ['email', 'sms'] : [newMessage.type as MessageType];
    
    const newMsgs: Message[] = types.map((t, i) => ({
      id: `m${messages.length + i + 1}`,
      senderId: currentUser.id,
      recipientId: newMessage.recipientId || '1',
      type: t,
      subject: newMessage.subject,
      content: newMessage.content || '',
      status: 'sent',
      timestamp: new Date().toISOString(),
      language: currentLang,
    }));
    
    // Deduct credits
    const newCredits = { ...currentUser.credits };
    newMsgs.forEach(m => {
      if (m.type === 'email') newCredits.emails -= 1;
      else newCredits.sms -= 1;
    });
    
    setCurrentUser({ ...currentUser, credits: newCredits });
    setMessages([...newMsgs, ...messages]);
    setIsComposerOpen(false);
  };

  const handleBulkSend = (bulkMessages: Message[], newContacts?: User[]) => {
    if (newContacts && newContacts.length > 0) {
      setRecipients([...recipients, ...newContacts]);
    }
    
    // Deduct credits
    const newCredits = { ...currentUser.credits };
    bulkMessages.forEach(m => {
      if (m.type === 'email') newCredits.emails -= 1;
      else newCredits.sms -= 1;
    });
    
    setCurrentUser({ ...currentUser, credits: newCredits });
    setMessages([...bulkMessages, ...messages]);
    setIsComposerOpen(false);
  };

  const handleCreateGroup = (name: string, contactIds: string[]) => {
    const newGroup: ContactGroup = {
      id: `g${contactGroups.length + 1}`,
      name,
      contactIds
    };
    setContactGroups([...contactGroups, newGroup]);
  };

  const handleLogin = (email: string) => {
    // Simulating login
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      setCurrentUser({ ...user, id: 'current-user' });
    }
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthView('landing');
  };

  if (!isLoggedIn) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
        <header className="h-20 flex items-center justify-between px-8 md:px-20 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Send className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight dark:text-white">OmniSend</span>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => setCurrentLang(currentLang === 'en' ? 'pt' : 'en')}
              className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Globe size={18} />
              {currentLang === 'en' ? 'EN' : 'PT'}
            </button>
            <button 
              onClick={() => setAuthView('login')}
              className="text-slate-600 dark:text-slate-400 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {t.login}
            </button>
            <button 
              onClick={() => setAuthView('register')}
              className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2.5 rounded-full font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100 dark:shadow-none"
            >
              {t.getStarted}
            </button>
          </div>
        </header>

        <main>
          <AnimatePresence mode="wait">
            {authView === 'landing' && (
              <motion.div 
                key="landing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="px-8 md:px-20 py-20"
              >
                <div className="max-w-4xl mx-auto text-center mb-20">
                  <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
                    {t.heroTitle}
                  </h1>
                  <p className="text-xl text-slate-500 dark:text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                    {t.heroSub}
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <button 
                      onClick={() => setAuthView('register')}
                      className="bg-indigo-600 dark:bg-indigo-500 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-200 dark:shadow-none"
                    >
                      {t.getStarted}
                    </button>
                    <button className="px-8 py-4 rounded-full text-lg font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                      Learn More
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                  <FeatureCard 
                    icon={<Mail className="text-indigo-600" size={32} />}
                    title={t.emailSmsService}
                    desc={t.emailSmsDesc}
                  />
                  <FeatureCard 
                    icon={<FileSpreadsheet className="text-indigo-600" size={32} />}
                    title={t.bulkService}
                    desc={t.bulkDesc}
                  />
                  <FeatureCard 
                    icon={<Server className="text-indigo-600" size={32} />}
                    title={t.apiSmtpService}
                    desc={t.apiSmtpDesc}
                  />
                </div>

                <div className="mb-20">
                  <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">{t.pricing}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {mockPlans.map(plan => (
                      <div key={plan.id} className={`p-8 rounded-3xl border ${plan.id === 'pro' ? 'border-indigo-600 shadow-xl shadow-indigo-100 dark:shadow-none relative' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}>
                        {plan.id === 'pro' && (
                          <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</span>
                        )}
                        <h3 className="text-xl font-bold mb-2 dark:text-white">{plan.name}</h3>
                        <div className="text-4xl font-bold mb-6 dark:text-white">{plan.price}<span className="text-sm text-slate-400 font-normal">/mo</span></div>
                        <ul className="space-y-4 mb-8 text-left">
                          {plan.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                              <CheckCircle2 size={16} className="text-emerald-500" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <button 
                          onClick={() => setAuthView('register')}
                          className={`w-full py-3 rounded-xl font-bold transition-all ${plan.id === 'pro' ? 'bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                        >
                          {t.getStarted}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 md:p-12 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-6 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest text-xs">
                    <ShieldCheck size={16} />
                    {t.testUsers}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mockUsers.slice(0, 2).map(user => (
                      <div key={user.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                            {user.type === 'company' ? <Building2 size={20} /> : <UserIcon size={20} />}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 dark:text-slate-200">{user.name}</div>
                            <div className="text-xs text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">{user.type}</div>
                          </div>
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                          Email: {user.email} <br/>
                          Password: any
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {(authView === 'login' || authView === 'register') && (
              <motion.div 
                key="auth-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center justify-center py-20 px-8"
              >
                <div className="w-full max-w-md bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800">
                  <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-indigo-600 dark:bg-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200 dark:shadow-none">
                      <Send className="text-white w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{authView === 'login' ? t.login : t.register}</h2>
                  </div>

                  <AuthForm 
                    view={authView} 
                    t={t} 
                    onSwitch={() => setAuthView(authView === 'login' ? 'register' : 'login')}
                    onSubmit={handleLogin}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#f5f5f5] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-colors duration-300">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Send className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight dark:text-white">OmniSend</span>
          </div>

          <nav className="space-y-1">
            <NavItem 
              icon={<LayoutDashboard size={20} />} 
              label={t.dashboard} 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
            />
            <NavItem 
              icon={<Mail size={20} />} 
              label={t.messages} 
              active={activeTab === 'messages'} 
              onClick={() => setActiveTab('messages')} 
            />
            <NavItem 
              icon={<FileText size={20} />} 
              label={t.templates} 
              active={activeTab === 'templates'} 
              onClick={() => setActiveTab('templates')} 
            />
            <NavItem 
              icon={<Users size={20} />} 
              label={t.recipients} 
              active={activeTab === 'recipients'} 
              onClick={() => setActiveTab('recipients')} 
            />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors w-full text-sm font-medium mb-4"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button 
            onClick={() => setCurrentLang(currentLang === 'en' ? 'pt' : 'en')}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors w-full text-sm font-medium mb-2"
          >
            <Globe size={18} />
            {currentLang === 'en' ? 'English' : 'Português'}
          </button>
          <NavItem 
            icon={<SettingsIcon size={20} />} 
            label={t.settings} 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 transition-all mt-2"
          >
            <AlertCircle size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-slate-800 dark:text-white capitalize">{t[activeTab]}</h1>
            {currentUser.type === 'company' && (
              <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100 dark:border-indigo-500/20">
                {currentUser.companyName}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 w-64 transition-all dark:text-white dark:placeholder-slate-500"
              />
            </div>
            <button 
              onClick={() => setIsComposerOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-sm"
            >
              <Plus size={18} />
              {t.sendNew}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <StatCard label="Total" value={stats.total} icon={<Send size={20} />} color="indigo" />
                  <StatCard label="Sent" value={stats.sent} icon={<CheckCircle2 size={20} />} color="emerald" />
                  <StatCard label="Pending" value={stats.pending} icon={<Clock size={20} />} color="amber" />
                  <StatCard label="Failed" value={stats.failed} icon={<AlertCircle size={20} />} color="rose" />
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h2 className="font-semibold text-slate-800 dark:text-white">Recent Messages</h2>
                    <button onClick={() => setActiveTab('messages')} className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">View all</button>
                  </div>
                  <div className="divide-y divide-slate-50 dark:divide-slate-800">
                    {messages.slice(0, 5).map(msg => (
                      <MessageRow key={msg.id} message={msg} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'messages' && (
              <motion.div 
                key="messages"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden"
              >
                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                  {messages.map(msg => (
                    <MessageRow key={msg.id} message={msg} />
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'recipients' && (
              <motion.div 
                key="recipients"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-800">{t.groups}</h2>
                  <button 
                    onClick={() => setIsCreateGroupModalOpen(true)}
                    className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all"
                  >
                    <Plus size={18} />
                    {t.createGroup}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {contactGroups.map(group => (
                    <div key={group.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                          <Users size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{group.contactIds.length} Contacts</span>
                      </div>
                      <h3 className="font-bold text-slate-800 dark:text-white mb-1">{group.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Send messages to everyone in this group.</p>
                      <button className="w-full py-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 rounded-lg group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500 group-hover:text-white transition-all">
                        View Group
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-slate-200">
                  <h2 className="text-xl font-bold text-slate-800">{t.recipients}</h2>
                  <button 
                    onClick={() => setIsAddContactModalOpen(true)}
                    className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all"
                  >
                    <Plus size={18} />
                    {t.addContact}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recipients.map(user => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'templates' && (
              <motion.div 
                key="templates"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {mockTemplates.map(template => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto"
              >
                <SettingsView user={currentUser} setUser={setCurrentUser} t={t} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Composer Modal */}
      <AnimatePresence>
        {isComposerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsComposerOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t.sendNew}</h2>
                <button onClick={() => setIsComposerOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>
              <ComposerForm 
                onSend={handleSendMessage} 
                onBulkSend={handleBulkSend}
                t={t} 
                recipients={recipients} 
                currentUser={currentUser}
                contactGroups={contactGroups}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Group Modal */}
      <AnimatePresence>
        {isCreateGroupModalOpen && (
          <CreateGroupModal 
            t={t} 
            recipients={recipients} 
            onClose={() => setIsCreateGroupModalOpen(false)} 
            onCreate={handleCreateGroup} 
          />
        )}
      </AnimatePresence>

      {/* Add Contact Modal */}
      <AnimatePresence>
        {isAddContactModalOpen && (
          <AddContactModal 
            t={t} 
            onClose={() => setIsAddContactModalOpen(false)} 
            onAdd={(contact) => {
              setRecipients([...recipients, { ...contact, id: `c${recipients.length + 1}`, plan: 'free', credits: { emails: 0, sms: 0 } }]);
              setIsAddContactModalOpen(false);
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active 
          ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function StatCard({ label, value, icon, color }: { label: string, value: number, icon: React.ReactNode, color: string }) {
  const colors: Record<string, string> = {
    indigo: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
    rose: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400',
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${colors[color]}`}>
        {icon}
      </div>
      <div className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{label}</div>
      <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}

function MessageRow({ message }: { message: Message, key?: React.Key }) {
  const recipient = mockUsers.find(u => u.id === message.recipientId);
  
  return (
    <div className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
        message.type === 'email' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400'
      }`}>
        {message.type === 'email' ? <Mail size={18} /> : <MessageSquare size={18} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
            {recipient?.name || 'Unknown'} 
            <span className="ml-2 text-xs font-normal text-slate-400 dark:text-slate-500">
              ({recipient?.type === 'company' ? recipient.companyName : 'Individual'})
            </span>
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400 truncate">
          {message.subject && <span className="font-medium text-slate-700 dark:text-slate-300">{message.subject} — </span>}
          {message.content}
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-3">
        <StatusBadge status={message.status} />
        <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors" />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    sent: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
    pending: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400',
    failed: 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400',
    scheduled: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}>
      {status}
    </span>
  );
}

function UserCard({ user }: { user: User, key?: React.Key }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500">
          {user.type === 'company' ? <Building2 size={24} /> : <UserIcon size={24} />}
        </div>
        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
          user.type === 'company' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
        }`}>
          {user.type}
        </span>
      </div>
      <h3 className="font-bold text-slate-800 dark:text-white mb-1">{user.name}</h3>
      {user.companyName && <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-3">{user.companyName}</p>}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Mail size={14} />
          {user.email}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <MessageSquare size={14} />
          {user.phone}
        </div>
      </div>
    </div>
  );
}

function TemplateCard({ template }: { template: Template, key?: React.Key }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          template.type === 'email' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400'
        }`}>
          {template.type === 'email' ? <Mail size={20} /> : <MessageSquare size={20} />}
        </div>
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{template.language}</span>
      </div>
      <h3 className="font-bold text-slate-800 dark:text-white mb-2">{template.name}</h3>
      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-sm text-slate-600 dark:text-slate-400 italic mb-4 line-clamp-3 flex-1">
        "{template.content}"
      </div>
      <button className="w-full py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors">
        Use Template
      </button>
    </div>
  );
}

function ComposerForm({ onSend, onBulkSend, t, recipients, currentUser, contactGroups }: { 
  onSend: (msg: Partial<Message>) => void, 
  onBulkSend: (msgs: Message[], newContacts?: User[]) => void,
  t: any, 
  recipients: User[],
  currentUser: User,
  contactGroups: ContactGroup[]
}) {
  const [activeMode, setActiveMode] = useState<'single' | 'bulk' | 'group'>('single');
  const [type, setType] = useState<MessageType>('email');
  const [recipientId, setRecipientId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [createClients, setCreateClients] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBulkFile(e.target.files[0]);
    }
  };

  const handleBulkSubmit = () => {
    if (!bulkFile || !content) return;
    
    // Simulating processing an excel file based on type
    const newContacts: User[] = [];
    const types: MessageType[] = type === 'both' ? ['email', 'sms'] : [type];
    const simulatedMessages: Message[] = [];

    Array.from({ length: 3 }).forEach((_, i) => {
      const id = `bulk-rec-${Date.now()}-${i}`;
      const name = `Recipient ${i+1}`;
      const email = `bulk${i+1}@example.com`;
      const phone = `+155510020${i}`;

      if (createClients) {
        newContacts.push({
          id,
          name,
          email,
          phone,
          type: 'individual',
          language: currentUser.language,
          plan: 'free',
          credits: { emails: 0, sms: 0 }
        });
      }

      types.forEach((t, ti) => {
        simulatedMessages.push({
          id: `bulk-msg-${Date.now()}-${i}-${ti}`,
          senderId: currentUser.id,
          recipientId: id,
          type: t,
          subject: t === 'email' ? `${subject} (Bulk #${i+1})` : undefined,
          content: content.replace('{{name}}', name),
          status: 'sent',
          timestamp: new Date().toISOString(),
          language: currentUser.language
        });
      });
    });

    onBulkSend(simulatedMessages, createClients ? newContacts : undefined);
  };

  const handleGroupSubmit = () => {
    if (!groupId || !content) return;
    
    let contactIds: string[] = [];
    if (groupId === 'all') {
      contactIds = recipients.map(r => r.id);
    } else {
      const group = contactGroups.find(g => g.id === groupId);
      if (!group) return;
      contactIds = group.contactIds;
    }

    const types: MessageType[] = type === 'both' ? ['email', 'sms'] : [type];
    const groupMessages: Message[] = [];

    contactIds.forEach((cid, i) => {
      const contact = recipients.find(r => r.id === cid);
      types.forEach((t, ti) => {
        groupMessages.push({
          id: `group-msg-${Date.now()}-${i}-${ti}`,
          senderId: currentUser.id,
          recipientId: cid,
          type: t,
          subject: t === 'email' ? subject : undefined,
          content: content.replace('{{name}}', contact?.name || 'Customer'),
          status: 'sent',
          timestamp: new Date().toISOString(),
          language: currentUser.language
        });
      });
    });

    onBulkSend(groupMessages);
  };

  const getTemplateText = () => {
    if (type === 'email') return t.templateEmail;
    if (type === 'sms') return t.templateSms;
    return t.templateBoth;
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-2">
        <button 
          onClick={() => setActiveMode('single')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeMode === 'single' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
        >
          Single
        </button>
        <button 
          onClick={() => setActiveMode('bulk')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeMode === 'bulk' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
        >
          {t.bulkUpload}
        </button>
        <button 
          onClick={() => setActiveMode('group')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeMode === 'group' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
        >
          {t.groups}
        </button>
      </div>

      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
        <button 
          onClick={() => setType('email')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'email' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
        >
          {t.email}
        </button>
        <button 
          onClick={() => setType('sms')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'sms' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
        >
          {t.sms}
        </button>
        <button 
          onClick={() => setType('both')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'both' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
        >
          {t.both}
        </button>
      </div>

      {activeMode === 'single' && (
        <div>
          <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">{t.to}</label>
          <select 
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none dark:text-white"
          >
            <option value="">Select recipient...</option>
            {recipients.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.type === 'company' ? u.companyName : 'Individual'})</option>
            ))}
          </select>
        </div>
      )}

      {activeMode === 'group' && (
        <div>
          <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">{t.selectGroup}</label>
          <select 
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none dark:text-white"
          >
            <option value="">Select group...</option>
            <option value="all">{t.allContacts} ({recipients.length})</option>
            {contactGroups.map(g => (
              <option key={g.id} value={g.id}>{g.name} ({g.contactIds.length} contacts)</option>
            ))}
          </select>
        </div>
      )}

      {activeMode === 'bulk' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Upload Excel/CSV</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".csv,.xlsx,.xls"
              />
              {bulkFile ? (
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium">
                  <FileSpreadsheet size={24} />
                  <span>{bulkFile.name}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setBulkFile(null); }}
                    className="p-1 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-full text-rose-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="text-slate-300 dark:text-slate-600 mb-2" size={32} />
                  <p className="text-sm text-slate-500 dark:text-slate-400">Click to upload or drag and drop</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{getTemplateText()}</p>
                </>
              )}
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); alert('Downloading template...'); }}
              className="mt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <FileSpreadsheet size={14} />
              {t.downloadTemplate}
            </button>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
            <input 
              type="checkbox" 
              id="createClients"
              checked={createClients}
              onChange={(e) => setCreateClients(e.target.checked)}
              className="w-4 h-4 text-indigo-600 dark:text-indigo-400 rounded focus:ring-indigo-500"
            />
            <label htmlFor="createClients" className="text-sm text-indigo-900 dark:text-indigo-200 font-medium">
              {t.createClientsPrompt}
            </label>
          </div>
        </div>
      )}

      {type === 'email' && (
        <div>
          <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">{t.subject}</label>
          <input 
            type="text" 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject..."
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none dark:text-white"
          />
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">{t.content}</label>
        <textarea 
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your message... use {{name}} for dynamic names"
          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none resize-none dark:text-white"
        />
      </div>

      <button 
        disabled={
          activeMode === 'single' ? (!recipientId || !content) : 
          activeMode === 'bulk' ? (!bulkFile || !content) : 
          (!groupId || !content)
        }
        onClick={
          activeMode === 'single' ? () => onSend({ type, recipientId, subject, content }) : 
          activeMode === 'bulk' ? handleBulkSubmit : 
          handleGroupSubmit
        }
        className="w-full py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100 dark:shadow-none disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
      >
        <Send size={18} />
        {activeMode === 'single' ? t.send : activeMode === 'bulk' ? 'Send Bulk Messages' : 'Send to Group'}
      </button>
    </div>
  );
}

function SettingsView({ user, setUser, t }: { user: User, setUser: (u: User) => void, t: any }) {
  const [activeSettingsTab, setActiveSettingsTab] = useState<'profile' | 'smtp' | 'api' | 'plan'>('profile');

  const updateProfile = (updates: Partial<User>) => {
    setUser({ ...user, ...updates });
  };

  const updateSMTP = (updates: Partial<SMTPConfig>) => {
    setUser({ ...user, smtpConfig: { ...user.smtpConfig!, ...updates } });
  };

  const currentPlan = mockPlans.find(p => p.id === user.plan);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
      <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
        <button 
          onClick={() => setActiveSettingsTab('profile')}
          className={`px-6 py-4 text-sm font-bold flex items-center gap-2 transition-all border-b-2 shrink-0 ${
            activeSettingsTab === 'profile' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <UserIcon size={18} />
          {t.profile}
        </button>
        <button 
          onClick={() => setActiveSettingsTab('plan')}
          className={`px-6 py-4 text-sm font-bold flex items-center gap-2 transition-all border-b-2 shrink-0 ${
            activeSettingsTab === 'plan' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <ShieldCheck size={18} />
          {t.plans}
        </button>
        <button 
          onClick={() => setActiveSettingsTab('smtp')}
          className={`px-6 py-4 text-sm font-bold flex items-center gap-2 transition-all border-b-2 shrink-0 ${
            activeSettingsTab === 'smtp' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Server size={18} />
          {t.smtp}
        </button>
        <button 
          onClick={() => setActiveSettingsTab('api')}
          className={`px-6 py-4 text-sm font-bold flex items-center gap-2 transition-all border-b-2 shrink-0 ${
            activeSettingsTab === 'api' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Key size={18} />
          {t.api}
        </button>
      </div>

      <div className="p-8">
        <AnimatePresence mode="wait">
          {activeSettingsTab === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Account Type</label>
                  <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <button 
                      onClick={() => updateProfile({ type: 'individual' })}
                      className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${user.type === 'individual' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                      {t.individual}
                    </button>
                    <button 
                      onClick={() => updateProfile({ type: 'company' })}
                      className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${user.type === 'company' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                      {t.company}
                    </button>
                  </div>
                </div>
                {user.type === 'company' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">{t.companyName}</label>
                    <input 
                      type="text" 
                      value={user.companyName || ''}
                      onChange={(e) => updateProfile({ companyName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none dark:text-white"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    value={user.name}
                    onChange={(e) => updateProfile({ name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    value={user.email}
                    onChange={(e) => updateProfile({ email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none dark:text-white"
                  />
                </div>
              </div>
              <button className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100 dark:shadow-none">
                {t.save}
              </button>
            </motion.div>
          )}

          {activeSettingsTab === 'plan' && (
            <motion.div 
              key="plan"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-8"
            >
              <div className="bg-indigo-600 dark:bg-indigo-500 rounded-2xl p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <div className="text-indigo-100 text-sm font-bold uppercase tracking-widest mb-1">Current Plan</div>
                  <h3 className="text-3xl font-bold mb-2">{currentPlan?.name}</h3>
                  <p className="text-indigo-100/80 text-sm max-w-md">You are currently on the {currentPlan?.name} plan. Upgrade to unlock more features and higher limits.</p>
                </div>
                <button className="bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 dark:hover:bg-slate-700 transition-all shadow-lg">
                  Upgrade Plan
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                      <Mail size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Email Credits</div>
                      <div className="text-xl font-bold text-slate-800 dark:text-white">{user.credits.emails} / {currentPlan?.limits.emails}</div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full transition-all" 
                      style={{ width: `${(user.credits.emails / (currentPlan?.limits.emails || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">SMS Credits</div>
                      <div className="text-xl font-bold text-slate-800 dark:text-white">{user.credits.sms} / {currentPlan?.limits.sms}</div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-purple-500 h-full transition-all" 
                      style={{ width: `${(user.credits.sms / (currentPlan?.limits.sms || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSettingsTab === 'smtp' && (
            <motion.div 
              key="smtp"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-500/10 rounded-2xl border border-amber-100 dark:border-amber-500/20 mb-6">
                <ShieldCheck className="text-amber-600 dark:text-amber-400" size={24} />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Configure your custom SMTP server to send emails from your own domain.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">{t.host}</label>
                  <input 
                    type="text" 
                    value={user.smtpConfig?.host || ''}
                    onChange={(e) => updateSMTP({ host: e.target.value })}
                    placeholder="smtp.yourdomain.com"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">{t.port}</label>
                  <input 
                    type="number" 
                    value={user.smtpConfig?.port || ''}
                    onChange={(e) => updateSMTP({ port: parseInt(e.target.value) })}
                    placeholder="587"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">{t.fromEmail}</label>
                  <input 
                    type="email" 
                    value={user.smtpConfig?.fromEmail || ''}
                    onChange={(e) => updateSMTP({ fromEmail: e.target.value })}
                    placeholder="noreply@yourdomain.com"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">{t.username}</label>
                  <input 
                    type="text" 
                    value={user.smtpConfig?.user || ''}
                    onChange={(e) => updateSMTP({ user: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">{t.password}</label>
                  <input 
                    type="password" 
                    value={user.smtpConfig?.pass || ''}
                    onChange={(e) => updateSMTP({ pass: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none dark:text-white"
                  />
                </div>
              </div>
              <button className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100 dark:shadow-none">
                {t.save}
              </button>
            </motion.div>
          )}

          {activeSettingsTab === 'api' && (
            <motion.div 
              key="api"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-8"
            >
              <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl p-6 text-white border border-slate-800">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                      <Key size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold">{t.apiKey}</h3>
                      <p className="text-xs text-slate-400">Use this key to authenticate your API requests.</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">Regenerate</button>
                </div>
                
                <div className="bg-slate-800 dark:bg-slate-900 rounded-xl p-4 flex items-center justify-between border border-slate-700 dark:border-slate-800">
                  <code className="text-sm font-mono text-indigo-300 truncate mr-4">
                    {user.apiConfig?.apiKey}
                  </code>
                  <button 
                    onClick={() => navigator.clipboard.writeText(user.apiConfig?.apiKey || '')}
                    className="p-2 hover:bg-slate-700 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 dark:text-white">API Documentation</h3>
                <div className="space-y-4">
                  <ApiDocItem 
                    method="POST" 
                    endpoint="/api/v1/send/email" 
                    desc="Send an email message programmatically."
                  />
                  <ApiDocItem 
                    method="POST" 
                    endpoint="/api/v1/send/sms" 
                    desc="Send an SMS message programmatically."
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ApiDocItem({ method, endpoint, desc }: { method: string, endpoint: string, desc: string }) {
  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-2">
        <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded uppercase tracking-wider">{method}</span>
        <code className="text-sm font-mono text-slate-700 dark:text-slate-300">{endpoint}</code>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
    </div>
  );
}

function AddContactModal({ t, onClose, onAdd }: { t: any, onClose: () => void, onAdd: (contact: Partial<User>) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState<'individual' | 'company'>('individual');
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ name, email, phone, type, companyName: type === 'company' ? companyName : undefined, language: 'en' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t.addContact}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <Plus className="rotate-45" size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Type</label>
            <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button 
                type="button"
                onClick={() => setType('individual')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'individual' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
              >
                {t.individual}
              </button>
              <button 
                type="button"
                onClick={() => setType('company')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'company' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
              >
                {t.company}
              </button>
            </div>
          </div>

          {type === 'company' && (
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">{t.companyName}</label>
              <input 
                type="text" 
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name..."
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none dark:text-white"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.phonePlaceholder}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none dark:text-white"
            />
          </div>

          <button 
            type="submit"
            disabled={!name || (!email && !phone)}
            className="w-full py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-lg disabled:opacity-50 mt-2"
          >
            {t.addContact}
          </button>
        </form>
      </motion.div>
    </div>
);
}

function CreateGroupModal({ t, recipients, onClose, onCreate }: { t: any, recipients: User[], onClose: () => void, onCreate: (name: string, ids: string[]) => void }) {
  const [name, setName] = useState('');
  const [mode, setMode] = useState<'select' | 'excel'>('select');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleContact = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleCreate = () => {
    if (!name) return;
    if (mode === 'select' && selectedIds.length > 0) {
      onCreate(name, selectedIds);
      onClose();
    } else if (mode === 'excel' && excelFile) {
      // Simulating excel processing
      const simulatedIds = ['1', '2', '3']; // Mock IDs
      onCreate(name, simulatedIds);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t.createGroup}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <Plus className="rotate-45" size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">{t.groupName}</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none dark:text-white"
            />
          </div>

          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button 
              onClick={() => setMode('select')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'select' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
            >
              {t.createGroupSelect}
            </button>
            <button 
              onClick={() => setMode('excel')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'excel' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
            >
              {t.createGroupExcel}
            </button>
          </div>

          {mode === 'select' ? (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">{t.selectContacts}</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recipients.map(user => (
                  <div 
                    key={user.id} 
                    onClick={() => toggleContact(user.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                      selectedIds.includes(user.id) ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10' : 'border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/30'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                      selectedIds.includes(user.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}>
                      {selectedIds.includes(user.id) && <CheckCircle2 size={12} />}
                    </div>
                    <div className="truncate">
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{user.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{user.email || user.phone}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Upload Excel/CSV</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => e.target.files && setExcelFile(e.target.files[0])} 
                  className="hidden" 
                  accept=".csv,.xlsx,.xls"
                />
                {excelFile ? (
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium">
                    <FileSpreadsheet size={32} />
                    <span>{excelFile.name}</span>
                  </div>
                ) : (
                  <>
                    <Upload className="text-slate-300 dark:text-slate-600 mb-2" size={40} />
                    <p className="text-sm text-slate-500 dark:text-slate-400">Click to upload or drag and drop</p>
                  </>
                )}
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); alert('Downloading template...'); }}
                className="mt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <FileSpreadsheet size={14} />
                {t.downloadTemplate}
              </button>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <button 
            disabled={!name || (mode === 'select' ? selectedIds.length === 0 : !excelFile)}
            onClick={handleCreate}
            className="w-full py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-lg disabled:opacity-50"
          >
            {t.createGroup}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function AuthForm({ view, t, onSwitch, onSubmit }: { view: 'login' | 'register', t: any, onSwitch: () => void, onSubmit: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none dark:text-white dark:placeholder-slate-500"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none dark:text-white dark:placeholder-slate-500"
        />
      </div>
      <button 
        onClick={() => onSubmit(email)}
        className="w-full py-4 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100 dark:shadow-none"
      >
        {view === 'login' ? t.login : t.register}
      </button>
      <div className="text-center text-sm text-slate-500 dark:text-slate-400">
        {view === 'login' ? t.dontHaveAccount : t.alreadyHaveAccount}{' '}
        <button onClick={onSwitch} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
          {view === 'login' ? t.register : t.login}
        </button>
      </div>
    </div>
  );
}
