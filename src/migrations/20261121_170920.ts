import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ADD COLUMN "roles" "enum_users_roles" DEFAULT 'editor' NOT NULL;
   -- Preserve the effective role before the old many-values table is dropped.
   -- Admin wins when a user had both values; everything else stays editor.
   UPDATE "users" SET "roles" = 'admin'
   WHERE EXISTS (
     SELECT 1 FROM "users_roles"
     WHERE "users_roles"."parent_id" = "users"."id"
       AND "users_roles"."value" = 'admin'
   );
   DROP TABLE "users_roles" CASCADE;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "users_roles" (
   	"order" integer NOT NULL,
   	"parent_id" integer NOT NULL,
   	"value" "enum_users_roles",
   	"id" serial PRIMARY KEY NOT NULL
   );
   
   ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
   CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
   CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
   INSERT INTO "users_roles" ("order", "parent_id", "value")
   SELECT 0, "id", "roles" FROM "users";
   ALTER TABLE "users" DROP COLUMN "roles";`)
}
