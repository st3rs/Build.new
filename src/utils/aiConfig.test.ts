import test from 'node:test';
import assert from 'node:assert/strict';
import { AI_REQUEST_TIMEOUT_MS, resolveModelConfig } from './aiConfig';

test('AI_REQUEST_TIMEOUT_MS is configured to 45 seconds', () => {
  assert.equal(AI_REQUEST_TIMEOUT_MS, 45_000);
});

test('resolveModelConfig maps build-fast to LOW and build-pro to HIGH on gemini-4-hydrogen', () => {
  const fast = resolveModelConfig('build-fast');
  assert.equal(fast.model, 'gemini-4-hydrogen');
  assert.equal(fast.thinkingLevel, 'LOW');
  assert.equal(fast.multiplier, 1);

  const pro = resolveModelConfig('build-pro');
  assert.equal(pro.model, 'gemini-4-hydrogen');
  assert.equal(pro.thinkingLevel, 'HIGH');
  assert.equal(pro.multiplier, 1.5);
});
