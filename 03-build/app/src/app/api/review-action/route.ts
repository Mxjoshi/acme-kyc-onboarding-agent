// Records an officer's decision on a case in the review queue (human-in-the-loop).
import { setRecordStatus, reopenRecord, listRecords } from "../../../lib/store.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED = ["Approved & onboarded", "Declined", "Documents requested", "Kept for review"];

export async function POST(request: Request) {
  const { case_id, status, note } = await request.json();
  if (!case_id) return Response.json({ error: "missing case_id" }, { status: 400 });
  if (status === "Reopen") {
    reopenRecord(case_id);
    return Response.json({ records: listRecords() });
  }
  if (!ALLOWED.includes(status)) return Response.json({ error: "invalid action" }, { status: 400 });
  setRecordStatus(case_id, status, typeof note === "string" ? note.slice(0, 300) : "");
  return Response.json({ records: listRecords() });
}
