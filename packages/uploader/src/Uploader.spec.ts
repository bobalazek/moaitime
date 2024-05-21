/// <reference types="vitest" />

import { S3Client } from '@aws-sdk/client-s3';

import { uploader } from './Uploader';

vitest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: vitest.fn().mockImplementation(() => {
      return {
        send: vitest.fn().mockResolvedValue({}),
      };
    }),
  };
});

describe('S3Client.ts', () => {
  describe('getS3ClientAndBucket()', () => {
    beforeEach(() => {
      vitest.clearAllMocks();
    });

    it('should work correctly for local bucket URL', async () => {
      const result = uploader.getClientAndBucket('http://localhost:9000/bucket');

      expect(S3Client).toHaveBeenCalledWith({
        region: 'us-east-1',
        endpoint: 'http://localhost:9000',
        credentials: {
          accessKeyId: '',
          secretAccessKey: '',
        },
        forcePathStyle: true,
      });

      expect(result).toEqual({
        client: expect.objectContaining({
          send: expect.any(Function),
        }),
        bucket: 'bucket',
      });
    });

    it('should set forcePathStyle to false for non-local URL', async () => {
      const result = uploader.getClientAndBucket('https://s3.amazonaws.com/bucket');

      expect(S3Client).toHaveBeenCalledWith({
        region: 'us-east-1',
        endpoint: 'https://s3.amazonaws.com',
        credentials: {
          accessKeyId: '',
          secretAccessKey: '',
        },
        forcePathStyle: false,
      });

      expect(result).toEqual({
        client: expect.objectContaining({
          send: expect.any(Function),
        }),
        bucket: 'bucket',
      });
    });

    it('should use the specified region from URL parameters', async () => {
      const result = uploader.getClientAndBucket(
        'https://s3.amazonaws.com/bucket?region=us-west-2'
      );

      expect(S3Client).toHaveBeenCalledWith({
        region: 'us-west-2',
        endpoint: 'https://s3.amazonaws.com',
        credentials: {
          accessKeyId: '',
          secretAccessKey: '',
        },
        forcePathStyle: false,
      });

      expect(result).toEqual({
        client: expect.objectContaining({
          send: expect.any(Function),
        }),
        bucket: 'bucket',
      });
    });

    it('should handle username and password in URL', async () => {
      const result = uploader.getClientAndBucket('http://username:password@localhost:9000/bucket2');

      expect(S3Client).toHaveBeenCalledWith({
        region: 'us-east-1',
        endpoint: 'http://localhost:9000',
        credentials: {
          accessKeyId: 'username',
          secretAccessKey: 'password',
        },
        forcePathStyle: true,
      });

      expect(result).toEqual({
        client: expect.objectContaining({
          send: expect.any(Function),
        }),
        bucket: 'bucket2',
      });
    });

    it('should handle different bucket names and regions', async () => {
      const result = uploader.getClientAndBucket(
        'https://s3.amazonaws.com/another-bucket?region=eu-central-1'
      );

      expect(S3Client).toHaveBeenCalledWith({
        region: 'eu-central-1',
        endpoint: 'https://s3.amazonaws.com',
        credentials: {
          accessKeyId: '',
          secretAccessKey: '',
        },
        forcePathStyle: false,
      });

      expect(result).toEqual({
        client: expect.objectContaining({
          send: expect.any(Function),
        }),
        bucket: 'another-bucket',
      });
    });

    it('should handle URLs with no username and password', async () => {
      const result = uploader.getClientAndBucket('https://s3.amazonaws.com/test-bucket');

      expect(S3Client).toHaveBeenCalledWith({
        region: 'us-east-1',
        endpoint: 'https://s3.amazonaws.com',
        credentials: {
          accessKeyId: '',
          secretAccessKey: '',
        },
        forcePathStyle: false,
      });

      expect(result).toEqual({
        client: expect.objectContaining({
          send: expect.any(Function),
        }),
        bucket: 'test-bucket',
      });
    });
  });
});
