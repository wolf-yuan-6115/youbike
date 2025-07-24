# Where is my YouBike?

A web page that can view historical data of YouBike availability.

Powered by Bun, Supabase and TypeScript. Website part uses Astro, the blazing fast web framework.

> YouBike is a popular public bike rental service that has stations everywhere.

## Why?

Because they sometimes (currently elevating to often) leave the station near my school without a bike, forcing me to walk home or take the bus instead.

## The code

### Project structure

This project is using monorepo structure.

```
└── apps
    ├── grabber
    │   └── <Contains data grabber source code>
    └── web
        └── <Contains website source code>
```

### Running by yourself

Please clone this repo and run `bun install` in the project root.

#### Data grabber

1. Create a project on Supabase
2. Run the SQL command inside `apps/grabber/database/init.sql`
3. Open `apps/grabber`, copy `.env.example` to `.env` and fill in the variables
   > You need to fill in **Service Key** (**API key** in the newer version of Supabase
4. Start the grabber by running `bun run ./index.ts` inside `apps/grabber`

There is also a Docker compose file at the project root that will deploy data grabber.

#### Web page

> Currently, the website lies on Cloudflare Pages and uses `@astrojs/cloudflare` adapter for running functions on Pages. You can host it locally by replacing the adapter with `@astrojs/node` or other adapter you want to match your need.

1. Deploy this repo to Cloudflare pages

### Bug reporting

Please send a mail to `me at wolf-yuan.dev`