/* ============================================================
   KDF 층별구조 UI  (작성: 김동현 부장 · 2026-11-10)
   - KDF 보령 / KDF 아산 메인 탭 (원본 층 배열 그대로 표시)
   - 일신케미칼: 별도 탭, '🏭 일신케미칼 보기' 버튼으로 표시 (전체 목록에는 항상 포함)
   - 업체 비교 · BI / 계산 검증(두께·비중) 탭
   의존: index.html 의 layerData, structPHR, formatStruct, typeBadge, switchTab, sumPF, shtHidden, setVizFilter
   ============================================================ */

(function injectKdfCss(){
  const css = `
  .kdf-banner{padding:8px 14px;background:#f0fdfa;border:1px solid #99f6e4;border-radius:8px;margin-bottom:1rem;font-size:12.5px;color:#0f766e;line-height:1.55}
  .kdf-filters{display:flex;gap:8px;margin-bottom:1rem;flex-wrap:wrap;align-items:center}
  .kdf-filters select{width:auto;min-width:110px}
  .kdf-chk{font-size:12.5px;color:var(--text2);display:flex;align-items:center;gap:5px;white-space:nowrap;cursor:pointer}
  .kdf-chk input{width:auto}
  .kdf-count{margin-left:auto;font-size:12.5px;color:var(--text3);background:var(--surface3);padding:5px 12px;border-radius:20px;white-space:nowrap}
  .kdf-count strong{color:var(--teal)}
  .kdf-sub{font-size:10.5px;color:var(--text3);font-weight:500}
  .kdf-gf{display:inline-block;font-size:9.5px;font-weight:800;color:#6d28d9;background:#ede9fe;border-radius:4px;padding:0 4px;margin-left:3px;vertical-align:middle}
  .kdf-chop{display:inline-block;font-size:9.5px;font-weight:800;color:#9a3412;background:#ffedd5;border-radius:4px;padding:0 4px;margin-left:3px;vertical-align:middle}
  .kdf-table td{vertical-align:middle}
  .kdf-table tr.kdf-row{cursor:pointer}
  .kdf-table tr.kdf-row:hover td{background:#f8fafc}
  .kdf-table tr.kdf-open td{background:#f0fdfa}
  .kdf-name{font-size:12.5px;font-weight:600;color:var(--text);white-space:normal;max-width:230px;line-height:1.35}
  .kdf-grp{font-size:10.5px;color:var(--text3);white-space:nowrap}
  .lchips{display:flex;flex-wrap:wrap;gap:3px;align-items:center}
  .lchip{display:inline-flex;align-items:baseline;gap:3px;border:1px solid;border-radius:6px;padding:1px 6px;font-size:11px;white-space:nowrap;line-height:1.5}
  .lchip b{font-size:11.5px}
  .lchip i{font-style:normal;font-size:10px;opacity:.8}
  .lchip.asm{border-style:dashed}
  .lsep{color:#cbd5e1;font-size:11px}
  .bi-v{font-weight:800;font-size:13px;letter-spacing:-.3px}
  .jb{display:inline-block;font-size:10.5px;font-weight:700;border-radius:10px;padding:0 7px;margin-top:2px;white-space:nowrap}
  .jb-양호{background:#dcfce7;color:#166534}.jb-주의{background:#fef3c7;color:#92400e}.jb-재검토{background:#fee2e2;color:#991b1b}.jb-단독{background:#f1f5f9;color:#475569}
  .fl{display:inline-block;font-size:11px;font-weight:800;border-radius:10px;padding:1px 8px;white-space:nowrap}
  .fl-0{background:#dcfce7;color:#166534}.fl-1{background:#fef3c7;color:#92400e}.fl-2{background:#fee2e2;color:#991b1b}
  .kdf-detail td{background:#fbfdfd!important;padding:0!important}
  .kdf-detail-in{padding:12px 16px 16px;display:grid;grid-template-columns:minmax(520px,1.4fr) 1fr;gap:16px}
  .kdf-detail-in table{font-size:12px;width:100%}
  .kdf-detail-in th{font-size:11px;padding:5px 8px}
  .kdf-detail-in td{padding:4px 8px}
  .kdf-detail-in td:last-child{padding-left:16px;white-space:nowrap}
  .kdf-note{font-size:12px;line-height:1.55;margin:0 0 6px;padding:6px 10px;border-radius:6px;background:#fff;border:1px solid var(--border)}
  .kdf-note.lv-상{border-left:3px solid #dc2626}.kdf-note.lv-중{border-left:3px solid #d97706}.kdf-note.lv-하{border-left:3px solid #94a3b8}.kdf-note.lv-참고{border-left:3px solid #0d9488}
  .kdf-h{font-size:12px;font-weight:800;color:var(--text2);margin:0 0 6px}
  .cmp-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-bottom:1.25rem}
  .cmp-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px 16px}
  .cmp-card h4{margin:0 0 8px;font-size:14px}
  .cmp-kv{display:flex;justify-content:space-between;font-size:12.5px;padding:3px 0;border-bottom:1px dashed var(--border)}
  .cmp-kv:last-child{border-bottom:none}
  .cmp-kv b{font-variant-numeric:tabular-nums}
  .bibar{position:relative;height:8px;width:120px;background:linear-gradient(90deg,#fee2e2 0,#fef3c7 30%,#dcfce7 45%,#dcfce7 55%,#fef3c7 70%,#fee2e2 100%);border-radius:4px;margin:3px auto 0}
  .bibar i{position:absolute;top:-3px;width:3px;height:14px;background:#0f172a;border-radius:2px}
  .bibar:after{content:'';position:absolute;left:50%;top:-2px;width:1px;height:12px;background:#64748b}
  .kdf-box{padding:12px 16px;border-radius:10px;font-size:12.5px;line-height:1.65;margin-bottom:1rem}
  .kdf-box.info{background:#eff6ff;border:1px solid #bfdbfe;color:#1e3a8a}
  .kdf-box.warn{background:#fffbeb;border:1px solid #fde68a;color:#78350f}
  .kdf-box ul{margin:4px 0 0 18px;padding:0}
  .kdf-sec{font-size:15px;font-weight:800;margin:1.25rem 0 .6rem;color:var(--text)}
  .num{text-align:right;font-variant-numeric:tabular-nums}
  .dpos{color:#b91c1c;font-weight:700}.dneg{color:#1d4ed8;font-weight:700}
  @media print{ .kdf-filters{display:none} }
  `;
  const st = document.createElement('style'); st.id = 'kdf-layer-css'; st.textContent = css; document.head.appendChild(st);
})();

