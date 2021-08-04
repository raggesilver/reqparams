import _ from '@raggesilver/hidash';

import { ErrorType, ValidateFunction } from '../types';
import { ParamError } from '../internal/error-defaults';

// FIXME: the comparing logic for type conversion & validation should have it's
// own function in order for other components to use it.

export default function (): ValidateFunction {
  return (val: any, req, param, path, source) => {
    const error = new ParamError(param, path, ErrorType.INVALID_PARAM_TYPE);
    // Check for null
    if (val === null && !param.nullable) {
      throw error;
    }
    // Check if a date was provided as ISO-string or number. If so the payload
    // value will be converted to a JavaScript Date and the type checking will
    // pass
    if (param.type === Date && ['string', 'number'].includes(typeof val)) {
      const d = new Date(val);
      if (
        !isNaN(Number(d)) &&
        (d.toISOString() === val || d.getTime() === val)
      ) {
        // TODO: it would be nice if we could make this behavior optional
        _.set(req[source], path, val);
        return true;
      }
    }
    // Check type
    if (toString.call(val) !== toString.call(new param.type())) {
      throw error;
    }
    return true;
  };
}
