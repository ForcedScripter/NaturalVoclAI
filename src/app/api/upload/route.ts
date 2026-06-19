import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const token = req.cookies.get("aura_token")?.value;

    const headers: Record<string, string> = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    // Extract user_id from formData to forward as session_id query param
    const userId = formData.get("user_id") as string || "ws-session";

    try {
        const res = await fetch(`${process.env.BACKEND_URL}/upload?session_id=${encodeURIComponent(userId)}`, {
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

