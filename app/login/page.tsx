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
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const supabase = browserSupabase();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        if (/invalid login credentials/i.test(signInError.message)) {
          setError("Email atau kata sandi salah. Jika belum memiliki akun, daftar terlebih dahulu.");
        } else if (/email not confirmed/i.test(signInError.message)) {
          setError("Email belum dikonfirmasi. Periksa kotak masuk email untuk menyelesaikan aktivasi akun.");
        } else {
          setError(signInError.message);
        }
        return;
      }

      if (!data.user) {
        setError("Autentikasi belum mengembalikan akun. Silakan coba lagi.");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileError || !profile) {
        setError("Login diterima, tetapi profil dan role akun belum ditemukan. Pastikan schema.sql sudah dijalankan dan akun mempunyai baris di public.profiles.");
        return;
      }

      window.location.assign(profile.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (/supabase(url|key)|supabase.*required/i.test(message)) {
        setError("Konfigurasi Supabase belum tersedia di deployment ini. Periksa NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di Vercel.");
      } else if (/failed to fetch|networkerror|fetch failed/i.test(message)) {
        setError("Tidak dapat terhubung ke layanan login. Periksa koneksi dan konfigurasi URL Supabase untuk deployment ini.");
      } else {
        setError("Login gagal. " + message);
      }
    } finally {
      setBusy(false);
    }
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
