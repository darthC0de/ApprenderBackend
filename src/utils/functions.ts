/* eslint-disable import/export */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable indent */
/* eslint-disable import/extensions */
import { createLogger, format, transports, Logger } from 'winston';
import { IFieldError } from './interfaces';
import 'winston-daily-rotate-file';

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

export interface IFieldValidationResponse {
  hasMissing: boolean;
  errors?: IFieldError[];
}
export interface iFieldValidation<T> {
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
  /** Validates if field is required or not */
  required?: boolean;
}

interface iObject extends Object {
  [key: string]: any;
}

/**
 * Validate if the data object has the required fields
 * @param {string} fields
 * @param {any} data
 */
export function validateFields<T>(
  fields: iFieldValidation<T>[],
  data: any,
): { hasMissing: boolean; errors?: IFieldError[] } {
  const errors: IFieldError[] = [];
  fields.forEach((field: iFieldValidation<T>) => {
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
          mensagem: validation.message
            ? validation.message
            : `Failure on ${field.name}`,
        });
      }
      return;
    }
    const is_field_number =
      data[field.name] && field.type === 'number' && isNaN(data[field.name]);
    if (is_field_number) {
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
      typeof data[field.name] !== 'string' &&
      data[field.name] !== '';

    if (is_field_string) {
      logger.error(`O campo ${field.name} deve ser do tipo string`);
      errors.push({
        campo: field.name,
        mensagem: `O campo ${field.name} deve ser do tipo string`,
      });
      return;
    }

    const is_array = data[field.name] && field.type === 'array';
    if (is_array) {
      if (data[field.name] && data[field.name].length === 0) {
        logger.error(`O campo ${field.name} não deve ser vazio`);
        errors.push({
          campo: field.name,
          mensagem: `O campo ${field.name} não deve ser vazio`,
        });
        return;
      }
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
          (item: any) => typeof item != 'string' || item === '',
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

/**
 * Transforms object keys to lowercase
 * @param {Array} data *-> Array of objects to pass or object to be passed*
 * */
export function minimizer(data: Array<iObject> | iObject): Array<any> | any {
  if (Array.isArray(data)) {
    return data.map(item =>
      Object.fromEntries(
        Object.entries(item).map(pair => [
          pair[0].toLowerCase(),
          pair[1] === -1 ? '-' : pair[1],
        ]),
      ),
    );
  }
  return Object.fromEntries(
    Object.entries(data).map(pair => [
      pair[0].toLowerCase(),
      pair[1] === -1 ? '-' : pair[1],
    ]),
  );
}
