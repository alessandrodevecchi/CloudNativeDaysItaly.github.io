import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // Il sito è un export statico con `images.unoptimized: true`: next/image
      // non ridimensiona, non converte e non serve varianti responsive, quindi
      // su loghi, cover e foto dimensionate dal CSS `<img>` è la scelta giusta
      // e la regola segnalava solo rumore. Spenta per far risaltare i warning
      // veri. Vedi next.config.mjs.
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
