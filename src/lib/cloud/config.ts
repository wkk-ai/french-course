/**
 * Neon endpoints. These are public by design (like a website address): security comes from
 * the password login and from row security in the database (each person only sees their own rows).
 * Never put a database password or connection string here.
 */
export const NEON_AUTH_URL =
  process.env.NEXT_PUBLIC_NEON_AUTH_URL ??
  'https://ep-shiny-frog-b6jsw3dy.neonauth.c-2.sa-east-1.aws.neon.tech/neondb/auth'

export const NEON_DATA_API_URL =
  process.env.NEXT_PUBLIC_NEON_DATA_API_URL ??
  'https://ep-shiny-frog-b6jsw3dy.apirest.c-2.sa-east-1.aws.neon.tech/neondb/rest/v1'
