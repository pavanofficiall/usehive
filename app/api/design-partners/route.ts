import { saveSubmission } from "@/lib/submissions";
import {
  cleanText,
  isValidEmail,
  isValidHttpUrl,
  jsonError,
} from "@/lib/submission-validation";

const frameworks = new Set(["Next.js", "React", "Shopify", "WordPress", "Other"]);

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const name = cleanText(payload.name, 120);
    const email = cleanText(payload.email, 254).toLowerCase();
    const websiteUrl = cleanText(payload.websiteUrl, 500);
    const company = cleanText(payload.company, 180);
    const framework = cleanText(payload.framework, 80);
    const agentGoal = cleanText(payload.agentGoal, 1500);

    if (!name || !company || !framework || !agentGoal) {
      return jsonError("Complete every required field.");
    }
    if (!isValidEmail(email)) return jsonError("Enter a valid work email.");
    if (!isValidHttpUrl(websiteUrl)) {
      return jsonError("Enter a complete website URL, including https://.");
    }
    if (!frameworks.has(framework)) return jsonError("Select a valid framework.");

    await saveSubmission({
      form: "design-partners",
      data: {
        name,
        email,
        websiteUrl,
        company,
        framework,
        agentGoal,
      },
    });

    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Design partner application error:", error);
    return jsonError("We couldn't submit your application. Please try again.", 500);
  }
}
