import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsOptional() 
  discussionId?: string;

  @IsString()
  @IsOptional() 
  positionId?: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsOptional()
  parentId?: string;
}