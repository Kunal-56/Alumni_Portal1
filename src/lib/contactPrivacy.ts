export function maskEmail(email?: string | null): string | null {
  if (!email) return null;
  const trimmed = email.trim();
  const at = trimmed.lastIndexOf("@");
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  if (at <= 0 || !domain || domain.includes("@")) return "***";
  const labels = domain.split(".");
  const host = labels[0] || "";
  const suffix = labels.slice(1).join(".");
  const maskedHost = host.length <= 1 ? "*" : `${host.slice(0, 1)}***`;
  return `${local.slice(0, 1)}***@${maskedHost}${suffix ? `.${suffix}` : ""}`;
}

export function maskPhone(phone?: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "****";
  return `${"*".repeat(Math.max(digits.length - 4, 4))}${digits.slice(-4)}`;
}

export function presentDirectoryContact<T extends Record<string, unknown>>(
  row: T,
  isAdmin: boolean
): T & { contactMasked: boolean } {
  if (isAdmin) return { ...row, contactMasked: false };
  return {
    ...row,
    email: maskEmail(typeof row.email === "string" ? row.email : null),
    phone: maskPhone(typeof row.phone === "string" ? row.phone : null),
    dob: null,
    gender: null,
    contactMasked: true,
  };
}
