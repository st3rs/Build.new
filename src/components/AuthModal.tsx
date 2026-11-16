import { useEffect, useState, type FormEvent } from 'react';
import { X, Zap } from 'lucide-react';
import type { AuthUser } from '../types/builder';
import { deriveInitials, validateAuthForm, type AuthFormErrors } from '../utils/tokenEngine';

interface AuthModalProps {
  isOpen: boolean;
  initialTab?: 'signin' | 'signup';
  onClose: () => void;
  onAuthenticate: (user: AuthUser) => void;
}

export function AuthModal({
  isOpen,
  initialTab = 'signin',
  onClose,
  onAuthenticate,
}: AuthModalProps) {
  const [tab, setTab] = useState<'signin' | 'signup'>(initialTab);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<AuthFormErrors>({});

  useEffect(() => {
    setTab(initialTab);
    setErrors({});
  }, [initialTab, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleOAuth(provider: 'github' | 'google') {
    const demoUser: AuthUser =
      provider === 'github'
        ? {
            id: 'usr-github-01',
            name: 'Alex Rivera',
            email: 'alex.rivera@github.dev',
            provider: 'github',
            initials: 'AR',
          }
        : {
            id: 'usr-google-01',
            name: 'Jordan Chen',
            email: 'jordan.chen@gmail.com',
            provider: 'google',
            initials: 'JC',
          };
    onAuthenticate(demoUser);
    onClose();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validation = validateAuthForm(tab, email, password, name);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    const cleanEmail = email.trim();
    const resolvedName =
      tab === 'signup' && name.trim()
        ? name.trim()
        : cleanEmail.split('@')[0].replace(/[._-]/g, ' ');

    onAuthenticate({
      id: `usr-${Date.now()}`,
      name: resolvedName,
      email: cleanEmail,
      provider: 'email',
      initials: deriveInitials(resolvedName || cleanEmail),
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-[#141517]/95 backdrop-blur-xl border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Subtle cyan top border glow */}
        <div
          className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-80"
          aria-hidden="true"
        />

        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h2 id="auth-modal-title" className="text-xl font-semibold text-white tracking-tight">
                {tab === 'signin' ? 'Welcome back to Build.new' : 'Create your Build.new account'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Ship full-stack apps from natural language in seconds.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close authentication modal"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Toggle Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#0D0E10] border border-white/10 mb-5">
            <button
              type="button"
              onClick={() => {
                setTab('signin');
                setErrors({});
              }}
              className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                tab === 'signin'
                  ? 'bg-[#26282B] text-white border border-white/10 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('signup');
                setErrors({});
              }}
              className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                tab === 'signup'
                  ? 'bg-[#26282B] text-white border border-white/10 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {tab === 'signup' && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/25 px-3 py-2 text-xs text-[#BDF4FF]">
              <Zap className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
              <span>Get 50,000 free tokens on signup</span>
            </div>
          )}

          {/* One-Click OAuth Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
            <button
              type="button"
              onClick={() => handleOAuth('github')}
              className="flex items-center justify-center gap-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 px-3.5 py-2.5 text-xs font-medium text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Continue with GitHub
            </button>

            <button
              type="button"
              onClick={() => handleOAuth('google')}
              className="flex items-center justify-center gap-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 px-3.5 py-2.5 text-xs font-medium text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z"
                />
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-white/10 w-full" />
            <span className="px-3 text-[11px] font-mono text-slate-400 bg-[#141517] whitespace-nowrap">
              or continue with email
            </span>
            <div className="border-t border-white/10 w-full" />
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
            {tab === 'signup' && (
              <div>
                <label htmlFor="auth-name" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ada Lovelace"
                  className="w-full rounded-xl bg-[#0D0E10] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0066FF] focus:shadow-[0_0_0_3px_rgba(0,102,255,0.2)]"
                />
                {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-xs font-medium text-slate-300 mb-1.5">
                Work Email
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-xl bg-[#0D0E10] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0066FF] focus:shadow-[0_0_0_3px_rgba(0,102,255,0.2)]"
              />
              {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="auth-password" className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-xl bg-[#0D0E10] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0066FF] focus:shadow-[0_0_0_3px_rgba(0,102,255,0.2)]"
              />
              {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full cobalt-cta rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all cursor-pointer mt-2"
            >
              Continue with Email
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
