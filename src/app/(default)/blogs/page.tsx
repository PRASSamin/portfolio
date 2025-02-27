import { db } from "@/lib/db";
import { BLOGSERIALIZER } from "@/lib/serializers";
import { BlogType } from "@/types";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import ExpandableText from "../../components/ReadMore";
import Link from "next/link";
import { metatag } from "@/lib/metatag";

const BlogsPage: React.FC = async ({}) => {
  const blogs: BlogType[] = BLOGSERIALIZER(
    await db.blog.findMany({
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    })
  );

  return (
    <div className="my-8 min-h-[calc(100vh-45px-64px-(32px*2))] w-[calc(100vw-2rem)] lg:container mx-auto flex flex-col gap-10 items-center">
      <div className="flex flex-col gap-1 items-center">
        <h1 className="text-4xl lg:text-6xl font-black leading-normal">
          My{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#ffa5c3] to-[#eb0954]">
            Blogs
          </span>
        </h1>
        <p className="text-muted-foreground text-center text-base lg:text-lg">
          Discover a collection of insightful articles and updates on various
          topics.
        </p>
      </div>
      {blogs.length <= 0 ? (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center">
          <p className="text-muted-foreground">No blogs found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-3">
          {blogs.map((blog, i) => (
            <Link key={blog.id} href={`/blogs/${blog.slug}`}>
              <Card className="h-full flex flex-col bg-card/70 justify-between">
                <CardHeader className="p-4 pb-0 h-full">
                  <CardTitle className="flex flex-col gap-2 relative">
                    <h2 className="dark:text-white text-black text-xl truncate">
                      {blog.title}
                    </h2>
                    <div className="flex items-center gap-1">
                      {i === 0 &&
                        ((blog.createdAt &&
                          new Date(blog.createdAt) >
                            new Date(
                              new Date().getTime() - 5 * 24 * 60 * 60 * 1000
                            )) ||
                          (blog.updatedAt &&
                            new Date(blog.updatedAt) >
                              new Date(
                                new Date().getTime() - 5 * 24 * 60 * 60 * 1000
                              ))) && (
                          <span className="bg-background text-muted-foreground border-gray-400 dark:border-muted border backdrop-blur px-1.5 py-0.5 rounded-[2px] text-xs">
                            New
                          </span>
                        )}

                      <span className="text-xs text-muted-foreground">
                        {formatDate(blog.createdAt, blog.updatedAt)}
                      </span>
                    </div>
                  </CardTitle>
                  <CardDescription className="text-md pt-3 flex flex-col">
                    <ExpandableText
                      text={blog.description}
                      maxLength={200}
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

BlogsPage.displayName = "BlogsPage";

export default BlogsPage;

export const generateMetadata = () => {
  return metatag({
    pageTitle: "Blogs | PRAS Samin",
    robots: "index, follow",
  });
};
