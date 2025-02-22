# Setup

## Database

To push the defined table schemas to your postgreSQL database ensure the enviroment variables are suitabely defined and run the command `pnpm run db:push`

This should trigger drizzle-kit to begin a migration on your database and create the tables required.

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
