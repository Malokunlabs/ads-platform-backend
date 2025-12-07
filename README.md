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

## API Endpoints

### Authentication
- `POST /auth/register` - Register admin user
- `POST /auth/login` - Login admin
- `GET /auth/me` - Get current user

### Ads
- `POST /ads` - Create ad (with image upload)
- `GET /ads` - List all ads
- `GET /ads/:id` - Get ad details
- `PATCH /ads/:id` - Update ad
- `PATCH /ads/:id/status` - Update ad status
- `DELETE /ads/:id` - Delete ad

### Campaigns
- `POST /campaigns` - Create campaign
- `GET /campaigns` - List all campaigns
- `GET /campaigns/:id` - Get campaign details
- `PATCH /campaigns/:id` - Update campaign
- `PATCH /campaigns/:id/status` - Update campaign status
- `POST /campaigns/:id/assign-ads` - Assign ads to campaign
- `DELETE /campaigns/:id` - Delete campaign

### Ad Serving (API Key Required)
- `GET /api/ads` - Get active ads (query: placement, limit)
- `POST /api/ads/track/impression` - Track impression
- `POST /api/ads/track/click` - Track click

### Analytics
- `GET /analytics/overall` - Overall analytics
- `GET /analytics/ad/:id` - Ad analytics
- `GET /analytics/campaign/:id` - Campaign analytics

## Initial Setup

1. Create an admin user:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "securepassword",
    "name": "Admin User"
  }'
```

2. Create an API key in the database for ad serving:
```sql
INSERT INTO "ApiKey" (id, key, name, "isActive", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'your-api-key-here', 'Internal API Key', true, NOW(), NOW());
```

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport
- **Validation**: class-validator & class-transformer
- **File Upload**: Multer
- **Rate Limiting**: @nestjs/throttler

## Project Structure

```
src/
├── auth/              # Authentication module
├── ads/               # Ad management module
├── campaigns/         # Campaign management module
├── ad-serving/        # Ad serving API module
├── analytics/         # Analytics module
├── prisma/            # Prisma service
├── upload/            # File upload configuration
└── main.ts            # Application entry point
```
