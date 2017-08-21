module.exports = function(app) {
  app.use('/admin', require('./admin'))
  app.use('/hl', require('./hl'))
  app.use('/sdah', require('./sdah')),
  app.use('/threeangels', require('./threeangels'))
}
