// src/attributes/dto/create-attribute.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateAttributeDto {
  @IsString()
  @IsNotEmpty({ message: 'Label field is required and cannot be empty.' })
  label!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsBoolean()
  @IsOptional()
  isBuiltIn?: boolean;
}