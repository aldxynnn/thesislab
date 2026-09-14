import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { adminSupabase } from '@/lib/supabase-admin';

export async function GET(
  _r: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { user } = await requireUser();

  const db = adminSupabase();

  const { data: o } = await db
    .from('orders')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!o) {
    return new NextResponse('Not found', { status: 404 });
  }

  const html = `
    <!doctype html>
    <html>
      <body style="font-family:Arial;padding:48px;max-width:760px;margin:auto">
        <h1>THESISLAB</h1>
        <p>INVOICE · ${o.order_no}</p>
        <hr>
        <h2>${o.title}</h2>
        <p>Status: ${o.status}</p>
        <p>Pembayaran: ${o.payment_status}</p>
        <h1>Rp${Number(o.total).toLocaleString('id-ID')}</h1>
        <p>Invoice ini dibuat dari data order ThesisLab.</p>
        <script>window.print()</script>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html;charset=utf-8',
    },
  });
}