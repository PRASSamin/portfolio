import NavigationBar from "@/components/NavigationBar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Link } from "@/components/Link";
import Background from "@/components/Background";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Info } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <NavigationBar />
      <Background />
      <section className="relative z-50">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
          <div className="flex items-center">
            <span className="sm:text-[250px] md:text-[300px] text-[150px] font-semibold text-transparent leading-[250px] bg-clip-text bg-linear-to-b from-theme-primary  to-transparent select-none">
              4
            </span>
            <Image
              src="/football.png"
              alt="football"
              className="drag-none sm:h-[250px] md:h-[300px] h-[150px] w-auto opacity-75"
              width={500}
              height={500}
            />
            <span className="sm:text-[250px] md:text-[300px] text-[150px] leading-[250px] font-semibold text-transparent bg-clip-text bg-linear-to-b from-theme-primary to-transparent select-none ">
              4
            </span>
          </div>
          <div className="flex flex-col items-center -mt-14 z-10">
            <span className="bg-theme-primary/20 text-white px-3 py-1 text-xs rounded-full border border-theme-primary/50 select-none">
              404 error
            </span>
            <h2 className="text-2xl sm:text-3xl text-center font-semibold mt-10">
              Opps! Something went wrong
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-lg text-center mt-5">
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </p>
            <Link href="/" className="mt-20">
              <Button className="bg-theme-primary hover:bg-theme-primary/90 py-5 px-5">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
        <HoverCard closeDelay={0} openDelay={0}>
          <HoverCardTrigger asChild>
            <Info className="text-foreground/70 absolute bottom-4 right-4 z-10 cursor-pointer" />
          </HoverCardTrigger>
          <HoverCardContent
            side="left"
            className="mt-24 px-3 py-2 text-sm text-foreground/80 bg-card/90 border-border/50"
          >
            This page is a canvas for my passions, and football is one of them. I chose a football theme to make this corner of the web feel uniquely mine. It’s a personal touch, reflecting the energy and creativity I bring to my work.
          </HoverCardContent>
        </HoverCard>
      </section>
    </>
  );
}
