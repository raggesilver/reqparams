import { Params } from './types';
import { Request, Handler } from 'express';

import _ from '@raggesilver/hidash';

export { default as ParamBuilder } from './param-builder/index';

export function reqparams (source: keyof Request, params: Params): Handler {
  return async (req, res, next) => {
    for (const key of Object.keys(params)) {
      const param = params[key];
      const val = _.get(req[source], key);
      const path = `${source.toString()}.${key}`;

      try {
        for (const fn of param.validate) {
          const result = await fn(val, req, param, path);
          if (result !== true) {
            // FIXME: this needs to handle errors properly as it currently may
            // respond with `{ error: false }`
            return res.status(400).json({ error: result });
          }
        }
      }
      catch (e) {
        return next(e);
      }
    }
    return next();
  };
}
