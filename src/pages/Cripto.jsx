import React, { useState } from "react";
import { useCryptoPrices } from "../hooks/useCryptoPrices";
import CryptoPrice from "../components/CryptoPrice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { RefreshCw, DollarSign, TrendingUp } from "lucide-react";

const CRYPTO_LIST = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "solana", name: "Solana", symbol: "SOL" },
  { id: "cardano", name: "Cardano", symbol: "ADA" },
  { id: "binancecoin", name: "BNB", symbol: "BNB" },
  { id: "ripple", name: "XRP", symbol: "XRP" },
  { id: "polkadot", name: "Polkadot", symbol: "DOT" },
  { id: "avalanche-2", name: "Avalanche", symbol: "AVAX" },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE" },
  { id: "shiba-inu", name: "Shiba Inu", symbol: "SHIB" },
];

export default function Cripto() {
  const [currency, setCurrency] = useState("usd");
  const { prices, loading, error } = useCryptoPrices(
    CRYPTO_LIST.map((c) => c.id).join(","),
    currency,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="text-green-500" size={28} />
              Precios de Criptomonedas
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Datos en tiempo real • Actualización cada 30 segundos
            </p>
          </div>
          <div className="flex items-center gap-3 mt-3 sm:mt-0">
            <button
              onClick={() => setCurrency(currency === "usd" ? "cop" : "usd")}
              className="flex items-center gap-1 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
            >
              <DollarSign size={16} />
              {currency === "usd" ? "USD" : "COP"}
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-1 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
            >
              <RefreshCw size={16} />
              Actualizar
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Cargando precios...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center">
            ❌ Error al cargar precios: {error}
          </div>
        )}

        {/* Grid de precios */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {CRYPTO_LIST.map((crypto) => {
              const data = prices[crypto.id] || {};
              return (
                <CryptoPrice
                  key={crypto.id}
                  id={crypto.id}
                  name={crypto.name}
                  symbol={crypto.symbol}
                  price={data[currency]}
                  change24h={data[`${currency}_24h_change`]}
                  currency={currency}
                />
              );
            })}
          </div>
        )}

        {/* Zona de publicidad / afiliados */}
        <div className="mt-10 p-4 bg-gray-100 rounded-lg text-center text-gray-400 text-sm border border-dashed border-gray-300">
          💼 Espacio para publicidad o enlaces de afiliados
          <br />
          <span className="text-xs">
            (Contacta con proyectos cripto para colocar banners aquí)
          </span>
        </div>

        {/* Newsletter */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            📬 Recibe alertas de precios
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Suscríbete para recibir notificaciones cuando alguna cripto alcance
            un precio clave.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Próximamente: suscripción a alertas");
            }}
          >
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Suscribirme
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-2">
            No compartiremos tu correo. Puedes darte de baja en cualquier
            momento.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
