import { applyMixins } from '../utils';
import { ErrorType, ESpecificError, ParamError } from '../error';
import { MinMax } from './mixins/min-max';
import ParamBuilder from './default';

export interface NumberBuilder extends ParamBuilder, MinMax {}

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

  greaterThanOrEqual(n: number, errorMessage?: string) {
    this.validate.push((v: number, _req, param, path) => {
      if (!(v >= n)) {
        throw new ParamError(
          param,
          path,
          ErrorType.VALIDATION_ERROR,
          errorMessage,
          ESpecificError.GREATER_THAN_EQUAL,
          { value: n },
        );
      }
      return true;
    });
    return this;
  }

  greaterThan(n: number, errorMessage?: string) {
    this.validate.push((v: number, _req, param, path) => {
      if (!(v > n)) {
        throw new ParamError(
          param,
          path,
          ErrorType.VALIDATION_ERROR,
          errorMessage,
          ESpecificError.GREATER_THAN,
          { value: n },
        );
      }
      return true;
    });
    return this;
  }

  lessThanOrEqual(n: number, errorMessage?: string) {
    this.validate.push((v: number, _req, param, path) => {
      if (!(v <= n)) {
        throw new ParamError(
          param,
          path,
          ErrorType.VALIDATION_ERROR,
          errorMessage,
          ESpecificError.LESS_THAN_EQUAL,
          { value: n },
        );
      }
      return true;
    });
    return this;
  }

  lessThan(n: number, errorMessage?: string) {
    this.validate.push((v: number, _req, param, path) => {
      if (!(v < n)) {
        throw new ParamError(
          param,
          path,
          ErrorType.VALIDATION_ERROR,
          errorMessage,
          ESpecificError.LESS_THAN,
          { value: n },
        );
      }
      return true;
    });
    return this;
  }

  gt = this.greaterThan;
  geq = this.greaterThanOrEqual;
  lt = this.lessThan;
  leq = this.lessThanOrEqual;
}

applyMixins(NumberBuilder, [MinMax]);
