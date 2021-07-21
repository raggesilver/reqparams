import { Param } from './types';

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
  REQUIRED_IF_EXISTS = 'requiredIfExists',
  VALID_ID = 'validId',
}

type SpecificError = ESpecificError | string;

/**
 * During the param validation, any validate function may throw a ParamError
 * indicating that because of a specific parameter the current payload is
 * invalid.
 */
export class ParamError extends Error {
  name = 'ParamError';
  type: ErrorType;
  paramPath: string;
  param: Param;
  specificError?: SpecificError;
  extraData?: Record<string, any>;

  /**
   * TODO: update the param descriptions.
   *
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
  constructor(
    param: Param,
    paramPath: string,
    type: ErrorType,
    errorMessage?: string,
    specificError?: SpecificError,
    extraData?: Record<string, any>,
  ) {
    super();

    this.message = errorMessage || '';
    this.type = type;
    this.param = param;
    this.paramPath = paramPath;
    this.specificError = specificError;
    this.extraData = extraData;
  }

  toString(): string {
    // FIXME: implement defaults
    // () ? ... : defaults.transformers.paramError.toString(this);
    return this.message !== '' ? this.message : this.type.toString();
  }
}
