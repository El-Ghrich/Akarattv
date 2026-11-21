import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

import { relationID, syncUserAuthor } from '../utilities/userAuthor'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ADD COLUMN "name" varchar;
   UPDATE "users"
     SET "name" = CASE
       WHEN btrim(split_part("email", '@', 1)) = '' THEN 'Akarattv'
       ELSE split_part("email", '@', 1)
     END
     WHERE "name" IS NULL OR btrim("name") = '';
   ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;
   ALTER TABLE "users" ADD COLUMN "author_id" integer;
   ALTER TABLE "authors" ADD COLUMN "user_id" integer;
   ALTER TABLE "users" ADD CONSTRAINT "users_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "authors" ADD CONSTRAINT "authors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
   CREATE UNIQUE INDEX "users_author_idx" ON "users" USING btree ("author_id");
   CREATE UNIQUE INDEX "authors_user_idx" ON "authors" USING btree ("user_id");`)

  // Existing users predate the link. Give each one a profile and persist both
  // sides of the relationship using the same helper the live hook uses.
  let page = 1
  while (true) {
    const users = await payload.find({
      collection: 'users',
      depth: 0,
      limit: 100,
      locale: 'all',
      overrideAccess: true,
      page,
      req,
    })

    for (const user of users.docs) {
      await syncUserAuthor({
        req,
        payload,
        userID: user.id,
        name: user.name,
        authorID: relationID(user.author),
      })
    }

    if (page >= users.totalPages) break
    page += 1
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP CONSTRAINT "users_author_id_authors_id_fk";
   
   ALTER TABLE "authors" DROP CONSTRAINT "authors_user_id_users_id_fk";
   
   DROP INDEX "users_author_idx";
   DROP INDEX "authors_user_idx";
   ALTER TABLE "users" DROP COLUMN "name";
   ALTER TABLE "users" DROP COLUMN "author_id";
   ALTER TABLE "authors" DROP COLUMN "user_id";`)
}
