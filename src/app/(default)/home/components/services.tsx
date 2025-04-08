"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactColorLessIcon } from "../../../../components/icons/react";
import { PythonColorLessIcon } from "../../../../components/icons/python";
import { FlutterColorLessIcon } from "@/components/icons/flutter";
import { cn } from "@/utils";
import { motion, useMotionValue, useSpring } from "motion/react";

const ServiceSection = () => {
  const services = [
    {
      title: "Web development",
      description:
        "Bringing ideas to life through clean, functional code, I craft intuitive user interfaces and robust back-end systems. I’m driven by a passion for learning and solving challenges, creating seamless digital experiences with modern technologies.",
      iconData: { icon: ReactColorLessIcon, size: 28, className: "p-1.5" },
    },
    {
      title: "Python development",
      description:
        "Python empowers me to build scalable solutions, automate tasks, and explore data analysis. Its versatility inspires me to solve problems, embrace innovation, and deliver impactful results through clean, maintainable code.",
      iconData: { icon: PythonColorLessIcon, size: 26, className: "p-2" },
    },
    {
      title: "Flutter development",
      description:
        "Flutter enables me to create visually stunning, high-performance apps for iOS and Android. I thrive on crafting seamless, feature-rich experiences that merge creativity with cutting-edge technology.",
      iconData: {
        icon: FlutterColorLessIcon,
        size: 26,
        className: "pl-1.5 pr-2 py-2",
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
        <Card className="bg-gradient-to-br from-muted/60 via-transparent to-transparent bg-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div
                className={cn(
                  "bg-[#31004d] p-1.5 rounded-full",
                  service.iconData.className
                )}
              >
                <service.iconData.icon
                  size={service.iconData.size}
                  color="#ff0090"
                />
              </div>
              {service.title}
            </CardTitle>
            <CardDescription className="text-md">
              {service.description}
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ServiceSection;
