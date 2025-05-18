
export type ValidationResult = string | undefined;

export type Validate<T> = (value: T) => ValidationResult;

export function validator<T>(value: T) {
  return new Validator(value);
}

export class Validator<T> {
  private readonly value: T;
  private readonly validators: Validate<T>[];

  constructor(value: T) {
    this.value = value;
    this.validators = []
  }

  scope(max: number, message: string) {
    return this.validator(value => lowerEqualsThen(value, max, message));
  }

  max(max: number, message: string) {
    return this.validator(value => lowerEqualsThen(value, max, message));
  }

  min(min: number, message: string) {
    return this.validator(value => greaterEqualsThen(value, min, message));
  }

  notEmpty(message: string): this  {
    return this.validator(value => notEmpty(value, message));
  }

  notBlank(message: string): this  {
    return this.validator(value => notBlank(value, message));
  }

  validator(validate: Validate<T>): this {
    this.validators.push(validate);
    return this;
  }

  validate(): string {
    return this.validators
      .map(validator => validator(this.value))
      .filter(msg => msg)
      .join(";\n");
  }
}

function greaterEqualsThen(value: unknown, min: number, message: string): ValidationResult {
  if (!(condition(value).number()?.min(min).check()
    || condition(value).string()?.min(min).check()
    || condition(value).array()?.min(min).check()))
    return message;
}

function lowerEqualsThen(value: unknown, max: number, message: string): ValidationResult {
  if (!(condition(value).number()?.max(max).check()
    || condition(value).string()?.max(max).check()
    || condition(value).array()?.max(max).check()))
    return message;
}

function notEmpty(value: unknown, message: string): ValidationResult {
  if (!(condition(value).string()?.notEmpty().check()
    || condition(value).array()?.notEmpty().check()))
    return message;
}

function notBlank(value: unknown, message: string): ValidationResult {
  if (!condition(value).string()?.notBlank().check())
    return message;
}

export type Condition<T> = (value: T) => boolean;

export function condition(value: unknown): ConditionBuilder {
  return new ConditionBuilder(value);
}

export class ConditionBuilder {
  constructor(private readonly value: unknown) {}

  number(): NumberCondition | undefined {
    return typeof this.value === "number" ? new NumberCondition(this.value) : undefined;
  }

  string(): StringCondition | undefined {
    return typeof this.value === "string" ? new StringCondition(this.value) : undefined;
  }

  array(): ArrayCondition | undefined {
    return Array.isArray(this.value) ? new ArrayCondition(this.value) : undefined;
  }
}

export class TypeCondition<T> {
  private readonly value: T;
  private readonly conditions: Condition<T>[];

  constructor(value: T) {
    this.value = value;
    this.conditions = [];
  }

  condition(condition: Condition<T>): this {
    this.conditions.push(condition);
    return this;
  }

  check(): boolean {
    for (const condition of this.conditions) {
      if (condition(this.value)) return true;
    }
    return false
  }
}

export class NumberCondition extends TypeCondition<number> {
  scope(min: number, max: number): this {
    this.min(min);
    return this.max(max);
  }

  min(min: number): this {
    return this.condition((value) => value >= min);
  }

  max(max: number): this {
    return this.condition((value) => value <= max);
  }
}

export class StringCondition extends TypeCondition<string> {
  scope(min: number, max: number): this {
    this.min(min);
    return this.max(max);
  }

  min(min: number): this {
    return this.condition((value) => value.length >= min);
  }

  max(max: number): this {
    return this.condition((value) => value.length <= max);
  }

  notEmpty(): this {
    return this.condition((value) => !!value)
  }

  notBlank(): this {
    return this.condition((value) => !!value.trim())
  }
}

export class ArrayCondition extends TypeCondition<unknown[]> {
  scope(min: number, max: number): this {
    this.min(min);
    return this.max(max);
  }

  min(min: number): this {
    return this.condition((value) => value.length >= min);
  }

  max(max: number): this {
    return this.condition((value) => value.length <= max);
  }

  notEmpty(): this {
    return this.condition((value) => value.length !== 0)
  }
}

