import { useState, useEffect } from "react";

const API_URL = "https://api.coingecko.com/api/v3/simple/price";
const DEFAULT_IDS =
  "bitcoin,ethereum,solana,cardano,binancecoin,ripple,polkadot,avalanche-2,dogecoin,shiba-inu";
const DEFAULT_CURRENCY = "usd";

export function useCryptoPrices(
  ids = DEFAULT_IDS,
  currency = DEFAULT_CURRENCY,
) {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const url = `${API_URL}?ids=${ids}&vs_currencies=${currency}&include_24hr_change=true`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error al obtener precios");
        const data = await response.json();
        setPrices(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);

    return () => clearInterval(interval);
  }, [ids, currency]);

  return { prices, loading, error };
}
