/* Scoring engine — pure functions, shared by the UI and the tests. */
(function (root) {
  const num = (x) => {
    const n = Number(x);
    return Number.isFinite(n) && n > 0 ? n : 0;
  };
  const round2 = (x) => Math.round(x * 100) / 100;

  function itemScore(item, v, opts) {
    v = v || {};
    opts = opts || {};
    let base = 0, count = 0;
    switch (item.type) {
      case 'count':
        count = num(v.n);
        base = item.unit * count;
        break;
      case 'weighted': {
        const p1 = num(v.p1), p2 = num(v.p2), p3 = num(v.p3);
        count = p1 + p2 + p3;
        base = opts.alphabetical ? item.unit * count : item.unit * (p1 + 0.5 * p2 + 0.25 * p3);
        break;
      }
      case 'fixed':
        count = v.on ? 1 : 0;
        base = v.on ? item.unit : 0;
        break;
      case 'points':
        base = num(v.pts);
        break;
      case 'choice':
        base = num(v.value);
        break;
      default:
        base = 0;
    }
    const raw = base;
    let capped = false;
    if (item.cap != null && base > item.cap) { base = item.cap; capped = true; }

    let bonus = 0;
    if (item.bonus) {
      let b = num(v.b);
      if (item.bonus.limitToCount) b = Math.min(b, count);
      bonus = item.bonus.unit * b;
      if (item.bonus.cap != null && bonus > item.bonus.cap) { bonus = item.bonus.cap; capped = true; }
    }
    return { raw: round2(raw), base: round2(base), bonus: round2(bonus), total: round2(base + bonus), capped };
  }

  function sectionScore(section, values, opts) {
    let total = 0;
    const items = {};
    section.groups.forEach((g) => g.items.forEach((it) => {
      const s = itemScore(it, values[section.id + '.' + it.id], opts);
      items[it.id] = s;
      total += s.total;
    }));
    return { total: round2(total), items };
  }

  function admissibilityStatus(grid, domain, adm) {
    adm = adm || {};
    const adminOk = !!adm.admin;
    const variants = (grid.admissibility[domain] || []).map((variant, vi) => {
      const groups = variant.groups.map((g, gi) => g.options.some((_, oi) => !!adm[`v${vi}g${gi}o${oi}`]));
      return { ok: groups.every(Boolean), groups };
    });
    const scientificOk = variants.some((v) => v.ok);
    return { adminOk, scientificOk, variants, ok: adminOk && scientificOk };
  }

  function evaluate(grid, state) {
    const domain = state.domain || 'ST';
    const opts = { alphabetical: !!state.alphabetical };
    const values = state.values || {};
    const sections = {};
    let total = 0;
    grid.sections.forEach((s) => {
      sections[s.id] = sectionScore(s, values, opts);
      total += sections[s.id].total;
    });
    const ped = sections.pedagogy ? sections.pedagogy.total : 0;
    const res = sections.research ? sections.research.total : 0;
    const minPed = grid.thresholds.pedagogy;
    const minRes = grid.thresholds.research[domain];
    const adm = admissibilityStatus(grid, domain, state.adm);
    return {
      sections,
      total: round2(total),
      pedagogy: { score: ped, min: minPed, ok: ped >= minPed },
      research: { score: res, min: minRes, ok: res >= minRes },
      admissibility: adm,
      eligible: adm.ok && ped >= minPed && res >= minRes
    };
  }

  const api = { itemScore, sectionScore, admissibilityStatus, evaluate };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Calc = api;
})(typeof window !== 'undefined' ? window : globalThis);
