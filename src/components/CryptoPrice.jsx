import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function CryptoPrice({
  id,
  name,
  symbol,
  price,
  change24h,
  currency = "usd",
}) {
  const isPositive = change24h >= 0;
  const priceFormatted = price?.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // 🔴 CAMBIA ESTOS CÓDIGOS DE REFERIDO POR LOS TUYOS
  const affiliateLinks = {
    binance: `https://accounts.binance.com/register?ref=TU_CODIGO_BINANCE`,
    coinbase: `https://www.coinbase.com/join/TU_CODIGO_COINBASE`,
    bitso: `https://bitso.com/?ref=TU_CODIGO_BITSO`,
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-800">{name}</h3>
          <p className="text-xs text-gray-400 uppercase">{symbol}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">
            {currency === "usd" ? "$" : "COP "}
            {priceFormatted}
          </p>
          <div
            className={`flex items-center gap-1 text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}
          >
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {change24h?.toFixed(2)}%
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={affiliateLinks.binance}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-full transition"
        >
          Comprar en Binance
        </a>
        <a
          href={affiliateLinks.coinbase}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition"
        >
          Comprar en Coinbase
        </a>
        <a
          href={affiliateLinks.bitso}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full transition"
        >
          Comprar en Bitso
        </a>
      </div>
    </div>
  );
}
