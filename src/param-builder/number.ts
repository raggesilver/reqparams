import { applyMixins } from '../utils';
import { ErrorType, ESpecificError, ParamError } from '../error';
import { MinMax } from './mixins/min-max';
import { LessGreater } from './mixins/less-greater';
import ParamBuilder from './default';

export interface NumberBuilder
  extends ParamBuilder,
    MinMax,
    LessGreater<number> {}

export class NumberBuilder extends ParamBuilder {
  isInteger = false;

  constructor() {
    super(Number);
  }

  integer(errorMessage?: string) {
    this.isInteger = true;
    this.validate.push((v: number, _req, param, path) => {
      if (!Number.isInteger(v)) {
        throw new ParamError(
          param,
          path,
          ErrorType.VALIDATION_ERROR,
          errorMessage,
          ESpecificError.INTEGER,
        );
      }
      return true;
    });
    return this;
  }
}

applyMixins(NumberBuilder, [MinMax, LessGreater]);
