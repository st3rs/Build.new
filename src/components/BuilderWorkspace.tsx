import { useEffect, useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Code2,
  Copy,
  Cpu,
  Download,
  Eye,
  FolderTree,
  Loader2,
  Monitor,
  RefreshCw,
  Rocket,
  Smartphone,
} from 'lucide-react';
import type { AIModelId, AuthUser, PlanTier, WorkspaceProject } from '../types/builder';
import { AI_REQUEST_TIMEOUT_MS, resolveModelConfig } from '../utils/aiConfig';
import { calculateTokenCost, formatTokenCount } from '../utils/tokenEngine';
import { BuildLogo } from './BuildLogo';
import { CreditBadge } from './CreditBadge';
import { UserProfileMenu } from './UserProfileMenu';

interface BuilderWorkspaceProps {
  project: WorkspaceProject;
  user: AuthUser | null;
  plan: PlanTier;
  credits: number;
  selectedModel: AIModelId;
  isGenerating?: boolean;
  generatingModel?: AIModelId;
  generationStartedAt?: number | null;
  onSelectModel: (model: AIModelId) => void;
  onSendIteration: (instruction: string) => void;
  onBackToLanding: () => void;
  onOpenAuth: (tab: 'signin' | 'signup') => void;
  onOpenPricing: () => void;
  onResetCredits: () => void;
  onSignOut: () => void;
}

