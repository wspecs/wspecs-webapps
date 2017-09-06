import {BasicRoutes} from './../router'

class HomeRoutes extends BasicRoutes {

  constructor() {
    super('home');
  }

  home(req, res) {
    res.serve(this.basePath + '/home', {});
  }

  get() {
    this.router.get('/', this.home.bind(this));
    return super.get();
  }
}

const routes = new HomeRoutes().get();
export = routes;
