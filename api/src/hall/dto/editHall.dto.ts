import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateHallDto } from "./createHall.dto";

export class EditHallDto extends PartialType(OmitType(CreateHallDto, ["nickname"] as const)) {}
