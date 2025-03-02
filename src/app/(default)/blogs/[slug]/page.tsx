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
import { unified } from "unified";
import { transformerCopyButton } from "@rehype-pretty/transformers";
import { db } from "@/utils/db";
import { BlogType } from "@/types";
import { BLOGSERIALIZER } from "@/utils/serializers";
import { formatDate } from "@/utils/utils";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import ExpandableText from "../../../components/ReadMore";

type Props = Promise<{ slug: string }>;

const BlogPage = async ({ params }: { params: Props }) => {
  const { slug } = await params;
  const { content, ...blog }: BlogType = BLOGSERIALIZER(
    await db.blog.findUnique({
      where: {
        slug: slug,
      },
    })
  );

  if (!blog) {
    return (
      <div className="bg-background mx-auto">
        <div className="flex flex-col items-center justify-center max-w-[calc(100vw-2.5rem)] lg:max-w-full mx-auto h-[calc(100vh-64px-44px)]">
          <p className="text-muted-foreground">Blog not found</p>
        </div>
      </div>
    );
  }

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
    .use(rehypePrettyCode, {
      theme: "github-dark-default",
      transformers: [
        transformerCopyButton({
          visibility: "always",
          feedbackDuration: 3_000,
        }),
      ],
      keepBackground: false,
    })
    .use(rehypeFormat)
    .use(rehypeStringify);

  const html = (await processor.process(content)).toString();

  return (
    <>
      <style>
        {`
            main {
              max-height: calc(100vh - 64px);
              overflow-y: auto;
              &::-webkit-scrollbar {
                display: block;
                width: 10px;
              }
              &::-webkit-scrollbar-track {
                @apply bg-background;
              }
              &::-webkit-scrollbar-thumb {
                @apply bg-accent rounded-full;
              }
            }
          `}
      </style>
      <div
        className={`bg-background mx-auto min-h-[calc(100vh-64px-44px)] pt-5 pb-14`}
      >
        <div className="flex flex-col items-center justify-center max-w-[calc(100vw-2.5rem)] lg:max-w-full mx-auto gap-5">
          <div className="min-w-full lg:min-w-[56rem] lg:w-[56rem]">
            <Card className="h-full flex flex-col bg-accent/50 justify-between border-none">
              <CardHeader className="p-4 pb-0 h-full">
                <CardTitle className="flex flex-col gap-2 relative">
                  <h2 className="dark:text-white text-black text-4xl truncate">
                    {blog.title}
                  </h2>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(blog.createdAt, blog.updatedAt)}
                    </span>
                  </div>
                </CardTitle>
                <CardDescription className="text-md pt-3 flex flex-col">
                  <ExpandableText
                    text={blog.description}
                    maxLength={"max"}
                    expandable={false}
                  />
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex flex-wrap gap-2 items-center p-4 pt-3">
                {blog.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 bg-rose-800/50 border border-rose-700 rounded-full text-[13px] text-rose-800 dark:text-rose-500 font-semibold capitalize select-none"
                  >
                    {tag}
                  </span>
                ))}
              </CardFooter>
            </Card>
          </div>
          <div
            className="dark:prose-invert prose !max-w-[100ch]"
            dangerouslySetInnerHTML={{ __html: html }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default BlogPage;
