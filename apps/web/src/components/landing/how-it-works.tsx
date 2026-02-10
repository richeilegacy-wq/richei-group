"use client";

import Image from "next/image";
import { CircleDot } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: 1,
    title: "Select",
    description: "Choose a verified project that fits your budget.",
    image: "/images/how-it-works/select.png",
  },
  {
    number: 2,
    title: "Fund",
    description: "Invest securely via Bank Transfer or USDT/USDC.",
    image: "/images/how-it-works/fund.png",
  },
  {
    number: 3,
    title: "Receive",
    description: "Get your Project Participation Tokens instantly.",
    image: "/images/how-it-works/receive.png",
  },
  {
    number: 4,
    title: "Grow",
    description:
      "Track development via the Journal and watch your asset value appreciate.",
    image: "/images/how-it-works/grow.png",
  },
];

const cardAnimations = [
  { x: -100, y: 40, rotation: -6, scale: 0.85 },
  { x: 100, y: -40, rotation: 4, scale: 0.88 },
  { x: 60, y: 80, rotation: 5, scale: 0.82 },
  { x: -80, y: 50, rotation: -4, scale: 0.86 },
];

const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(badgeRef.current, {
        scale: 0,
        opacity: 0,
        rotation: -180,
        scrollTrigger: {
          trigger: badgeRef.current,
          start: "top 90%",
          end: "top 60%",
          scrub: 1,
        },
      });

      gsap.from(titleRef.current, {
        y: 50,
        opacity: 0,
        skewY: 4,
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 92%",
          end: "top 58%",
          scrub: 1.2,
        },
      });

      gsap.from(subtitleRef.current, {
        y: 30,
        opacity: 0,
        filter: "blur(6px)",
        scrollTrigger: {
          trigger: subtitleRef.current,
          start: "top 94%",
          end: "top 62%",
          scrub: 1.4,
        },
      });

      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const anim = cardAnimations[i];

        gsap.from(card, {
          x: anim.x,
          y: anim.y,
          rotation: anim.rotation,
          scale: anim.scale,
          opacity: 0,
          scrollTrigger: {
            trigger: card,
            start: "top 95%",
            end: "top 50%",
            scrub: 1.2 + i * 0.2,
          },
        });

        const img = card.querySelector(".step-image");
        if (img) {
          gsap.from(img, {
            y: 70,
            x: 30,
            opacity: 0,
            scale: 0.7,
            rotation: i % 2 === 0 ? 8 : -8,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 40%",
              scrub: 1.5 + i * 0.15,
            },
          });
        }

        const title = card.querySelector(".step-title");
        if (title) {
          gsap.from(title, {
            x: -40,
            opacity: 0,
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              end: "top 52%",
              scrub: 1.3 + i * 0.1,
            },
          });
        }

        const desc = card.querySelector(".step-desc");
        if (desc) {
          gsap.from(desc, {
            y: 25,
            opacity: 0,
            filter: "blur(4px)",
            scrollTrigger: {
              trigger: card,
              start: "top 82%",
              end: "top 45%",
              scrub: 1.6 + i * 0.1,
            },
          });
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white py-20 px-4 md:px-16 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center mb-14">
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-5"
          >
            <CircleDot className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">The flow</span>
          </div>

          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold text-primary mb-5"
          >
            How It Works
          </h2>

          <p
            ref={subtitleRef}
            className="text-primary/80 text-base md:text-lg max-w-2xl leading-relaxed"
          >
            A flow of the step by step process from start to finish.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((step, index) => (
            <div
              key={step.number}
              ref={(el) => { cardRefs.current[index] = el; }}
              className={`relative bg-[#f5f5f0] rounded-2xl overflow-hidden min-h-[260px] flex flex-col justify-between p-6 md:p-8 ${
                index === 0 || index === 3
                  ? "md:col-span-3"
                  : "md:col-span-2"
              }`}
            >
              <div className="step-title relative z-10 max-w-[55%]">
                <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                  {step.number}. {step.title}
                </h3>
              </div>

              <div className="step-desc relative z-10 max-w-[55%]">
                <p className="text-primary/80 text-sm md:text-base font-semibold leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="step-image absolute right-0 bottom-0 w-[50%] h-full">
                <Image
                  src={step.image}
                  alt={step.title}
                  width={400}
                  height={400}
                  className="absolute right-0 bottom-0 w-full h-full object-contain object-bottom-right"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;