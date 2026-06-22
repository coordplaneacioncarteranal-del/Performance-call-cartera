/**
 * ============================================================
 * PERFORMANCE DASHBOARD — APP ENGINE
 * Vanilla JS · IIFE · Zero Dependencies
 * Versión: 5.5 (Limpieza Total de Rojos · Identidad Corporativa JR)
 * ============================================================
 */

(function () {
  'use strict';

  /* ── CONFIGURACIÓN DE CAMPANAS CON LA PALETA CORPORATIVA ── */
  const CAMPS = {
    RECORDACION: { label: 'Recordación', type: 'recordacion', color: '#1e51a4', colorLight: '#467ec6', agents: ["DIANA MILLON", "LUZ ARIAGU", "MARIA ALEVIL", "MARIANA MUNGON", "JENNIFER MARCAR", "JUAN GALCAR", "DANIELA MEJCOR", "KATHERIN CHATAP"] },
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

  const DATA_EXCEL = [
    { usuario: "DIANA MILLON", total_acuerdos: 72, cierre_recaudo: 4901050, proyeccion: 18713100, presupuesto_junio: 22500000 },
    { usuario: "LUZ ARIAGU", total_acuerdos: 80, cierre_recaudo: 4477950, proyeccion: 15156138, presupuesto_junio: 22500000 },
    { usuario: "MARIA ALEVIL", total_acuerdos: 74, cierre_recaudo: 4156250, proyeccion: 17040625, presupuesto_junio: 22500000 },
    { usuario: "MARIANA MUNGON", total_acuerdos: 72, cierre_recaudo: 3707550, proyeccion: 15200955, presupuesto_junio: 22500000 },
    { usuario: "JENNIFER MARCAR", total_acuerdos: 67, cierre_recaudo: 3543000, proyeccion: 11991692, presupuesto_junio: 22500000 },
    { usuario: "JUAN GALCAR", total_acuerdos: 66, cierre_recaudo: 3456600, proyeccion: 11699262, presupuesto_junio: 22500000 },
    { usuario: "DANIELA MEJCOR", total_acuerdos: 76, cierre_recaudo: 3373901, proyeccion: 11419357, presupuesto_junio: 22500000 },
    { usuario: "KATHERIN CHATAP", total_acuerdos: 25, cierre_recaudo: 1256700, proyeccion: 6822086, presupuesto_junio: 19000000 },
    
    { usuario: "MONICA GUZCRU", total_acuerdos: 67, cierre_recaudo: 4683700, proyeccion: 16783258, presupuesto_junio: 15450000 },
    { usuario: "CESAR JARCAR", total_acuerdos: 62, cierre_recaudo: 4229250, proyeccion: 15154813, presupuesto_junio: 15450000 },
    { usuario: "LEIDY BERMUDEZ", total_acuerdos: 61, cierre_recaudo: 4237500, proyeccion: 14342308, presupuesto_junio: 15450000 },
    { usuario: "ELSI MANHER", total_acuerdos: 64, cierre_recaudo: 4136900, proyeccion: 14001815, presupuesto_junio: 15450000 },
    { usuario: "LAURA LOPHEN", total_acuerdos: 46, cierre_recaudo: 2805100, proyeccion: 9494185, presupuesto_junio: 15450000 },
    { usuario: "CINDY ESPZUL", total_acuerdos: 48, cierre_recaudo: 2708950, proyeccion: 9168754, presupuesto_junio: 15450000 },
    
    { usuario: "ERIKA VILLA", total_acuerdos: 32, cierre_recaudo: 1980750, proyeccion: 6704077, presupuesto_junio: 10200000 },
    { usuario: "JESSICA TORMAR", total_acuerdos: 35, cierre_recaudo: 1971916, proyeccion: 6674177, presupuesto_junio: 10200000 },
    { usuario: "DIANA MARBOR", total_acuerdos: 41, cierre_recaudo: 1910000, proyeccion: 6464615, presupuesto_junio: 10200000 },
    { usuario: "MARIA RINCAS", total_acuerdos: 20, cierre_recaudo: 1664900, proyeccion: 5635046, presupuesto_junio: 10200000 },
    
    { usuario: "JUAN CASVAL", total_acuerdos: 49, cierre_recaudo: 3630650, proyeccion: 12288354, presupuesto_junio: 16000000 }
  ];

  /* ── STATE ─────────────────────────────────────────────── */
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

  function processData() {
    state.agentStats = DATA_EXCEL.map(a => {
      const campKey = getCampaignForAgent(a.usuario);
      const recaudo = a.cierre_recaudo;
      const acuerdos = a.total_acuerdos;
      const cumplimientoProyectado = (a.proyeccion / a.presupuesto_junio) * 100;
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

  /* ── REESTRUCTURADO: TARJETA DE CUMPLIMIENTO CON TODAS LAS MÉTRICAS GLOBALES SOLICITADAS ── */
  function renderKPIs() {
    const stats = state.agentStats;
    const totalRecaudo = stats.reduce((s, a) => s + a.totalRecaudo, 0);
    const totalBudget = stats.reduce((s, a) => s + a.budget, 0);
    const totalProjection = stats.reduce((s, a) => s + a.projection, 0);
    const globalCumpl = totalBudget > 0 ? (totalProjection / totalBudget) * 100 : 0;
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
      
      <!-- NUEVA TARJETA UNIFICADA CON TODAS LAS SOLICITUDES DE MÉTRICAS -->
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

    // CORRECCIÓN DE LA ETIQUETA "ACTUALIZADO": Estilo limpio, blanco y ejecutivo sin fondos pesados
    const lastUpdateLabel = document.querySelector('.last-update');
    if (lastUpdateLabel) {
      lastUpdateLabel.style.setProperty('background', 'rgba(255, 255, 255, 0.15)', 'important');
      lastUpdateLabel.style.setProperty('border', '1px solid rgba(255, 255, 255, 0.3)', 'important');
      lastUpdateLabel.style.setProperty('padding', '4px 12px', 'important');
      lastUpdateLabel.style.setProperty('border-radius', '20px', 'important');
    }
  }

  /* ── CAMPAIGN STRIP ─────────────────────────────────────── */
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

  /* ── QUARTILE MODULE (Sin Rojos en Textos) ────────────────── */
  function renderQuartiles() {
    const grid = document.getElementById('quartile-grid');
    if (!grid) return;
    let html = '';

    Object.entries(CAMPS).forEach(([campKey, camp]) => {
      const agents = state.agentStats.filter(a => a.campKey === campKey).sort((a, b) => b.cumplimiento - a.cumplimiento);
      if (!agents.length) return;

      const campBudget = agents.reduce((s, a) => s + a.budget, 0);
      const campProjection = agents.reduce((s, a) => s + a.projection, 0);
      const campCumplimiento = campBudget > 0 ? (campProjection / campBudget) * 100 : 0;

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

  /* ── DATA TABLE (Limpia de tonos rojos en textos y nombres) ── */
  function renderTable() {
    let data = state.agentStats;
    if (state.filteredCampaign !== 'ALL') data = data.filter(a => a.campKey === state.filteredCampaign);
    if (state.searchTerm) data = data.filter(a => a.agent.toLowerCase().includes(state.searchTerm.toLowerCase()));

    const tbody = document.querySelector('#data-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const tableHeaders = document.querySelectorAll('#data-table th');
    tableHeaders.forEach(th => {
      th.style.setProperty('color', '#1e293b', 'important');
      th.style.setProperty('font-weight', '700', 'important');
      th.style.setProperty('background', '#f1f5f9', 'important');
    });

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
        const qc = qColor(a.quartile);
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
          <td>${hasComm ? `<span class="pill-commission" style="background: rgba(30, 81, 164, 0.08) !important; color: #1e51a4 !important; border:1px solid rgba(30, 81, 164, 0.2) !important; padding:2px 6px; border-radius:4px; font-weight:700;">${fmt.money(Math.round(a.commission / a.totalAcuerdos))}</span>` : `<span style="color: #4a5568 !important; font-weight:700; font-size:11.5px;">Sin comisión</span>`}</td>
          <td><span style="font-weight:800; color: #1e51a4 !important;">${hasComm ? fmt.money(a.variableEstimada) : '$0'}</span></td>
        `;
        tbody.appendChild(row);
      });
    });

    // Totales del Footer
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
    search: function (term) { state.searchTerm = term; renderTable(); },
    toggleTheme: function () {
      document.documentElement.setAttribute('data-theme', 'light');
      state.theme = 'light';
      localStorage.setItem('dash-theme', 'light');
    }
  };

  document.addEventListener('DOMContentLoaded', function() {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('dash-theme', 'light');
    processData();
  });

})();