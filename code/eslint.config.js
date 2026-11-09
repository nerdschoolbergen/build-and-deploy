import globals from "globals";
import pluginJs from "@eslint/js";
import pluginJest from 'eslint-plugin-jest';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ["dist/", "coverage/"],
  },
  {
    plugins: { jest: pluginJest },
    languageOptions: { 
      globals: {
        ...pluginJest.environments.globals.globals,
        ...globals.browser,
      }
    }
  },
  pluginJs.configs.recommended,
];
