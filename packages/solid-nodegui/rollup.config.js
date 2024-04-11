import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import pkg from "./package.json" assert { type: "json" };

const extensions = [".js", ".jsx", ".ts", ".tsx"];

/** @type {import('rollup').RollupOptions} */
const config = {
  input: "./src/index.ts",

  // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
  // https://rollupjs.org/guide/en/#external
  external: ["@nodegui/nodegui", "solid-js", "solid-nodegui", "lodash-es"],

  plugins: [
    // Allows node_modules resolution
    resolve({ extensions }),

    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs(),

    // Compile TypeScript/JavaScript files
    babel({
      extensions,
      babelHelpers: "bundled",
      include: ["src/**/*"],
    }),
  ],

  output: [
    {
      file: pkg.main,
      format: "cjs",
    },
    {
      file: pkg.module,
      format: "es",
    },
  ],
};

export default config;
