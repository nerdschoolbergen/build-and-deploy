import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ["dist/", "coverage/"],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      }
    }
  },
  pluginJs.configs.recommended,
];
