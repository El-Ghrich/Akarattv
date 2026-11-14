import pg from 'pg'

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

await client.connect()
const regions = await client.query(
  `select rl._locale, rl.slug, rl.name from regions r join regions_locales rl on rl._parent_id = r.id where rl._locale = 'ar' order by r.id limit 6`,
)
console.log(JSON.stringify(regions.rows, null, 1))
await client.end()
