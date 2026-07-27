import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function Graficas({ historial }) {
  if (!historial || historial.length === 0) {
    return (
      <div className="card mt-6 text-center py-12">
        <div className="text-gray-400 mb-3">
          <BarChart3 size={48} className="mx-auto" />
        </div>
        <p className="text-gray-500 font-medium">
          No hay datos suficientes para mostrar gráficas
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Guarda al menos 2 meses para ver tendencias
        </p>
      </div>
    );
  }

  const aptos = ["202", "203", "301", "302"];
  const colores = {
    202: {
      bg: "rgba(59, 130, 246, 0.8)",
      border: "#3B82F6",
      light: "rgba(59, 130, 246, 0.1)",
    },
    203: {
      bg: "rgba(34, 197, 94, 0.8)",
      border: "#22C55E",
      light: "rgba(34, 197, 94, 0.1)",
    },
    301: {
      bg: "rgba(168, 85, 247, 0.8)",
      border: "#A855F7",
      light: "rgba(168, 85, 247, 0.1)",
    },
    302: {
      bg: "rgba(251, 146, 60, 0.8)",
      border: "#FB923C",
      light: "rgba(251, 146, 60, 0.1)",
    },
  };

  // Tomar últimos 6 meses
  const ultimosMeses = historial.slice(-6);
  const meses = ultimosMeses.map((h) => {
    if (h.periodo?.inicio) {
      const fecha = new Date(h.periodo.inicio);
      return fecha.toLocaleDateString("es-ES", {
        month: "short",
        year: "numeric",
      });
    }
    return "Sin fecha";
  });

  // Calcular totales para mostrar estadísticas
  const totalPorApto = {};
  aptos.forEach((apto) => {
    totalPorApto[apto] = ultimosMeses.reduce((sum, h) => {
      return sum + (h.consumos?.[apto]?.consumo || 0);
    }, 0);
  });
  totalPorApto["201"] = ultimosMeses.reduce((sum, h) => {
    return sum + (h.consumos?.["201"]?.consumo || 0);
  }, 0);

  // Encontrar el mayor consumo
  const maxConsumo = Math.max(...Object.values(totalPorApto));

  const datasets = aptos.map((apto) => ({
    label: `Apto ${apto}`,
    data: ultimosMeses.map((h) => {
      const consumo = h.consumos?.[apto]?.consumo || 0;
      return consumo;
    }),
    backgroundColor: colores[apto].bg,
    borderColor: colores[apto].border,
    borderWidth: 2,
    borderRadius: 8,
    hoverBackgroundColor: colores[apto].border,
    hoverBorderColor: colores[apto].border,
  }));

  // Agregar Apto 201
  datasets.push({
    label: "Apto 201 (ZC)",
    data: ultimosMeses.map((h) => {
      const consumo = h.consumos?.["201"]?.consumo || 0;
      return consumo;
    }),
    backgroundColor: "rgba(239, 68, 68, 0.7)",
    borderColor: "#EF4444",
    borderWidth: 2,
    borderRadius: 8,
    hoverBackgroundColor: "#EF4444",
    hoverBorderColor: "#EF4444",
  });

  const data = {
    labels: meses,
    datasets: datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 12, weight: "500" },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 12,
        },
      },
      title: {
        display: true,
        text: "📊 Consumo por Apartamento (kWh)",
        font: { size: 18, weight: "bold" },
        padding: { bottom: 20 },
        color: "#1f2937",
      },
      tooltip: {
        backgroundColor: "rgba(255,255,255,0.95)",
        titleColor: "#1f2937",
        bodyColor: "#4b5563",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y} kWh`;
          },
          afterBody: function (context) {
            const total = context.reduce((sum, c) => sum + c.parsed.y, 0);
            return `Total: ${total} kWh`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: maxConsumo * 1.15 || 100,
        title: {
          display: true,
          text: "Consumo (kWh)",
          font: { size: 12, weight: "500" },
          color: "#6b7280",
        },
        grid: {
          color: "rgba(0,0,0,0.06)",
          drawBorder: false,
        },
        ticks: {
          font: { size: 11 },
          color: "#6b7280",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 11, weight: "500" },
          color: "#6b7280",
        },
      },
    },
    animation: {
      duration: 800,
      easing: "easeOutQuart",
    },
    hover: {
      mode: "index",
      intersect: false,
    },
  };

  return (
    <div className="card mt-6">
      {/* Título y estadísticas rápidas */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-600" />
          Consumo mensual
        </h3>
        <div className="flex gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            {ultimosMeses.length} meses
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            {aptos.length + 1} apartamentos
          </span>
        </div>
      </div>

      {/* Gráfica */}
      <div className="h-72 sm:h-80">
        <Bar data={data} options={options} />
      </div>

      {/* Resumen rápido */}
      <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2">
        {Object.entries(totalPorApto).map(([apto, total]) => {
          const colors = colores[apto] || {
            bg: "rgba(239, 68, 68, 0.7)",
            border: "#EF4444",
          };
          const isZonasComunes = apto === "201";
          return (
            <div
              key={apto}
              className="text-center p-2 rounded-lg bg-gray-50"
              style={{ borderLeft: `3px solid ${colors.border}` }}
            >
              <p className="text-xs text-gray-500 font-medium">
                {isZonasComunes ? "ZC" : `Apto ${apto}`}
              </p>
              <p className="text-sm font-bold text-gray-800">
                {Math.round(total)} kWh
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-3 text-xs text-gray-400 text-center">
        * Últimos {ultimosMeses.length} meses registrados
      </div>
    </div>
  );
}
