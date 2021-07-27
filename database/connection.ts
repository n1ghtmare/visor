import sqlite3, { Database } from "sqlite3";
import { open } from "sqlite";

// TODO: Add events and users table, where the events will be owned by a user_id
const CREATE_USERS_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        display_name TEXT NOT NULL
    )
`;

// NOTE: Dates are stored in ISO8601 format in UTC
const CREATE_EVENTS_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_by_user_id INTEGER NOT NULL,
        created_on_date TEXT NOT NULL,
        FOREIGN KEY (created_by_user_id) REFERENCES users(id)
    )
`;

const CREATE_PITS_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS pits (
        id TEXT PRIMARY KEY NOT NULL,
        event_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        color_hex TEXT,
        description TEXT,
        FOREIGN KEY (event_id) REFERENCES events(id)
    )
`;

// -> Status will be an enum with the following elements -> Idle, Racing, Pit
const CREATE_KARTS_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS karts (
        id TEXT PRIMARY KEY NOT NULL,
        event_id INTEGER NOT NULL,
        status_type_id INTEGER NOT NULL,
        event_no INTEGER,
        previous_event_no INTEGER,
        classification_type_id INTEGER,
        pit_id TEXT,
        markdown_notes TEXT,
        FOREIGN KEY(pit_id) REFERENCES pits(id),
        FOREIGN KEY(event_id) REFERENCES events(id)
    )
`;

export default async function openConnection() {
    return open({
        filename: "./database/visor.db",
        driver: sqlite3.Database
    }).then(async (db) => {
        await db.run("PRAGMA foreign_keys = ON");

        // create tables if missing
        await db.run(CREATE_USERS_TABLE_SQL);
        await db.run(CREATE_EVENTS_TABLE_SQL);
        await db.run(CREATE_PITS_TABLE_SQL);
        await db.run(CREATE_KARTS_TABLE_SQL);

        // Run this the first time only (we should provide a mechanism to register new users at a later stage)
        await db.run(
            `INSERT OR IGNORE INTO users (
                id,
                username,
                password,
                display_name
            )
            VALUES (
                1,
                'admin',
                '$2a$12$6w09Cc7qFJPykqtHYdQ1qeuZPxJdvYCWRHYE.joJWCdg/WdErWSP2',
                'Administrator'
            )`
        );

        return db;
    });
}
