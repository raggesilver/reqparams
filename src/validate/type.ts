import { Constructor, ValidateFunction } from '../types';

import _ from '@raggesilver/hidash';

export default function (type: Constructor): ValidateFunction {
  return (val: any, req, param, path) => {
    // Check for null
    if (val === null && !param.nullable) {
      return false;
    }
    // Check if a date was provided as ISO-string or number. If so the payload
    // value will be converted to a JavaScript Date and the type checking will
    // pass
    if (type === Date && ['string', 'number'].includes(typeof val)) {
      const d = new Date(val);
      if (
        !isNaN(Number(d)) &&
        (d.toISOString() === val || d.getTime() === val)
      ) {
        _.set(req, path, val);
        return true;
      }
    }
    // Check type
    if (toString.call(val) !== toString.call(new type())) {
      return false;
    }
    return true;
  };
}
