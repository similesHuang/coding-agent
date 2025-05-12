import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["cli.ts"],
  format: ["cjs"],
  clean: true,
  splitting: false, // 关闭代码分割以避免动态导入问题
  treeshake: true, // 启用 tree shaking
  target: "es2022",
  minify: false, // 关闭压缩以便调试
  platform: "node",
  // 将 ESM-only 的包内联到输出文件中
  noExternal: ["to-vfile", "vfile-matter"],
  esbuildOptions(options) {
    options.charset = "utf8"; // 添加这行来保留中文字符
    options.mainFields = ["module", "main"]; // 支持 ESM 模块优先
    options.define = {
      "process.env.VERSION": `"${require("./package.json").version}"`,
      "process.env.IS_BUILD": "true",
    };
  },
});
