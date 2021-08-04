// ( ^ω^)

import { BooleanBuilder } from './boolean';
import { NumberBuilder } from './number';
import { StringBuilder } from './string';

export default {
  Boolean: () => new BooleanBuilder(),
  Number: () => new NumberBuilder(),
  String: () => new StringBuilder(),
};
