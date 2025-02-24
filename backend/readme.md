# Setup

## Database

### PostgreSQL installation

1. [Download PostgreSQL](https://www.postgresql.org/download/)
1. Download a table editor (I use [table plus](https://tableplus.com/download))

### Schema

In order to update your PostgreSQL tables to reflect the structure defined within `src/db/schema.ts`

1. Ensure the relevant enviroment variables are suitabely defined (the ones marked `DB_*`)
1. This can be done by copying your postgreSQL connection string and copying out the relevant parts `postgres://<USER>:<PASSWORD>@<HOST>:<PORT>/postgres`
1. run the command `pnpm run db:push`
1. This should trigger drizzle-kit to begin a migration on your database and create or update the tables as required.

## Auth

### Google

1. [Create google developer console project](https://console.cloud.google.com/projectcreate)
1. Navigate to `api & services > Credentials` on the left-hand side of the developer console dashboard with your newly created project selected
1. click `create credentials > oauth client ID > configure consent screen`
1. give the app a name (flayva) and a contact email (doesnt matter), select default options for rest & finish
1. click `clients > create client`
1. select application type `web application`
1. add authorised js URI `http://localhost:<PORT>` where `<PORT>` is the port you are hosting your server on (default `3000`)
1. add authoursied redirect URI `http://localhost:<PORT>/auth/google/callback`
1. click `create`
1. select the newly created client and copy the `Client ID` & `Client Secret` into your `.env.local` file

## Environment

1. Ensure the variables specified in `.env.example` are copied/replaced by a file called `.env.local` and are filled out appropriately.

# Running

Once [setup](#setup) is complete to start the server in development mode, run the command:

- `pnpm run start:dev`
