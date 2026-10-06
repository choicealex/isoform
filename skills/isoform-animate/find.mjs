#!/usr/bin/env node
/**
 * Finds Isocons icons by words in their id or title, or by everyday words for them (building → domain, truck →
 * local-shipping): `node find.mjs <words…>`.
 * Prints the best matches as `id · title · category`, most words matched first.
 * With --all it lists the whole set, grouped by category.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { REMOTE } from "./build.mjs";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const dir = [process.env.ISOFORM_ICONS, here("../../data")].filter(Boolean).find((d) => existsSync(join(d, "index.json")));
const index = dir
  ? JSON.parse(readFileSync(join(dir, "index.json"), "utf8"))
  : await fetch(`${REMOTE}/index.json`).then((r) => r.json());

const args = process.argv.slice(2);
if (!args.length) { console.error("usage: node find.mjs <words…> | --all"); process.exit(2); }
if (args[0] === "--all") {
  const by = Map.groupBy(index, (x) => x.categoryName);
  for (const [cat, list] of by) console.log(`\n${cat} (${list.length})\n${list.map((x) => x.id).join("  ")}`);
  process.exit(0);
}
const words = args.join(" ").toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
/* Isocons names icons the way Material Symbols does (domain, local-shipping, flight) and ships no tags, so everyday words
   found nothing; a stranger asking for "a building" got "no match". Hand-curated, every target checked against the set.
   Not in Isocons at all (say so rather than guess): phone, mail, calendar, camera, music, coffee, battery, book, tv */
const ALIAS = {
  aeroplane: ["flight", "flight-takeoff"],
  airplane: ["flight", "flight-takeoff", "flight-land"],
  bag: ["shopping-bag", "local-mall", "work"],
  basket: ["shopping-basket", "shopping-cart"],
  bicycle: ["pedal-bike"],
  bike: ["pedal-bike", "two-wheeler", "electric-bike", "motorcycle"],
  bin: ["delete"],
  boat: ["boat", "sailing"],
  bubble: ["comic-bubble"],
  building: ["domain", "corporate-fare", "store", "storefront", "home-work", "factory", "account-balance"],
  bulb: ["emoji-objects"],
  bus: ["bus", "departure-board"],
  car: ["directions-car", "local-taxi", "electric-car"],
  card: ["credit-card", "contactless", "id-card"],
  cash: ["payments", "attach-money", "atm"],
  chart: ["bar-chart", "pie-chart", "trending-up", "show-chart", "monitoring"],
  chat: ["comic-bubble"],
  clock: ["clock-loader-40"],
  cloud: ["partly-cloudy-day"],
  cog: ["settings"],
  computer: ["desktop-landscape", "terminal"],
  delivery: ["local-shipping", "package", "box"],
  doctor: ["stethoscope", "medical-services", "local-hospital"],
  document: ["file-open"],
  drink: ["water-bottle"],
  file: ["file-open"],
  fire: ["local-fire-department", "whatshot"],
  flame: ["local-fire-department", "whatshot"],
  folder: ["create-new-folder"],
  food: ["restaurant", "fastfood"],
  fuel: ["local-gas-station", "oil-barrel"],
  gas: ["local-gas-station"],
  gear: ["settings"],
  gift: ["redeem"],
  globe: ["public", "travel-explore"],
  graph: ["bar-chart", "trending-up", "show-chart"],
  heart: ["favorite"],
  home: ["house"],
  hospital: ["local-hospital", "emergency", "medical-services"],
  idea: ["emoji-objects"],
  lamp: ["emoji-objects"],
  laptop: ["desktop-landscape"],
  leaf: ["eco"],
  lightning: ["bolt"],
  like: ["favorite", "thumb-up"],
  location: ["location-on", "pin-drop", "my-location", "near-me"],
  magnifier: ["zoom-in"],
  map: ["map", "location-on", "explore", "navigation"],
  medicine: ["medication", "pill", "vaccines", "medical-services"],
  message: ["comic-bubble"],
  money: ["payments", "attach-money", "savings", "wallet", "paid", "currency-exchange"],
  monitor: ["desktop-landscape"],
  office: ["domain", "corporate-fare", "work", "business-center"],
  padlock: ["shield-lock", "key"],
  people: ["group", "groups", "person"],
  petrol: ["local-gas-station"],
  pin: ["location-on", "pin-drop", "home-pin"],
  plane: ["flight", "flight-takeoff", "flight-land"],
  plant: ["potted-plant", "eco", "park"],
  rain: ["rainy", "water-drop"],
  rating: ["star", "thumb-up"],
  rocket: ["rocket", "rocket-launch"],
  search: ["travel-explore", "manage-search"],
  security: ["shield-lock", "security"],
  ship: ["boat", "local-shipping"],
  shop: ["storefront", "store", "shopping-cart", "shopping-bag", "local-mall"],
  speech: ["comic-bubble"],
  star: ["star", "kid-star"],
  store: ["storefront", "store", "local-mall"],
  sun: ["sunny"],
  train: ["train", "directions-railway", "tram", "subway"],
  trash: ["delete", "restore-from-trash"],
  tree: ["park"],
  truck: ["local-shipping", "forklift"],
  user: ["person", "group"],
  van: ["local-shipping", "airport-shuttle"],
  water: ["water-drop", "water-bottle"],
  weather: ["partly-cloudy-day", "sunny", "rainy", "snowing", "thunderstorm"],
  wifi: ["wifi-password"],
  world: ["public"],
};
const aliased = [...new Set(words.flatMap((w) => ALIAS[w] ?? ALIAS[w.replace(/s$/, "")] ?? []))];
/* a whole word counts most, the start of a word less; "lock" inside "clock" or "car" inside "card" only when nothing else matches */
const score = (inside) => index.map((x) => {
  const toks = `${x.id} ${x.title}`.toLowerCase().split(/[^a-z0-9]+/);
  let s = 0;
  for (const w of words) s += toks.includes(w) ? 1 : toks.some((t) => t.startsWith(w) || (w.length > 3 && w.startsWith(t) && t.length > 3)) ? 0.6 : inside && toks.some((t) => t.includes(w)) ? 0.3 : 0;
  return { x, s };
}).filter((r) => r.s > 0).sort((a, b) => b.s - a.s || a.x.id.length - b.x.id.length);
let scored = score(false);
if (aliased.length) {
  const seen = new Set(aliased);
  scored = [...aliased.map((id) => ({ x: index.find((x) => x.id === id), s: 9 })), ...scored.filter((r) => !seen.has(r.x.id))];
}
if (!scored.length) {
  scored = score(true);
  if (scored.length) console.log(`no icon has the word "${words.join(" ")}"; these only contain it inside a word:`);
}
if (!scored.length) { console.log(`no match: Isocons may not have this object. Try what it is made of or does (padlock → lock, key), or --all`); process.exit(1); }
for (const { x } of scored.slice(0, 20)) console.log(`${x.id} · ${x.title} · ${x.categoryName}`);
