import Gracchi from "node-gracchi-api";
import Binance from "binance-api-node";

const base = "BNB",
  quote = "CBRL";

let basePrice = 1;

const bnb = Binance();

const api = new Gracchi({
  key: process.env.GRACCHI_KEY,
  url: "https://cex-api-staging.coinsamba.com",
});

let orders = [];

const placeOrder = async (side: "ask" | "bid") => {
  const random = Math.random();

  const res = await api.placeOrder({
    base,
    quote,
    amount: 10,
    // @ts-ignore
    price: (basePrice * 1 + (random * side === "ask" ? 1 : -1)).toFixed(1),
    side,
  });

  return res.orderId;
};

// place orders with high spread
setInterval(async () => {
  const avgPrice = await bnb.avgPrice({
    symbol: "BNBBRL",
  });

  // @ts-ignore
  basePrice = avgPrice.price;

  orders.push(await placeOrder("bid"));
  orders.push(await placeOrder("ask"));
}, 500);

setInterval(async () => {
  const orderId = orders.shift();
  if (orderId) api.cancelOrder({ orderId });
}, 250);
