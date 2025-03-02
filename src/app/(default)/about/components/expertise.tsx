import { cn } from "@/utils/utils";
import {
  React,
  Python,
  Bootstrap,
  Css,
  Django,
  Express,
  Firebase,
  Flask,
  Flutter,
  Git,
  Github,
  Go,
  Html,
  JavaScript,
  Jinja,
  MySQL,
  Next,
  Node,
  Postgres,
  Redis,
  Tailwind,
} from "../../../components/icons";

const ExpertiseSection = async () => {
  const stacks = [
    { name: "HTML", icon: Html, className: "bg-orange-700" },
    { name: "CSS", icon: Css, className: "bg-blue-700" },
    {
      name: "Bootstrap",
      icon: Bootstrap,
      className: "bg-purple-700",
    },
    { name: "Tailwind", icon: Tailwind, className: "bg-sky-700" },
    {
      name: "JavaScript",
      icon: JavaScript,
      className: "bg-yellow-700",
    },
    { name: "Express.js", icon: Express, className: "bg-white" },
    { name: "Next.js", icon: Next, className: "bg-gray-700" },
    { name: "Node.js", icon: Node, className: "bg-green-700" },
    { name: "React", icon: React, className: "bg-blue-500" },
    { name: "Python", icon: Python, className: "bg-blue-700" },
    { name: "Django", icon: Django, className: "bg-green-700" },
    { name: "Flask", icon: Flask, className: "bg-white" },
    { name: "Jinja", icon: Jinja, className: "bg-white" },
    { name: "Flutter", icon: Flutter, className: "bg-blue-500" },
    { name: "Go", icon: Go, className: "bg-blue-700" },
    { name: "MySQL", icon: MySQL, className: "bg-blue-700" },
    { name: "Postgres", icon: Postgres, className: "bg-blue-700" },
    { name: "Redis", icon: Redis, className: "bg-red-700" },
    { name: "Git", icon: Git, className: "bg-orange-700" },
    { name: "GitHub", icon: Github, className: "bg-gray-700" },
    { name: "Firebase", icon: Firebase, className: "bg-red-600" },
  ];

  return (
    <div data-section="expertise" className="flex flex-col gap-12 w-full">
      <div className="flex flex-col gap-1 items-center">
        <h3
          data-type="title"
          className="text-center text-4xl lg:text-6xl font-semibold text-foreground"
        >
          My{" "}
          <span className="tracking-tight inline from-[#FF72E1] to-[#F54C7A] bg-clip-text text-transparent bg-gradient-to-b">
            Expertise
          </span>{" "}
          Area
        </h3>
        <p
          data-type="description"
          className="text-muted-foreground text-sm lg:text-base text-center"
        >
          Discover my core skills and expertise areas.
        </p>
      </div>
      <div className="flex flex-wrap select-none items-center justify-center gap-4">
        {stacks.map((stack) => (
          <div key={stack.name} className="relative group">
            <div
              className={cn(
                "group-hover:-rotate-0 group-hover:opacity-100  -rotate-6 opacity-75 transition-all duration-300 bg-transparent rounded-xl absolute inset-0 z-[-1]",
                stack.className
              )}
            />
            <div
              key={stack.name}
              className="flex justify-center items-center gap-2.5 p-4 bg-background/50 backdrop-blur rounded-lg shadow-lg hover:shadow-xl z-10 transition-all duration-300 border"
            >
              <stack.icon size={18} className="text-primary" />
              <h4 className="text-base font-medium text-foreground">
                {stack.name}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpertiseSection;
