"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck, BookOpen } from "lucide-react";
import { browserSupabase } from "@/lib/supabase-browser";

export default function Login() {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");

  async function submit(e:FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    const supabase=browserSupabase();
    const {data,error}=await supabase.auth.signInWithPassword({email,password});
    if(error){setError(error.message);setBusy(false);return;}
    const {data:p}=await supabase.from("profiles").select("role").eq("id",data.user.id).single();
    window.location.href=p?.role==="admin"?"/admin":"/dashboard";
  }

  return (
    <main className="auth-shell min-h-screen">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_.95fr]">
        <section className="auth-story">
          
          <Link href="/" className="relative z-10 flex items-center gap-3 text-xl font-black"><span className="wordmark-mark"><BookOpen size={19}/></span><span>thesis<span className="wordmark-light">lab</span></span></Link>
          <div className="auth-story-copy"><p className="kicker">RUANG KERJA AKADEMIK</p><h1 className="mt-4 text-5xl font-black leading-tight">Lebih terarah dalam menyelesaikan proses skripsi.</h1><p className="mt-5 text-lg leading-8 text-slate-300">Order, dokumen, pembayaran, progres, dan revisi tersusun dalam satu ruang kerja yang mudah dipantau.</p><div className="mt-8 flex gap-3 text-sm text-slate-300"><span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Privat</span><span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Transparan</span><span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Terstruktur</span></div></div>
          <p className="auth-footnote">© ThesisLab</p>
        </section>
        <section className="auth-form-side">
          <div className="auth-form-wrap">
            <Link href="/" className="inline-flex items-center gap-2 auth-back"><ArrowLeft size={15}/>Kembali ke beranda</Link>
            <div className="auth-form-heading"><div className="mb-6 flex items-center gap-3 lg:hidden"><span className="wordmark-mark"><BookOpen size={18}/></span><b>thesis<span className="wordmark-light">lab</span></b></div>
              <p className="eyebrow">AKUN THESISLAB</p><h1 className="mt-2 auth-title">Selamat datang kembali.</h1><p className="mt-3 auth-description">Masuk untuk melihat status pesanan dan melanjutkan langkah berikutnya.</p>
              <form onSubmit={submit} className="auth-form">
                <label className="field-label">Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="input-premium"/></label>
                <label className="field-label !text-slate-300">Password<input required type="password" value={password} onChange={e=>setPassword(e.target.value)} className="input-premium mt-2 !border-white/10 !bg-white/[.04] !text-white"/></label>
                {error&&<p className="auth-error">{error}</p>}
                <button disabled={busy} className="action-primary auth-submit">{busy?"Memproses…":"Masuk"}<ArrowRight size={17}/></button>
              </form>
              <div className="mt-6 auth-security"><ShieldCheck size={15}/> Data akun ditampilkan sesuai hak akses.</div>
              <p className="mt-7 auth-switch">Belum punya akun? <Link href="/register" className="auth-link">Daftar sekarang</Link></p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
