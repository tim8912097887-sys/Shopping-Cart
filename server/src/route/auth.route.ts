import express from "express";
import { loginController, logoutController, refreshController, signupController } from "../controller/auth.controller.js";
import { userSchemaValidator } from "../utilities/schemaValidator.js";
import { CreateUser } from "../schema/creatUser.schema.js";
import { LoginUser } from "../schema/loginUser.schema.js";
import { loginRateLimit } from "../middleware/loginRateLimit.js";

const router = express.Router();

/**
 * @swagger
 * /auth/signup:
 *  post:
 *   summary: Create a User
 *   description: Signup a User with provided Info
 *   requestBody:
 *    description: Info about the User
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        username:
 *         type: string
 *         example: "lbj"
 *        email:
 *         type: string
 *         example: "lbj@email.com"
 *        password:
 *         type: string
 *         format: password
 *         example: "Lbj1234?"
 *        confirmPassword:
 *         type: string
 *         format: password
 *         example: "Lbj1234?"
 *   responses:
 *    201:
 *     description: Successfully Create a User
 *     # Response Body
 *     content:
 *      # Media Type
 *      application/json:
 *       schema:
 *        $ref: "#/components/responses/SuccessCreateResponse"
 *       
 */
router.post("/signup",userSchemaValidator(CreateUser),signupController);
router.post("/login",loginRateLimit,userSchemaValidator(LoginUser),loginController);
router.delete("/logout",logoutController);
router.get("/refresh",refreshController);

export default router;