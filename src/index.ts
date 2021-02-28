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
import { Model } from 'mongoose';

import * as _ from '@raggesilver/hidash';

export interface RequiredIfQuery {
  '$exists'?: string;
  // '$and': Array<RequiredIfQuery>;
  // '$or': Array<RequiredIfQuery>;
}

export interface ValidateFunction {
  (val: any, req: Request): boolean | string | Promise<boolean|string>;
}

interface Constructor extends Function {
  new (...args: any[]): any;
}

export interface Param {
  /**
   * A function (or array of) that receive the value present in the payload
   * and returns whether or not that value is valid. It may also return a
   * string which implies the value is invalid and the string will be used
   * as the error message.
   */
  'validate'?: ValidateFunction | ValidateFunction[];
  /**
   * Whether or not the parameter is required (default `true`). Starting from
   * v4.0.0 `required: false` no longer implies `nullable: true`.
   */
  'required'?: boolean;
  'requiredIf'?: RequiredIfQuery;
  /**
   * A type constructor to check against the payload value (ie. Array, String,
   * Number, Boolean...).
   */
  'type'?: Constructor;
  'msg'?: string;
  'either'?: string | number;
  /**
   * Whether or not `null` is accepted.
   */
  'nullable'?: boolean;
  /**
   * Only allow values contained in this array. This will be executed BEFORE
   * the validate function.
   */
  'enum'?: Array<string|number|boolean|Date>;
  /**
   * A compare function to be used in the `enum` element comparison.
   */
  'enumCmp'?: (a: any, b: any) => boolean;
}

export interface Params {
  [key: string]: Param;
}

interface IEither {
  [key: string]: string[];
  [key: number]: string[];
}

export type OnErrorFunction =
  (req: Request, res: Response, next: NextFunction, message: string) => any;

export interface ParamOptions {
  'strict'?: boolean;
  'onerror'?: OnErrorFunction;
}

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

type HandlerFunction =
  (...args: any[]) => HandlerReturnType | Promise<HandlerReturnType>;

abstract class ReqParam {
  source: any;
  sourcePath: any;
  params: Params = {};
  options: ParamOptions = {};
  error?: string;

  abstract extractSource (req: Request): any;

  /**
   * Check if the current key is part of an either group. If it is we make sure
   * the array in the local `either` object is initialized, then we push the
   * key to that either group's array.
   *
   * @param key the current key we're validating
   * @param either the local either object
   */
  initEither (key: string, either: IEither) {
    const eitherKey = this.params[key].either;

    if (typeof eitherKey !== 'undefined') {
      either[eitherKey] = either[eitherKey] ?? ([] as string[]);
      // Action is to just push the key to the either group, it will later
      // on be validated (all at once)
      either[eitherKey].push(key);
    }
    return HandlerReturnType.NONE;
  }

