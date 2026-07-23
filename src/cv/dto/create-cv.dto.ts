import { IsNotEmpty, IsString, IsObject } from 'class-validator';

export class CreateCvDto {
  @IsNotEmpty()
  @IsString()
  positionId: string;

  @IsNotEmpty()
  @IsObject()
  content: any; // JSON snapshot data
}