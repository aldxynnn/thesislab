import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { adminSupabase } from "@/lib/supabase-admin";
import { calcTotal, defaultServices } from "@/lib/pricing";

export async function POST(req: Request) {
  try {
    const { user } = await requireUser();
    const fd = await req.formData();
    const title = String(fd.get("title") || "").trim();
    const notes = String(fd.get("notes") || "").trim();
    const ids = JSON.parse(String(fd.get("selected") || "[]"));
    const priority = String(fd.get("priority")) === "true";
    const voucherCode = String(fd.get("voucher") || "").trim().toUpperCase();
    if (!title) throw new Error("Judul kebutuhan wajib diisi");
    if (!Array.isArray(ids) || !ids.length) throw new Error("Pilih minimal satu layanan");

    const db = adminSupabase();
    const { data: sv } = await db.from("services").select("id,name,category,price,description").eq("active", true);
    const services = sv?.length ? sv : defaultServices;
    let voucherPct = 0;
    if (voucherCode) {
      const { data: v } = await db.from("vouchers").select("discount_pct,expires_at,active").eq("code", voucherCode).eq("active", true).single();
      if (!v) throw new Error("Kode voucher tidak valid");
      if (v.expires_at && new Date(v.expires_at) < new Date()) throw new Error("Voucher sudah kedaluwarsa");
      voucherPct = Number(v.discount_pct) || 0;
    }
    const t = calcTotal(services, ids, priority, voucherPct);
    const orderNo = "TL-" + Date.now().toString().slice(-8);
    const { data: order, error } = await db.from("orders").insert({ user_id:user.id, order_no:orderNo, title, notes, selected_services:ids, priority, subtotal:t.subtotal, bundle_discount:t.bundle, voucher_discount:t.voucher, priority_fee:t.priorityFee, total:t.total, status:"pending_payment", payment_status:"unpaid" }).select().single();
    if (error) throw error;
    const file = fd.get("file") as File | null;
    if (file?.size) {
      if (file.size > 20 * 1024 * 1024) throw new Error("File maksimal 20 MB");
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${user.id}/${order.id}/${safeName}`;
      const { error: up } = await db.storage.from("order-files").upload(path, file, { upsert:false });
      if (up) throw up;
      await db.from("order_files").insert({ order_id:order.id, user_id:user.id, path, name:file.name, size:file.size });
    }
    await db.from("notifications").insert({ user_id:user.id, order_id:order.id, title:"Order dibuat", body:`Order ${orderNo} berhasil dibuat dan menunggu pembayaran.` });
    return NextResponse.json({ order });
  } catch (e:any) {
    return NextResponse.json({ error:e.message || "Gagal membuat order" }, { status:e.message === "UNAUTHORIZED" ? 401 : 400 });
  }
}
