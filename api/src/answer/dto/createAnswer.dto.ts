import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateAnswerDto {
  @IsString()
  body: string;

  @IsUUID()
  questionId: string;

  @IsUUID()
  @IsOptional()
  referenceId?: string;
}
