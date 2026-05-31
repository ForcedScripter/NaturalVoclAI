import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    try {
        const res = await fetch(`${process.env.BACKEND_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(data, { status: res.status });
        }

        // Set JWT as httpOnly cookie
        const response = NextResponse.json(
            { message: "Login successful" },
            { status: 200 }
        );

        response.cookies.set("aura_token", data.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24, // 24 hours
        });

        return response;
    } catch {
        return NextResponse.json(
            { error: "Backend unreachable" },
            { status: 502 }
        );
    }
}
