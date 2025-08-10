import * as React from "react";
import { cn } from "@/utils";
import defaultMdxComponents from "fumadocs-ui/mdx";
import * as FilesComponents from "fumadocs-ui/components/files";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import type { MDXComponents } from "mdx/types";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import * as icons from "lucide-react";
import { Link } from "@/components/Link";
import { Banner } from "fumadocs-ui/components/banner";
import { TypeTable } from "fumadocs-ui/components/type-table";
import { Callout } from "fumadocs-ui/components/callout";
import { Heading } from "fumadocs-ui/components/heading";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type HeadProps = React.ComponentProps<typeof Heading>;
const Head = ({ className, ...props }: HeadProps) => (
  <Heading className={cn("[&_a]:!no-underline", className)} {...props} />
);

export const mdxComponents = {
  h1: ({ className, ...props }: HeadProps) => (
    <Head
      className={cn("border-l-[5px] border-theme-accent-1 pl-2.5", className)}
      {...props}
    />
  ),
  h2: ({ className, ...props }: HeadProps) => (
    <Head
      as="h2"
      className={cn("border-l-[5px] border-theme-accent-1 pl-2.5", className)}
      {...props}
    />
  ),
  h3: ({ ...props }: HeadProps) => <Head as="h3" {...props} />,
  h4: ({ ...props }: HeadProps) => <Head as="h4" {...props} />,
  h5: ({ ...props }: HeadProps) => <Head as="h5" {...props} />,
  h6: ({ ...props }: HeadProps) => <Head as="h6" {...props} />,
  blockquote: Callout as unknown as React.FC<
    React.ComponentProps<"blockquote">
  >,
  strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong
      className={cn(
        "font-semibold bg-transparent border-0 font-sans p-0 rounded-none",
        className
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.ComponentProps<"p">) => (
    <p
      className={cn("leading-relaxed [&:not(:first-child)]:my-0", className)}
      {...props}
    />
  ),
  img: ({ className, alt, ...props }: React.ComponentProps<"img">) => (
    <img className={cn("rounded-md", className)} alt={alt} {...props} />
  ),
  figure: ({ className, ...props }: React.ComponentProps<"figure">) => {
    return <figure className={cn(className, "show-scrollbar")} {...props} />;
  },
  Step: ({ className, ...props }: React.ComponentProps<"h3">) => (
    <h3
      className={cn(
        "font-heading mt-8 scroll-m-32 text-xl font-medium tracking-tight",
        className
      )}
      {...props}
    />
  ),
  Steps: ({ ...props }) => (
    <div
      className="[&>h3]:step steps mb-12 [counter-reset:step] *:[h3]:first:!mt-0"
      {...props}
    />
  ),
  Image: ({
    src,
    className,
    width,
    height,
    alt,
    ...props
  }: React.ComponentProps<"img">) => (
    <Image
      className={cn("mt-6 rounded-md border", className)}
      src={(src as string) || ""}
      width={Number(width)}
      height={Number(height)}
      alt={alt || ""}
      {...props}
    />
  ),
  Link: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link
      className={cn(
        "underline underline-offset-4 text-fd-foreground font-medium decoration-2 decoration-blue-300 hover:opacity-80",
        className
      )}
      {...props}
    />
  ),
  a: ({ href, className, ...props }: React.ComponentProps<typeof Link>) => {
    return (
      <Link
        className={cn(
          "underline underline-offset-4 text-fd-foreground font-medium decoration-2 decoration-blue-300 hover:opacity-80",
          className
        )}
        href={href}
        {...props}
      />
    );
  },
};

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...(icons as unknown as MDXComponents),
    ...defaultMdxComponents,
    ...TabsComponents,
    ...FilesComponents,
    Accordion,
    Accordions,
    ImageZoom,
    ...components,
    Banner,
    Button,
    TypeTable,
  };
}
