import {Application} from 'express';
import {error} from './../lib/log';
import * as home from './home';
import * as threeangels from './threeangels';
import * as sdah from './sdah';
import * as kjv from './kjv';
import * as hl from './hl';

export function routes(app: Application) {
  app.use('/hl', hl);
  app.use('/kjv', kjv);
  app.use('/sdah', sdah);
  app.use('/threeangels', threeangels);
  app.use('/', home);
}
