import Gracchi from "node-gracchi-api";
import Binance, { AvgPriceResult } from "binance-api-node";

const base = "BNB",
  quote = "CBRL";

const bnb = Binance();

const api = new Gracchi({
  key: process.env.GRACCHI_KEY,
  url: "https://cex-api-staging.coinsamba.com",
});

const placeOrder = async (side: "ask" | "bid", price: number) => {
  const res = await api.placeOrder({
    base,
    quote,
    amount: 0.1,
    price,
    side,
  });

  return res.orderId;
};

setInterval(async () => {
  const rand = Math.random();

  const avgPrice = (await bnb.avgPrice({
    symbol: "BNBBRL",
  })) as AvgPriceResult;

  if (rand > 0.5) {
    await placeOrder("bid", Number(Number(avgPrice.price).toFixed(2)));
    await placeOrder("ask", Number(Number(avgPrice.price).toFixed(2)));
  } else {
    await placeOrder("ask", Number(Number(avgPrice.price).toFixed(2)));
    await placeOrder("bid", Number(Number(avgPrice.price).toFixed(2)));
  }
}, 25 * 1000);
