"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface TextHeadingProps {
  subtitle?: string;
  title: string;
  titleItalic?: boolean;
  subtitleItalic?: boolean;
  lineColor?: string;
  className?: string;
  animateOnScroll?: boolean;
  align?: "left" | "center" | "right";
  subtitleSize?: "sm" | "md" | "lg" | "xl" | "8xl";
  titleSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "8xl" | "9xl";
  lineWidth?: "sm" | "md" | "lg";
  showLine?: boolean;
}

export default function TextHeading({
  subtitle,
  title,
  titleItalic = false,
  subtitleItalic = false,
  lineColor = "bg-gray-500 dark:bg-gray-200",
  className = "",
  animateOnScroll = true,
  align = "left",
  subtitleSize = "md",
  titleSize = "lg",
  lineWidth = "md",
  showLine = true,
}: TextHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);

  // Alignment classes
  const alignmentClasses = {
    left: "justify-start text-left",
    center: "justify-center text-center",
    right: "justify-end text-right",
  };

  // Subtitle size variants
  const subtitleSizes = {
    sm: "text-base sm:text-lg md:text-xl",
    md: "text-xl sm:text-2xl md:text-3xl",
    lg: "text-2xl sm:text-3xl md:text-4xl",
    xl: "text-3xl sm:text-4xl md:text-5xl",
    "8xl": "text-8xl sm:text-[5rem] md:text-[6rem]",
  };

  // Title size variants
  const titleSizes = {
    sm: "text-xl sm:text-2xl md:text-3xl",
    md: "text-2xl sm:text-3xl md:text-4xl",
    lg: "text-3xl sm:text-4xl md:text-5xl",
    xl: "text-4xl sm:text-5xl md:text-6xl",
    "2xl": "text-5xl sm:text-6xl md:text-7xl",
    "3xl": "text-6xl sm:text-7xl md:text-8xl lg:text-9xl",
    "8xl": "text-8xl sm:text-[5rem] md:text-[6rem]",
    "9xl": "text-9xl sm:text-[5.625rem] md:text-[6.25rem]",
  };

  // Line width variants
  const lineWidths = {
    sm: "w-8 sm:w-12 md:w-16",
    md: "w-12 sm:w-16 md:w-20",
    lg: "w-16 sm:w-20 md:w-24",
  };

  useEffect(() => {
    if (!animateOnScroll) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      if (subtitle && subtitleRef.current) {
        tl.from(subtitleRef.current, {
          x: -30,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        });
      }

      if (showLine && lineRef.current) {
        tl.from(
          lineRef.current,
          {
            width: 0,
            duration: 0.9,
            ease: "power2.out",
          },
          subtitle ? "-=0.3" : 0
        );
      }

      if (titleRef.current) {
        tl.from(
          titleRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.4"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [animateOnScroll, subtitle, showLine]);

  return (
    <div ref={containerRef} className={`text-black dark:text-gray-200 ${className}`}>
      {subtitle && (
        <div className={`flex items-center ${alignmentClasses[align]}`}>
          <span ref={subtitleRef} className={`${subtitleSizes[subtitleSize]} font-semibold`}>
            {subtitleItalic ? <i>{subtitle}</i> : subtitle}
          </span>
          {showLine && (
            <div 
              ref={lineRef} 
              className={`h-0.5 sm:h-1 ${lineWidths[lineWidth]} ${lineColor} ml-2`} 
            />
          )}
        </div>
      )}
      <span 
        ref={titleRef} 
        className={`${titleSizes[titleSize]} font-bold block mt-1 ${alignmentClasses[align].split(' ')[1]}`}
      >
        {titleItalic ? <i>{title}</i> : title}
      </span>
    </div>
  );
}