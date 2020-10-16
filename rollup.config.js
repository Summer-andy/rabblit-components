import { terser } from "rollup-plugin-terser"

export default {
  input: "src/index.js",
  output: [
    { file: "dist/rabbit-component.js", format: "cjs", esModule: false, sourcemap: true },
    { file: "dist/rabbit-component-cjs.js", format: "cjs", esModule: false, sourcemap: true },
    { file: "dist/rabbit-component-umd.js", format: "umd", esModule: false, name: "rabbit-component", sourcemap: true },
    { file: "dist/rabbit-component-esm.js", format: "esm", esModule: false, sourcemap: true },
  ],
  plugins: [
    terser({
      include: ["rabbit-component.js"]
    })
  ]
}
