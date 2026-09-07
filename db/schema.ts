import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const waitlistSignups = sqliteTable(
  "waitlist_signups",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull().unique(),
    websiteUrl: text("website_url"),
    framework: text("framework"),
    agentGoal: text("agent_goal"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
);

export const designPartnerApplications = sqliteTable(
  "design_partner_applications",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    websiteUrl: text("website_url").notNull(),
    company: text("company").notNull(),
    framework: text("framework").notNull(),
    agentGoal: text("agent_goal").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
);

export const founderConversations = sqliteTable(
  "founder_conversations",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    company: text("company").notNull(),
    topic: text("topic").notNull(),
    investmentRange: text("investment_range"),
    email: text("email").notNull(),
    preferredTime: text("preferred_time").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
);
