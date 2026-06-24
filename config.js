/**
 * ============================================================
 *  PERFORMANCE DASHBOARD — CONFIG PANEL
 *  Editable by Supervisor (sin conocimientos técnicos)
 *  Versión: 2.0 | Fecha: 2026
 * ============================================================
 *
 *  INSTRUCCIONES:
 *  1. Abrir este archivo con el Bloc de Notas.
 *  2. Modificar SOLO los valores numéricos o nombres.
 *  3. Guardar y recargar el index.html en el navegador.
 *  NO eliminar comas, llaves ni corchetes.
 * ============================================================
 */

window.__PERFORMANCE_CONFIG__ = {

  /* ── FUENTE DE DATOS ──────────────────────────────────────── */
  CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQmZFJ_nA1hFCcM2XAkZ-mKM52hMojZr7jR3WLolD-dMfbBD0PzfjYsnn62jAUxCdWyQP0h63dZL33t/pub?output=csv",
  REFRESH_INTERVAL_MS: 300000, // 5 minutos

  /* ── ASIGNACIÓN DE ASESORES POR CAMPAÑA ──────────────────── */
  CAMPAIGNS: {
    "RECORDACION": {
      label: "Recordación",
      color: "#1e40af",       /* Azul Rey Jardines */
      colorLight: "#3b82f6",
      agents: [
        "DIANA-MILLON", "LUZ-ARIAGU", "MARIA-ALEVIL", "MARIANA-MUNGON",
        "JENNIFER-MARCAR", "JUAN-GALCAR", "DANIELA-MEJCOR", "KATHERIN-CHATAP"
      ],
      /* Meta mensual en pesos (COP) */
      budget: 111357871,      /* Suma de columna I para Recordación en Drive */
      type: "recordacion"
    },
    "FIDELIZACION_A": {
      label: "Fidelización",
      color: "#16a34a",       /* Verde Ejecutivo Mate */
      colorLight: "#22c55e",
      agents: [
        "MONICA-GUZCRU", "CESAR-JARCAR", "LEIDY-BERMUDEZ",
        "ELSI-MANHER", "LAURA-LOPHEN", "CINDY-ESPZUL"
      ],
      budget: 86700000,       /* Suma de columna I para Fidelización A en Drive */
      type: "fidelizacion"
    },
    "Retención": {
      label: "Retención",
      color: "#d97706",       /* Ocre / Bronce Sobrio */
      colorLight: "#f59e0b",
      agents: [
        "ERIKA-VILLA", "JESSICA-TORMAR", "DIANA-MARBOR", "MARIA-RINCAS"
      ],
      budget: 21600000,       /* Suma de columna I para Fidelización B en Drive */
      type: "fidelizacion"
    },
    "RENACER_MASCOTAS": {
      label: "Renacer Mascotas",
      color: "#2563eb",       /* Variación Azul Rey */
      colorLight: "#60a5fa",
      agents: [
        "JUAN-CASVAL"
      ],
      budget: 18929785,       /* Columna I para Juan Casval en Drive */
      type: "fidelizacion"
    }
  },

  /* ── META INDIVIDUAL POR ASESOR (pesos COP) ───────────────── */
  /*  Ajustar según el presupuesto asignado individualmente.     */
  AGENT_BUDGET: {
    // RECORDACIÓN
    "DIANA-MILLON":    11357871,
    "LUZ-ARIAGU":      11357871,
    "MARIA-ALEVIL":    11357871,
    "MARIANA-MUNGON":  11357871,
    "JENNIFER-MARCAR": 11357871,
    "JUAN-GALCAR":     11357871,
    "DANIELA-MEJCOR":  11357871,
    "KATHERIN-CHATAP": 15000000,
    // FIDELIZACIÓN
    "MONICA-GUZCRU":   14450000,
    "CESAR-JARCAR":    14450000,
    "LEIDY-BERMUDEZ":  14450000,
    "ELSI-MANHER":     14450000,
    "LAURA-LOPHEN":    14450000,
    "CINDY-ESPZUL":    14450000,
    // RETENCIÓN
    "ERIKA-VILLA":     9000000,
    "JESSICA-TORMAR":  9000000,
    "DIANA-MARBOR":    9000000,
    "MARIA-RINCAS":    9000000,
    // RENACER MASCOTAS
    "JUAN-CASVAL":     18929785
  },

  /* ── TABLA COMISIONAL ESCALONADA ─────────────────────────── */
  /*  Formato: { desde: X, hasta: Y, recordacion: $, fidelizacion: $ }
      'hasta' es exclusivo (el siguiente escalón empieza donde termina el anterior).
      Usar 999 como techo ilimitado.                             */
  COMMISSION_TABLE: [
    { desde: 0.00,  hasta: 0.85,  recordacion:    0, fidelizacion:    0 },
    { desde: 0.85,  hasta: 0.90,  recordacion:  150, fidelizacion:  200 },
    { desde: 0.90,  hasta: 1.00,  recordacion:  200, fidelizacion:  300 },
    { desde: 1.00,  hasta: 1.01,  recordacion:  300, fidelizacion:  500 },
    { desde: 1.01,  hasta: 999,   recordacion:  310, fidelizacion:  520 }
  ],

  /* ── UMBRALES DE KPI (colores semáforo) ─────────────────── */
  KPI_THRESHOLDS: {
    cumplimiento_verde:    1.00,   // >= 100% → verde
    cumplimiento_amarillo: 0.85,   // >= 85%  → amarillo
                                   // < 85%   → rojo
    efectividad_verde:     0.70,
    efectividad_amarillo:  0.50
  },

  /* ── TEXTOS / BRANDING ───────────────────────────────────── */
  BRAND: {
    company: "Jardines",
    title: "Analítica de Operaciones",
    subtitle: "Auditoría Comisional · Control de Cartera",
    logo_initials: "JR"
  }
};