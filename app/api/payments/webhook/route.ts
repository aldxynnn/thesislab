import { adminSupabase } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const provider =
      process.env.PAYMENT_PROVIDER || 'midtrans';

    const db = adminSupabase();

    let paymentOrderId = '';
    let transactionStatus = '';

    if (provider === 'midtrans') {
      paymentOrderId = body.order_id;
      transactionStatus = body.transaction_status || '';
    } else if (provider === 'xendit') {
      paymentOrderId = body.external_id;
      transactionStatus = body.status || '';
    }

    if (!paymentOrderId) {
      console.error(
        'WEBHOOK: payment order ID tidak ditemukan',
        body
      );

      return NextResponse.json(
        {
          error:
            'Payment order ID tidak ditemukan',
        },
        { status: 400 }
      );
    }

    /*
     * Cari berdasarkan payment_order_id terlebih dahulu.
     * Ini penting karena ID pembayaran Midtrans sekarang
     * berbeda dengan nomor order ThesisLab.
     */
    let { data: order, error: findError } = await db
      .from('orders')
      .select(
        'id,user_id,order_no,payment_status,status,payment_order_id'
      )
      .eq('payment_order_id', paymentOrderId)
      .maybeSingle();

    /*
     * Fallback untuk transaksi lama yang dibuat sebelum
     * payment_order_id ditambahkan.
     */
    if (!order && provider === 'midtrans') {
      const { data: legacyOrder } = await db
        .from('orders')
        .select(
          'id,user_id,order_no,payment_status,status,payment_order_id'
        )
        .eq('order_no', paymentOrderId)
        .maybeSingle();

      order = legacyOrder;
    }

    if (findError) {
      console.error(
        'WEBHOOK: gagal mencari order',
        findError
      );

      return NextResponse.json(
        { error: findError.message },
        { status: 500 }
      );
    }

    if (!order) {
      console.error(
        'WEBHOOK: ORDER TIDAK DITEMUKAN',
        {
          paymentOrderId,
          provider,
          transactionStatus,
        }
      );

      return NextResponse.json(
        {
          error: 'Order tidak ditemukan',
          paymentOrderId,
        },
        { status: 404 }
      );
    }

    let paymentStatus:
      | 'unpaid'
      | 'pending'
      | 'paid'
      | 'failed'
      | 'expired' = 'pending';

    let orderStatus:
      | 'pending_payment'
      | 'processing'
      | 'revision'
      | 'completed'
      | 'rejected' = order.status;

    if (provider === 'midtrans') {
      switch (transactionStatus) {
        case 'settlement':
        case 'capture':
          paymentStatus = 'paid';
          orderStatus = 'processing';
          break;

        case 'pending':
          paymentStatus = 'pending';
          orderStatus = 'pending_payment';
          break;

        case 'expire':
          paymentStatus = 'expired';
          orderStatus = 'pending_payment';
          break;

        case 'cancel':
        case 'deny':
          paymentStatus = 'failed';
          orderStatus = 'pending_payment';
          break;

        default:
          paymentStatus = 'pending';
          orderStatus = 'pending_payment';
      }
    } else if (provider === 'xendit') {
      if (transactionStatus === 'PAID') {
        paymentStatus = 'paid';
        orderStatus = 'processing';
      } else if (transactionStatus === 'EXPIRED') {
        paymentStatus = 'expired';
        orderStatus = 'pending_payment';
      } else {
        paymentStatus = 'pending';
        orderStatus = 'pending_payment';
      }
    }

    /*
     * Update pembayaran dan status order.
     */
    const { error: updateError } = await db
      .from('orders')
      .update({
        payment_status: paymentStatus,
        status: orderStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id);

    if (updateError) {
      console.error(
        'WEBHOOK: gagal update order',
        updateError
      );

      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    /*
     * Buat notifikasi ketika pembayaran berhasil.
     */
    if (paymentStatus === 'paid') {
      const { error: notificationError } = await db
        .from('notifications')
        .insert({
          user_id: order.user_id,
          order_id: order.id,
          title: 'Pembayaran diterima',
          body:
            `Pembayaran ${order.order_no} diterima. ` +
            `Order masuk proses.`,
        });

      if (notificationError) {
        console.error(
          'WEBHOOK: gagal membuat notification',
          notificationError
        );
      }
    }

    console.log(
      'PAYMENT WEBHOOK BERHASIL',
      {
        orderNo: order.order_no,
        paymentOrderId,
        transactionStatus,
        paymentStatus,
        orderStatus,
      }
    );

    return NextResponse.json({
      ok: true,
      orderNo: order.order_no,
      paymentOrderId,
      transactionStatus,
      paymentStatus,
      orderStatus,
    });
  } catch (error: any) {
    console.error(
      'WEBHOOK ERROR:',
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          'Webhook error',
      },
      { status: 500 }
    );
  }
}