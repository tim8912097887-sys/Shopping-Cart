import express from "express";
import { loginController, logoutController, refreshController, signupController } from "../controller/auth.controller.js";
import { userSchemaValidator } from "../utilities/schemaValidator.js";
import { CreateUser } from "../schema/creatUser.schema.js";
import { LoginUser } from "../schema/loginUser.schema.js";

const router = express.Router();

router.post("/signup",userSchemaValidator(CreateUser),signupController);
router.post("/login",userSchemaValidator(LoginUser),loginController);
router.delete("/logout",logoutController);
router.get("/refresh",refreshController);

export default router;