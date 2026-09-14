"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
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
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_.95fr]">
        <section className="premium-hero relative hidden overflow-hidden p-12 lg:flex lg:flex-col lg:justify-between">
          <div className="orb orb-one"/>
          <Link href="/" className="relative z-10 flex items-center gap-3 text-xl font-black"><span className="brand-mark"><Sparkles size={18}/></span>Thesis<span className="text-violet-300">Lab</span></Link>
          <div className="relative z-10 max-w-xl"><p className="kicker">Professional workspace</p><h1 className="mt-4 text-5xl font-black leading-tight">Satu ruang kerja untuk kebutuhan akademik Anda.</h1><p className="mt-5 text-lg leading-8 text-slate-300">Order, dokumen, pembayaran, progres, dan revisi tersusun dalam satu ruang kerja yang mudah dipantau.</p><div className="mt-8 flex gap-3 text-sm text-slate-300"><span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Privat</span><span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Transparan</span><span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Terstruktur</span></div></div>
          <p className="relative z-10 text-xs text-slate-500">© ThesisLab</p>
        </section>
        <section className="flex items-center justify-center bg-slate-950 px-6 py-12">
          <div className="w-full max-w-md">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white"><ArrowLeft size={15}/>Kembali</Link>
            <div className="mt-8"><div className="mb-6 flex items-center gap-3 lg:hidden"><span className="brand-mark"><Sparkles size={18}/></span><b>Thesis<span className="text-violet-300">Lab</span></b></div>
              <p className="text-xs font-black tracking-widest text-violet-300">WELCOME BACK</p><h1 className="mt-2 text-4xl font-black">Masuk ke akun</h1><p className="mt-3 text-sm leading-6 text-slate-400">Kelola order dan progres pekerjaan Anda dengan lebih rapi.</p>
              <form onSubmit={submit} className="mt-8 space-y-5">
                <label className="field-label !text-slate-300">Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="input-premium mt-2 !border-white/10 !bg-white/[.04] !text-white"/></label>
                <label className="field-label !text-slate-300">Password<input required type="password" value={password} onChange={e=>setPassword(e.target.value)} className="input-premium mt-2 !border-white/10 !bg-white/[.04] !text-white"/></label>
                {error&&<p className="rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
                <button disabled={busy} className="action-primary w-full">{busy?"Memproses…":"Masuk"}<ArrowRight size={17}/></button>
              </form>
              <div className="mt-6 flex gap-2 text-xs leading-5 text-slate-500"><ShieldCheck size={15}/>Data akun ditampilkan sesuai hak akses.</div>
              <p className="mt-7 text-center text-sm text-slate-400">Belum punya akun? <Link href="/register" className="font-bold text-violet-300">Daftar sekarang</Link></p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
