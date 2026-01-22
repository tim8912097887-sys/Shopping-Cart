export enum ErrorType {
   BAD_REQUEST = 'BadRequest',
   NOT_FOUND = 'NotFound',
   UNAUTHORIZED = 'Unauthorized',
   FORBIDDEN = 'Forbidden',
   SERVER_ERROR = 'ServerError',
   SERVER_CONFLICT = 'ServerConflict'
}

export enum ErrorCode {
   BAD_REQUEST = 400,
   NOT_FOUND = 404,
   UNAUTHORIZED = 401,
   FORBIDDEN = 403,
   SERVER_ERROR = 500,
   SERVER_CONFLICT = 409
}

export class ApiError extends Error {
    protected type: ErrorType;
    protected statusCode:  ErrorCode;
    protected isOperational: boolean;
    constructor(type: ErrorType,statusCode: ErrorCode,message: string,isOperational: boolean) {
        super(message);
        this.type = type;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        // Retain the property and instance name of the ApiError
        Object.setPrototypeOf(this, new.target.prototype);
    }

}