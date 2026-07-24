# Supabase Backend Setup Guide — Stella O Afro Shop

This guide outlines how to deploy the backend database, authentication, storage, and payment webhooks on Supabase to support Stella O Afro Shop.

---

## 1. Database Setup (PostgreSQL)

1. Go to your **Supabase Dashboard** and create a new project.
2. Open the **SQL Editor** from the left-hand navigation.
3. Copy the contents of the [supabase_schema.sql](file:///c:/Users/USER/Desktop/New%20folder/supabase_schema.sql) file.
4. Click **Run** to execute the script and create your tables (`categories`, `products`, `product_variants`, `orders`, `order_items`, `bulk_inquiries`).

---

## 2. Supabase Auth Configuration

Stella's customers support both guest and member checkouts:
- **Guest Checkout**: Generate an anonymous user session or store guest orders directly inside the `orders` database by validating their phone/email details.
- **Member Checkout**: Enable Email Auth and OTP login (WhatsApp/SMS ready via Twilio provider in Supabase) for fast mobile access.
- In your Supabase Dashboard: Go to **Auth** -> **Providers** and ensure **Email** and **Phone** authentication options are configured.

---

## 3. Supabase Storage for Product Images

1. Go to **Storage** in the Supabase Dashboard.
2. Create a new public bucket named `product-images`.
3. Set the access policy to **Public Read** so that the frontend can fetch image URLs directly.
4. Upload images of real dry goods (Garri, Honey Beans, Ofada Rice) and fresh produce (Yams, Plantains).

---

## 4. Paystack & Flutterwave Webhook Edge Function

To reconcile payments automatically, create a Supabase Edge Function to listen to webhook events from Paystack or Flutterwave:

### Deploying the Edge Function:
Run the following commands in your terminal:
```bash
supabase functions new payment-webhook
supabase secrets set PAYSTACK_SECRET_KEY=your_key_here
supabase functions deploy payment-webhook
```

### Function Logic (`index.ts` template):
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const signature = req.headers.get('x-paystack-signature')
  // Verify webhook signature...

  const body = await req.json()
  const reference = body.data.reference
  const status = body.data.status

  if (status === 'success') {
    // Update order status in Postgres
    await supabaseClient
      .from('orders')
      .update({ payment_status: 'Paid', status: 'Packing' })
      .eq('payment_reference', reference)
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
})
```

---

## 5. Performance Optimization for 4G Connections

Since customers will shop on mid-range Android phones over 4G in Lagos traffic:
- Keep the payload sizes lightweight by caching categories and products list in `localStorage`.
- Show reference currency estimates locally on the client without making repeated API conversion queries.
- Vacuum-seal images under 80KB WebP formats.
