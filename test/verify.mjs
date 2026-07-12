// Quick Node.js logic verification (mock DOM)
import { useDataRef } from '../src/useDataRef.js';

// Mock a minimal DOM
const el = (tag, attrs = {}) => {
  const e = {};
  e.tagName = tag;
  e.dataset = {};
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'textContent') e.textContent = v;
    else if (k === 'value') e.value = v;
    else if (k === 'data-ref') e.dataset.ref = v;
    else if (k.startsWith('data-')) e.dataset[k.slice(5)] = v;
  }
  return e;
};

// Mock root with querySelectorAll
const root = {
  querySelectorAll(sel) {
    if (sel === '[data-ref]') return [
      el('input', { 'data-ref': 'username', value: 'alice' }),
      el('input', { 'data-ref': 'username', value: 'bob' }),
      el('li', { 'data-ref': 'item', textContent: 'A' }),
      el('li', { 'data-ref': 'item', textContent: 'B' }),
      el('li', { 'data-ref': 'item', textContent: 'C' }),
      el('span', { 'data-ref': 'single', textContent: 'hello' }),
    ];
    return [];
  }
};

const refs = useDataRef(root);

// Assertion helper
let pass = 0, fail = 0;
function check(name, ok) {
  if (ok) { pass++; console.log(`  PASS: ${name}`); }
  else { fail++; console.log(`  FAIL: ${name}`); }
}

// Single element
check('single element', refs.single.textContent === 'hello');

// Multi element
check('multi is array', Array.isArray(refs.item));
check('multi length', refs.item.length === 3);
check('multi [1]', refs.item[1].textContent === 'B');

// forEach
let count = 0;
refs.item.forEach(() => count++);
check('forEach iterates all', count === 3);

// DOM prop → first element
check('multi DOM prop value', refs.username.value === 'alice');

// Array length on multi
check('multi array length', refs.username.length === 2);

// Missing ref
check('missing ref undefined', refs.nonexistent === undefined);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
