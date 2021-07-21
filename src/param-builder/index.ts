// ( ^ω^)

import { NumberBuilder } from './number';
import { StringBuilder } from './string';

export default {
  String: () => new StringBuilder(),
  Number: () => new NumberBuilder(),
};
