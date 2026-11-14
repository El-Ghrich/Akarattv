import pg from 'pg'

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

await client.connect()
const before = await client.query('select id, name, batch from payload_migrations order by id')
console.log('before', before.rows)
const removed = await client.query('delete from payload_migrations where batch = -1 returning id, name')
console.log('removed', removed.rows)
await client.end()
