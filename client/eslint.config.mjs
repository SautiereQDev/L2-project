// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  files: ["**/*.{js,mjs,cjs,jsx,ts,tsx,vue}"],
  ignores: ["dist/**", "node_modules/**", "coverage/**", "public/**"],
});
