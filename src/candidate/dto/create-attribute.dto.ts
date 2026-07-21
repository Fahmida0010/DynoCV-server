import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateAttributeDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['TEXT', 'NUMBER', 'BOOLEAN'])
  type: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}