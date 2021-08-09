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

import _defaults from './defaults';

import _ from '@raggesilver/hidash';

export const defaults = _defaults;

export interface RequiredIfQuery {
  '$exists'?: string;
  '$fn'?: (req: Request) => boolean | Promise<boolean>;
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
  /**
   * @deprecated `msg` is deprecated since v4.0.0 and will be removed on v5.0.0.
   * Use the new error API instead.
  */
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
  'name'?: string;
  'elements'?: Params;
}

export interface Params {
  [key: string]: Param;
}

export interface IEither {
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

export enum ErrorType {
  /**
   * The param doesn't have the expected data type.
   *
   * **THIS IS A PROGRAMMER ERROR**
   */
  INVALID_PARAM_TYPE,
  /**
   * A required param was not sent in the payload.
   */
  MISSING_REQUIRED_PARAM,
  /**
   * One of the validation functions failed, which means the parameter was sent
   * but it is invalid.
   */
  VALIDATION_ERROR,
}

export enum ESpecificError {
  EITHER = 'either',
  INTEGER = 'integer',
  MAX = 'max',
  MIN = 'min',
  NOT_EMPTY = 'notEmpty',
  NOT_IN_ENUM = 'notInEnum',
  UNIQUE = 'unique',
  REQUIRED_IF_EXISTS = 'requiredIfExists',
  VALID_ID = 'validId',
}

type SpecificError = ESpecificError|string;

// FIXME: add comments for this class
export class ValidationError extends Error {
  specificError?: SpecificError;
  extraData?: Record<string, any>;

  constructor (specificError?: SpecificError, extraData?: Record<string, any>) {
    super();

    this.specificError = specificError;
    this.extraData = extraData;
  }
}

/**
 * During the param validation lifecycle any step may throw a ParamError
 * indicating that because of a specific parameter the current payload is
 * invalid.
 *
 * FIXME: update the next section of this comment to account for ValidationError
 *
 * Users may use this to integrate well with reqparams when they create custom
 * validate functions.
 */
export class ParamError extends ValidationError {
  name = 'ParamError';
  type: ErrorType;
  paramPath: string;
  param: Param;
  params: Params;

  /**
   * @param type The error type.
   * @param paramPath The parameter path (e.g.: 'user.name.first').
   * @param msg (optional) An error message. If this is set, this message will
   * be sent to the user, otherwise the default errorMessageComposer function
   * will be used to create a message based on the error type.
   * @param specificError Validate functions may want to communicate what
   * specific error occurred as opposed to just setting the error type. Setting
   * this parameter may alter the output of errorMessageComposer. The naming
   * convention used for specific errors is to use the validate function name.
   * That is, if this error was thrown in the `notEmpty` validate function, the
   * `specificError` will be `notEmpty`.
   * @param extraData Extra data on the specific error.
   */
  constructor (
    type: ErrorType, paramPath: string, params: Params,
    msg?: string,
    specificError?: SpecificError,
    extraData?: Record<string, any>,
  ) {
    super(specificError, extraData);

    this.message = msg || '';
    this.type = type;
    this.param = params[paramPath];
    this.params = params;
    this.paramPath = paramPath;
  }

  toString (): string {
    return (this.message !== '')
      ? this.message
      : defaults.transformers.paramError.toString(this);
  }
}

// const defaultOnerror: OnErrorFunction = (_req, res, _next, message) => {
//   return res.status(400).json({
//     error: message,
//   });
// };

type HandlerFunction =
  (...args: any[]) => HandlerReturnType | Promise<HandlerReturnType>;

abstract class ReqParam {
  request?: Request;
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

