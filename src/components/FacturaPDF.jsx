import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// ============================================
// ESTILOS MEJORADOS Y ORGANIZADOS
// ============================================
const styles = StyleSheet.create({
  // ===== PÁGINA =====
  page: {
    padding: 40,
    fontSize: 10,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },

  // ===== ENCABEZADOS =====
  header: {
    marginBottom: 25,
    borderBottomWidth: 2,
    borderBottomColor: "#1a56db",
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    color: "#1a56db",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
    color: "#4b5563",
  },
  companyName: {
    fontSize: 10,
    textAlign: "center",
    color: "#6b7280",
    marginTop: 3,
  },

  // ===== TABLA =====
  table: {
    display: "table",
    width: "100%",
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1a56db",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  tableRowAlternate: {
    backgroundColor: "#f9fafb",
  },
  tableRowTotal: {
    backgroundColor: "#eff6ff",
    borderBottomWidth: 0,
  },

  // ===== COLUMNAS =====
  colApto: {
    flex: 0.5,
    textAlign: "left",
    paddingHorizontal: 4,
    fontSize: 9,
  },
  colConsumo: {
    flex: 0.7,
    textAlign: "right",
    paddingHorizontal: 4,
    fontSize: 9,
  },
  colValor: {
    flex: 1,
    textAlign: "right",
    paddingHorizontal: 4,
    fontSize: 9,
  },
  colAseo: {
    flex: 0.8,
    textAlign: "right",
    paddingHorizontal: 4,
    fontSize: 9,
  },
  colTotal: {
    flex: 1,
    textAlign: "right",
    paddingHorizontal: 4,
    fontSize: 9,
  },

  // ===== TOTALES =====
  totalBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#eff6ff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
    color: "#1a56db",
  },
  totalLabel: {
    fontSize: 12,
    color: "#4b5563",
    textAlign: "right",
  },

  // ===== RESUMEN =====
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#1f2937",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    fontSize: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    color: "#4b5563",
    fontWeight: "bold",
  },
  infoValue: {
    color: "#1f2937",
  },

  // ===== DESGLOSE =====
  desgloseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    fontSize: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingHorizontal: 4,
  },
  desgloseApto: {
    fontWeight: "bold",
    color: "#1f2937",
  },
  desgloseDetalle: {
    color: "#4b5563",
  },
  desgloseTotal: {
    fontWeight: "bold",
    color: "#1a56db",
  },

  // ===== FOOTER =====
  footer: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 15,
  },
  footerHighlight: {
    color: "#1a56db",
    fontWeight: "bold",
  },
});

// ============================================
// FUNCIÓN PARA FORMATEAR MONEDA
// ============================================
const formatCurrency = (value) => {
  return "$" + Math.round(value).toLocaleString("es-CO");
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function FacturaPDF({ datos, periodo, valorKW }) {
  // Cálculos de totales
  const totalGeneral = datos.reduce((sum, d) => sum + d.total, 0);
  const totalConsumo = datos.reduce((sum, d) => sum + d.consumo, 0);
  const totalEnergia = datos.reduce((sum, d) => sum + d.valorEnergia, 0);
  const totalAseo = datos.reduce((sum, d) => sum + (d.aseo || 0), 0);

  // Formatear fecha
  const fechaActual = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ==========================================
            HEADER
            ========================================== */}
        <View style={styles.header}>
          <Text style={styles.title}>⚡ FACTURA DE ELECTRICIDAD</Text>
          <Text style={styles.subtitle}>
            Período: {periodo.inicio} al {periodo.fin}
          </Text>
          <Text style={styles.companyName}>
            Edificio - Gestión de Consumo Eléctrico
          </Text>
        </View>

        {/* ==========================================
            TABLA DE CONSUMOS
            ========================================== */}
        <View style={styles.table}>
          {/* HEADER DE LA TABLA */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colApto]}>APTO</Text>
            <Text style={[styles.tableHeaderText, styles.colConsumo]}>
              CONSUMO
            </Text>
            <Text style={[styles.tableHeaderText, styles.colValor]}>
              VALOR ENERGÍA
            </Text>
            <Text style={[styles.tableHeaderText, styles.colAseo]}>ASEO</Text>
            <Text style={[styles.tableHeaderText, styles.colTotal]}>TOTAL</Text>
          </View>

          {/* FILAS DE LA TABLA */}
          {datos.map((item, index) => {
            const aseoValue = item.aseo || 0;
            const isZonasComunes = item.apto === "201";
            const isEven = index % 2 === 0;

            return (
              <View
                style={[
                  styles.tableRow,
                  isEven && !isZonasComunes ? styles.tableRowAlternate : {},
                  isZonasComunes ? styles.tableRowTotal : {},
                ]}
                key={item.apto}
              >
                <Text
                  style={[
                    styles.colApto,
                    { fontWeight: isZonasComunes ? "bold" : "normal" },
                  ]}
                >
                  {item.apto} {isZonasComunes && "🏢"}
                </Text>
                <Text style={[styles.colConsumo]}>{item.consumo}</Text>
                <Text style={[styles.colValor]}>
                  {formatCurrency(item.valorEnergia)}
                </Text>
                <Text style={[styles.colAseo]}>
                  {formatCurrency(aseoValue)}
                </Text>
                <Text
                  style={[
                    styles.colTotal,
                    { fontWeight: "bold", color: "#1a56db" },
                  ]}
                >
                  {formatCurrency(item.total)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* ==========================================
            TOTAL GENERAL (Destacado)
            ========================================== */}
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>TOTAL GENERAL</Text>
          <Text style={styles.totalText}>{formatCurrency(totalGeneral)}</Text>
        </View>

        {/* ==========================================
            RESUMEN
            ========================================== */}
        <Text style={styles.sectionTitle}>📊 Resumen del Período</Text>
        <View style={{ marginTop: 5 }}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Consumo Total:</Text>
            <Text style={styles.infoValue}>{Math.round(totalConsumo)} kWh</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Valor Energía Total:</Text>
            <Text style={styles.infoValue}>{formatCurrency(totalEnergia)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ASEO Total:</Text>
            <Text style={styles.infoValue}>{formatCurrency(totalAseo)}</Text>
          </View>
          <View style={[styles.infoRow, styles.infoRowLast]}>
            <Text style={styles.infoLabel}>Valor del kWh:</Text>
            <Text style={styles.infoValue}>${valorKW}</Text>
          </View>
        </View>

        {/* ==========================================
            DESGLOSE POR APARTAMENTO
            ========================================== */}
        <Text style={[styles.sectionTitle, { marginTop: 15, fontSize: 12 }]}>
          📋 Desglose por Apartamento
        </Text>
        <View style={{ marginTop: 5 }}>
          {datos.map((item) => {
            const isZonasComunes = item.apto === "201";
            return (
              <View
                style={[
                  styles.desgloseRow,
                  isZonasComunes && { backgroundColor: "#eff6ff" },
                ]}
                key={item.apto + "-resumen"}
              >
                <Text style={styles.desgloseApto}>
                  Apto {item.apto} {isZonasComunes && "(ZC)"}
                </Text>
                <Text style={styles.desgloseTotal}>
                  {formatCurrency(item.total)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* ==========================================
            FOOTER
            ========================================== */}
        <Text style={styles.footer}>
          Factura generada automáticamente el {fechaActual}
          {"\n"}
          <Text style={styles.footerHighlight}>
            Los datos se basan en las lecturas ingresadas
          </Text>
        </Text>
      </Page>
    </Document>
  );
}
