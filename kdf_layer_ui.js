/* ============================================================
   KDF 층별구조 UI  (작성: 김동현 부장 · 2026-11-10)
   - KDF 보령 / KDF 아산 탭: 일신케미칼과 같은 층별구조 폼
     (상지 · 인쇄지 · 중지1 · G/F · 중지2 · 중지3 · 하지 + 추가 열: 하지2 · 러버 · 벨벳 · Acoustic · 졸코팅)
   - BI · 점검 · 업체 비교 · 계산 검증은 별도 엑셀(KDF_층별구조_BI_검증.xlsx)로 관리 — 웹에는 표시하지 않음
   의존: index.html 의 layerData, lc, formatStruct, typeBadge, sumPF
   ============================================================ */

/* 추가 열 정의 (일신케미칼 폼에 없는 층) */
const KDF_EXTRA_COLS = [
  {key:'base2',    label:'하지2'},
  {key:'rubber',   label:'러버'},
  {key:'velvet',   label:'벨벳'},
  {key:'acoustic', label:'Acoustic'},
  {key:'sol',      label:'졸코팅'},
];

/* 레코드 → 층 배열 (KDF: 원본 layers / 일신·서해: 고정 슬롯) */
function getLayers(r){
  if (Array.isArray(r.layers)) return r.layers.map(l=>({
    n:l.n, ty:l.ty, t:+l.t||0,
    p: l.p ?? l.pa ?? null, f: l.f ?? l.fa ?? null
  })).filter(l=>l.t>0);
  return [
    {n:'투명', ty:'투명', t:r.topT, p:r.topP, f:0},
    {n:'인쇄지', ty:'인쇄지', t:r.printT||0.07, p:r.printP||8, f:0},
    {n:'중지1', ty:'중지', t:r.midT, p:r.midP, f:r.midF},
    {n:'G/F', ty:'G/F', t:r.gfT, p:r.gfP, f:r.gfF},
    {n:'중지2', ty:'중지', t:r.mid2T, p:r.mid2P, f:r.mid2F},
    {n:'중지3', ty:'중지', t:r.mid3T, p:r.mid3P, f:r.mid3F},
    {n:'하지', ty:'하지', t:r.baseT, p:r.baseP, f:r.baseF},
  ].filter(l=>(+l.t||0)>0).map(l=>({...l, t:+l.t}));
}

