"use client";
import { useCryptoPrice } from "@/hooks/useGetPrice";
import { Crypto } from "@/types/crypto";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const symbolToId: Record<string, string> = {
  BTCUSDT: "bitcoin",
  ETHUSDT: "ethereum",
  DOGEUSDT: "dogecoin",
  BNBUSDT: "binancecoin",
  XRPUSDT: "ripple",
  ADAUSDT: "cardano",
  SOLUSDT: "solana",
  MATICUSDT: "matic-network",
  LTCUSDT: "litecoin",
  TRXUSDT: "tron",
  SHIBUSDT: "shiba-inu",
  DOTUSDT: "polkadot",
  AVAXUSDT: "avalanche-2",
};

const allSymbols: string[] = [
  "BTCUSDT",
  "ETHUSDT",
  "DOGEUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "SOLUSDT",
  "MATICUSDT",
  "LTCUSDT",
  "TRXUSDT",
  "SHIBUSDT",
  "DOTUSDT",
  "AVAXUSDT",
];

export default function TabdealOrderBook() {
  const [list, setList] = useState<Crypto[]>([]);

  const prices = allSymbols.map((s) => useCryptoPrice(s));

  useEffect(() => {
    const getData = async () => {
      const ids = allSymbols
        .map((s) => symbolToId[s])
        .filter(Boolean)
        .join(",");
      console.log(ids);

      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}`
      );
      const datas: Crypto[] = await res.json();
      setList(datas);
    };
    getData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Crypto Prices</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">#</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Symbol</th>
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-left">24h %</th>
              <th className="py-2 px-4 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {list?.map((item, index) => {
              const priceCurent = prices[index];

              return (
                <tr
                  key={item.id}
                  className="border-t hover:bg-gray-50 transition cursor-pointer"
                >
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4 font-medium">{item.name}</td>
                  <td className="py-2 px-4 uppercase">{item.symbol}</td>
                  <td className="py-2 px-4">
                    {priceCurent ? `$${priceCurent}` : "…"}
                  </td>
                  <td
                    className={`py-2 px-4 ${
                      item.price_change_percentage_24h > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.price_change_percentage_24h.toFixed(2)}%
                  </td>
                  <td className="py-2 px-4 text-blue-600 hover:underline">
                    <Link href={`/currency/${item.id}`}>
                      to currency details
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
