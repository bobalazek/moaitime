import { ErrorResponseInterface } from '@myzenbuddy/shared-common';

export class ErrorResponse extends Error {
  private _response: ErrorResponseInterface;

  constructor(public response: ErrorResponseInterface) {
    super(response.error);

    this._response = response;
  }

  getResponse(): ErrorResponseInterface {
    return this._response;
  }
}
