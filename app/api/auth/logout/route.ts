import { redirect } from 'next/navigation';
import { serverSupabase } from '@/lib/supabase-server';

export async function POST() {
  const supabase = await serverSupabase();

  await supabase.auth.signOut();

  redirect('/');
}