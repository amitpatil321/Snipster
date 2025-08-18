import tseslint from "typescript-eslint";

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["node_modules", "dist", "build"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];
