"use client";

import Image from "next/image";
import { Coins, Globe, FileText, BarChart3, Handshake } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const pillars = [
  {
    icon: Coins,
    label: "RichHei Assets:",
    image: "/images/who-we-are/richei-assets.png",
    description:
      "Fractional investment in prime Nigerian land and residential projects.",
  },
  {
    icon: Globe,
    label: "RichHei Academy:",
    image: "/images/who-we-are/richei-academy.png",
    description:
      "Professional real estate and investment literacy for the next generation of agents.",
  },
  {
    icon: FileText,
    label: "RichHei Blog",
    image: "/images/who-we-are/richei-blog.png",
    description:
      "Your source for project transparency, market data, and behind-the-scenes updates.",
  },
  {
    icon: BarChart3,
    label: "Member Dashboard",
    image: "/images/who-we-are/memeber-dashboard.png",
    description:
      "Your private vault for documents, ROI tracking, and NFT certificates.",
  },
];

type Pillar = (typeof pillars)[number];

const WhoWeAre = () => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(containerRef);

      gsap.set(q(".section-header"), { y: 80, opacity: 0, scale: 0.9 });

      const headerEntry = gsap.timeline({
        scrollTrigger: {
          trigger: q(".section-header")[0],
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      headerEntry.to(q(".section-header"), {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
      });

      const headerExit = gsap.timeline({
        scrollTrigger: {
          trigger: q(".section-header")[0],
          start: "bottom 30%",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      headerExit.to(q(".section-header"), {
        y: -80,
        opacity: 0,
        scale: 0.95,
        duration: 1,
        ease: "power2.in",
      });

      const cards = q(".pillar-card") as HTMLElement[];

      cards.forEach((card) => {
        gsap.set(card, {
          y: 120,
          opacity: 0,
          rotationX: 30,
          scale: 0.85,
          transformOrigin: "center top",
        });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          })
          .to(card, {
            y: 0,
            opacity: 1,
            rotationX: 0,
            scale: 1,
            duration: 0.9,
            ease: "back.out(1.4)",
          });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: card,
              start: "bottom 30%",
              end: "bottom top",
              scrub: 1.5,
            },
          })
          .to(card, {
            y: -120,
            opacity: 0,
            scale: 0.9,
            duration: 1,
            ease: "power2.in",
          });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full bg-white py-20 px-4 md:px-16 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        <div className="section-header flex flex-col items-center text-center mb-14 opacity-0">
          <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-5">
            <Handshake className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Who we are</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-5">
            One Group. Four Pillars.
          </h2>

          <p className="text-primary/90 text-base md:text-lg max-w-2xl leading-relaxed">
            RichHei Assets&trade; is the digital extension of the RichHei Group,
            bringing transparency and access to local opportunities where land,
            trust, education, and technology empower Africans and the diaspora
            to invest and grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className={`pillar-card relative opacity-0 ${
                index === 0 || index === 3 ? "md:col-span-2" : "md:col-span-3"
              }`}
            >
              <Image
                src={pillar.image}
                alt={pillar.label}
                width={500}
                height={500}
                className="h-[243px] w-full object-cover rounded-lg"
              />
              <div className="absolute bg-primary-foreground left-2 top-2 p-2 flex gap-2 justify-center items-center rounded-full">
                <pillar.icon className="w-6 h-6 text-primary" />
                <p className="text-primary/90 text-base md:text-lg max-w-2xl leading-relaxed font-bold">
                  {pillar.label}
                </p>
              </div>
              <p className="text-primary/90 text-base md:text-lg max-w-2xl leading-relaxed mt-2">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
