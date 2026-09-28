export type SocialEmbed = {
  kind: "youtube" | "x" | "reddit" | "linkedin" | "link";
  url: string;
  embedUrl?: string;
  label: string;
};

function youtubeStart(value: string | null): number | null {
  if (!value) return null;
  if (/^\d+$/.test(value)) return Number(value);
  const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (!match) return null;
  return Number(match[1] || 0) * 3600 + Number(match[2] || 0) * 60 + Number(match[3] || 0);
}

export function resolveSocialEmbed(raw: string): SocialEmbed | null {
  let url: URL;
  try { url = new URL(raw.trim()); } catch { return null; }
  if (url.protocol !== "https:" || url.username || url.password) return null;

  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  const source = url.toString();

  if (["youtube.com", "m.youtube.com", "youtube-nocookie.com", "youtu.be"].includes(host)) {
    const id = host === "youtu.be" ? url.pathname.slice(1).split("/")[0]
      : url.pathname === "/watch" ? url.searchParams.get("v")
      : url.pathname.match(/^\/(?:shorts|live|embed)\/([^/]+)/)?.[1];
    if (id && /^[A-Za-z0-9_-]{11}$/.test(id)) {
      const start = youtubeStart(url.searchParams.get("t") || url.searchParams.get("start"));
      const embed = new URL(`https://www.youtube-nocookie.com/embed/${id}`);
      if (start && Number.isFinite(start)) embed.searchParams.set("start", String(start));
      return { kind: "youtube", url: source, embedUrl: embed.toString(), label: "YouTube" };
    }
  }

  if (["x.com", "twitter.com", "mobile.twitter.com"].includes(host) && /^\/[A-Za-z0-9_]+\/status\/\d+\/?$/.test(url.pathname)) {
    return { kind: "x", url: source, label: "X" };
  }

  if (["reddit.com", "old.reddit.com", "www.reddit.com"].includes(host) && /^\/r\/[A-Za-z0-9_]+\/comments\/[A-Za-z0-9]+(?:\/[^?#]*)?$/.test(url.pathname)) {
    const embed = new URL(`https://embed.reddit.com${url.pathname}`);
    embed.searchParams.set("theme", "dark");
    return { kind: "reddit", url: source, embedUrl: embed.toString(), label: "Reddit" };
  }

  if (host === "linkedin.com") {
    const match = url.pathname.match(/^\/(?:embed\/)?feed\/update\/urn:li:(activity|share|ugcPost):(\d+)\/?$/)
      || url.pathname.match(/^\/posts\/[^/]*-activity-(\d+)(?:-[^/]*)?\/?$/);
    if (match) {
      const type = match.length === 3 ? match[1] : "activity";
      const id = match.length === 3 ? match[2] : match[1];
      return { kind: "linkedin", url: source, embedUrl: `https://www.linkedin.com/embed/feed/update/urn:li:${type}:${id}`, label: "LinkedIn" };
    }
  }

  return { kind: "link", url: source, label: host };
}

export function embedDirective(url: string): string {
  return `{{embed:${url}}}`;
}

export function embedUrlFromParagraph(text: string): string | null {
  const match = text.trim().match(/^\{\{embed:(https:\/\/[^\s{}]+)\}\}$/);
  return match && resolveSocialEmbed(match[1]) ? match[1] : null;
}
