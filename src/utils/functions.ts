import { IFieldError } from './interfaces';
import { createLogger, format, transports, Logger } from 'winston';
import 'winston-daily-rotate-file';

export interface IFieldValidation<T> {
  /** Field name for validation */
  name: string;
  /** Field for type validation.
   *
   * Allowed types are `string` | `number` | `array` */
  type?: 'string' | 'number' | 'array';
  /** `Only for type = array`.
   *
   * Allows validation for array items type.
   *
   * Allowed types are `string` | `number` */
  arrayItems?: 'string' | 'number';
  /** Allows to implement custom validators.
   *
   * Receives field data and must return an object containing result and message. */
  validator?: (field: T) => { result: boolean; message?: string };
  /** Validates if field is required or not*/
  required?: boolean;
}

/**
 * Validate if the data object has the required fields
 * @param {string} fields
 * @param {any} data
 */
export function validateFields<T>(
  fields: IFieldValidation<T>[],
  data: any,
): { hasMissing: boolean; errors?: IFieldError[] } {
  const errors: IFieldError[] = [];
  fields.forEach((field: IFieldValidation<T>) => {
    const required = field.required === false ? field.required : true;

    if (!data[field.name] && required === true) {
      logger.error(`O campo ${field.name} não pode ser nulo`);
      errors.push({
        campo: field.name,
        mensagem: `O campo ${field.name} não pode ser nulo`,
      });
      return;
    }
    if (data[field.name] && field.validator) {
      const validation = field.validator(data[field.name]);
      if (validation.result && validation.result === true) return;
      if (validation.message) {
        logger.error(validation.message);
        errors.push({
          campo: field.name,
          mensagem: validation.message,
        });
      }
      return;
    }

    if (
      data[field.name] &&
      field.type === 'number' &&
      isNaN(data[field.name])
    ) {
      logger.error(`O campo ${field.name} deve ser do tipo Number`);
      errors.push({
        campo: field.name,
        mensagem: `O campo ${field.name} deve ser do tipo Number`,
      });
      return;
    }
    const is_field_string =
      data[field.name] &&
      field.type === 'string' &&
      typeof data[field.name] !== 'string';

    if (is_field_string) {
      logger.error(`O campo ${field.name} deve ser do tipo string`);
      errors.push({
        campo: field.name,
        mensagem: `O campo ${field.name} deve ser do tipo string`,
      });
      return;
    }

    if (data[field.name] && field.type === 'array') {
      if (!Array.isArray(data[field.name])) {
        logger.error(`O campo ${field.name} deve ser um array`);
        errors.push({
          campo: field.name,
          mensagem: `O campo ${field.name} deve ser um array`,
        });
        return;
      }
      if (field.arrayItems && field.arrayItems === 'number') {
        const is_valid = data[field.name].filter((item: any) => isNaN(item));
        if (is_valid.length > 0) {
          logger.error(
            `O campo ${field.name} deve ser um array do tipo Number`,
          );
          errors.push({
            campo: field.name,
            mensagem: `O campo ${field.name} deve ser um array do tipo Number`,
          });
        }
        return;
      }

      if (field.arrayItems && field.arrayItems === 'string') {
        const is_valid = data[field.name].filter(
          (item: any) => typeof item != 'string',
        );
        if (is_valid.length > 0) {
          logger.error(
            `O campo ${field.name} deve ser um array do tipo String`,
          );
          errors.push({
            campo: field.name,
            mensagem: `O campo ${field.name} deve ser um array do tipo String`,
          });
        }
        return;
      }
    }
  });
  return { hasMissing: errors.length > 0, errors: errors };
}

export const logger: Logger = createLogger({
  level: 'info',
  transports: [
    new transports.Console({
      level: 'verbose',
      format: format.combine(format.colorize(), format.simple()),
    }),
    new transports.DailyRotateFile({
      filename: './logs/%DATE%_logs.log',
      level: 'debug',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: format.json(),
    }),
  ],
});
