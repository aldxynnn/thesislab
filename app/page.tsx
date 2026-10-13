"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight, ArrowRight, BookOpen, Check, ChevronDown, FileText,
  Menu, MessageCircle, PenLine, ShieldCheck, Clock3, X, BarChart3
} from "lucide-react";

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

type Service = {
  id: string;
  name: string;
  category?: string | null;
  price: number;
  description?: string | null;
};

const serviceDescriptions: Record<string, string> = {
  bab1: "Perumusan masalah, tujuan, manfaat, dan struktur pendahuluan.",
  bab2: "Penataan kajian pustaka dan kerangka konseptual berdasarkan sumber yang tersedia.",
  bab3: "Penyelarasan metode, variabel, instrumen, dan prosedur penelitian.",
  bab4: "Pendampingan analisis dan pembahasan berdasarkan data penelitian.",
  bab5: "Penyusunan kesimpulan dan saran yang selaras dengan temuan.",
  olah: "Pemeriksaan data, output statistik, dan interpretasi hasil.",
  editing: "Penyuntingan bahasa, konsistensi istilah, dan keterbacaan.",
  format: "Pemeriksaan format naskah sesuai pedoman kampus.",
};

const faqs = [
  ["Bisa memilih satu layanan saja?", "Bisa. Pilih bagian yang memang kamu perlukan. Tidak wajib mengambil paket lengkap."],
  ["Apakah harga ini final?", "Belum. Kalkulator memberikan estimasi awal. Lingkup kerja, kondisi dokumen, data, dan tenggat dikonfirmasi sebelum pesanan disepakati."],
  ["Bagaimana dengan data penelitian?", "Sampaikan kebutuhan dan jenis data saat konsultasi. Hindari mengirim informasi sensitif yang tidak diperlukan."],
  ["Bagaimana revisi dikelola?", "Lingkup revisi dan tenggat disepakati sebelum pekerjaan dimulai agar ekspektasi kedua pihak jelas."],
];

