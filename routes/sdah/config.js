let serverConfig = require('./../../lib/server-config')

/*
 * Configuration to manage session.
 */
module.exports.session = {
  cookieName: 'hlSession',
  secret: serverConfig.cookie_secret,
  duration: 24 * 60 * 60 * 1000,
  cookie: {
    path: '/hl',
    ephemeral: false,
    httpOnly: true,
  }
}

/**
 * Details about the application. This will override the generic configurations
 * in the root path.
 */
module.exports.details = {
  title: 'Seventh-Day Adventist Hymnal',
  image: 'sdah/img/display.jpg',
  description: 'The Seventh-day Adventist Hymnal is the hymbook most widely used by English-speaking Adventist congregations. This application provides the ability to quickly find a song using table of contents or search functions. A presentation mode also allows users to view the songs as a slideshow.'
};
