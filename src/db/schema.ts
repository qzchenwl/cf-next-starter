import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
export * from "./auth-schema";

export const usersTable = sqliteTable("demo", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  foo: text("foo").notNull(),
  bar: text("bar").notNull().unique(),
});
