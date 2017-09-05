import {SDAH} from './../../models/sdah';
import {appDetails} from './config'
import {indexes} from './indexes';
import {HymnalRoutes} from './../hymnal'

class SDAHRoutes extends HymnalRoutes {
  constructor() {
    super('sdah', SDAH, indexes, appDetails);
  }
}

const routes = new SDAHRoutes().get();
export = routes;
