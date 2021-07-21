import _ from '@raggesilver/hidash';
import LifecycleInstruction from '../lifecycle-instruction';
import { ErrorType, ParamError } from '../error';
import { ValidateFunction } from '../types';

export default function existence(): ValidateFunction {
  return async (_v, req, param, path) => {
    const isParamRequired = await param.required(req);
    if (_.exists(req, path)) {
      return true;
    }
    // TODO: implement required if
    // if (param.requiredIf)
    if (!isParamRequired) {
      return LifecycleInstruction.SKIP;
    }
    // TODO: implement either
    // if (param.either)
    throw new ParamError(param, path, ErrorType.MISSING_REQUIRED_PARAM);
  };
}
