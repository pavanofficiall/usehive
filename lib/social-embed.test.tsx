import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ArticleContent } from "@/components/article-content";
import { embedDirective, resolveSocialEmbed } from "@/lib/social-embed";

test("YouTube links become a safe in-article player", () => {
  const video = resolveSocialEmbed("https://youtu.be/M7lc1UVf-VE?t=1m30s");
  assert.equal(video?.kind, "youtube");
  assert.equal(video?.embedUrl, "https://www.youtube-nocookie.com/embed/M7lc1UVf-VE?start=90");
  const html = renderToStaticMarkup(<ArticleContent body={`Before\n\n${embedDirective(video!.url)}\n\nAfter`} />);
  assert.match(html, /youtube-nocookie\.com\/embed\/M7lc1UVf-VE/);
  assert.match(html, /Before/);
  assert.match(html, /After/);
  const pasted = renderToStaticMarkup(<ArticleContent body="https://www.youtube.com/watch?v=M7lc1UVf-VE" />);
  assert.match(pasted, /youtube-nocookie\.com\/embed\/M7lc1UVf-VE/);
});

test("supported public social posts get platform embeds", () => {
  assert.equal(resolveSocialEmbed("https://x.com/usehiveai/status/123456789")?.kind, "x");
  assert.equal(resolveSocialEmbed("https://www.reddit.com/r/redditdev/comments/16tqlth/updating_api_user_setting_fields/")?.embedUrl,
    "https://embed.reddit.com/r/redditdev/comments/16tqlth/updating_api_user_setting_fields/?theme=dark");
  assert.equal(resolveSocialEmbed("https://www.linkedin.com/feed/update/urn:li:share:6432615201547255808")?.embedUrl,
    "https://www.linkedin.com/embed/feed/update/urn:li:share:6432615201547255808");
  const reddit = renderToStaticMarkup(<ArticleContent body="https://www.reddit.com/r/redditdev/comments/16tqlth/updating_api_user_setting_fields/" />);
  assert.match(reddit, /embed\.reddit\.com\/r\/redditdev\/comments\/16tqlth/);
});

test("unknown HTTPS links remain links, and unsafe URLs are rejected", () => {
  assert.equal(resolveSocialEmbed("https://example.com/story")?.kind, "link");
  assert.equal(resolveSocialEmbed("https://youtube.com.evil.example/watch?v=M7lc1UVf-VE")?.kind, "link");
  assert.equal(resolveSocialEmbed("javascript:alert(1)"), null);
  assert.equal(resolveSocialEmbed("http://example.com"), null);
  assert.equal(resolveSocialEmbed("https://user:pass@example.com"), null);
});
