// src/attributes/dto/update-attribute.dto.ts
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateAttributeDto {
  @IsString()
  @IsOptional()
  label?: string;

  @IsString()
  @IsOptional()
  type?: string;
}