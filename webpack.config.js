const EventPlugin = require("webpack-event-plugin");
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./source/extension.ts",
  output: {
    filename: "extension.js",
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
  devtool: "source-map",
  target: "node",
  externals: {
    vscode: "commonjs vscode",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new EventPlugin([
      {
        hook: "emit",
        callback: compilation => {
          // NOTE: Generates a schema file from the templates config option
          const package = require("./package.json");
          const templatesOption =
            package.contributes.configuration.properties[
              "module-templates.templates"
            ];
          const schema = JSON.stringify(templatesOption, null, 2);
          const asset = { source: () => schema, size: () => schema.length };
          compilation.assets["templates.schema.json"] = asset;
        },
      },
    ]),
  ],
};
