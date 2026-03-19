import { BaseApiResponse } from "@/types/baseApi";
import { NextResponse } from "next/server";

export function ok<T>(data: T, message = "success", status = 200) {
  return NextResponse.json(BaseApiResponse.ok(data, message), { status });
}

export function fail(message = "error", status = 500) {
  return NextResponse.json(BaseApiResponse.error(message), { status });
}
