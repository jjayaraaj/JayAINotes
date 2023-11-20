import { Clerk } from "@clerk/nextjs/server";

const clerk = Clerk({
    apiKey: process.env.CLERK_SECRET_KEY
})

export {clerk}