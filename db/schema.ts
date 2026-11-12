import {sqliteTable,text} from 'drizzle-orm/sqlite-core';
export const projects=sqliteTable('projects',{owner:text('owner').primaryKey(),data:text('data').notNull(),updatedAt:text('updated_at').notNull()});
export const modelJobs=sqliteTable('model_jobs',{id:text('id').primaryKey(),owner:text('owner').notNull(),itemId:text('item_id').notNull(),taskId:text('task_id'),endpoint:text('endpoint').notNull(),status:text('status').notNull(),data:text('data').notNull(),createdAt:text('created_at').notNull()});
