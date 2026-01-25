import * as z from "zod";

export const LoginUser = z.object({
    email: z.email("Invalid Email").toLowerCase(),
    password: z.string()
               .min(8,"Password at least eight character")
               .max(50,"Password at most fifty character")
               .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/,"Password should include small and big letter and number and one special character")
})

export type LoginUserType = z.infer<typeof LoginUser>;