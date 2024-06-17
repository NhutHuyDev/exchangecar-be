import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class IsRangeQueryConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    const regex = /^(\d{1,8}|)(,(|\d{1,8}))?$/;
    return regex.test(value);
  }

  defaultMessage() {
    return 'a range-typed query must be in the format numberA,numberB or numberA or ,numberB';
  }
}

export function IsRangeQuery(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsRangeQueryConstraint,
    });
  };
}
