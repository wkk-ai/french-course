/**
 * Neon endpoints. These are public by design (like a website address): security comes from
 * the password login and from row security in the database (each person only sees their own rows).
 * Never put a database password or connection string here.
 */
/** Login relay (Neon Function, source in neon-functions/auth-relay). Keeps the Neon Auth cookie so iPhone Safari can sign in. */
export const AUTH_RELAY_URL =
  process.env.NEXT_PUBLIC_AUTH_RELAY_URL ??
  'https://br-bitter-bar-b7eglddx-authrelay.compute.c-13.us-east-1.aws.neon.tech'

export const NEON_DATA_API_URL =
  process.env.NEXT_PUBLIC_NEON_DATA_API_URL ??
  'https://ep-shiny-frog-b6jsw3dy.apirest.c-2.sa-east-1.aws.neon.tech/neondb/rest/v1'
