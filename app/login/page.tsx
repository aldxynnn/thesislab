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
      <div className="auth-layout">
        <section className="auth-story">
          
          <Link href="/" className="wordmark auth-wordmark"><span className="wordmark-mark"><BookOpen size={19}/></span><span>thesis<span className="wordmark-light">lab</span></span></Link>
          <div className="auth-story-copy"><p className="eyebrow"><span className="eyebrow-line"/> RUANG KERJA AKADEMIK</p><h1>Lebih terarah dalam <em>menyelesaikan proses skripsi.</em></h1><p>Pesanan, dokumen, pembayaran, progres, dan revisi tersusun dalam satu ruang kerja yang mudah dipantau.</p><div className="auth-points"><span><ShieldCheck size={16}/>Akses akun terlindungi</span><span><BookOpen size={16}/>Riwayat kebutuhan tersimpan</span></div></div>
          <p className="auth-footnote">© ThesisLab</p>
        </section>
        <section className="auth-form-side">
          <div className="auth-form-wrap">
            <Link href="/" className="inline-flex items-center gap-2 auth-back"><ArrowLeft size={15}/>Kembali ke beranda</Link>
            
              <div className="auth-form-heading"><p className="eyebrow">AKUN THESISLAB</p><h1 className="mt-2 auth-title">Selamat datang kembali.</h1><p className="auth-description">Masuk untuk melihat status pesanan dan melanjutkan langkah berikutnya.</p></div>
              <form onSubmit={submit} className="auth-form">
                <label className="field-label">Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="input-premium"/></label>
                <label className="field-label">Password<input required type="password" value={password} onChange={e=>setPassword(e.target.value)} className="input-premium"/></label>
                {error&&<p className="auth-error">{error}</p>}
                <button disabled={busy} className="action-primary auth-submit">{busy?"Memproses…":"Masuk"}<ArrowRight size={17}/></button>
              </form>
              <div className="mt-6 auth-security"><ShieldCheck size={15}/> Data akun ditampilkan sesuai hak akses.</div>
              <p className="mt-7 auth-switch">Belum punya akun? <Link href="/register" className="auth-link">Daftar sekarang</Link></p>
          </div>
        </section>
      </div>
    </main>
  );
}
