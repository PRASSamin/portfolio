"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactColorLessIcon } from "@/components/icons/react";
import { PythonColorLessIcon } from "@/components/icons/python";
import { cn } from "@/utils";
import { motion, useMotionValue, useSpring } from "motion/react";
import { GitFork } from "lucide-react";

const ServiceSection = () => {
  const services = [
    {
      title: "Web development",
      description:
        "I love turning ideas into real, working websites. This means building easy to use parts you see and strong systems behind the scenes. My goal is always to create smooth online experiences that just work, and I enjoy figuring out the best ways to make that happen.",
      iconData: { icon: ReactColorLessIcon, size: 28, className: "p-1.5" },
    },
    {
      title: "Python development",
      description:
        "With Python, I build smart solutions that can grow with needs. I enjoy using it to automate everyday tasks and dig into data to find useful insights. It's all about solving problems efficiently and creating reliable code that's easy to understand and update.",
      iconData: { icon: PythonColorLessIcon, size: 26, className: "p-2" },
    },
    {
      title: "Open source",
      description:
        "I'm passionate about open source because it's a fantastic way to learn, grow, and give back to the community. I enjoy contributing to projects that others use and creating my own tools to share. It's all about building together and making software better for everyone.",
      iconData: {
        icon: GitFork,
        size: 26,
        className: "pl-2 pr-2 py-2",
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
      {services.map((service) => (
        <ServiceCard key={service.title} service={service} />
      ))}
    </div>
  );
};

// rotation logic
const ServiceCard = ({ service }: { service: any }) => {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 100, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 100, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation
    const newRotateX = ((centerY - y) / centerY) * 15;
    const newRotateY = ((x - centerX) / centerX) * 15;

    rotateX.set(newRotateX);
    rotateY.set(newRotateY);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
      className="relative"
    >
      <motion.div
        style={{
          rotateX: springX,
          rotateY: springY,
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <Card className="bg-linear-to-br from-muted/60 via-transparent to-transparent bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div
                className={cn(
                  "bg-theme-accent-2/50 p-1.5 rounded-full",
                  service.iconData.className
                )}
              >
                <service.iconData.icon
                  size={service.iconData.size}
                  color="hsl(var(--card-foreground))"
                />
              </div>
              {service.title}
            </CardTitle>
            <CardDescription className="md:text-base">
              {service.description}
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ServiceSection;
