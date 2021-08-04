import _ from '@raggesilver/hidash';
import LifecycleInstruction from '../lifecycle-instruction';
import { ErrorType, ParamError } from '../error';
import { ValidateFunction } from '../types';

export default function existence(): ValidateFunction {
  return async (_v, req, param, path, source) => {
    if (_.exists(req[source], path)) {
      return true;
    }
    const isParamRequired = await param.required(req);
    // If param is not required and doesn't exist skip all further validation
    if (!isParamRequired) {
      return LifecycleInstruction.SKIP;
    }
    // TODO: implement either
    // if (param.either)
    throw new ParamError(param, path, ErrorType.MISSING_REQUIRED_PARAM);
  };
}
