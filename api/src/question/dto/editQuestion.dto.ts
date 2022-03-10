import { PartialType } from "@nestjs/mapped-types";
import { IsBoolean, IsOptional } from "class-validator";

import { CreateQuestionDto } from "./createQuestion.dto";

export class EditQuestionDto extends PartialType(CreateQuestionDto) {
  @IsBoolean()
  @IsOptional()
  answered?: boolean;
}
