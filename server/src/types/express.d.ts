import { CreateUserType } from "../schema/creatUser.schema.ts";
import { LoginUserType } from "../schema/loginUser.schema.ts";

declare global {
  namespace Express {
    interface Request {
        user?: CreateUserType | LoginUserType
    }
  }
}