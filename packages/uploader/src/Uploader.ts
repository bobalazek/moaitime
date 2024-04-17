import { createReadStream, createWriteStream } from 'fs';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

import { DeleteObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class Uploader {
  async uploadToBucket(
    bucketUrl: string,
    filePath: string,
    fileContentType: string,
    key: string,
    expiresIn?: number,
    isPublic?: boolean
  ): Promise<string> {
    const { client, bucket } = this._getClientAndBucket(bucketUrl);

    const upload = new Upload({
      client,
      params: {
        Bucket: bucket,
        Key: key,
        Body: createReadStream(filePath),
        ContentType: fileContentType,
        ACL: !isPublic ? 'private' : 'public-read',
      },
    });
    const uploadResponse = await upload.done();
    if (isPublic) {
      return uploadResponse.Location!;
    }

    return this.getSignedUrl(bucketUrl, key, expiresIn);
  }

  async downloadFromBucket(bucketUrl: string, key: string, destinationFilePath: string) {
    const fileWriteStream = createWriteStream(destinationFilePath);
    const stream = await this.getStreamFromBucket(bucketUrl, key);

    await pipeline(stream, fileWriteStream);

    return destinationFilePath;
  }

  async removeFileFromBucket(bucketUrl: string, key: string) {
    const { client, bucket } = this._getClientAndBucket(bucketUrl);

    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    // error TS2339: Property 'send' does not exist on type 'S3Client' otherwise. Brilliant job on the S3 library there ...
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (client as any).send(deleteObjectCommand);
  }

  async getStreamFromBucket(bucketUrl: string, key: string): Promise<Readable> {
    const { client, bucket } = this._getClientAndBucket(bucketUrl);

    const getObjectCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const response = await client.send(getObjectCommand);
    if (!response.Body) {
      throw new Error(`File name "${key}" does not seem to exist in bucket "${bucket}"`);
    }

    if (!(response.Body instanceof Readable)) {
      throw new Error(`Response body is not a readable stream`);
    }

    return response.Body;
  }

  async getSignedUrl(bucketUrl: string, key: string, expiresIn?: number): Promise<string> {
    const { client, bucket } = this._getClientAndBucket(bucketUrl);

    const getObjectCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    return getSignedUrl(client, getObjectCommand, {
      expiresIn,
    });
  }

  // Private
  private _getClientAndBucket(url: string) {
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

    const forcePathStyle = ['localhost', 'minio', '127.0.0.1'].some((host) =>
      domain.includes(host)
    );

    // Not working for some reason. Seems to be a bug in S3Client.
    // Keeping this is, in case in the future I decide to try optimize this part and break everything.
    // const endpoint = `${protocol}://${domain}`;

    const client = new S3Client({
      region,
      endpoint: {
        hostname: domain,
        path: '/',
        protocol: `${protocol}:`,
      },
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle,
    });

    return {
      client,
      bucket,
    };
  }
}

export const uploader = new Uploader();
