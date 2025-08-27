"use client";

import { useMarketStore } from "@/stores/useMarketStore";
import React, { useEffect, useState } from "react";
import MarketRow from "../MarketRow";
import { MarketInfo } from "@/types/marketTypes";
import { allSymbols } from "@/constants/data";

const TabdealMarkets = () => {
  const [list, setList] = useState<MarketInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const subscribe = useMarketStore((s) => s.subscribe);

  useEffect(() => {
    const getData = async () => {
      try {
        const symbols = JSON.stringify(allSymbols);
        const url = `https://api1.tabdeal.org/r/api/v1/exchangeInfo?symbols=${symbols}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch data");
        const data: MarketInfo[] = await res.json();
        setList(data);
      } catch (err) {
        console.error("Error fetching markets:", err);
      } finally {
        setLoading(false);
        subscribe(allSymbols);
      }
    };
    getData();
  }, [subscribe]);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tabdeal Markets</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-6 px-4 text-left">#</th>
              <th className="py-6 px-4 text-left">Symbol</th>
              <th className="py-6 px-4 text-left">Base Asset</th>
              <th className="py-6 px-4 text-left">Quote Asset</th>
              <th className="py-6 px-4 text-left">Status</th>
              <th className="py-6 px-4 text-left">Price</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <MarketRow key={item.symbol} item={item} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TabdealMarkets;
