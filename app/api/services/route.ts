import { adminSupabase } from '@/lib/supabase-admin';
import {NextResponse} from 'next/server';import {defaultServices} from '@/lib/pricing';
export async function GET(){try{const db=adminSupabase();const {data}=await db.from('services').select('id,name,category,price,description').eq('active',true).order('sort_order');return NextResponse.json({services:data?.length?data:defaultServices})}catch{return NextResponse.json({services:defaultServices})}}
