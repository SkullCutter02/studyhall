import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ImagePreset } from "../utils/compressImageBuffer";

@Injectable()
export class ParseImagePresetPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): keyof typeof ImagePreset {
    if (!value) return "LG";

    if (typeof value !== "string") throw new BadRequestException("Preset query is not type string");

    if (!Object.keys(ImagePreset).includes(value.toUpperCase()))
      throw new BadRequestException("Preset query is not valid preset");

    return value.toUpperCase() as keyof typeof ImagePreset;
  }
}
