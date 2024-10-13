import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const sanityRouter = createTRPCRouter({
	hello: publicProcedure.query(async () => {
		return "world";
	}),
});
