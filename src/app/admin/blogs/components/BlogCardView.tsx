import ExpandableText from "@/components/ReadMore";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BlogType } from "@/types";
import { cn } from "@/utils";
import { BetterImage } from "@prass/betterimage/components";

const BlogCardView = ({
  blog,
  selected,
  setSelected,
}: {
  blog: BlogType;
  selected: Set<string | number>;
  setSelected: React.Dispatch<Set<string | number>>;
}) => {
  const onBlogClick = (id: string | number) => {
    // @ts-expect-error: types issue
    setSelected((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  return (
    <div
      className={cn(
        "w-full flex items-center justify-center gap-3 relative group cursor-pointer"
      )}
      data-id={blog.id}
      onClick={(e) => {
        e.preventDefault();
        if (e.ctrlKey) {
          onBlogClick(blog.id);
        }
      }}
    >
      <Card
        className={cn(
          `
          h-full w-full flex flex-col bg-background/60 backdrop-blur 
          justify-between transition-all duration-300 overflow-hidden border-dashed
        `,
          selected.has(blog.id) ? "bg-muted/40" : ""
        )}
      >
        <CardHeader className="p-0 h-full">
          {blog?.thumbnail && (
            <div
              className="border border-dashed rounded-t-lg overflow-hidden h-56"
              style={{
                maskImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0))`,
              }}
            >
              <BetterImage
                src={blog.thumbnail}
                width={300}
                height={300}
                className="object-cover w-full h-full"
                alt={blog.title}
              />
            </div>
          )}
          <CardTitle className="flex flex-col gap-2 relative px-4 pb-0">
            <h2 className="text-white text-xl truncate">{blog.title}</h2>
          </CardTitle>
          <CardDescription className="text-md pt-3 flex flex-col px-4">
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
              className="px-2.5 py-1 bg-rose-800/50 border border-rose-700 rounded-full text-xs text-rose-500 font-semibold capitalize select-none"
            >
              {tag}
            </span>
          ))}
        </CardFooter>
      </Card>
    </div>
  );
};

export default BlogCardView;