  async requiredIfCheck (key: string) {
    const param = this.params[key];

    /* istanbul ignore next */
    if (Object.keys(param.requiredIf!).length > 1) {
      throw new Error('Only one key is supported for requiredIf');
    }
    /* istanbul ignore next */
    if (Object.keys(param.requiredIf!).length < 1) {
      throw new Error('At least one key is required for requiredIf');
    }

    // Check for requiredIf -- this handles both a valid requireIf and an
    // invalid one, so the next `if` statement doesn't have to be an `else if`
    if (param.requiredIf?.$exists) {
      // RequiredIf's required path does not exist, so skip
      if (!_.exists(this.source, param.requiredIf!.$exists!)) {
        return HandlerReturnType.CONTINUE;
      }
      throw new ParamError(
        ErrorType.MISSING_REQUIRED_PARAM, key, this.params, undefined,
        ESpecificError.REQUIRED_IF_EXISTS,
      );
    }
    else /* if (param.requiredIf?.$fn) */ {
      if (await param.requiredIf!.$fn!(this.request!)) {
        throw new ParamError(
          ErrorType.MISSING_REQUIRED_PARAM, key, this.params, undefined
        );
      }
      return HandlerReturnType.CONTINUE;
    }
  }

  async existenceCheck (key: string) {
    // Parameter `key` is present so do nothing
    if (_.exists(this.source, key)) {
      return HandlerReturnType.NONE;
    }

    // Cehck for requiredIf -- this handles both a valid requireIf and an
    // invalid one, so the next `if` statement doesn't have to be an `else if`
    if (this.params[key].requiredIf) {
      return await this.requiredIfCheck(key);
    }
    if (this.params[key].required === false) {
      return HandlerReturnType.CONTINUE;
    }
    else if (this.params[key].either) {
      return HandlerReturnType.CONTINUE;
    }
    else {
      // Required param not present
      // this.error = this.params[key].msg || `Parameter ${key} missing`;
      // return HandlerReturnType.ERROR;
      throw new ParamError(
        ErrorType.MISSING_REQUIRED_PARAM, key, this.params,
      );
    }
  }

  async typeCheck (key: string) {
    // If type was specified
    const param = this.params[key];
    const val = _.get(this.source, key);

    // We accept `null` values for `nullable` keys:
    if (val === null && param.nullable === true) {
      return HandlerReturnType.CONTINUE;
    }

    // No type check, do nothing
    if (!('type' in this.params[key])) {
      return HandlerReturnType.NONE;
    }

    /* istanbul ignore next */
    if (typeof param.type !== 'function') {
      throw new TypeError(
        'Key type must be of type Function (e.g. Number, Array, ...)'
      );
    }

    // If we get a date string in ISO format for a Date type, accept it
    if (param.type === Date && !(val instanceof Date)) {
      const d = new Date(val);

      if (!isNaN(Number(d)) && d.toISOString() === val) {
        _.set(this.source, key, d);
        return HandlerReturnType.NONE;
      }
    }

    if (toString.call(val) !== toString.call(new param.type!())) {
      // Value has wrong type
      // this.error = param.msg || `Invalid type for param '${key}'`;
      // return HandlerReturnType.ERROR;
      throw new ParamError(
        ErrorType.INVALID_PARAM_TYPE, key, this.params
      );
    }

    if (param.type === Array && param.elements) {
      const ra = new ReqAll('body', this.options);
      ra.params = param.elements;
      ra.request = this.request;

      for (const el of (val as any[])) {
        ra.source = el;
        // This will throw an error if there is anything wrong
        await ra.execCycle();
      }
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
    // this.error = `Invalid value for ${key}`;
    // return HandlerReturnType.ERROR;
    throw new ParamError(
      ErrorType.VALIDATION_ERROR, key, this.params, undefined,
      ESpecificError.NOT_IN_ENUM,
    );
  }

  async validate (key: string, req: Request) {
    // Array of validate functions
    let fns: ValidateFunction[] = [];
    if (this.params[key].validate instanceof Array) {
      fns = this.params[key].validate as ValidateFunction[];
    }
    // This may be deprecated in v5 as ParamBuilder always sets validate as an
    // array.
    /* istanbul ignore next */
    else if (this.params[key].validate instanceof Object) {
      fns = [ (this.params[key].validate as ValidateFunction) ];
    }

    const val = _.get(this.source, key);

    // Fixes #10
    for (const fn of fns) {
      let result;

      try {
        result = await fn(val, req);
      }
      catch (e) {
        if (!(e instanceof ValidationError)) {
          throw e;
        }
        result = e;
      }

      if (result === true) {
        continue;
      }

      throw new ParamError(
        ErrorType.VALIDATION_ERROR, key, this.params,
        // If the validate function returned a string use it as error message
        (typeof result === 'string') ? result : undefined,
        (result instanceof ValidationError) ? result.specificError : undefined,
        (result instanceof ValidationError) ? result.extraData : undefined,
      );
    }

    return HandlerReturnType.NONE;
  }

  async execCycle () {
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
        [key, this.request],
      ];

      // TODO: is this variable necessary?
      let _continue = false;

      for (let i = 0; i < steps.length; i++) {
        const r = await steps[i].apply(this, stepsArgs[i]);

        if (r === HandlerReturnType.CONTINUE) {
          _continue = true; break;
        }
      }

      if (_continue) {
        continue;
      }
    }

