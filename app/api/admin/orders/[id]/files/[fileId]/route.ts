import {NextResponse} from 'next/server';
import {requireAdmin} from '@/lib/auth';

export async function GET(_request:Request,{params}:{params:Promise<{id:string;fileId:string}>}) {
  const {id,fileId}=await params;
  const {supabase}=await requireAdmin();

  const {data:record,error}=await supabase
    .from('order_files')
    .select('id,name,path')
    .eq('id',fileId)
    .eq('order_id',id)
    .single();

  if(error||!record) {
    return NextResponse.json({error:'Dokumen tidak ditemukan'},{status:404});
  }

  const {data:file,error:downloadError}=await supabase.storage
    .from('order-files')
    .download(record.path);

  if(downloadError||!file) {
    return NextResponse.json({error:'Dokumen tidak dapat diunduh'},{status:404});
  }

  const encodedName=encodeURIComponent(record.name).replace(/[!'()*]/g,character=>
    `%${character.charCodeAt(0).toString(16).toUpperCase()}`
  );

  return new Response(file,{
    headers:{
      'Content-Type':file.type||'application/octet-stream',
      'Content-Disposition':`attachment; filename="document"; filename*=UTF-8''${encodedName}`,
      'Cache-Control':'private, no-store',
      'X-Content-Type-Options':'nosniff',
    },
  });
}
