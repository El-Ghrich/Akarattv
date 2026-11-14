import pg from 'pg'

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

await client.connect()
const tables = await client.query(
  "select tablename from pg_tables where schemaname = 'public' order by tablename",
)
console.log('tables', tables.rows.map((r) => r.tablename))

const types = await client.query(
  "select typname from pg_type where typtype = 'e' and typnamespace = 'public'::regnamespace order by typname",
)
console.log('enums', types.rows.map((r) => r.typname))

await client.end()
