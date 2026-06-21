// In-memory decisions log for the demo. Powers the dashboard, review queue, and audit log.
// Resets when the dev server restarts (fine for a demo; a real build would use a database).

const records = [];
let seq = 0;

export function addRecord(rec) {
  seq += 1;
  const full = {
    case_id: `ACME-${String(seq).padStart(4, "0")}`,
    ts: new Date().toISOString(),
    ...rec,
  };
  records.unshift(full); // newest first
  return full;
}

export function listRecords() {
  return records;
}

export function clearRecords() {
  records.length = 0;
  seq = 0;
}

// Undo an officer's action so the case returns to the review queue (resubmit).
export function reopenRecord(case_id) {
  const rec = records.find((r) => r.case_id === case_id);
  if (rec) {
    delete rec.officer_status;
    delete rec.officer_note;
    delete rec.officer_ts;
    delete rec.officer;
  }
  return rec;
}

// Record an officer's action (and optional note) on a case (the human-in-the-loop step).
export function setRecordStatus(case_id, officer_status, note) {
  const rec = records.find((r) => r.case_id === case_id);
  if (rec) {
    rec.officer_status = officer_status;
    rec.officer_note = (note || "").trim();
    rec.officer_ts = new Date().toISOString();
    rec.officer = "R. Al Mansoori";
  }
  return rec;
}
