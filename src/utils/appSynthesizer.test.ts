import assert from 'node:assert/strict';
import test from 'node:test';
import {
  applyIterationToHtml,
  detectAppDomain,
  synthesizeInteractiveApp,
} from './appSynthesizer';

test('detectAppDomain maps Thai and English prompts accurately', () => {
  assert.equal(detectAppDomain('สร้างร้านค้าออนไลน์ขายของพร้อมตะกร้าสินค้า'), 'commerce');
  assert.equal(detectAppDomain('Build a sprint Kanban board with drag and drop'), 'kanban');
  assert.equal(detectAppDomain('เครื่องคิดเลขคำนวณภาษีและกำไร'), 'calculator');
  assert.equal(detectAppDomain('ระบบ AI CRM จัดการลูกค้า'), 'crm');
});

test('synthesizeInteractiveApp produces complete interactive HTML document', () => {
  const result = synthesizeInteractiveApp({
    prompt: 'สร้างร้านค้าออนไลน์ขายของ',
    lang: 'th',
  });
  assert.ok(result.previewHtml.includes('<!doctype html>'));
  assert.ok(result.previewHtml.includes('addToCart'));
  assert.ok(result.metrics.length === 3);
});

test('applyIterationToHtml applies theme color and appends iteration card', () => {
  const base = synthesizeInteractiveApp({
    prompt: 'Build a dashboard',
    lang: 'en',
  });
  const mutated = applyIterationToHtml(base.previewHtml, 'เปลี่ยนสีธีมเป็นสีเขียวและ light mode', 1, 'th');
  assert.ok(mutated.includes('#10B981'));
  assert.ok(mutated.includes('#F8FAFC'));
  assert.ok(mutated.includes('อัปเดต v2'));
});
