/*
 * The figures the site shows, in the order it shows them. Each is a figure file written by the skill;
 * the site copies it, never edits it. `prompt` is what was asked of the agent that made it (shown on
 * /skill); the skill's own three examples were written by hand with the skill, so they have none.
 * `job` is the figure's role in a product (shown on cards and in the drawer). The 23 interface icons animated from
 * the owner's stories (dogfood/HARD.md) stay off the site, the owner's call.
 */
export default [
  { file: "../skills/isoform-animate/examples/water-bottle.js", prompt: null, job: "A fill, a quota, a balance" },
  { file: "../skills/isoform-animate/examples/bolt.js", prompt: null, job: "A connection, live" },
  { file: "../skills/isoform-animate/examples/rocket.js", prompt: null, job: "Launch, deploy, go live" },
  { file: "../dogfood/shopping-cart/shopping-cart.js", prompt: "/isoform-animate shopping-cart", job: "Added to cart" },
  { file: "../dogfood/cart-push/cart-push.js", prompt: "/isoform-animate shopping-cart", job: "A purchase on its way" },
  { file: "../dogfood/house/house.js", prompt: "/isoform-animate house sharp-top", job: "Welcome home" },
  { file: "../dogfood/car/car.js", prompt: "/isoform-animate a car", job: "Lights on, drive mode" },
  { file: "../dogfood/gas-station/local-gas-station.js", prompt: "/isoform-animate local-gas-station", job: "A running total, a balance" },
  /* the hero's other two directions: built for the corner switch, not listed (listed: false) */
  { file: "../dogfood/rocket-views/rocket-top.js", prompt: "/isoform-animate rocket rounded-top", job: "Launch, seen from above", listed: false },
  { file: "../dogfood/rocket-views/rocket-right.js", prompt: "/isoform-animate rocket rounded-right", job: "Launch, deploy, go live", listed: false },
];
