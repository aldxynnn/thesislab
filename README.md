# ThesisLab — Final

Production-oriented Next.js platform for academic assistance services.

## Delivered
- Customer register/login with Supabase Auth
- Real customer dashboard and order history
- Modular per-chapter pricing calculator
- Order creation + private proposal/data upload (20 MB)
- Supabase PostgreSQL + RLS + private Storage schema
- Admin console
- Admin accept/reject/process/revision/complete status workflow
- Automatic customer progress from order status
- Revision endpoint
- Printable invoice endpoint
- Payment evidence/status fields and provider checkout
- Midtrans Snap + Xendit Invoice server-side adapters
- Payment webhook endpoint
- Notifications stored in Supabase
- WhatsApp Cloud API notification endpoint + direct WhatsApp fallback
- Voucher database and admin creation
- Admin-editable service prices without code changes

## Setup once
1. Create Supabase project.
2. Run `supabase/schema.sql` in SQL Editor.
3. Create a customer account, then promote your admin account:
   `update profiles set role='admin' where id=(select id from auth.users where email='YOUR_ADMIN_EMAIL');`
4. Copy `.env.example` to `.env.local` and set credentials.
5. Configure Supabase Auth Site URL / redirect URL to your production domain.
6. Configure Midtrans or Xendit credentials and point webhook/notification to `/api/payments/webhook`.
7. Optional automated WhatsApp: add Meta WhatsApp Cloud API token + phone number ID.
8. Push to GitHub and import the repository into Vercel.

## Final production notes
- Payment webhook signature verification should be enabled according to the selected provider before launch.
- For WhatsApp automation, the Meta Business/WhatsApp Cloud API account must be approved/configured; the website cannot create that account for you.
- Never commit `.env.local` or provider secret keys.
- Prices, vouchers, order status, files, and customer data are persisted in Supabase.