export default function Home() {
  const [mobile, setMobile] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [services, setServices] = useState<Service[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [speed, setSpeed] = useState<"normal" | "priority">("normal");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const response = await fetch("/api/services", { cache: "no-store" });
        if (!response.ok) throw new Error("Gagal memuat layanan");
        const json = await response.json();
        const items: Service[] = (json.services || []).map((item: Service) => ({
          ...item,
          price: Number(item.price) || 0,
        }));
        setServices(items);
        setSelected(["bab4", "olah"].filter((id) => items.some((item) => item.id === id)));
      } catch (error) {
        console.error("Gagal memuat layanan:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  const estimate = useMemo(() => {
    const subtotal = services.filter((item) => selected.includes(item.id))
      .reduce((sum, item) => sum + item.price, 0);
    const discount = selected.length >= 4 ? Math.round(subtotal * 0.1)
      : selected.length >= 3 ? Math.round(subtotal * 0.05) : 0;
    const afterDiscount = subtotal - discount;
    const priorityFee = speed === "priority" ? Math.round(afterDiscount * 0.2) : 0;
    return { subtotal, discount, priorityFee, total: afterDiscount + priorityFee };
  }, [services, selected, speed]);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281296895924";
  const message = encodeURIComponent(
    `Halo ThesisLab, saya ingin konsultasi layanan:\n\n${services.filter((item) => selected.includes(item.id))
      .map((item) => `• ${item.name} — ${rupiah.format(item.price)}`).join("\n")}\n\nKecepatan: ${speed === "priority" ? "Priority" : "Normal"}\nEstimasi: ${rupiah.format(estimate.total)}\n\nSaya ingin lanjut konsultasi.`
  );
  const consultationUrl = `https://wa.me/${whatsappNumber.replace(/\\D/g, "")}?text=${message}`;

  return (
    <main className="site-shell">
      <nav className="site-nav">
        <div className="site-nav-inner">
          <a href="#" className="wordmark" aria-label="ThesisLab beranda">
            <span className="wordmark-mark"><BookOpen size={19} /></span>
            <span>thesis<span className="wordmark-light">lab</span></span>
          </a>
          <div className={`nav-links ${mobile ? "nav-links-open" : ""}`}>
            <a href="#layanan" onClick={() => setMobile(false)}>Layanan</a>
            <a href="#cara-kerja" onClick={() => setMobile(false)}>Cara kerja</a>
            <a href="#kalkulator" onClick={() => setMobile(false)}>Estimasi biaya</a>
            <a href="#faq" onClick={() => setMobile(false)}>FAQ</a>
            <a href="/login" className="nav-login mobile-login-link">Masuk ke akun</a>
          </div>
          <div className="desktop-nav-actions">
            <a href="/login" className="nav-login">Masuk</a>
            <a href="/register" className="button button-dark">Buat akun <ArrowRight size={15} /></a>
          </div>
          <button className="menu-toggle" onClick={() => setMobile(!mobile)} aria-label={mobile ? "Tutup menu" : "Buka menu"}>
            {mobile ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </nav>

      <section className="editorial-hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> THESISLAB · JASA SKRIPSI, OLAH DATA & EDITING</p>
            <h1>Bantuan skripsi yang jelas. <em>Mulai dari bagian yang paling sulit.</em></h1>
            <p className="hero-description">Pilih bantuan per bab, olah data, atau penyuntingan naskah sesuai kebutuhanmu. Cek estimasi biaya, sepakati ruang lingkup, lalu pantau progres pesanan dalam satu tempat.</p>
            <div className="hero-actions">
              <a href="#kalkulator" className="button button-green">Cek estimasi biaya <ArrowRight size={16} /></a>
              <a href="#cara-kerja" className="text-link">Lihat cara kerja <ArrowDownRight size={16} /></a>
            </div>
            <div className="hero-note"><ShieldCheck size={17} /> Ruang lingkup, estimasi biaya, dan tenggat dibahas sebelum pesanan dikonfirmasi.</div>
          </div>
          <div className="hero-visual" aria-label="Ilustrasi ruang kerja ThesisLab">
            <div className="visual-orbit visual-orbit-one"></div><div className="visual-orbit visual-orbit-two"></div>
            <div className="visual-float visual-float-top"><span className="float-icon"><Check size={14}/></span><span><b>Bab 4 · Analisis data</b><small>Ruang lingkup terarah</small></span><span className="float-dot"></span></div>
            <div className="visual-workspace">
              <div className="workspace-top"><div className="workspace-brand"><span className="workspace-brand-icon"><BookOpen size={15}/></span><b>thesis<span>lab</span></b></div><span className="workspace-demo">PREVIEW WORKSPACE</span><span className="workspace-avatar">A</span></div>
              <div className="workspace-welcome"><span>RUANG KERJA MAHASISWA</span><h2>Progres skripsi</h2><p>Contoh tampilan alur layanan</p></div>
              <div className="workspace-progress"><div className="progress-label"><span>Ringkasan kebutuhan</span><b>3 dari 4</b></div><div className="progress-track"><span></span></div></div>
              <div className="workspace-mini-stats"><div><span className="mini-stat-icon mini-violet"><FileText size={15}/></span><span><b>Dokumen</b><small>Terorganisir</small></span></div><div><span className="mini-stat-icon mini-orange"><Clock3 size={15}/></span><span><b>Tenggat</b><small>Terpantau</small></span></div></div>
              <div className="workspace-next"><span className="next-marker"></span><div><small>LANGKAH BERIKUTNYA</small><b>Konfirmasi ruang lingkup</b></div><ArrowRight size={16}/></div>
            </div>
            <div className="visual-float visual-float-bottom"><span className="float-chart"><BarChart3 size={17}/></span><span><b>Olah data & statistik</b><small>SPSS · Excel · interpretasi</small></span><span className="float-check"><Check size={13}/></span></div>
            <div className="visual-caption"><span>01 / 03</span><span>LAYANAN SKRIPSI DALAM SATU ALUR</span></div>
          </div>
        </div>
        <div className="hero-footer">
          <span>PENDAMPINGAN AKADEMIK</span>
          <span className="hero-footer-rule" />
          <span>INDONESIA · BERBASIS KEBUTUHAN</span>
        </div>
      </section>

      <section id="layanan" className="section section-services">
        <div className="section-heading">
          <div><p className="eyebrow">01 — LAYANAN</p><h2>Pilih bantuan yang<br />kamu butuhkan.</h2></div>
          <p className="section-intro">Dari bab skripsi sampai pengolahan data, pilih layanan yang sesuai dengan kendalamu. Kamu bisa mulai dari satu kebutuhan tanpa mengambil paket lengkap.</p>
        </div>
        <div className="service-grid">
          <article className="service-item"><span className="service-index">A / NASKAH</span><BookOpen size={22} strokeWidth={1.6} /><h3>Pendampingan per bab</h3><p>Bab 1–5, dengan pembahasan ruang lingkup yang mengikuti naskah dan pedoman penelitianmu.</p><a href="#kalkulator">Pilih bagian <ArrowRight size={15} /></a></article>
          <article className="service-item"><span className="service-index">B / DATA</span><BarChart3 size={22} strokeWidth={1.6} /><h3>Analisis data</h3><p>Pendampingan pengolahan, pemeriksaan output, dan interpretasi hasil sesuai metode yang digunakan.</p><a href="#kalkulator">Lihat estimasi <ArrowRight size={15} /></a></article>
          <article className="service-item"><span className="service-index">C / EDITING</span><PenLine size={22} strokeWidth={1.6} /><h3>Penyuntingan naskah</h3><p>Perapian bahasa, konsistensi istilah, struktur dokumen, dan format sesuai pedoman kampus.</p><a href="#kalkulator">Lihat estimasi <ArrowRight size={15} /></a></article>
        </div>
      </section>

      <section id="cara-kerja" className="process-band">
        <div className="section process-inner">
          <div className="process-heading"><p className="eyebrow">02 — CARA KERJA</p><h2>Dari bingung mulai<br /><em>sampai progres terarah.</em></h2><p>Ekspektasi, dokumen, dan tenggat dibicarakan dari awal.</p></div>
          <ol className="process-list">
            <li><span>01</span><div><h3>Pilih kebutuhan</h3><p>Tentukan bab atau jenis bantuan yang sedang diperlukan.</p></div></li>
            <li><span>02</span><div><h3>Tinjau estimasi</h3><p>Gunakan kalkulator sebagai titik awal percakapan, bukan invoice final.</p></div></li>
            <li><span>03</span><div><h3>Sepakati ruang lingkup</h3><p>Konfirmasi dokumen, hasil yang diharapkan, dan jadwal pengerjaan.</p></div></li>
            <li><span>04</span><div><h3>Pantau dan evaluasi</h3><p>Gunakan catatan yang jelas untuk progres dan umpan balik.</p></div></li>
          </ol>
        </div>
      </section>

      <section id="kalkulator" className="section estimator-section">
        <div className="section-heading">
          <div><p className="eyebrow">03 — ESTIMASI BIAYA</p><h2>Pilih layanan.<br />Lihat estimasinya.</h2></div>
          <p className="section-intro">Pilih layanan untuk melihat perhitungan langsung. Harga akhir dikonfirmasi setelah kebutuhan dan kondisi dokumen ditinjau.</p>
        </div>
        <div className="estimator-layout">
          <div className="service-picker">
            <div className="picker-heading"><span>PILIH LAYANAN</span><span>{selected.length} dipilih</span></div>
            {loading ? <div className="picker-message">Memuat daftar layanan…</div> : services.length === 0 ? <div className="picker-message">Daftar layanan belum dapat dimuat. Silakan coba kembali nanti.</div> : services.map((service) => {
              const active = selected.includes(service.id);
              return <button key={service.id} type="button" aria-pressed={active} onClick={() => setSelected((current) => active ? current.filter((id) => id !== service.id) : [...current, service.id])} className={`service-option ${active ? "service-option-active" : ""}`}>
                <span className={`option-check ${active ? "option-check-active" : ""}`}>{active && <Check size={13} />}</span>
                <span className="option-copy"><strong>{service.name}</strong><small>{service.description || serviceDescriptions[service.id] || "Ruang lingkup dikonfirmasi saat konsultasi."}</small></span>
                <span className="option-price">{rupiah.format(service.price)}</span>
              </button>;
            })}
            <div className="speed-picker"><p>Kecepatan pengerjaan</p><div className="speed-options">
              <button type="button" onClick={() => setSpeed("normal")} className={speed === "normal" ? "speed-option speed-option-active" : "speed-option"}><strong>Normal</strong><span>Tanpa biaya tambahan</span></button>
              <button type="button" onClick={() => setSpeed("priority")} className={speed === "priority" ? "speed-option speed-option-active" : "speed-option"}><strong>Priority</strong><span>Tambahan 20%</span></button>
            </div></div>
          </div>
          <aside className="estimate-summary">
            <p className="eyebrow">RINGKASAN</p><h3>Estimasi pesanan</h3>
            <div className="summary-items">{selected.length === 0 ? <p className="summary-empty">Pilih satu atau beberapa layanan untuk mulai menghitung.</p> : services.filter((service) => selected.includes(service.id)).map((service) => <div className="summary-row" key={service.id}><span>{service.name}</span><span>{rupiah.format(service.price)}</span></div>)}</div>
            <div className="summary-row"><span>Subtotal</span><span>{rupiah.format(estimate.subtotal)}</span></div>
            {estimate.discount > 0 && <div className="summary-row summary-discount"><span>Diskon bundling</span><span>−{rupiah.format(estimate.discount)}</span></div>}
            {estimate.priorityFee > 0 && <div className="summary-row"><span>Biaya priority</span><span>{rupiah.format(estimate.priorityFee)}</span></div>}
            <div className="summary-total"><span>Estimasi total</span><strong>{rupiah.format(estimate.total)}</strong></div>
            <a className={`button button-green summary-cta ${selected.length === 0 || loading ? "button-disabled" : ""}`} href={selected.length > 0 && !loading ? consultationUrl : "#kalkulator"}>Konsultasikan pilihan <ArrowRight size={16} /></a>
            <p className="summary-disclaimer">Ini estimasi awal, bukan invoice. Lingkup kerja dan jadwal perlu dikonfirmasi sebelum persetujuan.</p>
          </aside>
        </div>
      </section>

      <section className="workspace-section">
        <div className="section workspace-inner">
          <div className="workspace-copy"><p className="eyebrow">04 — RUANG KERJA</p><h2>Progres skripsi lebih <em>mudah dipantau.</em></h2><p>Alur kerja ThesisLab berfokus pada hal yang perlu diketahui pelanggan: status pesanan, dokumen yang dibutuhkan, catatan revisi, dan langkah selanjutnya.</p><ul><li><Check size={16} /> Status pesanan yang mudah ditemukan</li><li><Check size={16} /> Dokumen terhubung dengan kebutuhan proyek</li><li><Check size={16} /> Catatan revisi dan tindak lanjut yang jelas</li></ul><a href="/register" className="button button-dark">Mulai dengan akun <ArrowRight size={16} /></a></div>
          <div className="workspace-paper"><div className="paper-header"><span>RUANG KERJA / CONTOH ALUR</span><span className="paper-status"><span /> Perlu ditinjau</span></div><h3>Dokumen penelitian</h3><p className="paper-subtitle">Daftar tindak lanjut untuk satu proyek</p><div className="paper-task"><span className="task-box task-done"><Check size={12} /></span><div><strong>Pedoman penulisan kampus</strong><small>Dokumen acuan</small></div><span className="task-state">Diterima</span></div><div className="paper-task"><span className="task-box" /><div><strong>Dataset penelitian</strong><small>Perlu dikonfirmasi</small></div><span className="task-state task-pending">Menunggu</span></div><div className="paper-task"><span className="task-box" /><div><strong>Catatan pembimbing</strong><small>Untuk menyamakan ruang lingkup</small></div><span className="task-state task-pending">Menunggu</span></div><div className="paper-note"><FileText size={17} /><span>Contoh tampilan konseptual — status proyek sebenarnya ditampilkan di akun pelanggan.</span></div></div>
        </div>
      </section>

      <section id="faq" className="section faq-section"><div className="faq-heading"><p className="eyebrow">05 — FAQ</p><h2>Pertanyaan sebelum<br />memulai.</h2></div><div className="faq-list">{faqs.map(([question, answer], index) => <article key={question} className="faq-item"><button type="button" onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}><span>{question}</span><ChevronDown size={18} className={openFaq === index ? "faq-chevron faq-chevron-open" : "faq-chevron"} /></button>{openFaq === index && <p>{answer}</p>}</article>)}</div></section>

      <section className="closing-band"><div><p className="eyebrow">LANGKAH BERIKUTNYA</p><h2>Mulai dari bagian yang paling membutuhkan perhatian.</h2></div><a href="#kalkulator" className="button button-paper">Cek estimasi biaya <ArrowRight size={16} /></a></section>
      <footer className="site-footer"><a href="#" className="wordmark"><span className="wordmark-mark"><BookOpen size={17} /></span><span>thesis<span className="wordmark-light">lab</span></span></a><p>Pendampingan akademik dengan ruang lingkup yang jelas.</p><a href="#kalkulator">Lihat estimasi <ArrowRight size={14} /></a></footer>
    </main>
  );
}
