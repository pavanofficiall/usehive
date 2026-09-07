import { saveSubmission } from "@/lib/submissions";
import {
  cleanText,
  isValidEmail,
  isValidHttpUrl,
  jsonError,
} from "@/lib/submission-validation";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const email = cleanText(payload.email, 254).toLowerCase();
    const websiteUrl = cleanText(payload.websiteUrl, 500);
    const framework = cleanText(payload.framework, 80);
    const agentGoal = cleanText(payload.agentGoal, 1200);

    if (!isValidEmail(email)) return jsonError("Enter a valid email address.");
    if (websiteUrl && !isValidHttpUrl(websiteUrl)) {
      return jsonError("Enter a complete website URL, including https://.");
    }

    await saveSubmission({
      form: "waitlist",
      data: {
        email,
        websiteUrl: websiteUrl || null,
        framework: framework || null,
        agentGoal: agentGoal || null,
      },
    });

    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Waitlist submission error:", error);
    return jsonError("We couldn't save your signup. Please try again.", 500);
  }
}
