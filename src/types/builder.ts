export type PlanTier = 'Free' | 'Pro' | 'Teams';
export type AIModelId = 'build-fast' | 'build-pro';
export type BillingCycle = 'monthly' | 'yearly';
export type LanguageCode = 'th' | 'en';
export type TemplateCategory = 'All' | 'SaaS & Data' | 'AI & DevTools' | 'Commerce & Media';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  provider: 'github' | 'google' | 'email';
  initials: string;
}

export interface ProjectTemplate {
  id: string;
  badge: string;
  title: string;
  titleTh: string;
  category: Exclude<TemplateCategory, 'All'>;
  description: string;
  descriptionTh: string;
  prompt: string;
  promptTh: string;
  stack: string[];
  accentColor: string;
  iconName: 'globe' | 'chart' | 'terminal' | 'layers' | 'wallet' | 'book' | 'file' | 'ticket' | 'activity' | 'palette';
  previewTitle: string;
  previewMetrics: { label: string; value: string; delta: string }[];
  generatedFiles: GeneratedFile[];
}

export interface GeneratedFile {
  path: string;
  language: 'tsx' | 'ts' | 'css' | 'json';
  content: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  modelId: AIModelId;
  tokensSpent?: number;
  timestamp: string;
}

export interface WorkspaceProject {
  id: string;
  name: string;
  prompt: string;
  category: Exclude<TemplateCategory, 'All'>;
  previewTitle: string;
  previewMetrics: { label: string; value: string; delta: string }[];
  files: GeneratedFile[];
  messages: ChatMessage[];
  iterationCount: number;
}
