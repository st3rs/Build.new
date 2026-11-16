import type { GeneratedFile, LanguageCode, ProjectTemplate, WorkspaceProject } from '../types/builder';
import { synthesizeInteractiveApp } from '../utils/appSynthesizer';

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'tpl-ai-crm',
    badge: 'SaaS & CRM',
    title: 'AI CRM Lead Scoring & Pipeline',
    titleTh: 'ระบบ AI CRM จัดการลูกค้า & โฟกัสโอกาสขาย',
    category: 'SaaS & Data',
    description:
      'Build an AI-assisted CRM with automatic lead scoring, domain enrichment, CSV import, Kanban deal pipeline, and OpenAI email drafting.',
    descriptionTh:
      'สร้างแพลตฟอร์ม AI CRM ที่สามารถดึงข้อมูลและให้คะแนน Lead อัตโนมัติ, แสดงตำแหน่งและบริบทจากโดเมน, นำเข้าไฟล์ CSV, บอร์ด Kanban ปรับแต่งได้ และเขียนอีเมลติดตามผลด้วย OpenAI API',
    prompt:
      'Build an AI CRM platform with automatic lead scoring, domain enrichment, CSV import, customizable Kanban pipeline, and OpenAI follow-up email composer.',
    promptTh:
      'สร้างแพลตฟอร์ม AI CRM ที่ให้คะแนน Lead อัตโนมัติ นำเข้า CSV พร้อมบอร์ด Kanban และเขียนอีเมลติดตามผลด้วย OpenAI API',
    stack: ['Next.js 14', 'Postgres', 'OpenAI'],
    accentColor: '#0066FF',
    iconName: 'chart',
    previewTitle: 'AI CRM Lead Pipeline',
    previewMetrics: [
      { label: 'Qualified Leads', value: '1,492', delta: '+18.4%' },
      { label: 'Win Probability', value: '68.5%', delta: '+4.2%' },
      { label: 'Pipeline Value', value: '$482,000', delta: '+$46K' },
    ],
    generatedFiles: [
      {
        path: 'src/App.tsx',
        language: 'tsx',
        content: `import { PipelineBoard } from './components/PipelineBoard';
import { LeadScoreTable } from './components/LeadScoreTable';

export default function App() {
  return (
    <main className="min-h-screen bg-[#202124] text-slate-100 p-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">AI CRM Pipeline</h1>
          <p className="text-sm text-slate-400">Automated lead enrichment and OpenAI outreach</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-[#0066FF] text-sm font-medium text-white">
          Import CSV
        </button>
      </header>
      <PipelineBoard />
      <LeadScoreTable />
    </main>
  );
}`,
      },
      {
        path: 'src/data/leads.ts',
        language: 'ts',
        content: `export const LEADS = [
  { company: 'Acme Cloud', score: 94, stage: 'Proposal', arr: '$48,000' },
  { company: 'Kinetix AI', score: 89, stage: 'Negotiation', arr: '$72,000' },
  { company: 'Vanguard Ops', score: 82, stage: 'Qualified', arr: '$31,500' },
];`,
      },
    ],
  },
  {
    id: 'tpl-b2b-stripe',
    badge: 'การเงิน & การชำระเงิน',
    title: 'B2B Stripe Subscription Billing',
    titleTh: 'ระบบ B2B สมัครสมาชิกรายเดือนผ่าน Stripe',
    category: 'SaaS & Data',
    description:
      'SaaS subscription starter for B2B teams with Stripe Customer Portal, Webhook sync, seat-based billing, usage metering, and MRR ledger.',
    descriptionTh:
      'สร้างจุดเริ่มต้นระบบ SaaS สำหรับธุรกิจ B2B พร้อมหน้าลูกค้า Portal ของ Stripe, ซิงค์ Webhook สมบูรณ์แบบ, ระบบจำกัดสิทธิ์ตามแพ็กเกจ, ตัววัดปริมาณการใช้งาน และตารางยอดรายได้แบบละเอียด',
    prompt:
      'Create a B2B SaaS subscription billing engine with Stripe Customer Portal, webhook sync, tiered seat entitlements, and detailed MRR analytics.',
    promptTh:
      'สร้างระบบสมัครสมาชิกรายเดือน B2B พร้อม Stripe Customer Portal, Webhook sync, ตัววัดปริมาณการใช้งาน และตารางรายได้ MRR',
    stack: ['Stripe SDK', 'Prisma', 'Tailwind'],
    accentColor: '#3875F6',
    iconName: 'wallet',
    previewTitle: 'B2B Billing & Revenue Engine',
    previewMetrics: [
      { label: 'Net MRR', value: '$184,240', delta: '+14.2%' },
      { label: 'Active Orgs', value: '348', delta: '+24' },
      { label: 'Webhook SLA', value: '99.98%', delta: 'Synced' },
    ],
    generatedFiles: [
      {
        path: 'src/App.tsx',
        language: 'tsx',
        content: `export default function BillingConsole() {
  return (
    <div className="min-h-screen bg-[#202124] text-white p-8">
      <h1 className="text-2xl font-semibold">Stripe B2B Customer Portal</h1>
      <p className="text-sm text-slate-400 mt-2">Seat metering, invoices, and webhook audit log.</p>
    </div>
  );
}`,
      },
    ],
  },
  {
    id: 'tpl-kanban-realtime',
    badge: 'Productivity',
    title: 'Real-Time Sprint Kanban Board',
    titleTh: 'บอร์ด Kanban แยกตามช่องทำงานแบบเรียลไทม์',
    category: 'SaaS & Data',
    description:
      'Agile sprint board with drag-and-drop cards, live teammate cursors, instant notifications, Markdown specs, and WebSocket state sync.',
    descriptionTh:
      'สร้างโปรเจกต์สไตล์ Agile ตารางการแบ่งงานที่ได้ทั้งทีม, ลบแก้ไขการ์ดได้, แสดงผู้มีส่วนร่วม, แสดงความคิดเห็นแบบเรียลไทม์, เช็กลิสต์ร่วมกับ Markdown และจัดเรียงผ่าน WebSocket ทันที',
    prompt:
      'Build a real-time collaborative Kanban sprint board with drag-and-drop swimlanes, Markdown checklist items, and WebSocket sync.',
    promptTh:
      'สร้างบอร์ด Kanban จัดการงาน Agile แบบเรียลไทม์ ลากวางการ์ด เช็กลิสต์ Markdown และซิงค์ผ่าน WebSocket',
    stack: ['WebSockets', 'dnd-kit', 'Zustand'],
    accentColor: '#0066FF',
    iconName: 'layers',
    previewTitle: 'Cycle 24 Sprint Board',
    previewMetrics: [
      { label: 'Sprint Velocity', value: '64 pts', delta: '+12 pts' },
      { label: 'Live Editors', value: '14', delta: 'Synced' },
      { label: 'PR Merge Time', value: '1.8 hrs', delta: '-24%' },
    ],
    generatedFiles: [
      {
        path: 'src/App.tsx',
        language: 'tsx',
        content: `export default function SprintBoard() {
  const columns = ['Backlog', 'In Progress', 'In Review', 'Done'];
  return (
    <div className="min-h-screen bg-[#202124] text-slate-100 p-6 grid grid-cols-4 gap-4">
      {columns.map(col => (
        <div key={col} className="rounded-xl bg-[#141517] border border-white/10 p-4">
          <h3 className="text-xs font-mono text-slate-400 mb-3">{col}</h3>
        </div>
      ))}
    </div>
  );
}`,
      },
    ],
  },
  {
    id: 'tpl-supabase-commerce',
    badge: 'E-Commerce',
    title: 'Multi-Vendor Supabase Marketplace',
    titleTh: 'ตลาดออนไลน์หลายร้านค้าด้วย Supabase',
    category: 'Commerce & Media',
    description:
      'Multi-seller marketplace with storefront catalog, cart & checkout, product reviews, real-time inventory stock, and vendor payout console.',
    descriptionTh:
      'สร้างแพลตฟอร์มจัดการอีคอมเมิร์ซพร้อมหน้าร้านของคู่ค้า, ตะกร้าและขั้นตอนชำระเงิน, ระบบรีวิวและให้คะแนนสินค้า, แจ้งเตือนสินค้าใกล้หมดสต็อก และระบบตั้งราคาสินค้าแบบกำหนดภาษี',
    prompt:
      'Design a multi-vendor e-commerce marketplace powered by Supabase RLS with cart drawer, stock alerts, and vendor tax rules.',
    promptTh:
      'สร้างตลาดออนไลน์หลายร้านค้าด้วย Supabase พร้อมตะกร้าสินค้า ระบบรีวิว แจ้งเตือนสต็อก และคำนวณภาษี',
    stack: ['Postgres RLS', 'Next.js', 'Tailwind'],
    accentColor: '#00E5FF',
    iconName: 'globe',
    previewTitle: 'Supabase Vendor Marketplace',
    previewMetrics: [
      { label: 'Conversion Rate', value: '4.62%', delta: '+0.8%' },
      { label: 'Active Vendors', value: '128', delta: '+14' },
      { label: 'In-Stock SKUs', value: '2,480', delta: 'Live RLS' },
    ],
    generatedFiles: [
      {
        path: 'src/App.tsx',
        language: 'tsx',
        content: `import { useState } from 'react';

export default function Marketplace() {
  const [cartCount, setCartCount] = useState(2);
  return (
    <div className="min-h-screen bg-[#202124] text-white p-8">
      <nav className="flex justify-between items-center pb-6 border-b border-white/10">
        <span className="font-semibold tracking-tight text-lg">MARKETPLACE</span>
        <button onClick={() => setCartCount(c => c + 1)} className="px-4 py-2 rounded-lg bg-[#0066FF] text-sm">
          Cart ({cartCount})
        </button>
      </nav>
    </div>
  );
}`,
      },
    ],
  },
  {
    id: 'tpl-remotion-video',
    badge: 'AI Creative',
    title: 'AI Video Script Studio (Remotion)',
    titleTh: 'ระบบสร้างวิดีโอสคริปต์ AI ด้วย Remotion',
    category: 'AI & DevTools',
    description:
      'Short-form AI video composer turning scripts into animated captions, ElevenLabs voiceovers, and Remotion cloud MP4 renders.',
    descriptionTh:
      'สร้างแอปแปลงบทความยาวเป็นวิดีโอสั้นได้ทันที, ปรับแต่งสคริปต์และซับไตเติล, พากย์เสียง AI สมจริง, บอกรับสไตลิสต์อัตโนมัติ และเรนเดอร์ไฟล์วิดีโอแบบคลิกเดียวจบลงเลย',
    prompt:
      'Build an AI video studio using Remotion and ElevenLabs to convert articles into short-form vertical videos with dynamic captions.',
    promptTh:
      'สร้างระบบแปลงบทความและสคริปต์เป็นวิดีโอสั้น AI ด้วย Remotion และพากย์เสียงอัตโนมัติพร้อมเรนเดอร์',
    stack: ['Remotion', 'ElevenLabs', 'React'],
    accentColor: '#00E5FF',
    iconName: 'terminal',
    previewTitle: 'Remotion AI Video Pipeline',
    previewMetrics: [
      { label: 'Render Speed', value: '4.2x', delta: 'Cloud GPU' },
      { label: 'Voice Presets', value: '28', delta: 'Multilingual' },
      { label: 'Clips Exported', value: '3,910', delta: '+19%' },
    ],
    generatedFiles: [
      {
        path: 'src/App.tsx',
        language: 'tsx',
        content: `export default function VideoStudio() {
  return (
    <div className="min-h-screen bg-[#202124] text-white p-6 grid grid-cols-12 gap-6">
      <section className="col-span-5 rounded-xl border border-white/10 bg-[#141517] p-5">
        <h2 className="text-sm font-mono text-cyan-300 mb-3">AI SCRIPT TIMELINE</h2>
        <textarea className="w-full h-48 bg-[#0D0E10] rounded-lg p-3 text-sm font-mono" />
      </section>
      <section className="col-span-7 rounded-xl border border-white/10 bg-[#141517] p-5">
        <h2 className="text-sm font-mono text-blue-300 mb-3">REMOTION CANVAS PREVIEW</h2>
      </section>
    </div>
  );
}`,
      },
    ],
  },
  {
    id: 'tpl-wealth-tracker',
    badge: 'การเงินส่วนบุคคล',
    title: 'Personal Finance & Wealth Tracker',
    titleTh: 'แดชบอร์ดติดตามการเงินและการลงทุน',
    category: 'SaaS & Data',
    description:
      'Personal net-worth cockpit tracking monthly cashflow, recurring subscriptions, tax estimates, and multi-currency investment holdings.',
    descriptionTh:
      'สร้างแอปวัดกระแสเงินสดเพื่อพักผ่อนการเงินพอร์ตการลงทุน, จัดตารางค่าใช้จ่ายรายเดือน, คำนวณภาษีเบื้องต้น, หารยอดเงินออม และรองรับหลายสกุลเงิน',
    prompt:
      'Create a personal finance and portfolio tracker with cashflow charts, monthly expense breakdown, savings goals, and multi-currency FX.',
    promptTh:
      'สร้างแดชบอร์ดติดตามกระแสเงินสด การลงทุน คำนวณภาษี เป้าหมายเงินออม และรองรับหลายสกุลเงิน',
    stack: ['Recharts', 'TypeScript', 'Zustand'],
    accentColor: '#3875F6',
    iconName: 'palette',
    previewTitle: 'Wealth & Cashflow Cockpit',
    previewMetrics: [
      { label: 'Net Portfolio', value: '$428,900', delta: '+11.6%' },
      { label: 'Monthly Savings', value: '38.4%', delta: '+4.1%' },
      { label: 'Currencies', value: '5', delta: 'THB / USD' },
    ],
    generatedFiles: [
      {
        path: 'src/App.tsx',
        language: 'tsx',
        content: `export default function WealthDashboard() {
  return (
    <div className="min-h-screen bg-[#202124] text-white p-8">
      <h1 className="text-xl font-semibold">Portfolio & Multi-Currency Cashflow</h1>
    </div>
  );
}`,
      },
    ],
  },
  {
    id: 'tpl-telemedicine',
    badge: 'สุขภาพ & การแพทย์',
    title: 'Telemedicine Booking & Video Consult',
    titleTh: 'ระบบจองคิวและพบแพทย์ออนไลน์ทางไกล',
    category: 'Commerce & Media',
    description:
      'Clinic scheduling and WebRTC telehealth portal with digital intake forms, SMS appointment reminders, and encrypted e-prescriptions.',
    descriptionTh:
      'สร้างระบบนัดหมายปรึกษาแพทย์ทางไกลผ่านระบบวิดีโอคอนเฟอเรนซ์, ฟอร์มซักประวัติก่อนตรวจ, ระบบแจ้งเตือนทาง SMS และบันทึกเวชระเบียนที่ปลอดภัย',
    prompt:
      'Build a telemedicine appointment and WebRTC consultation portal with digital intake forms, SMS reminders, and clinical notes.',
    promptTh:
      'สร้างระบบจองคิวและพบแพทย์ทางไกลผ่านวิดีโอ ฟอร์มซักประวัติ ระบบแจ้งเตือน SMS และบันทึกเวชระเบียน',
    stack: ['WebRTC', 'React Hook Form', 'FullCalendar'],
    accentColor: '#0066FF',
    iconName: 'ticket',
    previewTitle: 'Telehealth Clinic Portal',
    previewMetrics: [
      { label: 'Daily Consults', value: '184', delta: '98% On-Time' },
      { label: 'Active Doctors', value: '26', delta: 'Online' },
      { label: 'SMS Reminders', value: '1,420', delta: 'Delivered' },
    ],
    generatedFiles: [
      {
        path: 'src/App.tsx',
        language: 'tsx',
        content: `export default function TelemedicinePortal() {
  return (
    <div className="min-h-screen bg-[#202124] text-white p-8">
      <h1 className="text-2xl font-semibold">Telemedicine Clinic & WebRTC Consults</h1>
    </div>
  );
}`,
      },
    ],
  },
  {
    id: 'tpl-real-estate-360',
    badge: 'อสังหาริมทรัพย์',
    title: '360° Real Estate Discovery Portal',
    titleTh: 'พอร์ทัลค้นหาบ้านและทัวร์เสมือนจริง',
    category: 'Commerce & Media',
    description:
      'Interactive property map explorer with neighborhood price heatmaps, mortgage calculator, tour booking, and 360° virtual walkthroughs.',
    descriptionTh:
      'สร้างโอกาสหรือเครือข่ายอสังหาริมทรัพย์แบบปักหมุดแผนที่อัปเดต, แสดงผลเรื่องความคุ้มค่า, เครื่องคำนวณเงินกู้, ระบบนัดหมายเข้าชมสถานที่จริง และมุมมองภาพ 360 องศา',
    prompt:
      'Design a 360-degree real estate discovery portal with Mapbox pin clustering, mortgage calculator, and scheduled tour booking.',
    promptTh:
      'สร้างพอร์ทัลอสังหาริมทรัพย์ปักหมุดแผนที่ เครื่องคำนวณสินเชื่อ ระบบนัดชมสถานที่ และภาพ 360 องศา',
    stack: ['Mapbox GL', 'Next.js', 'Postgres'],
    accentColor: '#00E5FF',
    iconName: 'book',
    previewTitle: '360° Property Explorer',
    previewMetrics: [
      { label: 'Verified Listings', value: '3,412', delta: 'Mapbox GL' },
      { label: '360° Tours', value: '890', delta: 'HDReady' },
      { label: 'Avg Match Time', value: '4.2 min', delta: '-35%' },
    ],
    generatedFiles: [
      {
        path: 'src/App.tsx',
        language: 'tsx',
        content: `export default function RealEstatePortal() {
  return (
    <div className="min-h-screen bg-[#202124] text-white p-8">
      <h1 className="text-2xl font-semibold">360° Real Estate Map & Mortgage Planner</h1>
    </div>
  );
}`,
      },
    ],
  },
  {
    id: 'tpl-api-status',
    badge: 'เครื่องมือพัฒนา',
    title: 'API Health Telemetry & Status Page',
    titleTh: 'ระบบตรวจวัดสถานะ API & หน้า Status Page',
    category: 'AI & DevTools',
    description:
      'Synthetic HTTP monitor polling endpoints every 60 seconds with p95 latency sparklines, uptime bars, and public incident timelines.',
    descriptionTh:
      'สร้างระบบมอนิเตอร์การทำงานที่ส่งคำขอเช็ก HTTP ทุก 60 วินาที, บันทึกการวิเคราะห์ผลเรียลไทม์, แสดงกราฟแท่งประวัติความเสถียร และเผยแพร่หน้าสถานะสู่สาธารณะ',
    prompt:
      'Create an API uptime telemetry monitor and public status page checking HTTP endpoints every 60s with p95 response latency charts.',
    promptTh:
      'สร้างระบบตรวจวัดสถานะ API ส่งเช็ก HTTP ทุก 60 วินาที กราฟความเสถียร และหน้า Status Page สาธารณะ',
    stack: ['Web Workers', 'SQLite', 'Tailwind'],
    accentColor: '#3875F6',
    iconName: 'activity',
    previewTitle: 'Edge API Status Telemetry',
    previewMetrics: [
      { label: 'Global p95', value: '38 ms', delta: '-6 ms' },
      { label: 'Uptime 90d', value: '99.99%', delta: 'Operational' },
      { label: 'Checked Nodes', value: '24', delta: '60s Poll' },
    ],
    generatedFiles: [
      {
        path: 'src/App.tsx',
        language: 'tsx',
        content: `export default function StatusPage() {
  return (
    <div className="min-h-screen bg-[#202124] text-white p-6">
      <h1 className="text-xl font-semibold">API Telemetry & Public Status — All Systems Operational</h1>
    </div>
  );
}`,
      },
    ],
  },
  {
    id: 'tpl-edtech-gamified',
    badge: 'EdTech & AI',
    title: 'Gamified Language Learning Studio',
    titleTh: 'แอปเรียนภาษาแบบเกมมิฟิเคชัน',
    category: 'AI & DevTools',
    description:
      'Interactive flashcard and pronunciation studio with Web Speech scoring, daily streaks, XP leaderboards, and spaced-repetition decks.',
    descriptionTh:
      'สร้างแอปพลิเคชันคำศัพท์และแบบทดสอบจำลองสถานการณ์, ฝึกพูดโต้ตอบต่อเนื่อง (Streak), ระบบสะสมดาว XP, ตารางอันดับคะแนนเพื่อนร่วมห้อง และกราฟพัฒนาวัย',
    prompt:
      'Build a gamified language learning web app with Web Speech pronunciation checks, XP streaks, leaderboards, and animated flashcards.',
    promptTh:
      'สร้างแอปเรียนภาษาแบบเกมมิฟิเคชัน ฝึกพูดโต้ตอบด้วย Web Speech สะสม XP และตารางอันดับคะแนน',
    stack: ['Web Speech', 'Framer Motion', 'Supabase'],
    accentColor: '#0066FF',
    iconName: 'file',
    previewTitle: 'Fluency XP Learning Hub',
    previewMetrics: [
      { label: 'Daily Streaks', value: '14 Days', delta: '+350 XP' },
      { label: 'Speech Accuracy', value: '94.2%', delta: '+6.4%' },
      { label: 'Active Learners', value: '8,410', delta: '+412' },
    ],
    generatedFiles: [
      {
        path: 'src/App.tsx',
        language: 'tsx',
        content: `export default function LanguageStudio() {
  return (
    <div className="min-h-screen bg-[#202124] text-white p-8">
      <h1 className="text-2xl font-semibold">Gamified Language Learning Studio</h1>
    </div>
  );
}`,
      },
    ],
  },
];

