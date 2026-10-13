"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, BookOpen, ShieldCheck } from "lucide-react";
import { browserSupabase } from "@/lib/supabase-browser";

export default function Register() {
  const [name,setName]=useState(""); const [phone,setPhone]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [busy,setBusy]=useState(false); const [error,setError]=useState(""); const [done,setDone]=useState(false);
  async function submit(e:FormEvent){e.preventDefault();setBusy(true);setError("");const supabase=browserSupabase();const {data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name:name,phone}}});if(error){setError(error.message);setBusy(false);return;}if(data.session)window.location.href="/dashboard";else{setDone(true);setBusy(false);}}
  return (
    <main className="auth-shell min-h-screen"><div className="grid min-h-screen lg:grid-cols-[.95fr_1.05fr]">
      <section className="auth-story"><Link href="/" className="relative z-10 flex items-center gap-3 text-xl font-black"><span className="wordmark-mark"><BookOpen size={19}/></span><span>thesis<span className="wordmark-light">lab</span></span></Link><div className="auth-story-copy"><p className="kicker">MULAI DARI SINI</p><h1 className="mt-4 text-5xl font-black leading-tight">Ruang yang rapi untuk langkah akademikmu.</h1><p className="mt-5 text-lg leading-8 text-slate-300">Buat akun untuk mengelola konsultasi, layanan, dokumen, dan tindak lanjut tanpa kehilangan konteks.</p></div><p className="auth-footnote">© ThesisLab</p></section>
      <section className="auth-form-side"><div className="auth-form-wrap"><Link href="/" className="inline-flex items-center gap-2 auth-back"><ArrowLeft size={15}/>Kembali ke beranda</Link><div className="mt-8"><div className="mb-6 flex items-center gap-3 lg:hidden"><span className="brand-mark"><Sparkles size={18}/></span><b>Thesis<span className="text-violet-300">Lab</span></b></div><p className="eyebrow">AKUN THESISLAB</p><h1 className="mt-2 auth-title">Buat akun baru.</h1><p className="mt-3 auth-description">Daftar untuk menyimpan kebutuhan dan memantau perkembangan layananmu.</p>
        {done ? <div className="mt-8 auth-success"><CheckCircle2 className="text-emerald-400"/><b className="mt-3 block">Akun berhasil dibuat</b><p className="mt-2 text-sm leading-6 text-emerald-100/70">Jika konfirmasi email diaktifkan, cek email Anda terlebih dahulu.</p><Link href="/login" className="action-primary mt-5">Masuk</Link></div> :
        <form onSubmit={submit} className="auth-form"><label className="field-label">Nama lengkap<input required value={name} onChange={e=>setName(e.target.value)} className="input-premium"/></label><label className="field-label !text-slate-300">Nomor WhatsApp<input value={phone} onChange={e=>setPhone(e.target.value)} className="input-premium mt-2 !border-white/10 !bg-white/[.04] !text-white" placeholder="62812…"/></label><label className="field-label !text-slate-300">Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="input-premium mt-2 !border-white/10 !bg-white/[.04] !text-white"/></label><label className="field-label !text-slate-300">Password<input required minLength={6} type="password" value={password} onChange={e=>setPassword(e.target.value)} className="input-premium mt-2 !border-white/10 !bg-white/[.04] !text-white"/></label>{error&&<p className="auth-error">{error}</p>}<button disabled={busy} className="action-primary auth-submit">{busy?"Membuat akun…":"Buat akun"}<ArrowRight size={17}/></button></form>}
        <p className="mt-7 auth-switch">Sudah punya akun? <Link href="/login" className="auth-link">Masuk</Link></p>
      </div></div></section>
    </div></main>
  );
}
