import { NextFunction, Request, Response } from 'express';
import { ParamError, ErrorType, ESpecificError, IEither } from '.';
import { maybePlural } from './utils';

function paramPathToName (path: string) {
  return path;
}

function paramErrorToString (error: ParamError) {
  const name = error.param.name
    || defaults.transformers.param.pathToName(error.paramPath);

  if (error.specificError && error.specificError in defaults.errorMessages) {
    return defaults
      .errorMessages[error.specificError as ESpecificError](name, error);
  }

  switch (error.type) {
    case ErrorType.INVALID_PARAM_TYPE:
      // This is not user friendly as it is a programmer error
      return `Invalid type for ${name}`;
    case ErrorType.MISSING_REQUIRED_PARAM:
      return `${name} is required`;
    case ErrorType.VALIDATION_ERROR:
      /* istanbul ignore next */
      return `Invalid ${name}`;
  }
}

function defaultOnError (
  _req: Request, res: Response, _next: NextFunction, msg: string
) {
  return res.status(400).json({
    error: msg,
  });
}

// Error message functions =====================================================

type ErrorMessageFunction = (name: string, error: ParamError) => string;

// integer
const integerErrorMessage: ErrorMessageFunction = name => {
  return `${name} must be an integer`;
};

// notEmpty
const notEmptyErrorMessage: ErrorMessageFunction = name => {
  return `${name} may not be empty`;
};

// min, max
const minMaxErrorMessage: ErrorMessageFunction = (name, error) => {
  // Get the minimum or maximum value according to the specific error
  const boundryValue: number = error.extraData![error.specificError!];
  const boundryText = (error.specificError === 'min') ? 'at least' : 'at most';

  if (error.param.type === Array) {
    // Example: Tasks must have at least 1 item
    // Example: Tasks must have at most 200 items
    const items = maybePlural('item', boundryValue);
    return `${name} must have ${boundryText} ${boundryValue} ${items}`;
  }
  else if (error.param.type === String) {
    // Example: Text must be at least 10 characters long
    // Example: Text must be at most 180 characters long
    const characters = maybePlural('character', boundryValue);
    return `${name} must be ${boundryText} ${boundryValue} ${characters} long`;
  }
  else if (error.param.type === Number) {
    // Example: Age must be at least 18
    // Example: Age must be at most 25
    return `${name} must be ${boundryText} ${boundryValue}`;
  }
  /* istanbul ignore next */
  throw new Error(`Unexpected Param type '${error.param.type}'`);
};

// unique
const uniqueErrorMessage: ErrorMessageFunction = name => {
  return `${name} is already in use`;
};

// notInEnum
const notInEnumErrorMessage: ErrorMessageFunction = (name, error) => {
  const options = error.param.enum!.map(el => el.toString());
  let optionsText: string;

  if (options.length > 1) {
    optionsText = (options.length > 2) ? 'one of ' : '';
    optionsText += options.slice(0, options.length - 1).join(', ');
    optionsText += ` or ${options[options.length - 1]}`;
  }
  else {
    optionsText = options[0];
  }

  // optionsText could be:
  // Day of the week must be Monday
  // Day of the week must be Monday or Tuesday
  // Day of the week must be one of Monday, Tuesday or Wednesday

  return `${name} must be ${optionsText}`;
};

// requiredIfExists
const requiredIfExistsErrorMessage: ErrorMessageFunction = (name, error) => {
  // FIXME: we currently don't have a way to get a possible Param.name for
  // $exists
  const exists = error.param.requiredIf!.$exists!;
  const existsName = error.params[exists]?.name
    || defaults.transformers.param.pathToName(exists);

  return `${name} is required when ${existsName} is provided`;
};

// validId
const validIdErrorMessage: ErrorMessageFunction = (_name, error) => {
  return `${error.extraData!.id} is not a valid id`;
};

// missingEither
const eitherErrorMessage: ErrorMessageFunction = (_, error) => {
  const eitherGroups = error.extraData!.either as IEither;
  const either = eitherGroups[error.extraData!.eitherGroup as string];
  const params = error.params;

  const names = either.map(el => {
    return params[el]?.name || defaults.transformers.param.pathToName(el);
  });

  if (either.length === 1) {
    return `${names[0]} is required`;
  }

  let eitherText = 'One of ';
  eitherText += names.slice(0, names.length - 1).join(', ');
  eitherText += ` or ${names[names.length - 1]}`;
  eitherText += ' is required';

  return eitherText;
};

const lessGreaterMessage: ErrorMessageFunction = (name, error) => {
  switch (error.specificError) {
    case ESpecificError.GREATER_THAN:
      return `${name} must be greater than ${error.extraData!.n}`;
    case ESpecificError.GREATER_THAN_OR_EQUAL:
      return `${name} must be greater than or equal ${error.extraData!.n}`;
    case ESpecificError.LESS_THAN:
      return `${name} must be less than ${error.extraData!.n}`;
    case ESpecificError.LESS_THAN_OR_EQUAL:
      return `${name} must be less than or equal ${error.extraData!.n}`;
  }

  /* istanbul ignore next */
  throw new Error('Invalid specific error for less than/greater than');
};

// Defaults ====================================================================

const errorMessages: {
  [k in ESpecificError]: ErrorMessageFunction;
} = {
  either: eitherErrorMessage,
  integer: integerErrorMessage,
  notEmpty: notEmptyErrorMessage,
  min: minMaxErrorMessage,
  max: minMaxErrorMessage,
  unique: uniqueErrorMessage,
  notInEnum: notInEnumErrorMessage,
  requiredIfExists: requiredIfExistsErrorMessage,
  validId: validIdErrorMessage,
  lt: lessGreaterMessage,
  lte: lessGreaterMessage,
  gt: lessGreaterMessage,
  gte: lessGreaterMessage,
};

const defaults = {
  /**
   * This is the function that will respond the express request with the error
   * message it takes as a parameter.
   *
   * The default function will return a response with status code 400 containing
   * a JSON body: `{ error: message }`.
   */
  onError: defaultOnError,
  errorMessages: errorMessages,
  transformers: {
    param: {
      /**
       * A function that takes a parameter path (that may be using the dot
       * notation) and returns a user friendly strings that represents what it
       * is.
       *
       * For example: 'user.name.first' should be 'first name'.
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

export default defaults;
