import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { eq } from "drizzle-orm";
import {
	getDefaultUserSettings,
	type UserInsert,
	users,
	type UserSettings,
} from "~/server/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { cookies } from "next/headers";

export const userRouter = createTRPCRouter({
	get: publicProcedure.query(async ({ ctx }) => {
		const ssid = cookies().get("sessionId")?.value;

		// Try to find the user using the sessionId from the ctx cookies
		let user = await ctx.db.query.users.findFirst({
			where: eq(users.sessionId, ssid ?? ""),
		});

		if (!user) {
			// If the user is not found, create a new user
			// Define what the new sessionId should be (the one in the cookies or random numeric)
			let sessionId = ssid ?? Math.floor(Math.random() * 1000000).toString();
			let insertedUsers;
			do {
				insertedUsers = await ctx.db
					.insert(users)
					.values({
						sessionId,
					})
					.returning();

				// Create a new sessionId to use later if the one in the cookies is already in use (which should be impossible)
				sessionId = Math.floor(Math.random() * 1000000).toString();
			} while (insertedUsers.length === 0);

			user = insertedUsers[0];
		}

		if (!user)
			throw new Error(
				"Somehow user wasn't created or found, this should never happen, good luck debugging!",
			);

		// Merge the default settings with the user settings
		const defaultSettings = getDefaultUserSettings();
		const userSettings = user.settings as UserSettings;

		const filteredSettings = {} as UserSettings | Record<string, unknown>;

		for (const key in defaultSettings) {
			const typedKey = key as keyof UserSettings;
			if (typedKey in userSettings) {
				filteredSettings[typedKey] = userSettings[typedKey];
			}
		}

		user.settings = { ...defaultSettings, ...filteredSettings };

		return user;
	}),

	update: publicProcedure
		.input(createInsertSchema(users).omit({ sessionId: true }))
		.mutation(async ({ ctx, input }) => {
			const ssid = cookies().get("sessionId")?.value;

			if (!ssid) {
				throw new Error("No sessionId found in cookies");
			}

			// If the sessionId is not being changed, update the user with the new settings
			const updatedUsers = await ctx.db
				.update(users)
				.set(input as UserInsert)
				.where(eq(users.sessionId, ssid))
				.returning();

			return updatedUsers[0];
		}),

	delay: publicProcedure.query(async ({ ctx }) => {
		await new Promise((resolve) => setTimeout(resolve, 2000));
		return false;
	}),
});
