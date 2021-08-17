import { MigrationBuilder, ColumnDefinitions } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("events", {
        id: "id",
        name: { type: "string", notNull: true },
        created_by_user_id: { type: "int", notNull: true },
        created_on_date: { type: "timestamp", notNull: true }
    });

    pgm.addConstraint(
        "events",
        "fk_events_users",
        "FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE CASCADE"
    );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("events", { cascade: true });
}
