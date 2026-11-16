import { useState, type FormEvent } from 'react';
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  Calculator,
  Check,
  Code2,
  Cpu,
  Database,
  FileCode2,
  Figma,
  Github,
  Globe,
  Layers,
  Loader2,
  Megaphone,
  MessageSquare,
  Mic,
  Palette,
  Play,
  Plus,
  Rocket,
  Search,
  Server,
  Settings,
  ShieldCheck,
  Sparkles,
  Terminal,
  Ticket,
  Users,
  Wallet,
  Wrench,
} from 'lucide-react';
import { PROJECT_TEMPLATES } from '../data/templates';
import type {
  AIModelId,
  LanguageCode,
  ProjectTemplate,
  TemplateCategory,
} from '../types/builder';
import { calculateTokenCost, formatTokenCount } from '../utils/tokenEngine';
import { BuildLogo } from './BuildLogo';

interface LandingPageProps {
  lang: LanguageCode;
  selectedModel: AIModelId;
  isGenerating?: boolean;
  onSelectModel: (model: AIModelId) => void;
  onStartBuild: (prompt: string, template?: ProjectTemplate) => void;
  onOpenPricing: () => void;
  onEnterWorkspace: () => void;
}

const CATEGORIES: TemplateCategory[] = ['All', 'SaaS & Data', 'AI & DevTools', 'Commerce & Media'];

const PARTNER_LOGOS = [
  'Google',
  'Microsoft',
  'Salesforce',
  'AWS',
  'Meta',
  'HubSpot',
  'Stripe',
  'Cloudflare',
  'Netlify',
  'TikTok',
];

function renderTemplateIcon(iconName: ProjectTemplate['iconName']) {
  const cls = 'w-4 h-4 text-[#00E5FF]';
  switch (iconName) {
    case 'chart':
      return <BarChart3 className={cls} />;
    case 'terminal':
      return <Terminal className={cls} />;
    case 'globe':
      return <Globe className={cls} />;
    case 'layers':
      return <Layers className={cls} />;
    case 'wallet':
      return <Wallet className={cls} />;
    case 'book':
      return <BookOpen className={cls} />;
    case 'file':
      return <FileCode2 className={cls} />;
    case 'ticket':
      return <Ticket className={cls} />;
    case 'activity':
      return <Activity className={cls} />;
    case 'palette':
      return <Palette className={cls} />;
  }
}

