import pg from 'pg'

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

await client.connect()

for (const table of ['articles', 'categories', 'regions', 'articles_locales', 'categories_locales', 'regions_locales']) {
  const result = await client.query(`select count(*)::int as count from ${table}`)
  console.log(table, result.rows[0].count)
}

const articles = await client.query(
  `select a.id, al._locale, al.slug, al.title from articles a join articles_locales al on al._parent_id = a.id order by a.id, al._locale limit 20`,
)
console.log('articles', articles.rows)

const categories = await client.query(
  `select c.id, cl._locale, cl.slug, cl.title from categories c join categories_locales cl on cl._parent_id = c.id order by c.id, cl._locale limit 20`,
)
console.log('categories', categories.rows)

await client.end()
