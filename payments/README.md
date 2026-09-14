# Payment configuration

The final code includes server-side payment creation for Midtrans Snap and Xendit Invoice plus a webhook endpoint at `/api/payments/webhook`.

Required Vercel variables:
- `PAYMENT_PROVIDER=midtrans` or `xendit`
- Midtrans: `MIDTRANS_SERVER_KEY`, `MIDTRANS_IS_PRODUCTION`
- Xendit: `XENDIT_SECRET_KEY`

Set the provider webhook/notification URL to `https://YOUR_DOMAIN/api/payments/webhook`.

**Production requirement:** configure provider-side signature/authenticity verification before treating any webhook as paid. Merchant secrets must never be exposed to browser code.
