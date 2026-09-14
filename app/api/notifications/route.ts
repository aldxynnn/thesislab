import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { adminSupabase } from '@/lib/supabase-admin';

export async function GET() {
  const { user } = await requireUser();

  const db = adminSupabase();

  const { data } = await db
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(30);

  return NextResponse.json({
    notifications: data || [],
  });
}

export async function PATCH(req: Request) {
  const { user } = await requireUser();

  const b = await req.json();

  const db = adminSupabase();

  await db
    .from('notifications')
    .update({
      read_at: new Date().toISOString(),
    })
    .eq('id', b.id)
    .eq('user_id', user.id);

  return NextResponse.json({
    ok: true,
  });
}