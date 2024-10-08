import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { files, users } from "~/server/db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const fileRouter = createTRPCRouter({
	get: publicProcedure.query(async ({ ctx }) => {
		const ssid = cookies().get("sessionId")?.value;

		if (!ssid) {
			return [];
		}

		const user = await ctx.db.query.users.findFirst({
			where: eq(users.sessionId, ssid ?? ""),
		});

		if (!user) {
			throw new Error("User not found");
		}

		return await ctx.db.query.files.findMany({
			where: eq(files.userId, user.id),
		});
	}),
});
