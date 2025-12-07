# Internal Ads Manager Backend

A NestJS backend for managing and serving advertisements across digital platforms.

## Features

- **Authentication**: JWT-based authentication for admin users
- **Ad Management**: Create, update, delete, and manage ads with image uploads
- **Campaign Management**: Group ads into campaigns for better organization
- **Ad Serving API**: Dynamic ad serving with placement filtering and rate limiting
- **Analytics**: Track impressions, clicks, and calculate CTR for ads and campaigns
- **Activity Logging**: Track all administrative actions
- **API Key Security**: Secure ad serving with API keys

## Prerequisites

- Node.js 18+
- PostgreSQL database
- pnpm

## Installation

```bash
pnpm install
```

## Environment Setup

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Update the `DATABASE_URL` with your PostgreSQL connection string.

## Database Setup

Generate Prisma client:

```bash
pnpm prisma:generate
```

Run migrations:

```bash
pnpm prisma:migrate
```

## Running the Application

Development mode:

```bash
pnpm start:dev
```

Production mode:

```bash
pnpm build
pnpm start:prod
```

The server runs on `http://localhost:3000` by default.

## Database Management

Open Prisma Studio to manage data:

```bash
pnpm prisma:studio
```
