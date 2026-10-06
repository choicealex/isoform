/*
 * The figures the site shows, in the order it shows them. Each is a figure file written by the skill;
 * the site copies it, never edits it. `prompt` is what was asked of the agent that made it (shown on
 * /skill); the skill's own three examples were written by hand with the skill, so they have none.
 * `job` is the figure's role in a product (shown on cards and in the drawer). `group`: "object" for figures an agent
 * made from one prompt (and the skill's examples), "ui" for the 23 interface icons animated from the owner's stories
 * (dogfood/HARD.md), generated from family templates.
 */
export default [
  { file: "../skills/isoform-animate/examples/water-bottle.js", prompt: null, group: "object", job: "A fill, a quota, a balance" },
  { file: "../skills/isoform-animate/examples/bolt.js", prompt: null, group: "object", job: "A connection, live" },
  { file: "../skills/isoform-animate/examples/rocket.js", prompt: null, group: "object", job: "Launch, deploy, go live" },
  { file: "../dogfood/shopping-cart/shopping-cart.js", prompt: "/isoform-animate shopping-cart", group: "object", job: "Added to cart" },
  { file: "../dogfood/cart-push/cart-push.js", prompt: "/isoform-animate shopping-cart", group: "object", job: "A purchase on its way" },
  { file: "../dogfood/house/house.js", prompt: "/isoform-animate house sharp-top", group: "object", job: "Welcome home" },
  { file: "../dogfood/car/car.js", prompt: "/isoform-animate a car", group: "object", job: "Lights on, drive mode" },
  { file: "../dogfood/gas-station/local-gas-station.js", prompt: "/isoform-animate local-gas-station", group: "object", job: "A running total, a balance" },
  { file: "../dogfood/hard/radio-button-checked/radio-button-checked.js", prompt: "/isoform-animate radio-button-checked", group: "ui", job: "A choice confirmed" },
  { file: "../dogfood/pilot-radio/radio.js", prompt: "/isoform-animate radio-button-partial", group: "ui", job: "An option, set" },
  { file: "../dogfood/hard/indeterminate-checkbox/indeterminate-checkbox.js", prompt: "/isoform-animate indeterminate-checkbox", group: "ui", job: "Some, then all" },
  { file: "../dogfood/hard/dialog/dialog.js", prompt: "/isoform-animate dialog", group: "ui", job: "A dialog opening" },
  { file: "../dogfood/pilot-toast/toast.js", prompt: "/isoform-animate toast", group: "ui", job: "A notification arriving" },
  { file: "../dogfood/hard/tab/tab.js", prompt: "/isoform-animate tab", group: "ui", job: "A tab opening" },
  { file: "../dogfood/hard/chips/chips.js", prompt: "/isoform-animate chips", group: "ui", job: "A chip expanding" },
  { file: "../dogfood/hard/subheader/subheader.js", prompt: "/isoform-animate subheader", group: "ui", job: "A section opening" },
  { file: "../dogfood/hard/dropdown/dropdown.js", prompt: "/isoform-animate dropdown", group: "ui", job: "A menu dropping open" },
  { file: "../dogfood/hard/float-desktop/float-desktop.js", prompt: "/isoform-animate float-desktop", group: "ui", job: "A window floating up" },
  { file: "../dogfood/hard/float-landscape-2/float-landscape-2.js", prompt: "/isoform-animate float-landscape-2", group: "ui", job: "A window floating up" },
  { file: "../dogfood/hard/fullscreen-portrait/fullscreen-portrait.js", prompt: "/isoform-animate fullscreen-portrait", group: "ui", job: "Going full screen" },
  { file: "../dogfood/hard/position-bottom-left/position-bottom-left.js", prompt: "/isoform-animate position-bottom-left", group: "ui", job: "Snap a window" },
  { file: "../dogfood/hard/position-bottom-right/position-bottom-right.js", prompt: "/isoform-animate position-bottom-right", group: "ui", job: "Snap a window" },
  { file: "../dogfood/hard/position-top-right/position-top-right.js", prompt: "/isoform-animate position-top-right", group: "ui", job: "Snap a window" },
  { file: "../dogfood/hard/maximize/maximize.js", prompt: "/isoform-animate maximize", group: "ui", job: "Maximise" },
  { file: "../dogfood/hard/minimize/minimize.js", prompt: "/isoform-animate minimize", group: "ui", job: "Minimise" },
  { file: "../dogfood/hard/stat-0-double/stat-0-double.js", prompt: "/isoform-animate stat-0-double", group: "ui", job: "A level that comes round" },
  { file: "../dogfood/pilot-boomerang/boomerang.js", prompt: "/isoform-animate stat-1", group: "ui", job: "Level up, a retry" },
  { file: "../dogfood/hard/stat-minus-1/stat-minus-1.js", prompt: "/isoform-animate stat-minus-1", group: "ui", job: "A level that comes round" },
  { file: "../dogfood/hard/magnification-large/magnification-large.js", prompt: "/isoform-animate magnification-large", group: "ui", job: "Zoom out" },
  { file: "../dogfood/hard/magnification-small/magnification-small.js", prompt: "/isoform-animate magnification-small", group: "ui", job: "Zoom in" },
  { file: "../dogfood/hard/capture/capture.js", prompt: "/isoform-animate capture", group: "ui", job: "A screenshot taken" },
];