/* ---------- 공통 ---------- */
const KDF_TY = {
  '투명':    {bg:'#dbeafe', fg:'#1e40af', bd:'#93c5fd', eng:'Wear Layer'},
  '인쇄지':  {bg:'#fef3c7', fg:'#92400e', bd:'#fcd34d', eng:'Printed Layer'},
  '중지':    {bg:'#d1fae5', fg:'#065f46', bd:'#6ee7b7', eng:'Core Layer'},
  'G/F':     {bg:'#ede9fe', fg:'#5b21b6', bd:'#c4b5fd', eng:'Glass Fiber'},
  '하지':    {bg:'#e0e7ff', fg:'#3730a3', bd:'#a5b4fc', eng:'Balance Layer'},
  '러버':    {bg:'#334155', fg:'#f8fafc', bd:'#0f172a', eng:'Rubber Back'},
  '벨벳':    {bg:'#fce7f3', fg:'#9d174d', bd:'#f9a8d4', eng:'Velvet Back'},
  'Acoustic':{bg:'#ccfbf1', fg:'#115e59', bd:'#5eead4', eng:'Acoustic Back'},
  '졸코팅':  {bg:'#ffedd5', fg:'#9a3412', bd:'#fdba74', eng:'Sol Coating'},
  'PE':      {bg:'#1e293b', fg:'#e2e8f0', bd:'#0f172a', eng:'PE Foam'},
};
const kdfEsc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function rhoTh(p, f){ p=+p||0; f=+f||0; return (100+p+f)/(100/1.4 + p/1.0 + f/2.5); }
const kdfF = (v, d=2) => (v==null || isNaN(v)) ? '—' : (+v).toFixed(d);
const kdfSign = (v, d=3) => (v==null || isNaN(v)) ? '—' : (v>=0?'+':'') + (+v).toFixed(d);
const KDF_KEY = {bor:'KDF 보령', asn:'KDF 아산'};

/* 레코드 → 층 배열 (KDF: 원본 layers / 일신·서해: 고정 슬롯 변환) */
function getLayers(r){
  if (Array.isArray(r.layers)) return r.layers.map(l=>({
    n:l.n, ty:l.ty, t:+l.t||0,
    p: l.p ?? l.pa ?? (l.ty==='G/F'?null:0), f: l.f ?? l.fa ?? (l.ty==='G/F'?null:0),
    rho:l.rho, assumed:!!l.assumed, assumedT:!!l.assumedT, src:l.src, chk:l.chk, memo:l.memo
  })).filter(l=>l.t>0);
  const L = [
    {n:'투명', ty:'투명', t:r.topT, p:r.topP, f:r.topF||0},
    {n:'인쇄지', ty:'인쇄지', t:r.printT||0.07, p:r.printP||8, f:0},
    {n:'중지[1]', ty:'중지', t:r.midT, p:r.midP, f:r.midF},
    {n:'G/F', ty:'G/F', t:r.gfT, p:r.gfP, f:r.gfF},
    {n:'중지[2]', ty:'중지', t:r.mid2T, p:r.mid2P, f:r.mid2F},
    {n:'중지[3]', ty:'중지', t:r.mid3T, p:r.mid3P, f:r.mid3F},
    {n:'하지', ty:'하지', t:r.baseT, p:r.baseP, f:r.baseF},
    {n:'PE 폼', ty:'PE', t:r.formT, p:null, f:null},
  ];
  return L.filter(l=>(+l.t||0)>0).map(l=>({...l, t:+l.t}));
}
function kdfShortName(l){
  if (l.ty==='투명') return '투명';
  if (l.ty==='인쇄지') return '인쇄';
  if (l.ty==='G/F') return 'G/F';
  return String(l.n).replace(/중지\[(\d)\]/,'중$1').replace(/하지\[(\d)\]/,'하$1').replace(/\s*\(.*?\)\s*/g,'').slice(0,9);
}
function kdfPhrTxt(l){
  if (l.p==null && l.f==null) return '';
  if (l.ty==='투명' || l.ty==='인쇄지' || (+l.f||0)===0) return String(l.p ?? 0);
  return `${l.p}/${l.f}`;
}
function layerChips(r){
  const L = getLayers(r);
  return `<div class="lchips">${L.map(l=>{
    const c = KDF_TY[l.ty] || KDF_TY['중지'];
    const ph = kdfPhrTxt(l);
    const tip = `${l.n} · ${l.t.toFixed(2)} mm${ph?' · '+ph:''}${l.assumed?' (PHR 미기재 → 가정값)':''}${l.assumedT?' (두께 누락 → 가정값)':''}`;
    return `<span class="lchip${(l.assumed||l.assumedT)?' asm':''}" style="background:${c.bg};color:${c.fg};border-color:${c.bd}" title="${kdfEsc(tip)}">${kdfEsc(kdfShortName(l))} <b>${l.t.toFixed(2)}</b>${ph?`<i>${ph}${l.assumed?'*':''}</i>`:''}</span>`;
  }).join('<span class="lsep">›</span>')}</div>`;
}
function biCell(r, compact){
  const b = r.bi;
  if (!b || b.bi==null) return '<span class="kdf-sub">—</span>';
  const j = String(b.judge||'');
  const jc = j.startsWith('단독') ? '단독' : j;
  const col = j==='재검토' ? '#b91c1c' : j==='주의' ? '#b45309' : '#0f766e';
  const tip = `BI ${b.bi.toFixed(4)} · 그룹기준 ${kdfF(b.grp,4)} · ΔBI ${kdfSign(b.dbi,4)} · ${b.trend||''} · 모델 ${b.model||''}`;
  if (compact) return `<div title="${kdfEsc(tip)}"><div class="bi-v" style="color:${col}">${b.bi.toFixed(3)}</div><span class="jb jb-${jc}">${kdfEsc(j)}</span></div>`;
  return `<div title="${kdfEsc(tip)}" style="text-align:center"><div class="bi-v" style="color:${col}">${b.bi.toFixed(3)}</div>
    <div class="kdf-sub">Δ ${kdfSign(b.dbi,3)}</div><span class="jb jb-${jc}">${kdfEsc(j)}</span></div>`;
}

