/*
 * The figures the site shows, in the order it shows them. Each is a figure file written by the skill;
 * the site copies it, never edits it. `prompt` is what was asked of the agent that made it (shown on
 * /skill); the skill's own three examples were written by hand with the skill, so they have none.
 * `job` is the figure's role in a product (shown on cards and in the drawer).
 */
export default [
  { file: "../skills/isoform-animate/examples/water-bottle.js", prompt: null, job: "A fill, a quota, a balance" },
  { file: "../skills/isoform-animate/examples/bolt.js", prompt: null, job: "A connection, live" },
  { file: "../skills/isoform-animate/examples/rocket.js", prompt: null, job: "Launch, deploy, go live" },
  { file: "../dogfood/shopping-cart/shopping-cart.js", prompt: "/isoform-animate shopping-cart", job: "Added to cart" },
  { file: "../dogfood/padlock/padlock.js", prompt: "/isoform-animate a padlock or key: unlocking", job: "Access granted" },
  { file: "../dogfood/car/car.js", prompt: "/isoform-animate a car", job: "Lights on, drive mode" },
  { file: "../dogfood/gas-station/local-gas-station.js", prompt: "/isoform-animate local-gas-station", job: "A running total, a balance" },
];
