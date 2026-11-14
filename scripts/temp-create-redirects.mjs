import pg from 'pg'

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

await client.connect()

// Clean any previous test rows.
await client.query("delete from redirects where \"from\" like '/ar/test-%' or \"from\" like '/fr/test-%' or \"from\" = '/test-unprefixed'")

const insert = async (from, type, target) => {
  const toType = target.url ? 'custom' : 'reference'
  const res = await client.query(
    'insert into redirects ("from", to_type, to_url, type) values ($1, $2, $3, $4) returning id',
    [from, toType, target.url ?? null, type],
  )
  const id = res.rows[0].id
  if (target.articleId) {
    await client.query(
      `insert into redirects_rels (parent_id, path, articles_id) values ($1, 'to.reference', $2)`,
      [id, target.articleId],
    )
  }
  return id
}

const ids = []
ids.push(await insert('/ar/test-custom', '301', { url: '/ar/articles/' + encodeURIComponent('تراجع-أسعار-الإسمنت-الحديد-العقار') }))
ids.push(await insert('/fr/test-ref', '301', { articleId: 6 }))
ids.push(await insert('/test-unprefixed', '302', { articleId: 6 }))
ids.push(await insert('/ar/test-308', '308', { url: '/ar/categories/محلات-تجارية' }))
ids.push(await insert('/ar/test-loop', '301', { url: '/ar/test-loop' }))

console.log('inserted', ids)
await client.end()
