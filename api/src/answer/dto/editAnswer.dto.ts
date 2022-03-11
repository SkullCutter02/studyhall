import { OmitType, PartialType } from "@nestjs/mapped-types";

import { CreateAnswerDto } from "./createAnswer.dto";

export class EditAnswerDto extends PartialType(OmitType(CreateAnswerDto, ["questionId", "referenceId"] as const)) {}
