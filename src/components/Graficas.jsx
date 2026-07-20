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
import { BarChart3 } from "lucide-react";

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
    202: { bg: "rgba(59, 130, 246, 0.7)", border: "#3B82F6" },
    203: { bg: "rgba(34, 197, 94, 0.7)", border: "#22C55E" },
    301: { bg: "rgba(168, 85, 247, 0.7)", border: "#A855F7" },
    302: { bg: "rgba(251, 146, 60, 0.7)", border: "#FB923C" },
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

  const datasets = aptos.map((apto) => ({
    label: `Apto ${apto}`,
    data: ultimosMeses.map((h) => {
      const consumo = h.consumos?.[apto]?.consumo || 0;
      return consumo;
    }),
    backgroundColor: colores[apto].bg,
    borderColor: colores[apto].border,
    borderWidth: 2,
    borderRadius: 6,
  }));

  // Agregar Apto 201
  datasets.push({
    label: "Apto 201 (ZC)",
    data: ultimosMeses.map((h) => {
      const consumo = h.consumos?.["201"]?.consumo || 0;
      return consumo;
    }),
    backgroundColor: "rgba(239, 68, 68, 0.5)",
    borderColor: "#EF4444",
    borderWidth: 2,
    borderRadius: 6,
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
          font: { size: 12 },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      title: {
        display: true,
        text: "📈 Consumo por Apartamento (kWh)",
        font: { size: 16, weight: "bold" },
        padding: { bottom: 20 },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y} kWh`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "kWh",
          font: { size: 12 },
        },
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="card mt-6">
      <div className="h-80">
        <Bar data={data} options={options} />
      </div>
      <div className="mt-4 text-xs text-gray-400 text-center">
        * Últimos {ultimosMeses.length} meses registrados
      </div>
    </div>
  );
}
