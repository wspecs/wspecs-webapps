import {HL} from './../../models/hl';
import {appDetails} from './config'
import {indexes} from './indexes';
import {HymnalRoutes} from './../hymnal'

class HLRoutes extends HymnalRoutes {
  constructor() {
    super('hl', HL, indexes, appDetails);
  }
}

const routes = new HLRoutes().get();
export = routes;
