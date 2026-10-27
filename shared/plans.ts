/**
 * Quy tắc gói cước — dùng chung cho website (hiển thị) và backend (tính hạn dùng, giới hạn máy).
 * App desktop nhận các giá trị này qua API `/api/app/entitlement`, không tự định nghĩa lại.
 */
export type PlanId = "month" | "year" | "lifetime";

export type PlanRule = {
  id: PlanId;
  name: string;
  /** Giá (VND) dùng để tạo đơn & đối soát chuyển khoản */
  amount: number;
  /** Số ngày sử dụng mỗi lần mua; null = vĩnh viễn */
  days: number | null;
  /** Số máy tính được đăng nhập cùng lúc */
  maxDevices: number;
  /** Thứ hạng để so sánh khi nâng cấp */
  rank: number;
};

export const PLAN_RULES: Record<PlanId, PlanRule> = {
  month: { id: "month", name: "Gói Tháng", amount: 399_000, days: 30, maxDevices: 1, rank: 1 },
  year: { id: "year", name: "Gói Năm", amount: 2_990_000, days: 365, maxDevices: 2, rank: 2 },
  lifetime: { id: "lifetime", name: "Vĩnh Viễn / Agency", amount: 6_990_000, days: null, maxDevices: 5, rank: 3 },
};

export const isPlanId = (v: unknown): v is PlanId => typeof v === "string" && v in PLAN_RULES;

/** 399000 → "399.000" */
export const formatVnd = (n: number) => n.toLocaleString("vi-VN").replace(/,/g, ".");
