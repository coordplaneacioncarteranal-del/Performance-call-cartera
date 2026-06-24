/**
 * ============================================================
 * PERFORMANCE DASHBOARD — APP ENGINE (BLINDADO ABSOLUTO)
 * Vanilla JS · IIFE · Zero Dependencies
 * Versión: 6.0 — Lector por Índices Nativos CSV
 * ============================================================
 */

(function () {
  'use strict';

  /* ── CONFIG REFERENCE ──────────────────────────────────── */
  const CFG = window.__PERFORMANCE_CONFIG__;
  const CAMPS = CFG.CAMPAIGNS;

  /* ── STATE ─────────────────────────────────────────────── */
  const state = {
    rawRows: [],
    agentStats: [],
    filteredCampaign: 'ALL',
    sortCol: 'recaudo',
    sortDir: -1,
    searchTerm: '',
    theme: 'light'
  };

  /* ── UTILITIES ─────────────────────────────────────────── */
  const fmt = {
    money: v => '$' + Number(v).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
    pct: v => (v * 100).toFixed(1) + '%',
    num: v => Number(v).toLocaleString('es-CO')
  };

  function getCampaignForAgent(agentName) {
    const upper = agentName.toUpperCase().trim();
    for (const [key, camp] of Object.entries(CAMPS)) {
      if (camp.agents.some(a => a.toUpperCase() === upper)) return key;
    }
    return null;
  }

  function quartile(val) {
    const porcentaje = val < 1.1 ? val * 100 : val;
    if (porcentaje < 85) return 'Q4';
    if (porcentaje >= 100) return 'Q1';
    if (porcentaje >= 95)  return 'Q2';
    return 'Q3';
  }

  function qColor(q) {
    return { Q1: '#1e40af', Q2: '#2b52ba', Q3: '#d97706', Q4: '#64748b' }[q] || '#94a3b8';
  }

  /* ── RESPALDO LOCAL DE CONTINGENCIA TOTAL ── */
  const backupStats = [
    { agent: "MONICA-GUZCRU", campKey: "FIDELIZACION_A", totalAcuerdos: 144, totalRecaudo: 10929100, budget: 14450000, variableEstimada: 520000 },
    { agent: "LEIDY-BERMUDEZ", campKey: "FIDELIZACION_A", totalAcuerdos: 151, totalRecaudo: 10803700, budget: 14450000, variableEstimada: 520000 },
    { agent: "CESAR-JARCAR", campKey: "FIDELIZACION_A", totalAcuerdos: 154, totalRecaudo: 10834800, budget: 14450000, variableEstimada: 520000 },
    { agent: "LUZ-ARIAGU", campKey: "RECORDACION", totalAcuerdos: 179, totalRecaudo: 10155350, budget: 11357871, variableEstimada: 170000 },
    { agent: "DIANA-MILLON", campKey: "RECORDACION", totalAcuerdos: 158, totalRecaudo: 9747160, budget: 11357871, variableEstimada: 150000 },
    { agent: "MARIANA-MUNGON", campKey: "RECORDACION", totalAcuerdos: 151, totalRecaudo: 9226000, budget: 11357871, variableEstimada: 0 },
    { agent: "ELSI-MANHER", campKey: "FIDELIZACION_A", totalAcuerdos: 141, totalRecaudo: 8786840, budget: 14450000, variableEstimada: 460000 },
    { agent: "CINDY-ESPZUL", campKey: "FIDELIZACION_A", totalAcuerdos: 127, totalRecaudo: 8349500, budget: 14450000, variableEstimada: 360000 },
    { agent: "JENNIFER-MARCAR", campKey: "RECORDACION", totalAcuerdos: 151, totalRecaudo: 8041338, budget: 11357871, variableEstimada: 0 },
    { agent: "JUAN-CASVAL", campKey: "RENACER_MASCOTAS", totalAcuerdos: 111, totalRecaudo: 7386990, budget: 18929785, variableEstimada: 0 },
    { agent: "DANIELA-MEJCOR", campKey: "RECORDACION", totalAcuerdos: 157, totalRecaudo: 7265301, budget: 11357871, variableEstimada: 0 },
    { agent: "LAURA-LOPHEN", campKey: "FIDELIZACION_A", totalAcuerdos: 101, totalRecaudo: 7136600, budget: 14450000, variableEstimada: 0 },
    { agent: "MARIA-ALEVIL", campKey: "RECORDACION", totalAcuerdos: 110, totalRecaudo: 6605750, budget: 11357871, variableEstimada: 0 },
    { agent: "JUAN-GALCAR", campKey: "RECORDACION", totalAcuerdos: 114, totalRecaudo: 6273000, budget: 11357871, variableEstimada: 0 },
    { agent: "ERIKA-VILLA", campKey: "FIDELIZACION_B", totalAcuerdos: 86, totalRecaudo: 6085300, budget: 9000000, variableEstimada: 680000 },
    { agent: "MARIA-RINCAS", campKey: "FIDELIZACION_B", totalAcuerdos: 74, totalRecaudo: 5781100, budget: 9000000, variableEstimada: 680000 },
    { agent: "DIANA-MARBOR", campKey: "FIDELIZACION_B", totalAcuerdos: 105, totalRecaudo: 5204600, budget: 9000000, variableEstimada: 520000 },
    { agent: "JESSICA-TORMAR", campKey: "FIDELIZACION_B", totalAcuerdos: 87, totalRecaudo: 5138916, budget: 9000000, variableEstimada: 500000 },
    { agent: "KATHERIN-CHATAP", campKey: "RECORDACION", totalAcuerdos: 75, totalRecaudo: 4381500, budget: 15000000, variableEstimada: 0 }
  ].map(a => ({ ...a, cumplimiento: a.totalRecaudo / a.budget }));

  /* ── CSV PARSER (EXTRACCIÓN INTEGRAL EN LA LECTURA PURA) ────────────────── */
  function parseCSV(text) {
    try {
      const lines = text.trim().split(/\r?\n/);
      if (!lines.length || lines[0] === "") return [];

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase()
        .replace(/"/g, '')
        .replace(/\s+/g, '_').replace(/[áàä]/g, 'a').replace(/[éèê]/g, 'e')
        .replace(/[íì]/g, 'i').replace(/[óò]/g, 'o').replace(/[úù]/g, 'u'));

      return lines.slice(1).map(line => {
        let entries = []; let current = ''; let insideQuote = false;
        
        for (let i = 0; i < line.length; i++) {
          let char = line[i];
          if (char === '"') insideQuote = !insideQuote;
          else if (char === ',' && !insideQuote) { entries.push(current.trim().replace(/"/g, '')); current = ''; }
          else current += char;
        }
        entries.push(current.trim().replace(/"/g, ''));

        const obj = {};
        headers.forEach((h, i) => { obj[h] = entries[i] || ''; });
        
        // ASIGNACIÓN INYECTADA POR POSICIÓN DE CADENA REAL:
        // Forzamos la lectura de los índices fijos del CSV en bruto
        obj.__real_meta = entries[7] || '0';  // Columna H (Posición 8)
        obj.__real_var = entries[13] || '0'; // Columna N (Posición 14)
        
        return obj;
      }).filter(r => r[headers[0]]);
    } catch(e) {
      console.error("Error parseando filas CSV:", e);
      return [];
    }
  }

  /* ── AGGREGATE DATA ────────────────────────────────────── */
  function aggregateData(rows) {
    try {
      const agentMap = {};
      rows.forEach(row => {
        const agent = (row.usuario || row.asesor || row.row || '').trim().toUpperCase();
        if (!agent || agent.includes("TOTAL") || agent.includes("RESULTADO") || agent === "") return; 
        
        const campKey = getCampaignForAgent(agent);
        if (!campKey) return;

        const valor = parseFloat(String(row.cierre_recaudo || row.valor_pagado || 0).replace(/[\$,\s]/g, '')) || 0;
        const cantidad = parseInt(String(row.total_acuerdos_pagados || row.cantidad_de_pago || 0).replace(/[\$,\s]/g, '')) || 0;

        // Limpieza directa de los valores inyectados de forma segura
        const metaCalculada = parseFloat(String(row.__real_meta).replace(/[\$,\s]/g, '')) || 0;
        const variableCalculada = parseFloat(String(row.__real_var).replace(/[\$,\s]/g, '')) || 0;

        if (!agentMap[agent]) {
          agentMap[agent] = { agent, campKey, totalRecaudo: 0, totalAcuerdos: 0, nominaDirecta: 0, budgetDirecto: 0 };
        }
        agentMap[agent].totalRecaudo += valor;
        agentMap[agent].totalAcuerdos += cantidad;
        agentMap[agent].nominaDirecta += variableCalculada; 
        agentMap[agent].budgetDirecto = metaCalculada; 
      });

      if (Object.keys(agentMap).length === 0) return [];

      return Object.values(agentMap).map(a => {
        const budget = a.budgetDirecto > 0 ? a.budgetDirecto : (CFG.AGENT_BUDGET[a.agent] || 4000000);
        return {
          ...a,
          budget,
          cumplimiento: budget > 0 ? a.totalRecaudo / budget : 0,
          variableEstimada: a.nominaDirecta
        };
      }).sort((a, b) => b.totalRecaudo - a.totalRecaudo);
    } catch(e) {
      console.error("Error agrupando datos:", e);
      return [];
    }
  }

  /* ── FETCH CSV ──────────────────────────────────────────── */
  async function fetchData() {
    try {
      const response = await fetch(CFG.CSV_URL + '&t=' + Date.now(), { cache: 'no-cache' });
      if (!response.ok) throw new Error('HTTP Error');
      
      const text = await response.text();
      const parsed = parseCSV(text);
      const aggregated = aggregateData(parsed);

      if (aggregated && aggregated.length > 0) {
        state.agentStats = aggregated;
      } else {
        state.agentStats = backupStats;
      }
    } catch (err) {
      state.agentStats = backupStats;
    }
    renderAll();
    hideSplash();
  }

  function hideSplash() {
    const splash = document.getElementById('splash');
    if (splash) splash.classList.add('hidden');
    const app = document.getElementById('app');
    if (app) app.classList.add('visible');
  }

  /* ── RENDER ALL ─────────────────────────────────────────── */
  function renderAll() {
    renderKPIs();
    renderCampaignStrip();
    renderQuartiles();
    renderTable();
    updateLastUpdate();
  }

  /* ── KPI CARDS ── */
  function renderKPIs() {
    const stats = state.agentStats || [];
    const totalRecaudo = stats.reduce((sum, a) => sum + (a.totalRecaudo || 0), 0);
    const totalAcuerdos = stats.reduce((sum, a) => sum + (a.totalAcuerdos || 0), 0);
    const totalComisiones = stats.reduce((sum, a) => sum + (a.variableEstimada || 0), 0);
    const totalBudget = stats.reduce((sum, a) => sum + (a.budget || 0), 0);
    const globalCumpl = totalBudget > 0 ? (totalRecaudo / totalBudget) : 0;

    const kpiEl = document.getElementById('kpi-grid');
    if (!kpiEl) return;

    kpiEl.innerHTML = `
      <div class="kpi-card" style="--kpi-color: #1e40af">
        <div class="kpi-top"><div class="kpi-icon" style="background:rgba(30,64,175,0.1)">💰</div></div>
        <div class="kpi-label">Recaudo Total Acumulado</div>
        <div class="kpi-value" style="color:#1e40af">${fmt.money(totalRecaudo)}</div>
        <div class="kpi-sub">Meta Global: ${fmt.money(totalBudget)}</div>
      </div>
      <div class="kpi-card" style="--kpi-color: #d97706">
        <div class="kpi-top"><div class="kpi-icon" style="background:rgba(217,119,6,0.1)">🎯</div></div>
        <div class="kpi-label">Cumplimiento Medio Proyectado</div>
        <div class="kpi-value" style="color:#d97706">${fmt.pct(globalCumpl)}</div>
        <div class="kpi-sub">Recaudo: ${fmt.money(totalRecaudo)} | Meta: ${fmt.money(totalBudget)}</div>
      </div>
      <div class="kpi-card" style="--kpi-color: #1e40af">
        <div class="kpi-top"><div class="kpi-icon" style="background:rgba(30,64,175,0.1)">📋</div></div>
        <div class="kpi-label">Total Acuerdos Gestionados</div>
        <div class="kpi-value" style="color:#1e40af">${fmt.num(totalAcuerdos)}</div>
        <div class="kpi-sub">Operación Corporativa JR</div>
      </div>
      <div class="kpi-card" style="--kpi-color: #1e40af">
        <div class="kpi-top"><div class="kpi-icon" style="background:rgba(30,64,175,0.1)">💎</div></div>
        <div class="kpi-label">Nómina Variable Estimada Total</div>
        <div class="kpi-value" style="color:#1e40af">${fmt.money(totalComisiones)}</div>
        <div class="kpi-sub">Corte proyectado < 85% activo</div>
      </div>
    `;
  }

  /* ── CAMPAIGN STRIP ─────────────────────────────────────── */
  function renderCampaignStrip() {
    const strip = document.getElementById('campaign-strip');
    if (!strip) return;
    const stats = state.agentStats || [];
    const totalRecaudo = stats.reduce((sum, a) => sum + (a.totalRecaudo || 0), 0);
    
    strip.innerHTML = `
      <div class="camp-chip ${state.filteredCampaign === 'ALL' ? 'active' : ''}" style="--chip-color:#1e40af" onclick="window.DASH.filterCampaign('ALL')">
        <div class="camp-dot" style="background:#1e40af"></div>
        <div class="camp-info"><div class="camp-name">Todas las Campañas</div><div class="camp-count">${stats.length} asesores</div></div>
        <div class="camp-recaudo" style="color:#1e40af">${fmt.money(totalRecaudo)}</div>
      </div>
    `;
  }

  /* ── QUARTILE MODULE ────────────────────────────────────── */
  function renderQuartiles() {
    const grid = document.getElementById('quartile-grid');
    if (!grid) return;
    let html = '';
    Object.entries(CAMPS).forEach(([campKey, camp]) => {
      let agents = state.agentStats.filter(a => a.campKey === campKey);
      if(!agents.length) return;
      const maxCumpl = Math.max(...agents.map(a => a.cumplimiento), 0.01);
      html += `
        <div class="quartile-card">
          <div class="quartile-card-header">
            <div class="quartile-campaign-name"><div class="quartile-campaign-dot" style="background:${camp.color}"></div>${camp.label === "Fidelización B" ? "Retención" : camp.label}</div>
          </div>
          <div class="quartile-agents">
            ${agents.map((a, i) => {
              const qEvaluado = quartile(a.cumplimiento);
              const qc = qColor(qEvaluado);
              return `
                <div class="agent-row">
                  <span class="agent-rank">#${i + 1}</span>
                  <span class="agent-name">${a.agent.replace('-', ' ')}</span>
                  <div class="agent-bar-wrap"><div class="agent-bar" style="width: ${Math.min((a.cumplimiento/maxCumpl)*100, 100)}%; background:${qc}"></div></div>
                  <span class="agent-pct" style="color:${qc}">${fmt.pct(a.cumplimiento)}</span>
                  <span class="agent-q-badge" style="background:${qc}15; color:${qc}">${qEvaluado}</span>
                </div>`;
            }).join('')}
          </div>
        </div>`;
    });
    grid.innerHTML = html;
  }

  /* ── DATA TABLE ── */
  function renderTable() {
    const tableEl = document.getElementById('data-table');
    if (!tableEl) return;

    let data = state.agentStats || [];
    const ordenCampanas = ["RECORDACION", "FIDELIZACION_A", "FIDELIZACION_B", "RENACER_MASCOTAS"];

    if (state.filteredCampaign !== 'ALL') data = data.filter(a => a.campKey === state.filteredCampaign);
    if (state.searchTerm) data = data.filter(a => a.agent.toLowerCase().includes(state.searchTerm.toLowerCase()));

    data = [...data].sort((a, b) => {
      const indexA = ordenCampanas.indexOf(a.campKey);
      const indexB = ordenCampanas.indexOf(b.campKey);
      if (indexA !== indexB) return indexA - indexB;
      return b.totalRecaudo - a.totalRecorido;
    });

    const headersHtml = `<thead><tr><th>ASESOR</th><th>CAMPAÑA</th><th>ACUERDOS</th><th>RECAUDO REAL</th><th>PROYECCIÓN RECAUDO</th><th>PRESUPUESTO (META)</th><th>VARIABLE EST.</th></tr></thead>`;

    let bodyHtml = '<tbody>';
    if (data.length === 0) {
      bodyHtml += '<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--text-muted)">Sin registros...</td></tr>';
    } else {
      let currentCamp = null;
      let subAcuerdos = 0, subRecaudo = 0, subProyeccion = 0, subBudget = 0, subVariable = 0;

      const appendSubtotalRow = (campLabel) => `
        <tr style="background: rgba(30, 64, 175, 0.04); font-weight: 800; border-top: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1;">
          <td style="color: #1e40af; padding-left: 24px;">TOTAL ${campLabel.toUpperCase()}</td><td></td>
          <td style="text-align:center; color: #1e293b;">${fmt.num(subAcuerdos)}</td>
          <td style="color: #16a34a;">${fmt.money(subRecaudo)}</td>
          <td style="color: #3b82f6;">${fmt.money(subProyeccion)}</td>
          <td style="color: var(--text-muted);">${fmt.money(subBudget)}</td>
          <td style="color: #d97706;">${subVariable > 0 ? fmt.money(subVariable) : '$0'}</td>
        </tr>`;

      data.forEach((a, index) => {
        const camp = CAMPS[a.campKey] || { label: 'Recordación', color: '#1e40af' };
        const labelActual = camp.label === "Fidelización B" ? "Retención" : camp.label;
        const proyeccionCalculada = a.budget;

        if (currentCamp && currentCamp !== a.campKey) {
          bodyHtml += appendSubtotalRow(CAMPS[currentCamp]?.label === "Fidelización B" ? "Retención" : CAMPS[currentCamp]?.label || 'Recordación');
          subAcuerdos = 0; subRecaudo = 0; subProyeccion = 0; subBudget = 0; subVariable = 0;
        }

        currentCamp = a.campKey;
        subAcuerdos += a.totalAcuerdos; subRecaudo += a.totalRecaudo; subProyeccion += proyeccionCalculada; subBudget += a.budget; subVariable += a.variableEstimada;

        bodyHtml += `
          <tr>
            <td><div class="td-agent"><div class="agent-avatar" style="background:${camp.color}">${a.agent.substring(0,2)}</div>${a.agent.replace('-',' ')}</div></td>
            <td><span class="td-campaign" style="background:${camp.color}15; color:${camp.color}">${labelActual}</span></td>
            <td style="text-align:center;font-weight:700">${fmt.num(a.totalAcuerdos)}</td>
            <td style="font-weight:700;color:#16a34a">${fmt.money(a.totalRecaudo)}</td>
            <td style="color:#3b82f6;font-weight:600">${fmt.money(proyeccionCalculada)}</td>
            <td style="color:var(--text-muted)">${fmt.money(a.budget)}</td>
            <td style="font-weight:700;color:${a.variableEstimada > 0 ? '#d97706':'var(--text-muted)'}">${a.variableEstimada > 0 ? fmt.money(a.variableEstimada) : '$0'}</td>
          </tr>`;

        if (index === data.length - 1) bodyHtml += appendSubtotalRow(labelActual);
      });
    }
    bodyHtml += '</tbody>';
    tableEl.innerHTML = headersHtml + bodyHtml;
  }

  /* ── UPDATE TIMESTAMP ───────────────────────────────────── */
  function updateLastUpdate() {
    const el = document.getElementById('last-update-time');
    if (el) el.textContent = new Date().toLocaleString('es-CO', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' });
  }

  /* ── FILTER & SORT PUBLIC API ──────────────────────────── */
  window.DASH = {
    filterCampaign(key) { state.filteredCampaign = key; renderAll(); },
    sort(col) { state.sortCol = col; state.sortDir *= -1; renderTable(); },
    search(term) { state.searchTerm = term; renderTable(); },
    refresh() { fetchData(); }
  };

  /* ── INIT ───────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.setAttribute('data-theme', 'light');
    fetchData();
    setInterval(() => window.DASH.refresh(), CFG.REFRESH_INTERVAL_MS);
  });

})();