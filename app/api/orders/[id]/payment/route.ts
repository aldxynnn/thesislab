import { adminSupabase } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';

function basic(s: string) {
  return Buffer.from(s).toString('base64');
}

function createPaymentOrderId(orderNo: string) {
  const timestamp = Date.now();
  const random = Math.floor(1000 + Math.random() * 9000);

  return `${orderNo}-PAY-${timestamp}-${random}`;
}

export async function POST(
  _r: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user } = await requireUser();

    const db = adminSupabase();

    const { data: order, error: orderError } = await db
      .from('orders')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order tidak ditemukan' },
        { status: 404 }
      );
    }

    // Jangan membuat pembayaran baru kalau order sudah lunas
    if (order.payment_status === 'paid') {
      return NextResponse.json(
        { error: 'Order ini sudah dibayar' },
        { status: 400 }
      );
    }

    const provider = process.env.PAYMENT_PROVIDER || 'midtrans';

    let url = '';
    let reference = '';
    let paymentOrderId = '';

    if (provider === 'midtrans') {
      if (!process.env.MIDTRANS_SERVER_KEY) {
        throw new Error('MIDTRANS_SERVER_KEY belum diatur');
      }

      /*
       * order_no ThesisLab tetap.
       * payment_order_id dibuat unik untuk setiap percobaan pembayaran.
       */
      paymentOrderId = createPaymentOrderId(order.order_no);

      const host =
        process.env.MIDTRANS_IS_PRODUCTION === 'true'
          ? 'https://app.midtrans.com'
          : 'https://app.sandbox.midtrans.com';

      const response = await fetch(
        host + '/snap/v1/transactions',
        {
          method: 'POST',
          headers: {
            Authorization:
              'Basic ' +
              basic(process.env.MIDTRANS_SERVER_KEY + ':'),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transaction_details: {
              order_id: paymentOrderId,
              gross_amount: Number(order.total),
            },

            customer_details: {
              email: user.email,
            },

            callbacks: {
              finish:
                (process.env.NEXT_PUBLIC_APP_URL || '') +
                '/dashboard/orders/' +
                order.id,
            },
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.status_message || 'Midtrans error'
        );
      }

      url = result.redirect_url;
      reference = result.token;
    } else if (provider === 'xendit') {
      if (!process.env.XENDIT_SECRET_KEY) {
        throw new Error('XENDIT_SECRET_KEY belum diatur');
      }

      paymentOrderId = createPaymentOrderId(order.order_no);

      const response = await fetch(
        'https://api.xendit.co/v2/invoices',
        {
          method: 'POST',
          headers: {
            Authorization:
              'Basic ' +
              basic(process.env.XENDIT_SECRET_KEY + ':'),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            external_id: paymentOrderId,
            amount: Number(order.total),
            payer_email: user.email,
            description: order.title,
            invoice_duration: 86400,
            success_redirect_url:
              (process.env.NEXT_PUBLIC_APP_URL || '') +
              '/dashboard/orders/' +
              order.id,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 'Xendit error'
        );
      }

      url = result.invoice_url;
      reference = result.id;
    } else {
      throw new Error(
        'PAYMENT_PROVIDER harus midtrans atau xendit'
      );
    }

    const { error: updateError } = await db
      .from('orders')
      .update({
        payment_provider: provider,
        payment_order_id: paymentOrderId,
        payment_reference: reference,
        payment_url: url,
        payment_status: 'pending',
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      url,
      paymentOrderId,
    });
  } catch (error: any) {
    console.error('PAYMENT ERROR:', error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          'Gagal membuat pembayaran',
      },
      { status: 400 }
    );
  }
}