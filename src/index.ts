/*
 * index.ts
 *
 * Copyright 2019 Paulo Queiroz <pvaqueiroz@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import * as express from 'express';
import * as mongoose from 'mongoose';
import * as _ from '@raggesilver/hidash';

export interface RequiredIfQuery {
  '$exists'?: string;
  // '$and': Array<RequiredIfQuery>;
  // '$or': Array<RequiredIfQuery>;
};

export interface ValidateFunction {
  (val: any, req: express.Request): Boolean | String | Promise<Boolean|String>;
};

export interface Params {
  [key: string]: {
    'validate'?: ValidateFunction|Array<ValidateFunction>;
    'required'?: boolean;
    'requiredIf'?: RequiredIfQuery;
    'type'?: Function;
    'msg'?: string;
    'either'?: string|number|symbol;
    'nullable'?: boolean;
  };
};

export type OnErrorFunction = (_req: express.Request, res: express.Response, _next: express.NextFunction, message: string) => any;

export interface ParamOptions {
  'strict'?: boolean;
  'onerror'?: OnErrorFunction;
};

const defaultOnerror: OnErrorFunction = (_req, res, _next, message) => {
  return res.status(400).json({
    error: message,
  });
};

abstract class ReqParam {
  source: any;
  sourcePath: any;
  // Reference so other functions can use it
  params: Params = {};
  options: ParamOptions = <ParamOptions> {};

  abstract extractSource(req: express.Request): Object;

  exec(params: Params): express.Handler {
    return async (req: express.Request, res: express.Response,
      next: express.NextFunction) => {

      this.params = params;
      this.extractSource(req);

      let either: any = {};

      // Iterate through param keys
      for (const key in params) {

        if (params[key].either) {
          if (!(params[key].either! in either))
            either[params[key].either!] = new Array();
          // Action is to just push the key to the either group, it will later
          // on be validated (all at once)
          either[params[key].either!].push(key);
        }

        // Parameter `key` is not present
        if (!_.exists(this.source, key)) {
          // If there is an $exists condition
          if (params[key].requiredIf?.$exists) {
            // And the condition is true
            if (_.exists(this.source, params[key].requiredIf?.$exists!)) {
              return (
                (this.options.onerror || defaultOnerror)(req, res, next,
                  params[key].msg ||
                  `${key} is required if ${params[key].requiredIf?.$exists} is present`
                )
              );
            }
            // $exists query is present but condition was not met, so skip it
            continue;
          }
          if (params[key].required === false)
            continue ;
          // `either` is a new option a parameter can take. Each param can be
          // part of a group of `either`. They will be validated individually if
          // present and will only fail if (validation for one is false or if
          // none of the params in the group are present). Example:
          //
          // An user can log in either via email or username. So params
          // specifies:
          // { username: { either: 1 }, email: { either: 1 } }
          //
          // Note the `either` key for both has the same value, that is what
          // keeps them in the same group.
          else if (params[key].either) {
            continue ;
          }
          else {
            // Required param not present
            return (this.options.onerror || defaultOnerror)(req, res, next, params[key].msg || `Parameter ${key} missing`);
          }
        }

        // If type was specified
        const val: any = _.get(this.source, key);

        // We accept `null` values for:
        if (
          val === null
          && (
            // non-required params that don't have `nullable` set to `false`
            (params[key].required === false && params[key].nullable !== false)
            // or for params that have `nullable` set to true
            || (params[key].nullable === true)
          )
        ) {
          continue ;
        }

        if ('type' in params[key]) {
          if (typeof params[key].type !== 'function')
            throw new TypeError(
              'Key type must be of type Function (e.g. Number, Array, ...)'
            );

          if (
            Object.prototype.toString.call(val) !==
              Object.prototype.toString.call(params[key].type!())
          ) {
            // Value has wrong type
            return (this.options.onerror || defaultOnerror)(req, res, next, params[key].msg || `Invalid type for param '${key}'`);
          }
        }

        // Array of validate functions
        let fns: Function[] = [];
        if (params[key].validate instanceof Array) {
          fns = params[key].validate as Function[];
        }
        else if (params[key].validate instanceof Object) {
          fns = [ (params[key].validate as Function) ];
        }

        // Run all at once
        let valids: any = await Promise.all(fns.map(v => v(val, req)));
        // Check all the results, if any failed return
        for (const valid of valids) {
          if (valid !== true) {
            let msg = (typeof valid === 'string') ?
              valid : (params[key].msg || `Invalid parameter ${key}`);
            return (this.options.onerror || defaultOnerror)(req, res, next, msg);
          }
        }
      }

      // If all validation went well, check either groups
      for (const key in either) {
        // There must be at least one param of either in this.source, and if
        // there is we already know it's valid
        let present = false;
        either[key].forEach((paramName: string) => {
          if (_.exists(this.source, paramName))
            present = true;
        });
        // If no param is present
        if (!present) {
          return (this.options.onerror || defaultOnerror)(req, res, next, `At least one of ${either[key].join(', ')} must be present`);
        }
      }

      if (this.options.strict) {
        let obj = {};

        for (const key in params) {
          if (_.exists(this.source, key)) {
            _.set(obj, key, _.get(this.source, key));
          }
        }

        (req as any)[this.sourcePath] = obj;
      }

      next();
    };
  }
};

class ReqAll extends ReqParam {
  src: string;

  constructor(src: string, options?: ParamOptions) {
    super();

    this.sourcePath = src;
    this.src = src;
    this.options = options || <ParamOptions> {};
  }

  extractSource(req: express.Request): Object {
    if (!(this.src in req)) {
      throw new Error(`${this.source} key does not exist in express request`);
    }
    return this.source = (req as any)[this.src];
  }
}

export const reqparams = (params: Params, options?: ParamOptions) => {
  return new ReqAll('body', options).exec(params);
};

export const reqquery = (params: Params, options?: ParamOptions) => {
  return new ReqAll('query', options).exec(params);
};

export const reqall = (source: string, params: Params, options?: ParamOptions) => {
  return new ReqAll(source, options).exec(params);
};

export const notEmpty: ValidateFunction = (val) => {
  switch (typeof val) {
    case 'string':
      return (!/^\s*$/.test(val));
    case 'object':
      if (val instanceof Array)
        return (val.length != 0);
    default:
      return false;
  }
};

export const validId: ValidateFunction = (val) => {
  return (
    typeof val === 'string'
    && /^([a-f0-9]{12}|[a-f0-9]{24})$/.test(val)
  );
};

export const unique = async (val: any, key: string, model: mongoose.Model<any>):
  Promise<Boolean|String> => {
  try {
    let u = await model.findOne({ [key]: val });
    return (u) ? `${key} already in use` : true;
  }
  catch (_) {
    return false;
  }
}
