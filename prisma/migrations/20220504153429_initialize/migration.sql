-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "events" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_by_user_id" TEXT NOT NULL,
    "created_on_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "events_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "event_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "color_hex" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "pits_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "karts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "event_id" INTEGER NOT NULL,
    "status_type" INTEGER NOT NULL,
    "event_no" INTEGER,
    "previous_event_no" INTEGER,
    "classification_type" INTEGER NOT NULL,
    "pit_id" TEXT,
    "pit_order" TEXT,
    "markdown_notes" TEXT,
    "pit_name" TEXT,
    "pit_color_hex" TEXT,
    CONSTRAINT "karts_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
