import * as z from "zod";

const NODE_Type = ["development","production","test"] as const;

const envSchema = z.object({
    PORT: z.string("Port must be a string").nonempty("Port can't be empty"),
    MONGO_URI: z.string("Uri must be a string").nonempty("Uri can't be empty"),
    NODE_ENV: z.enum(NODE_Type,`NODE_ENV must be development,production or test`),
    REFRESH_TOKEN_SECRET: z.string("Secret must be a string").nonempty("Secret can't be empty"),
    ACCESS_TOKEN_SECRET: z.string("Secret must be a string").nonempty("Secret can't be empty"),
    REFRESH_TOKEN_EXPIRED: z.string("Expired Time must be a string").nonempty("Expired Time can't be empty"),
    ACCESS_TOKEN_EXPIRED: z.string("Expired Time must be a string").nonempty("Expired Time can't be empty")
   
})

const result = envSchema.safeParse(process.env);
// Throw error if env missing
if(!result.success) throw new Error(result.error.issues[0].message);
// Get type after safe parse
export const env = result.data;