const express = require('express')
let router = express.Router()
let serverConfig = require('./../../lib/server-config')
const routerConfig = require('./../../lib/router-config')
const User = require('./../../models/user')
const session = require("client-sessions");
const adminConfig = require('./config');
const protectedRoutes = require('./protected-routes');

serverConfig.adminSideMenu = adminConfig.sideMenu; 

router.use(routerConfig.RESOLVE);
router.use(session(adminConfig.session));

const ROUTES = [
  {path: '/register', template: 'admin/register-admin'},
  {path: '/signup', template: 'admin/register-admin'},
  {path: '/login', template: 'admin/login-admin'},
];

router.post('/login', (req, res) => {
  let query = User.findOne({
    username: req.body.username,
  });
  query.exec((err, user) => {
    if (!user || !user.comparePassword(req.body.password)) {
      err = true;
    } else {
      req.adminSession.user = user;
    }
    res.resolve(err);
  });
});

router.post('/register', (req, res) => {
  User(req.body).save(err => {
    res.resolve(err);
  });
});

for (const route of ROUTES) {
  router.get(route.path, (req, res) => {
    res.render(route.template, serverConfig);
  });
}

function defaultPrepare(req, _, next) {
  req.templateArgs = {};
  next();
}

for (const route of protectedRoutes) {
  route.prepare = route.prepare || defaultPrepare;
  router.get(
      route.path,
      routerConfig.ADMIN_SESSION,
      routerConfig.ADMIN_LOGIN,
      route.prepare,
      (req, res) => {
    res.render(route.template, Object.assign(serverConfig, {
      page: req.templateArgs
    }));
  });
}

router.get('/logout', (req, res) => {
  req.adminSession.reset();
  res.redirect('/admin');
})

// Export routes
module.exports = {routes: router}
