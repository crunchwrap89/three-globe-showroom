// eslint-disable-next-line no-undef
module.exports = (ctx) => ({
  parser: ctx.parser ? "sugarss" : false,
  map: ctx.env === "development" ? ctx.map : false,
  plugins: {
    "postcss-nested": {},
    "postcss-nested-import": {},
    autoprefixer: {},
  },
});
