import { Request } from 'express';

export type ValidateFunction = (
  val: any,
  req: Request,
  param: Param,
  path: string,
) => boolean | string | Promise<boolean | string>;

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
  required: (req: Request) => Promise<boolean>;
  /**
   * A type constructor to check against the payload value (ie. Array, String,
   * Number, Boolean...).
   */
  type?: Constructor;
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
