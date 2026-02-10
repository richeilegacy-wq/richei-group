"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CTASection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef);
      const heading = q("[data-cta-heading]");
      const subtitle = q("[data-cta-subtitle]");
      const buttons = q("[data-cta-buttons]");

      gsap.set([heading, subtitle, buttons], { opacity: 0, y: 40 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 30%",
            toggleActions: "play none none none",
          },
        })
        .to(heading, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
        .to(
          subtitle,
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          "-=0.4",
        )
        .to(
          buttons,
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.3",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full px-4 md:px-16 py-16 md:py-24">
      <div className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden min-h-[360px] md:min-h-[400px] flex items-center justify-center">
        <Image
          src="/images/cta-image.png"
          alt="CTA Background"
          fill
          className="object-cover"
          priority={false}
        />
        <div className="absolute inset-0 bg-[#263330]/85 mix-blend-multiply" />
        <div className="absolute inset-0 bg-linear-to-br from-[#1a2e28]/60 to-[#263330]/70" />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 md:px-16 py-12 md:py-16">
          <h2
            className="text-3xl md:text-[2.75rem] md:leading-tight font-bold text-white mb-4"
            data-cta-heading
          >
            Don&apos;t wait to buy real Estate.
            <br />
            Buy real estate and wait.
          </h2>
          <p
            className="text-white/80 text-base md:text-lg max-w-lg mb-8"
            data-cta-subtitle
          >
            Join the future of African real estate.
            <br />
            Secure your first tokenized plot today.
          </p>
          <div
            className="flex flex-wrap items-center justify-center gap-4"
            data-cta-buttons
          >
            <Button
              className="rounded-full bg-white text-primary hover:bg-white/90 font-semibold text-base px-6"
              size="lg"
            >
              Get started
              <ArrowRight className="w-5 h-5 bg-primary text-white rounded-full p-1 ml-1" />
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-white text-white bg-primary hover:bg-white/10 font-semibold text-base px-6"
              size="lg"
            >
              Book a Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