/* 층 배열 → 폼 칸 (중지는 위에서부터 중지1·2·3, 하지가 2개면 두 번째는 하지2) */
function formSlots(r){
  const s = {};
  const mids = [];
  getLayers(r).forEach(l=>{
    if (l.ty==='투명') s.top = l;
    else if (l.ty==='인쇄지') s.print = l;
    else if (l.ty==='G/F') s.gf = l;
    else if (l.ty==='중지') mids.push(l);
    else if (l.ty==='하지') { if (!s.base) s.base = l; else s.base2 = l; }
    else if (l.ty==='러버') s.rubber = l;
    else if (l.ty==='벨벳') s.velvet = l;
    else if (l.ty==='Acoustic') s.acoustic = l;
    else if (l.ty==='졸코팅') s.sol = l;
  });
  [s.mid1, s.mid2, s.mid3] = mids;
  return s;
}
function fc(l){ return l ? lc(l.t, l.p||0, l.f||0) : ''; }
function fcGF(l){
  if (!l) return '';
  const phr = ((l.p||0)>0 || (l.f||0)>0) ? `<span style="color:#a78bfa; font-size:11px;"> ${l.p||0}/${l.f||0}</span>` : '';
  return `<span style="font-weight:700; font-size:13px; color:#6d28d9;">${(+l.t).toFixed(2)}</span>${phr}`;
}
const TD = 'style="font-size:12.5px; white-space:nowrap;"';
function formCells(r, extraCols){
  const s = formSlots(r);
  return `
      <td ${TD}>${fc(s.top)}</td>
      <td style="font-size:12.5px; white-space:nowrap; color:var(--text3);">${fc(s.print)}</td>
      <td ${TD}>${fc(s.mid1)}</td>
      <td ${TD}>${fcGF(s.gf)}</td>
      <td ${TD}>${fc(s.mid2)}</td>
      <td ${TD}>${fc(s.mid3)}</td>
      <td ${TD}>${fc(s.base)}</td>
      ${extraCols.map(c=>`<td ${TD}>${fc(s[c.key])}</td>`).join('')}`;
}
function usedExtraCols(data){
  return KDF_EXTRA_COLS.filter(c=>data.some(r=>formSlots(r)[c.key]));
}
function formHead(extra){
  return `<th>상지</th><th>인쇄지</th><th>중지1</th><th>G/F</th><th>중지2</th><th>중지3</th><th>하지</th>`
    + extra.map(c=>`<th style="background:#fff7ed; color:#9a3412;">${c.label}</th>`).join('');
}
const kdfEsc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- KDF 보령 / 아산 탭 ---------- */
const KDF_KEY = {bor:'KDF 보령', asn:'KDF 아산'};
function kdfInit(){
  ['bor','asn'].forEach(key=>{
    const data = layerData.filter(r=>r.co===KDF_KEY[key]);
    const tSel = document.getElementById(`kdf-${key}-type`);
    if (tSel && tSel.options.length<=1) [...new Set(data.map(r=>r.type))].forEach(t=>tSel.add(new Option(t,t)));
    const cnt = document.getElementById(`tab-cnt-${key}`); if (cnt) cnt.textContent = `(${data.length}종)`;
    renderKdfTable(key);
  });
}
function renderKdfTable(key){
  const all = layerData.filter(r=>r.co===KDF_KEY[key]);
  const extra = usedExtraCols(all);
  const q = ((document.getElementById(`kdf-${key}-q`)||{}).value||'').toLowerCase();
  const type = (document.getElementById(`kdf-${key}-type`)||{}).value||'';
  const gf = (document.getElementById(`kdf-${key}-gf`)||{}).value||'';
  const data = all.filter(r=>{
    if (q && ![r.struct, r.name, r.group, r.type, r.no].join(' ').toLowerCase().includes(q)) return false;
    if (type && r.type!==type) return false;
    if (gf && (gf==='1')!==!!r.gf) return false;
    return true;
  });
  const th = document.getElementById(`kdf-${key}-thead`);
  if (th) th.innerHTML = `<tr><th>No.</th><th>구분</th><th>구조</th><th>설정두께</th>${formHead(extra)}
    <th style="color:var(--accent2);">비중</th>
    <th style="color:#0369a1; white-space:nowrap;">∑DOTP<br><span style="color:#6d28d9;">∑FILLER</span></th><th>비고</th></tr>`;
  const tb = document.getElementById(`kdf-${key}-tbody`); if (!tb) return;
  tb.innerHTML = data.map(r=>{
    const pf = sumPF(r);
    return `<tr>
      <td style="font-weight:700; font-size:13px;">${r.no}</td>
      <td><span class="badge ${typeBadge(r.type)}" style="font-size:11px;">${kdfEsc(r.type)}</span></td>
      <td class="mono" style="font-weight:700; color:var(--teal); font-size:13px;">${formatStruct(r.struct)}</td>
      <td style="text-align:center; font-weight:600;">${(+r.setT).toFixed(1)}</td>
      ${formCells(r, extra)}
      <td style="text-align:center; white-space:nowrap;"><div style="font-weight:800; font-size:13.5px; color:var(--accent2); letter-spacing:-0.5px;">${r.density.toFixed(3)}</div></td>
      <td style="text-align:center; white-space:nowrap;">
        <div style="font-weight:700; font-size:12px; color:#0369a1;">${pf.dotp}</div>
        <div style="font-weight:700; font-size:12px; color:#6d28d9;">${pf.filler}</div></td>
      <td style="font-size:11.5px; color:var(--text3); min-width:170px;">${kdfEsc(r.group)} · ${kdfEsc(r.name)}</td>
    </tr>`;
  }).join('') || `<tr><td colspan="${15+extra.length}" style="text-align:center;color:var(--text3);padding:2rem;">조건에 맞는 구조가 없습니다.</td></tr>`;
  const cnt = document.getElementById(`kdf-${key}-count`); if (cnt) cnt.textContent = data.length;
}

/* ---------- 구조 시각화 (layers 레코드) ---------- */
const KDF_TY = {
  '투명':{bg:'#dbeafe',fg:'#1e40af',bd:'#93c5fd',eng:'Wear Layer'}, '인쇄지':{bg:'#fef3c7',fg:'#92400e',bd:'#fcd34d',eng:'Printed Layer'},
  '중지':{bg:'#d1fae5',fg:'#065f46',bd:'#6ee7b7',eng:'Core Layer'}, 'G/F':{bg:'#ede9fe',fg:'#5b21b6',bd:'#c4b5fd',eng:'Glass Fiber'},
  '하지':{bg:'#e0e7ff',fg:'#3730a3',bd:'#a5b4fc',eng:'Balance Layer'}, '러버':{bg:'#334155',fg:'#f8fafc',bd:'#0f172a',eng:'Rubber Back'},
  '벨벳':{bg:'#fce7f3',fg:'#9d174d',bd:'#f9a8d4',eng:'Velvet Back'}, 'Acoustic':{bg:'#ccfbf1',fg:'#115e59',bd:'#5eead4',eng:'Acoustic Back'},
  '졸코팅':{bg:'#ffedd5',fg:'#9a3412',bd:'#fdba74',eng:'Sol Coating'},
};
function kdfVizLayers(r){
  return getLayers(r).map(l=>{
    const c = KDF_TY[l.ty] || KDF_TY['중지'];
    return {name:l.n, eng:c.eng, t:l.t, p:+(l.p||0), f:+(l.f||0), face:c.bg, side:c.bd, top:'#ffffff', text:c.fg};
  });
}
