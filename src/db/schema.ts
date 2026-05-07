import {
    pgTable,
    uuid,
    text,
    varchar,
    timestamp,
    integer,
    numeric,
    index,
    uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

export const exercises = pgTable(
    'exercises',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        name: varchar('name', { length: 100 }).notNull(),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
        updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().default(sql`now()`),
    },
    (t) => [
        uniqueIndex('exercises_name_idx').on(t.name),
    ],
);

export const workouts = pgTable(
    'workouts',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        userId: text('user_id').notNull(),
        name: varchar('name', { length: 100 }),
        startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
        completedAt: timestamp('completed_at', { withTimezone: true }),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
        updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().default(sql`now()`),
    },
    (t) => [
        index('workouts_user_id_started_at_idx').on(t.userId, t.startedAt),
    ],
);

export const workoutExercises = pgTable(
    'workout_exercises',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        workoutId: uuid('workout_id').notNull().references(() => workouts.id, { onDelete: 'cascade' }),
        exerciseId: uuid('exercise_id').notNull().references(() => exercises.id, { onDelete: 'restrict' }),
        orderIndex: integer('order_index').notNull().default(0),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
    },
    (t) => [
        index('workout_exercises_workout_id_idx').on(t.workoutId),
        index('workout_exercises_exercise_id_idx').on(t.exerciseId),
    ],
);

export const sets = pgTable(
    'sets',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        workoutExerciseId: uuid('workout_exercise_id').notNull().references(() => workoutExercises.id, { onDelete: 'cascade' }),
        setNumber: integer('set_number').notNull(),
        reps: integer('reps'),
        weightKg: numeric('weight_kg', { precision: 6, scale: 2 }),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
    },
    (t) => [
        index('sets_workout_exercise_id_idx').on(t.workoutExerciseId),
    ],
);

export const exercisesRelations = relations(exercises, ({ many }) => ({
    workoutExercises: many(workoutExercises),
}));

export const workoutsRelations = relations(workouts, ({ many }) => ({
    workoutExercises: many(workoutExercises),
}));

export const workoutExercisesRelations = relations(workoutExercises, ({ one, many }) => ({
    workout: one(workouts, {
        fields: [workoutExercises.workoutId],
        references: [workouts.id],
    }),
    exercise: one(exercises, {
        fields: [workoutExercises.exerciseId],
        references: [exercises.id],
    }),
    sets: many(sets),
}));

export const setsRelations = relations(sets, ({ one }) => ({
    workoutExercise: one(workoutExercises, {
        fields: [sets.workoutExerciseId],
        references: [workoutExercises.id],
    }),
}));
