import { Request } from 'express';
import { LifecycleInstruction } from './lifecycle-instruction';

export type ValidateFunction = (
  val: any,
  req: Request,
  param: Param,
  path: string,
  source: keyof Request,
) =>
  | boolean
  | string
  | LifecycleInstruction
  | Promise<boolean | string | LifecycleInstruction>;

export interface Constructor extends Function {
  new (...args: any[]): any;
}

export interface Param {
  /**
   * A function (or array of) that receive the value present in the payload
   * and returns whether or not that value is valid. It may also return a
   * string which implies the value is invalid and the string will be used
   * as the error message.
   */
  validate: ValidateFunction[];
  /**
   * Whether or not the parameter is required (default `true`). Starting from
   * v4.0.0 `required: false` no longer implies `nullable: true`.
   */
  required: (req: Request) => boolean | Promise<boolean>;
  /**
   * A type constructor to check against the payload value (ie. Array, String,
   * Number, Boolean...).
   */
  type: Constructor;
  // FIXME: add docs
  either?: string | number;
  /**
   * Whether or not `null` is accepted.
   * @default false
   */
  nullable: boolean;
  /**
   * Only allow values contained in this array. This will be executed BEFORE
   * the validate functions.
   */
  enum?: Array<string | number | boolean | Date>;
  /**
   * A compare function to be used in the `enum` element comparison.
   */
  enumCmp?: (a: any, b: any) => boolean;
  // FIXME: add docs
  name?: string;
}

export interface Params {
  [key: string]: Param;
}

export enum ErrorType {
  /**
   * The param doesn't have the expected data type.
   *
   * **THIS IS A PROGRAMMER ERROR** on the caller side.
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
  BOOLEAN = 'boolean',
  EITHER = 'either',
  INTEGER = 'integer',
  MAX = 'max',
  MIN = 'min',
  GREATER_THAN_EQUAL = 'geq',
  GREATER_THAN = 'gt',
  LESS_THAN_EQUAL = 'leq',
  LESS_THAN = 'lt',
  NOT_EMPTY = 'notEmpty',
  NOT_IN_ENUM = 'notInEnum',
  UNIQUE = 'unique',
  // REQUIRED_IF_EXISTS = 'requiredIfExists',
  VALID_ID = 'validId',
}
