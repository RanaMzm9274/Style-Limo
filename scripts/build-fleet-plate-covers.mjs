import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

// SVG covers use source-image coordinates, so they scale and crop with the photo.
// Keep the original photographs intact; public fleet images use these composites.
const covers = [
  ["cullinan-white-exterior.png", 1672, 941, "1268,617 1384,602 1384,641 1268,656"],
  ["ghost-exterior.png", 1672, 941, "451,662 600,674 600,711 451,700"],
  ["ghost-wedding.png", 1672, 941, "385,648 539,655 539,694 385,686"],
  ["hummer-h2.png", 1672, 941, "454,696 554,705 554,762 454,755"],
  ["ferrrari-360.png", 1672, 941, "508,703 755,718 755,776 508,760"],
  ["ferrari-limo-f340.jpeg", 1600, 1200, "214,763 406,785 408,842 216,814"],
  ["landrover.jpeg", 1600, 885, "176,557 297,578 294,623 174,598"],
  ["phantom.jpeg", 2048, 1152, "88,725 177,747 177,824 89,788"],
  ["phantom-limo.png", 1672, 941, "1524,697 1606,678 1607,724 1526,745"],
  ["cullinnan1.png", 1672, 941, "1147,594 1371,589 1371,644 1147,650"],
  ["Culinnan2.png", 1672, 941, "277,389 467,385 459,445 268,445"],
  ["Ghost1.png", 1672, 941, "1104,639 1323,632 1323,686 1104,693"],
  ["Ghost2.png", 1672, 941, "249,456 424,459 414,510 240,505"],
  ["phantom1.png", 1672, 941, "1163,602 1363,600 1363,650 1163,655"],
];

const directory = fileURLToPath(new URL("../public/images/fleet/", import.meta.url));
mkdirSync(`${directory}plate-hidden`, { recursive: true });
for (const [name, width, height, points] of covers) {
  const mime = name.endsWith(".png") ? "image/png" : "image/jpeg";
  const photo = readFileSync(`${directory}${name}`).toString("base64");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><image width="${width}" height="${height}" href="data:${mime};base64,${photo}"/><polygon points="${points}" fill="#181818"/></svg>`;
  writeFileSync(`${directory}plate-hidden/${name.replace(/\.[^.]+$/, ".svg")}`, svg);
}
console.log(`Built ${covers.length} fleet plate covers.`);
