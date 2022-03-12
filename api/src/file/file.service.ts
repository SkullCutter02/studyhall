import { Injectable } from "@nestjs/common";
import { S3 } from "aws-sdk";
import { ConfigService } from "@nestjs/config";
import { v4 as uuid } from "uuid";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class FileService {
  private readonly s3: S3;

  constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService) {
    this.s3 = new S3();
  }

  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const uploadResult = await this.s3
      .upload({
        Bucket: this.configService.get("AWS_PUBLIC_BUCKET_NAME"),
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();

    return this.prisma.publicFile.create({
      data: { key: uploadResult.Key, url: uploadResult.Location },
    });
  }
}
