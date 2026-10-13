import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ThesisLab — Pendampingan Akademik",
  description: "Pendampingan skripsi, analisis data, dan penyuntingan naskah dengan ruang lingkup, estimasi biaya, serta alur kerja yang jelas."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
