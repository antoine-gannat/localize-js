const path = require("path");

module.exports = {
  target: "web",
  entry: {
    index: "./src/index.ts",
  },
  output: {
    path: path.resolve(__dirname, "./lib"),
    filename: "index.js",
    library: {
      type: "commonjs",
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};
