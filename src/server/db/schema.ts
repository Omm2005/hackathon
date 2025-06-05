import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator, primaryKey, uuid, varchar, text, timestamp, json, integer } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

// Table creator
export const createTable = pgTableCreator((name) => `${name}`);

// USERS
export const users = createTable("user", (d) => ({
  id: d.varchar({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull(),
  emailVerified: d.timestamp({ mode: "date", withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  image: d.varchar({ length: 255 }),
}));

// WORKFLOWS (Projects)
export const workflows = createTable(
  "workflow",
  (d) => ({
    // Using UUID instead of sequential ID
    id: d.uuid().defaultRandom().primaryKey(),
    userId: d.varchar({ length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
    name: d.varchar({ length: 256 }),
    description: d.text(),
    createdAt: d.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("workflow_user_id_idx").on(t.userId),
    index("workflow_name_idx").on(t.name),
  ],
);

// NODES
export const nodes = createTable(
  "node",
  (d) => ({
    // Using UUID instead of sequential ID
    id: d.uuid().defaultRandom().primaryKey(),
    workflowId: d.uuid().notNull().references(() => workflows.id, { onDelete: "cascade" }),
    name: d.varchar({ length: 256 }),
    type: d.varchar({ length: 50 }).notNull(),
    position: d.json().$type<{ x: number; y: number }>().notNull(),
    query: d.varchar({ length: 256 }),
    sumaary: d.text(),
    sources: d.json().$type<Array<{
      url: string;
      name: string;
      icon?: string;
    }>>(),
    images: d.json().$type<Array<{
      url: string;
      description?: string;
    }>>(),
    createdAt: d.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("node_workflow_id_idx").on(t.workflowId),
  ],
);

// EDGES
export const edges = createTable(
  "edge",
  (d) => ({
    // Using UUID instead of sequential ID
    id: d.uuid().defaultRandom().primaryKey(),
    workflowId: d.uuid().notNull().references(() => workflows.id, { onDelete: "cascade" }),
    source: d.uuid().notNull().references(() => nodes.id, { onDelete: "cascade" }),
    target: d.uuid().notNull().references(() => nodes.id, { onDelete: "cascade" }),
    type: d.varchar({ length: 50 }),
    data: d.json().$type<{
      [key: string]: any; // Allow additional custom data
    }>(),
    createdAt: d.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("edge_workflow_id_idx").on(t.workflowId),
    index("edge_source_idx").on(t.source),
    index("edge_target_idx").on(t.target),
  ],
);

// RELATIONS
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  workflows: many(workflows),
}));

export const workflowsRelations = relations(workflows, ({ one, many }) => ({
  user: one(users, { fields: [workflows.userId], references: [users.id] }),
  nodes: many(nodes),
  edges: many(edges),
}));

export const nodesRelations = relations(nodes, ({ one, many }) => ({
  workflow: one(workflows, { fields: [nodes.workflowId], references: [workflows.id] }),
  sourceEdges: many(edges, { relationName: "sourceNode" }),
  targetEdges: many(edges, { relationName: "targetNode" }),
}));

export const edgesRelations = relations(edges, ({ one }) => ({
  workflow: one(workflows, { fields: [edges.workflowId], references: [workflows.id] }),
  sourceNode: one(nodes, { fields: [edges.source], references: [nodes.id], relationName: "sourceNode" }),
  targetNode: one(nodes, { fields: [edges.target], references: [nodes.id], relationName: "targetNode" }),
}));

// ACCOUNTS
export const accounts = createTable(
  "account",
  (d) => ({
    userId: d.varchar({ length: 255 }).notNull().references(() => users.id),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

// SESSIONS
export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d.varchar({ length: 255 }).notNull().references(() => users.id),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [index("session_user_id_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

// VERIFICATION TOKENS
export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);