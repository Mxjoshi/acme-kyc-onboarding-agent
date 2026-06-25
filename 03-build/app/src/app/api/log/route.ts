// Returns (and can clear) the decisions log that powers the dashboard, review queue, and audit views.
import { listRecords, clearRecords } from "../../../lib/store.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ records: listRecords() });
}

export async function DELETE() {
  clearRecords();
  return Response.json({ records: [] });
}
