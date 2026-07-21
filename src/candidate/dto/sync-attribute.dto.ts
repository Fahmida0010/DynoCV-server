import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SyncAttributeDto {
  @IsString()
  @IsNotEmpty()
  attributeId: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsNumber()
  @IsNotEmpty()
  version: number;
}