import pg from 'pg'

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

await client.connect()
await client.query('drop type if exists public.enum_payload_jobs_log_task_slug')
await client.query('drop type if exists public.enum_payload_jobs_log_state')
await client.query('drop type if exists public.enum_payload_jobs_task_slug')
console.log('dropped leftover job enums')
await client.end()
