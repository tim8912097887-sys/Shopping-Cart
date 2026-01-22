import { RequestHandler } from "express"

type Controller = RequestHandler;

export const asyncHandler = (controller: Controller): Controller => (async(req,res,next) => {
    // Resolve the value or catch the error and pass to error handler  
    Promise.resolve(controller(req,res,next)).catch(next);
})