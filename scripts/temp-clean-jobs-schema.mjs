import pg from 'pg'

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

await client.connect()

const jobs = await client.query(
  "select tablename from pg_tables where schemaname = 'public' and tablename like 'payload_jobs%' order by tablename",
)
console.log('job tables', jobs.rows.map((r) => r.tablename))

const cols = await client.query(
  "select table_name, column_name from information_schema.columns where table_schema = 'public' and table_name like 'payload_jobs%' order by table_name, ordinal_position",
)
console.log('job columns', cols.rows)

await client.query('drop table if exists public.payload_jobs_log cascade')
await client.query('drop table if exists public.payload_jobs cascade')
await client.query('drop type if exists public.enum_payload_jobs_log_task_slug cascade')
await client.query('drop type if exists public.enum_payload_jobs_log_state cascade')
await client.query('drop type if exists public.enum_payload_jobs_task_slug cascade')
console.log('cleaned leftover job schema')
await client.end()
