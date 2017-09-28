import {Router} from 'express';
import {error} from './../lib/log';
import * as home from './home';
import * as threeangels from './threeangels';
import * as sdah from './sdah';
import * as kjv from './kjv';
import * as hl from './hl';

export const routes = Router();
routes.use('/hl', hl.routes);
routes.use('/kjv', kjv.routes);
routes.use('/sdah', sdah.routes);
routes.use('/threeangels', threeangels.routes);
routes.use('/', home.routes);
