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

import { Request, Response, NextFunction, Handler } from 'express';
import * as mongoose from 'mongoose';
import * as _ from '@raggesilver/hidash';

export interface RequiredIfQuery {
  '$exists'?: string;
  // '$and': Array<RequiredIfQuery>;
  // '$or': Array<RequiredIfQuery>;
};

export interface ValidateFunction {
  (val: any, req: Request): boolean|string|Promise<boolean|string>;
};

export interface Params {
  [key: string]: {
    'validate'?: ValidateFunction | Array<ValidateFunction>;
    'required'?: boolean;
    'requiredIf'?: RequiredIfQuery;
    'type'?: Function /*| Params | [Function]*/;
    'msg'?: string;
    'either'?: string|number;
    'nullable'?: boolean;
  };
};

interface IEither {
  [key: string]: Array<string>;
  [key: number]: Array<string>;
};

export type OnErrorFunction = (req: Request, res: Response, next: NextFunction, message: string) => any;

export interface ParamOptions {
  'strict'?: boolean;
  'onerror'?: OnErrorFunction;
};

enum HandlerReturnType {
  NONE,
  CONTINUE,
  RETURN,
  ERROR,
}

const defaultOnerror: OnErrorFunction = (_req, res, _next, message) => {
  return res.status(400).json({
    error: message,
  });
};

type HandlerFunction = (...args: any[]) => HandlerReturnType|Promise<HandlerReturnType>;

abstract class ReqParam {
  source: any;
  sourcePath: any;
  // Reference so other functions can use it
  params: Params = {};
  options: ParamOptions = <ParamOptions> {};

  error?: string;

  abstract extractSource(req: Request): Object;

  /**
   * Check if the current key is part of an either group. If it is we make sure
   * the array in the local `either` object is initialized, then we push the
   * key to that either group's array.
   *
   * @param either the local either object
   * @param key the current key we're validating
   */

  initEither(key: string, either: IEither): HandlerReturnType {
    if (this.params[key].either) {
      if (!(this.params[key].either! in either))
        either[this.params[key].either!] = new Array<string>();
      // Action is to just push the key to the either group, it will later
      // on be validated (all at once)
      either[this.params[key].either!].push(key);
    }
    return HandlerReturnType.NONE;
  }

  existenceCheck(key: string): HandlerReturnType {
    // Parameter `key` is present so do nothing
    if (_.exists(this.source, key)) {
      return HandlerReturnType.NONE;
    }

    // Cehck for requiredIf -- this handles both a valid requireIf and an
    // invalid one, so the next `if` statement doesn't have to be an `else if`
    if (this.params[key].requiredIf?.$exists) {
      // RequiredIf's required path does not exist, so skip
      if (!_.exists(this.source, this.params[key].requiredIf!.$exists!)) {
        return HandlerReturnType.CONTINUE;
      }
      this.error = this.params[key].msg ||
        `${key} is required if ${this.params[key].requiredIf!.$exists} is present`;
      return HandlerReturnType.ERROR;
      // $exists query is present but condition was not met, so skip it
    }
    if (this.params[key].required === false) {
      return HandlerReturnType.CONTINUE;
    }
    else if (this.params[key].either) {
      return HandlerReturnType.CONTINUE;
    }
    else {
      // Required param not present
      this.error = this.params[key].msg || `Parameter ${key} missing`;
      return HandlerReturnType.ERROR;
    }
  }

  typeCheck(key: string): HandlerReturnType {
    // If type was specified
    const val = _.get(this.source, key);

    // We accept `null` values for:
    if (
      val === null
      && (
        // non-required params that don't have `nullable` set to `false`
        (this.params[key].required === false && this.params[key].nullable !== false)
        // or for params that have `nullable` set to true
        || (this.params[key].nullable === true)
      )
    ) {
      return HandlerReturnType.CONTINUE;
    }

    // No type check, do nothing
    if (!('type' in this.params[key])) {
      return HandlerReturnType.NONE;
    }

    /* istanbul ignore next */
    if (typeof this.params[key].type !== 'function') {
      throw new TypeError(
        'Key type must be of type Function (e.g. Number, Array, ...)'
      );
    }

    if (
      Object.prototype.toString.call(val) !== Object.prototype.toString.call(this.params[key].type!())
    ) {
      // Value has wrong type
      this.error = this.params[key].msg || `Invalid type for param '${key}'`;
      return HandlerReturnType.ERROR;
    }

    return HandlerReturnType.NONE;
  }

  async validate(key: string, req: Request): Promise<HandlerReturnType> {
    // Array of validate functions
    let fns: ValidateFunction[] = [];
    if (this.params[key].validate instanceof Array) {
      fns = this.params[key].validate as ValidateFunction[];
    }
    else if (this.params[key].validate instanceof Object) {
      fns = [ (this.params[key].validate as ValidateFunction) ];
    }

    const val = _.get(this.source, key);

    // Run all at once
    let validateResults: any = await Promise.all(fns.map(v => v(val, req)));
    // Check all the results, if any failed return
    for (const result of validateResults) {
      if (result === true) continue;

      this.error = (
        (typeof result === 'string')
          ? result
          : (
            this.params[key].msg
            || `Invalid parameter ${key}`
          )
      );
      return HandlerReturnType.ERROR;
    }

    return HandlerReturnType.NONE;
  }

  exec(params: Params): Handler {
    this.params = params;
    return async (req, res, next) => {
      this.extractSource(req);

      const steps: HandlerFunction[] = [
        this.initEither,
        this.existenceCheck,
        this.typeCheck,
        this.validate,
      ];

      const either: IEither = {};

      // Iterate through param keys
      for (const key in this.params) {
        const stepsArgs = [
          [key, either],
          [key],
          [key],
          [key, req],
        ];

        let _continue = false;

        for (let i = 0; i < steps.length; i++) {
          const r = await steps[i].apply(this, stepsArgs[i]);

          if (r === HandlerReturnType.CONTINUE) {
            _continue = true; break;
          }
          if (r === HandlerReturnType.ERROR) {
            return (this.options.onerror || defaultOnerror)(req, res, next, this.error!);
          }
        }

        if (_continue) continue;
      }

      // If all validation went well, check either groups
      for (const key in either) {
        // There must be at least one param of either in this.source, and if
        // there is we already know it's valid
        const present = either[key].some((paramPath: string) => _.exists(this.source, paramPath));
        // If no param is present
        if (!present) {
          return (this.options.onerror || defaultOnerror)(req, res, next, `At least one of ${either[key].join(', ')} must be present`);
        }
      }

      if (this.options.strict) {
        const obj = {};

        for (const key in this.params) {
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

  extractSource(req: Request): Object {
    /* istanbul ignore next */
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
      if (val instanceof Array) {
        return (val.length !== 0);
      }
  }
  return false;
};

export const validId: ValidateFunction = (val) => {
  return (
    typeof val === 'string'
    && /^([a-f0-9]{12}|[a-f0-9]{24})$/.test(val)
  );
};

/* istanbul ignore next */
export const unique = async (val: any, key: string, model: mongoose.Model<any>): Promise<Boolean|String> => {
  try {
    let u = await model.findOne({ [key]: val });
    return (u) ? `${key} already in use` : true;
  }
  catch {
    return false;
  }
}
