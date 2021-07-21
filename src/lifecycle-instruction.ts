export enum LifecycleInstructionType {
  SKIP,
}

export class LifecycleInstruction {
  type: LifecycleInstructionType;

  constructor(type: LifecycleInstructionType) {
    this.type = type;
  }
}

export default {
  SKIP: new LifecycleInstruction(LifecycleInstructionType.SKIP),
};
