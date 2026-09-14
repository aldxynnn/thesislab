"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, BadgeCheck, BarChart3, BookOpen, Check, ChevronDown,
  CircleDollarSign, Clock3, FileCheck2, FileText, GraduationCap,
  LayoutDashboard, LockKeyhole, Menu, MessageCircle, PackageCheck,
  PenLine, ShieldCheck, Sparkles, UploadCloud, WalletCards, X, Zap
} from "lucide-react";

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const serviceIcons: Record<string, any> = {
  bab1: BookOpen,
  bab2: FileText,
  bab3: PenLine,
  bab4: BarChart3,
  bab5: FileCheck2,
  olah: BarChart3,
  editing: PenLine,
  format: FileCheck2,
};

type Service = {
  id: string;
  name: string;
  category?: string | null;
  price: number;
  description?: string | null;
  icon: any;
  popular?: boolean;
};

const perks = [
  {
    icon: ShieldCheck,
    title: "Privasi terjaga",
    text: "Dokumen diperlakukan sebagai materi kerja privat.",
  },
  {
    icon: Clock3,
    title: "Timeline transparan",
    text: "Estimasi proses dikonfirmasi sebelum pekerjaan dimulai.",
  },
  {
    icon: MessageCircle,
    title: "Komunikasi langsung",
    text: "Progress dan catatan revisi tidak dibuat membingungkan.",
  },
  {
    icon: BadgeCheck,
    title: "Scope jelas",
    text: "Pelanggan tahu apa yang termasuk dan tidak termasuk layanan.",
  },
];

const faqs = [
  [
    "Bisa pilih hanya satu bab?",
    "Bisa. Kalkulator dibuat modular, jadi kamu dapat memilih hanya Bab 1, Bab 4, analisis data, atau kombinasi layanan yang memang dibutuhkan.",
  ],
  [
    "Apakah estimasi di kalkulator adalah harga final?",
    "Estimasi menjadi acuan awal. Harga final dapat menyesuaikan tingkat kompleksitas data, jumlah halaman, deadline, dan kondisi dokumen setelah brief diperiksa.",
  ],
  [
    "Apakah bisa bantu SPSS dan Excel?",
    "Bisa untuk pendampingan pengolahan data, pemeriksaan output, interpretasi statistik, dan penyusunan pembahasan berbasis hasil yang tersedia.",
  ],
  [
    "Bagaimana proses revisinya?",
    "Catatan revisi dimasukkan ke ruang kerja yang sama agar status, file, dan progres lebih mudah dilacak.",
  ],
];

