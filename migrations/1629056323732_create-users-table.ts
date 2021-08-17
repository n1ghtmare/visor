import { MigrationBuilder, ColumnDefinitions } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("users", {
        id: "id",
        username: { type: "string", notNull: true, unique: true },
        password: { type: "string", notNull: true },
        display_name: { type: "string", notNull: true }
    });

    // Insert default admin account
    pgm.sql(
        `INSERT INTO users (
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
        ) ON CONFLICT(id) DO NOTHING`
    );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("users", { cascade: true });
}
