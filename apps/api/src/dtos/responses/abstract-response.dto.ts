import { ResponseInterface } from '@moaitime/shared-common';

export abstract class AbstractResponseDto<TData = unknown, TMeta = unknown>
  implements ResponseInterface
{
  success!: boolean;
  message?: string;
  error?: string;
  data?: TData;
  meta?: TMeta;
}
