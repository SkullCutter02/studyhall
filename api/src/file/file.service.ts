import { Injectable } from "@nestjs/common";
import { S3 } from "aws-sdk";
import { ConfigService } from "@nestjs/config";
import { v4 as uuid } from "uuid";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class FileService {
  private readonly s3: S3;

  constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService) {
    this.s3 = new S3({ endpoint: this.configService.get("AWS_S3_BUCKET_ENDPOINT") });
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

  async deletePublicFile(fileId: string) {
    const file = await this.prisma.publicFile.findUnique({
      where: { id: fileId },
    });

    await this.s3
      .deleteObject({
        Bucket: this.configService.get("AWS_PUBLIC_BUCKET_NAME"),
        Key: file.key,
      })
      .promise();

    await this.prisma.publicFile.delete({
      where: { id: fileId },
    });
  }
}
