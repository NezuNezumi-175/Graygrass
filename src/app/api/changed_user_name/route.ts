import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    const supabase = await createClient()
    const { name } = await req.json();
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId || !name) {
        return NextResponse.json(
            { error: "userId and name are required" },
            { status: 400 }
        );
    }

    const { error } = await supabase
        .from("profiles")
        .update({ name })
        .eq("id", userId);

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json({ message: "Name updated successfully" });
}
