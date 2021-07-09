module.exports = {
    // ESLint's parser (for TS)
    parser: "@typescript-eslint/parser",
    overrides: [
        {
            files: ["**/*.ts"],
            rules: {
                "no-undef": "off"
            }
        }
    ],
    env: {
        browser: true,
        es6: true
    },
    extends: ["prettier", "plugin:@typescript-eslint/recommended", "plugin:react/recommended"],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly"
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 2018,
        sourceType: "module"
    },
    plugins: ["react", "@typescript-eslint", "react-hooks"],
    rules: {
        "no-console": "off",
        "react/prop-types": "off",
        "react/react-in-jsx-scope": "off",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "@typescript-eslint/indent": "off",
        "@typescript-eslint/no-object-literal-type-assertion": "off",
        "@typescript-eslint/explicit-member-accessibility": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off"
    },
    settings: {
        react: {
            version: "latest"
        }
    }
};
