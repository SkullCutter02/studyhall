import { CursorPaginateDto } from "./cursorPaginate.dto";
import { IsOptional, IsString } from "class-validator";

export class CursorPaginateWithFilterDto extends CursorPaginateDto {
  @IsString()
  @IsOptional()
  filter: string;
}
