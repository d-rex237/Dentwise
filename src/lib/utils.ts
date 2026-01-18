import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateAvatar(name: string, gender: "MALE" | "FEMALE") {
  // 1. Clean the name for the URL (removes spaces and special chars)
  const seed = encodeURIComponent(name.trim().toLowerCase());

  // 2. Use DiceBear 'avataaars' style
  // We can vary the 'seed' so each doctor gets a unique face
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
}

// phone formatting function for US numbers - ai generated 🎉
export const formatPhoneNumber = (value: string) => {
  // 1. Remove everything except digits
  const digits = value.replace(/[^\d]/g, "");

  // 2. Ensure we always start with 237
  // If the user deletes everything, we reset to 237
  let raw = digits;
  if (!digits.startsWith("237")) {
    raw = "237" + digits;
  }

  // 3. We only care about the first 12 digits (237 + 9 local digits)
  const clean = raw.slice(0, 12);
  const len = clean.length;

  // 4. Formatting logic (+237 6xx xxx xxx)
  if (len <= 3) {
    return `+${clean}`;
  }
  if (len <= 6) {
    // +237 6xx
    return `+${clean.slice(0, 3)} ${clean.slice(3)}`;
  }
  if (len <= 9) {
    // +237 6xx xxx
    return `+${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6)}`;
  }
  // +237 6xx xxx xxx
  return `+${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(
    6,
    9,
  )} ${clean.slice(9, 12)}`;
};
