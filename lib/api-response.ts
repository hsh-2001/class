import { BaseApiResponse } from "@/types/baseApi";
import { EnumApiError } from "@/types/enum/enumApiError";
import { NextResponse } from "next/server";

export function ok<T>(data: T, message = "success", status = 200) {
  return NextResponse.json(BaseApiResponse.ok(data, message), { status });
}

const mappingApiErrorToMessage: Record<EnumApiError, string> = {
  [EnumApiError.MISSING_FIELDS]: "Please fill in all required fields.",
  [EnumApiError.EMAIL_ALREADY_EXISTS]: "The email address is already registered. Please use a different email.",
  [EnumApiError.FAILED_CREATE]: "Failed to create the student. Please try again later.",
  [EnumApiError.UNATHENTICATED]: "Unauthenticated. Please log in to continue.",
  [EnumApiError.INVALID_TOKEN]: "Invalid token. Please log in again.",
  [EnumApiError.INVALID_CREDENTIALS]: "Invalid email or password. Please try again."
};

export function fail(message = "error", status = 500) {
  if (Object.values(EnumApiError).includes(message as EnumApiError)) {
    message = mappingApiErrorToMessage[message as EnumApiError];
  }
  return NextResponse.json(BaseApiResponse.error(message), { status });
}
