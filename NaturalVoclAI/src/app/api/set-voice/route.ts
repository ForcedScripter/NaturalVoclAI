import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const token = req.cookies.get("aura_token")?.value;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Connection": "keep-alive",
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    try {
        const res = await fetch(`${process.env.BACKEND_URL}/set-voice`, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch {
        return NextResponse.json(
            { error: "Failed to set voice" },
            { status: 500 }
        );
    }
}
