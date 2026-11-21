import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Idempotent: a previous deploy may have failed after this column was added.
  await db.execute(sql`
    ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "roles" "enum_users_roles" DEFAULT 'editor' NOT NULL;
  `)

  // Normalise the old many-values table before dropping it. The DO block
  // tolerates a database where the table was already removed by a partial run.
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'users_roles'
      ) THEN
        UPDATE "users" SET "roles" = 'admin'
        WHERE EXISTS (
          SELECT 1 FROM "users_roles"
          WHERE "users_roles"."parent_id" = "users"."id"
            AND "users_roles"."value" = 'admin'
        );
        DROP TABLE "users_roles" CASCADE;
      END IF;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "users_roles" (
    	"order" integer NOT NULL,
    	"parent_id" integer NOT NULL,
    	"value" "enum_users_roles",
    	"id" serial PRIMARY KEY NOT NULL
    );

    ALTER TABLE "users_roles" DROP CONSTRAINT IF EXISTS "users_roles_parent_fk";
    ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
    DROP INDEX IF EXISTS "users_roles_order_idx";
    DROP INDEX IF EXISTS "users_roles_parent_idx";
    CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
    CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
    INSERT INTO "users_roles" ("order", "parent_id", "value")
    SELECT 0, "id", "roles" FROM "users";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "roles";`)
}
