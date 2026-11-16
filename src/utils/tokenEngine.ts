import type { AIModelId, BillingCycle, PlanTier } from '../types/builder';

export const INITIAL_FREE_CREDITS = 50_000;
export const NEW_APP_BASE_TOKENS = 5_000;
export const ITERATION_BASE_TOKENS = 2_500;
export const PRO_MODEL_MULTIPLIER = 1.5;

export const PLAN_MONTHLY_QUOTAS: Record<PlanTier, number> = {
  Free: 50_000,
  Pro: 2_000_000,
  Teams: 10_000_000,
};

export const PLAN_MONTHLY_PRICES: Record<PlanTier, number> = {
  Free: 0,
  Pro: 20,
  Teams: 50,
};

export function calculateTokenCost(
  action: 'new_app' | 'iteration',
  modelId: AIModelId,
): number {
  const base = action === 'new_app' ? NEW_APP_BASE_TOKENS : ITERATION_BASE_TOKENS;
  const multiplier = modelId === 'build-pro' ? PRO_MODEL_MULTIPLIER : 1;
  return Math.round(base * multiplier);
}

export function hasSufficientCredits(credits: number, requiredTokens: number): boolean {
  return credits >= requiredTokens;
}

export function deductCredits(
  credits: number,
  requiredTokens: number,
): { ok: boolean; remaining: number } {
  if (!hasSufficientCredits(credits, requiredTokens)) {
    return { ok: false, remaining: credits };
  }
  return { ok: true, remaining: credits - requiredTokens };
}

export function applyPlanUpgrade(
  currentCredits: number,
  targetPlan: Exclude<PlanTier, 'Free'>,
): {
  plan: PlanTier;
  addedTokens: number;
  newCredits: number;
  maxQuota: number;
} {
  const addedTokens = PLAN_MONTHLY_QUOTAS[targetPlan];
  return {
    plan: targetPlan,
    addedTokens,
    newCredits: currentCredits + addedTokens,
    maxQuota: Math.max(addedTokens, currentCredits + addedTokens),
  };
}

export function getPlanPrice(plan: PlanTier, billing: BillingCycle): number {
  const monthly = PLAN_MONTHLY_PRICES[plan];
  if (monthly === 0) return 0;
  return billing === 'yearly' ? Math.round(monthly * 0.8) : monthly;
}

export function formatTokenCount(value: number): string {
  return Math.max(0, Math.floor(value)).toLocaleString('en-US');
}

export interface AuthFormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export function validateAuthForm(
  mode: 'signin' | 'signup',
  email: string,
  password: string,
  name = '',
): AuthFormErrors {
  const errors: AuthFormErrors = {};

  if (mode === 'signup' && name.trim().length < 2) {
    errors.name = 'Enter your full name (at least 2 characters).';
  }

  const trimmedEmail = email.trim();
  if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.email = 'Enter a valid email address.';
  }

  if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  return errors;
}

export function deriveInitials(nameOrEmail: string): string {
  const cleaned = nameOrEmail.trim();
  if (!cleaned) return 'U';
  const words = cleaned.split(/[\s@._-]+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return cleaned.slice(0, 2).toUpperCase();
}
