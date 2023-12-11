export interface ResponseInterface<TData = unknown, TMeta = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  data?: TData;
  meta?: TMeta;
}
