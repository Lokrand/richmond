import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "**/.idea/",
        "**/dist",
        "**/fallback",
        "**/screenshots",
        "**/node_modules",
        "**/leprosarium",
        "**/npm-debug.log",
        "**/.DS_Store",
        "**/*.log",
        "**/*.log.gz",
        "**/ci-utils",
        "**/*.js",
        "**/*.d.ts",
    ],
}, ...compat.extends("airbnb").map(config => ({
    ...config,
    files: ["**/*.ts", "**/*.tsx"],
})), {
    files: ["**/*.ts", "**/*.tsx"],

    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            __GITDATE__: true,
            __GIT__: true,
            __DEV__: true,
            __SERVER__: true,
            NodeJS: true,
        },

        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "module",

        parserOptions: {
            ecmaversion: 2018,

            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    settings: {
        "import/resolver": {
            node: {
                extensions: [".js", ".jsx", ".ts", ".tsx", ".migr.ts", ".migr.tsx"],
            },
        },
    },

    rules: {
        "no-unused-vars": "off",

        "@typescript-eslint/no-unused-vars": ["error", {
            vars: "all",
            args: "after-used",
            ignoreRestSiblings: true,
        }],

        indent: ["error", 4, {
            SwitchCase: 1,
        }],

        "react/jsx-indent": [2, 4],
        "react/jsx-indent-props": [2, 4],

        "react/jsx-filename-extension": [1, {
            extensions: [".js", ".jsx", ".tsx"],
        }],

        "import/no-extraneous-dependencies": "off",

        "no-console": ["error", {
            allow: ["warn", "error", "info"],
        }],

        "no-underscore-dangle": "off",

        "import/extensions": ["error", "ignorePackages", {
            js: "never",
            jsx: "never",
            ts: "never",
            tsx: "never",
            ".migr.ts": "never",
            ".migr.tsx": "never",
        }],

        "default-param-last": "off",
        "func-names": "off",
        "prefer-destructuring": "off",
        "react/destructuring-assignment": "off",
        "implicit-arrow-linebreak": "error",
        "prefer-object-spread": "off",
        "camelcase": "off",
        "dot-notation": "off",
        "react/no-array-index-key": "off",

        "react/function-component-definition": [2, {
            namedComponents: ["arrow-function", "function-expression"],
            unnamedComponents: "arrow-function",
        }],

        "max-len": ["error", {
            code: 150,
            tabWidth: 4,
        }],

        "react/jsx-props-no-spreading": "off",
        "no-continue": "off",
        "no-promise-executor-return": "off",
        "react/require-default-props": "off",
        "no-shadow": "off",
        "react/static-property-placement": ["error", "static public field"],
        "no-redeclare": "off",
        'no-undef': 'off',
    },
}, {
    files: ["**/*.test.js", "**/*.test.jsx", "**/*.test.ts", "**/*.test.tsx"],

    languageOptions: {
        globals: {
            ...globals.jest,
        },
    },
}];