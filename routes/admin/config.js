let serverConfig = require('./../../lib/server-config')

module.exports.sideMenu = [
  {
    title: 'Dashboard',
    icon: 'speedometer',
    href: 'admin/dashboard',
  },
  {
    title: 'HL',
    icon: 'list', 
    subMenu: [
      {title: 'All', href: 'admin/hls'},
    ],
  },
  {
    title: 'Profile',
    icon: 'user', 
    subMenu: [
      {title: 'Logout', icon: 'logout', href: 'admin/logout'},
    ],
  },
];

module.exports.session = {
  cookieName: 'adminSession',
  secret: serverConfig.cookie_secret,
  duration: 24 * 60 * 60 * 1000,
  cookie: {
    path: '/admin',
    ephemeral: false,
    httpOnly: true,
  }
}
