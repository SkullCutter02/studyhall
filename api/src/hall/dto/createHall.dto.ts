import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreateHallDto {
  @IsString()
  @MaxLength(35)
  name: string;

  @IsString()
  @MaxLength(30)
  @IsOptional()
  nickname?: string;
}
