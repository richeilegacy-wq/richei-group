"use client";

import Image from "next/image";
import { Package, Building2, FileText, TrendingUp } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const InvestorsDashboard = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const bottomCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(badgeRef.current, {
        y: -30,
        opacity: 0,
        scale: 0.8,
        scrollTrigger: {
          trigger: badgeRef.current,
          start: "top 90%",
          end: "top 60%",
          scrub: 1,
        },
      });

      gsap.from(titleRef.current, {
        y: 60,
        opacity: 0,
        letterSpacing: "0.3em",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 92%",
          end: "top 55%",
          scrub: 1.2,
        },
      });

      gsap.from(subtitleRef.current, {
        y: 40,
        opacity: 0,
        filter: "blur(8px)",
        scrollTrigger: {
          trigger: subtitleRef.current,
          start: "top 95%",
          end: "top 60%",
          scrub: 1.4,
        },
      });

      gsap.from(leftCardRef.current, {
        x: -120,
        opacity: 0,
        rotateY: 12,
        scale: 0.9,
        scrollTrigger: {
          trigger: leftCardRef.current,
          start: "top 95%",
          end: "top 45%",
          scrub: 1.5,
        },
      });

      gsap.from(rightCardRef.current, {
        x: 120,
        opacity: 0,
        rotateY: -12,
        scale: 0.9,
        scrollTrigger: {
          trigger: rightCardRef.current,
          start: "top 95%",
          end: "top 45%",
          scrub: 1.5,
        },
      });

      gsap.from(bottomCardRef.current, {
        y: 80,
        opacity: 0,
        scale: 0.92,
        borderRadius: "3rem",
        scrollTrigger: {
          trigger: bottomCardRef.current,
          start: "top 98%",
          end: "top 50%",
          scrub: 1.8,
        },
      });

      const leftImg = leftCardRef.current?.querySelector(".card-image");
      if (leftImg) {
        gsap.from(leftImg, {
          y: 60,
          opacity: 0,
          scale: 0.85,
          scrollTrigger: {
            trigger: leftCardRef.current,
            start: "top 80%",
            end: "top 35%",
            scrub: 1.6,
          },
        });
      }

      const rightImg = rightCardRef.current?.querySelector(".card-image");
      if (rightImg) {
        gsap.from(rightImg, {
          y: 60,
          opacity: 0,
          scale: 0.85,
          scrollTrigger: {
            trigger: rightCardRef.current,
            start: "top 80%",
            end: "top 35%",
            scrub: 1.6,
          },
        });
      }

      const bottomImg = bottomCardRef.current?.querySelector(".card-image");
      if (bottomImg) {
        gsap.from(bottomImg, {
          y: 50,
          opacity: 0,
          scale: 0.9,
          scrollTrigger: {
            trigger: bottomCardRef.current,
            start: "top 75%",
            end: "top 30%",
            scrub: 2,
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white py-20 px-4 md:px-16 overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center mb-14">
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-5"
          >
            <Package className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              The Product
            </span>
          </div>

          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold text-primary mb-5"
          >
            The Investor Dashboard
          </h2>

          <p
            ref={subtitleRef}
            className="text-primary/80 text-base md:text-lg max-w-2xl leading-relaxed"
          >
            No more wondering where your money is. Manage your portfolio like a
            pro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div
            ref={leftCardRef}
            className="bg-[#f5f5f0] rounded-2xl p-6 md:p-8 flex flex-col"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 mb-5 self-start">
              <Building2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                My Projects
              </span>
            </div>

            <p className="text-primary font-semibold text-lg md:text-xl mb-6 leading-snug">
              Full details of the
              <br />
              projects you invest in
            </p>

            <div className="flex-1 flex items-end">
              <div className="card-image w-full rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/investors-dashboard/my-projects.png"
                  alt="My Projects dashboard showing Enugu Residential Estate Phase 1 with progress tracker"
                  width={600}
                  height={340}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          <div
            ref={rightCardRef}
            className="bg-[#f5f5f0] rounded-2xl p-6 md:p-8 flex flex-col"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 mb-5 self-start">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                Document Vault
              </span>
            </div>

            <p className="text-primary font-semibold text-lg md:text-xl mb-6 leading-snug">
              Instant access to your Survey
              <br />
              Plans and Allocation Letters.
            </p>

            <div className="flex-1 flex items-end">
              <div className="card-image w-full rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/investors-dashboard/document-vault.png"
                  alt="Document Vault showing Survey Plan and Digital Deed documents"
                  width={600}
                  height={340}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          ref={bottomCardRef}
          className="bg-[#f5f5f0] rounded-2xl p-6 md:p-8"
        >
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 mb-5">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">
              Investment tracking
            </span>
          </div>

          <p className="text-primary/80 text-base md:text-lg max-w-xl leading-relaxed mb-8">
            Monitor your ROI progress and track token balances in one view. Stay
            informed for better financial decisions.
          </p>

          <div className="card-image w-full rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/images/investors-dashboard/investment-tracking.png"
              alt="Investment tracking showing Total Stake, Token Balance, Current Value and Total ROI"
              width={1200}
              height={300}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestorsDashboard;
