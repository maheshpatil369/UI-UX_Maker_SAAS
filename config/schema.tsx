import { integer, pgTable, varchar, json, date, text, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer().default(5),
});


export const projectsTable = pgTable("project",  {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  projectId: varchar({ length: 255 }).notNull().unique(),
  projectName: varchar(),
  theme: varchar(),
  userInput: varchar(),
  device: varchar(),
  createdOn: date().defaultNow(),
  previewImage: text(), 
  isGenerated: integer().default(0), 
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
  config: json(),
  userId: varchar().references(() => usersTable.email).notNull(),
})

export const ScreenConfigTable = pgTable("screenconfig", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  projectId: varchar().notNull().references(() => projectsTable.projectId),
  screenId: varchar().notNull(),
  screenName: varchar().notNull(),
  purpose: varchar().default(""),
  screenDescription: varchar().default(""),
  code: text().default(""),
  createdAt: timestamp().defaultNow(),

});
