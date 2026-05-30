import path from "node:path";
import { NextResponse } from "next/server";
import { listHtmlPages } from "@/lib/pages";

export const dynamic = "force-dynamic";

export async function GET() {
  const directory = path.join(process.cwd(), "public", "single-pages");
  const pages = await listHtmlPages(directory);

  return NextResponse.json({ pages });
}
