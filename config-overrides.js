const webpack = require("webpack");

module.exports = function override(config, env) {
  console.log("override");
  let loaders = config.resolve;
  loaders.fallback = {
    fs: false,
    tls: false,
    net: false,
    stream: require.resolve("stream-browserify"),
    assert: require.resolve("assert"),
    crypto: require.resolve("crypto-browserify"),
  };
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ]);
  return config;
};