  existenceCheck (key: string) {
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

  typeCheck (key: string) {
    // If type was specified
    const val = _.get(this.source, key);

    // We accept `null` values for `nullable` keys:
    if (val === null && this.params[key].nullable === true) {
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

    // If we get a date string in ISO format for a Date type, accept it
    if (this.params[key].type === Date && !(val instanceof Date)) {
      const d = new Date(val);

      if (!isNaN(Number(d)) && d.toISOString() === val) {
        _.set(this.source, key, d);
        return HandlerReturnType.NONE;
      }
    }

    if (toString.call(val) !== toString.call(new this.params[key].type!())) {
      // Value has wrong type
      this.error = this.params[key].msg || `Invalid type for param '${key}'`;
      return HandlerReturnType.ERROR;
    }

    return HandlerReturnType.NONE;
  }

  validateEnum (key: string) {
    if (!this.params[key].enum) {
      return HandlerReturnType.NONE;
    }

    const _enum = this.params[key].enum!;
    const cmpFn = this.params[key].enumCmp ?? ((a, b) => a === b);
    const val = _.get(this.source, key);

    for (const v of _enum) {
      if (cmpFn(v, val)) {
        return HandlerReturnType.NONE;
      }
    }
    this.error = `Invalid value for ${key}`;
    return HandlerReturnType.ERROR;
  }

  async validate (key: string, req: Request) {
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
    const validateResults = await Promise.all(fns.map(v => v(val, req)));
    // Check all the results, if any failed return
    for (const result of validateResults) {
      if (result === true) {
        continue;
      }

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

  exec (params: Params): Handler {
    this.params = params;
    return async (req, res, next) => {
      this.extractSource(req);

      const steps: HandlerFunction[] = [
        this.initEither,
        this.existenceCheck,
        this.typeCheck,
        this.validateEnum,
        this.validate,
      ];

      const either: IEither = {};

      // Iterate through param keys
      for (const key in this.params) {
        const stepsArgs = [
          [key, either],
          [key],
          [key],
          [key],
          [key, req],
        ];

        // TODO: is this variable necessary?
        let _continue = false;

        for (let i = 0; i < steps.length; i++) {
          const r = await steps[i].apply(this, stepsArgs[i]);

          if (r === HandlerReturnType.CONTINUE) {
            _continue = true; break;
          }
          if (r === HandlerReturnType.ERROR) {
            return (this.options.onerror || defaultOnerror)(
              req, res, next, this.error!
            );
          }
        }

        if (_continue) {
          continue;
        }
      }

      // If all validation went well, check either groups
      for (const key in either) {
        // There must be at least one param of either in this.source, and if
        // there is we already know it's valid
        const present = either[key].some(
          (paramPath: string) => _.exists(this.source, paramPath)
        );
        // If no param is present
        if (!present) {
          return (this.options.onerror || defaultOnerror)(
            req, res, next,
            `At least one of ${either[key].join(', ')} must be present`
          );
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
}

class ReqAll extends ReqParam {
  src: string;

  constructor (src: string, options?: ParamOptions) {
    super();

    this.sourcePath = src;
    this.src = src;
    this.options = options || <ParamOptions> {};
  }

  extractSource (req: Request) {
    /* istanbul ignore next */
    if (!(this.src in req)) {
      throw new Error(`${this.source} key does not exist in express request`);
    }
    return this.source = (req as any)[this.src];
  }
}

export const reqall = (
  source: keyof Request, params: Params, options?: ParamOptions
) => {
  return new ReqAll(source, options).exec(params);
};

// Validate functions ==========================================================

/**
 * Check that an array has at least one element or that a string isn't empty/all
 * white space or that an object has at least one key.
 *
 * @param val
 */
export const notEmpty: ValidateFunction = (
  val: string|any[]|Record<string, any>
) => {
  switch (typeof val) {
    case 'string':
      return (!/^\s*$/.test(val));
    case 'object':
      if (val instanceof Array) {
        return (val.length !== 0);
      }
      else if (val) {
        return Object.keys(val).length > 0;
      }
  }
  return false;
};

/**
 * Check that a string is a valid Mongoose/MongoDB id, that is, it's a lowercase
 * hex string with either 12 or 24 characters.
 *
 * @param val
 */
export const validId: ValidateFunction = (val: string) => {
  return (
    typeof val === 'string'
    && /^([a-f0-9]{12}|[a-f0-9]{24})$/.test(val)
  );
};

/**
 * Check that a value isn't in use in your databse for a specific Mongoose key
 * and Model. Note that this function is a helper function, not a validate
 * function.
 *
 * @param val
 * @param key the Mongoose key to check for uniqueness
 * @param model hte Mongoose model
 *
 * @example
 *
 * const register = reqall('body', {
 *   email: { type: String, validate: unique(User, 'email') },
 * });
 */
/* istanbul ignore next */
export const unique = (model: Model<any>, key: string) =>
  <ValidateFunction> async function (val: any) {
    try {
      const doc = await model.findOne({ [key]: val });
      return doc ? `${key} already in use` : true;
    }
    catch {
      return false;
    }
  };

// Joi equivalent for reqparams ================================================

export class ParamBuilder implements Param {
  either?: Param['either'];
  enum?: Param['enum'];
  enumCmp?: Param['enumCmp'];
  nullable: Param['nullable'];
  required = true;
  type: Param['type'];
  validate: ValidateFunction[] = [];

  private _isObjectId = false;
  // private _isInteger = false;

  private constructor (type: Param['type']) {
    this.type = type;
  }

  static Array () {
    return new ParamBuilder(Array);
  }

  static Boolean () {
    return new ParamBuilder(Boolean);
  }

  static Date () {
    return new ParamBuilder(Date);
  }

  static Object () {
    return new ParamBuilder(Object);
  }

  static String () {
    return new ParamBuilder(String);
  }

  static Number ({ integer = false } = {}) {
    const inst = new ParamBuilder(Number);
    // inst._isInteger = integer;
    if (integer) {
      inst.validate.push(v => Number.isInteger(v));
    }

    return inst;
  }

  static ObjectId () {
    const inst = new ParamBuilder(String);
    inst.validate.push(validId);
    inst._isObjectId = true;

    return inst;
  }

  /**
   * For Numbers and Dates, this sets the minimum valid value. For Arrays and
   * Strings this sets the minimum required length.
   *
   * All comparisons are inclusive.
   */
  min (n: number) {
    if (this.type === String || this.type === Array) {
      this.validate.push((v: string|any[]) => v.length >= n);
    }
    else if (this.type === Number || this.type === Date) {
      this.validate.push((v: number|Date) => v >= n);
    }
    else {
      throw new Error(
        '.min() can only be used with strings, arrays, numbers and dates'
      );
    }
    return this;
  }

  /**
   * For Numbers and Dates, this sets the maximum valid value. For Arrays and
   * Strings this sets the maximum allowed length.
   *
   * All comparisons are inclusive.
   */
  max (n: number) {
    if (this.type === String || this.type === Array) {
      this.validate.push((v: string|any[]) => v.length <= n);
    }
    else if (this.type === Number || this.type === Date) {
      this.validate.push((v: number|Date) => v <= n);
    }
    else {
      throw new Error(
        '.max() can only be used with strings, arrays, numbers and dates'
      );
    }
    return this;
  }

  /**
   * Ensure an object has at least one key or an array has at least one element
   * or that a string has at least one non white space character.
   */
  notEmpty () {
    if (this.type !== String && this.type !== Array && this.type !== Object) {
      throw new Error(
        '.notEmpty() can only be used with strings, objects, and arrays'
      );
    }
    this.validate.push(notEmpty);
    return this;
  }

  /**
   * Check whether or not the given value doesn't already exist in a databse for
   * a specific model.
   *
   * @param key the mongoose key to check for uniqueness
   * @param model the mongoose model to perform the check
   */
  unique (key: string, model: Model<any>) {
    if (!this._isObjectId) {
      throw new Error('.unique() can only be used with ObjectIds');
    }
    this.validate.push(unique(model, key));
    return this;
  }

  /**
   * Set whether or not the current param is required (true by default).
   */
  setRequired (r: boolean) {
    this.required = r;
    return this;
  }

  /**
   * Set the current parameter as not required (params are required by default).
   */
  notRequired () {
    return this.setRequired(false);
  }

  /**
   * Whether or not to accept `null` as a valid value (false by default).
   */
  setNullable (n: boolean) {
    this.nullable = n;
    return this;
  }

  /**
   * Set a list of all allowed values. Anything not on this list will be
   * rejected.
   */
  setEnum (values: Param['enum']) {
    this.enum = values;
    return this;
  }

  /**
   * Set a custom compare function for you enum. Particularly useful for
   * comparing objects and custom data.
   */
  setEnumCmp (enumCmp: Param['enumCmp']) {
    this.enumCmp = enumCmp;
    return this;
  }

  /**
   * Give this parameter a group in which only one param is required. Usefull
   * for login routes where the user is only required to input either a phone
   * or a username.
   */
  setEither (either: Param['either']) {
    this.either = either;
    return this;
  }

  /**
   * Append validation functions to the current parameter. Note that functions
   * added by ParamBuilder will still be present.
   *
   * @param validate A validation function (or array of validation functions)
   */
  setValidate (validate: ValidateFunction | ValidateFunction[]) {
    if (!(validate instanceof Array)) {
      validate = [ validate ];
    }

    this.validate.push(...validate);
    return this;
  }
}
