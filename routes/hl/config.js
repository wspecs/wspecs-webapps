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
  title: 'Hymnes & Louanges',
  image: 'hl/img/display.jpg',
  description: 'Recueil de cantiques a l\'usage des églises adventistes en langue française. Cette application fournit la capacité de trouver rapidement une chanson en utilisant la table des matières ou les fonctions de recherche. Un mode de présentation permet également aux utilisateurs de visualiser les chansons sous forme de diaporama.',
}
