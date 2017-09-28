import {HL} from './../../models/hl';
import {appDetails} from './config'
import {indexes} from './indexes';
import {HymnalRoutes} from './../hymnal'

class HLRoutes extends HymnalRoutes {
  constructor() {
    const basePath = 'hl';
    super(basePath, HL, indexes, appDetails);
  }
}

export const routes = new HLRoutes().get();
