import * as z from "zod";

const envSchema = z.object({
    PORT: z.string("Port must be a string").nonempty("Port can't be empty")
})

const result = envSchema.safeParse(process.env);
// Throw error if env missing
if(!result.success) throw new Error(result.error.issues[0].message);
// Get type after safe parse
export const env = result.data;