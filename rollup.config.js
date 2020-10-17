import { terser } from "rollup-plugin-terser"

export default {
  input: "src/index.js",
  output: [
    { file: "dist/rabbit-components.js", format: "cjs", esModule: false, sourcemap: true },
    { file: "dist/rabbit-components-cjs.js", format: "cjs", esModule: false, sourcemap: true },
    { file: "dist/rabbit-components-umd.js", format: "umd", esModule: false, name: "rabbit-components", sourcemap: true },
    { file: "dist/rabbit-components-esm.js", format: "esm", esModule: false, sourcemap: true },
  ],
  plugins: [
    terser({
      include: ["rabbit-components.js"]
    })
  ]
}
