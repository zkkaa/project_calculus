"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { useRouter } from "next/navigation";
import { projectsData, type Project } from "@/data/landing";
import TextHeading from "../ui/TextHeading";
import AnimatedButton from "../common/AnimatedButton";

export default function Teamm() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const section = sectionRef.current;
        const scrollContainer = scrollContainerRef.current;

        if (!section || !scrollContainer) return;

        section.id = "horizontal-projects-section";

        const initScrollTrigger = () => {
            const ctx = gsap.context(() => {
                const scrollWidth = scrollContainer.scrollWidth - window.innerWidth;

                const introduceSection = document.getElementById("introduce-section") ||
                    document.querySelector('[ref="containerRef"]');

                let offsetY = 0;
                if (introduceSection) {
                    const introduceScrollHeight = introduceSection.scrollHeight || window.innerHeight;
                    offsetY = introduceScrollHeight * 2;
                }

                const horizontalScroll = gsap.to(scrollContainer, {
                    x: -scrollWidth,
                    ease: "none",
                    scrollTrigger: {
                        id: "horizontal-projects-section",
                        trigger: section,
                        start: () => {
                            const startPos = `5% top+=${offsetY}`;
                            return startPos;
                        },
                        end: () => `+=${scrollWidth * 2}`,
                        scrub: 1.5,
                        pin: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                        pinSpacing: true,
                        refreshPriority: -1,
                    },
                });
            }, section);

            return ctx;
        };

        const timeoutId = setTimeout(() => {
            const ctx = initScrollTrigger();

            window.addEventListener('load', () => {
                ScrollTrigger.refresh();
            });

            return () => {
                ctx?.revert();
                ScrollTrigger.getById("horizontal-projects-section")?.kill();
            };
        }, 100);

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden"
        >
            <div
                ref={scrollContainerRef}
                className="flex items-center h-screen"
                style={{ width: "fit-content" }}
            >
                {/* Title Section - Responsive */}
                <div ref={titleRef} className="flex-shrink-0 w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[40vw] px-6 sm:px-10 md:px-16 lg:px-20 mr-8 sm:mr-12 md:mr-16 lg:mr-20 z-10">
                    <TextHeading subtitle="My Last" title="PROJECT" titleItalic />
                    <p className="mt-4 sm:mt-6 lg:mt-8 text-gray-700 dark:text-gray-300 leading-relaxed text-xs sm:text-sm md:text-base lg:text-base">
                        These are a few of my latest projects that I built while learning
                        and exploring more about web development. Nothing too fancy, but
                        each one taught me something new.
                    </p>
                    <AnimatedButton href="/projects" className="mt-3 sm:mt-4 lg:mt-5">Learn More</AnimatedButton>
                </div>

                {/* Projects - Responsive */}
                <div className="flex gap-12 sm:gap-16 md:gap-20 lg:gap-28 px-6 sm:px-10 md:px-16 lg:px-20">
                    {projectsData.map((project, index) => (
                        <div key={project.id} className="flex gap-12 sm:gap-16 md:gap-20 lg:gap-28 items-center">
                            <ProjectRow
                                project={project}
                                index={index}
                            />

                            {index < projectsData.length - 1 && (
                                <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 w-px bg-slate-400 dark:bg-white"></div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="w-[20vw] flex-shrink-0" />
            </div>
        </section>
    );
}

interface ProjectRowProps {
    project: Project;
    index: number;
}

function ProjectRow({ project, index }: ProjectRowProps) {
    const imageRef = useRef<HTMLDivElement>(null);
    const imagePosition = index % 2 === 0 ? "left" : "right";

    const handleMouseEnter = () => {
        if (!imageRef.current) return;
        gsap.to(imageRef.current, {
            scale: 1.15,
            rotationY: 10,
            rotationX: -5,
            duration: 0.6,
            ease: "power2.out",
        });
    };

    const handleMouseLeave = () => {
        if (!imageRef.current) return;
        gsap.to(imageRef.current, {
            scale: 1,
            rotationY: 0,
            rotationX: 0,
            duration: 0.6,
            ease: "power2.out",
        });
    };

    return (
        <div className="project-row flex-shrink-0 w-[55vw] sm:w-[75vw] md:w-[70vw] lg:w-[60vw] relative" style={{ perspective: "1000px" }}>
            {/* Number - Responsive */}
            <div className="absolute -top-8 sm:-top-10 md:-top-12 lg:-top-16 left-0 text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-bold text-gray-600 dark:text-gray-300 leading-none z-20">
                {String(index + 1).padStart(2, "0")}
            </div>

            {imagePosition === "left" ? (
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-7 lg:gap-8 items-start sm:items-center">
                    {/* Image */}
                    <div
                        className="relative w-full sm:w-1/2 h-40 sm:h-48 md:h-64 lg:h-96 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0 shadow-xl"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        <div ref={imageRef} className="w-full h-full">
                            <Image
                                src="/gift/plenger2.webp"
                                alt="Project Image"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute inset-0 mix-blend-multiply opacity-10" />
                    </div>

                    {/* Content */}
                    <div className="space-y-2 sm:space-y-3 lg:space-y-4 flex-1">
                        <a
                            href={project.link}
                            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black dark:text-white hover:text-sky-500 dark:hover:text-sky-400 transition-colors duration-300 inline-block"
                        >
                            {project.title}
                        </a>
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                            {project.description}
                        </p>
                        <div className="flex gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-medium">{project.year}</span>
                            <span>•</span>
                            <span className="font-medium">{project.category}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-7 lg:gap-8 items-start sm:items-center">
                    {/* Content */}
                    <div className="space-y-2 sm:space-y-3 lg:space-y-4 flex-1 order-2 sm:order-1">
                        <a
                            href={project.link}
                            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black dark:text-white hover:text-sky-500 dark:hover:text-sky-400 transition-colors duration-300 inline-block"
                        >
                            {project.title}
                        </a>
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                            {project.description}
                        </p>
                        <div className="flex gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-medium">{project.year}</span>
                            <span>•</span>
                            <span className="font-medium">{project.category}</span>
                        </div>
                    </div>

                    {/* Image */}
                    <div
                        className="relative w-full sm:w-1/2 h-40 sm:h-48 md:h-64 lg:h-96 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0 shadow-xl order-1 sm:order-2"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        <div ref={imageRef} className="w-full h-full">
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute inset-0 mix-blend-multiply opacity-10" />
                    </div>
                </div>
            )}
        </div>
    );
}