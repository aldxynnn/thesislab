import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { adminSupabase } from '@/lib/supabase-admin';

export async function GET(
  _r: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await requireAdmin();

  const db = adminSupabase();

  const { data: o, error } = await db
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !o) {
    return new NextResponse('Not found', { status: 404 });
  }

  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice ${o.order_no} · ThesisLab</title>
      </head>
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