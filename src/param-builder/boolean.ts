import { ParamError } from '../internal/error-defaults';
import { ErrorType, ESpecificError } from '../types';
import ParamBuilder from './default';

export class BooleanBuilder extends ParamBuilder {
  constructor() {
    super(Boolean);
  }

  true(errorMessage?: string) {
    this.validate.push((v: boolean, _req, param, path) => {
      if (!v) {
        throw new ParamError(
          param,
          path,
          ErrorType.VALIDATION_ERROR,
          errorMessage,
          ESpecificError.BOOLEAN,
          { shouldBe: true },
        );
      }
      return true;
    });
    return this;
  }

  false(errorMessage?: string) {
    this.validate.push((v: boolean, _req, param, path) => {
      if (v) {
        throw new ParamError(
          param,
          path,
          ErrorType.VALIDATION_ERROR,
          errorMessage,
          ESpecificError.BOOLEAN,
          { shouldBe: false },
        );
      }
      return true;
    });
    return this;
  }
}
