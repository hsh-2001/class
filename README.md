# Class Management System

Web application for managing students, teachers, courses, and class-related data. The project is built with Next.js, React, TypeScript, Prisma, and PostgreSQL.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Prisma 7
- PostgreSQL
- Ant Design

## Prerequisites

Before starting, make sure you have:

- Node.js 20 or newer
- `pnpm` installed
- A running PostgreSQL database

`pnpm` is the recommended package manager because this repository includes a `pnpm-lock.yaml`.

## Project Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create your local environment file:

```bash
cp .env.example .env
```

3. Update `.env` with your local values:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/class_db"
JWT_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_UPLOAD_API="https://your-upload-service.example.com/upload"
NEXT_PUBLIC_UPLOAD_API_KEY="your-upload-api-key"
```

4. Run the database migrations:

```bash
pnpm prisma:migrate
```

5. Start the development server:

```bash
pnpm dev
```

6. Open the app at [http://localhost:3000](http://localhost:3000).

## Database Notes

This app requires PostgreSQL and Prisma uses `DATABASE_URL` from the root `.env` file through [`prisma.config.ts`](/Users/senghong/Repos/2026/class/prisma.config.ts).

After migrations run, create at least one school record before registering or creating users. Some parts of the app expect a school such as `school-01`.

Example:

```sql
INSERT INTO "schools" ("id", "name")
VALUES ('school-01', 'Demo School');
```

You can inspect the database with Prisma Studio:

```bash
pnpm prisma:studio
```

## Useful Commands

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:validate
pnpm prisma:studio
```

## Authentication And Upload Config

The app reads these environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: used to sign login and refresh tokens
- `NEXT_PUBLIC_UPLOAD_API`: file upload endpoint used by the frontend
- `NEXT_PUBLIC_UPLOAD_API_KEY`: API key sent to the upload service

If you do not have an upload service yet, keep the variables in place but expect upload-related features to fail until they point to a real endpoint.

## Troubleshooting

- `JWT_SECRET is not defined`: add `JWT_SECRET` to `.env` and restart the dev server.
- Prisma connection errors: verify PostgreSQL is running and that `DATABASE_URL` points to the correct database.
- User creation fails with school-related errors: insert a record into the `schools` table first, for example `school-01`.
- If Prisma client types are missing, run `pnpm prisma:generate`.
