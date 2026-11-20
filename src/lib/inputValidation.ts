const EMAIL_PATTERN = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>.]+$/;
const NAME_PATTERN = /^[\p{L}\p{M}]+(?:[ '\u2019.\-][\p{L}\p{M}]+)*$/u;
export const ALUMNI_NAME_MIN_LENGTH = 10;
export const ALUMNI_NAME_MAX_LENGTH = 15;

export function sanitizeNameInput(value: string): string {
  return value.replace(/[^\p{L}\p{M} '\u2019.\-]/gu, "");
}

export function sanitizeIndianMobileInput(value: string): string {
  return value.replace(/\D/g, "");
}

export function validateIndianMobile(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return "Mobile number is required.";
  return /^\d{10}$/.test(value.trim()) ? null : "Enter exactly 10 digits for the mobile number.";
}

export function validateFullName(value: unknown, maxLength = 200): string | null {
  if (typeof value !== "string" || !value.trim()) return "Full name is required.";
  const name = value.trim();
  if (name.length > maxLength) return `Full name must be ${maxLength} characters or fewer.`;
  if (!NAME_PATTERN.test(name)) return "Use letters, spaces, hyphens, apostrophes, or initials in the name.";
  return null;
}

export function validateAlumniName(value: unknown): string | null {
  const error = validateFullName(value, ALUMNI_NAME_MAX_LENGTH);
  if (error) {
    if (typeof value === "string" && Array.from(value.trim()).length > ALUMNI_NAME_MAX_LENGTH) {
      return `Full name must be between ${ALUMNI_NAME_MIN_LENGTH} and ${ALUMNI_NAME_MAX_LENGTH} characters.`;
    }
    return error;
  }
  const name = (value as string).trim();
  if (Array.from(name).length < ALUMNI_NAME_MIN_LENGTH) {
    return `Full name must be between ${ALUMNI_NAME_MIN_LENGTH} and ${ALUMNI_NAME_MAX_LENGTH} characters.`;
  }
  return null;
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function validateEmail(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return "Email is required.";
  const email = normalizeEmail(value);
  const atIndex = email.lastIndexOf("@");
  const localPart = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);
  const domainLabels = domain.split(".");
  if (
    email.length > 254 ||
    !EMAIL_PATTERN.test(email) ||
    localPart.startsWith(".") || localPart.endsWith(".") || localPart.includes("..") ||
    domainLabels.some((label) => !label || label.startsWith("-") || label.endsWith("-"))
  ) return "Enter a valid email address.";
  return null;
}

export function validatePhone(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return "Phone number is required.";
  const compact = value.trim().replace(/[\s().-]/g, "");
  if (!/^[+]?\d+$/.test(compact)) return "Enter a valid phone number.";

  if (compact.startsWith("+91")) {
    return /^\+91\d{10}$/.test(compact) ? null : "Enter a 10-digit Indian mobile number after +91.";
  }
  if (/^\d{10}$/.test(compact)) return null;
  if (/^\+[1-9]\d{7,14}$/.test(compact)) return null;
  return "Enter a valid 10-digit Indian mobile number or international number.";
}

export function validateGraduationYear(value: unknown): string | null {
  if (typeof value !== "string" && typeof value !== "number") return "Graduation year must be a four-digit year.";
  const year = String(value).trim();
  const numeric = Number(year);
  if (!/^\d{4}$/.test(year) || numeric < 1900 || numeric > 2100) {
    return "Enter a four-digit graduation year between 1900 and 2100.";
  }
  return null;
}

export function validateIntegerRange(value: unknown, min: number, max: number, label: string): string | null {
  if (typeof value !== "number" && typeof value !== "string") return `${label} must be a whole number.`;
  if (typeof value === "string" && !/^-?\d+$/.test(value.trim())) return `${label} must be a whole number.`;
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < min || number > max) {
    return `${label} must be between ${min} and ${max}.`;
  }
  return null;
}

export function validateDateOnly(value: unknown, options: { notFuture?: boolean } = {}): string | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Enter a valid date.";
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return "Enter a valid date.";
  }
  if (options.notFuture && date.getTime() > Date.now()) return "Date cannot be in the future.";
  return null;
}

export function validateText(value: unknown, label: string, maxLength: number, required = false): string | null {
  if (value === undefined || value === null) return required ? `${label} is required.` : null;
  if (typeof value !== "string") return `${label} must be text.`;
  if (required && !value.trim()) return `${label} is required.`;
  if (value.length > maxLength) return `${label} must be ${maxLength} characters or fewer.`;
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value)) return `${label} contains unsupported control characters.`;
  return null;
}

