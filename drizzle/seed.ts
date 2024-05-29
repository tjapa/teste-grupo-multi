import postgres from 'postgres'

const postgresDbUrl =
  process.env.POSTGRES_DB_URL ??
  'postgresql://postgres:postgres@127.0.0.1:5432/postgres'

export async function runSeed(
  postgresDbUrl: string,
  postgresConfig?: postgres.Options<{}>,
) {
  const sql = postgres(postgresDbUrl, { max: 1, ...postgresConfig })
  await sql.file('drizzle/custom-sql/seed.sql')
  await sql.end()
}

runSeed(postgresDbUrl).then()
