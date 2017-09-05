import {BasicRoutes} from './../router'

class HomeRoutes extends BasicRoutes {

  constructor() {
    super('home');
  }

  home(req, res) {
    res.send('hello');
  }

  get() {
    this.router.get('/', this.home);
    return super.get();
  }
}

const routes = new HomeRoutes().get();
export = routes;
