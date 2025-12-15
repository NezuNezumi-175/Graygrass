import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
    const url = req.nextUrl

    if (url.pathname.startsWith('/feed')) {
        const res = await fetch(new URL('/api/access-check', req.url), {
            headers: { cookie: req.headers.get('cookie') ?? '' },
            cache: 'no-store'
        })
        const { allowed } = await res.json()
        if (!allowed) {
            url.pathname = '/locked'
            return NextResponse.redirect(url)
        }
    }
    return NextResponse.next()
}

