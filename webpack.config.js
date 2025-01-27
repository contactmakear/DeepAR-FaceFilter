// const path = require("path");

// module.exports = {
//   entry: "./src/index.js",
//   output: {
//     filename: "main.js",
//     path: path.resolve(__dirname, "public"),
//     clean: true,
//   },
//   target: "web",
//   module: {
//     rules: [
//       {
//         test: /\.(wasm)|(bin)|(obj)$/i,
//         include: [
//           path.resolve(__dirname, 'node_modules/deepar/'),
//         ],
//         type: 'asset/resource',
//       },
//       {
//         include: [
//           path.resolve(__dirname, 'effects/'),
//         ],
//         type: 'asset/resource',
//       },
//     ],
//   },
//   resolve: {
//     alias: {
//       '@effects': path.resolve(__dirname, 'effects/'),
//     },
//   },
//   performance: {
//     maxEntrypointSize: 1000000,
//     maxAssetSize: 10000000,
//   },
//   // devServer: {
//   //   static: [
//   //     {
//   //       directory: path.join(__dirname, "public"),
//   //     },
//   //     {
//   //       directory: path.join(__dirname, "node_modules/deepar"),
//   //       publicPath: "/deepar-resources",
//   //     },
//   //   ],
//   //   compress: true,
//   //   port: 9000,
//   // },
// };

//     // "build": "rm -rf dist && webpack --config webpack.config.js --mode production && cp -r public/* dist && cp -r node_modules/deepar public/deepar-resources",
//     // "dev": "webpack serve --mode development --open --port 8889"

const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "public"),
    clean: false, // Cleans the output folder before building
  },
  target: "web",
  module: {
    rules: [
      {
        test: /\.(wasm|bin|obj)$/i,
        include: [path.resolve(__dirname, "node_modules/deepar/")],
        type: "asset/resource", // Copies these assets into the output directory
      },
      {
        include: [path.resolve(__dirname, "effects/")],
        type: "asset/resource", // Handles assets in the "effects" directory
      },
    ],
  },
  experiments: {
    asyncWebAssembly: true, // Enable async WebAssembly support
  },
  resolve: {
    alias: {
      "@effects": path.resolve(__dirname, "effects/"), // Allows using '@effects' as a shortcut to the "effects" folder
    },
  },
  performance: {
    maxEntrypointSize: 1000000, // Sets size limits for entry points
    maxAssetSize: 10000000, // Sets size limits for assets
  },
  devServer: {
    static: [
      {
        directory: path.join(__dirname, "public"),
      },
      {
        directory: path.join(__dirname, "node_modules/deepar"),
        publicPath: "/deepar-resources", // Serves deepar resources under this path
      },
    ],
    compress: true, // Enables gzip compression for better performance
    port: 8889, // Sets the port for the development server
    open: true, // Automatically opens the app in the browser
  },
};
