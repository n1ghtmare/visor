/*
  Warnings:

  - You are about to alter the column `pit_order` on the `karts` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_karts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "event_id" INTEGER NOT NULL,
    "status_type" INTEGER NOT NULL,
    "event_no" INTEGER,
    "previous_event_no" INTEGER,
    "classification_type" INTEGER NOT NULL,
    "pit_id" TEXT,
    "pit_order" REAL,
    "markdown_notes" TEXT,
    "pit_name" TEXT,
    "pit_color_hex" TEXT,
    CONSTRAINT "karts_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_karts" ("classification_type", "event_id", "event_no", "id", "markdown_notes", "pit_color_hex", "pit_id", "pit_name", "pit_order", "previous_event_no", "status_type") SELECT "classification_type", "event_id", "event_no", "id", "markdown_notes", "pit_color_hex", "pit_id", "pit_name", "pit_order", "previous_event_no", "status_type" FROM "karts";
DROP TABLE "karts";
ALTER TABLE "new_karts" RENAME TO "karts";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
