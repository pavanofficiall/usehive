import { saveSubmission } from "@/lib/submissions";
import { cleanText, isValidEmail, jsonError } from "@/lib/submission-validation";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const name = cleanText(payload.name, 120) || "Calendly Guest";
    const company = cleanText(payload.company, 180) || "Direct Booking";
    const topic = cleanText(payload.topic, 100) || "General conversation";
    const investmentRange = cleanText(payload.investmentRange, 80);
    const email = cleanText(payload.email, 254).toLowerCase();
    const preferredTime = cleanText(payload.preferredTime, 80) || "Scheduled via Calendly";

    if (email && !isValidEmail(email)) {
      return jsonError("Enter a valid email address.");
    }

    await saveSubmission({
      form: "founder-conversations",
      data: {
        name,
        company,
        topic,
        investmentRange: investmentRange || null,
        email: email || null,
        preferredTime,
      },
    });

    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Founder conversation booking error:", error);
    return jsonError("We couldn't save your request. Please try again.", 500);
  }
}
