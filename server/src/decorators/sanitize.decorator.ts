import {Transform} from 'class-transformer';
import {sanitize} from '../utils/sanitize';
import {BadRequestException} from '@nestjs/common';

/**
 * Декоратор для санитизации HTML в полях DTO
 * @returns {PropertyDecorator} Декоратор для санитизации
 */
export function SanitizeHtml(): PropertyDecorator {
  return Transform(({value}) => {
    if (typeof value === 'string') {
      const sanitized = sanitize(value);
      // Если после санитизации строка отличается от исходной (были удалены теги),
      // значит в ней был недопустимый HTML
      if (sanitized !== value) {
        throw new BadRequestException('Поле содержит недопустимый HTML-контент');
      }
      return sanitized;
    }
    return value;
  });
}
