// Type-level test for useDataRef / useDataAction declarations.
// Run: npx tsc --noEmit test/types-test.ts
// This file is NOT executed — it only checks that types compile.

import { useDataRef, useDataAction, DataRefProxy, DataActions } from '../src/index.d.ts'; // eslint-disable-line

// ── useDataRef ──

declare const root: Element;

// With explicit ref names
const refs = useDataRef<'username' | 'item' | 'chatInput'>(root);

// Should type-check: accessing defined refs
const usernameEl: HTMLElement | HTMLElement[] = refs.username;
const itemEl: HTMLElement | HTMLElement[] = refs.item;
const inputEl: HTMLElement | HTMLElement[] = refs.chatInput;

// With default (string) — any key returns HTMLElement | HTMLElement[] | undefined
const refsAny = useDataRef(root);
const anyEl: HTMLElement | HTMLElement[] | undefined = refsAny.whatever;

// ── useDataAction ──

useDataAction({
  root,
  actions: {
    submit(ev, el) {
      // ev: Event, el: HTMLElement
      console.log(ev.type, el.tagName);
    },
    delete(ev, el) {
      console.log(el.dataset.id);
    },
  },
});

// ── Export types for external consumers ──

export type { DataRefProxy, DataActions };
