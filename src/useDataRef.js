export function useDataRef(root) {
  const m = {};
  for (const el of root.querySelectorAll('[data-ref]')) {
    const n = el.dataset.ref;
    m[n] = m[n] === undefined ? el : Array.isArray(m[n]) ? (m[n].push(el), m[n]) : [m[n], el];
  }
  return new Proxy(m, {
    get(t, k) {
      if (typeof k === 'symbol') return t[k];
      const v = t[k];
      if (v === undefined) return;
      if (!Array.isArray(v)) return v;
      return new Proxy(v, {
        get(a, p) {
          if (typeof p === 'symbol') return a[p];
          if (p in a || String(parseInt(p)) === p + '')
            return typeof a[p] === 'function' ? a[p].bind(a) : a[p];
          return a[0][p];
        }
      });
    }
  });
}