export function LandingPage({
  lang,
  selectedModel,
  isGenerating = false,
  onSelectModel,
  onStartBuild,
  onOpenPricing,
  onEnterWorkspace,
}: LandingPageProps) {
  const isTh = lang === 'th';

  const [prompt, setPrompt] = useState('');
  const [bottomPrompt, setBottomPrompt] = useState('');
  const [promptError, setPromptError] = useState('');
  const [category, setCategory] = useState<TemplateCategory>('All');
  const [agentTier, setAgentTier] = useState<'standard' | 'pro' | 'max'>(
    selectedModel === 'build-pro' ? 'pro' : 'standard',
  );
  const [starterCycleIndex, setStarterCycleIndex] = useState(0);

  const estimatedTokens = calculateTokenCost('new_app', selectedModel);
  const filteredTemplates =
    category === 'All'
      ? PROJECT_TEMPLATES
      : PROJECT_TEMPLATES.filter((t) => t.category === category);

  const quickChips = isTh
    ? [
        {
          label: 'ย่อยเอกสาร',
          prompt:
            'สร้างระบบ AI สรุปและแยกหัวข้อเอกสาร PDF พร้อมสกัดข้อมูลตารางเป็น JSON และดาวน์โหลด CSV',
        },
        {
          label: 'เกมส์ไฟล์',
          prompt:
            'สร้างเว็บแอปเกมมิฟิเคชันสำหรับเรียนรู้คำศัพท์พร้อมระบบสะสม XP และตารางอันดับเรียลไทม์',
        },
        {
          label: 'ขายของ',
          prompt:
            'สร้างร้านค้าออนไลน์ E-Commerce พร้อมตัวเลือกสินค้า ตะกร้าเลื่อนข้าง และระบบคำนวณสต็อกอัตโนมัติ',
        },
        {
          label: 'ระบบจอง & ร้านค้า',
          prompt:
            'สร้างระบบจองคิวนัดหมายออนไลน์พร้อมปฏิทินเลือกเวลา แจ้งเตือน SMS และหน้าจัดการของร้านค้า',
        },
      ]
    : [
        {
          label: 'Doc Summarizer',
          prompt:
            'Build an AI document parser and summarizer extracting tables to JSON and CSV.',
        },
        {
          label: 'Gamified Quiz',
          prompt:
            'Build a gamified interactive learning studio with XP streaks and live leaderboards.',
        },
        {
          label: 'E-Commerce',
          prompt:
            'Design a sleek storefront with product variants, slide-over cart drawer, and inventory alerts.',
        },
        {
          label: 'Booking & Store',
          prompt:
            'Create an online booking and scheduling portal with calendar slots and automated SMS reminders.',
        },
      ];

  const actionTiles = isTh
    ? [
        {
          label: 'เว็บไซต์',
          icon: <Globe className="w-4 h-4 text-[#00E5FF]" />,
          prompt: 'สร้างเว็บแอปพลิเคชัน SaaS Landing Page พร้อมแดชบอร์ดวิเคราะห์ข้อมูลแบบเรียลไทม์',
        },
        {
          label: 'สื่อสาร',
          icon: <MessageSquare className="w-4 h-4 text-[#38BDF8]" />,
          prompt: 'สร้างระบบแชททีมและห้องสนทนาเรียลไทม์พร้อมเธรดข้อความและการค้นหา',
        },
        {
          label: 'คำนวณ',
          icon: <Calculator className="w-4 h-4 text-[#3875F6]" />,
          prompt: 'สร้างเครื่องคำนวณแผนการเงินและพอร์ตการลงทุนพร้อมกราฟกระแสเงินสด',
        },
        {
          label: 'ตั้งค่าระบบ',
          icon: <Settings className="w-4 h-4 text-slate-300" />,
          prompt: 'สร้าง Admin Console สำหรับจัดการสิทธิ์ผู้ใช้ API Keys และ Webhook Logs',
        },
      ]
    : [
        {
          label: 'Website',
          icon: <Globe className="w-4 h-4 text-[#00E5FF]" />,
          prompt: 'Build a production SaaS web app with interactive telemetry dashboards.',
        },
        {
          label: 'Comms',
          icon: <MessageSquare className="w-4 h-4 text-[#38BDF8]" />,
          prompt: 'Build a real-time team messaging workspace with threads and instant search.',
        },
        {
          label: 'Calculate',
          icon: <Calculator className="w-4 h-4 text-[#3875F6]" />,
          prompt: 'Create a financial forecasting and ROI calculator with interactive cashflow charts.',
        },
        {
          label: 'System Config',
          icon: <Settings className="w-4 h-4 text-slate-300" />,
          prompt: 'Build an enterprise admin console for RBAC roles, API keys, and webhook audit logs.',
        },
      ];

  const autoPrompts = isTh
    ? [
        'สร้างแดชบอร์ดวิเคราะห์รายได้ SaaS MRR พร้อมกราฟ Cohort Retention และส่งออก CSV',
        'สร้างระบบ AI CRM จัดการลูกค้าอัตโนมัติพร้อม Kanban Pipeline และเขียนอีเมลด้วย AI',
        'สร้างระบบตรวจวัดสถานะ API Status Page เช็ก HTTP ทุก 60 วินาทีและกราฟ p95 Latency',
      ]
    : [
        'Build a dark-mode SaaS revenue analytics dashboard with MRR curves, cohorts, and CSV export.',
        'Create an AI CRM deal pipeline with automatic lead scoring and OpenAI email drafting.',
        'Design an API uptime status page polling HTTP nodes every 60s with p95 latency sparklines.',
      ];

  function populateHeroPrompt(text: string) {
    setPrompt(text);
    setPromptError('');
    const el = document.getElementById('hero-prompt-input');
    el?.focus();
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) {
      setPromptError(
        isTh
          ? 'กรุณาอธิบายแอปพลิเคชันที่ต้องการสร้าง หรือเลือกเทมเพลตด้านล่าง'
          : 'Describe the application you want to build or pick a template below.',
      );
      return;
    }
    setPromptError('');
    onStartBuild(prompt.trim());
  }

  function handleBottomSubmit(e: FormEvent) {
    e.preventDefault();
    const target =
      bottomPrompt.trim() ||
      (isTh
        ? 'สร้างตลาดออนไลน์สำหรับขายงานศิลปะดิจิทัลพร้อมระบบประมูลแบบเรียลไทม์'
        : 'Build a digital art marketplace with live bidding and creator payouts');
    onStartBuild(target);
  }

  function handleSelectAgentTier(tier: 'standard' | 'pro' | 'max') {
    setAgentTier(tier);
    if (tier === 'standard') {
      onSelectModel('build-fast');
    } else {
      onSelectModel('build-pro');
    }
  }

  const tierMetrics =
    agentTier === 'standard'
      ? { speed: '94%', speedLabel: '0.8s (เร็วที่สุด)', intel: '82%', intelLabel: 'มาตรฐาน', cost: '25%', costLabel: 'ประหยัด' }
      : agentTier === 'pro'
        ? { speed: '86%', speedLabel: '1.4s (เร็ว)', intel: '94%', intelLabel: 'สูงมาก', cost: '55%', costLabel: 'สมดุลคุ้มค่า' }
        : { speed: '74%', speedLabel: '2.2s (Reasoning)', intel: '99%', intelLabel: 'สูงสุด', cost: '80%', costLabel: 'ระดับองค์กร' };

  return (
    <main id="top" className="obsidian-backdrop min-h-[calc(100vh-4rem)] text-[#F1F3F4]">
      {/* 1. HERO SECTION & PROMPT COCKPIT */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-10 sm:pt-14 pb-12">
        <div className="max-w-3xl mx-auto text-center">
          {/* Announcement Pill */}
          <a
            href="#agent"
            className="inline-flex items-center gap-2 rounded-full bg-[#141517] border border-white/10 hover:border-[#00E5FF]/40 px-3.5 py-1 text-[11px] font-medium text-slate-300 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" aria-hidden="true" />
            <span>{isTh ? 'เปิดตัว BUILD 2.0 AGENTS' : 'INTRODUCING BUILD 2.0 AGENTS'}</span>
            <span className="text-[#38BDF8]">
              {isTh ? 'สำรวจความสามารถใหม่ →' : 'Explore capabilities →'}
            </span>
          </a>

          {/* Hero Title */}
          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-[-0.03em] leading-[1.12] text-white [text-wrap:balance]">
            {isTh ? (
              <>
                วันนี้คุณจะสร้าง <span className="text-[#00E5FF]">อะไร?</span>
              </>
            ) : (
              <>
                What will you build <span className="text-[#00E5FF]">today?</span>
              </>
            )}
          </h1>

          <p className="mt-3.5 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {isTh
              ? 'สร้างเว็บแอปพลิเคชันระดับโปรดักชันได้ทันที เพียงพิมพ์คุยกับ AI'
              : 'Turn plain English into production software instantly — clean React + TypeScript with live browser preview.'}
          </p>
        </div>

        {/* Prompt Cockpit */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-8 max-w-3xl mx-auto glass-cockpit rounded-2xl p-3.5 sm:p-4 transition-all focus-within:border-[#0066FF] focus-within:shadow-[0_0_28px_rgba(0,102,255,0.22)]"
        >
          <div className="rounded-xl bg-[#0D0E10] border border-white/10 p-3 sm:p-3.5">
            <label htmlFor="hero-prompt-input" className="sr-only">
              {isTh ? 'คำสั่งสร้างแอปพลิเคชัน' : 'Application prompt'}
            </label>
            <textarea
              id="hero-prompt-input"
              rows={4}
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                if (promptError) setPromptError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (!prompt.trim()) {
                    setPromptError(
                      isTh
                        ? 'กรุณาอธิบายแอปพลิเคชันที่ต้องการสร้าง หรือเลือกเทมเพลตด้านล่าง'
                        : 'Describe the application you want to build or pick a template below.',
                    );
                    return;
                  }
                  setPromptError('');
                  onStartBuild(prompt.trim());
                }
              }}
              placeholder={
                isTh
                  ? 'สร้างระบบสร้างคำสั่งหรืออธิบายเว็บแอปที่คุณอยากสร้าง เช่น แดชบอร์ด SaaS, ระบบ CRM, ร้านค้าออนไลน์...'
                  : "Describe the app you want to build — e.g. 'An enterprise customer health console with cohort charts and CSV export...'"
              }
              className="w-full resize-none bg-transparent text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none leading-relaxed"
            />
          </div>

          {promptError && (
            <p role="alert" className="text-xs text-rose-400 mt-2.5 px-1">
              {promptError}
            </p>
          )}

          {/* Cockpit Footer: +, Model Selector, Mic, Est. Cost & Build CTA */}
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  populateHeroPrompt(
                    isTh
                      ? `${prompt ? `${prompt} ` : ''}พร้อมระบบฐานข้อมูล Postgres, Role-based Auth และ Export CSV`
                      : `${prompt ? `${prompt} ` : ''}with Postgres schema, RBAC Auth, and CSV export`,
                  )
                }
                aria-label={isTh ? 'เพิ่มข้อกำหนดเทคนิค' : 'Attach technical spec'}
                title={isTh ? 'เพิ่มข้อกำหนดเทคนิค' : 'Attach technical spec'}
                className="w-8 h-8 rounded-lg bg-[#26282B] hover:bg-[#323438] border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>

              {/* Model Selector Pill */}
              <div
                role="group"
                aria-label="Select AI Model"
                className="inline-flex flex-wrap items-center p-0.5 rounded-xl bg-[#0D0E10] border border-white/10"
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelectModel('build-fast');
                    setAgentTier('standard');
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    selectedModel === 'build-fast'
                      ? 'bg-[#26282B] text-white border border-white/10'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Build AI Fast
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSelectModel('build-pro');
                    setAgentTier('pro');
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    selectedModel === 'build-pro'
                      ? 'bg-[#26282B] text-white border border-[#0066FF]/50'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>Build AI Pro (Reasoning)</span>
                  <span className="rounded-full bg-[#38BDF8]/15 border border-[#38BDF8]/35 px-1.5 py-0.5 text-[10px] font-mono text-[#38BDF8]">
                    1.5x
                  </span>
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  populateHeroPrompt(
                    isTh
                      ? 'สร้างเว็บแอปพลิเคชันจัดการโครงการทีมวิศวกรแบบเรียลไทม์พร้อม Kanban Board และ Dark UI'
                      : 'Build a real-time engineering sprint board with Kanban lanes and dark telemetry UI',
                  )
                }
                aria-label={isTh ? 'ป้อนคำสั่งตัวอย่างด้วยเสียง' : 'Dictate sample prompt'}
                title={isTh ? 'ป้อนคำสั่งตัวอย่าง' : 'Insert sample voice prompt'}
                className="w-8 h-8 rounded-lg bg-[#26282B] hover:bg-[#323438] border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span
                className="text-xs font-mono text-slate-400 tabular-nums whitespace-nowrap"
                data-testid="hero-estimated-cost"
              >
                Est. ~{formatTokenCount(estimatedTokens)} tokens
              </span>

              <button
                type="submit"
                className="cobalt-cta inline-flex items-center gap-2 rounded-xl px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white transition-all whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isTh ? 'กำลังสร้าง...' : 'Building...'}</span>
                  </>
                ) : (
                  <>
                    <span>{isTh ? 'ส่งคำสั่ง' : 'Build now'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Suggested Prompt Bar */}
        <div className="mt-4 max-w-3xl mx-auto rounded-2xl bg-[#141517]/95 border border-white/10 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pb-2.5 border-b border-white/8">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span className="font-semibold text-slate-200">
                {isTh ? 'ตัวอย่างคำสั่ง' : 'Prompt Ideas'}
              </span>
              <span className="text-slate-500">·</span>
              <span>{isTh ? 'สร้างโปรเจกต์จาก:' : 'Quick start with:'}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = autoPrompts[starterCycleIndex % autoPrompts.length];
                setStarterCycleIndex((i) => i + 1);
                populateHeroPrompt(next);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#00E5FF]/15 hover:bg-[#00E5FF]/25 border border-[#00E5FF]/35 px-3 py-1 text-[11px] font-semibold text-[#BDF4FF] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3 h-3 text-[#00E5FF]" />
              <span>{isTh ? 'แนะนำคำสั่งอัตโนมัติ' : 'Auto-Suggest Prompt'}</span>
            </button>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {quickChips.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => populateHeroPrompt(chip.prompt)}
                className="rounded-lg bg-[#1E2024] hover:bg-[#26282B] border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Category Tiles */}
        <div className="mt-4 max-w-xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
          {actionTiles.map((tile) => (
            <button
              key={tile.label}
              type="button"
              onClick={() => populateHeroPrompt(tile.prompt)}
              className="glass-panel rounded-xl py-3.5 px-3 flex flex-col items-center justify-center gap-2 hover:border-[#0066FF]/50 hover:bg-[#1B1D21] transition-colors cursor-pointer"
            >
              <span className="w-8 h-8 rounded-lg bg-[#0D0E10] border border-white/10 flex items-center justify-center">
                {tile.icon}
              </span>
              <span className="text-xs font-medium text-slate-200">{tile.label}</span>
            </button>
          ))}
        </div>

        {/* Import From Figma / GitHub / Existing App */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 text-xs text-slate-400">
          <span>{isTh ? 'หรือเริ่มทำจาก' : 'Or import from'}</span>
          <button
            type="button"
            onClick={() =>
              populateHeroPrompt(
                isTh
                  ? 'นำเข้า Design System จาก Figma พร้อม Tailwind CSS tokens และคอมโพเนนต์แบบ Responsive'
                  : 'Import Figma design tokens and generate responsive React + Tailwind components',
              )
            }
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#141517] hover:bg-[#26282B] border border-white/10 px-3 py-1.5 text-xs text-slate-200 transition-colors cursor-pointer"
          >
            <Figma className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>Figma</span>
          </button>
          <button
            type="button"
            onClick={() =>
              populateHeroPrompt(
                isTh
                  ? 'เชื่อมต่อ Repository จาก GitHub เพื่อปรับปรุง UI และเพิ่มฟีเจอร์ Realtime Dashboard'
                  : 'Connect an existing GitHub repository and scaffold an interactive analytics view',
              )
            }
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#141517] hover:bg-[#26282B] border border-white/10 px-3 py-1.5 text-xs text-slate-200 transition-colors cursor-pointer"
          >
            <Github className="w-3.5 h-3.5 text-white" />
            <span>GitHub</span>
          </button>
          <button
            type="button"
            onClick={() =>
              populateHeroPrompt(
                isTh
                  ? 'แปลงระบบเว็บเดิมให้เป็น Next.js + TypeScript พร้อม Dark Mode และ API Status Monitoring'
                  : 'Migrate a legacy frontend app into modern TypeScript + Tailwind with live monitoring',
              )
            }
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#141517] hover:bg-[#26282B] border border-white/10 px-3 py-1.5 text-xs text-slate-200 transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-[#3875F6]" />
            <span>{isTh ? 'ระบบเดิม' : 'Existing App'}</span>
          </button>
        </div>
      </section>

      {/* 2. 10 PROJECT TEMPLATES SECTION */}
      <section
        id="templates"
        className="max-w-[1440px] mx-auto px-4 sm:px-8 py-14 border-t border-white/10"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#141517] border border-white/10 px-3 py-1 text-[11px] font-medium text-[#38BDF8]">
              <Layers className="w-3 h-3" />
              {isTh ? 'พอร์ทัลนวัตกรรมเพื่ออนาคต' : 'Production Blueprints'}
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {isTh
                ? '10 ตัวอย่างโปรเจกต์ยอดนิยม พร้อมใช้งานทันที'
                : '10 Popular Ready-to-Ship Project Templates'}
            </h2>
            <p className="text-sm text-slate-400 mt-1.5 max-w-2xl">
              {isTh
                ? 'เลือกเทมเพลตที่ผ่านการทดสอบแล้วเพื่อเปิดต่อยอดเครื่องมือ หรือนำไปต่อยอดสร้างเว็บแอปของคุณได้ในคลิกเดียว'
                : 'Launch any battle-tested architecture straight into the workspace —'}{' '}
              <span className="font-mono text-[#38BDF8] tabular-nums ml-1">
                {formatTokenCount(estimatedTokens)} {isTh ? 'โทเค็น/ครั้ง' : 'tokens/build'}
              </span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div
              role="tablist"
              aria-label="Filter project templates by category"
              className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#141517] border border-white/10 self-start"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={category === cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    category === cat
                      ? 'bg-[#0066FF] text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onEnterWorkspace}
              className="text-xs font-medium text-[#38BDF8] hover:text-[#00E5FF] transition-colors whitespace-nowrap self-start sm:self-center cursor-pointer"
            >
              {isTh ? '• เปิดดูใน Workspace →' : '• Open Workspace →'}
            </button>
          </div>
        </div>

        {/* 2-Column Detailed Template Grid matching screen_c4da5645.png */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map((tpl) => (
            <article
              key={tpl.id}
              className="glass-panel rounded-2xl p-5 flex flex-col justify-between hover:border-[#0066FF]/50 transition-colors"
            >
              <div>
                {/* Top row: Category Pill + Icon */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center rounded-md bg-[#00E5FF]/10 border border-[#00E5FF]/25 px-2.5 py-0.5 text-[11px] font-medium text-[#38BDF8]">
                    {tpl.badge}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#0D0E10] border border-white/10 flex items-center justify-center">
                    {renderTemplateIcon(tpl.iconName)}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-semibold text-white leading-snug">
                  {isTh ? tpl.titleTh : tpl.title}
                </h3>

                {/* Recessed Dark Description Box */}
                <div className="mt-3 rounded-xl bg-[#0D0E10] border border-white/8 p-3.5">
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {isTh ? tpl.descriptionTh : tpl.description}
                  </p>
                </div>
              </div>

              {/* Footer: Stack Badges + Primary Action Button */}
              <div className="mt-4 pt-3 border-t border-white/8 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {tpl.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md bg-[#1D1F24] border border-white/10 px-2 py-0.5 text-[10px] font-mono text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => onStartBuild(isTh ? tpl.promptTh : tpl.prompt, tpl)}
                  className="cobalt-cta inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold text-white transition-all whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{isTh ? 'ใช้เทมเพลตนี้' : 'Use Template'}</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3. PARTNER LOGOS STRIP */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-12 border-t border-white/10 text-center">
        <p className="text-xs text-slate-400 mb-6">
          {isTh
            ? 'ได้รับการไว้วางใจจากทีมวิศวกรซอฟต์แวร์และผลิตภัณฑ์ชั้นนำทั่วโลก'
            : 'Trusted by software engineering and product teams worldwide'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-12 gap-y-4">
          {PARTNER_LOGOS.map((brand) => (
            <span
              key={brand}
              className="text-sm sm:text-base font-semibold tracking-tight text-slate-400/80 hover:text-slate-200 transition-colors select-none"
            >
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* 4. AI CODING AGENT SECTION */}
      <section
        id="agent"
        className="max-w-[1440px] mx-auto px-4 sm:px-8 py-14 border-t border-white/10"
      >
        <div className="max-w-2xl mb-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#141517] border border-white/10 px-3 py-1 text-[11px] font-medium text-[#38BDF8]">
            <Code2 className="w-3 h-3" />
            {isTh ? 'พัฒนางานสายโค้ด' : 'AI Engineering Suite'}
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
            {isTh
              ? 'ติดสปีดให้นักพัฒนา ด้วย AI Coding Agent ที่ทรงพลังที่สุด'
              : 'Accelerate every developer with our autonomous AI Coding Agent'}
          </h2>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            {isTh
              ? 'บิลด์ จัดการงานยากและละเอียดได้หลังบ้านให้คุณอย่างแม่นยำ เพื่อให้คุณโฟกัสกับไอเดียและสร้างสิ่งใหม่ได้เต็มที่'
              : 'Orchestrate multi-file state machines, automated test suites, and design systems cleanly.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Widget: Dynamic Model Selector */}
          <div className="lg:col-span-6 glass-panel rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <p className="text-[11px] font-mono text-[#38BDF8]">
                {isTh ? 'สถาปัตยกรรมอัตโนมัติระดับองค์กร' : 'Adaptive Multi-Model Routing'}
              </p>
              <h3 className="text-xl font-semibold text-white mt-1.5">
                {isTh ? 'โมเดลที่ดีที่สุด สำหรับทุกโจทย์งาน' : 'Best-fit model for every task'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                {isTh
                  ? 'Build สลับใช้โมเดลที่ทรงพลังที่สุดสำหรับแต่ละงานให้โดยอัตโนมัติ เพื่อสมดุลระหว่างคุณภาพ ความเร็ว และค่าใช้จ่าย'
                  : 'Switch seamlessly between Fast synthesis and Pro Reasoning for complex architectures.'}
              </p>
            </div>

            <div className="mt-6 rounded-xl bg-[#0D0E10] border border-white/10 p-4">
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/8">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <Cpu className="w-4 h-4 text-[#00E5FF]" />
                  <span>Build Agent</span>
                </div>
                <span className="rounded-md bg-[#1D1F24] border border-white/10 px-2 py-0.5 text-[10px] font-mono text-[#38BDF8]">
                  Dynamic v2.0
                </span>
              </div>

              {/* Interactive Tier Selector */}
              <div className="mt-3 grid grid-cols-3 gap-2 bg-[#141517] p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => handleSelectAgentTier('standard')}
                  className={`py-2 px-2 rounded-lg text-center transition-colors cursor-pointer ${
                    agentTier === 'standard'
                      ? 'bg-[#0066FF] text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="block text-xs font-semibold">Standard</span>
                  <span className="block text-[10px] opacity-80">
                    {isTh ? 'รวดเร็ว' : 'Fast'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectAgentTier('pro')}
                  className={`py-2 px-2 rounded-lg text-center transition-colors cursor-pointer ${
                    agentTier === 'pro'
                      ? 'bg-[#0066FF] text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="block text-xs font-semibold">Pro</span>
                  <span className="block text-[10px] opacity-80">
                    {isTh ? 'แข็งแกร่ง' : 'Reasoning'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectAgentTier('max')}
                  className={`py-2 px-2 rounded-lg text-center transition-colors cursor-pointer ${
                    agentTier === 'max'
                      ? 'bg-[#0066FF] text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="block text-xs font-semibold">Max</span>
                  <span className="block text-[10px] opacity-80">
                    {isTh ? 'สูงสุด' : 'Deep Spec'}
                  </span>
                </button>
              </div>

              {/* Live Metrics Bars */}
              <div className="mt-4 space-y-2.5 text-[11px]">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-400 w-24 shrink-0">
                    {isTh ? 'ความเร็ว' : 'Speed'}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-[#00E5FF] rounded-full transition-all"
                      style={{ width: tierMetrics.speed }}
                    />
                  </div>
                  <span className="font-mono text-slate-300 w-28 text-right tabular-nums">
                    {tierMetrics.speedLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-400 w-24 shrink-0">
                    {isTh ? 'ความฉลาด' : 'Reasoning'}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-[#3875F6] rounded-full transition-all"
                      style={{ width: tierMetrics.intel }}
                    />
                  </div>
                  <span className="font-mono text-slate-300 w-28 text-right tabular-nums">
                    {tierMetrics.intelLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-400 w-24 shrink-0">
                    {isTh ? 'ค่าใช้จ่ายต่อวัน' : 'Token Cost'}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-[#38BDF8] rounded-full transition-all"
                      style={{ width: tierMetrics.cost }}
                    />
                  </div>
                  <span className="font-mono text-slate-300 w-28 text-right tabular-nums">
                    {tierMetrics.costLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 98% Card + 1,000K Capacity Card */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="glass-panel rounded-2xl p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-white tabular-nums">98%</span>
                  <span className="text-lg font-semibold text-white">
                    {isTh ? 'ข้อผิดพลาดลดลง' : 'Fewer Runtime Errors'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  {isTh
                    ? 'Build ทดสอบ, รีแฟกเตอร์ และแก้ไขจุดบกพร่องอัตโนมัติ เพื่อให้คุณมั่นใจในทุกคลิกที่รัน'
                    : 'Automated TypeScript verification, lint checks, and browser assertions before deploy.'}
                </p>
              </div>

              <div className="mt-5 rounded-xl bg-[#0D0E10] border border-white/10 p-3.5">
                <div className="flex items-center justify-between gap-2 text-xs font-mono mb-2">
                  <span className="text-slate-300">test.auth.v1.ts</span>
                  <span className="inline-flex items-center gap-1 text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                    {isTh ? 'ผ่านการทดสอบ 28 รายการ' : '28 assertions passed'}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-[#0066FF] to-[#00E5FF] rounded-full" />
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <p className="text-[11px] font-mono text-[#38BDF8] flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                1,000K CAPACITY
              </p>
              <h3 className="text-lg font-semibold text-white mt-1.5">
                {isTh
                  ? 'รองรับโปรเจกต์ขนาดใหญ่ได้ไม่สะดุด'
                  : 'Large Monorepos Without Context Loss'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                {isTh
                  ? 'ขยายขีดความสามารถการจัดการโค้ดเบสขนาดใหญ่ถึง 1,000 เท่า ด้วยระบบจัดการบริบทขั้นสูง ทำให้แก้ไขทั้ง Monorepo ได้อย่างราบรื่น'
                  : 'Full-repository AST indexing lets Build AI Pro reason across hundreds of modules simultaneously.'}
              </p>
            </div>
          </div>

          {/* Full Width Banner: Design System & Figma Sync */}
          <div className="lg:col-span-12 glass-panel rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#0D0E10] border border-white/10 flex items-center justify-center shrink-0">
                <Palette className="w-5 h-5 text-[#00E5FF]" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  {isTh ? 'สร้างตามระบบดีไซน์ของแบรนด์' : 'Built Strictly To Your Brand Design System'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  {isTh
                    ? 'ไม่ต้องเริ่มจากศูนย์ เมื่อใช้ไลบรารีออกแบบอัจฉริยะด้วยการเชื่อมต่อโดยตรง Figma และ Tailwind'
                    : 'Never start from scratch — bind Figma Variables and Tailwind v4 design tokens directly.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                populateHeroPrompt(
                  isTh
                    ? 'เชื่อมต่อ Figma Design Tokens เพื่อสร้างคอมโพเนนต์ UI ของแบรนด์ด้วย Tailwind CSS'
                    : 'Connect Figma Design Tokens to synthesize branded React + Tailwind UI components',
                )
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#26282B] hover:bg-[#323438] border border-white/15 px-4 py-2 text-xs font-semibold text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-center"
            >
              <span>{isTh ? 'เชื่อมต่อ Figma Tokens' : 'Connect Figma Tokens'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. SCALE INFRASTRUCTURE SECTION */}
      <section
        id="scale"
        className="max-w-[1440px] mx-auto px-4 sm:px-8 py-14 border-t border-white/10"
      >
        <div className="max-w-2xl mx-auto text-center mb-10">
          <p className="text-[11px] font-mono text-[#38BDF8]">
            {isTh ? 'ขอบเขตงานระดับสเกล' : 'Full-Stack Infrastructure'}
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {isTh
              ? 'ทุกสิ่งที่คุณต้องใช้สำหรับสเกลโปรดักต์ รวมไว้ให้หมดแล้ว'
              : 'Everything you need to scale your product, built right in'}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
            {isTh
              ? 'ไม่ต้องเสียเวลาผูกระบบหลายที่ให้ยุ่ง Build จัดเตรียมเซิร์ฟเวอร์ โฮสติ้ง ฐานข้อมูล และการเชื่อมต่อพร้อมใช้งานทันที'
              : 'Skip manual DevOps stitching — databases, auth, SEO, and global edge hosting ship ready.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: <Database className="w-4 h-4 text-[#00E5FF]" />,
              title: isTh ? 'ฐานข้อมูลไร้ขีดจำกัด' : 'Limitless Databases',
              desc: isTh
                ? 'ติดตั้ง Postgres หรือ SQLite แบบ Serverless ได้ทันที พร้อมระบบอัปเดต Schema และการจัดการ Migration อัตโนมัติ'
                : 'Instant serverless Postgres with automated schema migrations and connection pooling.',
              meta: isTh ? 'แบ็กอัพอัตโนมัติ 100%' : '100% Automated Backups',
            },
            {
              icon: <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />,
              title: isTh ? 'ระบบผู้ใช้ & ยืนยันตัวตน' : 'Auth & User Roles',
              desc: isTh
                ? 'รองรับ OAuth, Passkeys, Magic Links และสิทธิ์การเข้าถึงระดับองค์กรที่รองรับมาตรฐานความปลอดภัย'
                : 'Built-in OAuth, Passkeys, Magic Links, and enterprise RBAC permissions.',
              meta: isTh ? 'พร้อมระบบ SAML & SCIM' : 'SAML & SCIM Ready',
            },
            {
              icon: <Search className="w-4 h-4 text-[#3875F6]" />,
              title: isTh ? 'ปรับแต่ง SEO ตั้งแต่แรก' : 'Technical SEO First',
              desc: isTh
                ? 'สร้างแท็ก OpenGraph อัตโนมัติ, สร้าง Sitemap และ Schema Markup อัจฉริยะ ให้ติดหน้าแรกด้วย Edge SSR'
                : 'Automatic OpenGraph tags, XML sitemaps, and Schema.org structured markup.',
              meta: isTh ? 'คะแนน Lighthouse 100/100' : '100/100 Lighthouse Score',
            },
            {
              icon: <Server className="w-4 h-4 text-[#00E5FF]" />,
              title: isTh ? 'โฮสติ้ง & วิเคราะห์ระบบ' : 'Edge Hosting & Telemetry',
              desc: isTh
                ? 'ดีพลอยขึ้นระบบ Edge CDN ระดับโลก พร้อมหน้าวิเคราะห์สถิติการเข้าชมเว็บแบบเรียลไทม์และแจ้งเตือนทันที'
                : 'Global Edge CDN deployment with real-time Web Vitals and uptime alerting.',
              meta: isTh ? '34 Edge Regions ทั่วโลก' : '34 Global Edge Regions',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="glass-panel rounded-2xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-[#0D0E10] border border-white/10 flex items-center justify-center mb-4">
                  {card.icon}
                </div>
                <h3 className="text-base font-semibold text-white">{card.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{card.desc}</p>
              </div>
              <p className="mt-5 pt-3 border-t border-white/8 text-[11px] font-mono text-[#38BDF8]">
                • {card.meta}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TEAM PERSONAS SECTION */}
      <section
        id="teams"
        className="max-w-[1440px] mx-auto px-4 sm:px-8 py-14 border-t border-white/10"
      >
        <div className="max-w-2xl mx-auto text-center mb-10">
          <p className="text-[11px] font-mono text-[#38BDF8]">
            {isTh ? 'ออกแบบมาเพื่อทุกบทบาท' : 'Built For Every Role'}
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {isTh ? 'Build มอบพลังวิเศษให้ทีมของคุณ' : 'Build gives superpowers to your whole team'}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            {isTh
              ? 'ตั้งแต่ไอเดียแรกจนถึงเปิดตัวใช้งานจริง Build ปรับตามสไตล์การทำงานของคุณ'
              : 'From first product sketch to live production deployment, tailored to how you ship.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {[
            {
              span: 'md:col-span-2',
              icon: <Layers className="w-4 h-4 text-[#00E5FF]" />,
              title: isTh
                ? 'ผู้จัดการผลิตภัณฑ์ (Product Managers)'
                : 'Product Managers',
              desc: isTh
                ? 'เปลี่ยนหน้าสเปกและข้อตกลงให้เป็นต้นแบบที่ใช้งานได้จริง ให้ทีมเห็นภาพตรงกันก่อนเริ่มเขียนโค้ด'
                : 'Turn PRDs into interactive clickable prototypes in minutes to align engineering early.',
            },
            {
              span: 'md:col-span-2',
              icon: <Rocket className="w-4 h-4 text-[#38BDF8]" />,
              title: isTh ? 'ผู้ประกอบการ (Entrepreneurs)' : 'Entrepreneurs',
              desc: isTh
                ? 'เปิดตัวธุรกิจและสินค้าออกสู่ตลาดในหลักวัน ไม่ใช่หลักเดือน รวบยอดต้นทุนไว้ในที่เดียว'
                : 'Launch revenue-ready MVPs in days instead of quarters with zero boilerplate overhead.',
            },
            {
              span: 'md:col-span-2',
              icon: <Megaphone className="w-4 h-4 text-[#3875F6]" />,
              title: isTh ? 'นักการตลาด (Marketers)' : 'Marketers',
              desc: isTh
                ? 'สร้างแคมเปญแลนดิงเพจและเครื่องมือคำนวณที่ปิดการขายสูง พร้อมระบบ SEO และการเชื่อมต่อข้อมูลส่วนตัว'
                : 'Ship high-converting interactive calculators and campaign microsites cleanly.',
            },
            {
              span: 'md:col-span-3',
              icon: <Users className="w-4 h-4 text-[#00E5FF]" />,
              title: isTh ? 'เอเจนซี (Agencies)' : 'Agencies',
              desc: isTh
                ? 'รับงานได้มากขึ้น ส่งมอบงานเร็วขึ้นเกิน 10 เท่า โชว์เว็บต้นแบบให้ลูกค้าปรับแก้ได้ทันใจ'
                : 'Deliver client web apps 10x faster with live browser previews and instant handoff.',
            },
            {
              span: 'md:col-span-3',
              icon: <Wrench className="w-4 h-4 text-[#38BDF8]" />,
              title: isTh
                ? 'นักพัฒนา & นักประดิษฐ์ (Builders)'
                : 'Engineers & Builders',
              desc: isTh
                ? 'สร้างระบบที่ซับซ้อนจากเทมเพลตมาตรฐาน เชื่อมต่อฐานข้อมูลและ API พร้อมส่งมอบสู่ผู้ใช้จริง'
                : 'Scaffold typed full-stack TypeScript modules with clean architecture ready to extend.',
            },
          ].map((persona) => (
            <div
              key={persona.title}
              className={`${persona.span} glass-panel rounded-2xl p-5 sm:p-6 flex items-start gap-4`}
            >
              <div className="w-9 h-9 rounded-xl bg-[#0D0E10] border border-white/10 flex items-center justify-center shrink-0">
                {persona.icon}
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-white">{persona.title}</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{persona.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. BOTTOM CTA SECTION */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-16 border-t border-white/10 text-center">
        <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
          {isTh
            ? 'พร้อมสร้างสิ่งมหัศจรรย์ไปด้วยกันหรือยัง?'
            : 'Ready to build something extraordinary?'}
        </h2>
        <p className="mt-2.5 text-sm text-slate-400">
          {isTh
            ? 'ทดลองใช้งานได้ฟรี และเริ่มสร้างเว็บแอปของคุณวันนี้'
            : 'Start free with 50,000 build tokens and launch your web app today.'}
        </p>

        <form
          onSubmit={handleBottomSubmit}
          className="mt-7 max-w-xl mx-auto rounded-2xl bg-[#141517] border border-white/15 p-1.5 flex items-center gap-2 focus-within:border-[#0066FF]"
        >
          <span className="pl-2.5 text-[#00E5FF]" aria-hidden="true">
            <Sparkles className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={bottomPrompt}
            onChange={(e) => setBottomPrompt(e.target.value)}
            aria-label={isTh ? 'อธิบายโปรเจกต์ที่ต้องการสร้าง' : 'Describe your project'}
            placeholder={
              isTh
                ? 'สร้างตลาดออนไลน์สำหรับขายงานศิลปะดิจิทัล...'
                : 'Build a digital art marketplace with live auctions...'
            }
            className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none py-2 px-1 min-w-0"
          />
          <button
            type="submit"
            className="cobalt-cta inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>{isTh ? 'เริ่มสร้าง' : 'Start Building'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#00E5FF]" />
            {isTh ? 'ได้เครดิตเริ่มต้นฟรี 50,000 โทเค็น' : '50,000 free starter tokens'}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#00E5FF]" />
            {isTh ? 'ไม่ต้องผูกบัตรเครดิต' : 'No credit card required'}
          </span>
        </div>
      </section>

      {/* 8. MULTI-COLUMN FOOTER */}
      <footer className="border-t border-white/10 bg-[#0A0A0B]/90 pt-12 pb-8 px-4 sm:px-8">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pb-10 border-b border-white/10 text-xs">
            <div>
              <h3 className="font-semibold text-white mb-3">
                {isTh ? 'ผลิตภัณฑ์' : 'Product'}
              </h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#top" className="hover:text-white transition-colors">
                    {isTh ? 'สร้างเว็บด้วย AI' : 'AI App Builder'}
                  </a>
                </li>
                <li>
                  <a href="#templates" className="hover:text-white transition-colors">
                    {isTh ? 'เทมเพลตพร้อมใช้' : 'Project Templates'}
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onEnterWorkspace}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {isTh ? 'ห้องทดลอง Workspace' : 'Live Workspace'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onOpenPricing}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {isTh ? 'แพ็กเกจและราคา' : 'Pricing & Credits'}
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-3">
                {isTh ? 'แหล่งเรียนรู้' : 'Resources'}
              </h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#agent" className="hover:text-white transition-colors">
                    {isTh ? 'สถาปัตยกรรม Agent' : 'Agent Architecture'}
                  </a>
                </li>
                <li>
                  <a href="#scale" className="hover:text-white transition-colors">
                    {isTh ? 'เอกสารโครงสร้างพื้นฐาน' : 'Cloud & DB Docs'}
                  </a>
                </li>
                <li>
                  <a href="#teams" className="hover:text-white transition-colors">
                    {isTh ? 'คู่มือสำหรับทีม' : 'Team Playbooks'}
                  </a>
                </li>
                <li>
                  <a href="#templates" className="hover:text-white transition-colors">
                    {isTh ? 'คลังตัวอย่างโค้ด' : 'Code Examples'}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-3">
                {isTh ? 'บริษัท' : 'Company'}
              </h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#teams" className="hover:text-white transition-colors">
                    {isTh ? 'ร่วมงานกับเรา' : 'Careers'}
                  </a>
                </li>
                <li>
                  <a href="#scale" className="hover:text-white transition-colors">
                    {isTh ? 'ความปลอดภัยระดับองค์กร' : 'Enterprise Security'}
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onOpenPricing}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {isTh ? 'แพ็กเกจองค์กร' : 'Enterprise Plans'}
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-3">
                {isTh ? 'เชื่อมต่อ' : 'Connect'}
              </h3>
              <div className="flex items-center gap-2 mb-3">
                <a
                  href="#top"
                  aria-label="GitHub"
                  className="w-8 h-8 rounded-lg bg-[#141517] border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-white/25 transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="#agent"
                  aria-label="Developer Console"
                  className="w-8 h-8 rounded-lg bg-[#141517] border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-white/25 transition-colors"
                >
                  <Terminal className="w-4 h-4" />
                </a>
                <a
                  href="#templates"
                  aria-label="Code Templates"
                  className="w-8 h-8 rounded-lg bg-[#141517] border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-white/25 transition-colors"
                >
                  <Code2 className="w-4 h-4" />
                </a>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isTh
                  ? 'ขับเคลื่อนด้วยเทคโนโลยี WebContainers และ AI Agent อัจฉริยะ'
                  : 'Powered by browser-native sandboxes and autonomous AI Agents.'}
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div className="flex flex-wrap items-center gap-3">
              <BuildLogo size="sm" />
              <span>© 2026 Build.new · All rights reserved.</span>
            </div>
            <div className="flex items-center gap-5">
              <a href="#top" className="hover:text-slate-300 transition-colors">
                {isTh ? 'ความเป็นส่วนตัว' : 'Privacy'}
              </a>
              <a href="#scale" className="hover:text-slate-300 transition-colors">
                {isTh ? 'เงื่อนไขบริการ' : 'Terms'}
              </a>
              <a href="#agent" className="hover:text-slate-300 transition-colors">
                {isTh ? 'สถานะระบบ' : 'Status'}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
