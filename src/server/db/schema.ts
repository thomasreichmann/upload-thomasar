// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { type InferInsertModel, type InferSelectModel, sql } from "drizzle-orm";
import { index, integer, jsonb, pgTableCreator, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `upload-t3-2_${name}`);

export const users = createTable(
	"user",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		sessionId: varchar("session_id", { length: 256 }).unique().notNull(),
		extraField: varchar("extra_field", { length: 256 }),
		createdAt: timestamp("created_at", { withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
		settings: jsonb("settings")
			.$type<Partial<UserSettings>>()
			.default(getDefaultUserSettings())
			.notNull(),
	},
	(example) => ({
		sessionIdIndex: index("sessionId_idx").on(example.sessionId),
	}),
);

export const files = createTable("file", {
	id: uuid("id").defaultRandom().primaryKey(),
	fileName: varchar("name", { length: 256 }).notNull(),
	key: varchar("key", { length: 256 }).notNull(),
	location: varchar("location", { length: 256 }).notNull(),
	uploadId: varchar("upload_id", { length: 256 }).notNull(),
	size: integer("size").notNull(),
	type: varchar("type", { length: 256 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
	userId: uuid("user_id").references(() => users.id),
});

export type UserSettings = ReturnType<typeof getDefaultUserSettings>;

/** Get the default settings for a user
 * 	This is used as the source of truth for what settings the user should have
 * 	anything that is added/removed from here will be shown/hidden in the settings modal
 * 	but settings will only be added to the user after they are saved in the settings modal
 * */
export function getDefaultUserSettings() {
	return {
		autoOpen: false,
		delay: 1000,
		autoOpenInfo: false,
	};
}

export type User = InferSelectModel<typeof users>;
export type UserInsert = InferInsertModel<typeof users>;
