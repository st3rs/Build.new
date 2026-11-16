import type { AIModelId } from '../types/builder';

export const AI_REQUEST_TIMEOUT_MS = 45_000;

export interface ResolvedModelConfig {
  model: 'gemini-4-hydrogen';
  thinkingLevel: 'LOW' | 'HIGH';
  multiplier: 1 | 1.5;
  displayLabel: string;
}

export function resolveModelConfig(modelId: AIModelId): ResolvedModelConfig {
  if (modelId === 'build-pro') {
    return {
      model: 'gemini-4-hydrogen',
      thinkingLevel: 'HIGH',
      multiplier: 1.5,
      displayLabel: 'Build AI Pro · gemini-4-hydrogen (Thinking HIGH)',
    };
  }

  return {
    model: 'gemini-4-hydrogen',
    thinkingLevel: 'LOW',
    multiplier: 1,
    displayLabel: 'Build AI Fast · gemini-4-hydrogen (Thinking LOW)',
  };
}
