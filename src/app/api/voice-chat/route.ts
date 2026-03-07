import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const token = req.cookies.get("aura_token")?.value;

    const headers: Record<string, string> = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    try {
        const res = await fetch(`${process.env.BACKEND_URL}/voice-chat`, {
            method: "POST",
            headers,
            body: formData,
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch {
        return NextResponse.json(
            { error: "Backend unreachable" },
            { status: 502 }
        );
    }
}
