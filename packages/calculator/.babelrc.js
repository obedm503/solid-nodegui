export default {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/typescript",
  ],
  plugins: [
    [
      "babel-plugin-jsx-dom-expressions",
      { moduleName: "solid-nodegui", generate: "universal" },
    ],
  ],
};
