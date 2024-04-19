# MoaiTime

MoaiTime is a self-hosted productivity app that helps you organize your life, work and more. It is designed to be simple, fast and easy to use, while also being powerful and feature-rich. It is also open-source, so you can host it yourself, modify it to your liking and contribute to it.

## Features

- **Calendar**, where you can add your events, appointments and more. Additionally you also have the ability to subscribe to other external calendars
- **Tasks**, where you can add lists, tasks, assign colours, priorities, durations, due dates, tags, hierarchy and more
- **Habits**, so you can easily add your own daily, weekly, monthly and yearly habits. Again, you can set the colour, order, goal and at the moment we also have a couple dozen templates to choose from. You also have the ability to see your streaks
- **Notes**, with a simple what you see is what you get editor
- **Mood tracking**, to track your mood, with some additional information like the emotions you are experiencing and a note
- **Focus**, which is at the moment basically just a pomodoro timer, where you specify the thing you want to work on, the durations for the focus and periods and the number of repetitions
- **Social**, which is basically a simple social network type of thing, where you can follow, be followed, see achievements, find other users and post things. Still figuring out the last part on what the best way to implement that will be
- **Statistics**, to have a quick overview of the number of entries we have for each feature
- **Notifications**, that you get if you get achievements
- **Command palette**, to get to things faster
- **Settings**, where you set your profile, invite users, privacy, per-feature settings and much more
- Misc
  - **Dark mode**, so your eyes won’t get hurt
  - **Widgets**, like a clock (analogue and digital), greetings, quotes, backgrounds, weather (soon!) and more
  - **Teams**, where you can create teams, invite users to them and are able to share calendars, tasks and notes with them. Oh, and you can also nudge them on to work on tasks
  - **Real-time communication**, so changes are instantly reflected on all your, and your team’s devices
  - **Keyboard shortcuts**, to save even more time
  - **Search**, including setting your preferred search engine
  - **Responsive design**, so you can use it on any device (native apps coming soon!)
  - **Accessibility**, so everyone can use it
  - **Data exports**, so you can take your data with you

## Screenshots

![Home Page](./docs/screenshots/home-page.png)
![Calendar - Monthly](./docs/screenshots/calendar-monthly.png)
![Tasks](./docs/screenshots/tasks.png)
![Habits](./docs/screenshots/habits.png)
![Notes](./docs/screenshots/notes.png)

And much more! You can find more screenshots on my blog post [https://bobalazek.com/blog/0003-moaitime/](https://bobalazek.com/blog/0003-moaitime/).

## Stack

- General: [TypeScript](https://www.typescriptlang.org)
- Tooling: [Turborepo](https://turbo.build/repo), [pnpm](https://pnpm.io), [Vite](https://vitejs.dev), [tsup](https://tsup.egoist.sh), [ESLint](https://eslint.org), [Prettier](https://prettier.io), [Husky](https://typicode.github.io/husky)
- Shared: [Zod](https://zod.dev)
- Frontend: [React](https://reactjs.org), [Zustand](https://zustand.surge.sh), [Jotai](https://jotai.org), [React Router](https://reactrouter.com/en/main), [TailwindCSS](https://tailwindcss.com), [Shadcn UI](https://ui.shadcn.com)
- Backend: [NestJS](https://nestjs.com), [Drizzle ORM](https://orm.drizzle.team), [BullMQ](https://docs.bullmq.io)
- Mobile [Capacitor](https://capacitorjs.com)
- Testing: [Cypress](https://www.cypress.io), [Vitest](https://vitest.dev)
- Infrastructure: [Docker](https://www.docker.com)
- Databases: [PostgreSQL](https://www.postgresql.org), [Redis](https://redis.io)
- Storage: [MinIO](https://min.io)
- CI/CD: [Docker](https://www.docker.com), [GitHub Actions](https://github.com/features/actions), [Portainer](https://www.portainer.io)
- Mailer: [Nodemailer](https://nodemailer.com), [Resend](https://resend.com)

## Installation

Let's go through the steps to install MoaiTime with Docker Compose on your local machine.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker)
- [Resend](https://resend.com) account or a SMTP account

### Steps

#### 1. Clone the repository

Let's start by cloning the repository:

```bash
git clone git@github.com/bobalazek/moaitime.git
```

#### 2. Prepare environment variables

Now we will need to prepare the environment variables:

```bash
cp .env.local.example .env.local
```

After that, you'll need to either create a [Resend](https://resend.com/) account or a SMTP account to send emails. Then set the following environment variables:

```bash
MAILER_FROM="MoaiTime Mailer <noreply@mydomain.com>"

# IMPORTANT NOTE - if the username of password have special characters, YOU MUST ENCODE THEM! Use a tool like https://www.urlencoder.org
MAILER_SMTP_URL=smtp://user:password@mydomain.com:587
# OR
MAILER_RESEND_API_KEY=re_123412341234 # You can get this from Resend
```

You can either set the `MAILER_SMTP_URL` or the `MAILER_RESEND_API_KEY`, but not both. Priority is given to the `MAILER_RESEND_API_KEY`.

#### 3. Start the Docker environment

```bash
./scripts/deploy-to-docker-compose.sh
```

#### 4. Setup the database

Let's first check that all of the services are working as expected:

```bash
docker exec -it moaitime_cli ./cli health:check
```

Now we can run the database reload command to create the database schema, run the migrations, insert the seed data and insert the fixture data:

```bash
docker exec -it moaitime_cli ./cli database:reload
```

#### 5. Access MoaiTime

You can now access MoaiTime at [http://localhost:4200](http://localhost:4200). The default credentials are - email: `àdmin@moaitime.com`, password: `password`

#### 6. Enjoy MoaiTime

This is where we reached the end of the installation process. You can now enjoy MoaiTime!

## Documentation

- [Development](./docs/DEVELOPMENT.md)
- [Commands](./docs/COMMANDS.md)
- [Docker Commands](./docs/DOCKER-COMMANDS.md)
- [Testing](./docs/TESTING.md)

## License

MoaiTime is licensed under the MIT license.
