import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
      "@next/next/no-img-element": "warn",
      "react/no-unescaped-entities": "warn",
      // Safer hooks usage
      "react-hooks/exhaustive-deps": "warn",
      // Keep console clean in production but allow error/warn during dev
      "no-console": ["warn", { allow: ["warn", "error"] }]
    }
  }
];

export default eslintConfig;
