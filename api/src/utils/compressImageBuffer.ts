import sharp from "sharp";

export enum ImagePreset {
  XS = 200,
  SM = 500,
  MD = 1000,
  LG = 1500,
}

export const compressImageBuffer = (imageBuffer: Buffer, preset: ImagePreset) => {
  return sharp(imageBuffer).resize({ width: preset }).toBuffer();
};