export function validateSafeUrl(value: unknown, label: string, maxLength = 2048): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || value.length > maxLength || /[\u0000-\u0020\u007F]/.test(value)) {
    return `${label} must be a valid URL or local path.`;
  }
  if (value.startsWith("/")) return value.startsWith("//") ? `${label} must be a local path or HTTP(S) URL.` : null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? null : `${label} must use HTTP or HTTPS.`;
  } catch {
    return `${label} must be a valid URL or local path.`;
  }
}

export function validateAlumniProfileInput(value: unknown): string | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "Request body must be a JSON object.";
  const body = value as Record<string, unknown>;
  const nameError = validateAlumniName(body.name);
  if (nameError) return nameError;
  const emailError = validateEmail(body.email);
  if (emailError) return emailError;

  if (body.phone !== undefined && body.phone !== null && body.phone !== "") {
    const phoneError = validateIndianMobile(body.phone);
    if (phoneError) return phoneError;
    const phoneTextError = validateText(body.phone, "Phone number", 30, true);
    if (phoneTextError) return phoneTextError;
  }

  for (const key of ["department", "dept", "department_name"]) {
    const error = validateText(body[key], "Department", 150);
    if (error) return error;
  }
  if (body.department_id !== undefined && body.department_id !== null && body.department_id !== "") {
    const error = validateIntegerRange(body.department_id, 1, 2147483647, "Department");
    if (error) return error;
  }

  const textFields: Array<[string, string, number, boolean?]> = [
    ["degree", "Degree", 50],
    ["institute", "Institute", 200],
    ["company", "Company", 200],
    ["role", "Job title", 200],
    ["industry", "Industry", 100],
    ["location", "Location", 200],
    ["bio", "Biography", 500],
  ];
  for (const [key, label, max, required] of textFields) {
    const error = validateText(body[key], label, max, required);
    if (error) return error;
  }

  const year = body.graduation_year ?? body.year;
  if (year !== undefined && year !== null && year !== "") {
    const yearError = validateGraduationYear(year);
    if (yearError) return yearError;
  }

  if (body.experience_years !== undefined && body.experience_years !== null && body.experience_years !== "") {
    const error = validateIntegerRange(body.experience_years, 0, 32767, "Experience");
    if (error) return error;
  }

  if (body.dob !== undefined && body.dob !== null && body.dob !== "") {
    const error = validateDateOnly(body.dob, { notFuture: true });
    if (error) return `Date of birth: ${error.toLowerCase()}`;
  }

  if (body.gender !== undefined && body.gender !== null && body.gender !== "") {
    if (typeof body.gender !== "string" || !["male", "female", "other", "prefer_not_to_say"].includes(body.gender.toLowerCase())) {
      return "Select a valid gender option.";
    }
  }
  if (body.verification_method !== undefined && body.verification_method !== null && body.verification_method !== "") {
    const methods = ["email", "mobile", "enrollment_number", "admin_approval", "linkedin"];
    if (typeof body.verification_method !== "string" || !methods.includes(body.verification_method.toLowerCase())) {
      return "Select a valid verification method.";
    }
  }

  for (const key of ["linkedin_url", "linkedin", "avatar_url", "avatar"]) {
    const error = validateSafeUrl(body[key], key.startsWith("linkedin") ? "LinkedIn URL" : "Avatar URL");
    if (error) return error;
  }

  for (const [key, maxLength] of [["skills", 100], ["achievements", 300]] as const) {
    const items = body[key];
    if (items === undefined || items === null) continue;
    if (!Array.isArray(items) || items.length > 50) return `${key} must contain no more than 50 entries.`;
    for (const item of items) {
      const error = validateText(item, key === "skills" ? "Skill" : "Achievement", maxLength, true);
      if (error) return error;
    }
  }

  return null;
}
