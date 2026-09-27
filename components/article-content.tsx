import Markdown from "react-markdown";
import remarkBreaks from "remark-breaks";

export function ArticleContent({ body }: { body: string }) {
  return <div className="article-body"><Markdown remarkPlugins={[remarkBreaks]} components={{
    a: ({ title, href, children }) => <a href={href} className={title === "hive-button" ? "article-cta" : undefined} rel="noopener noreferrer">{children}</a>,
    img: ({ src, alt }) => <figure><img src={src} alt={alt || "Article image"} loading="lazy"/><figcaption>{alt}</figcaption></figure>,
  }}>{body}</Markdown></div>;
}
