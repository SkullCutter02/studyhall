import { IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateQuestionDto {
  @IsString()
  @MaxLength(350)
  title: string;

  @IsString()
  body: string;

  @IsString()
  @IsOptional()
  whiteboard?: string;

  @IsUUID()
  hallId: string;
}
