"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, BookOpen, ShieldCheck } from "lucide-react";
import { browserSupabase } from "@/lib/supabase-browser";

export default function Register() {
  const [name,setName]=useState(""); const [phone,setPhone]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [busy,setBusy]=useState(false); const [error,setError]=useState(""); const [done,setDone]=useState(false);
  async function submit(e:FormEvent){e.preventDefault();setBusy(true);setError("");const supabase=browserSupabase();const {data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name:name,phone}}});if(error){setError(error.message);setBusy(false);return;}if(data.session)window.location.href="/dashboard";else{setDone(true);setBusy(false);}}
  return (
    <main className="auth-shell min-h-screen"><div className="auth-layout auth-layout-register">
      <section className="auth-story"><Link href="/" className="wordmark auth-wordmark"><span className="wordmark-mark"><BookOpen size={19}/></span><span>thesis<span className="wordmark-light">lab</span></span></Link><div className="auth-story-copy"><p className="eyebrow"><span className="eyebrow-line"/> MULAI DARI SINI</p><h1>Ruang yang rapi untuk <em>langkah akademikmu.</em></h1><p>Buat akun untuk mengelola layanan, dokumen, dan tindak lanjut tanpa kehilangan konteks.</p><div className="auth-points"><span><ShieldCheck size={16}/>Data akun sesuai hak akses</span><span><BookOpen size={16}/>Riwayat kebutuhan tersimpan</span></div></div><p className="auth-footnote">© ThesisLab</p></section>
      <section className="auth-form-side"><div className="auth-form-wrap"><Link href="/" className="inline-flex items-center gap-2 auth-back"><ArrowLeft size={15}/>Kembali ke beranda</Link><div><div className="mb-6 flex items-center gap-3 lg:hidden"><span className="wordmark-mark"><BookOpen size={18}/></span><b>thesis<span className="wordmark-light">lab</span></b></div><div className="auth-form-heading"><p className="eyebrow">AKUN THESISLAB</p><h1 className="auth-title">Buat akun baru.</h1><p className="auth-description">Daftar untuk menyimpan kebutuhan dan memantau perkembangan layananmu.</p></div>
        {done ? <div className="mt-8 auth-success"><CheckCircle2 className="text-emerald-400"/><b className="mt-3 block">Akun berhasil dibuat</b><p>Jika konfirmasi email diaktifkan, periksa kotak masuk untuk mengaktifkan akunmu.</p><Link href="/login" className="action-primary mt-5">Masuk</Link></div> :
        <form onSubmit={submit} className="auth-form"><label className="field-label">Nama lengkap<input required value={name} onChange={e=>setName(e.target.value)} className="input-premium"/></label><label className="field-label">Nomor WhatsApp<input value={phone} onChange={e=>setPhone(e.target.value)} className="input-premium" placeholder="62812…"/></label><label className="field-label">Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="input-premium"/></label><label className="field-label !text-slate-300">Password<input required minLength={6} type="password" value={password} onChange={e=>setPassword(e.target.value)} className="input-premium mt-2 !border-white/10 !bg-white/[.04] !text-white"/></label>{error&&<p className="auth-error">{error}</p>}<button disabled={busy} className="action-primary auth-submit">{busy?"Membuat akun…":"Buat akun"}<ArrowRight size={17}/></button></form>}
        <p className="mt-7 auth-switch">Sudah punya akun? <Link href="/login" className="auth-link">Masuk</Link></p>
      </div></div></section>
    </div></main>
  );
}
