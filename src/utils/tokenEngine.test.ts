import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_FREE_CREDITS,
  applyPlanUpgrade,
  calculateTokenCost,
  deductCredits,
  deriveInitials,
  formatTokenCount,
  getPlanPrice,
  hasSufficientCredits,
  validateAuthForm,
} from './tokenEngine';

test('calculateTokenCost applies base rates and 1.5x Pro multiplier', () => {
  assert.equal(calculateTokenCost('new_app', 'build-fast'), 5000);
  assert.equal(calculateTokenCost('new_app', 'build-pro'), 7500);
  assert.equal(calculateTokenCost('iteration', 'build-fast'), 2500);
  assert.equal(calculateTokenCost('iteration', 'build-pro'), 3750);
});

test('deductCredits enforces insufficient credit guard', () => {
  assert.equal(hasSufficientCredits(INITIAL_FREE_CREDITS, 5000), true);
  assert.equal(hasSufficientCredits(2000, 2500), false);

  const okResult = deductCredits(50000, 5000);
  assert.deepEqual(okResult, { ok: true, remaining: 45000 });

  const blockedResult = deductCredits(1500, 2500);
  assert.deepEqual(blockedResult, { ok: false, remaining: 1500 });
});

test('applyPlanUpgrade credits Pro (2M) and Teams (10M) tokens', () => {
  const pro = applyPlanUpgrade(1200, 'Pro');
  assert.equal(pro.plan, 'Pro');
  assert.equal(pro.addedTokens, 2_000_000);
  assert.equal(pro.newCredits, 2_001_200);

  const teams = applyPlanUpgrade(0, 'Teams');
  assert.equal(teams.plan, 'Teams');
  assert.equal(teams.addedTokens, 10_000_000);
  assert.equal(teams.newCredits, 10_000_000);
});

test('getPlanPrice applies 20% yearly discount accurately', () => {
  assert.equal(getPlanPrice('Free', 'monthly'), 0);
  assert.equal(getPlanPrice('Free', 'yearly'), 0);
  assert.equal(getPlanPrice('Pro', 'monthly'), 20);
  assert.equal(getPlanPrice('Pro', 'yearly'), 16);
  assert.equal(getPlanPrice('Teams', 'monthly'), 50);
  assert.equal(getPlanPrice('Teams', 'yearly'), 40);
});

test('validateAuthForm checks email, password length, and signup name', () => {
  assert.deepEqual(validateAuthForm('signin', 'dev@build.new', 'secret123'), {});
  const invalidSignup = validateAuthForm('signup', 'bad-email', '123', 'A');
  assert.ok(invalidSignup.name);
  assert.ok(invalidSignup.email);
  assert.ok(invalidSignup.password);
});

test('formatTokenCount and deriveInitials format consistently', () => {
  assert.equal(formatTokenCount(50000), '50,000');
  assert.equal(formatTokenCount(2000000), '2,000,000');
  assert.equal(deriveInitials('Ada Lovelace'), 'AL');
});
