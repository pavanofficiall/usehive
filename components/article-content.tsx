import Markdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { embedUrlFromParagraph, resolveSocialEmbed } from "@/lib/social-embed";
import { SocialEmbed } from "@/components/social-embed";

export function ArticleContent({ body }: { body: string }) {
  return <div className="article-body"><Markdown remarkPlugins={[remarkBreaks]} components={{
    p: ({ children }) => {
      const text = typeof children === "string" ? children.trim() : "";
      const direct = /^https:\/\/\S+$/.test(text) ? resolveSocialEmbed(text) : null;
      const url = embedUrlFromParagraph(text) || (direct?.kind !== "link" ? direct?.url : null);
      return url ? <SocialEmbed url={url} /> : <p>{children}</p>;
    },
    a: ({ title, href, children }) => <a href={href} className={title === "hive-button" ? "article-cta" : undefined} rel="noopener noreferrer">{children}</a>,
    img: ({ src, alt }) => <figure><img src={src} alt={alt || "Article image"} loading="lazy"/><figcaption>{alt}</figcaption></figure>,
  }}>{body}</Markdown></div>;
}
