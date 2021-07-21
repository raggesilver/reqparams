import { Params } from './types';
import { Request, Handler } from 'express';
import { ErrorType, ParamError } from './error';
import {
  LifecycleInstruction,
  LifecycleInstructionType,
} from './lifecycle-instruction';

import _ from '@raggesilver/hidash';

export { default as ParamBuilder } from './param-builder/index';

export function reqparams(source: keyof Request, params: Params): Handler {
  return async (req, res, next) => {
    // Iterate through all parameters
    paramLoop: for (const key of Object.keys(params)) {
      const param = params[key];
      const val = _.get(req[source], key);
      const path = `${source.toString()}.${key}`;

      try {
        // For each param, execute all validate functions
        for (const fn of param.validate) {
          const result = await fn(val, req, param, path);
          if (result instanceof LifecycleInstruction) {
            switch (result.type) {
              case LifecycleInstructionType.SKIP:
                continue paramLoop;
              default:
                throw new Error('Unhandled LifecycleInstruction');
            }
          }
          // If validation doesn't return true
          else if (result !== true) {
            throw new ParamError(
              param,
              path,
              ErrorType.VALIDATION_ERROR,
              typeof result === 'string' ? result : undefined,
            );
          }
        }
      } catch (e) {
        // Treat ParamErrors thrown during validation
        if (e instanceof ParamError) {
          // FIXME: this needs to use an user-modifiable default error handler
          return res.status(400).json({ error: e.message });
        }
        // All other errors are likely internal errors, so pass that on
        return next(e);
      }
    }
    return next();
  };
}

/**
 * @deprecated Use {@link reqparams} instead.
 */
export const reqall = reqparams;
