import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

import { slugify } from '../utilities/slugify'

type UserRow = {
  author_id: number | null
  id: number
  name: string
}

type IDRow = { id: number }

/**
 * This migration must stay independent of the Payload ORM.
 *
 * The collection configs are read from the *current* codebase, so a
 * `payload.find({ collection: 'users' })` would select every column the current
 * Users config declares — including `roles`, which is only added by the later
 * `20261121_170920` migration. That makes the backfill fail while this
 * migration is still running on an older database. Plain SQL avoids the
 * chicken-and-egg problem entirely.
 */
const authorSlugExists = async (
  db: MigrateUpArgs['db'],
  slug: string,
): Promise<boolean> => {
  const result = await db.execute(sql`
    SELECT 1 FROM "authors" WHERE "slug" = ${slug} LIMIT 1
  `)

  return result.rows.length > 0
}

const uniqueAuthorSlug = async (db: MigrateUpArgs['db'], name: string): Promise<string> => {
  const base = slugify(name) || 'author'
  let candidate = base
  let suffix = 2

  while (await authorSlugExists(db, candidate)) {
    candidate = `${base}-${suffix}`
    suffix += 1
  }

  return candidate
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Idempotent so a deploy that failed mid-migration can be retried safely.
  await db.execute(sql`
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "name" varchar;
    UPDATE "users"
      SET "name" = CASE
        WHEN btrim(split_part("email", '@', 1)) = '' THEN 'Akarattv'
        ELSE split_part("email", '@', 1)
      END
      WHERE "name" IS NULL OR btrim("name") = '';
    ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "author_id" integer;
    ALTER TABLE "authors" ADD COLUMN IF NOT EXISTS "user_id" integer;
    ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_author_id_authors_id_fk";
    ALTER TABLE "users" ADD CONSTRAINT "users_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "authors" DROP CONSTRAINT IF EXISTS "authors_user_id_users_id_fk";
    ALTER TABLE "authors" ADD CONSTRAINT "authors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
    DROP INDEX IF EXISTS "users_author_idx";
    CREATE UNIQUE INDEX "users_author_idx" ON "users" USING btree ("author_id");
    DROP INDEX IF EXISTS "authors_user_idx";
    CREATE UNIQUE INDEX "authors_user_idx" ON "authors" USING btree ("user_id");`)

  // One public author profile per user, mirroring `syncUserAuthor` without
  // issuing any ORM operation against `users`.
  const users = await db.execute(sql`
    SELECT "id", "name", "author_id" FROM "users" ORDER BY "id" ASC
  `)

  for (const row of users.rows as unknown as UserRow[]) {
    const name = String(row.name ?? '').trim() || 'Akarattv'
    const userID = row.id
    let authorID = row.author_id ?? null

    if (authorID === null) {
      const linked = await db.execute(sql`
        SELECT "id" FROM "authors" WHERE "user_id" = ${userID} LIMIT 1
      `)

      authorID = (linked.rows[0] as unknown as IDRow | undefined)?.id ?? null
    }

    if (authorID === null) {
      const slug = await uniqueAuthorSlug(db, name)
      const inserted = await db.execute(sql`
        INSERT INTO "authors" ("slug", "created_at", "updated_at")
        VALUES (${slug}, now(), now())
        RETURNING "id"
      `)

      authorID = (inserted.rows[0] as unknown as IDRow).id

      await db.execute(sql`
        INSERT INTO "authors_locales" ("name", "_locale", "_parent_id")
        VALUES (${name}, 'ar'::"_locales", ${authorID}),
               (${name}, 'fr'::"_locales", ${authorID})
      `)
    } else {
      await db.execute(sql`
        UPDATE "authors_locales" SET "name" = ${name} WHERE "_parent_id" = ${authorID}
      `)
    }

    await db.execute(sql`
      UPDATE "users" SET "author_id" = ${authorID} WHERE "id" = ${userID}
    `)
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_author_id_authors_id_fk";
    ALTER TABLE "authors" DROP CONSTRAINT IF EXISTS "authors_user_id_users_id_fk";
    DROP INDEX IF EXISTS "users_author_idx";
    DROP INDEX IF EXISTS "authors_user_idx";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "name";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "author_id";
    ALTER TABLE "authors" DROP COLUMN IF EXISTS "user_id";`)
}
