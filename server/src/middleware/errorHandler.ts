import { ErrorRequestHandler } from "express";
import { responseEnvelope } from "../utilities/responseEnvelope.js";
import { logger } from "../utilities/logger.js";

export const errorHandler: ErrorRequestHandler = (err,_,res,__) => {
     const statusCode = err.statusCode || 500;
     // Prevent message leak
     const message = statusCode===500?"Server Error":err.message;
     logger.error(err.message);
     res.status(statusCode).json(responseEnvelope("error",{ error: { 
            status: statusCode,
            detail: message
      }}));
}