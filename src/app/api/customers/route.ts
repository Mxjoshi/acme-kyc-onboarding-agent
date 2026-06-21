// Returns the onboarding work queue: each customer's profile and their uploaded documents.
import customersData from "../../../data/customers.json";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({ customers: customersData.customers });
}
