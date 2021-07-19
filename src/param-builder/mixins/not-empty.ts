import ParamBuilder from '../default';

export class NotEmpty extends ParamBuilder {
  notEmpty(errorMesssage?: string) {
    this.validate.push((v: string | any[] | Record<any, any>) => {
      if (this.type === String) {
        if (/^\s*$/.test(v as string)) {
          return errorMesssage || 'FIXME: throw error';
        }
      } else if (this.type === Array) {
        if ((v as any[]).length === 0) {
          return errorMesssage || 'FIXME: throw error';
        }
      } else {
        if (Object.keys(v as any).length === 0) {
          return errorMesssage || 'FIXME: throw error';
        }
      }
      return true;
    });
    return this;
  }
}
