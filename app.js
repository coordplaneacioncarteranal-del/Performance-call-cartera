/**
 * ============================================================
 * PERFORMANCE DASHBOARD — APP ENGINE
 * Vanilla JS · IIFE · Zero Dependencies
 * Versión: 9.0 (Blindaje Absoluto Contra Errores de Formato)
 * ============================================================
 */

(function () {
  'use strict';

  /* ── CONFIGURACIÓN DE CAMPANAS CON LA PALETA CORPORATIVA ── */
  const CAMPS = {
    RECORDACION: { label: 'Recordación', type: 'recordacion', color: '#1e51a4', colorLight: '#467ec6', agents: ["DIANA MILLON", "LUZ ARIAGU", "MARIA ALEVIL", "MARIANA MUNGON", "JENNIFER MARCAR", "JUAN GALCAR", "DANIELA MEJCOR", "KATHERIN CHATAP", "SEBASTIAN CASARA"] },
    FIDELIZACION_A: { label: 'Fidelización A', type: 'fidelizacion', color: '#1e51a4', colorLight: '#467ec6', agents: ["MONICA GUZCRU", "CESAR JARCAR", "LEIDY BERMUDEZ", "ELSI MANHER", "LAURA LOPHEN", "CINDY ESPZUL"] },
    RETENCION: { label: 'Retención', type: 'retencion', color: '#1e51a4', colorLight: '#467ec6', agents: ["ERIKA VILLA", "JESSICA TORMAR", "DIANA MARBOR", "MARIA RINCAS"] },
    RENACER_MASCOTAS: { label: 'Renacer Mascotas', type: 'fidelizacion', color: '#1e51a4', colorLight: '#467ec6', agents: ["JUAN CASVAL"] }
  };

  const COMMISSION_TABLE = [
    { desde: 0.00,  recordacion: 0,       fidelizacion: 0,       retencion: 0 },
    { desde: 0.85,  recordacion: 150000,  fidelizacion: 200000,  retencion: 360000 },
    { desde: 0.90,  recordacion: 200000,  fidelizacion: 300000,  retencion: 460000 },
    { desde: 1.00,  recordacion: 300000,  fidelizacion: 500000,  retencion: 660000 },
    { desde: 1.01,  recordacion: 310000,  fidelizacion: 520000,  retencion: 680000 }
  ];

  /* ── STATE & DATA STORAGE ──────────────────────────────── */
  let DATA_EXCEL = [];  

  const state = {
    agentStats: [],
    filteredCampaign: 'ALL',
    searchTerm: '',
    theme: 'light'
  };

  /* ── UTILITIES ─────────────────────────────────────────── */
  const fmt = {
    money: v => '$' + Number(v).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
    pct: v => (Number(v) || 0).toFixed(1) + '%',
    num: v => Number(v).toLocaleString('es-CO')
  };

  function getCampaignForAgent(agentName) {
    const upper = agentName.toUpperCase().trim();
    for (const [key, camp] of Object.entries(CAMPS)) {
      if (camp.agents.some(a => a.toUpperCase() === upper)) return key;
    }
    return null;
  }

  function getCommission(cumplimientoPct, campKey) {
    if (cumplimientoPct < 85.00) return 0;
    const campType = CAMPS[campKey]?.type || 'recordacion';
    const cumplimientoDecimal = cumplimientoPct / 100;

    for (let i = COMMISSION_TABLE.length - 1; i >= 0; i--) {
      if (cumplimientoDecimal >= COMMISSION_TABLE[i].desde) {
        return COMMISSION_TABLE[i][campType] || 0;
      }
    }
    return 0;
  }

  function calculateCorrectQuartile(cumplimientoPct) {
    if (cumplimientoPct < 85.00) return 'Q4'; 
    if (cumplimientoPct >= 100.00) return 'Q1'; 
    if (cumplimientoPct >= 90.00) return 'Q2'; 
    return 'Q3';
  }

  function qColor(q) {
    return { Q1: '#1e51a4', Q2: '#2b6cb0', Q3: '#4a5568', Q4: '#718096' }[q] || '#94a3b8';
  }

  /* ── CONEXIÓN ULTRA-BLINDADA CON EL ARCHIVO EXPORTADO ── */
  /* ── REEMPLAZAR ÚNICAMENTE ESTA FUNCIÓN EN TU APP.JS LOCAL ── */
  async function fetchAndProcessCSV() {
    try {
      const config = window.__PERFORMANCE_CONFIG__;
      if (!config || !config.CSV_URL) {
        console.error("No se encontró la configuración de CSV_URL en config.js");
        return;
      }

      // Generamos un conector plano infalible para saltar la caché
      const marcaTiempo = Date.now();
      const urlLimpia = config.CSV_URL + "&cb=" + marcaTiempo;

      const response = await fetch(urlLimpia);
      const csvText = await response.text();
      
      const lines = csvText.split(/\r?\n/);
      if (lines.length < 2) return;

      const separador = lines[0].includes(';') ? ';' : ',';
      const newAgentData = [];

      for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].trim();
        if (!currentLine) continue;

        const columns = currentLine.split(separador).map(c => c.trim().replace(/"/g, ''));
        const usuario = columns[0];

        if (!usuario || usuario.toUpperCase().includes("TOTAL") || usuario.toUpperCase().includes("ASESOR") || usuario.toUpperCase().includes("CALL CENTER") || usuario.startsWith("%")) {
          continue;
        }

        const usuarioLimpio = usuario.replace(/-/g, ' ').toUpperCase().trim();
        if (usuarioLimpio.length < 3) continue;

        const parseNum = (index) => {
          if (index === -1 || index >= columns.length || !columns[index]) return 0;
          let val = columns[index].replace(/[^0-9,-]/g, '');
          if (val.includes(',')) {
            if (val.match(/\d+,\d+/)) val = val.replace(',', '.');
          }
          return parseFloat(val) || 0;
        };

        // Mapeo por índices físicos idénticos a tu Sheets real
        const acuerdosJunio = parseNum(3); // Columna D
        const recaudoJunio  = parseNum(4); // Columna E
        const cierreRecaudo = parseNum(6); // Columna G
        const presupuesto   = parseNum(7); // Columna H

        newAgentData.push({
          usuario: usuarioLimpio,
          total_acuerdos: acuerdosJunio,
          cierre_recaudo: cierreRecaudo,
          proyeccion: recaudoJunio,
          presupuesto_junio: presupuesto
        });
      }

      if (newAgentData.length > 0) {
        DATA_EXCEL = newAgentData;
      }

    } catch (error) {
      console.error("Error en fetch:", error);
    } finally {
      processData();
    }
  }
  function processData() {
    state.agentStats = DATA_EXCEL.map(a => {
      const campKey = getCampaignForAgent(a.usuario);
      const recaudo = a.cierre_recaudo;
      const acuerdos = a.total_acuerdos;
      
      const cumplimientoProyectado = a.presupuesto_junio > 0 ? (recaudo / a.presupuesto_junio) * 100 : 0;
      const commission = getCommission(cumplimientoProyectado, campKey);

      return {
        agent: a.usuario,
        campKey,
        totalRecaudo: recaudo,
        totalAcuerdos: acuerdos,
        budget: a.presupuesto_junio,
        projection: a.proyeccion,
        cumplimiento: cumplimientoProyectado,
        commission,
        variableEstimada: commission > 0 ? commission : 0, 
        quartile: calculateCorrectQuartile(cumplimientoProyectado)
      };
    });

    renderAll();
  }

  function renderAll() {
    renderKPIs();
    renderCampaignStrip();
    renderQuartiles();
    renderTable();
    updateLastUpdate();
  }

  /* ── RENDERIZADOS DE INTERFAZ ──────────────────────────── */
  function renderKPIs() {
    const stats = state.agentStats;
    const totalRecaudo = stats.reduce((s, a) => s + a.totalRecaudo, 0);
    const totalBudget = stats.reduce((s, a) => s + a.budget, 0);
    const totalProjection = stats.reduce((s, a) => s + a.projection, 0);
    const globalCumpl = totalBudget > 0 ? (totalRecaudo / totalBudget) * 100 : 0;
    const totalComisiones = stats.reduce((s, a) => s + a.variableEstimada, 0);
    const totalAcuerdos = stats.reduce((s, a) => s + a.totalAcuerdos, 0);

    const kpiEl = document.getElementById('kpi-grid');
    if (!kpiEl) return;

    kpiEl.innerHTML = `
      <div class="kpi-card" style="border-left: 5px solid #1e51a4 !important; background: #ffffff !important; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <div class="kpi-label" style="color: #4a5568 !important; font-weight:700;">Recaudo Total Acumulado</div>
        <div class="kpi-value" style="color:#1e51a4 !important; font-weight:900;">${fmt.money(totalRecaudo)}</div>
        <div class="kpi-sub" style="color: #718096 !important;">Meta Global: ${fmt.money(totalBudget)}</div>
      </div>
      
      <div class="kpi-card" style="border-left: 5px solid #1e51a4 !important; background: #ffffff !important; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <div class="kpi-label" style="color: #4a5568 !important; font-weight:700;">Cumplimiento Medio Proyectado</div>
        <div class="kpi-value" style="color:#1e51a4 !important; font-weight:900;">${globalCumpl.toFixed(1)}%</div>
        <div class="kpi-sub" style="color: #4a5568 !important; font-size: 11px; line-height: 1.4; margin-top: 4px;">
          <div>Recaudo: <strong>${fmt.money(totalRecaudo)}</strong></div>
          <div>Proyectado: <strong>${fmt.money(totalProjection)}</strong></div>
          <div>Meta Global: <strong>${fmt.money(totalBudget)}</strong></div>
        </div>
      </div>
      
      <div class="kpi-card" style="border-left: 5px solid #1e51a4 !important; background: #ffffff !important; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <div class="kpi-label" style="color: #4a5568 !important; font-weight:700;">Total Acuerdos Gestionados</div>
        <div class="kpi-value" style="color:#1e51a4 !important; font-weight:900;">${fmt.num(totalAcuerdos)}</div>
        <div class="kpi-sub" style="color: #718096 !important;">Operación Corporativa JR</div>
      </div>

      <div class="kpi-card" style="border-left: 5px solid #1e51a4 !important; background: #ffffff !important; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <div class="kpi-label" style="color: #4a5568 !important; font-weight:700;">Nómina Variable Estimada Total</div>
        <div class="kpi-value" style="color:#1e51a4 !important; font-weight:900;">${fmt.money(totalComisiones)}</div>
        <div class="kpi-sub" style="color: #718096 !important;">Corte proyectado &lt; 85% activo</div>
      </div>
    `;
  }

  function renderCampaignStrip() {
    const strip = document.getElementById('campaign-strip');
    if (!strip) return;
    
    const campTotals = {};
    state.agentStats.forEach(a => {
      if (!campTotals[a.campKey]) campTotals[a.campKey] = { recaudo: 0, agents: 0 };
      campTotals[a.campKey].recaudo += a.totalRecaudo;
      campTotals[a.campKey].agents++;
    });

    let html = `
      <div class="camp-chip ${state.filteredCampaign === 'ALL' ? 'active' : ''}" style="--chip-color:#1e51a4; background: #ffffff !important;" onclick="window.DASH.filterCampaign('ALL')">
        <div class="camp-info"><div class="camp-name" style="font-weight:700; color: #1e293b !important;">Todas las Campañas</div><div class="camp-count">${state.agentStats.length} asesores</div></div>
        <div class="camp-recaudo" style="color:#1e51a4 !important; font-weight:800;">${fmt.money(state.agentStats.reduce((s,a) => s+a.totalRecaudo, 0))}</div>
      </div>`;

    Object.entries(CAMPS).forEach(([key, camp]) => {
      const tot = campTotals[key] || { recaudo: 0, agents: 0 };
      html += `
        <div class="camp-chip ${state.filteredCampaign === key ? 'active' : ''}" style="--chip-color:#1e51a4; background: #ffffff !important;" onclick="window.DASH.filterCampaign('${key}')">
          <div class="camp-dot" style="background:#1e51a4"></div>
          <div class="camp-info"><div class="camp-name" style="font-weight:700; color: #1e293b !important;">${camp.label}</div><div class="camp-count">${tot.agents} asesores</div></div>
          <div class="camp-recaudo" style="color:#1e51a4 !important; font-weight:800;">${fmt.money(tot.recaudo)}</div>
        </div>`;
    });
    strip.innerHTML = html;
  }

  function renderQuartiles() {
    const grid = document.getElementById('quartile-grid');
    if (!grid) return;
    let html = '';

    Object.entries(CAMPS).forEach(([campKey, camp]) => {
      const agents = state.agentStats.filter(a => a.campKey === campKey).sort((a, b) => b.cumplimiento - a.cumplimiento);
      if (!agents.length) return;

      const campBudget = agents.reduce((s, a) => s + a.budget, 0);
      const campRecaudo = agents.reduce((s, a) => s + a.totalRecaudo, 0);
      const campCumplimiento = campBudget > 0 ? (campRecaudo / campBudget) * 100 : 0;

      html += `
        <div class="quartile-card" style="border-top: 4px solid #1e51a4 !important; background: #ffffff !important;">
          <div class="quartile-card-header" style="display: flex; flex-direction: column; gap: 4px; border-bottom: 1px solid rgba(0,0,0,0.06); padding-bottom: 8px; margin-bottom: 10px;">
            <div class="quartile-campaign-name" style="font-size: 15px; font-weight: 800; display: flex; align-items: center; gap: 8px; color: #1e293b !important;">
              <div class="quartile-campaign-dot" style="background:#1e51a4; width: 10px; height: 10px; border-radius: 50%;"></div>
              ${camp.label}
            </div>
            <div class="campaign-meta-summary" style="display: flex; justify-content: space-between; font-size: 12px; color: #4a5568; margin-top: 2px;">
              <span>Meta: <strong style="color: #1e293b;">${fmt.money(campBudget)}</strong></span>
              <span>Cumplimiento: <strong style="color: #1e51a4; font-weight: 800;">${campCumplimiento.toFixed(1)}%</strong></span>
            </div>
          </div>
          <div class="quartile-agents">
            ${agents.map((a) => {
              const barPct = Math.min(a.cumplimiento, 100);
              const qc = qColor(a.quartile);

              return `
                <div class="agent-row" style="padding: 6px 0; border-bottom: 1px dashed rgba(0,0,0,0.04);">
                  <span class="agent-name" style="color: #1e293b !important; font-weight: 600 !important; font-size:12.5px;">${a.agent}</span>
                  <div class="agent-bar-wrap" style="background: rgba(0,0,0,0.05) !important; height: 8px; border-radius: 4px;">
                    <div class="agent-bar" style="width:${barPct}% !important; background: #1e51a4 !important; height: 100%; border-radius: 4px;"></div>
                  </div>
                  <span class="agent-pct" style="color: #1e51a4 !important; font-weight:700 !important; font-size:12px;">${fmt.pct(a.cumplimiento)}</span>
                  <span class="agent-q-badge" style="background:${qc}15; color:${qc}; border:1px solid ${qc}33; font-weight:800; padding:1px 5px; border-radius:4px; font-size:10px;">${a.quartile}</span>
                </div>`;
            }).join('')}
          </div>
        </div>`;
    });
    grid.innerHTML = html;
  }

  function renderTable() {
    let data = state.agentStats;
    if (state.filteredCampaign !== 'ALL') data = data.filter(a => a.campKey === state.filteredCampaign);
    if (state.searchTerm) data = data.filter(a => a.agent.toLowerCase().includes(state.searchTerm.toLowerCase()));

    const tbody = document.querySelector('#data-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    Object.entries(CAMPS).forEach(([campKey, camp]) => {
      if (state.filteredCampaign !== 'ALL' && state.filteredCampaign !== campKey) return;

      let blockData = data.filter(a => a.campKey === campKey);
      if (blockData.length === 0) return;

      const groupHeader = document.createElement('tr');
      groupHeader.innerHTML = `
        <td colspan="9" style="padding: 10px 16px !important; font-weight: 800 !important; font-size: 12px !important; letter-spacing: 0.6px !important; text-transform: uppercase !important; color: #1e51a4 !important; background: rgba(30, 81, 164, 0.08) !important; border-left: 4px solid #1e51a4 !important; border-bottom: 1px solid rgba(30, 81, 164, 0.15) !important;">
          💼 Línea de Gestión: ${camp.label}
        </td>
      `;
      tbody.appendChild(groupHeader);

      blockData.forEach(a => {
        const barPct = Math.min(a.cumplimiento, 100);
        const hasComm = a.commission > 0;

        const row = document.createElement('tr');
        row.style.background = "#ffffff";
        row.innerHTML = `
          <td><div class="td-agent"><div class="agent-avatar" style="background:#1e51a4 !important; color:#ffffff !important; font-weight:700;">${a.agent.substring(0, 2)}</div><strong style="color: #1e293b !important; font-weight: 600 !important;">${a.agent}</strong></div></td>
          <td><span class="td-campaign" style="background: rgba(30, 81, 164, 0.08) !important; color: #1e51a4 !important; border:1px solid rgba(30, 81, 164, 0.2) !important; padding:3px 8px; border-radius:6px; font-size:11px; font-weight:700;">${camp.label}</span></td>
          <td style="text-align:center; font-weight:700; color: #1e293b;">${a.totalAcuerdos}</td>
          <td><span style="font-weight:600; color: #0f172a !important;">${fmt.money(a.totalRecaudo)}</span></td>
          <td><span style="font-weight:600; color: #334155 !important;">${fmt.money(a.projection)}</span></td>
          <td><span style="font-weight:600; color: #475569 !important;">${fmt.money(a.budget)}</span></td>
          <td>
            <div class="progress-cell" style="display:flex; align-items:center; gap:8px;">
              <div class="mini-bar-wrap" style="width:55px; background: rgba(0,0,0,0.06); height:6px; border-radius:3px; overflow:hidden; display:inline-block;">
                <div class="mini-bar" style="width:${barPct}% !important; background: #1e51a4 !important; height:100%;"></div>
              </div>
              <strong style="color: #1e51a4 !important; font-weight:700 !important;">${fmt.pct(a.cumplimiento)}</strong>
            </div>
          </td>
          <td>${hasComm ? `<span class="pill-commission" style="background: rgba(30, 81, 164, 0.08) !important; color: #1e51a4 !important; border:1px solid rgba(30, 81, 164, 0.2) !important; padding:2px 6px; border-radius:4px; font-weight:700;">${fmt.money(Math.round(a.commission / (a.totalAcuerdos || 1)))}</span>` : `<span style="color: #4a5568 !important; font-weight:700; font-size:11.5px;">Sin comisión</span>`}</td>
          <td><span style="font-weight:800; color: #1e51a4 !important;">${hasComm ? fmt.money(a.variableEstimada) : '$0'}</span></td>
        `;
        tbody.appendChild(row);
      });
    });

    const totalRecaudoGlobal = data.reduce((s, a) => s + a.totalRecaudo, 0);
    const totalComisionGlobal = data.reduce((s, a) => s + a.variableEstimada, 0);
    const footerEl = document.getElementById('table-footer');
    if (footerEl) {
      footerEl.innerHTML = `
        <span style="color: #334155 !important; font-size:12px; font-weight:600;">${data.length} asesores listados</span>
        <div class="footer-totals" style="display:flex; gap:32px; align-items:center;">
          <div class="footer-total-item">
            <span class="footer-total-label" style="font-size:12px !important; color: #1e293b !important; font-weight: 700 !important; margin-right:4px;">TOTAL RECAUDO REAL:</span> 
            <strong style="color:#1e51a4 !important; font-size:16px !important; font-weight:800 !important;">${fmt.money(totalRecaudoGlobal)}</strong>
          </div>
          <div class="footer-total-item">
            <span class="footer-total-label" style="font-size:12px !important; color: #1e293b !important; font-weight: 700 !important; margin-right:4px;">NÓMINA VARIABLE PROYECTADA:</span> 
            <strong style="color:#1e51a4 !important; font-size:16px !important; font-weight:800 !important;">${fmt.money(totalComisionGlobal)}</strong>
          </div>
        </div>`;
    }
  }

  function updateLastUpdate() {
    const el = document.getElementById('last-update-time');
    if (el) el.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  window.DASH = {
    filterCampaign: function (key) { state.filteredCampaign = key; renderAll(); },
    search: function (term) { state.searchTerm = term; renderTable(); }
  };

  document.addEventListener('DOMContentLoaded', function() {
    document.documentElement.setAttribute('data-theme', 'light');
    fetchAndProcessCSV();
    const interval = window.__PERFORMANCE_CONFIG__?.REFRESH_INTERVAL_MS || 300000;
    setInterval(fetchAndProcessCSV, interval);
  });

})();