    // If all validation went well, check either groups
    for (const eitherGroup in either) {
      // There must be at least one param of either in this.source, and if
      // there is we already know it's valid
      const present = either[eitherGroup].some(
        (paramPath) => _.exists(this.source, paramPath)
      );
      // If no param is present
      if (!present) {
        throw new ParamError(
          ErrorType.MISSING_REQUIRED_PARAM, either[eitherGroup][0],
          this.params, undefined, ESpecificError.EITHER, { either, eitherGroup }
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

      (this.request as any)[this.sourcePath] = obj;
    }
  }

  exec (params: Params): Handler {
    this.params = params;
    return async (req, res, next) => {
      this.request = req;
      this.extractSource(req);

      try {
        await this.execCycle();
      }
      catch (e) {
        if (e instanceof ParamError) {
          return (this.options.onerror || defaults.onError)(
            req, res, next, e.toString()
          );
        }
        return next(e);
      }

      return next();
    };
  }
}

class ReqAll extends ReqParam {
  src: keyof Request;

  constructor (src: keyof Request, options?: ParamOptions) {
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
      if (!/^\s*$/.test(val)) {
        return true;
      }
      break;
    case 'object':
      if (val instanceof Array) {
        if (val.length > 0) {
          return true;
        }
        break;
      }
      else if (val) {
        if (Object.keys(val).length > 0) {
          return true;
        }
        break;
      }
  }
  throw new ValidationError(ESpecificError.NOT_EMPTY);
};

/**
 * Check that a string is a valid Mongoose/MongoDB id, that is, it's a lowercase
 * hex string with either 12 or 24 characters.
 *
 * @param val
 */
export const validId: ValidateFunction = (val: string) => {
  if (typeof val === 'string' && /^([a-f0-9]{12}|[a-f0-9]{24})$/.test(val)) {
    return true;
  }
  throw new ValidationError(ESpecificError.VALID_ID, { id: val });
};

/**
 * Check that a value isn't in use in your databse for a specific Mongoose key
 * and Model. Note that this function is a helper function, not a validate
 * function.
 *
 * @param val
 * @param key the Mongoose key to check for uniqueness
 * @param model the Mongoose model
 *
 * @example
 *
 * const register = reqall('body', {
 *   email: { type: String, validate: unique(User, 'email') },
 * });
 */
/* istanbul ignore next */
export const unique = (model: Model<any>, key: string): ValidateFunction =>
  async function (val: any) {
    const doc = await model.findOne({ [key]: val });
    if (!doc) {
      return true;
    }
    throw new ValidationError(ESpecificError.UNIQUE);
  };

// Joi equivalent for reqparams ================================================

export class ParamBuilder implements Param {
  either?: Param['either'];
  elements?: Param['elements'];
  enum?: Param['enum'];
  enumCmp?: Param['enumCmp'];
  nullable: Param['nullable'];
  required = true;
  requiredIf?: Param['requiredIf'];
  type: Param['type'];
  validate: ValidateFunction[] = [];
  name?: string;