export default function Home() {
  const [open, setOpen] = useState<number | null>(0);
  const [mobile, setMobile] = useState(false);

  const [chapterServices, setChapterServices] = useState<Service[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [speed, setSpeed] = useState<"normal" | "priority">("normal");
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch("/api/services", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Gagal mengambil layanan");
        }

        const json = await res.json();

        const services: Service[] = (json.services || []).map(
          (service: any) => ({
            ...service,
            price: Number(service.price) || 0,
            icon: serviceIcons[service.id] || FileText,
            popular: service.id === "bab4",
          })
        );

        setChapterServices(services);

        // Default pilihan: Bab 4 + Analisis Data jika tersedia
        const defaultSelected = ["bab4", "olah"].filter((id) =>
          services.some((service) => service.id === id)
        );

        setSelected(defaultSelected);
      } catch (error) {
        console.error("Gagal memuat layanan:", error);
        setChapterServices([]);
        setSelected([]);
      } finally {
        setLoadingServices(false);
      }
    }

    loadServices();
  }, []);

  const price = useMemo(() => {
    const subtotal = chapterServices
      .filter((s) => selected.includes(s.id))
      .reduce((total, service) => total + Number(service.price || 0), 0);

    const bundleDiscount =
      selected.length >= 4
        ? Math.round(subtotal * 0.1)
        : selected.length >= 3
          ? Math.round(subtotal * 0.05)
          : 0;

    const afterDiscount = subtotal - bundleDiscount;

    const priorityFee =
      speed === "priority" ? Math.round(afterDiscount * 0.2) : 0;

    return {
      subtotal,
      bundleDiscount,
      priorityFee,
      total: afterDiscount + priorityFee,
    };
  }, [chapterServices, selected, speed]);

  const toggleService = (id: string) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id]
    );
  };

  const orderText = encodeURIComponent(
    `Halo ThesisLab, saya ingin konsultasi layanan:\n\n${chapterServices
      .filter((s) => selected.includes(s.id))
      .map(
        (s) =>
          `• ${s.name} — ${rupiah.format(Number(s.price || 0))}`
      )
      .join("\n")}\n\nKecepatan: ${
      speed === "priority" ? "Priority" : "Normal"
    }\nEstimasi: ${rupiah.format(
      price.total
    )}\n\nSaya ingin lanjut konsultasi.`
  );

  const waNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281296895924";

  const wa = `https://wa.me/${waNumber.replace(/\D/g, "")}?text=${orderText}`;

  return (
    <main className="overflow-hidden">
      <nav className="fixed top-0 z-50 w-full border-b border-white/70 glass-dark">
        <div className="container-x flex h-20 items-center justify-between">
          <a
            href="#"
            className="flex items-center gap-2 text-xl font-black tracking-tight text-white"
          >
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-lg shadow-violet-950/30">
              <GraduationCap size={21} />
            </span>
            Thesis<span className="text-violet-300">Lab</span>
          </a>

          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-300 md:flex">
            <a href="#layanan" className="hover:text-white">
              Layanan
            </a>
            <a href="#kalkulator" className="hover:text-white">
              Kalkulator
            </a>
            <a href="#dashboard" className="hover:text-white">
              Dashboard
            </a>
            <a href="#faq" className="hover:text-white">
              FAQ
            </a>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href="/login"
              className="rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-white"
            >
              Masuk
            </a>
            <a
              href="/register"
              className="rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950"
            >
              Daftar{" "}
              <ArrowRight size={16} className="ml-2 inline" />
            </a>
          </div>

          <button
            onClick={() => setMobile(!mobile)}
            className="text-white md:hidden"
            aria-label="Menu"
          >
            {mobile ? <X /> : <Menu />}
          </button>
        </div>

        {mobile && (
          <div className="border-t border-white/10 bg-slate-950 px-5 py-5 text-white md:hidden">
            <div className="space-y-4">
              {["layanan", "kalkulator", "dashboard", "faq"].map((x) => (
                <a
                  key={x}
                  href={`#${x}`}
                  onClick={() => setMobile(false)}
                  className="block capitalize"
                >
                  {x}
                </a>
              ))}

              <div className="flex gap-3 pt-2">
                <a
                  href="/login"
                  className="rounded-xl border border-white/15 px-4 py-3 font-bold"
                >
                  Masuk
                </a>
                <a
                  href="/register"
                  className="rounded-xl bg-white px-4 py-3 font-black text-slate-950"
                >
                  Daftar
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      <section className="premium-hero relative pt-36 pb-24 text-white md:pt-44 md:pb-32">
        <div className="orb orb-one" />
        <div className="orb orb-two" />

        <div className="container-x relative z-10 grid items-center gap-14 lg:grid-cols-[1.08fr_.92fr]">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-400/10 px-4 py-2 text-sm font-bold text-violet-200 backdrop-blur-xl">
              <Sparkles size={15} />
              Academic support, redesigned.
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[.98] tracking-[-.05em] md:text-7xl xl:text-[82px]">
              Pendampingan skripsi yang terasa{" "}
              <span className="premium-text">premium.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              Pilih kebutuhan per bab, lihat estimasi harga secara langsung,
              kirim brief, dan pantau progres dalam satu alur yang lebih
              profesional.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#kalkulator"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-black text-slate-950 shadow-2xl shadow-violet-900/20"
              >
                Hitung Estimasi <ArrowRight size={18} />
              </a>

              <a
                href="#dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 font-bold text-white backdrop-blur-xl"
              >
                Lihat Dashboard <LayoutDashboard size={18} />
              </a>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-7">
              <div>
                <div className="text-2xl font-black">
                  {chapterServices.length || "8"}+
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  Layanan modular
                </div>
              </div>

              <div>
                <div className="text-2xl font-black">Real-time</div>
                <div className="mt-1 text-xs text-slate-400">
                  Estimasi biaya
                </div>
              </div>

              <div>
                <div className="text-2xl font-black">1 ruang</div>
                <div className="mt-1 text-xs text-slate-400">
                  Progress & revisi
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="device-shell">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <div className="flex gap-2">
                  <span className="dot bg-rose-400" />
                  <span className="dot bg-amber-300" />
                  <span className="dot bg-emerald-400" />
                </div>

                <span className="text-xs font-semibold text-slate-500">
                  client.thesislab.id
                </span>

                <span />
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-[150px_1fr]">
                <aside className="hidden rounded-2xl bg-white/[.035] p-4 sm:block">
                  <div className="mb-5 h-8 rounded-xl bg-white/[.05]" />

                  {["Overview", "Pesanan", "Dokumen", "Revisi"].map(
                    (x, i) => (
                      <div
                        key={x}
                        className={`mb-2 rounded-lg px-3 py-2 text-xs ${
                          i === 0
                            ? "bg-violet-500 text-white"
                            : "text-slate-500"
                        }`}
                      >
                        {x}
                      </div>
                    )
                  )}
                </aside>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-slate-500">
                      Selamat datang kembali,
                    </span>
                    <h3 className="text-xl font-black">
                      Project Skripsi
                    </h3>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      ["72%", "Progress"],
                      ["2", "Revisi"],
                      ["3", "File"],
                    ].map(([v, l]) => (
                      <div
                        key={l}
                        className="rounded-2xl border border-white/10 bg-white/[.035] p-4"
                      >
                        <b className="block text-lg">{v}</b>
                        <span className="text-[10px] text-slate-500">
                          {l}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[.035] p-5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">
                        Bab 4 — Analisis & Pembahasan
                      </span>
                      <b>72%</b>
                    </div>

                    <div className="mt-3 h-2 rounded-full bg-white/10">
                      <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
                    </div>

                    <div className="mt-5 space-y-3 text-xs">
                      <div className="flex items-center gap-3">
                        <Check
                          className="text-emerald-400"
                          size={15}
                        />
                        <span className="text-slate-300">
                          Output SPSS diperiksa
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Zap
                          className="text-violet-300"
                          size={15}
                        />
                        <span className="text-slate-300">
                          Interpretasi hasil sedang direview
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="float-card absolute -bottom-7 -left-6 hidden rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-xl md:block">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/10">
                  <PackageCheck
                    className="text-emerald-400"
                    size={20}
                  />
                </div>

                <div>
                  <b className="block text-sm">Status update</b>
                  <span className="text-xs text-slate-400">
                    Milestone baru selesai
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="layanan" className="bg-white py-24">
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">LAYANAN MODULAR</p>
            <h2 className="section-title">
              Pilih hanya yang kamu perlukan.
            </h2>
            <p className="section-copy">
              Tidak harus mengambil paket penuh. Setiap bagian punya scope dan
              estimasi harga tersendiri.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {perks.map(({ icon: Icon, title, text }) => (
              <div key={title} className="premium-card p-6">
                <div className="icon-box">
                  <Icon size={21} />
                </div>

                <h3 className="mt-5 font-black">{title}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="kalkulator" className="calc-section py-24">
        <div className="container-x">
          <div className="mb-12 max-w-3xl">
            <p className="eyebrow">SMART ESTIMATOR</p>

            <h2 className="section-title">
              Hitung estimasi dalam beberapa klik.
            </h2>

            <p className="section-copy">
              Centang layanan yang diperlukan. Total berubah otomatis dan
              diskon bundling diterapkan ketika memilih beberapa layanan.
            </p>
          </div>

          <div className="grid gap-7 lg:grid-cols-[1fr_420px]">
            <div className="grid gap-4 sm:grid-cols-2">
              {loadingServices ? (
                <div className="sm:col-span-2 rounded-3xl border border-slate-200 bg-white p-8 text-center">
                  <p className="text-sm font-semibold text-slate-500">
                    Memuat layanan...
                  </p>
                </div>
              ) : chapterServices.length === 0 ? (
                <div className="sm:col-span-2 rounded-3xl border border-slate-200 bg-white p-8 text-center">
                  <p className="text-sm font-semibold text-slate-500">
                    Layanan belum tersedia.
                  </p>
                </div>
              ) : (
                chapterServices.map(
                  ({
                    id,
                    name,
                    description,
                    price: servicePrice,
                    icon: Icon,
                    popular,
                  }) => {
                    const active = selected.includes(id);

                    return (
                      <button
                        key={id}
                        onClick={() => toggleService(id)}
                        className={`service-choice text-left ${
                          active ? "service-active" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div
                            className={`icon-box ${
                              active
                                ? "!bg-violet-600 !text-white"
                                : ""
                            }`}
                          >
                            <Icon size={20} />
                          </div>

                          <div
                            className={`check-circle ${
                              active ? "check-active" : ""
                            }`}
                          >
                            {active && <Check size={14} />}
                          </div>
                        </div>

                        <div className="mt-5 flex items-center gap-2">
                          <h3 className="font-black">{name}</h3>

                          {popular && (
                            <span className="rounded-full bg-violet-50 px-2 py-1 text-[10px] font-black text-violet-600">
                              POPULAR
                            </span>
                          )}
                        </div>

                        <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                          {description || "Detail layanan akan dikonfirmasi saat konsultasi."}
                        </p>

                        <div className="mt-5 text-xl font-black">
                          {rupiah.format(Number(servicePrice || 0))}
                        </div>
                      </button>
                    );
                  }
                )
              )}
            </div>

            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="summary-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black tracking-[.18em] text-violet-300">
                      RINGKASAN
                    </p>

                    <h3 className="mt-1 text-2xl font-black">
                      Estimasi pesanan
                    </h3>
                  </div>

                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10">
                    <WalletCards />
                  </div>
                </div>

                <div className="mt-7 space-y-3 border-y border-white/10 py-6">
                  {selected.length === 0 ? (
                    <p className="text-sm text-slate-400">
                      Belum ada layanan dipilih.
                    </p>
                  ) : (
                    chapterServices
                      .filter((s) => selected.includes(s.id))
                      .map((s) => (
                        <div
                          key={s.id}
                          className="flex justify-between gap-5 text-sm"
                        >
                          <span className="text-slate-300">
                            {s.name}
                          </span>

                          <b>
                            {rupiah.format(Number(s.price || 0))}
                          </b>
                        </div>
                      ))
                  )}
                </div>

                <div className="mt-6">
                  <p className="mb-3 text-sm font-bold">
                    Kecepatan pengerjaan
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSpeed("normal")}
                      className={`speed-btn ${
                        speed === "normal" ? "speed-active" : ""
                      }`}
                    >
                      <span className="block font-bold">
                        Normal
                      </span>
                      <span className="text-[10px] opacity-60">
                        Tanpa biaya tambahan
                      </span>
                    </button>

                    <button
                      onClick={() => setSpeed("priority")}
                      className={`speed-btn ${
                        speed === "priority" ? "speed-active" : ""
                      }`}
                    >
                      <span className="block font-bold">
                        Priority
                      </span>
                      <span className="text-[10px] opacity-60">
                        +20% estimasi
                      </span>
                    </button>
                  </div>
                </div>

                <div className="mt-6 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span>
                      {rupiah.format(price.subtotal)}
                    </span>
                  </div>

                  {price.bundleDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Diskon bundling</span>
                      <span>
                        -{rupiah.format(price.bundleDiscount)}
                      </span>
                    </div>
                  )}

                  {price.priorityFee > 0 && (
                    <div className="flex justify-between text-slate-400">
                      <span>Priority fee</span>
                      <span>
                        {rupiah.format(price.priorityFee)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-5">
                  <span className="text-sm text-slate-400">
                    Estimasi total
                  </span>

                  <strong className="text-3xl font-black">
                    {rupiah.format(price.total)}
                  </strong>
                </div>

                <a
                  href={
                    selected.length && !loadingServices
                      ? wa
                      : "#kalkulator"
                  }
                  className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 font-black ${
                    selected.length && !loadingServices
                      ? "bg-white text-slate-950"
                      : "pointer-events-none bg-white/10 text-slate-500"
                  }`}
                >
                  Lanjut konsultasi <ArrowRight size={17} />
                </a>

                <p className="mt-4 text-center text-[11px] leading-5 text-slate-500">
                  Estimasi bukan invoice final. Scope, kondisi file, dan
                  deadline akan diverifikasi sebelum konfirmasi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="dashboard" className="bg-white py-24">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="eyebrow">CLIENT EXPERIENCE</p>

            <h2 className="section-title">
              Pelanggan tidak perlu bertanya “sudah sampai mana?”.
            </h2>

            <p className="section-copy">
              Dashboard pelanggan dirancang untuk menampilkan status order,
              milestone, dokumen, catatan revisi, dan ringkasan pembayaran
              dalam satu tempat.
            </p>

            <div className="mt-8 space-y-4">
              {[
                [
                  LayoutDashboard,
                  "Progress & milestone",
                  "Pantau tahap pekerjaan tanpa chat berulang.",
                ],
                [
                  UploadCloud,
                  "Upload dokumen",
                  "Proposal, pedoman kampus, data, dan revisi tersusun per project.",
                ],
                [
                  MessageCircle,
                  "Catatan revisi",
                  "Feedback dan status revisi tercatat lebih rapi.",
                ],
                [
                  LockKeyhole,
                  "Area pelanggan",
                  "Ruang kerja privat untuk setiap order.",
                ],
              ].map(([Icon, title, text]: any) => (
                <div key={title} className="flex gap-4">
                  <div className="icon-box shrink-0">
                    <Icon size={20} />
                  </div>

                  <div>
                    <h3 className="font-black">{title}</h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-mock">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400">
                  ORDER #TL-2048
                </span>

                <h3 className="mt-1 text-xl font-black">
                  Pendampingan Bab 4
                </h3>
              </div>

              <span className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-600">
                In progress
              </span>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-4">
              <div className="dash-stat">
                <span>Progress</span>
                <b>72%</b>
              </div>

              <div className="dash-stat">
                <span>Estimasi selesai</span>
                <b>3 hari</b>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-5">
              <div className="mb-4 flex justify-between text-xs font-bold">
                <span>Milestone</span>
                <span>3 dari 4</span>
              </div>

              <div className="space-y-4">
                {[
                  ["Data diterima", true],
                  ["Output diperiksa", true],
                  ["Interpretasi dibuat", true],
                  ["Final review", false],
                ].map(([x, done]: any) => (
                  <div
                    key={x}
                    className="flex items-center gap-3 text-sm"
                  >
                    <div
                      className={`grid h-6 w-6 place-items-center rounded-full ${
                        done
                          ? "bg-emerald-500 text-white"
                          : "border border-slate-200 text-slate-300"
                      }`}
                    >
                      {done && <Check size={13} />}
                    </div>

                    <span
                      className={
                        done ? "font-semibold" : "text-slate-400"
                      }
                    >
                      {x}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <button className="rounded-2xl border border-slate-200 px-4 py-4 text-sm font-bold">
                Lihat dokumen
              </button>

              <button className="rounded-2xl bg-slate-950 px-4 py-4 text-sm font-bold text-white">
                Kirim revisi
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white">
        <div className="container-x flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black tracking-[.18em] text-violet-300">
              READY WHEN YOU ARE
            </p>

            <h2 className="mt-3 max-w-2xl text-4xl font-black tracking-tight">
              Mulai dari satu bab. Upgrade kapan saja jika dibutuhkan.
            </h2>

            <p className="mt-4 max-w-2xl text-slate-400">
              Gunakan kalkulator untuk membuat estimasi awal sebelum
              konsultasi.
            </p>
          </div>

          <a
            href="#kalkulator"
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-white px-6 py-4 font-black text-slate-950"
          >
            Buat estimasi <CircleDollarSign size={18} />
          </a>
        </div>
      </section>

      <section id="faq" className="bg-white py-24">
        <div className="container-x max-w-4xl">
          <div className="text-center">
            <p className="eyebrow">FAQ</p>

            <h2 className="section-title">
              Hal yang sering ditanyakan.
            </h2>
          </div>

          <div className="mt-12 divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white shadow-sm">
            {faqs.map(([q, a], i) => (
              <div key={q} className="p-6">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-5 text-left font-black"
                >
                  {q}

                  <ChevronDown
                    size={19}
                    className={`shrink-0 transition ${
                      open === i ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {open === i && (
                  <p className="mt-4 max-w-3xl pr-8 text-sm leading-7 text-slate-500">
                    {a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="container-x flex flex-col justify-between gap-5 text-sm text-slate-500 md:flex-row md:items-center">
          <div className="flex items-center gap-2 font-black text-slate-950">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-950 text-white">
              <GraduationCap size={16} />
            </span>
            ThesisLab
          </div>

          <p>© 2026 ThesisLab. Academic support platform.</p>

          <a
            href="#kalkulator"
            className="font-bold text-violet-600"
          >
            Cek harga →
          </a>
        </div>
      </footer>
    </main>
  );
}