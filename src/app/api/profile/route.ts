import crypto from 'node:crypto';

function getGravatarUrl(email: string, size = 80) {
    const trimmedEmail = email.trim().toLowerCase();
    const hash = crypto.createHash('sha256').update(trimmedEmail).digest('hex');
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}

export const dynamic = 'force-dynamic' // defaults to auto
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const refId = searchParams.get('refId')
    const size = searchParams.get('size')

    if (email === null || refId === null) {
        return new Response('Missing email or refId', { status: 400 })
    }

    // Fetch the user's Gravatar image
    const gravatarUrl = getGravatarUrl(email, Number.parseInt(size || "80"))
    console.log(gravatarUrl)

    try {
        const response = await fetch(gravatarUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch image');
        }
        const arrayBuffer = await response.arrayBuffer();
        const imageBuffer = Buffer.from(arrayBuffer);

        return new Response(imageBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/jpeg', // Adjust the MIME type as necessary
                'Content-Length': imageBuffer.length.toString(),
            },
        });
    } catch (error) {
        console.error(error);
        return new Response('Error fetching image', { status: 500 });
    }
}
