module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  settings: {
    react: {
      version: "detect" // Automatically detect the react version
    }
  },
  rules: {
    quotes: ["error", "double"],
    "arrow-parens": ["error", "always"],
    "no-undef": "off" // Disable 'no-undef' for Node.js globals
  },
  globals: {
    module: "writable", // Explicitly define 'module' as a global
    require: "writable",
    exports: "writable",
    process: "writable",
    __dirname: "writable",
    __filename: "writable"
  },
};
