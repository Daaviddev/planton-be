import {
  type ArgumentsHost,
  type ExceptionFilter,
  type HttpStatus,
  Logger,
} from '@nestjs/common';

export default class BaseExceptionFilter implements ExceptionFilter {
  private readonly defaultMessage: string;
  private readonly defaultStatus: HttpStatus;

  constructor(defaultMessage: string, defaultStatus: HttpStatus) {
    this.defaultMessage = defaultMessage;
    this.defaultStatus = defaultStatus;
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    const status: number = exception.getStatus
      ? exception.getStatus()
      : this.defaultStatus;
    const errorMessage = exception?.response?.message || this.defaultMessage;

    // Normalize error message
    let errorMsgStr: string;
    if (Array.isArray(errorMessage)) {
      errorMsgStr = errorMessage.join(', ');
    } else if (typeof errorMessage === 'object' && errorMessage !== null) {
      errorMsgStr = errorMessage.message || JSON.stringify(errorMessage);
    } else if (typeof errorMessage === 'string') {
      errorMsgStr = errorMessage;
    } else {
      errorMsgStr = String(errorMessage);
    }

    let code: string | number = this.defaultMessage.split(':')[0];
    let message: string =
      this.defaultMessage.split(':')[1] || this.defaultMessage;

    // Only split if there is a colon in the errorMsgStr
    if (errorMsgStr.includes(':')) {
      const splittedError = errorMsgStr.split(':');
      if (splittedError.length === 2) {
        [code, message] = splittedError;
      } else if (splittedError.length === 1) {
        message = splittedError[0];
      }
    } else {
      message = errorMsgStr;
    }

    // Ensure code is a number, fallback to 400 if not
    const codeNum = isNaN(Number(code)) ? 400 : parseInt(code as string, 10);

    // Prefer the original validation errors if present
    let details = exception?.response?.error;
    if (
      Array.isArray(exception?.response?.message) &&
      exception?.response?.message.length > 0
    ) {
      details = exception?.response?.message;
    }

    const exceptionResponse = {
      success: false,
      error: {
        code: codeNum,
        message: message?.trim(),
        details,
      },
    };

    Logger.error(exception, this.constructor.name);
    Logger.error(exception.stack, this.constructor.name);

    return res.status(status).json(exceptionResponse);
  }
}
