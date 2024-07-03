export const dynamic = 'force-dynamic' // defaults to auto
export async function GET() {
    return new Response('Server is Running...', {
        headers: { 'content-type': 'text/plain' },
    })
}
