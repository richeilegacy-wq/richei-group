"use client";

import Image from "next/image";
import { CircleDot } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const licences = [
  { src: "/images/license/cac.png", alt: "CAC" },
  { src: "/images/license/surcon.jpg", alt: "SURCON" },
  { src: "/images/license/efcc.png", alt: "EFCC SCUML" },
  { src: "/images/license/redan.png", alt: "REDAN" },
];

const LicensesSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const logoRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (badgeRef.current) {
        gsap.from(badgeRef.current, {
          y: 40,
          opacity: 0,
          scale: 0.9,
          scrollTrigger: {
            trigger: badgeRef.current,
            start: "top 90%",
            end: "top 70%",
            scrub: 1,
          },
        });
      }

      logoRefs.current.forEach((logo, index) => {
        if (!logo) return;
        gsap.from(logo, {
          y: 40,
          opacity: 0,
          scale: 0.9,
          scrollTrigger: {
            trigger: logo,
            start: "top 92%",
            end: "top 60%",
            scrub: 1.1 + index * 0.1,
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white py-16 px-4 md:px-16 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex mb-10">
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2"
          >
            <CircleDot className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Our Licences &amp; Certifications
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {licences.map((licence, index) => (
            <div
              key={licence.alt}
              ref={(el) => {
                logoRefs.current[index] = el;
              }}
              className="relative h-16 w-32 md:h-20 md:w-40 lg:h-24 lg:w-48"
            >
              <Image
                src={licence.src}
                alt={licence.alt}
                fill
                sizes="(min-width: 1024px) 192px, (min-width: 768px) 160px, 128px"
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LicensesSection;
