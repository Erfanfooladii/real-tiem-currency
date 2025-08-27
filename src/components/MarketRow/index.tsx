import { useMarketStore } from "@/stores/useMarketStore";
import { MarketInfo } from "@/types/marketTypes";
import Link from "next/link";

const MarketRow = ({ item, index }: { item: MarketInfo; index: number }) => {
  const price = useMarketStore((state) => state.prices[item.symbol]);

  return (
    <tr className="border-t hover:bg-gray-50 transition cursor-pointer">
      <td className="py-6 px-4">{index + 1}</td>
      <td className="py-6 px-4 font-medium">
        <Link
          className="text-blue-400 hover:text-blue-500"
          href={`/currency/${item.symbol}`}
        >
          {item.symbol}
        </Link>
      </td>
      <td className="py-6 px-4">{item.baseAsset}</td>
      <td className="py-6 px-4">{item.quoteAsset}</td>
      <td
        className={`py-6 px-4 ${
          item.status === "TRADING" ? "text-green-600" : "text-red-600"
        }`}
      >
        {item.status}
      </td>
      <td className="py-6 px-4 font-semibold">
        {price ? `${price} ${item.quoteAsset}` : "Loading..."}
      </td>
    </tr>
  );
};
export default MarketRow;
