import { createReadStream } from 'fs';

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

    const getObjectCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    if (isPublic) {
      return uploadResponse.Location!;
    }

    return getSignedUrl(client, getObjectCommand, {
      expiresIn,
    });
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
