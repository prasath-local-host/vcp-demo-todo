export const dynamic = 'force-dynamic';
export function GET() {
  return Response.json({ status: 'ok', revision: process.env.VCP_SOURCE_REVISION ?? 'local' });
}
