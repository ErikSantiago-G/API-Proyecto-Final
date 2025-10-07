const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const eslintPluginPrettier = require("eslint-plugin-prettier");

module.exports = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "coverage/**",
      ".turbo/**",
    ],

    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },

    plugins: {
      prettier: eslintPluginPrettier,
    },

    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/indent": "off",
      "quotes": "off",
      "semi": "off",
      "comma-dangle": "off",
      "indent": "off",
      "object-curly-spacing": "off",
      "arrow-spacing": "off",

      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-var": "error",
      "prefer-const": "error",
      "eqeqeq": ["error", "always"],
      "curly": "error",

      "prettier/prettier": [
        "warn",
        {
          singleQuote: false,
          trailingComma: "all",
          semi: true,
          printWidth: 100,
          tabWidth: 2,
        },
      ],
    },
  },
];