/* ---------- 계산 검증 ---------- */
let _kdfAddMed = null;
function kdfCompanyAdd(){
  // 업체(공장)별 '총두께 − 표기두께' 중앙값 (보령 +0.07, 아산 대부분 +0.02 등 공장 기준이 다름)
  if (_kdfAddMed) return _kdfAddMed;
  const g = {};
  layerData.forEach(r=>{
    const lab = parseFloat(String(r.struct).split('/')[0]); if (isNaN(lab)) return;
    const sum = getLayers(r).reduce((a,l)=>a+l.t,0);
    (g[r.co] = g[r.co] || []).push(+(sum-lab).toFixed(3));
  });
  _kdfAddMed = {};
  Object.entries(g).forEach(([k,a])=>{ a.sort((x,y)=>x-y); _kdfAddMed[k] = a[Math.floor(a.length/2)]; });
  return _kdfAddMed;
}
function verifyRec(r){
  if (r._v) return r._v;
  const L = getLayers(r);
  const sumT = +L.reduce((a,l)=>a+l.t,0).toFixed(3);
  const label = parseFloat(String(r.struct).split('/')[0]);
  const orig = r.comp==='KDF' ? r.totOrig : r.setT;
  const c = structPHR(r);
  let vn=0, vd=0;
  L.forEach(l=>{ if (l.ty==='PE') return; vn += l.t*rhoTh(l.p||0, l.f||0); vd += l.t; });
  const densVol = vd ? vn/vd : null;
  const densOrig = r.densOrig ?? null;
  const flags = [];
  const add = isNaN(label) ? null : +(sumT-label).toFixed(3);
  const med = kdfCompanyAdd()[r.co];
  if (orig!=null && Math.abs(sumT-orig) > 0.005) flags.push({lv:'상', k:'두께', t:`층 두께 합 ${sumT.toFixed(2)} ≠ ${r.comp==='KDF'?'원본 계':'설정두께'} ${(+orig).toFixed(2)}`});
  // 허용 기준: 같은 공장 중앙값 + KDF는 +0.02(UV/하우스·일반 일부)·+0.07(G/F·보령) 두 기준을 모두 인정
  const allow = [med].concat(r.comp==='KDF' ? [0.02, 0.07] : []).filter(x=>x!=null);
  if (add!=null && allow.length && Math.min(...allow.map(a=>Math.abs(add-a))) > 0.015)
    flags.push({lv:'중', k:'두께', t:`총두께 ${sumT.toFixed(2)} = 표기 ${label} ${kdfSign(add,2)} (기준 ${[...new Set(allow.map(a=>kdfSign(a,2)))].join(' 또는 ')})`});
  if (r.densRaw) flags.push({lv:'하', k:'비중', t:`원본 계 비중 ${r.densRaw} 표기 — 소수점 누락(${(+r.densOrig).toFixed(3)}로 읽음)`});
  const dS = densOrig ? c.density - densOrig : null;
  if (dS!=null && Math.abs(dS) > 0.05) flags.push({lv:'상', k:'비중', t:`계산 비중 ${c.density.toFixed(3)} vs 원본 ${(+densOrig).toFixed(3)} (Δ ${kdfSign(dS)}) — 원본 계 비중 재검증`});
  else if (dS!=null && Math.abs(dS) > 0.02) flags.push({lv:'중', k:'비중', t:`계산 비중 ${c.density.toFixed(3)} vs 원본 ${(+densOrig).toFixed(3)} (Δ ${kdfSign(dS)})`});
  let lyrBad = 0, lyrWarn = 0;
  L.forEach(l=>{
    if (l.rho==null || l.p==null || l.ty==='G/F') return;
    const th = rhoTh(l.p, l.f), d = l.rho - th;
    if (Math.abs(d) > 0.05) { lyrBad++; flags.push({lv:'상', k:'층비중', t:`${l.n} ${kdfPhrTxt(l)} 비중 ${l.rho} — 이론 ${th.toFixed(3)} (Δ ${kdfSign(d)})`}); }
    else if (Math.abs(d) > 0.02) { lyrWarn++; flags.push({lv:'중', k:'층비중', t:`${l.n} ${kdfPhrTxt(l)} 비중 ${l.rho} — 이론 ${th.toFixed(3)} (Δ ${kdfSign(d)})`}); }
  });
  L.forEach(l=>{
    if (l.assumed) flags.push({lv:'중', k:'가정값', t:`${l.n}: 원본 PHR 미기재 → 평가시트 가정값 ${l.p}/${l.f} 적용`});
    if (l.assumedT) flags.push({lv:'상', k:'가정값', t:`${l.n}: 원본 두께 누락 → ${l.t} mm 가정 적용`});
  });
  (r.notes||[]).forEach(n=>{ const m = /^\[(상|중|하)/.exec(n); flags.push({lv:m?m[1]:'참고', k:'이상점검', t:n}); });
  const lvl = flags.some(f=>f.lv==='상') ? 2 : flags.some(f=>f.lv==='중') ? 1 : 0;
  r._v = {sumT, label, orig, add, densSite:c.density, densVol, densOrig, dS, dVol: densVol!=null? c.density-densVol : null, lyrBad, lyrWarn, flags, lvl};
  return r._v;
}
function flagBadge(v){
  if (!v.flags.length) return '<span class="fl fl-0">✓</span>';
  const n = v.flags.filter(f=>f.lv==='상'||f.lv==='중').length || v.flags.length;
  return `<span class="fl fl-${v.lvl}" title="${kdfEsc(v.flags.map(f=>`[${f.lv}] ${f.t}`).join('\n'))}">⚠ ${n}</span>`;
}

/* ---------- KDF 보령 / 아산 탭 ---------- */
function kdfInit(){
  ['bor','asn'].forEach(key=>{
    const co = KDF_KEY[key];
    const data = layerData.filter(r=>r.co===co);
    const tSel = document.getElementById(`kdf-${key}-type`);
    if (tSel && tSel.options.length<=1) [...new Set(data.map(r=>r.type))].forEach(t=>tSel.add(new Option(t,t)));
    const thSel = document.getElementById(`kdf-${key}-t`);
    if (thSel && thSel.options.length<=1) [...new Set(data.map(r=>r.labelT).filter(Boolean))].sort((a,b)=>a-b).forEach(t=>thSel.add(new Option(`${(+t).toFixed(1)} T`, t)));
    const cnt = document.getElementById(`tab-cnt-${key}`); if (cnt) cnt.textContent = `(${data.length}종)`;
    renderKdfTable(key);
  });
  applyIskHidden();
}
const _kdfOpen = new Set();
function renderKdfTable(key){
  const co = KDF_KEY[key];
  const $v = id => (document.getElementById(`kdf-${key}-${id}`)||{}).value || '';
  const q = $v('q').toLowerCase(), type = $v('type'), gf = $v('gf'), th = $v('t'), judge = $v('judge');
  const onlyFlag = !!(document.getElementById(`kdf-${key}-flag`)||{}).checked;
  const data = layerData.filter(r=>r.co===co).filter(r=>{
    if (q && ![r.struct, r.name, r.group, r.type, r.no, r.src].join(' ').toLowerCase().includes(q)) return false;
    if (type && r.type!==type) return false;
    if (gf && (gf==='1')!==!!r.gf) return false;
    if (th && +r.labelT!==+th) return false;
    if (judge==='none' && r.bi) return false;
    if (judge && judge!=='none' && !(r.bi && String(r.bi.judge).startsWith(judge))) return false;
    if (onlyFlag && !verifyRec(r).flags.length) return false;
    return true;
  });
  const tb = document.getElementById(`kdf-${key}-tbody`); if (!tb) return;
  tb.innerHTML = data.map(r=>{
    const v = verifyRec(r), pf = sumPF(r), open = _kdfOpen.has(r.no);
    const tOk = v.orig==null || Math.abs(v.sumT-v.orig) <= 0.005;
    return `<tr class="kdf-row${open?' kdf-open':''}" onclick="kdfToggle(${r.no},'${key}')">
      <td style="font-weight:700;font-size:13px;">${r.no}</td>
      <td><span class="badge ${typeBadge(r.type)}" style="font-size:11px;">${kdfEsc(r.type)}</span>${r.gf?'<span class="kdf-gf">G/F</span>':''}${r.chop?'<span class="kdf-chop">Chop</span>':''}</td>
      <td><div class="kdf-grp">${kdfEsc(r.group)}</div><div class="kdf-name">${kdfEsc(r.name)}${r.manual?' <span class="kdf-sub" title="BI 평가시트 미수록 — 원본에서 직접 등록">＋</span>':''}</div></td>
      <td class="mono" style="font-weight:700;color:var(--teal);font-size:13px;white-space:nowrap;">${formatStruct(r.struct)}</td>
      <td>${layerChips(r)}</td>
      <td style="text-align:center;white-space:nowrap;"><div style="font-weight:700;${tOk?'':'color:#b91c1c'}">${v.sumT.toFixed(2)}</div><div class="kdf-sub">${v.orig!=null?(+v.orig).toFixed(2):'—'}</div></td>
      <td style="text-align:center;white-space:nowrap;"><div class="kdf-sub" title="원본 엑셀 계 비중">${v.densOrig?(+v.densOrig).toFixed(3):'—'}</div>
        <div style="font-weight:800;font-size:13.5px;color:var(--accent2);" title="사이트 계산 비중(현행 종합계산식)">${v.densSite.toFixed(3)}</div>
        ${v.dS!=null?`<div class="kdf-sub ${Math.abs(v.dS)>0.02?(v.dS>0?'dpos':'dneg'):''}">Δ ${kdfSign(v.dS)}</div>`:''}</td>
      <td style="text-align:center;white-space:nowrap;"><div style="font-weight:700;font-size:12px;color:#0369a1;">${pf.dotp}</div><div style="font-weight:700;font-size:12px;color:#6d28d9;">${pf.filler}</div></td>
      <td>${biCell(r)}</td>
      <td style="text-align:center;">${flagBadge(v)}</td>
    </tr>${open?kdfDetailRow(r,v):''}`;
  }).join('') || `<tr><td colspan="10" style="text-align:center;color:var(--text3);padding:2rem;">조건에 맞는 구조가 없습니다.</td></tr>`;
  const cnt = document.getElementById(`kdf-${key}-count`); if (cnt) cnt.textContent = data.length;
}
function kdfToggle(no, key){ _kdfOpen.has(no) ? _kdfOpen.delete(no) : _kdfOpen.add(no); renderKdfTable(key); }
function kdfDetailRow(r, v){
  const L = getLayers(r); let y = 0;
  const rows = L.map(l=>{
    const th = (l.p!=null && l.ty!=='G/F') ? rhoTh(l.p, l.f) : null;
    const d = (l.rho!=null && th!=null) ? l.rho-th : null;
    const c = KDF_TY[l.ty] || KDF_TY['중지'];
    const tr = `<tr><td><span class="lchip" style="background:${c.bg};color:${c.fg};border-color:${c.bd}">${kdfEsc(l.n)}</span></td>
      <td class="num">${l.t.toFixed(2)}${l.assumedT?'*':''}</td><td class="num">${y.toFixed(2)}–${(y+l.t).toFixed(2)}</td>
      <td class="num">${kdfPhrTxt(l)||'—'}${l.assumed?' <span class="kdf-sub">(가정)</span>':''}</td>
      <td class="num">${l.rho!=null?l.rho:'—'}</td><td class="num">${th!=null?th.toFixed(3):'—'}</td>
      <td class="num ${d!=null&&Math.abs(d)>0.02?(d>0?'dpos':'dneg'):''}">${d!=null?kdfSign(d):'—'}</td>
      <td class="kdf-sub">${kdfEsc(l.src||'')}</td></tr>`;
    y += l.t; return tr;
  }).join('');
  const b = r.bi;
  const biTxt = b ? `<div class="kdf-note lv-참고"><b>BI ${b.bi.toFixed(4)}</b> · 그룹 기준 ${kdfF(b.grp,4)} · ΔBI ${kdfSign(b.dbi,4)} · <b>${kdfEsc(b.judge)}</b><br>${kdfEsc(b.trend||'')} · 컬 환산 ${kdfF(b.curl,2)} mm(보정 전) · 모델 ${kdfEsc(b.model)} · 평가시트 ID ${kdfEsc(b.id)}</div>`
                  : `<div class="kdf-note lv-하">BI 미산출 — 평가시트(2026.10.29) 층별DB에 없는 구조입니다. 다음 평가시트 갱신 때 추가 필요.</div>`;
  const fl = v.flags.length ? v.flags.map(f=>`<div class="kdf-note lv-${f.lv}"><b>[${f.lv}·${kdfEsc(f.k)}]</b> ${kdfEsc(f.t)}</div>`).join('') : '<div class="kdf-note lv-참고">점검 항목 없음 ✓</div>';
  return `<tr class="kdf-detail"><td colspan="10"><div class="kdf-detail-in">
    <div><div class="kdf-h">층별 상세 (위→아래) · 원본 ${kdfEsc(r.ver||'')}</div>
      <table><thead><tr><th>층</th><th>두께</th><th>위치(mm)</th><th>DOTP/FILLER</th><th>원본 비중</th><th>이론 비중</th><th>편차</th><th>원본 셀</th></tr></thead><tbody>${rows}</tbody>
      <tfoot><tr><td><b>계</b></td><td class="num"><b>${v.sumT.toFixed(2)}</b></td><td></td><td></td><td class="num">${v.densOrig?(+v.densOrig).toFixed(3):'—'}</td><td class="num" title="체적가중 Σ(t·ρ)/Σt">${v.densVol?v.densVol.toFixed(3):'—'}</td><td></td><td class="kdf-sub">계산(현행식) ${v.densSite.toFixed(3)}</td></tr></tfoot></table>
      ${r.note?`<div class="kdf-sub" style="margin-top:6px;">${kdfEsc(r.note)}</div>`:''}
    </div>
    <div><div class="kdf-h">BI (컬 밸런스)</div>${biTxt}<div class="kdf-h" style="margin-top:10px;">점검 내용</div>${fl}</div>
  </div></td></tr>`;
}

/* ---------- 일신케미칼 숨기기 / 보기 ---------- */
let iskHidden = true;
try { iskHidden = localStorage.getItem('lvt_layer_isk_hidden') !== '0'; } catch(e) {}
function applyIskHidden(){
  const tab = document.getElementById('tab-layer-isk');
  const btn = document.getElementById('isk-toggle-btn');
  const vb  = document.getElementById('viz-btn-isk');
  if (tab) tab.style.display = iskHidden ? 'none' : '';
  if (vb)  vb.style.display  = iskHidden ? 'none' : '';
  if (btn) btn.textContent = iskHidden ? '🏭 일신케미칼 보기' : '🙈 일신케미칼 숨기기';
  if (iskHidden) {
    const box = document.getElementById('layer-isk');
    if (box && box.style.display !== 'none') {
      const t = document.querySelector("#page-layer .tab[onclick*=\"'layer-bor'\"]"); if (t) switchTab(t, 'layer-bor');
    }
    if (typeof vizFilter!=='undefined' && vizFilter==='일신케미칼') setVizFilter('KDF 보령');
  }
}
function toggleIskHidden(){
  iskHidden = !iskHidden;
  try { localStorage.setItem('lvt_layer_isk_hidden', iskHidden ? '1' : '0'); } catch(e) {}
  applyIskHidden();
  if (!iskHidden) { const t = document.getElementById('tab-layer-isk'); if (t) switchTab(t, 'layer-isk'); }
}

/* ---------- 구조 시각화 (layers 레코드) ---------- */
function kdfVizLayers(r){
  return getLayers(r).map(l=>{
    const c = KDF_TY[l.ty] || KDF_TY['중지'];
    return {name:l.n, eng:c.eng, t:l.t, p:+(l.p||0), f:+(l.f||0), face:c.bg, side:c.bd, top:'#ffffff', text:c.fg};
  });
}

/* ---------- 업체 비교 · BI ---------- */
const CMP_COS = () => ['KDF 보령','KDF 아산','일신케미칼'].concat(shtHidden ? [] : ['서해테크']);
let _cmpSel = {t:'5', w:'0.5', gf:''};
function kdfStats(co){
  const d = layerData.filter(r=>r.co===co);
  const mean = a => a.length ? a.reduce((x,y)=>x+y,0)/a.length : null;
  const bis = m => d.filter(r=>r.bi && r.bi.bi!=null && (m==null || (r.bi.model==='G/F')===m)).map(r=>r.bi);
  const j = arr => ({ok:arr.filter(b=>b.judge==='양호').length, warn:arr.filter(b=>b.judge==='주의').length, rev:arr.filter(b=>b.judge==='재검토').length});
  const g = bis(true), n = bis(false);
  return {n:d.length, gf:d.filter(r=>r.gf||r.gfT>0).length, dens:mean(d.map(r=>r.density)),
    filler:mean(d.map(r=>structPHR(r).filler)), dotp:mean(d.map(r=>structPHR(r).dotp)),
    biG:mean(g.map(b=>b.bi)), devG:mean(g.map(b=>Math.abs(b.bi-1))), nG:g.length, jG:j(g),
    biN:mean(n.map(b=>b.bi)), devN:mean(n.map(b=>Math.abs(b.bi-1))), nN:n.length, jN:j(n),
    flags:d.filter(r=>verifyRec(r).lvl===2).length};
}
function biBar(bi){ if (bi==null) return ''; const x = Math.max(0, Math.min(1, (bi-0.8)/0.4)); return `<div class="bibar" title="0.8 ← 1.0 → 1.2"><i style="left:calc(${(x*100).toFixed(1)}% - 1px)"></i></div>`; }
function renderLayerCompare(){
  const el = document.getElementById('layer-cmp-body'); if (!el) return;
  const cos = CMP_COS();
  const cards = cos.map(co=>{
    const s = kdfStats(co);
    const col = co==='일신케미칼'?'var(--blue)':co==='서해테크'?'var(--accent2)':'var(--teal)';
    return `<div class="cmp-card"><h4 style="color:${col}">${co}</h4>
      <div class="cmp-kv"><span>등록 구조</span><b>${s.n} <span class="kdf-sub">(G/F ${s.gf})</span></b></div>
      <div class="cmp-kv"><span>평균 비중 (계산)</span><b>${kdfF(s.dens,3)}</b></div>
      <div class="cmp-kv"><span>평균 ∑DOTP / ∑FILLER</span><b>${kdfF(s.dotp,1)} / ${kdfF(s.filler,1)}</b></div>
      <div class="cmp-kv"><span>G/F 제품 평균 BI <span class="kdf-sub">(${s.nG})</span></span><b>${kdfF(s.biG,3)} <span class="kdf-sub">|BI−1| ${kdfF(s.devG,3)}</span></b></div>
      <div class="cmp-kv"><span>G/F 없는 제품 평균 BI <span class="kdf-sub">(${s.nN})</span></span><b>${kdfF(s.biN,3)} <span class="kdf-sub">|BI−1| ${kdfF(s.devN,3)}</span></b></div>
      <div class="cmp-kv"><span>판정 (양호/주의/재검토)</span><b>${s.jG.ok+s.jN.ok} / ${s.jG.warn+s.jN.warn} / ${s.jG.rev+s.jN.rev}</b></div>
      <div class="cmp-kv"><span>계산 검증 '상' 항목</span><b>${s.flags}건</b></div></div>`;
  }).join('');
  // 두께별 커버리지 매트릭스
  const Ts = [...new Set(layerData.filter(r=>cos.includes(r.co)).map(r=>parseFloat(String(r.struct).split('/')[0])).filter(t=>!isNaN(t)))].sort((a,b)=>a-b);
  const mtx = `<table><thead><tr><th>두께</th>${cos.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>${Ts.map(T=>`<tr><td class="mono" style="font-weight:700">${T.toFixed(1)} T</td>${cos.map(co=>{
      const d = layerData.filter(r=>r.co===co && parseFloat(String(r.struct).split('/')[0])===T);
      if (!d.length) return '<td class="kdf-sub" style="text-align:center">—</td>';
      const b = d.filter(r=>r.bi).map(r=>r.bi.bi); const m = b.length ? b.reduce((x,y)=>x+y,0)/b.length : null;
      return `<td style="text-align:center;cursor:pointer" onclick="_cmpSel.t='${T}';_cmpSel.w='';renderLayerCompare()"><b>${d.length}</b>종 <span class="kdf-sub">${m!=null?'BI '+m.toFixed(3):''}</span>${biBar(m)}</td>`;
    }).join('')}</tr>`).join('')}</tbody></table>`;
  // 동일 규격 비교
  const pool = layerData.filter(r=>cos.includes(r.co));
  const tOpts = Ts.map(T=>`<option value="${T}" ${+_cmpSel.t===T?'selected':''}>${T.toFixed(1)} T</option>`).join('');
  const wears = [...new Set(pool.filter(r=>parseFloat(String(r.struct).split('/')[0])===+_cmpSel.t).map(r=>parseFloat(String(r.struct).split('/')[1])))].sort((a,b)=>a-b);
  if (_cmpSel.w && !wears.includes(+_cmpSel.w)) _cmpSel.w = '';
  const wOpts = `<option value="">전체 투명</option>` + wears.map(w=>`<option value="${w}" ${_cmpSel.w!=='' && +_cmpSel.w===w?'selected':''}>${w.toFixed(2)}</option>`).join('');
  const sel = pool.filter(r=>{
    const [T, W] = String(r.struct).split('/').map(parseFloat);
    if (T!==+_cmpSel.t) return false;
    if (_cmpSel.w!=='' && W!==+_cmpSel.w) return false;
    if (_cmpSel.gf && (_cmpSel.gf==='1')!==!!(r.gf||r.gfT>0)) return false;
    return true;
  }).sort((a,b)=>cos.indexOf(a.co)-cos.indexOf(b.co) || parseFloat(String(a.struct).split('/')[1])-parseFloat(String(b.struct).split('/')[1]));
  const selRows = sel.map(r=>{ const pf = sumPF(r); const v = verifyRec(r);
    return `<tr><td style="font-weight:700;white-space:nowrap;color:${r.co==='일신케미칼'?'var(--blue)':r.co==='서해테크'?'var(--accent2)':'var(--teal)'}">${r.co}</td>
      <td>${r.no}</td><td><span class="badge ${typeBadge(r.type)}" style="font-size:11px">${kdfEsc(r.type)}</span>${(r.gf||r.gfT>0)?'<span class="kdf-gf">G/F</span>':''}<div class="kdf-name" style="font-size:11.5px">${kdfEsc(r.name||'')}</div></td>
      <td class="mono" style="font-weight:700">${formatStruct(r.struct)}</td><td>${layerChips(r)}</td>
      <td class="num">${v.sumT.toFixed(2)}</td><td class="num" style="font-weight:700">${r.density.toFixed(3)}</td>
      <td class="num"><span style="color:#0369a1">${pf.dotp}</span> / <span style="color:#6d28d9">${pf.filler}</span></td>
      <td>${biCell(r,true)}${r.bi?biBar(r.bi.bi):''}</td></tr>`; }).join('');
  el.innerHTML = `
    <div class="kdf-box info"><b>읽는 법</b><ul>
      <li>BI 1.000 = 상·하부 수축 모멘트 평형. <b>BI &gt; 1 정컬(가장자리 들림) 경향, BI &lt; 1 역컬(가운데 들림) 경향</b>.</li>
      <li>층별 보정계수 K는 <b>보령·아산 제품을 "현재 배합 = 평탄"으로 가정</b>해 맞춘 값입니다. 그래서 KDF 평균 BI는 구조상 1 근처이고, 일신케미칼·서해테크는 그 K를 그대로 적용한 <b>교차 검증</b> 결과입니다.</li>
      <li>'판정'은 <b>같은 업체·같은 구조그룹 평균 대비 ΔBI</b>라 업체 간 비교에는 쓰지 말고, 업체 간에는 <b>|BI−1|</b>과 아래 <b>동일 규격 비교</b>를 보세요.</li>
      <li>실측 컬 데이터가 아직 0건이라 BI는 상대 비교용입니다(절대 컬 mm 예측 아님). 가격 비교는 원가 모듈 연동 후 추가 예정.</li></ul></div>
    <div class="kdf-sec">업체별 요약</div><div class="cmp-cards">${cards}</div>
    <div class="kdf-sec">두께별 등록 현황 · 평균 BI <span class="kdf-sub">(칸을 누르면 아래 동일 규격 비교로 이동)</span></div>
    <div class="table-wrap" style="margin-bottom:1rem">${mtx}</div>
    <div class="kdf-sec">동일 규격 비교</div>
    <div class="kdf-filters">
      <select onchange="_cmpSel.t=this.value;_cmpSel.w='';renderLayerCompare()">${tOpts}</select>
      <select onchange="_cmpSel.w=this.value;renderLayerCompare()">${wOpts}</select>
      <select onchange="_cmpSel.gf=this.value;renderLayerCompare()"><option value="" ${_cmpSel.gf===''?'selected':''}>G/F 전체</option><option value="1" ${_cmpSel.gf==='1'?'selected':''}>G/F 삽입</option><option value="0" ${_cmpSel.gf==='0'?'selected':''}>G/F 없음</option></select>
      <div class="kdf-count"><strong>${sel.length}</strong>개 구조</div></div>
    <div class="table-wrap"><table><thead><tr><th>업체</th><th>No.</th><th>구분 / 제품</th><th>구조</th><th style="min-width:380px">층 구성</th><th>총두께</th><th>비중</th><th>∑DOTP / ∑FILLER</th><th>BI</th></tr></thead>
    <tbody>${selRows || '<tr><td colspan="9" style="text-align:center;color:var(--text3);padding:1.5rem">해당 규격이 없습니다.</td></tr>'}</tbody></table></div>`;
}

/* ---------- 계산 검증 (두께 · 비중) ---------- */
let _verSel = {co:'', only:true, sort:'lvl'};
function renderLayerVerify(){
  const el = document.getElementById('layer-verify-body'); if (!el) return;
  const cos = ['KDF 보령','KDF 아산','일신케미칼'].concat(shtHidden ? [] : ['서해테크']);
  const all = layerData.filter(r=>cos.includes(r.co));
  const sumRows = cos.map(co=>{
    const d = all.filter(r=>r.co===co).map(r=>({r, v:verifyRec(r)}));
    const withO = d.filter(x=>x.v.densOrig);
    const mean = a => a.length ? a.reduce((x,y)=>x+y,0)/a.length : null;
    const mDS = mean(withO.map(x=>x.v.dS)), maeDS = mean(withO.map(x=>Math.abs(x.v.dS)));
    const mVol = mean(d.filter(x=>x.v.dVol!=null).map(x=>x.v.dVol));
    const vO = withO.filter(x=>x.v.densVol!=null).map(x=>x.v.densVol - x.v.densOrig);
    const mVO = mean(vO), maeVO = mean(vO.map(Math.abs));
    const tBad = d.filter(x=>x.v.flags.some(f=>f.k==='두께' && f.lv==='상')).length;
    const tOff = d.filter(x=>x.v.flags.some(f=>f.k==='두께' && f.lv==='중')).length;
    const dBad = d.filter(x=>x.v.flags.some(f=>f.k==='비중' && f.lv==='상')).length;
    const dWarn = d.filter(x=>x.v.flags.some(f=>f.k==='비중' && f.lv==='중')).length;
    const lyr = d.reduce((a,x)=>a+x.v.lyrBad,0), lyrW = d.reduce((a,x)=>a+x.v.lyrWarn,0);
    const med = kdfCompanyAdd()[co];
    return `<tr><td style="font-weight:700">${co}</td><td class="num">${d.length}</td>
      <td class="num">${kdfSign(med,2)}</td><td class="num">${tBad}</td><td class="num">${tOff}</td>
      <td class="num">${kdfSign(mDS,3)}</td><td class="num">${kdfF(maeDS,3)}</td><td class="num">${dBad} / ${dWarn}</td>
      <td class="num">${lyr} / ${lyrW}</td><td class="num">${kdfSign(mVol,3)}</td>
      <td class="num">${kdfSign(mVO,3)} <span class="kdf-sub">(|Δ| ${kdfF(maeVO,3)})</span></td></tr>`;
  }).join('');
  let list = all.filter(r=>!_verSel.co || r.co===_verSel.co).map(r=>({r, v:verifyRec(r)}));
  if (_verSel.only) list = list.filter(x=>x.v.lvl>0);
  list.sort(_verSel.sort==='dS' ? (a,b)=>Math.abs(b.v.dS||0)-Math.abs(a.v.dS||0) : (a,b)=>b.v.lvl-a.v.lvl || b.v.flags.length-a.v.flags.length || a.r.no-b.r.no);
  const rows = list.map(({r,v})=>`<tr>
    <td style="font-weight:700">${r.no}</td><td style="white-space:nowrap;font-weight:700;color:${r.co==='일신케미칼'?'var(--blue)':r.co==='서해테크'?'var(--accent2)':'var(--teal)'}">${r.co}</td>
    <td><span class="mono" style="font-weight:700">${formatStruct(r.struct)}</span><div class="kdf-name" style="font-size:11.5px">${kdfEsc(r.name||r.type)}</div></td>
    <td class="num">${v.sumT.toFixed(2)}</td><td class="num">${v.orig!=null?(+v.orig).toFixed(2):'—'}</td><td class="num">${kdfSign(v.add,2)}</td>
    <td class="num">${v.densOrig?(+v.densOrig).toFixed(3):'—'}</td><td class="num" style="font-weight:700">${v.densSite.toFixed(3)}</td>
    <td class="num ${v.dS!=null&&Math.abs(v.dS)>0.02?(v.dS>0?'dpos':'dneg'):''}">${kdfSign(v.dS)}</td><td class="num">${kdfF(v.densVol,3)}</td>
    <td style="text-align:center">${flagBadge(v)}</td>
    <td style="font-size:11.5px;line-height:1.5;min-width:340px">${v.flags.slice(0,4).map(f=>`<div><b style="color:${f.lv==='상'?'#b91c1c':f.lv==='중'?'#b45309':'#64748b'}">[${f.lv}·${kdfEsc(f.k)}]</b> ${kdfEsc(f.t)}</div>`).join('')}${v.flags.length>4?`<div class="kdf-sub">외 ${v.flags.length-4}건</div>`:''}</td></tr>`).join('');
  el.innerHTML = `
    <div class="kdf-box info"><b>검증 기준</b> — 등록된 층별구조의 계산 항목을 원본(엑셀) 값과 대조합니다.<ul>
      <li><b>두께</b>: 층 두께 합 = 원본 '계'(일신·서해는 설정두께) 인지, 총두께−표기두께가 기준과 맞는지 (KDF: +0.02 또는 +0.07 인정 — 사내 기준 문서화 필요 / 일신·서해: 업체 중앙값)</li>
      <li><b>층 비중</b>: 원본에 적힌 층 비중 vs 배합 이론비중 <span class="mono">(100+D+F)/(100/1.4 + D/1.0 + F/2.5)</span> — 0.02 초과 '확인', 0.05 초과 '재검증'</li>
      <li><b>제품 비중</b>: 원본 '계' 비중(수기 입력값) vs 사이트 계산값(현행 종합계산식) — 0.02 초과 '주의', 0.05 초과 '재검증'</li></ul></div>
    <div class="kdf-box warn"><b>계산식 점검 결과 — 제품 비중</b><ul>
      <li>현행 종합계산식은 층 두께 비율을 <b>질량 비율처럼</b> 써서 PHR을 합친 뒤 비중을 구합니다. 이는 층 비중의 <b>두께가중 조화평균</b>과 같아서, 물리적으로 맞는 <b>체적가중 평균 Σ(t·ρ)/Σt</b>보다 항상 낮게 나옵니다 (아래 표 '현행−체적가중' 열, 평균 약 −0.03~−0.06).</li>
      <li><b>일신케미칼 원본 비중은 체적가중식과 거의 일치</b>합니다(아래 표 '체적가중−원본' 열 참고). 즉 원래 엑셀은 체적가중으로 계산된 값이었고, 사이트가 로딩 때 현행식으로 다시 계산해 덮어쓰면서 <b>화면 비중이 원본보다 약 0.04 낮게</b> 표시되고 있었습니다.</li>
      <li>KDF(보령·아산) 원본 '계' 비중은 수식이 아닌 직접 입력값이고, 한 표 안에 같은 값(1.87, 1.79, 1.823 등)이 반복 입력된 경우가 많아 기준값으로 쓰기 어렵습니다.</li>
      <li>박스 중량·원가(㎡당 무게)는 비중에 비례하므로, 계산식을 체적가중으로 바꾸면 중량이 약 2~3% 늘어납니다. <b>사이트 전체(박스 중량·원가 포함)에 영향을 주므로 계산식은 아직 바꾸지 않았습니다</b> — 확정되면 structPHR() 한 곳만 수정하면 됩니다.</li></ul></div>
    <div class="kdf-sec">업체(공장)별 요약</div>
    <div class="table-wrap" style="margin-bottom:1rem"><table><thead><tr><th>업체</th><th>구조 수</th><th>총두께−표기<br><span class="kdf-sub">기준(중앙값)</span></th><th>층합≠원본계</th><th>기준 벗어난<br>총두께(+α)</th><th>계산−원본 비중<br><span class="kdf-sub">평균</span></th><th>|Δ| 평균</th><th>제품 비중<br><span class="kdf-sub">재검증/주의</span></th><th>층 비중<br><span class="kdf-sub">재검증/확인</span></th><th>현행−체적가중<br><span class="kdf-sub">평균</span></th><th>체적가중−원본<br><span class="kdf-sub">평균 (|Δ| 평균)</span></th></tr></thead><tbody>${sumRows}</tbody></table></div>
    <div class="kdf-sec">구조별 점검 목록</div>
    <div class="kdf-filters">
      <select onchange="_verSel.co=this.value;renderLayerVerify()"><option value="">전체 업체</option>${cos.map(c=>`<option ${_verSel.co===c?'selected':''}>${c}</option>`).join('')}</select>
      <select onchange="_verSel.sort=this.value;renderLayerVerify()"><option value="lvl" ${_verSel.sort==='lvl'?'selected':''}>중요도 순</option><option value="dS" ${_verSel.sort==='dS'?'selected':''}>비중 편차 큰 순</option></select>
      <label class="kdf-chk"><input type="checkbox" ${_verSel.only?'checked':''} onchange="_verSel.only=this.checked;renderLayerVerify()"> 점검 항목 있는 것만</label>
      <div class="kdf-count"><strong>${list.length}</strong>개 구조</div></div>
    <div class="table-wrap"><table><thead><tr><th>No.</th><th>업체</th><th>구조 / 제품</th><th>층 합</th><th>원본 계</th><th>−표기</th><th>원본 비중</th><th>계산 비중</th><th>Δ</th><th>체적가중</th><th>점검</th><th>내용</th></tr></thead>
    <tbody>${rows || '<tr><td colspan="12" style="text-align:center;color:var(--text3);padding:1.5rem">점검 항목이 없습니다.</td></tr>'}</tbody></table></div>`;
}
