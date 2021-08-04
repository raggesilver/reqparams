import { NextFunction, Request, Response } from 'express';
import { ErrorType, ESpecificError, Param } from '../types';
import { maybePlural } from '../utils';

export type ErrorMessageFunction = (name: string, error: ParamError) => string;

// Error =======================================================================

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
    return this.message || defaults.transformers.paramError.toString(this);
  }
}

// Defaults ====================================================================

function onError(
  _req: Request,
  res: Response,
  _next: NextFunction,
  msg: string,
) {
  return res.status(400).json({
    error: msg,
  });
}

function paramPathToName(path: string): string {
  return path;
}

function paramErrorToString(error: ParamError): string {
  const name =
    error.param.name || defaults.transformers.param.pathToName(error.paramPath);

  if (error.specificError && error.specificError in defaults.errorMessages) {
    return defaults.errorMessages[error.specificError as ESpecificError](
      name,
      error,
    );
  }

  switch (error.type) {
    case ErrorType.INVALID_PARAM_TYPE:
      // This is a programmer error as the API sent and invalid data type
      return `Invalid type for ${name}.`;
    case ErrorType.MISSING_REQUIRED_PARAM:
      return `${name} is required.`;
    case ErrorType.VALIDATION_ERROR:
      /* istanbul ignore next */
      return `Invalid ${name}.`;
  }
}

const integerErrorMessage: ErrorMessageFunction = name =>
  `${name} must be an integer.`;

const notEmptyErrorMessage: ErrorMessageFunction = name =>
  `${name} must not be empty.`;

const minMaxErrorMessage: ErrorMessageFunction = (name, error) => {
  // Get the minimum or maximum value according to the specific error
  const boundryValue: number = error.extraData![error.specificError!];
  const boundryText = error.specificError === 'min' ? 'at least' : 'at most';

  if (error.param.type === Array) {
    // Example: Tasks must have at least 1 item
    // Example: Tasks must have at most 200 items
    const items = maybePlural('item', boundryValue);
    return `${name} must have ${boundryText} ${boundryValue} ${items}.`;
  } else if (error.param.type === String) {
    // Example: Text must be at least 10 characters long
    // Example: Text must be at most 180 characters long
    const characters = maybePlural('character', boundryValue);
    return `${name} must be ${boundryText} ${boundryValue} ${characters} long.`;
  } else if (error.param.type === Number) {
    // Example: Age must be at least 18
    // Example: Age must be at most 25
    return `${name} must be ${boundryText} ${boundryValue}.`;
  }
  /* istanbul ignore next */
  throw new Error(`Unexpected Param type '${error.param.type}'`);
};

const uniqueErrorMessage: ErrorMessageFunction = name =>
  `${name} is already in use.`;

const notInEnumErrorMessage: ErrorMessageFunction = (name, error) => {
  const options = error.param.enum!.map(el => el.toString());
  let optionsText: string;

  if (options.length > 1) {
    optionsText = options.length > 2 ? 'one of ' : '';
    optionsText += options.slice(0, options.length - 1).join(', ');
    optionsText += ` or ${options[options.length - 1]}`;
  } else {
    optionsText = options[0];
  }

  // `optionsText` could be:
  // Day of the week must be Monday
  // Day of the week must be Monday or Tuesday
  // Day of the week must be one of Monday, Tuesday or Wednesday

  return `${name} must be ${optionsText}.`;
};

const validIdErrorMessage: ErrorMessageFunction = (_name, error) =>
  `${error.extraData!.id} is not a valid id`;

const lessThanErrorMessage = (orEqual: boolean): ErrorMessageFunction => {
  return (name, error) => {
    const extra = orEqual ? ' or equal' : '';
    return `${name} must be less than${extra} ${
      error.extraData!.value as number
    }`;
  };
};

const greaterThanErrorMessage = (orEqual: boolean): ErrorMessageFunction => {
  return (name, error) => {
    const extra = orEqual ? ' or equal' : '';
    return `${name} must be greater than${extra} ${
      error.extraData!.value as number
    }`;
  };
};

const booleanErrorMessage: ErrorMessageFunction = (name, error) => {
  return `${name} must be ${error.extraData!.shouldBe}.`;
};

// Defaults ====================================================================

const errorMessages: {
  [k in ESpecificError]: ErrorMessageFunction;
} = {
  [ESpecificError.BOOLEAN]: booleanErrorMessage,
  [ESpecificError.EITHER]: () => 'FIXME: implement either',
  [ESpecificError.INTEGER]: integerErrorMessage,
  [ESpecificError.MAX]: minMaxErrorMessage,
  [ESpecificError.MIN]: minMaxErrorMessage,
  [ESpecificError.GREATER_THAN_EQUAL]: greaterThanErrorMessage(true),
  [ESpecificError.GREATER_THAN]: greaterThanErrorMessage(false),
  [ESpecificError.LESS_THAN_EQUAL]: lessThanErrorMessage(true),
  [ESpecificError.LESS_THAN]: lessThanErrorMessage(false),
  [ESpecificError.NOT_EMPTY]: notEmptyErrorMessage,
  [ESpecificError.NOT_IN_ENUM]: notInEnumErrorMessage,
  [ESpecificError.UNIQUE]: uniqueErrorMessage,
  [ESpecificError.VALID_ID]: validIdErrorMessage,
};

export const defaults = {
  /**
   * This is the function that will respond the express request with the error
   * message it takes as a parameter.
   *
   * The default function will respond with `400 { error: message }`.
   */
  onError,
  errorMessages,
  transformers: {
    param: {
      /**
       * A function that takes a parameter path (that may be using the dot
       * notation) and returns a user friendly string that represents what it
       * is.
       *
       * For example: `user.name.first` should be `first name`.
       *
       * The default function provided by reqparams is pretty useless as it
       * just returns the param path.
       */
      pathToName: paramPathToName,
    },
    paramError: {
      /**
       * This function will be used by `ParamError.toString`, it takes in the
       * `ParamError` and returns a string describing the occurred error. The
       * value returned by this function will be sent to the user.
       */
      toString: paramErrorToString,
    },
  },
};
