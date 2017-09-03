module.exports = (app) => {
  const modules = [
    'admin',
    'hl',
    'kjv',
    'sdah',
    'threeangels',
  ];
  for (const module of modules) {
    app.use('/' + module, require('./' + module));
  }
}
