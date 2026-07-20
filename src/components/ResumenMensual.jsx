import { FileText, Download } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import FacturaPDF from "./FacturaPDF";

export default function ResumenMensual({ lecturas }) {
  if (!lecturas || !lecturas.resumen) {
    return null;
  }

  const { resumen, periodo, valorKW, aseo } = lecturas;

  // Calcular totales
  const totalConsumo = resumen.datos.reduce((sum, d) => sum + d.consumo, 0);
  const totalEnergia = resumen.datos.reduce(
    (sum, d) => sum + d.valorEnergia,
    0,
  );
  const totalAseo = resumen.datos.reduce((sum, d) => sum + (d.aseo || 0), 0);

  return (
    <div className="card mt-6 overflow-x-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-100 rounded-lg">
            <FileText className="text-green-600" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Resumen del Período
            </h2>
            <p className="text-sm text-gray-500">
              {periodo.inicio && new Date(periodo.inicio).toLocaleDateString()}
              {" - "}
              {periodo.fin && new Date(periodo.fin).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Botón PDF */}
        <PDFDownloadLink
          document={
            <FacturaPDF
              datos={resumen.datos}
              periodo={{
                inicio: periodo.inicio,
                fin: periodo.fin,
              }}
              valorKW={valorKW}
            />
          }
          fileName={`factura-${new Date().toISOString().slice(0, 10)}.pdf`}
        >
          {({ loading }) => (
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm"
              disabled={loading}
            >
              <Download size={16} />
              {loading ? "Generando PDF..." : "📄 Descargar PDF"}
            </button>
          )}
        </PDFDownloadLink>
      </div>

      {/* Tarjetas de totales */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-blue-50 rounded-lg px-3 py-2 text-center">
          <p className="text-xs text-gray-500">Consumo Total</p>
          <p className="font-bold text-blue-600">
            {Math.round(totalConsumo)} kWh
          </p>
        </div>
        <div className="bg-green-50 rounded-lg px-3 py-2 text-center">
          <p className="text-xs text-gray-500">Energía Total</p>
          <p className="font-bold text-green-600">
            ${Math.round(totalEnergia).toLocaleString()}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg px-3 py-2 text-center">
          <p className="text-xs text-gray-500">Total General</p>
          <p className="font-bold text-purple-600">
            ${Math.round(resumen.totalGeneral).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Apto
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Consumo (kWh)
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor Energía
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                ASEO
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total a Pagar
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {resumen.datos.map((item, index) => {
              const isZonasComunes = item.apto === "201";
              // Asegurar que aseo tenga un valor
              const aseoValue = item.aseo || aseo || 0;
              return (
                <tr
                  key={item.apto}
                  className={`
                    ${isZonasComunes ? "bg-blue-50" : ""}
                    ${index % 2 === 0 && !isZonasComunes ? "bg-white" : ""}
                    ${index % 2 === 1 && !isZonasComunes ? "bg-gray-50" : ""}
                    hover:bg-gray-100 transition-colors
                  `}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      {item.apto}
                      {isZonasComunes && (
                        <span className="badge badge-blue">
                          (ZC)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-mono">
                    {item.consumo}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-mono">
                    ${Math.round(item.valorEnergia).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-mono">
                    ${Math.round(aseoValue).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-bold font-mono text-blue-600">
                    ${Math.round(item.total).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-100">
            <tr>
              <td className="px-4 py-3 text-sm font-bold text-gray-900">
                TOTAL
              </td>
              <td className="px-4 py-3 text-sm text-right font-bold font-mono">
                {Math.round(totalConsumo)}
              </td>
              <td className="px-4 py-3 text-sm text-right font-bold font-mono">
                ${Math.round(totalEnergia).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-sm text-right font-bold font-mono">
                ${Math.round(totalAseo).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-sm text-right font-bold font-mono text-blue-600">
                ${Math.round(resumen.totalGeneral).toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-4 text-xs text-gray-400 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <span>💡 El apartamento 201 incluye consumo de zonas comunes</span>
        <span className="sm:ml-auto">Valor kWh: ${valorKW}</span>
      </div>
    </div>
  );
}
