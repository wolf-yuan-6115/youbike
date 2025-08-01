# Where is my YouBike?

> aka *Cha Bike*
> 
> `Cha`, referring to Chinese word `查` (chá). Means to search and query.
> 
> YouBike is a popular public bike rental service that has stations everywhere.

A web app/service that can view historical data of YouBike availability.

## Why?

Because lately—*and by lately I mean way too often*—the station near my school is completely out of bikes.
Not even one sad little leftover with a flat tire. Just empty docks mocking me in the heat.

So instead of a quick ride home, I’m stuck walking or paying for a crowded bus ride.
This project is my way of keeping tabs on the situation—and maybe throwing some passive-aggressive shade when they fail to stock bikes during peak hours.


## Tech stacks

- Data grabber
  - Runs on [**Cloudflare Workers**](https://workers.cloudflare.com/) using [cron trigger](https://developers.cloudflare.com/workers/configuration/cron-triggers/) function
  - Uses TypeScript
- Frontend
  - Written in [Astro](https://astro.build), with [i18n routing](https://docs.astro.build/en/guides/internationalization/) for two languages
  - Runs on [**Cloudflare Workers**](https://workers.cloudflare.com/) using [Static Assets](https://developers.cloudflare.com/workers/static-assets/) feature
  - Uses **TailwindCSS** for more rapid development (for me)
  - Completely rendered on demand

Both instance shares same [Supabase](https://developers.cloudflare.com/workers/static-assets/) database, along with [RLS security](https://supabase.com/docs/guides/database/postgres/row-level-security) for some security.

## The code

### Project structure

This project is using monorepo structure.

```
└── apps
    ├── grabber
    │   └── <Contains data grabber source code>
    └── frontend
        └── <Contains website source code>
```

### Running by yourself

Please clone this repo and run `bun install` in the project root.
This will install everything you need to try this project.

#### Data grabber

1. Create a project on Supabase
2. Run the SQL command inside `apps/grabber/database/init.sql`, inside the Supabase instance you've created.
3. Open `wrangler.jsonc` in **grabber** folder, change `SUPABASE_URL` in `vars` section to your Supabase instance URL.
4. Deploy this project to Cloudflare Workers by connecting your own GitHub / GitLab repository.
5. Once deployed, head over to **Settings** → **Variables and Secrets** section. Add `SUPABASE_SERVICE_KEY` variable with a Supabase Service role key or Secret keys.
   > Make sure to set the variable type to secret variable so Cloudflare won't override it when a new version deploys
6. Hit `Deploy` button once you filled all variables.

The data grabber should now start grabbing data per minute and insert them into the Supabase database for website to query.

#### Frontend

> Currently, the website lies on Cloudflare Workers and uses `@astrojs/cloudflare` adapter for running functions on Pages.
> 
> You can host it locally by replacing the adapter with `@astrojs/node` or other adapter you want to match your need.

1. Make sure you have [Data grabber](#data-grabber) deployed.
2. Open `wrangler.jsonc` in **frontend** folder, change `SUPABASE_URL` in `vars` section to your Supabase instance URL.
3. Deploy this project to Cloudflare Workers by connecting your own GitHub / GitLab repository.
4. Once deployed, head over to **Settings** → **Variables and Secrets** section. Add `SUPABASE_SERVICE_KEY` variable with a Supabase Service role key or Secret keys.
   > Make sure to set the variable type to secret variable so Cloudflare won't override it when a new version deploys
5. Hit `Deploy` button once you filled all variables.
6. Add a custom domain to your Worker for routing.

> Note that, in my code, the `*.workers.dev` domain is disabled because I don't want traffic from other places.
> 
> Set `workers_dev` to `true` in `wrangler.jsonc` to enable `*.workers.dev` domain.

### Bug reporting / additional station inquiry

Please send a mail to `me@wolf-yuan.dev`