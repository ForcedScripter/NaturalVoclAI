import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "aura-secret-key-change-in-production";

export async function GET(req: NextRequest) {
    const token = req.cookies.get("aura_token")?.value;

    if (!token) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
        // Decode the JWT payload (base64url) to extract username
        const parts = token.split(".");
        if (parts.length !== 3) {
            throw new Error("Invalid token format");
        }

        const payload = JSON.parse(
            Buffer.from(parts[1], "base64url").toString("utf-8")
        );

        // Check expiration
        if (payload.exp && payload.exp * 1000 < Date.now()) {
            const response = NextResponse.json({ error: "Token expired" }, { status: 401 });
            response.cookies.delete("aura_token");
            return response;
        }

        return NextResponse.json({ username: payload.sub });
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}