export function buildProjectFromPrompt(
  prompt: string,
  template?: ProjectTemplate,
  lang: LanguageCode = 'th',
): WorkspaceProject {
  const cleanPrompt = prompt.trim();
  const synthesized = synthesizeInteractiveApp({
    prompt: cleanPrompt || (template ? (lang === 'th' ? template.promptTh : template.prompt) : ''),
    template,
    lang,
  });

  if (template) {
    return {
      id: `proj-${Date.now()}`,
      name: lang === 'th' ? template.titleTh : template.title,
      prompt: cleanPrompt || (lang === 'th' ? template.promptTh : template.prompt),
      category: template.category,
      previewTitle: template.previewTitle,
      previewHtml: synthesized.previewHtml,
      previewMetrics: template.previewMetrics,
      files: [
        {
          path: 'index.html',
          language: 'html',
          content: synthesized.previewHtml,
        },
        ...template.generatedFiles,
      ],
      messages: [],
      iterationCount: 0,
    };
  }

  const shortTitle =
    cleanPrompt.length > 42
      ? `${cleanPrompt.slice(0, 39).trim()}...`
      : cleanPrompt || (lang === 'th' ? 'โปรเจกต์ AI ที่สร้างใหม่' : 'Custom AI Application');

  const customFiles: GeneratedFile[] = [
    {
      path: 'index.html',
      language: 'html',
      content: synthesized.previewHtml,
    },
    {
      path: 'src/App.tsx',
      language: 'tsx',
      content: `import { useState } from 'react';

export default function GeneratedApp() {
  const [filter, setFilter] = useState<'all' | 'active'>('all');

  return (
    <div className="min-h-screen bg-[#202124] text-slate-100 p-8">
      <header className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">${shortTitle.replace(/'/g, '')}</h1>
          <p className="text-sm text-slate-400 mt-1">Generated by Build.new software canvas</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className="px-3 py-1.5 rounded-lg bg-[#0066FF] text-xs font-medium text-white"
          >
            All Items
          </button>
          <button
            onClick={() => setFilter('active')}
            className="px-3 py-1.5 rounded-lg border border-white/10 text-xs font-medium text-slate-300"
          >
            Active ({filter})
          </button>
        </div>
      </header>
      <section className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-white/10 bg-[#141517] p-5">
          <p className="text-xs font-mono text-slate-400">THROUGHPUT</p>
          <p className="text-2xl font-semibold mt-2 tabular-nums">99.4%</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#141517] p-5">
          <p className="text-xs font-mono text-slate-400">LATENCY P95</p>
          <p className="text-2xl font-semibold mt-2 tabular-nums">42 ms</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#141517] p-5">
          <p className="text-xs font-mono text-slate-400">ACTIVE SESSIONS</p>
          <p className="text-2xl font-semibold mt-2 tabular-nums">1,284</p>
        </div>
      </section>
    </div>
  );
}`,
    },
    {
      path: 'src/index.css',
      language: 'css',
      content: `@import "tailwindcss";

:root {
  color-scheme: dark;
  --accent-primary: #0066FF;
  --accent-secondary: #00E5FF;
}`,
    },
  ];

  return {
    id: `proj-${Date.now()}`,
    name: shortTitle,
    prompt: cleanPrompt,
    category: 'AI & DevTools',
    previewTitle: synthesized.title,
    previewHtml: synthesized.previewHtml,
    previewMetrics: synthesized.metrics,
    files: customFiles,
    messages: [],
    iterationCount: 0,
  };
}
