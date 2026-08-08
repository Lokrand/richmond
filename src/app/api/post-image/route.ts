import { NextRequest, NextResponse } from 'next/server';

const baseS3Url = new URL(process.env.NEXT_PUBLIC_BASE_S3_URL ?? 'http://localhost:9900');

export async function GET(request: NextRequest) {
    const source = request.nextUrl.searchParams.get('url');
    if (!source) return new NextResponse('Missing image URL', { status: 400 });

    let imageUrl: URL;
    try {
        imageUrl = new URL(source);
    } catch {
        return new NextResponse('Invalid image URL', { status: 400 });
    }

    if (imageUrl.origin !== baseS3Url.origin || !imageUrl.pathname.startsWith('/main/')) {
        return new NextResponse('Image URL is not allowed', { status: 400 });
    }

    const response = await fetch(imageUrl);
    if (!response.ok) return new NextResponse('Image not found', { status: response.status });

    return new NextResponse(response.body, {
        headers: {
            'Cache-Control': 'no-store',
            'Content-Type': response.headers.get('content-type') ?? 'application/octet-stream',
        },
    });
}
