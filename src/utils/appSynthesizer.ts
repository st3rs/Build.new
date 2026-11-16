import type { LanguageCode, ProjectTemplate } from '../types/builder';

export type AppDomainKind =
  | 'crm'
  | 'billing'
  | 'kanban'
  | 'commerce'
  | 'video'
  | 'wealth'
  | 'booking'
  | 'realestate'
  | 'status'
  | 'edtech'
  | 'calculator'
  | 'custom';

export function detectAppDomain(prompt: string, templateId?: string): AppDomainKind {
  if (templateId) {
    if (templateId.includes('crm')) return 'crm';
    if (templateId.includes('stripe')) return 'billing';
    if (templateId.includes('kanban')) return 'kanban';
    if (templateId.includes('commerce')) return 'commerce';
    if (templateId.includes('remotion')) return 'video';
    if (templateId.includes('wealth')) return 'wealth';
    if (templateId.includes('telemedicine')) return 'booking';
    if (templateId.includes('real-estate')) return 'realestate';
    if (templateId.includes('status')) return 'status';
    if (templateId.includes('edtech')) return 'edtech';
  }

  const p = prompt.toLowerCase();
  if (/crm|lead|ลูกค้า|sales|pipeline/.test(p)) return 'crm';
  if (/stripe|billing|subscription|สมัครสมาชิก|invoice|mrr/.test(p)) return 'billing';
  if (/kanban|todo|task|sprint|บอร์ด|งาน/.test(p)) return 'kanban';
  if (/shop|store|cart|commerce|market|ขายของ|ร้านค้า|ตะกร้า|ศิลปะ/.test(p)) return 'commerce';
  if (/video|remotion|วิดีโอ|สคริปต์|caption/.test(p)) return 'video';
  if (/calc|calculator|คำนวณ|ภาษี|roi|mortgage|เครื่องคิดเลข/.test(p)) return 'calculator';
  if (/wealth|finance|portfolio|การเงิน|ลงทุน|กระแสเงินสด/.test(p)) return 'wealth';
  if (/book|clinic|doctor|telemed|จองคิว|พบแพทย์|นัดหมาย/.test(p)) return 'booking';
  if (/real estate|property|house|360|อสังหา|บ้าน|คอนโด/.test(p)) return 'realestate';
  if (/status|uptime|api|monitor|ping|ตรวจวัด|latency/.test(p)) return 'status';
  if (/learn|language|quiz|xp|edtech|เรียนภาษา|เกม/.test(p)) return 'edtech';
  return 'custom';
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildBaseStyles(accent = '#0066FF', secondary = '#00E5FF', lightMode = false): string {
  const bg = lightMode ? '#F8FAFC' : '#141517';
  const card = lightMode ? '#FFFFFF' : '#1D1F24';
  const inputBg = lightMode ? '#F1F5F9' : '#0D0E10';
  const text = lightMode ? '#0F172A' : '#F1F3F4';
  const muted = lightMode ? '#475569' : '#94A3B8';
  const border = lightMode ? 'rgba(15,23,42,0.12)' : 'rgba(255,255,255,0.1)';

  return `
    :root {
      --bg: ${bg};
      --card: ${card};
      --input: ${inputBg};
      --text: ${text};
      --muted: ${muted};
      --border: ${border};
      --accent: ${accent};
      --secondary: ${secondary};
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Noto Sans Thai", "DM Sans", system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      padding: 20px;
      line-height: 1.5;
    }
    .header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 20px;
    }
    .title { font-size: 20px; font-weight: 700; margin: 0; }
    .subtitle { font-size: 12px; color: var(--muted); margin: 4px 0 0; }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
      background: color-mix(in srgb, var(--secondary) 14%, transparent);
      color: var(--secondary);
      border: 1px solid color-mix(in srgb, var(--secondary) 35%, transparent);
    }
    .grid { display: grid; gap: 12px; }
    .cols-3 { grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); }
    .cols-2 { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 14px;
    }
    .kpi-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.04em; }
    .kpi-val { font-size: 22px; font-weight: 700; margin-top: 6px; font-variant-numeric: tabular-nums; }
    .btn {
      background: var(--accent);
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 8px 14px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn:hover { opacity: 0.92; }
    .btn-ghost {
      background: var(--input);
      color: var(--text);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 7px 12px;
      font-size: 12px;
      cursor: pointer;
    }
    .input {
      background: var(--input);
      color: var(--text);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 8px 11px;
      font-size: 12px;
      outline: none;
    }
    .input:focus { border-color: var(--accent); }
    .row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .stack { display: flex; flex-direction: column; gap: 8px; }
    .pill {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 11px;
      background: var(--input);
      border: 1px solid var(--border);
      color: var(--muted);
    }
    .toast {
      position: fixed;
      bottom: 14px;
      right: 14px;
      background: var(--card);
      border: 1px solid var(--secondary);
      color: var(--text);
      padding: 9px 14px;
      border-radius: 10px;
      font-size: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.45);
      display: none;
    }
  `;
}

export function synthesizeInteractiveApp(params: {
  prompt: string;
  template?: ProjectTemplate;
  lang: LanguageCode;
}): {
  title: string;
  previewHtml: string;
  metrics: { label: string; value: string; delta: string }[];
} {
  const { prompt, template, lang } = params;
  const isTh = lang === 'th';
  const domain = detectAppDomain(prompt, template?.id);
  const title = template
    ? isTh
      ? template.titleTh
      : template.title
    : prompt.trim().slice(0, 48) || (isTh ? 'เว็บแอปพลิเคชัน AI' : 'Custom AI Application');

  const safeTitle = escapeHtml(title);
  const safePrompt = escapeHtml(prompt.trim() || title);

  let bodyMarkup = '';
  let inlineScript = '';

  if (domain === 'commerce') {
    bodyMarkup = `
      <div class="header">
        <div>
          <h1 class="title">${safeTitle}</h1>
          <p class="subtitle">${safePrompt}</p>
        </div>
        <button class="btn" id="cartBtn">${isTh ? 'ตะกร้าสินค้า' : 'Cart'} (<span id="cartCount">0</span>) · ฿<span id="cartTotal">0</span></button>
      </div>
      <div class="row" style="margin-bottom:14px; flex-wrap:wrap;">
        <div style="display:flex; gap:6px;">
          <button class="btn-ghost" onclick="filterCat('all')">${isTh ? 'ทั้งหมด' : 'All'}</button>
          <button class="btn-ghost" onclick="filterCat('tech')">${isTh ? 'อุปกรณ์' : 'Gear'}</button>
          <button class="btn-ghost" onclick="filterCat('art')">${isTh ? 'ดิจิทัล' : 'Digital'}</button>
        </div>
        <input class="input" id="searchBox" placeholder="${isTh ? 'ค้นหาสินค้า...' : 'Search products...'}" oninput="renderProducts()" />
      </div>
      <div class="grid cols-3" id="productGrid"></div>
      <div class="card" style="margin-top:16px;">
        <div class="row">
          <strong style="font-size:13px;">${isTh ? 'รายการในตะกร้า' : 'Shopping Bag'}</strong>
          <button class="btn" onclick="checkout()">${isTh ? 'ชำระเงินทันที' : 'Checkout'}</button>
        </div>
        <div id="cartList" class="stack" style="margin-top:10px; font-size:12px; color:var(--muted);">${isTh ? 'ยังไม่มีสินค้าในตะกร้า' : 'Your cart is empty'}</div>
      </div>
    `;
    inlineScript = `
      const products = [
        { id: 1, name: 'Cybernetic Keycap Set', cat: 'tech', price: 1890, stock: 14 },
        { id: 2, name: 'Studio Desk Mat Pro', cat: 'tech', price: 790, stock: 32 },
        { id: 3, name: '3D Obsidian UI Kit', cat: 'art', price: 1290, stock: 99 },
        { id: 4, name: 'Minimalist Audio DAC', cat: 'tech', price: 3490, stock: 7 },
        { id: 5, name: 'AI Prompt Pack v2', cat: 'art', price: 590, stock: 99 },
        { id: 6, name: 'Aluminum Stand', cat: 'tech', price: 1150, stock: 19 }
      ];
      let activeCat = 'all';
      let cart = [];
      function filterCat(c) { activeCat = c; renderProducts(); }
      function addToCart(id) {
        const item = products.find(p => p.id === id);
        if (!item) return;
        cart.push(item);
        updateCart();
        showToast((${JSON.stringify(isTh)} ? 'เพิ่มลงตะกร้า: ' : 'Added: ') + item.name);
      }
      function updateCart() {
        document.getElementById('cartCount').textContent = cart.length;
        const total = cart.reduce((s, i) => s + i.price, 0);
        document.getElementById('cartTotal').textContent = total.toLocaleString();
        const list = document.getElementById('cartList');
        if (cart.length === 0) {
          list.textContent = ${JSON.stringify(isTh ? 'ยังไม่มีสินค้าในตะกร้า' : 'Your cart is empty')};
        } else {
          list.innerHTML = cart.map((i, idx) => '<div class="row"><span>' + i.name + '</span><span>฿' + i.price.toLocaleString() + '</span></div>').join('');
        }
      }
      function checkout() {
        if (!cart.length) return showToast(${JSON.stringify(isTh ? 'กรุณาเลือกสินค้าก่อนชำระเงิน' : 'Add an item first')});
        const total = cart.reduce((s, i) => s + i.price, 0);
        cart = [];
        updateCart();
        showToast(${JSON.stringify(isTh ? 'ชำระเงินสำเร็จ ยอดรวม ฿' : 'Order confirmed: ฿')} + total.toLocaleString());
      }
      function renderProducts() {
        const q = (document.getElementById('searchBox').value || '').toLowerCase();
        const list = products.filter(p => (activeCat === 'all' || p.cat === activeCat) && p.name.toLowerCase().includes(q));
        document.getElementById('productGrid').innerHTML = list.map(p =>
          '<div class="card stack">' +
            '<div class="row"><span class="pill">' + p.cat.toUpperCase() + '</span><span class="pill">Stock: ' + p.stock + '</span></div>' +
            '<strong style="font-size:14px;">' + p.name + '</strong>' +
            '<div class="row" style="margin-top:6px;"><span style="font-weight:700; color:var(--secondary);">฿' + p.price.toLocaleString() + '</span>' +
            '<button class="btn" onclick="addToCart(' + p.id + ')">' + ${JSON.stringify(isTh ? '+ ใส่ตะกร้า' : '+ Add')} + '</button></div>' +
          '</div>'
        ).join('');
      }
      renderProducts();
    `;
  } else if (domain === 'kanban' || domain === 'crm') {
    const isCrm = domain === 'crm';
    bodyMarkup = `
      <div class="header">
        <div>
          <h1 class="title">${safeTitle}</h1>
          <p class="subtitle">${safePrompt}</p>
        </div>
        <span class="badge">Live Sync</span>
      </div>
      <div class="card" style="margin-bottom:14px;">
        <form onsubmit="addItem(event)" class="row" style="flex-wrap:wrap;">
          <input class="input" id="newItemInput" style="flex:1; min-width:180px;" placeholder="${isCrm ? (isTh ? 'เพิ่มชื่อลูกค้า / ดีลใหม่...' : 'Add new lead or deal...') : (isTh ? 'เพิ่มงานใหม่ลงบอร์ด...' : 'Add a new task...')}" />
          <button class="btn" type="submit">${isTh ? '+ เพิ่มรายการ' : '+ Add Item'}</button>
        </form>
      </div>
      <div class="grid cols-3" id="boardCols"></div>
    `;
    inlineScript = `
      const cols = ${JSON.stringify(
        isCrm
          ? isTh
            ? ['ลีดใหม่ (Lead)', 'เสนอราคา (Proposal)', 'ปิดการขาย (Won)']
            : ['New Leads', 'Proposal', 'Closed Won']
          : isTh
            ? ['รอดำเนินการ', 'กำลังทำ', 'เสร็จสิ้น']
            : ['Backlog', 'In Progress', 'Done'],
      )};
      let items = ${JSON.stringify(
        isCrm
          ? [
              { id: 1, title: 'Acme Cloud · $48,000', col: 0, tag: 'Score 94' },
              { id: 2, title: 'Kinetix AI · $72,000', col: 1, tag: 'Score 89' },
              { id: 3, title: 'Vanguard Ops · $31,500', col: 2, tag: 'Signed' },
            ]
          : [
              { id: 1, title: 'Setup Postgres & Auth Schema', col: 2, tag: 'API' },
              { id: 2, title: 'Build Real-Time Webhook Sync', col: 1, tag: 'Backend' },
              { id: 3, title: 'Design Dark Telemetry Charts', col: 0, tag: 'UI' },
            ],
      )};
      function addItem(e) {
        e.preventDefault();
        const input = document.getElementById('newItemInput');
        if (!input.value.trim()) return;
        items.unshift({ id: Date.now(), title: input.value.trim(), col: 0, tag: 'New' });
        input.value = '';
        renderBoard();
        showToast(${JSON.stringify(isTh ? 'เพิ่มรายการเรียบร้อย' : 'Item added')});
      }
      function moveItem(id) {
        items = items.map(i => i.id === id ? { ...i, col: (i.col + 1) % cols.length } : i);
        renderBoard();
      }
      function renderBoard() {
        document.getElementById('boardCols').innerHTML = cols.map((c, idx) => {
          const colItems = items.filter(i => i.col === idx);
          return '<div class="card stack">' +
            '<div class="row"><strong style="font-size:12px;">' + c + '</strong><span class="pill">' + colItems.length + '</span></div>' +
            colItems.map(i =>
              '<div class="card" style="background:var(--input); padding:10px;">' +
                '<div style="font-size:12px; font-weight:600; margin-bottom:6px;">' + i.title + '</div>' +
                '<div class="row"><span class="pill">' + i.tag + '</span>' +
                '<button class="btn-ghost" style="padding:4px 8px; font-size:11px;" onclick="moveItem(' + i.id + ')">' + ${JSON.stringify(isTh ? 'ย้าย →' : 'Move →')} + '</button></div>' +
              '</div>'
            ).join('') +
          '</div>';
        }).join('');
      }
      renderBoard();
    `;
  } else if (domain === 'calculator' || domain === 'wealth' || domain === 'billing') {
    bodyMarkup = `
      <div class="header">
        <div>
          <h1 class="title">${safeTitle}</h1>
          <p class="subtitle">${safePrompt}</p>
        </div>
        <span class="badge">Real-Time Calc</span>
      </div>
      <div class="grid cols-3" style="margin-bottom:16px;">
        <div class="card"><div class="kpi-label">${isTh ? 'มูลค่ารวมต่อปี' : 'Annual Total'}</div><div class="kpi-val" id="kpiAnnual">฿1,440,000</div></div>
        <div class="card"><div class="kpi-label">${isTh ? 'กำไรสุทธิคาดการณ์' : 'Projected Net'}</div><div class="kpi-val" style="color:var(--secondary);" id="kpiNet">฿432,000</div></div>
        <div class="card"><div class="kpi-label">${isTh ? 'อัตราเติบโต' : 'Growth Rate'}</div><div class="kpi-val" id="kpiRate">+18.5%</div></div>
      </div>
      <div class="card stack">
        <label class="row" style="font-size:12px;">
          <span>${isTh ? 'รายได้ / งบประมาณต่อเดือน (฿)' : 'Monthly Volume (฿)'}: <strong id="lblMonthly">120,000</strong></span>
        </label>
        <input type="range" min="10000" max="500000" step="5000" value="120000" id="sliderMonthly" oninput="recalc()" />
        <label class="row" style="font-size:12px; margin-top:8px;">
          <span>${isTh ? 'อัตรากำไร (%)' : 'Margin (%)'}: <strong id="lblMargin">30%</strong></span>
        </label>
        <input type="range" min="5" max="80" step="1" value="30" id="sliderMargin" oninput="recalc()" />
      </div>
    `;
    inlineScript = `
      function recalc() {
        const m = Number(document.getElementById('sliderMonthly').value);
        const margin = Number(document.getElementById('sliderMargin').value);
        document.getElementById('lblMonthly').textContent = m.toLocaleString();
        document.getElementById('lblMargin').textContent = margin + '%';
        const annual = m * 12;
        const net = Math.round(annual * (margin / 100));
        document.getElementById('kpiAnnual').textContent = '฿' + annual.toLocaleString();
        document.getElementById('kpiNet').textContent = '฿' + net.toLocaleString();
        document.getElementById('kpiRate').textContent = '+' + (margin * 0.6).toFixed(1) + '%';
      }
      recalc();
    `;
  } else if (domain === 'status') {
    bodyMarkup = `
      <div class="header">
        <div>
          <h1 class="title">${safeTitle}</h1>
          <p class="subtitle">${safePrompt}</p>
        </div>
        <button class="btn" onclick="pingAll()">${isTh ? 'ทดสอบ Ping ทั้งหมด' : 'Run Health Check'}</button>
      </div>
      <div class="stack" id="nodeList"></div>
    `;
    inlineScript = `
      let nodes = [
        { name: 'POST /v2/generate-app', region: 'asia-southeast1', ms: 34, ok: true },
        { name: 'GET /v2/deployments', region: 'us-east1', ms: 42, ok: true },
        { name: 'WS /v2/realtime-sync', region: 'eu-west1', ms: 58, ok: true }
      ];
      function pingAll() {
        nodes = nodes.map(n => ({ ...n, ms: 18 + Math.floor(Math.random() * 55) }));
        renderNodes();
        showToast(${JSON.stringify(isTh ? 'อัปเดตสถานะ Latency ล่าสุดแล้ว' : 'Health check completed')});
      }
      function renderNodes() {
        document.getElementById('nodeList').innerHTML = nodes.map(n =>
          '<div class="card row">' +
            '<div><strong style="font-size:13px; font-family:monospace;">' + n.name + '</strong><div class="subtitle">' + n.region + '</div></div>' +
            '<div style="display:flex; align-items:center; gap:10px;">' +
              '<span class="pill" style="color:var(--secondary);">' + n.ms + ' ms</span>' +
              '<span class="badge">200 OK</span>' +
            '</div>' +
          '</div>'
        ).join('');
      }
      renderNodes();
    `;
  } else {
    bodyMarkup = `
      <div class="header">
        <div>
          <h1 class="title">${safeTitle}</h1>
          <p class="subtitle">${safePrompt}</p>
        </div>
        <span class="badge">Interactive v1</span>
      </div>
      <div class="grid cols-3" style="margin-bottom:16px;">
        <div class="card"><div class="kpi-label">${isTh ? 'ผู้ใช้งานออนไลน์' : 'Active Users'}</div><div class="kpi-val" id="statUsers">1,284</div></div>
        <div class="card"><div class="kpi-label">${isTh ? 'ความเสถียร' : 'Uptime SLA'}</div><div class="kpi-val" style="color:var(--secondary);">99.94%</div></div>
        <div class="card"><div class="kpi-label">${isTh ? 'ความเร็วตอบสนอง' : 'p95 Latency'}</div><div class="kpi-val">38 ms</div></div>
      </div>
      <div class="card stack">
        <form onsubmit="addEntry(event)" class="row" style="flex-wrap:wrap;">
          <input class="input" id="entryInput" style="flex:1; min-width:180px;" placeholder="${isTh ? 'เพิ่มข้อมูลหรือบันทึกใหม่...' : 'Add a record or workflow item...'}" />
          <button class="btn" type="submit">${isTh ? 'บันทึกข้อมูล' : 'Add Record'}</button>
        </form>
        <div id="entryList" class="stack" style="margin-top:8px;"></div>
      </div>
    `;
    inlineScript = `
      const entries = [
        ${JSON.stringify(isTh ? 'ซิงค์โครงสร้างฐานข้อมูลสำเร็จ' : 'Schema & API contract initialized')},
        ${JSON.stringify(isTh ? 'เปิดใช้งานระบบ Edge Caching 34 Regions' : 'Edge CDN caching active across 34 regions')}
      ];
      function addEntry(e) {
        e.preventDefault();
        const el = document.getElementById('entryInput');
        if (!el.value.trim()) return;
        entries.unshift(el.value.trim());
        el.value = '';
        const u = document.getElementById('statUsers');
        u.textContent = (Number(u.textContent.replace(/,/g, '')) + 1).toLocaleString();
        renderEntries();
        showToast(${JSON.stringify(isTh ? 'เพิ่มข้อมูลใหม่แล้ว' : 'Record saved')});
      }
      function renderEntries() {
        document.getElementById('entryList').innerHTML = entries.map((item, idx) =>
          '<div class="card row" style="background:var(--input); padding:10px 12px;">' +
            '<span style="font-size:12px;">' + item + '</span>' +
            '<span class="pill">#' + (entries.length - idx) + '</span>' +
          '</div>'
        ).join('');
      }
      renderEntries();
    `;
  }

  const previewHtml = `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle}</title>
  <style>${buildBaseStyles()}</style>
</head>
<body>
  ${bodyMarkup}
  <div id="toast" class="toast"></div>
  <script>
    function showToast(msg) {
      const t = document.getElementById('toast');
      if (!t) return;
      t.textContent = msg;
      t.style.display = 'block';
      clearTimeout(window.__toastTimer);
      window.__toastTimer = setTimeout(() => { t.style.display = 'none'; }, 2200);
    }
    ${inlineScript}
  </script>
</body>
</html>`;

  const metrics = template?.previewMetrics ?? [
    { label: isTh ? 'สถานะแอป' : 'Runtime', value: 'Live', delta: 'Interactive' },
    { label: isTh ? 'ความเร็วสร้าง' : 'Build Time', value: '0.84 s', delta: 'Edge Ready' },
    { label: isTh ? 'โมดูล' : 'Modules', value: '3 files', delta: 'Typed' },
  ];

  return { title, previewHtml, metrics };
}

export function applyIterationToHtml(
  currentHtml: string,
  instruction: string,
  iterationNumber: number,
  lang: LanguageCode,
): string {
  const lower = instruction.toLowerCase();
  let updated = currentHtml;

  // Color theme mutations
  if (/เขียว|green|emerald/.test(lower)) {
    updated = updated
      .replace(/--accent:\s*#[0-9a-fA-F]{3,8}/g, '--accent: #10B981')
      .replace(/--secondary:\s*#[0-9a-fA-F]{3,8}/g, '--secondary: #34D399');
  } else if (/ส้ม|orange|amber/.test(lower)) {
    updated = updated
      .replace(/--accent:\s*#[0-9a-fA-F]{3,8}/g, '--accent: #F97316')
      .replace(/--secondary:\s*#[0-9a-fA-F]{3,8}/g, '--secondary: #FBBF24');
  } else if (/ม่วง|purple|violet/.test(lower)) {
    updated = updated
      .replace(/--accent:\s*#[0-9a-fA-F]{3,8}/g, '--accent: #8B5CF6')
      .replace(/--secondary:\s*#[0-9a-fA-F]{3,8}/g, '--secondary: #C084FC');
  } else if (/แดง|red|rose/.test(lower)) {
    updated = updated
      .replace(/--accent:\s*#[0-9a-fA-F]{3,8}/g, '--accent: #EF4444')
      .replace(/--secondary:\s*#[0-9a-fA-F]{3,8}/g, '--secondary: #FB7185');
  }

  // Light / Dark mode toggle
  if (/สว่าง|ขาว|light\s*mode|light\s*theme/.test(lower)) {
    updated = updated
      .replace(/--bg:\s*#[0-9a-fA-F]{3,8}/g, '--bg: #F8FAFC')
      .replace(/--card:\s*#[0-9a-fA-F]{3,8}/g, '--card: #FFFFFF')
      .replace(/--input:\s*#[0-9a-fA-F]{3,8}/g, '--input: #F1F5F9')
      .replace(/--text:\s*#[0-9a-fA-F]{3,8}/g, '--text: #0F172A')
      .replace(/--muted:\s*#[0-9a-fA-F]{3,8}/g, '--muted: #475569')
      .replace(/--border:\s*[^;]+;/g, '--border: rgba(15,23,42,0.12);');
  } else if (/มืด|dark\s*mode|dark\s*theme/.test(lower)) {
    updated = updated
      .replace(/--bg:\s*#[0-9a-fA-F]{3,8}/g, '--bg: #141517')
      .replace(/--card:\s*#[0-9a-fA-F]{3,8}/g, '--card: #1D1F24')
      .replace(/--input:\s*#[0-9a-fA-F]{3,8}/g, '--input: #0D0E10')
      .replace(/--text:\s*#[0-9a-fA-F]{3,8}/g, '--text: #F1F3F4')
      .replace(/--muted:\s*#[0-9a-fA-F]{3,8}/g, '--muted: #94A3B8')
      .replace(/--border:\s*[^;]+;/g, '--border: rgba(255,255,255,0.1);');
  }

  // Append live iteration feature banner before closing </body>
  const safeNote = escapeHtml(instruction.trim());
  const label = lang === 'th' ? `อัปเดต v${iterationNumber + 1}` : `Iteration v${iterationNumber + 1}`;
  const bannerHtml = `
  <div class="card" style="margin-top:16px; border-color: var(--secondary);">
    <div class="row">
      <span class="badge">${label}</span>
      <span style="font-size:11px; color:var(--muted);">Applied live</span>
    </div>
    <p style="margin:8px 0 0; font-size:12px;">${safeNote}</p>
  </div>`;

  if (updated.includes('<div id="toast"')) {
    updated = updated.replace('<div id="toast"', `${bannerHtml}\n  <div id="toast"`);
  } else {
    updated = updated.replace('</body>', `${bannerHtml}\n</body>`);
  }

  return updated;
}
