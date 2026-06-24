/**
 * ============================================================
 * PERFORMANCE DASHBOARD — CONFIG PANEL
 * Editable by Supervisor (sin conocimientos técnicos)
 * Versión: 2.1 | Fecha: 2026
 * ============================================================
 *
 * INSTRUCCIONES:
 * 1. Abrir este archivo con el Bloc de Notas.
 * 2. Modificar SOLO los valores numéricos o nombres.
 * 3. Guardar y recargar el index.html en el navegador.
 * NO eliminar comas, llaves ni corchetes.
 * ============================================================
 */

window.__PERFORMANCE_CONFIG__ = {

  /* ── FUENTE DE DATOS (ENLACE INTEGRADO SIN RESTRICCIONES) ── */
  /* ── FUENTE DE DATOS (ENLACE INTEGRADO SIN RESTRICCIONES) ── */
  CSV_URL: "https://docs.google.com/spreadsheets/d/1vQmZFJ_nA1hFCcM2XAkZ-mKM52hMojZr7jR3WLolD-dMfbBD0PzfjYsnn62jAUxCdWyQP0h63dZL33t/export?format=csv",
  REFRESH_INTERVAL_MS: 300000, // 5 minutos

  /* ── ASIGNACIÓN DE ASESORES POR CAMPAÑA ──────────────────── */
  CAMPAIGNS: {
    "RECORDACION": {
      label: "Recordación",
      color: "#1e51a4",
      colorLight: "#467ec6",
      agents: [
        "DIANA-MILLON", "LUZ-ARIAGU", "MARIA-ALEVIL", "MARIANA-MUNGON",
        "JENNIFER-MARCAR", "JUAN-GALCAR", "DANIELA-MEJCOR", "KATHERIN-CHATAP", "SEBASTIAN-CASARA"
      ],
      /* Meta mensual en pesos (COP) */
      budget: 28000000,
      type: "recordacion"
    },
    "FIDELIZACION_A": {
      label: "Fidelización A",
      color: "#1e51a4",
      colorLight: "#467ec6",
      agents: [
        "MONICA-GUZCRU", "CESAR-JARCAR", "LEIDY-BERMUDEZ",
        "ELSI-MANHER", "LAURA-LOPHEN", "CINDY-ESPZUL"
      ],
      budget: 24000000,
      type: "fidelizacion"
    },
    "RETENCION": {
      label: "Retención",
      color: "#1e51a4",
      colorLight: "#467ec6",
      agents: [
        "ERIKA-VILLA", "JESSICA-TORMAR", "DIANA-MARBOR", "MARIA-RINCAS"
      ],
      budget: 16000000,
      type: "retencion"
    },
    "RENACER_MASCOTAS": {
      label: "Renacer Mascotas",
      color: "#1e51a4",
      colorLight: "#467ec6",
      agents: [
        "JUAN-CASVAL"
      ],
      budget: 4000000,
      type: "fidelizacion"
    }
  },

  /* ── META INDIVIDUAL POR ASESOR (pesos COP) ───────────────── */
  AGENT_BUDGET: {
    "DIANA-MILLON":    3500000,
    "LUZ-ARIAGU":      3500000,
    "MARIA-ALEVIL":    3500000,
    "MARIANA-MUNGON":  3500000,
    "JENNIFER-MARCAR": 3500000,
    "JUAN-GALCAR":     3500000,
    "DANIELA-MEJCOR":  3500000,
    "KATHERIN-CHATAP": 3500000,
    "SEBASTIAN-CASARA":3500000,
    "MONICA-GUZCRU":   4000000,
    "CESAR-JARCAR":    4000000,
    "LEIDY-BERMUDEZ":  4000000,
    "ELSI-MANHER":     4000000,
    "LAURA-LOPHEN":    4000000,
    "CINDY-ESPZUL":    4000000,
    "ERIKA-VILLA":     4000000,
    "JESSICA-TORMAR":  4000000,
    "DIANA-MARBOR":    4000000,
    "MARIA-RINCAS":    4000000,
    "JUAN-CASVAL":     4000000
  },

  /* ── TABLA COMISIONAL ESCALONADA ─────────────────────────── */
  COMMISSION_TABLE: [
    { desde: 0.00,  hasta: 0.85,  recordacion:    0, fidelizacion:    0 },
    { desde: 0.85,  hasta: 0.90,  recordacion:  150, fidelizacion:  200 },
    { desde: 0.90,  hasta: 1.00,  recordacion:  200, fidelizacion:  300 },
    { desde: 1.00,  hasta: 1.01,  recordacion:  300, fidelizacion:  500 },
    { desde: 1.01,  hasta: 999,   recordacion:  310, fidelizacion:  520 }
  ],

  /* ── UMBRALES DE KPI (colores semáforo) ─────────────────── */
  KPI_THRESHOLDS: {
    cumplimiento_verde:    1.00,
    cumplimiento_amarillo: 0.85,
    efectividad_verde:     0.70,
    efectividad_amarillo:  0.50
  },

  /* ── TEXTOS / BRANDING ───────────────────────────────────── */
  BRAND: {
    company: "Call Center Analytics",
    title: "Dashboard de Performance",
    subtitle: "Auditoría Comisional · Cartera · Campañas Activas",
    logo_initials: "JR"
  }
};