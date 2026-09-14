# ThesisLab

Production-ready Next.js platform for academic assistance services.

ThesisLab provides structured academic support, consultation, editing, data analysis, formatting, and research assistance through a customer dashboard and admin workflow.

## Features

### Customer

* Customer registration and login with Supabase Auth
* Customer dashboard
* Order creation and order history
* Dynamic service and pricing catalog
* Per-service pricing calculator
* Private proposal/data upload
* Order status and progress tracking
* Revision workflow
* Printable order invoice
* Payment status tracking
* Direct WhatsApp contact and order summary
* Customer notifications

### Admin

* Admin authentication and dashboard
* Order management
* Accept / reject / process / revision / complete workflow
* Customer progress tracking
* Revision management
* Printable admin invoice
* Service management
* Admin-editable service names, descriptions, prices, and active status
* Voucher management
* Customer and order information management

### Payments

* Midtrans payment integration
* Midtrans payment notification/webhook endpoint
* Payment status synchronization with orders
* Unique payment order IDs
* Support for payment states such as pending, settlement/paid, expired, cancelled, and failed
* Payment evidence/status fields

### Backend

* Supabase PostgreSQL
* Supabase Auth
* Row Level Security (RLS)
* Supabase Storage for private files
* Server-side Supabase access
* API routes for orders, payments, services, vouchers, notifications, and revisions

## Tech Stack

* Next.js
* React
* TypeScript
* Tailwind CSS
* Supabase
* PostgreSQL
* Midtrans
* Vercel

## Project Structure

```text
thesislab/
├── app/
│   ├── admin/
│   ├── api/
│   ├── dashboard/
│   ├── login/
│   ├── register/
│   └── page.tsx
├── lib/
│   ├── auth.ts
│   ├── pricing.ts
│   ├── supabase-admin.ts
│   ├── supabase-browser.ts
│   └── supabase-server.ts
├── payments/
├── supabase/
│   └── schema.sql
├── middleware.ts
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

On Windows PowerShell, you can use:

```powershell
Copy-Item .env.example .env.local
```

Fill `.env.local` with the required Supabase, authentication, payment, WhatsApp, and application configuration values.

**Never commit `.env.local` or provider secret keys to GitHub.**

### 3. Configure Supabase

1. Create a Supabase project.
2. Run:

```text
supabase/schema.sql
```

in the Supabase SQL Editor.
3. Configure Supabase Authentication.
4. Set the production Site URL and redirect URLs to the deployed application domain.
5. Create the initial customer account.
6. Promote the intended admin account using the appropriate SQL update on the `profiles` table.

### 4. Run the application

```bash
npm run dev
```

The application will run locally using the Next.js development server.

### 5. Verify the production build

```bash
npm run build
```

## Production Deployment

The production application is deployed using Vercel.

Typical deployment workflow:

```bash
git add .
git commit -m "Describe your changes"
git push
```

When the GitHub repository is connected to Vercel, pushes to the production branch can trigger automatic deployments.

## Environment Variables

The application requires environment variables for configuration and integrations.

Typical variables include:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL
ADMIN_EMAIL
NEXT_PUBLIC_WHATSAPP_NUMBER
PAYMENT_PROVIDER
MIDTRANS_SERVER_KEY
MIDTRANS_IS_PRODUCTION
```

Additional provider-specific variables may be required when enabling optional integrations.

### Security

* Never commit `.env.local`.
* Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.
* Never expose payment provider server keys to the client.
* Keep provider credentials inside Vercel Environment Variables or local environment files.
* Keep private customer files protected by Supabase Storage policies and RLS.

## Payment Webhook

The payment webhook endpoint is:

```text
/api/payments/webhook
```

For production payment processing, configure the selected payment provider's notification/webhook URL to point to the deployed application.

Before enabling production payments, verify the provider's webhook authentication/signature requirements and ensure the implementation matches the provider's current production security requirements.

## WhatsApp

The application supports direct WhatsApp contact from the customer-facing interface.

An optional WhatsApp Cloud API notification endpoint is also available for automated notifications. Automated WhatsApp messaging requires the appropriate Meta Business / WhatsApp Cloud API configuration.

## Dynamic Services

Service information is stored in Supabase and can be managed through the admin interface.

Administrators can update:

* Service name
* Service description
* Service price
* Active/inactive status

Changes to active services are loaded dynamically by the customer-facing application without requiring service prices to be hardcoded in the landing page.

## Database

Application data is persisted in Supabase, including:

* User profiles
* Orders
* Services
* Vouchers
* Payment information
* Notifications
* Revisions
* Customer/order-related records

Private uploaded files are handled through Supabase Storage.

## Current Production Status

ThesisLab has been configured with:

* Customer authentication
* Customer dashboard
* Admin dashboard
* Dynamic services and pricing
* Order management
* Revision workflow
* Invoice generation
* Midtrans payment flow
* Payment webhook
* Supabase persistence
* WhatsApp customer contact
* Voucher management
* Vercel production deployment
* GitHub source-code repository

## Academic Integrity

ThesisLab is intended as an academic support and consultation platform.

Services are designed to assist with research methodology, academic editing, data analysis, formatting, interpretation, and related academic work. Users remain responsible for their own academic submissions and compliance with the policies of their institution.

## Repository

GitHub:

https://github.com/aldxynnn/thesislab

## License

This project is proprietary unless otherwise specified by the repository owner.
