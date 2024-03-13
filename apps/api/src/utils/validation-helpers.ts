/* eslint-disable @typescript-eslint/no-explicit-any */

// Borrowed from:
// https://github.com/risen228/nestjs-zod/blob/main/src/dto.ts
// and
// https://github.com/risen228/nestjs-zod/blob/master/src/pipe.ts

import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ZodSchema, ZodTypeDef } from 'zod';

export interface ZodDto<TOutput = any, TDef extends ZodTypeDef = ZodTypeDef, TInput = TOutput> {
  new (): TOutput;
  isZodDto: true;
  schema: ZodSchema<TOutput, TDef, TInput>;
  create(input: unknown): TOutput;
}

export type ZodValidationPipeClass = new (schemaOrDto?: ZodSchema | ZodDto) => PipeTransform;

export function createZodDto<TOutput = any, TDef extends ZodTypeDef = ZodTypeDef, TInput = TOutput>(
  schema: ZodSchema<TOutput, TDef, TInput>
) {
  class AugmentedZodDto {
    public static isZodDto = true;
    public static schema = schema;

    public static create(input: unknown) {
      return this.schema.parse(input);
    }
  }

  return AugmentedZodDto as unknown as ZodDto<TOutput, TDef, TInput>;
}

export function isZodDto(metatype: any): metatype is ZodDto<unknown> {
  return metatype?.isZodDto;
}

export function validate<
  TOutput = any, // eslint-disable-line @typescript-eslint/no-explicit-any
  TDef extends ZodTypeDef = ZodTypeDef,
  TInput = TOutput,
>(value: unknown, schemaOrDto: ZodSchema<TOutput, TDef, TInput> | ZodDto<TOutput, TDef, TInput>) {
  const schema = isZodDto(schemaOrDto) ? schemaOrDto.schema : schemaOrDto;

  const result = schema.safeParse(value);

  if (!result.success) {
    throw result.error;
  }

  return result.data;
}

export function createZodValidationPipe(): ZodValidationPipeClass {
  @Injectable()
  class ZodValidationPipe implements PipeTransform {
    constructor(private schemaOrDto?: ZodSchema | ZodDto) {}

    public transform(value: unknown, metadata: ArgumentMetadata) {
      if (this.schemaOrDto) {
        return validate(value, this.schemaOrDto);
      }

      const { metatype } = metadata;

      if (!isZodDto(metatype)) {
        return value;
      }

      return validate(value, metatype.schema);
    }
  }

  return ZodValidationPipe;
}

export const ZodValidationPipe = createZodValidationPipe();
