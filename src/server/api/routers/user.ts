import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { eq } from "drizzle-orm";
import { getDefaultUserSettings, users, UserSettings } from "~/server/db/schema";
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
		const userSettings = user.settings;

		// Filter user settings to only include keys that exist in the default settings
		user.settings = Object.keys(defaultSettings).reduce((acc, key) => {
			const typedKey = key as keyof UserSettings;

			if (typedKey in userSettings) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				acc[typedKey] = userSettings[typedKey];
			}

			return acc;
		}, {} as UserSettings);

		return user;
	}),

	update: publicProcedure.input(createInsertSchema(users)).mutation(async ({ ctx, input }) => {
		const ssid = cookies().get("sessionId")?.value;

		if (!ssid) {
			throw new Error("No sessionId found in cookies");
		}

		/**
		 * We need to handle two cases here,
		 * - user is changing settings (sessionId is not changed)
		 * - user is changing sessionId
		 *
		 * if the user is changing the sessionId, we ignore any settings that changed, instead
		 * we keep the existing sessionId 'object' intact and just find the user with the new sessionId
		 * and return it as is, if we fail to find the user with the new sessionId, we create a new user
		 * with the new sessionId and return it (default settings).
		 */

		// Check if the sessionId is being changed
		if (input.sessionId !== ssid) {
			// Find the user with the new sessionId
			let user = await ctx.db.query.users.findFirst({
				where: eq(users.sessionId, input.sessionId),
			});

			// If the user is not found, create a new user
			if (!user) {
				const insertedUsers = await ctx.db
					.insert(users)
					.values({
						sessionId: input.sessionId,
					})
					.returning();

				user = insertedUsers[0];
			}

			return user;
		}

		// If the sessionId is not being changed, update the user with the new settings
		const updatedUsers = await ctx.db
			.update(users)
			.set(input as never)
			.where(eq(users.sessionId, ssid))
			.returning();

		return updatedUsers[0];
	}),
});