  private _isObjectId = false;
  private _isInteger = false;

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
    if (integer) {
      inst._isInteger = true;
      inst.validate.push(v => {
        if (Number.isInteger(v)) {
          return true;
        }
        throw new ValidationError(ESpecificError.INTEGER);
      });
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
  min (n: number, errorMessage?: string) {
    if (this.type === String || this.type === Array) {
      this.validate.push(
        (v: string|any[]) => {
          if (v.length >= n) {
            return true;
          }
          if (errorMessage) {
            return errorMessage;
          }
          throw new ValidationError(ESpecificError.MIN, { min: n });
        }
      );
    }
    else if (this.type === Number || this.type === Date) {
      this.validate.push(
        (v: number|Date) => {
          if (v >= n) {
            return true;
          }
          if (errorMessage) {
            return errorMessage;
          }
          throw new ValidationError(ESpecificError.MIN, { min: n });
        }
      );
    }
    else {
      /* istanbul ignore next */
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
  max (n: number, errorMessage?: string) {
    if (this.type === String || this.type === Array) {
      this.validate.push(
        (v: string|any[]) => {
          if (v.length <= n) {
            return true;
          }
          if (errorMessage) {
            return errorMessage;
          }
          throw new ValidationError(ESpecificError.MAX, { max: n });
        }
      );
    }
    else if (this.type === Number || this.type === Date) {
      this.validate.push(
        (v: number|Date) => {
          if (v <= n) {
            return true;
          }
          if (errorMessage) {
            return errorMessage;
          }
          throw new ValidationError(ESpecificError.MAX, { max: n });
        }
      );
    }
    else {
      /* istanbul ignore next */
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
      /* istanbul ignore next */
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
   * @param key the path to the schema field to check for uniqueness
   * @param model the mongoose model to perform the check
   */
  unique (key: string, model: Model<any>) {
    this.validate.push(unique(model, key));
    return this;
  }

  match (reg: RegExp, errorMessage?: string) {
    if (this.type !== String) {
      /* istanbul ignore next */
      throw new Error('.match() can only be used with strings');
    }
    this.validate.push((v: string) => {
      if (reg.test(v)) {
        return true;
      }
      if (errorMessage) {
        return errorMessage;
      }
      throw new ValidationError(); // This will fallback to plain invalid param
    });
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

  setRequiredIfExists (path: string) {
    this.requiredIf = { $exists: path };
    return this;
  }

  setRequiredIf (fn: (req: Request) => boolean | Promise<boolean>) {
    this.requiredIf = { $fn: fn };
    return this;
  }

  setElements (elements: Params) {
    this.elements = elements;
    return this;
  }

  /**
   * Set the parameter's name. This name will be used when generating error
   * messages.
   *
   * By default, the parameter `user.name.first`'s name would be
   * `user.name.first`. Setting it's name to `first name` would make error
   * messages a lot more user friendly.
   */
  setName (name: string) {
    this.name = name;
    return this;
  }

  /**
   * Whether or not to accept `null` as a valid value (false by default).
   */
  setNullable (n = true) {
    this.nullable = n;
    return this;
  }

  /**
   * Set a list of all allowed values. Anything not on this list will be
   * rejected.
   */
  setEnum (values: Param['enum']) {
    if (values?.length === 0) {
      /* istanbul ignore next */
      throw new Error('Enum may not be empty');
    }
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

  /**
   * Create and return a copy of the current Param.
   */
  clone () {
    const inst = new ParamBuilder(this.type);
    const fields = [
      'either', 'elements', 'enum', 'enumCmp', 'nullable', 'required',
      'requiredIf', 'validate', 'name', '_isObjectId', '_isInteger',
    ];

    for (const f of fields) {
      if (_.exists(this, f)) {
        const val = _.get(this, f);
        _.set(inst, f, val instanceof Array ? [...val] : val);
      }
    }

    return inst;
  }
}
