import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { AuthModal } from './components/AuthModal';
import { BuilderWorkspace } from './components/BuilderWorkspace';
import { LandingPage } from './components/LandingPage';
import { Navbar } from './components/Navbar';
import { PricingModal } from './components/PricingModal';
import { PROJECT_TEMPLATES, buildProjectFromPrompt } from './data/templates';
import type {
  AIModelId,
  AuthUser,
  LanguageCode,
  PlanTier,
  ProjectTemplate,
  WorkspaceProject,
} from './types/builder';
import { AI_REQUEST_TIMEOUT_MS, resolveModelConfig } from './utils/aiConfig';
import { applyIterationToHtml } from './utils/appSynthesizer';
import {
  INITIAL_FREE_CREDITS,
  applyPlanUpgrade,
  calculateTokenCost,
  deductCredits,
  formatTokenCount,
  hasSufficientCredits,
} from './utils/tokenEngine';

const STORAGE_KEYS = {
  credits: 'buildnew_credits_v1',
  plan: 'buildnew_plan_v1',
  user: 'buildnew_user_v1',
  model: 'buildnew_model_v1',
  lang: 'buildnew_lang_v1',
};

function loadInitialCredits(): number {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.credits);
    if (raw !== null) {
      const parsed = Number(raw);
      if (Number.isFinite(parsed) && parsed >= 0) return parsed;
    }
  } catch {
    // ignore storage access issues
  }
  return INITIAL_FREE_CREDITS;
}

function loadInitialPlan(): PlanTier {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.plan);
    if (raw === 'Free' || raw === 'Pro' || raw === 'Teams') return raw;
  } catch {
    // ignore
  }
  return 'Free';
}

function loadInitialUser(): AuthUser | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.user);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (parsed && typeof parsed.email === 'string') return parsed;
  } catch {
    // ignore
  }
  return null;
}

function loadInitialModel(): AIModelId {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.model);
    if (raw === 'build-fast' || raw === 'build-pro') return raw;
  } catch {
    // ignore
  }
  return 'build-fast';
}

function loadInitialLang(): LanguageCode {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.lang);
    if (raw === 'th' || raw === 'en') return raw;
  } catch {
    // ignore
  }
  return 'th';
}

