import { Constructor, Param } from '../types';

import typeCheck from '../validate/type';

export function defaultEnumCmp (a: any, b: any) {
  return a === b;
}

export default class ParamBuilder implements Param {
  either: Param['either'] = undefined;
  enum: Param['enum'] = undefined;
  enumCmp: Param['enumCmp'] = defaultEnumCmp;
  name: Param['name'] = undefined;
  nullable: Param['nullable'] = false;
  required: Param['required'] = () => Promise.resolve(true);
  type: Param['type'];
  validate: Param['validate'] = [];

  protected constructor (type: Constructor) {
    this.type = type;
    this.validate = [typeCheck(this.type)];
  }
}
