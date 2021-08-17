import { MigrationBuilder, ColumnDefinitions } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("karts", {
        id: { type: "uuid", notNull: true, unique: true, primaryKey: true },
        event_id: { type: "int", notNull: true },
        status_type_id: { type: "int", notNull: true },
        event_no: { type: "int" },
        previous_event_no: { type: "int" },
        classification_type_id: { type: "int" },
        pit_id: { type: "uuid" },
        pit_order: { type: "numeric(3,1)" },
        markdown_notes: { type: "text" }
    });

    pgm.addConstraint(
        "karts",
        "fk_karts_pits",
        "FOREIGN KEY (pit_id) REFERENCES pits(id) ON DELETE CASCADE"
    );

    pgm.addConstraint(
        "karts",
        "fk_karts_events",
        "FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE"
    );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("karts", { cascade: true });
}
