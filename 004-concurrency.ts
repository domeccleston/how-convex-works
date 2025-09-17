import { Log } from "./003-index";
const log = new Log();

function simulateRaceCondition(logs, itemId, fns, delays) {
  fns.forEach((fn, i) => {
    setTimeout(() => {
      const currentState = log.getCurrentState()[itemId];
      fn(currentState);
    }, delays.delay[i]);
  });
}

// Let's set up a warehouse with only one item in stock: a single box of chocolates
const stockId = log.append({
  table: "items",
  name: "Box of chocolates",
  quantity: 1,
});

// Let's imagine two people try to order this at roughly the same time.
simulateRaceCondition(
  log,
  stockId,
  [
    (state) => log.append({ id: stockId, quantity: state.quantity - 1 }),
    (state) => log.append({ id: stockId, quantity: state.quantity - 1 }),
  ],
  { delay: [10, 15] },
);

setTimeout(() => {
  console.log("Final quantity:", log.getCurrentState()[stockId].quantity); // logs -1!
}, 100);
