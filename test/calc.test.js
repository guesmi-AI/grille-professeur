const assert = require('assert');
const path = require('path');
global.window = {};
require(path.join(__dirname, '../www/js/grids.js'));
const Calc = require(path.join(__dirname, '../www/js/calc.js'));
const G = global.window.GRIDS;
let n = 0; const t = (name, fn) => { fn(); n++; console.log('ok -', name); };
const item = (g, sec, id) => G[g].sections.find(s => s.id === sec).groups.flatMap(x => x.items).find(i => i.id === id);

t('2026 cours capped at 60, English bonus outside cap', () => {
  const r = Calc.itemScore(item('2026','pedagogy','cours'), { n: 12, b: 2 });
  assert.deepStrictEqual([r.base, r.bonus, r.total, r.capped], [60, 20, 80, true]);
});
t('English bonus cannot exceed count', () => {
  assert.strictEqual(Calc.itemScore(item('2026','research','chapitre'), { n: 1, b: 5 }).total, 15);
});
t('weighted co-author rule 100/50/25', () => {
  assert.strictEqual(Calc.itemScore(item('2026','research','pubA'), { p1: 1, p2: 1, p3: 2 }).total, 80 + 40 + 40);
});
t('alphabetical disciplines: 100 % for all', () => {
  assert.strictEqual(Calc.itemScore(item('2026','research','pubA'), { p1: 1, p2: 1, p3: 2 }, { alphabetical: true }).total, 320);
});
t('2026 pub C capped at 40', () => {
  assert.strictEqual(Calc.itemScore(item('2026','research','pubC'), { p1: 4 }).total, 40);
});
t('2028 pub C capped at 50', () => {
  assert.strictEqual(Calc.itemScore(item('2028','research','pubC'), { p1: 3 }).total, 50);
});
t('2028 online content bonus capped at 10', () => {
  assert.strictEqual(Calc.itemScore(item('2028','pedagogy','contenusEnLigne'), { n: 6, b: 9 }).total, 40);
});
t('points-type item capped', () => {
  assert.strictEqual(Calc.itemScore(item('2028','research','bureauEtudes'), { pts: 25 }).total, 10);
});
t('fixed item', () => {
  assert.strictEqual(Calc.itemScore(item('2028','research','prix'), { on: true }).total, 30);
});
t('2028 function choice', () => {
  assert.strictEqual(Calc.itemScore(item('2028','functions','fonction'), { value: 6 }).total, 6);
});
t('negative / garbage inputs ignored', () => {
  assert.strictEqual(Calc.itemScore(item('2026','pedagogy','td'), { n: -3 }).total, 0);
  assert.strictEqual(Calc.itemScore(item('2026','pedagogy','td'), { n: 'abc' }).total, 0);
});
t('admissibility needs admin + one full variant', () => {
  const g = G['2028'];
  assert.strictEqual(Calc.admissibilityStatus(g, 'ST', { admin: true, v0g0o1: true }).ok, false);
  assert.strictEqual(Calc.admissibilityStatus(g, 'ST', { admin: true, v0g0o1: true, v0g1o2: true }).ok, true);
  assert.strictEqual(Calc.admissibilityStatus(g, 'ST', { admin: true, v1g0o0: true, v0g1o0: true }).ok, false);
  assert.strictEqual(Calc.admissibilityStatus(g, 'ST', { admin: false, v1g0o0: true, v1g1o0: true }).ok, false);
});
t('full 2026 S&T scenario and thresholds', () => {
  const state = { domain: 'ST', adm: { admin: true, v0g0o0: true, v0g1o0: true }, values: {
    'pedagogy.cours': { n: 10 }, 'pedagogy.td': { n: 12 }, 'pedagogy.master': { n: 5 },
    'research.pubAplus': { p1: 1 }, 'research.pubB': { p2: 2 }, 'research.doctorat': { n: 1 } } };
  const r = Calc.evaluate(G['2026'], state);
  assert.strictEqual(r.pedagogy.score, 60 + 15 + 10);
  assert.strictEqual(r.research.score, 160 + 40 + 40);
  assert.ok(r.pedagogy.ok && r.research.ok && r.eligible);
  assert.strictEqual(Calc.evaluate(G['2026'], { ...state, domain: 'SHS' }).research.min, 120);
});
t('2028 thresholds', () => {
  const r = Calc.evaluate(G['2028'], { domain: 'SHS', values: {} });
  assert.deepStrictEqual([r.pedagogy.min, r.research.min, r.eligible], [150, 200, false]);
});
t('every item has 3 languages', () => {
  const check = (o, where) => ['fr','en','ar'].forEach(l => assert.ok(o && o[l], `${where} missing ${l}`));
  Object.values(G).forEach(g => {
    check(g.title, g.id); check(g.admin, g.id + ' admin');
    g.sections.forEach(s => s.groups.forEach(gr => { check(gr.title, s.id); gr.items.forEach(i => { check(i.label, i.id); if (i.bonus) check(i.bonus.label, i.id + ' bonus'); }); }));
    Object.values(g.admissibility).forEach(vs => vs.forEach(v => v.groups.forEach(gr => gr.options.forEach(o => check(o, 'adm')))));
  });
});
console.log(`\n${n} tests passed`);
