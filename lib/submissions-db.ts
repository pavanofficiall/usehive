export async function getSubmissionsDb() {
  const { env } = await import("cloudflare:workers");
  if (!env.DB) {
    throw new Error("Hive submissions database is unavailable.");
  }

  return env.DB;
}
