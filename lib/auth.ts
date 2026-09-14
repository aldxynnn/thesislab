import { adminSupabase } from '@/lib/supabase-admin';
import { redirect } from 'next/navigation';
import { serverSupabase } from './supabase-server'
export async function requireUser(){const supabase=await serverSupabase();const {data:{user}}=await supabase.auth.getUser();if(!user)redirect('/login');return {supabase,user}}
export async function requireAdmin(){const {user}=await requireUser();const db=adminSupabase();const {data:p}=await db.from('profiles').select('role').eq('id',user.id).single();if(p?.role!=='admin')redirect('/dashboard');return {supabase:db,user}}
