import { MigrationBuilder, ColumnDefinitions } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("pits", {
        id: { type: "uuid", notNull: true, unique: true, primaryKey: true },
        event_id: { type: "int", notNull: true },
        name: { type: "text", notNull: true },
        color_hex: { type: "text" },
        description: { type: "text" }
    });

    pgm.addConstraint(
        "pits",
        "fk_pits_events",
        "FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE"
    );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("pits", { cascade: true });
}
