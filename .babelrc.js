module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        loose: true,
        modules: false,
        exclude: ["transform-typeof-symbol"]
      }
    ]
  ],
  plugins: ["@babel/plugin-proposal-class-properties"]
}
