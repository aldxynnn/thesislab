import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkripsiPro — Pendampingan Skripsi Profesional",
  description: "Konsultasi, analisis data, editing, dan pendampingan skripsi yang transparan dan profesional."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}