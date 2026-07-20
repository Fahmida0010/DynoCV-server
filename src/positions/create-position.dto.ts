import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attributeIds?: string[];
}