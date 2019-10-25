const path = require("path");

module.exports = {
  name: "main",
  // mode: "development || "production",
  entry: "./src/index.js",
  externals: ["d3"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  }
};
