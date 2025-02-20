# Setup

## Database

To push the defined table schemas to your postgreSQL database ensure the enviroment variables are suitabely defined and run the command `pnpm run db:push`

This should trigger drizzle-kit to begin a migration on your database and create the tables required.
