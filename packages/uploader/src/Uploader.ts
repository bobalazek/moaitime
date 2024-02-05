import { createReadStream } from 'fs';

import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class Uploader {
  async uploadToBucket(
    url: string,
    filePath: string,
    fileContentType: string,
    key: string,
    expiresIn?: number
  ): Promise<string> {
    const [protocol, bucketUrl] = url.split('://');

    const atSplit = bucketUrl.split('@');
    if (atSplit.length !== 2) {
      throw new Error(`Invalid bucket URL (${bucketUrl}).`);
    }

    const colonSplit = atSplit[0].split(':');
    if (colonSplit.length !== 2) {
      throw new Error(`Invalid bucket URL (${bucketUrl}).`);
    }

    const slashSplit = atSplit[1].split('/');

    const region = 'us-east-1';
    const domain = slashSplit[0];
    const bucket = slashSplit[1];
    const accessKeyId = colonSplit[0];
    const secretAccessKey = colonSplit[1];

    const endpoint = `${protocol}://${domain}`;
    const forcePathStyle = ['localhost', 'minio', '127.0.0.1'].some((host) =>
      domain.includes(host)
    );

    const client = new S3Client({
      region,
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle,
    });

    const upload = new Upload({
      client,
      params: {
        Bucket: bucket,
        Key: key,
        Body: createReadStream(filePath),
        ContentType: fileContentType,
      },
    });
    await upload.done();

    const getObjectCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    return getSignedUrl(client, getObjectCommand, {
      expiresIn,
    });
  }
}

export const uploader = new Uploader();
