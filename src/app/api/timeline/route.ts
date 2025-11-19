import { NextResponse } from "next/server";
import data from "@/data/timeline.json";

// export const revalidate = 3600;

export async function GET() {
  return NextResponse.json(data);
}
