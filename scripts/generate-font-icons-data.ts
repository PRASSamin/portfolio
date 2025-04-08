import selection from "../public/icons/selection.json";
import fs from "fs";

const iconData = selection.icons.map((icon) => ({
  name: icon.properties.name,
  unicode: `\\u{${icon.properties.code.toString(16)}}`, // Proper Unicode escape
  code: icon.properties.code,
}));

fs.writeFileSync(
  "src/constants/FontIcons.ts",
  `export type FontIconsData = {
  name: string;
  unicode: string;
  code: number;
}
export const FontIcons: FontIconsData[] = ${JSON.stringify(iconData, null, 2)};`
);

console.log("Tech stacks generated successfully:", iconData);
