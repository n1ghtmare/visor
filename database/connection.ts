import sqlite3, { Database } from "sqlite3";
import { open } from "sqlite";

// TODO: Add races and users table, where the races will be owned by a user_id
const CREATE_USERS_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        display_name TEXT NOT NULL
    )
`;

// NOTE: Dates are stored in ISO8601 format in UTC
const CREATE_RACES_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS races (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_by_user_id INTEGER NOT NULL,
        created_on_date TEXT NOT NULL,
        FOREIGN KEY (created_by_user_id) REFERENCES users(id)
    )
`;

const CREATE_BOXES_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS boxes (
        id TEXT PRIMARY KEY NOT NULL,
        race_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        color_hex TEXT,
        description TEXT,
        FOREIGN KEY (race_id) REFERENCES races(id)
    )
`;

// -> Status will be an enum with the following elements -> Idle, Racing, Box
const CREATE_KARTS_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS karts (
        id TEXT PRIMARY KEY NOT NULL,
        race_id INTEGER NOT NULL,
        status_type_id TEXT NOT NULL,
        race_no INTEGER,
        previous_race_no INTEGER,
        classification_type_id INTEGER,
        box_id TEXT,
        markdown_notes TEXT,
        FOREIGN KEY(box_id) REFERENCES boxes(id),
        FOREIGN KEY(race_id) REFERENCES races(id)
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
        await db.run(CREATE_RACES_TABLE_SQL);
        await db.run(CREATE_BOXES_TABLE_SQL);
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
                'test_username',
                '$2y$12$A/nKPxRAgjWFmE4Rj0TFwuD6/4NwVrHjFeueLJp4slkowrcmy.GF6',
                'test_display_name'
            )`
        );

        return db;
    });
}

//const db = open({ filename: "./database/visor.db", driver: sqlite3.Database }).then(async (db) => {
//    await db.run("PRAGMA foreign_keys = ON");
//
//    // create tables if missing
//    await db.run(CREATE_USERS_TABLE_SQL);
//    await db.run(CREATE_RACES_TABLE_SQL);
//    await db.run(CREATE_BOXES_TABLE_SQL);
//    await db.run(CREATE_KARTS_TABLE_SQL);
//
//    // Run this the first time only (we should provide a mechanism to register new users at a later stage)
//    await db.run(
//        `INSERT OR IGNORE INTO users (
//            id,
//            username,
//            password,
//            display_name
//        )
//        VALUES (
//            1,
//            'test_username',
//            '$2y$12$A/nKPxRAgjWFmE4Rj0TFwuD6/4NwVrHjFeueLJp4slkowrcmy.GF6',
//            'test_display_name'
//        )`
//    );
//    return db;
//});
//
//export default db;

//const db = new sqlite3.Database("./database/visor.db", (error: Error) => {
//    if (error) {
//        // TODO: Find a way to propery log the database errors in a file or other type of storage?
//        console.log(error);
//        throw error;
//    }
//});
//
//db.serialize(() => {
//    // enfore foreign key constraints
//    db.run("PRAGMA foreign_keys = ON");
//
//    // create tables if missing
//    db.run(CREATE_USERS_TABLE_SQL);
//    db.run(CREATE_RACES_TABLE_SQL);
//    db.run(CREATE_BOXES_TABLE_SQL);
//    db.run(CREATE_KARTS_TABLE_SQL);
//
//    // Run this the first time only (we should provide a mechanism to register new users at a later stage)
//    db.run(
//        `INSERT OR IGNORE INTO users (
//            id,
//            username,
//            password,
//            display_name
//        )
//        VALUES (
//            1,
//            'test_username',
//            '$2y$12$A/nKPxRAgjWFmE4Rj0TFwuD6/4NwVrHjFeueLJp4slkowrcmy.GF6',
//            'test_display_name'
//        )`
//    );
//});
//
//export default db;
