import {requireUser} from '@/lib/auth';
import Link from 'next/link';
import {ArrowRight, CheckCircle2, Clock3, FilePlus2, LogOut, Package, BookOpen} from 'lucide-react';

const labels:Record<string,string>={pending_payment:'Menunggu pembayaran',processing:'Diproses',revision:'Revisi',completed:'Selesai',rejected:'Ditolak'};

export default async function Dashboard(){
  const {supabase,user}=await requireUser();
  const {data:orders}=await supabase.from('orders').select('id,order_no,title,status,total,created_at,payment_status').eq('user_id',user.id).order('created_at',{ascending:false});
  const total=orders?.length||0, active=orders?.filter(o=>['pending_payment','processing','revision'].includes(o.status)).length||0, completed=orders?.filter(o=>o.status==='completed').length||0;
  const name=user.user_metadata?.full_name||user.email?.split('@')[0]||'Mahasiswa';
  const initial=name.charAt(0).toUpperCase();

  return <main className="app-shell"><div className="page-glow"/><header className="app-header"><div className="container-x flex items-center justify-between">
    <Link href="/" className="flex items-center gap-3"><span className="brand-mark"><BookOpen size={19}/></span><span className="app-wordmark">thesis<span>lab</span></span></Link>
    <div className="flex items-center gap-3"><div className="user-chip"><span className="avatar">{initial}</span><span className="hidden text-sm font-extrabold sm:block">{name}</span></div><form action="/api/auth/logout" method="post"><button className="action-secondary !px-3 !py-2"><LogOut size={16}/><span className="hidden sm:inline">Keluar</span></button></form></div>
  </div></header>
  <div className="container-x app-main">
    <section className="hero-panel"><div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end"><div><p className="kicker">RUANG KERJA MAHASISWA</p><h1 className="page-title">Halo, {name} 👋</h1><p className="page-subtitle">Pantau pesanan, dokumen, pembayaran, dan langkah berikutnya tanpa kehilangan konteks pengerjaan.</p></div><Link href="/dashboard/orders/new" className="action-primary shrink-0"><FilePlus2 size={18}/>Buat pesanan baru<ArrowRight size={17}/></Link></div>
      <div className="mt-7 grid gap-3 sm:grid-cols-3"><div className="stat-card"><p className="stat-label">Total pesanan</p><p className="stat-value">{total}</p></div><div className="stat-card"><p className="stat-label">Sedang berjalan</p><p className="stat-value">{active}</p></div><div className="stat-card"><p className="stat-label">Selesai</p><p className="stat-value">{completed}</p></div></div>
    </section>
    <section className="section-card mt-7"><div className="section-head"><div><h2>Riwayat pesanan</h2><p className="text-xs text-slate-400 mt-1">Pantau status dan pembayaran setiap kebutuhan.</p></div><Package size={20} className="text-violet-500"/></div>
      {!orders?.length?<div className="empty-state"><div className="empty-icon"><FilePlus2 size={24}/></div><b className="text-slate-900">Belum ada pesanan</b><p className="mt-1">Mulai dari layanan yang paling Anda butuhkan.</p><Link href="/dashboard/orders/new" className="action-primary mt-5">Buat pesanan pertama</Link></div>:
      orders.map(o=><Link key={o.id} href={'/dashboard/orders/'+o.id} className="order-row"><div className="min-w-0"><p className="order-code">{o.order_no}</p><p className="order-title truncate">{o.title}</p><p className="order-meta">{new Date(o.created_at).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'})}</p></div><div className="flex items-center gap-4"><span className={`status-pill ${o.status}`}>{labels[o.status]||o.status}</span><span className="money">Rp{Number(o.total).toLocaleString('id-ID')}</span><ArrowRight size={17} className="hidden text-slate-300 md:block"/></div></Link>)}
    </section>
    <div className="mt-5 grid gap-4 md:grid-cols-3"><div className="card p-5"><CheckCircle2 className="text-emerald-500"/><b className="mt-3 block">Progres terpantau</b><p className="mt-1 text-sm text-muted">Status order diperbarui dari ruang kerja yang sama.</p></div><div className="card p-5"><Clock3 className="text-cyan-500"/><b className="mt-3 block">Tenggat lebih jelas</b><p className="mt-1 text-sm text-muted">Riwayat pekerjaan lebih mudah dipantau.</p></div><div className="card p-5"><Package className="text-violet-500"/><b className="mt-3 block">Dokumen per pesanan</b><p className="mt-1 text-sm text-muted">File dan catatan pekerjaan tersimpan di masing-masing pesanan.</p></div></div>
  </div></main>
}