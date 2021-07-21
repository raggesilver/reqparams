import { Constructor, Param } from '../types';
import { Request } from 'express';

import existenceCheck from '../validate/existence';
import typeCheck from '../validate/type';

export function defaultEnumCmp(a: any, b: any) {
  return a === b;
}

// Internal function used to prevent .notRequired() calls from creating loads of
// anonymous `() => false` functions.
function isNotRequired() {
  return false;
}

// Internal function used to prevent ParamBuilder instances from creating loads
// of anonymous `() => true` functions.
function isRequired() {
  return true;
}

export default class ParamBuilder implements Param {
  either: Param['either'] = undefined;
  enum: Param['enum'] = undefined;
  enumCmp: Param['enumCmp'] = defaultEnumCmp;
  name: Param['name'] = undefined;
  nullable: Param['nullable'] = false;
  required: Param['required'] = isRequired;
  type: Param['type'];
  validate: Param['validate'] = [];

  protected constructor(type: Constructor) {
    this.type = type;
    this.validate = [existenceCheck(), typeCheck()];
  }

  notRequired() {
    return this.setRequired(isNotRequired);
  }

  setRequired(isRequired: boolean | Param['required'] = true) {
    this.required =
      typeof isRequired === 'boolean' ? () => isRequired : isRequired;
    return this;
  }

  async isRequired(req: Request) {
    return typeof this.required === 'function'
      ? await this.required(req)
      : this.required;
  }
}
