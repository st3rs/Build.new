import { useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Code2,
  Copy,
  Cpu,
  Eye,
  FolderTree,
  Rocket,
  Sparkles,
} from 'lucide-react';
import type { AIModelId, AuthUser, PlanTier, WorkspaceProject } from '../types/builder';
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
  const [activeFilePath, setActiveFilePath] = useState(project.files[0]?.path ?? 'src/App.tsx');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [previewFilter, setPreviewFilter] = useState<'all' | 'live'>('all');
  const [deployConfirmed, setDeployConfirmed] = useState(false);

  const iterationCost = calculateTokenCost('iteration', selectedModel);
  const currentFile =
    project.files.find((f) => f.path === activeFilePath) ?? project.files[0];

  function handleIterate(e: FormEvent) {
    e.preventDefault();
    if (!instruction.trim()) {
      setInputError('Describe a change or feature to iterate on.');
      return;
    }
    setInputError('');
    onSendIteration(instruction.trim());
    setInstruction('');
  }

  function handleCopyCode() {
    if (!currentFile) return;
    navigator.clipboard?.writeText(currentFile.content).catch(() => {});
    setCopiedPath(currentFile.path);
    window.setTimeout(() => setCopiedPath(null), 1600);
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
              <h1 className="text-sm font-semibold text-white truncate max-w-[180px] sm:max-w-[220px]">
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
                placeholder="Ask Build.new to refine layout, add dark charts, or wire a new view..."
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
                  Send Iteration
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Right Pane: Live App Preview & Multi-File Code Inspector */}
        <section
          aria-label="Live Preview and Code Inspector"
          className="lg:col-span-7 xl:col-span-8 flex flex-col obsidian-backdrop min-h-[520px]"
        >
          {/* Workspace Toolbar */}
          <div className="h-12 px-4 sm:px-6 border-b border-white/10 bg-[#121315]/90 flex items-center justify-between gap-3">
            <div role="tablist" aria-label="Workspace view tabs" className="flex items-center gap-1">
              <button
                type="button"
                role="tab"
                aria-selected={rightTab === 'preview'}
                onClick={() => setRightTab('preview')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
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
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
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
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  rightTab === 'files'
                    ? 'bg-[#26282B] text-white border border-white/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FolderTree className="w-3.5 h-3.5 text-slate-400" />
                Files ({project.files.length})
              </button>
            </div>

            <div className="flex items-center gap-2">
              {rightTab === 'code' && currentFile && (
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
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
                onClick={() => {
                  setDeployConfirmed(true);
                  window.setTimeout(() => setDeployConfirmed(false), 2400);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0066FF]/20 hover:bg-[#0066FF]/35 border border-[#0066FF]/40 px-3 py-1.5 text-xs font-medium text-[#BDF4FF] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Rocket className="w-3.5 h-3.5 text-[#00E5FF]" />
                {deployConfirmed ? 'Edge Preview Ready' : 'Deploy Preview'}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {rightTab === 'preview' && (
            <div className="flex-1 p-5 sm:p-7 overflow-y-auto obsidian-backdrop">
              <div className="max-w-4xl mx-auto rounded-2xl border border-white/10 bg-[#141517]/95 shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden">
                {/* Simulated Browser Chrome */}
                <div className="px-4 py-2.5 border-b border-white/10 bg-[#0E0F11] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                  </div>
                  <div className="rounded-md bg-[#18191B] border border-white/10 px-3 py-1 text-[11px] font-mono text-slate-400 truncate max-w-xs sm:max-w-md">
                    https://preview.build.new/{project.id.slice(0, 12)}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                    v{project.iterationCount + 1}.0
                  </span>
                </div>

                {/* Live Interactive Generated App Surface */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                      <p className="text-xs font-mono text-[#00E5FF]">{project.category}</p>
                      <h2 className="text-xl sm:text-2xl font-semibold text-white mt-1">
                        {project.previewTitle}
                      </h2>
                    </div>

                    <div className="inline-flex items-center p-1 rounded-lg bg-[#0D0E10] border border-white/10 self-start">
                      <button
                        type="button"
                        onClick={() => setPreviewFilter('all')}
                        className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer ${
                          previewFilter === 'all' ? 'bg-[#0066FF] text-white' : 'text-slate-400'
                        }`}
                      >
                        All Metrics
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewFilter('live')}
                        className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer ${
                          previewFilter === 'live' ? 'bg-[#0066FF] text-white' : 'text-slate-400'
                        }`}
                      >
                        Live Snapshot
                      </button>
                    </div>
                  </div>

                  {/* Generated App Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {project.previewMetrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="rounded-xl bg-[#1A1B1E] border border-white/10 p-4"
                      >
                        <p className="text-xs text-slate-400">{metric.label}</p>
                        <div className="mt-2 flex items-baseline justify-between gap-2">
                          <span className="text-2xl font-semibold text-white tabular-nums">
                            {metric.value}
                          </span>
                          <span className="text-xs font-mono text-[#38BDF8]">{metric.delta}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Iteration Summary inside Preview */}
                  <div className="rounded-xl bg-[#1A1B1E] border border-white/10 p-5">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#00E5FF]" />
                        Synthesized Specification
                      </h3>
                      <span className="text-xs font-mono text-slate-400 tabular-nums">
                        {project.iterationCount} follow-up iterations
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {project.prompt}
                    </p>
                  </div>
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
