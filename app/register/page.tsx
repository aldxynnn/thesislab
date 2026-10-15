"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, BookOpen, ShieldCheck } from "lucide-react";
import BrandLogo from "@/components/brand-logo";
import { browserSupabase } from "@/lib/supabase-browser";

export default function Register() {
  const [name,setName]=useState(""); const [phone,setPhone]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [busy,setBusy]=useState(false); const [error,setError]=useState(""); const [done,setDone]=useState(false);
  async function submit(e:FormEvent){
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const supabase = browserSupabase();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: name.trim(), phone: phone.trim() } },
      });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      if (data.session) {
        window.location.assign("/dashboard");
      } else {
        setDone(true);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (/supabase(url|key)|supabase.*required/i.test(message)) {
        setError("Konfigurasi Supabase belum tersedia di deployment ini. Periksa NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di Vercel.");
      } else if (/failed to fetch|networkerror|fetch failed/i.test(message)) {
        setError("Tidak dapat terhubung ke layanan pendaftaran. Periksa koneksi dan konfigurasi URL Supabase.");
      } else {
        setError("Pendaftaran gagal. " + message);
      }
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="auth-shell min-h-screen"><div className="auth-layout auth-layout-register">
      <section className="auth-story"><Link href="/" className="brand-logo-link" aria-label="ThesisLab beranda"><BrandLogo variant="auth" /></Link><div className="auth-story-copy"><p className="eyebrow"><span className="eyebrow-line"/> MULAI DARI SINI</p><h1>Ruang yang rapi untuk <em>langkah akademikmu.</em></h1><p>Buat akun untuk mengelola layanan, dokumen, dan tindak lanjut tanpa kehilangan konteks.</p><div className="auth-points"><span><ShieldCheck size={16}/>Data akun sesuai hak akses</span><span><BookOpen size={16}/>Riwayat kebutuhan tersimpan</span></div></div><p className="auth-footnote">© ThesisLab</p></section>
      <section className="auth-form-side"><div className="auth-form-wrap"><Link href="/" className="inline-flex items-center gap-2 auth-back"><ArrowLeft size={15}/>Kembali ke beranda</Link><div><div className="auth-form-heading"><p className="eyebrow">AKUN THESISLAB</p><h1 className="auth-title">Buat akun baru.</h1><p className="auth-description">Daftar untuk menyimpan kebutuhan dan memantau perkembangan layananmu.</p></div>
        {done ? <div className="mt-8 auth-success"><CheckCircle2 className="text-emerald-400"/><b className="mt-3 block">Akun berhasil dibuat</b><p>Jika konfirmasi email diaktifkan, periksa kotak masuk untuk mengaktifkan akunmu.</p><Link href="/login" className="action-primary mt-5">Masuk</Link></div> :
        <form onSubmit={submit} className="auth-form"><label className="field-label">Nama lengkap<input required value={name} onChange={e=>setName(e.target.value)} className="input-premium"/></label><label className="field-label">Nomor WhatsApp<input value={phone} onChange={e=>setPhone(e.target.value)} className="input-premium" placeholder="62812…"/></label><label className="field-label">Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="input-premium"/></label><label className="field-label">Password<input required minLength={6} type="password" value={password} onChange={e=>setPassword(e.target.value)} className="input-premium mt-2"/></label>{error&&<p className="auth-error">{error}</p>}<button disabled={busy} className="action-primary auth-submit">{busy?"Membuat akun…":"Buat akun"}<ArrowRight size={17}/></button></form>}
        <p className="mt-7 auth-switch">Sudah punya akun? <Link href="/login" className="auth-link">Masuk</Link></p>
      </div></div></section>
    </div></main>
  );
}
