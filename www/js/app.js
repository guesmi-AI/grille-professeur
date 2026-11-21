(function () {
  'use strict';
  const GRIDS = window.GRIDS, I18N = window.I18N, Calc = window.Calc;
  const STORE_KEY = 'grille-professeur-v1';

  /* ---------------- state ---------------- */
  const blankGridState = () => ({ domain: 'ST', alphabetical: false, adm: {}, values: {} });
  let state = load();

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE_KEY));
      if (s && s.data) return s;
    } catch (e) { /* ignore */ }
    const navLang = (navigator.language || 'fr').slice(0, 2);
    return { lang: ['ar', 'fr', 'en'].includes(navLang) ? navLang : 'fr', grid: null, step: 'grid', data: { '2026': blankGridState(), '2028': blankGridState() } };
  }
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } }

  const t = () => I18N[state.lang];
  const tx = (o) => (o ? o[state.lang] || o.fr : '');
  const grid = () => GRIDS[state.grid];
  const gs = () => state.data[state.grid];
  const fmt = (n) => String(Math.round(n * 100) / 100);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function steps() {
    const s = ['grid'];
    if (state.grid) {
      s.push('adm');
      grid().sections.forEach((sec) => s.push(sec.id));
      s.push('result');
    }
    return s;
  }

  /* ---------------- shell ---------------- */
  const $app = document.getElementById('app');

  function applyLang() {
    const T = t();
    document.documentElement.lang = state.lang;
    document.documentElement.dir = T.dir;
    document.title = T.appName + ' — ' + T.appTagline;
    document.getElementById('brand-name').textContent = T.appName;
    document.getElementById('brand-tag').textContent = T.appTagline;
    document.querySelectorAll('.lang-btn').forEach((b) => b.setAttribute('aria-pressed', b.dataset.lang === state.lang ? 'true' : 'false'));
    document.getElementById('footer-note').textContent = T.disclaimer;
  }

  function render() {
    applyLang();
    if (!steps().includes(state.step)) state.step = 'grid';
    renderStepper();
    const step = state.step;
    let html = '';
    if (step === 'grid') html = viewGrid();
    else if (step === 'adm') html = viewAdm();
    else if (step === 'result') html = viewResult();
    else html = viewSection(grid().sections.find((s) => s.id === step));
    $app.innerHTML = html + viewNav();
    bind();
    updateScores();
    renderScorebar();
    save();
  }

  function renderStepper() {
    const T = t();
    const el = document.getElementById('stepper');
    const list = steps();
    const cur = list.indexOf(state.step);
    el.innerHTML = list.map((s, i) => `<button class="step ${i === cur ? 'is-current' : ''} ${i < cur ? 'is-done' : ''}" data-goto="${s}" ${i === cur ? 'aria-current="step"' : ''}>
        <span class="step-num">${i + 1}</span><span class="step-label">${esc(T.steps[s])}</span></button>`).join('');
    el.querySelectorAll('[data-goto]').forEach((b) => b.addEventListener('click', () => go(b.dataset.goto)));
    const curEl = el.querySelector('.is-current');
    if (curEl && curEl.scrollIntoView) curEl.scrollIntoView({ block: 'nearest', inline: 'center' });
  }

  function go(step) { state.step = step; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  /* ---------------- views ---------------- */
  function viewGrid() {
    const T = t();
    const card = (id, badge) => {
      const g = GRIDS[id];
      const th = g.thresholds;
      return `<button class="grid-card ${state.grid === id ? 'is-selected' : ''}" data-grid="${id}">
        <span class="grid-year">${id}</span>
        <span class="badge ${id === '2026' ? 'badge-ok' : 'badge-info'}">${esc(badge)}</span>
        <span class="grid-title">${esc(tx(g.title))}</span>
        <span class="grid-sub">${esc(tx(g.subtitle))}</span>
        <span class="grid-th">${esc(T.thresholdsLine(th.pedagogy, th.research.ST, th.research.SHS))}</span>
      </button>`;
    };
    return `<section class="panel">
      <h1>${esc(T.chooseGrid)}</h1>
      <p class="hint">${esc(T.chooseGridHint)}</p>
      <div class="grid-cards">${card('2026', T.current)}${card('2028', T.draft)}</div>
    </section>`;
  }

  function viewAdm() {
    const T = t(), g = grid(), s = gs();
    const variants = g.admissibility[s.domain];
    const chk = (key, label) => `<label class="check"><input type="checkbox" data-adm="${key}" ${s.adm[key] ? 'checked' : ''}><span>${esc(label)}</span></label>`;
    return `<section class="panel">
      <h1>${esc(T.admTitle)}</h1>
      <p class="hint">${esc(T.admHint)}</p>
      <div class="field">
        <span class="field-label">${esc(T.domain)}</span>
        <div class="seg" role="radiogroup">
          ${['ST', 'SHS'].map((d) => `<label class="seg-opt"><input type="radio" name="domain" value="${d}" ${s.domain === d ? 'checked' : ''}><span>${esc(T[d])}</span></label>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-head"><h2>${esc(T.adminCond)}</h2><span class="status" id="st-admin"></span></div>
        ${chk('admin', tx(g.admin))}
      </div>
      <div class="card">
        <div class="card-head"><h2>${esc(T.sciCond)}</h2><span class="status" id="st-sci"></span></div>
        ${variants.map((v, vi) => `<div class="variant" id="variant-${vi}">
          <div class="variant-head"><h3>${esc(tx(v.label))}</h3><span class="status" id="st-v${vi}"></span></div>
          ${v.groups.map((gr, gi) => `<fieldset class="cond-group">
              <legend>${esc(tx(gr.label))} <small>(${esc(T.oneOf)})</small></legend>
              ${gr.options.map((o, oi) => chk(`v${vi}g${gi}o${oi}`, tx(o))).join('')}
            </fieldset>`).join('')}
        </div>`).join(`<div class="or">— ${state.lang === 'ar' ? 'أو' : state.lang === 'en' ? 'or' : 'ou'} —</div>`)}
      </div>
      <div class="verdict" id="adm-verdict"></div>
    </section>`;
  }

  function ruleText(it) {
    const T = t();
    let r = '';
    if (it.type === 'count') r = `${fmt(it.unit)} ${T.pts} / ${T.perUnit[it.unitLabel] || T.perUnit.item}`;
    else if (it.type === 'weighted') r = `${fmt(it.unit)} ${T.pts} / publication`;
    else if (it.type === 'fixed') r = `${fmt(it.unit)} ${T.pts}`;
    if (it.cap != null) r += `${r ? ' · ' : ''}${T.max} ${fmt(it.cap)} ${T.pts}`;
    return r;
  }

  function numInput(key, field, label, value) {
    return `<label class="num">
      <span class="num-label">${esc(label)}</span>
      <span class="num-ctl">
        <button type="button" class="num-btn" data-dec="${key}|${field}" aria-label="−">−</button>
        <input type="number" inputmode="decimal" min="0" step="any" data-key="${key}" data-field="${field}" value="${value ? esc(value) : ''}" placeholder="0">
        <button type="button" class="num-btn" data-inc="${key}|${field}" aria-label="+">+</button>
      </span>
    </label>`;
  }

  function viewItem(sec, it) {
    const T = t();
    const key = sec.id + '.' + it.id;
    const v = gs().values[key] || {};
    let inputs = '';
    if (it.type === 'count') inputs = numInput(key, 'n', T.units[it.unitLabel] || T.units.item, v.n);
    else if (it.type === 'weighted') inputs = gs().alphabetical
      ? numInput(key, 'p1', T.posAll, v.p1)
      : numInput(key, 'p1', T.pos1, v.p1) + numInput(key, 'p2', T.pos2, v.p2) + numInput(key, 'p3', T.pos3, v.p3);
    else if (it.type === 'points') inputs = numInput(key, 'pts', `${T.enterPoints} (${T.max} ${it.cap})`, v.pts);
    else if (it.type === 'fixed') inputs = `<label class="check check-inline"><input type="checkbox" data-key="${key}" data-field="on" ${v.on ? 'checked' : ''}><span>${esc(T.yes)}</span></label>`;
    else if (it.type === 'choice') inputs = `<div class="choices">${it.options.map((o) => `<label class="check"><input type="radio" name="${key}" data-key="${key}" data-field="value" value="${o.value}" ${Number(v.value || 0) === o.value ? 'checked' : ''}><span>${esc(tx(o.label))}</span></label>`).join('')}</div>`;
    if (it.bonus) inputs += numInput(key, 'b', tx(it.bonus.label), v.b);
    return `<div class="item">
      <div class="item-main">
        <div class="item-text"><span class="item-label">${esc(tx(it.label))}</span>${ruleText(it) ? `<span class="item-rule">${esc(ruleText(it))}</span>` : ''}</div>
        <div class="item-score" id="sc-${key.replace('.', '-')}">0</div>
      </div>
      <div class="item-inputs">${inputs}</div>
    </div>`;
  }

  function viewSection(sec) {
    const T = t(), g = grid();
    let thr = '';
    if (sec.kind === 'pedagogy') thr = `${T.min}: ${g.thresholds.pedagogy} ${T.pts}`;
    if (sec.kind === 'research') thr = `${T.min}: ${g.thresholds.research[gs().domain]} ${T.pts} (${T[gs().domain]})`;
    const alpha = sec.kind === 'research'
      ? `<label class="check check-alpha"><input type="checkbox" id="alpha" ${gs().alphabetical ? 'checked' : ''}><span>${esc(T.alphabetical)}</span></label>` : '';
    return `<section class="panel">
      <div class="sec-head"><h1>${esc(tx(sec.title))}</h1><div class="sec-total"><span id="sec-total">0</span> ${esc(T.pts)}</div></div>
      ${thr ? `<p class="hint">${esc(thr)}</p>` : ''}
      ${alpha}
      ${sec.groups.map((gr) => `<div class="card">
          <div class="card-head"><h2>${esc(tx(gr.title))}</h2></div>
          ${gr.note ? `<p class="note">${esc(tx(gr.note))}</p>` : ''}
          ${gr.items.map((it) => viewItem(sec, it)).join('')}
        </div>`).join('')}
    </section>`;
  }

  function meter(label, score, min) {
    const pct = min ? Math.min(100, (score / min) * 100) : 100;
    const ok = score >= min;
    const T = t();
    return `<div class="meter ${ok ? 'is-ok' : ''}">
      <div class="meter-top"><span>${esc(label)}</span><strong>${fmt(score)} / ${min} ${esc(T.pts)}</strong></div>
      <div class="meter-bar"><span style="width:${pct}%"></span></div>
      <div class="meter-foot">${ok ? '✓ ' + esc(T.satisfied) : esc(T.missing(fmt(min - score)))}</div>
    </div>`;
  }

  function viewResult() {
    const T = t(), g = grid(), s = gs();
    const r = Calc.evaluate(g, s);
    const rows = [];
    g.sections.forEach((sec) => {
      const secRows = [];
      sec.groups.forEach((gr) => gr.items.forEach((it) => {
        const sc = r.sections[sec.id].items[it.id];
        if (sc.total > 0) secRows.push(`<tr><td>${esc(tx(it.label))}${sc.capped ? ` <em class="cap">(${esc(T.capped)})</em>` : ''}</td><td class="n">${fmt(sc.total)}</td></tr>`);
      }));
      rows.push(`<tr class="sec-row"><th>${esc(tx(sec.title))}</th><th class="n">${fmt(r.sections[sec.id].total)}</th></tr>`);
      rows.push(secRows.length ? secRows.join('') : `<tr><td colspan="2" class="muted">${esc(T.nothing)}</td></tr>`);
    });
    return `<section class="panel">
      <h1>${esc(T.resultTitle)}</h1>
      <p class="hint">${esc(tx(g.title))} · ${esc(T[s.domain])}</p>
      <div class="verdict big ${r.eligible ? 'is-ok' : 'is-ko'}">${r.eligible ? '✓' : '✗'} ${esc(r.eligible ? T.eligible : T.notEligible)}</div>
      <div class="meters">
        <div class="meter ${r.admissibility.ok ? 'is-ok' : ''}">
          <div class="meter-top"><span>${esc(T.steps.adm)}</span><strong>${esc(r.admissibility.ok ? T.admissible : T.notAdmissible)}</strong></div>
          <div class="meter-foot">${esc(T.adminCond)} : ${esc(r.admissibility.adminOk ? T.satisfied : T.notSatisfied)} · ${esc(T.sciCond)} : ${esc(r.admissibility.scientificOk ? T.satisfied : T.notSatisfied)}</div>
        </div>
        ${meter(T.steps.pedagogy, r.pedagogy.score, r.pedagogy.min)}
        ${meter(T.steps.research, r.research.score, r.research.min)}
        <div class="meter total"><div class="meter-top"><span>${esc(T.total)}</span><strong>${fmt(r.total)} ${esc(T.pts)}</strong></div></div>
      </div>
      <div class="card">
        <div class="card-head"><h2>${esc(T.detail)}</h2></div>
        <table class="table"><thead><tr><th>${esc(T.item)}</th><th class="n">${esc(T.points)}</th></tr></thead><tbody>${rows.join('')}</tbody>
        <tfoot><tr><th>${esc(T.total)}</th><th class="n">${fmt(r.total)}</th></tr></tfoot></table>
      </div>
      <div class="card">
        <div class="card-head"><h2>${esc(T.observations)}</h2></div>
        <ul class="obs">${g.observations.map((o) => `<li>${esc(tx(o))}</li>`).join('')}</ul>
      </div>
      <div class="actions no-print">
        <button class="btn btn-primary" id="btn-print">${esc(T.print)}</button>
        <button class="btn btn-ghost" id="btn-reset">${esc(T.reset)}</button>
      </div>
      <p class="muted small">${esc(T.saved)}</p>
    </section>`;
  }

  function viewNav() {
    const T = t();
    const list = steps();
    const i = list.indexOf(state.step);
    if (state.step === 'grid') return '';
    const prev = list[i - 1], next = list[i + 1];
    return `<nav class="nav no-print">
      ${prev ? `<button class="btn btn-ghost" data-goto="${prev}">${state.lang === 'ar' ? '→' : '←'} ${esc(T.prev)}</button>` : '<span></span>'}
      ${next ? `<button class="btn btn-primary" data-goto="${next}">${esc(next === 'result' ? T.seeResult : T.next)} ${state.lang === 'ar' ? '←' : '→'}</button>` : ''}
    </nav>`;
  }

  /* ---------------- live updates ---------------- */
  function renderScorebar() {
    const bar = document.getElementById('scorebar');
    if (!state.grid || state.step === 'grid' || state.step === 'result') { bar.hidden = true; document.body.classList.remove('has-bar'); return; }
    bar.hidden = false; document.body.classList.add('has-bar');
    updateScorebar();
  }

  function updateScorebar() {
    if (!state.grid) return;
    const T = t();
    const r = Calc.evaluate(grid(), gs());
    const chip = (label, sc, min) => `<div class="chip ${sc >= min ? 'is-ok' : ''}"><span>${esc(label)}</span><strong>${fmt(sc)}<small>/${min}</small></strong></div>`;
    document.getElementById('scorebar').innerHTML = `<div class="scorebar-in">
      <div class="chip ${r.admissibility.ok ? 'is-ok' : ''}"><span>${esc(T.steps.adm)}</span><strong>${r.admissibility.ok ? '✓' : '✗'}</strong></div>
      ${chip(T.steps.pedagogy, r.pedagogy.score, r.pedagogy.min)}
      ${chip(T.steps.research, r.research.score, r.research.min)}
      <div class="chip chip-total"><span>${esc(T.total)}</span><strong>${fmt(r.total)}</strong></div>
    </div>`;
  }

  function updateScores() {
    if (!state.grid) return;
    const T = t(), g = grid(), s = gs();
    const r = Calc.evaluate(g, s);
    const sec = g.sections.find((x) => x.id === state.step);
    if (sec) {
      Object.entries(r.sections[sec.id].items).forEach(([id, sc]) => {
        const el = document.getElementById(`sc-${sec.id}-${id}`);
        if (el) { el.textContent = `${fmt(sc.total)} ${T.pts}`; el.classList.toggle('is-on', sc.total > 0); el.classList.toggle('is-capped', sc.capped); el.title = sc.capped ? T.capped : ''; }
      });
      const tot = document.getElementById('sec-total');
      if (tot) tot.textContent = fmt(r.sections[sec.id].total);
    }
    if (state.step === 'adm') {
      const a = r.admissibility;
      const st = (id, ok) => { const el = document.getElementById(id); if (el) { el.textContent = ok ? T.satisfied : T.notSatisfied; el.className = 'status ' + (ok ? 'is-ok' : 'is-ko'); } };
      st('st-admin', a.adminOk); st('st-sci', a.scientificOk);
      a.variants.forEach((v, i) => { st('st-v' + i, v.ok); const el = document.getElementById('variant-' + i); if (el) el.classList.toggle('is-ok', v.ok); });
      const vd = document.getElementById('adm-verdict');
      vd.className = 'verdict ' + (a.ok ? 'is-ok' : 'is-ko');
      vd.textContent = (a.ok ? '✓ ' : '✗ ') + (a.ok ? T.admissible : T.notAdmissible);
    }
    updateScorebar();
  }

  /* ---------------- events ---------------- */
  function setVal(key, field, value) {
    const vals = gs().values;
    vals[key] = Object.assign({}, vals[key], { [field]: value });
    save();
    updateScores();
  }

  function bind() {
    $app.querySelectorAll('[data-goto]').forEach((b) => b.addEventListener('click', () => go(b.dataset.goto)));
    $app.querySelectorAll('[data-grid]').forEach((b) => b.addEventListener('click', () => { state.grid = b.dataset.grid; go('adm'); }));
    $app.querySelectorAll('input[name="domain"]').forEach((r) => r.addEventListener('change', () => { gs().domain = r.value; gs().adm = Object.assign({}, { admin: gs().adm.admin }); render(); }));
    $app.querySelectorAll('[data-adm]').forEach((c) => c.addEventListener('change', () => { gs().adm[c.dataset.adm] = c.checked; save(); updateScores(); }));
    const alpha = document.getElementById('alpha');
    if (alpha) alpha.addEventListener('change', () => {
      gs().alphabetical = alpha.checked;
      if (alpha.checked) {  // merge positions into a single count
        Object.keys(gs().values).forEach((k) => { const v = gs().values[k]; if (v && (v.p2 || v.p3)) { v.p1 = (Number(v.p1) || 0) + (Number(v.p2) || 0) + (Number(v.p3) || 0); v.p2 = 0; v.p3 = 0; } });
      }
      render();
    });
    $app.querySelectorAll('input[data-key]').forEach((inp) => {
      const ev = inp.type === 'number' ? 'input' : 'change';
      inp.addEventListener(ev, () => {
        let val;
        if (inp.type === 'checkbox') val = inp.checked;
        else if (inp.type === 'radio') val = Number(inp.value);
        else val = inp.value;
        setVal(inp.dataset.key, inp.dataset.field, val);
      });
    });
    const step = (sel, delta) => $app.querySelectorAll(sel).forEach((b) => b.addEventListener('click', () => {
      const [key, field] = (b.dataset.inc || b.dataset.dec).split('|');
      const inp = $app.querySelector(`input[data-key="${key}"][data-field="${field}"]`);
      const n = Math.max(0, (Number(inp.value) || 0) + delta);
      inp.value = n || '';
      setVal(key, field, String(n));
    }));
    step('[data-inc]', 1); step('[data-dec]', -1);
    const pr = document.getElementById('btn-print');
    if (pr) pr.addEventListener('click', () => window.print());
    const rs = document.getElementById('btn-reset');
    if (rs) rs.addEventListener('click', () => {
      if (rs.dataset.armed) { state.data[state.grid] = blankGridState(); go('adm'); return; }
      rs.dataset.armed = '1'; rs.classList.add('btn-danger'); rs.textContent = t().resetConfirm;
      setTimeout(() => { if (rs.isConnected) { delete rs.dataset.armed; rs.classList.remove('btn-danger'); rs.textContent = t().reset; } }, 5000);
    });
  }

  document.querySelectorAll('.lang-btn').forEach((b) => b.addEventListener('click', () => { state.lang = b.dataset.lang; render(); }));
  document.getElementById('brand').addEventListener('click', (e) => { e.preventDefault(); go('grid'); });

  render();

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
