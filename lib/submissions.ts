export type SubmissionPayload = {
  form: "waitlist" | "design-partners" | "founder-conversations";
  data: Record<string, unknown>;
  timestamp?: string;
};

export async function saveSubmission(
  payload: SubmissionPayload,
): Promise<{ ok: boolean; message?: string }> {
  const timestamp = payload.timestamp || new Date().toISOString();
  const d = payload.data || {};

  // Flattened record supporting lowercase, camelCase, and Title Case headers in Google Sheets
  const flatRecord: Record<string, unknown> = {
    // CamelCase / lowercase
    timestamp,
    form: payload.form,
    email: d.email || "",
    name: d.name || "",
    company: d.company || "",
    websiteUrl: d.websiteUrl || "",
    framework: d.framework || "",
    agentGoal: d.agentGoal || "",
    topic: d.topic || "",
    investmentRange: d.investmentRange || "",
    preferredTime: d.preferredTime || "",
    // Title Case (matching sheet columns)
    Timestamp: timestamp,
    "Form Type": payload.form,
    Form: payload.form,
    Email: d.email || "",
    Name: d.name || "",
    Company: d.company || "",
    "Website URL": d.websiteUrl || "",
    Website: d.websiteUrl || "",
    Framework: d.framework || "",
    "Agent Goal": d.agentGoal || "",
    "Agent Goal / Notes": d.agentGoal || "",
    Topic: d.topic || "",
    "Investment Range": d.investmentRange || "",
    "Preferred Time": d.preferredTime || "",
  };

  // 1. Forward to Google Sheets Webhook (SheetDB or Google Apps Script)
  const DEFAULT_SHEETS_URL = "https://sheetdb.io/api/v1/wmr37vebck4c6";
  const webhookUrl =
    process.env.GOOGLE_SHEET_WEBHOOK_URL ||
    process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
    process.env.WAITLIST_WEBHOOK_URL ||
    DEFAULT_SHEETS_URL;

  if (webhookUrl) {
    try {
      const isSheetDB = webhookUrl.includes("sheetdb.io");
      const requestBody = isSheetDB
        ? JSON.stringify({ data: [flatRecord] })
        : JSON.stringify({
            ...payload,
            timestamp,
            data: d,
            ...flatRecord,
          });

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: requestBody,
        redirect: "follow",
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        console.warn(
          `[Submissions] Sheets webhook responded with status: ${response.status}`,
          errorText,
        );
      } else {
        console.log(
          `[Submissions] Successfully forwarded ${payload.form} submission to Sheets/SheetDB!`,
        );
      }
    } catch (err) {
      console.error("[Submissions] Sheets webhook error:", err);
    }
  }

  // 2. Forward to Supabase if configured
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const tableName = payload.form.replace(/-/g, "_");
      await fetch(`${supabaseUrl}/rest/v1/${tableName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          ...d,
          created_at: timestamp,
        }),
      });
    } catch (err) {
      console.error("[Submissions] Supabase insertion error:", err);
    }
  }

  // 3. Fallback / Server Log
  console.log(`[Submissions] Saved ${payload.form} submission:`, d);

  return { ok: true };
}
