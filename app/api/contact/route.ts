import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    console.log("[Contact Form]", { name, email, phone, subject, message, createdAt: new Date().toISOString() });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to process contact form" }, { status: 500 });
  }
}