export default function App() {
  const [credits, setCredits] = useState<number>(loadInitialCredits);
  const [plan, setPlan] = useState<PlanTier>(loadInitialPlan);
  const [user, setUser] = useState<AuthUser | null>(loadInitialUser);
  const [selectedModel, setSelectedModel] = useState<AIModelId>(loadInitialModel);
  const [lang, setLang] = useState<LanguageCode>(loadInitialLang);

  const [activeProject, setActiveProject] = useState<WorkspaceProject | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        const seedTemplate = PROJECT_TEMPLATES[0];
        const proj = buildProjectFromPrompt(seedTemplate.prompt, seedTemplate);
        proj.messages = [
          {
            id: 'msg-seed-1',
            role: 'user',
            content: seedTemplate.prompt,
            modelId: 'build-fast',
            tokensSpent: 5000,
            timestamp: 'Just now',
          },
          {
            id: 'msg-seed-2',
            role: 'assistant',
            content: `Synthesized ${seedTemplate.title} with ${seedTemplate.generatedFiles.length} typed TypeScript modules and live preview.`,
            modelId: 'build-fast',
            timestamp: 'Just now',
          },
        ];
        return proj;
      }
    }
    return null;
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'signin' | 'signup'>('signin');
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [insufficientAlert, setInsufficientAlert] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStartedAt, setGenerationStartedAt] = useState<number | null>(null);
  const [generatingModel, setGeneratingModel] = useState<AIModelId | null>(null);
  const latestGenIdRef = useRef(0);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.credits, String(credits));
    } catch {
      // ignore
    }
  }, [credits]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.plan, plan);
    } catch {
      // ignore
    }
  }, [plan]);

  useEffect(() => {
    try {
      if (user) {
        window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
      } else {
        window.localStorage.removeItem(STORAGE_KEYS.user);
      }
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.model, selectedModel);
    } catch {
      // ignore
    }
  }, [selectedModel]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.lang, lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  }, [lang]);

  function showToast(message: string, durationMs = 2600) {
    setToastMessage(message);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, durationMs);
  }

  function openAuth(tab: 'signin' | 'signup') {
    setAuthInitialTab(tab);
    setAuthModalOpen(true);
  }

  function openPricing(fromInsufficientGuard = false) {
    setInsufficientAlert(fromInsufficientGuard);
    setPricingModalOpen(true);
  }

  async function handleStartBuild(prompt: string, template?: ProjectTemplate) {
    const cost = calculateTokenCost('new_app', selectedModel);
    if (!hasSufficientCredits(credits, cost)) {
      openPricing(true);
      return;
    }

    const result = deductCredits(credits, cost);
    if (!result.ok) {
      openPricing(true);
      return;
    }

    setCredits(result.remaining);
    const created = buildProjectFromPrompt(prompt, template, lang);
    const nowLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    created.messages = [
      {
        id: `msg-u-${Date.now()}`,
        role: 'user',
        content: created.prompt,
        modelId: selectedModel,
        tokensSpent: cost,
        timestamp: nowLabel,
      },
      {
        id: `msg-a-${Date.now() + 1}`,
        role: 'assistant',
        content: `Generated "${created.name}" (${created.files.length} files) using ${
          selectedModel === 'build-pro' ? 'Build AI Pro (Reasoning)' : 'Build AI Fast'
        }. Ready for live preview and follow-up edits.`,
        modelId: selectedModel,
        timestamp: nowLabel,
      },
    ];
    setActiveProject(created);

    // If custom prompt (no preset template), run server-side Gemini synthesis with 45s timeout
    if (!template) {
      const reqId = ++latestGenIdRef.current;
      const modelAtRequest = selectedModel;
      const resolved = resolveModelConfig(modelAtRequest);
      setIsGenerating(true);
      setGeneratingModel(modelAtRequest);
      setGenerationStartedAt(Date.now());

      const controller = new AbortController();
      const abortTimer = window.setTimeout(() => controller.abort(), AI_REQUEST_TIMEOUT_MS);
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            prompt: created.prompt,
            mode: 'new_app',
            modelId: modelAtRequest,
            lang,
          }),
        });
        if (res.ok && latestGenIdRef.current === reqId) {
          const data = (await res.json()) as {
            fallback?: boolean;
            modelUsed?: string;
            thinkingLevel?: string;
            title?: string;
            assistantMessage?: string;
            previewHtml?: string;
            appTsx?: string;
          };
          if (!data.fallback && data.previewHtml) {
            setActiveProject((prev) => {
              if (!prev || prev.id !== created.id || prev.iterationCount > 0) return prev;
              const updatedFiles = prev.files.map((f) => {
                if (f.path === 'index.html' && data.previewHtml) {
                  return { ...f, content: data.previewHtml };
                }
                if (f.path === 'src/App.tsx' && data.appTsx) {
                  return { ...f, content: data.appTsx };
                }
                return f;
              });
              const modelNote = data.modelUsed
                ? ` (${data.modelUsed} · Thinking ${data.thinkingLevel ?? resolved.thinkingLevel})`
                : '';
              return {
                ...prev,
                name: data.title || prev.name,
                previewTitle: data.title || prev.previewTitle,
                previewHtml: data.previewHtml || prev.previewHtml,
                files: updatedFiles,
                messages: prev.messages.map((m, idx) =>
                  idx === 1 && data.assistantMessage
                    ? { ...m, content: `${data.assistantMessage}${modelNote}` }
                    : m,
                ),
              };
            });
          }
        }
      } catch {
        // Keep instant synthesized app cleanly on network error/abort
      } finally {
        window.clearTimeout(abortTimer);
        if (latestGenIdRef.current === reqId) {
          setIsGenerating(false);
          setGeneratingModel(null);
          setGenerationStartedAt(null);
        }
      }
    }
  }

  async function handleSendIteration(instruction: string) {
    if (!activeProject) return;
    const cost = calculateTokenCost('iteration', selectedModel);
    if (!hasSufficientCredits(credits, cost)) {
      openPricing(true);
      return;
    }

    const result = deductCredits(credits, cost);
    if (!result.ok) {
      openPricing(true);
      return;
    }

    setCredits(result.remaining);
    const nowLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const targetId = activeProject.id;
    const nextIteration = activeProject.iterationCount + 1;
    const optimisticHtml = applyIterationToHtml(
      activeProject.previewHtml,
      instruction,
      activeProject.iterationCount,
      lang,
    );

    setActiveProject((prev) => {
      if (!prev) return prev;
      const updatedFiles = prev.files.map((file) => {
        if (file.path === 'index.html') {
          return { ...file, content: optimisticHtml };
        }
        if (file.path === 'src/App.tsx') {
          return {
            ...file,
            content: `${file.content}\n\n// Iteration #${nextIteration}: ${instruction}`,
          };
        }
        return file;
      });
      return {
        ...prev,
        iterationCount: nextIteration,
        prompt: `${prev.prompt} · Iteration ${nextIteration}: ${instruction}`,
        previewHtml: optimisticHtml,
        files: updatedFiles,
        messages: [
          ...prev.messages,
          {
            id: `msg-u-${Date.now()}`,
            role: 'user',
            content: instruction,
            modelId: selectedModel,
            tokensSpent: cost,
            timestamp: nowLabel,
          },
          {
            id: `msg-a-${Date.now() + 1}`,
            role: 'assistant',
            content: `Applied iteration #${nextIteration} ("${instruction}"). Live preview refreshed.`,
            modelId: selectedModel,
            timestamp: nowLabel,
          },
        ],
      };
    });

    const reqId = ++latestGenIdRef.current;
    const modelAtRequest = selectedModel;
    const resolved = resolveModelConfig(modelAtRequest);
    setIsGenerating(true);
    setGeneratingModel(modelAtRequest);
    setGenerationStartedAt(Date.now());

    const controller = new AbortController();
    const abortTimer = window.setTimeout(() => controller.abort(), AI_REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          prompt: instruction,
          mode: 'iteration',
          modelId: modelAtRequest,
          currentHtml: activeProject.previewHtml,
          currentTitle: activeProject.name,
          lang,
        }),
      });
      if (res.ok && latestGenIdRef.current === reqId) {
        const data = (await res.json()) as {
          fallback?: boolean;
          modelUsed?: string;
          thinkingLevel?: string;
          assistantMessage?: string;
          previewHtml?: string;
          appTsx?: string;
        };
        if (!data.fallback && data.previewHtml) {
          setActiveProject((prev) => {
            if (!prev || prev.id !== targetId || prev.iterationCount !== nextIteration) return prev;
            const updatedFiles = prev.files.map((f) => {
              if (f.path === 'index.html' && data.previewHtml) {
                return { ...f, content: data.previewHtml };
              }
              if (f.path === 'src/App.tsx' && data.appTsx) {
                return { ...f, content: data.appTsx };
              }
              return f;
            });
            const modelNote = data.modelUsed
              ? ` (${data.modelUsed} · Thinking ${data.thinkingLevel ?? resolved.thinkingLevel})`
              : '';
            return {
              ...prev,
              previewHtml: data.previewHtml || prev.previewHtml,
              files: updatedFiles,
              messages: prev.messages.map((m, idx) =>
                idx === prev.messages.length - 1 && data.assistantMessage
                  ? { ...m, content: `${data.assistantMessage}${modelNote}` }
                  : m,
              ),
            };
          });
        }
      }
    } catch {
      // Keep optimistic live HTML update cleanly
    } finally {
      window.clearTimeout(abortTimer);
      if (latestGenIdRef.current === reqId) {
        setIsGenerating(false);
        setGeneratingModel(null);
        setGenerationStartedAt(null);
      }
    }
  }

  function handleUpgradePlan(targetPlan: Exclude<PlanTier, 'Free'>) {
    const upgrade = applyPlanUpgrade(credits, targetPlan);
    setPlan(upgrade.plan);
    setCredits(upgrade.newCredits);
    setInsufficientAlert(false);
    showToast(
      `🎉 Upgraded to Build.new ${targetPlan}! ${formatTokenCount(upgrade.addedTokens)} tokens added.`,
      4500,
    );
  }

  function handleResetCredits() {
    setPlan('Free');
    setCredits(INITIAL_FREE_CREDITS);
    showToast('Demo credits reset to 50,000 free tokens (Free Plan).');
  }

  function handleEnterWorkspace() {
    if (activeProject) return;
    const defaultTpl = PROJECT_TEMPLATES[0];
    const proj = buildProjectFromPrompt(
      lang === 'th' ? defaultTpl.promptTh : defaultTpl.prompt,
      defaultTpl,
      lang,
    );
    proj.messages = [
      {
        id: 'msg-ws-1',
        role: 'assistant',
        content: `Loaded ${defaultTpl.title} workspace. Send an iteration below or return Home to start from scratch.`,
        modelId: selectedModel,
        timestamp: 'Ready',
      },
    ];
    setActiveProject(proj);
  }

  return (
    <div className="min-h-screen obsidian-backdrop text-white">
      {activeProject ? (
        <BuilderWorkspace
          project={activeProject}
          user={user}
          plan={plan}
          credits={credits}
          selectedModel={selectedModel}
          isGenerating={isGenerating}
          generatingModel={generatingModel ?? selectedModel}
          generationStartedAt={generationStartedAt}
          onSelectModel={setSelectedModel}
          onSendIteration={handleSendIteration}
          onBackToLanding={() => setActiveProject(null)}
          onOpenAuth={openAuth}
          onOpenPricing={() => openPricing(false)}
          onResetCredits={handleResetCredits}
          onSignOut={() => {
            setUser(null);
            showToast('Signed out of Build.new.');
          }}
        />
      ) : (
        <>
          <Navbar
            user={user}
            plan={plan}
            credits={credits}
            lang={lang}
            onToggleLang={setLang}
            onOpenAuth={openAuth}
            onOpenPricing={() => openPricing(false)}
            onResetCredits={handleResetCredits}
            onSignOut={() => {
              setUser(null);
              showToast('Signed out of Build.new.');
            }}
            onEnterWorkspace={handleEnterWorkspace}
          />
          <LandingPage
            lang={lang}
            selectedModel={selectedModel}
            isGenerating={isGenerating}
            onSelectModel={setSelectedModel}
            onStartBuild={handleStartBuild}
            onOpenPricing={() => openPricing(false)}
            onEnterWorkspace={handleEnterWorkspace}
          />
        </>
      )}

      <AuthModal
        isOpen={authModalOpen}
        initialTab={authInitialTab}
        onClose={() => setAuthModalOpen(false)}
        onAuthenticate={(authedUser) => {
          setUser(authedUser);
          showToast(`Signed in as ${authedUser.email}`);
        }}
      />

      <PricingModal
        isOpen={pricingModalOpen}
        currentPlan={plan}
        insufficientAlert={insufficientAlert}
        onClose={() => {
          setPricingModalOpen(false);
          setInsufficientAlert(false);
        }}
        onUpgrade={handleUpgradePlan}
      />

      {/* Celebratory / Status Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl bg-[#141517]/95 backdrop-blur-xl border border-[#38BDF8]/40 px-4 py-3 text-xs sm:text-sm text-white shadow-[0_12px_36px_rgba(0,0,0,0.7)]"
        >
          <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label="Dismiss notification"
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
