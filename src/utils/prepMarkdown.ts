import { unified } from "unified";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import rehypePrettyCode from "rehype-pretty-code";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import remarkGemoji from "remark-gemoji";
import remarkDirective from "remark-directive";
import remarkDeflist from "remark-deflist";
import supersub from "remark-supersub";
import { transformerCopyButton } from "@rehype-pretty/transformers";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export const prepareMarkdown = async (text: string) => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkDirective) // Handle directives
    .use(remarkDeflist) // Handle definition lists
    .use(supersub) // Handle subscript/superscript
    .use(remarkMath) // Handle math
    .use(remarkGfm) // GFM
    .use(remarkGemoji) // Emoji support
    .use(remarkRehype, { allowDangerousHtml: true }) // Convert Markdown to HTML
    .use(rehypeRaw) // Allow raw HTML
    .use(rehypeSlug) // Generate slugs for headings
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap", // Wrap the heading with <a>
      properties: {
        className: ["anchor-link"], // Optional: Add a class for styling
      },
    })
    .use(rehypePrettyCode, {
      theme: "github-dark-default",
      transformers: [
        transformerCopyButton({
          visibility: "always",
          feedbackDuration: 3_000,
        }),
      ],
      keepBackground: false,
    } as any)
    .use(rehypeFormat)
    .use(rehypeStringify);

  return (await processor.process(text)).toString();
};
