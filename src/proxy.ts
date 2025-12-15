// import type { NextRequest } from 'next/server'
// import { NextResponse } from 'next/server'
// import { updateSession } from './lib/supabase/proxy'

// export async function proxy(req: NextRequest) {
//     const url = req.nextUrl

//     if (url.pathname.startsWith('/feed')) {
//         const res = await fetch(new URL('/api/access-check', req.url), {
//             headers: { cookie: req.headers.get('cookie') ?? '' },
//             cache: 'no-store'
//         })
//         const { allowed } = await res.json()
//         if (!allowed) {
//             url.pathname = '/locked'
//             return NextResponse.redirect(url)
//         }
//     }

//     if (url.pathname.match("/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)")) {
//         const response = await updateSession(req)
//         return response
//     }

//     return NextResponse.next()
// }

import { updateSession } from "@/lib/supabase/proxy"
import { type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
}