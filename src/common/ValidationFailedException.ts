import { UnprocessableEntityException } from '@nestjs/common';

export class ValidationFailedException extends UnprocessableEntityException {
  constructor(errors: any[]) {
    super({
      code: 'validation-failed',
      message: 'Validation failed',
      errors: errors,
    });
  }
}
