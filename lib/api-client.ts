// lib/api-client.ts
import type { OrderRow } from "./types";

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export async function apiDelete<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

/* ===== Bequeme Order-APIs (nutzen deine Helper) ===== */

export async function getOrders(params?: {
  status?: string;
  tenantId?: string;
  limit?: number;
  offset?: number;
}) {
  const q = new URLSearchParams();
  if (params?.status) q.set("status", params.status);
  if (params?.tenantId) q.set("tenantId", params.tenantId);
  if (params?.limit != null) q.set("limit", String(params.limit));
  if (params?.offset != null) q.set("offset", String(params.offset));
  return apiGet<{ ok: true; items: OrderRow[] }>(`/api/orders?${q.toString()}`);
}

export function getOrderById(id: number) {
  return apiGet<{ ok: true; item: OrderRow | null }>(`/api/orders/${id}`);
}

export function updateOrder(id: number, body: Partial<Pick<OrderRow, "status" | "remark">>) {
  return apiPut<{ ok: true; item: OrderRow }>(`/api/orders/${id}`, body);
}

export function deleteOrder(id: number, remark?: string) {
  return apiDelete<{ ok: true; item: OrderRow }>(`/api/orders/${id}`, remark ? { remark } : undefined);
}

export function createOrder(payload: Partial<OrderRow> & { tenant_id?: string; created_by?: string }) {
  // Backend erwartet tenantId/createdBy in camelCase:
  return apiPost<{ ok: true; order: OrderRow }>(`/api/orders`, {
    status: payload.status ?? "offen",
    shipper: payload.shipper ?? null,
    pickup_date: payload.pickup_date ?? null,
    dropoff_date: payload.dropoff_date ?? null,
    from_zip: payload.from_zip ?? null,
    to_zip: payload.to_zip ?? null,
    price_customer: payload.price_customer ?? null,
    price_carrier: payload.price_carrier ?? null,
    ldm: payload.ldm ?? null,
    weight_kg: payload.weight_kg ?? null,
    remark: payload.remark ?? null,
    carrier: payload.carrier ?? null,
    tenantId: payload.tenant_id ?? "TR",
    createdBy: payload.created_by ?? "admin",
  });
}
