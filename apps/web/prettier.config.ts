/**
 * @type {import("prettier").Config}
 */
export default {
  printWidth: 70,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  bracketSpacing: true,
  arrowParens: "always",
  requirePragma: false,
  insertPragma: false,
  proseWrap: "never",
  plugins: [
    "prettier-plugin-organize-imports",
    "prettier-plugin-astro",
    "prettier-plugin-tailwindcss",
    "prettier-plugin-astro-organize-imports",
  ],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};