export function BuilderWorkspace({
  project,
  user,
  plan,
  credits,
  selectedModel,
  isGenerating = false,
  generatingModel,
  generationStartedAt,
  onSelectModel,
  onSendIteration,
  onBackToLanding,
  onOpenAuth,
  onOpenPricing,
  onResetCredits,
  onSignOut,
}: BuilderWorkspaceProps) {
  const [instruction, setInstruction] = useState('');
  const [inputError, setInputError] = useState('');
  const [rightTab, setRightTab] = useState<'preview' | 'code' | 'files'>('preview');
  const [activeFilePath, setActiveFilePath] = useState(project.files[0]?.path ?? 'index.html');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');
  const [previewNonce, setPreviewNonce] = useState(0);
  const [deployConfirmed, setDeployConfirmed] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    if (!isGenerating) {
      setElapsedMs(0);
      return;
    }
    const start = generationStartedAt ?? Date.now();
    setElapsedMs(Math.max(0, Date.now() - start));
    const timer = window.setInterval(() => {
      setElapsedMs(Math.max(0, Date.now() - start));
    }, 200);
    return () => window.clearInterval(timer);
  }, [isGenerating, generationStartedAt]);

  const activeGenConfig = resolveModelConfig(generatingModel ?? selectedModel);
  const timeoutSec = Math.round(AI_REQUEST_TIMEOUT_MS / 1000);
  const elapsedSec = Math.min(timeoutSec, elapsedMs / 1000);
  const progressPct = isGenerating
    ? Math.min(95, Math.max(12, Math.round(12 + 83 * (1 - Math.exp(-elapsedMs / 9000)))))
    : 100;
  const progressStage =
    elapsedSec < 2.5
      ? 'Analyzing requirements & schema...'
      : elapsedSec < 9
        ? `Writing interactive code (${activeGenConfig.model} · Thinking ${activeGenConfig.thinkingLevel})...`
        : 'Refining layout, state handlers & live preview...';

  const iterationCost = calculateTokenCost('iteration', selectedModel);
  const currentFile =
    project.files.find((f) => f.path === activeFilePath) ?? project.files[0];

  function submitIteration() {
    if (!instruction.trim()) {
      setInputError('Describe a change or feature to iterate on.');
      return;
    }
    setInputError('');
    onSendIteration(instruction.trim());
    setInstruction('');
  }

  function handleIterate(e: FormEvent) {
    e.preventDefault();
    submitIteration();
  }

  function handleCopyCode() {
    if (!currentFile) return;
    navigator.clipboard?.writeText(currentFile.content).catch(() => {});
    setCopiedPath(currentFile.path);
    window.setTimeout(() => setCopiedPath(null), 1600);
  }

  function handleDownloadHtml() {
    const blob = new Blob([project.previewHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen obsidian-backdrop text-white flex flex-col">
      {/* Workspace Header */}
      <header className="h-16 border-b border-white/10 bg-[#0A0A0B]/95 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBackToLanding}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <span className="hidden sm:inline-flex">
            <BuildLogo size="sm" />
          </span>

          <div className="min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="text-sm font-semibold text-white truncate max-w-[160px] sm:max-w-[220px]">
                {project.name}
              </h1>
              <span className="hidden xl:inline text-xs font-mono text-slate-400 whitespace-nowrap shrink-0">
                · {project.category}
              </span>
            </div>
          </div>
        </div>

        {/* Right Header Controls: Model Switcher + CreditBadge + Auth/Avatar */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div
            role="group"
            aria-label="Workspace AI Model"
            className="hidden lg:inline-flex items-center p-1 rounded-xl bg-[#141517] border border-white/10"
          >
            <button
              type="button"
              onClick={() => onSelectModel('build-fast')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedModel === 'build-fast'
                  ? 'bg-[#26282B] text-white border border-white/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Build AI Fast
            </button>
            <button
              type="button"
              onClick={() => onSelectModel('build-pro')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedModel === 'build-pro'
                  ? 'bg-[#26282B] text-white border border-[#0066FF]/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3 h-3 text-[#00E5FF]" />
              Build AI Pro (Reasoning)
              <span className="rounded-full bg-[#38BDF8]/15 border border-[#38BDF8]/35 px-1.5 py-0.5 text-[10px] font-mono text-[#38BDF8]">
                1.5x
              </span>
            </button>
          </div>

          <CreditBadge credits={credits} onTopUp={onOpenPricing} />

          {user ? (
            <UserProfileMenu
              user={user}
              plan={plan}
              credits={credits}
              onUpgradePlan={onOpenPricing}
              onResetCredits={onResetCredits}
              onSignOut={onSignOut}
            />
          ) : (
            <button
              type="button"
              onClick={() => onOpenAuth('signin')}
              className="rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Sign in
            </button>
          )}
        </div>
      </header>

      {/* Main Split Builder Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0">
        {/* Left Pane: AI Conversation & Iteration Composer */}
        <section
          aria-label="AI Builder Chat and Iteration"
          className="lg:col-span-5 xl:col-span-4 border-b lg:border-b-0 lg:border-r border-white/10 bg-[#141517]/95 flex flex-col min-h-[420px]"
        >
          {/* Compact Model Switcher for smaller viewports */}
          <div className="lg:hidden px-4 py-2.5 border-b border-white/10 flex items-center justify-between gap-2">
            <span className="text-xs text-slate-400">Model</span>
            <div className="inline-flex items-center p-0.5 rounded-lg bg-[#0D0E10] border border-white/10">
              <button
                type="button"
                onClick={() => onSelectModel('build-fast')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium cursor-pointer ${
                  selectedModel === 'build-fast' ? 'bg-[#26282B] text-white' : 'text-slate-400'
                }`}
              >
                Fast
              </button>
              <button
                type="button"
                onClick={() => onSelectModel('build-pro')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium cursor-pointer ${
                  selectedModel === 'build-pro' ? 'bg-[#26282B] text-white' : 'text-slate-400'
                }`}
              >
                Pro <span className="font-mono text-[#38BDF8]">1.5x</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {project.messages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-xl p-3.5 border ${
                  msg.role === 'user'
                    ? 'bg-[#222326] border-white/10 ml-4'
                    : 'bg-[#1A1B1E] border-[#0066FF]/25 mr-2'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px] font-mono text-slate-400">
                  <span className={msg.role === 'assistant' ? 'text-[#00E5FF]' : 'text-slate-300'}>
                    {msg.role === 'user'
                      ? 'You'
                      : msg.modelId === 'build-pro'
                        ? 'Build AI Pro (Reasoning)'
                        : 'Build AI Fast'}
                  </span>
                  <span className="tabular-nums">
                    {msg.tokensSpent ? `-${formatTokenCount(msg.tokensSpent)} tokens · ` : ''}
                    {msg.timestamp}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
              </div>
            ))}

            {isGenerating && (
              <div
                data-testid="ai-generation-progress"
                className="rounded-xl p-3.5 border border-[#00E5FF]/35 bg-[#1A1B1E] mr-2 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="inline-flex items-center gap-2 text-[#BDF4FF] font-medium">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00E5FF] shrink-0" />
                    <span>{progressStage}</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-400 tabular-nums shrink-0">
                    {elapsedSec.toFixed(1)}s / {timeoutSec}s
                  </span>
                </div>

                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#0066FF] via-[#38BDF8] to-[#00E5FF] transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>{activeGenConfig.displayLabel}</span>
                  <span className="text-[#00E5FF] tabular-nums">{progressPct}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Iteration Input Composer */}
          <form onSubmit={handleIterate} noValidate className="p-4 border-t border-white/10 bg-[#0F1012]">
            <div className="rounded-xl bg-[#1A1B1E] border border-white/10 focus-within:border-[#0066FF] focus-within:shadow-[0_0_20px_rgba(0,102,255,0.25)] p-3 transition-all">
              <label htmlFor="workspace-iteration-input" className="sr-only">
                Follow-up iteration prompt
              </label>
              <textarea
                id="workspace-iteration-input"
                rows={3}
                value={instruction}
                onChange={(e) => {
                  setInstruction(e.target.value);
                  if (inputError) setInputError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    submitIteration();
                  }
                }}
                placeholder="Ask Build.new to refine layout, change colors (e.g. green / light mode), or add features..."
                className="w-full resize-none bg-transparent text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none leading-relaxed"
              />
              {inputError && <p className="text-xs text-rose-400 mt-1">{inputError}</p>}

              <div className="mt-2.5 pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
                <span
                  className="text-[11px] font-mono text-slate-400 tabular-nums"
                  data-testid="workspace-estimated-cost"
                >
                  Est. ~{formatTokenCount(iterationCost)} tokens
                </span>

                <button
                  type="submit"
                  className="cobalt-cta inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold text-white transition-all whitespace-nowrap cursor-pointer"
                >
                  <span>Send Iteration</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Right Pane: Live Interactive Sandbox & Multi-File Code Inspector */}
        <section
          aria-label="Live Preview and Code Inspector"
          className="lg:col-span-7 xl:col-span-8 flex flex-col obsidian-backdrop min-h-[540px]"
        >
          {/* Workspace Toolbar */}
          <div className="min-h-12 px-3 sm:px-6 py-1.5 border-b border-white/10 bg-[#121315]/90 flex items-center justify-between gap-2 overflow-x-auto">
            <div role="tablist" aria-label="Workspace view tabs" className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                role="tab"
                aria-selected={rightTab === 'preview'}
                onClick={() => setRightTab('preview')}
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  rightTab === 'preview'
                    ? 'bg-[#26282B] text-white border border-white/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-[#00E5FF]" />
                Preview
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={rightTab === 'code'}
                onClick={() => setRightTab('code')}
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  rightTab === 'code'
                    ? 'bg-[#26282B] text-white border border-white/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-[#B3C5FF]" />
                Code
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={rightTab === 'files'}
                onClick={() => setRightTab('files')}
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  rightTab === 'files'
                    ? 'bg-[#26282B] text-white border border-white/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FolderTree className="w-3.5 h-3.5 text-slate-400" />
                Files ({project.files.length})
              </button>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {rightTab === 'preview' && (
                <div className="hidden sm:inline-flex items-center p-0.5 rounded-lg bg-[#0D0E10] border border-white/10">
                  <button
                    type="button"
                    aria-label="Desktop viewport"
                    onClick={() => setViewportMode('desktop')}
                    className={`p-1.5 rounded-md cursor-pointer ${
                      viewportMode === 'desktop' ? 'bg-[#26282B] text-white' : 'text-slate-400'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Mobile viewport"
                    onClick={() => setViewportMode('mobile')}
                    className={`p-1.5 rounded-md cursor-pointer ${
                      viewportMode === 'mobile' ? 'bg-[#26282B] text-white' : 'text-slate-400'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {rightTab === 'code' && currentFile && (
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 px-2.5 sm:px-3 py-1.5 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  {copiedPath === currentFile.path ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy File
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={handleDownloadHtml}
                title="Download standalone HTML"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export
              </button>

              <button
                type="button"
                onClick={() => {
                  setDeployConfirmed(true);
                  window.setTimeout(() => setDeployConfirmed(false), 2400);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0066FF]/20 hover:bg-[#0066FF]/35 border border-[#0066FF]/40 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-[#BDF4FF] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Rocket className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>{deployConfirmed ? 'Ready' : 'Deploy'}</span>
                <span className="hidden sm:inline">Preview</span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {rightTab === 'preview' && (
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto obsidian-backdrop flex flex-col gap-3">
              {isGenerating && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mx-auto w-full max-w-5xl rounded-xl border border-[#00E5FF]/35 bg-[#141517] px-4 py-2.5 shadow-md"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-1.5">
                    <div className="flex items-center gap-2 text-[#BDF4FF] font-medium">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00E5FF]" />
                      <span>AI กำลังเขียนโค้ดจริง ({activeGenConfig.model} · Thinking {activeGenConfig.thinkingLevel})</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                      {progressPct}% · {elapsedSec.toFixed(1)}s / {timeoutSec}s
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#0066FF] via-[#38BDF8] to-[#00E5FF] transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              )}

              <div
                className={`mx-auto w-full flex-1 flex flex-col rounded-2xl border border-white/10 bg-[#141517] shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden transition-all ${
                  viewportMode === 'mobile' ? 'max-w-[390px]' : 'max-w-5xl'
                }`}
              >
                {/* Simulated Browser Chrome */}
                <div className="px-4 py-2.5 border-b border-white/10 bg-[#0E0F11] flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                  </div>
                  <div className="rounded-md bg-[#18191B] border border-white/10 px-3 py-1 text-[11px] font-mono text-slate-400 truncate max-w-xs sm:max-w-md">
                    https://preview.build.new/{project.id.slice(0, 12)}
                  </div>
                  <div className="flex items-center gap-2">
                    {isGenerating && (
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-[#00E5FF]/10 border border-[#00E5FF]/30 px-2 py-0.5 text-[10px] font-mono text-[#BDF4FF]">
                        <Loader2 className="w-3 h-3 animate-spin text-[#00E5FF]" />
                        AI Sync
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setPreviewNonce((n) => n + 1)}
                      aria-label="Reload preview"
                      className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                      v{project.iterationCount + 1}.0
                    </span>
                  </div>
                </div>

                {/* Live Interactive Generated App Iframe */}
                <div className="relative flex-1 min-h-[480px] bg-[#141517]">
                  <iframe
                    key={`${project.id}-${project.iterationCount}-${previewNonce}`}
                    title={project.previewTitle}
                    srcDoc={project.previewHtml}
                    sandbox="allow-scripts allow-forms"
                    className="w-full h-full min-h-[480px] border-0 bg-[#141517]"
                  />
                </div>
              </div>
            </div>
          )}

          {rightTab === 'code' && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center gap-1 px-4 py-2 border-b border-white/10 bg-[#141517] overflow-x-auto">
                {project.files.map((file) => (
                  <button
                    key={file.path}
                    type="button"
                    onClick={() => setActiveFilePath(file.path)}
                    className={`px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
                      currentFile?.path === file.path
                        ? 'bg-[#26282B] text-[#BDF4FF] border border-white/10'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {file.path}
                  </button>
                ))}
              </div>
              <pre className="flex-1 p-5 overflow-auto text-xs sm:text-sm font-mono text-slate-200 leading-relaxed bg-[#101113]">
                <code>{currentFile?.content}</code>
              </pre>
            </div>
          )}

          {rightTab === 'files' && (
            <div className="flex-1 p-6 overflow-y-auto">
              <h2 className="text-sm font-semibold text-white mb-4">Project Artifact Tree</h2>
              <div className="space-y-2 max-w-xl">
                {project.files.map((file) => (
                  <button
                    key={file.path}
                    type="button"
                    onClick={() => {
                      setActiveFilePath(file.path);
                      setRightTab('code');
                    }}
                    className="w-full flex items-center justify-between rounded-xl bg-[#141517] hover:bg-[#222326] border border-white/10 px-4 py-3 text-left transition-colors cursor-pointer"
                  >
                    <span className="text-xs font-mono text-slate-200">{file.path}</span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {file.content.split('\n').length} lines
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
