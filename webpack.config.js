const path = require("path");

module.exports = {
  mode: "production",
  entry: "./source/extension.ts",
  output: {
    filename: "extension.js",
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, "dist")
  },
  resolve: {
    extensions: [".js", ".ts"]
  },
  devtool: "source-map",
  target: "node",
  externals: {
    vscode: "commonjs vscode"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/
      }
    ]
  }
};
