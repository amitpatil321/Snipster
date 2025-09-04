import js from "@eslint/js";
import { globalIgnores } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import node from "eslint-plugin-node";
import prettierPlugin from "eslint-plugin-prettier";
import promise from "eslint-plugin-promise";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import sonarjs from "eslint-plugin-sonarjs";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

// export default tseslint.config([
//   globalIgnores(["dist"]),
//   {
//     files: ["**/*.{ts,tsx}"],
//     extends: [
//       js.configs.recommended,
//       tseslint.configs.recommended,
//       reactHooks.configs["recommended-latest"],
//       reactRefresh.configs.vite,
//       "plugin:prettier/recommended",
//     ],
//     plugins: {
//       prettier: prettierPlugin.default,
//     },
//     rules: {
//       "prettier/prettier": "error", // show prettier issues as errors
//     },
//     languageOptions: {
//       ecmaVersion: 2020,
//       globals: globals.browser,
//     },
//   },
// ]);

export default tseslint.config([
  globalIgnores(["dist"]),
  js.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs["recommended-latest"],
  reactRefresh.configs.vite,
  {
    plugins: {
      prettier: prettierPlugin,
      import: importPlugin,
      "unused-imports": unusedImports,
      "jsx-a11y": jsxA11y,
      sonarjs: sonarjs,
      promise: promise,
      node: node,
    },
    rules: {
      "prettier/prettier": "off",
      "no-console": ["error", { allow: ["error"] }],
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "unused-imports/no-unused-imports": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-is-valid": "warn",
      "sonarjs/no-duplicate-string": "warn",
      "promise/always-return": "off",
      "promise/no-return-wrap": "warn",
      "node/no-unsupported-features/es-syntax": "off",
      "react-refresh/only-export-components": "off",
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    ignores: ["node_modules/", "build/", "*.min.js"],
  },
]);
