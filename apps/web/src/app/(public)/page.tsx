"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import PublicNav from "@/components/landing/public-nav";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WhoWeAre from "@/components/landing/who-we-are";
import InvestorsDashboard from "@/components/landing/investors-dashboard";
import HowItWorks from "@/components/landing/how-it-works";
import LicensesSection from "@/components/landing/licenses-section";
import ServicesSection from "@/components/landing/services-section";
import FAQ from "@/components/landing/faq";
import ContactSection from "@/components/landing/contact-section";
import CTASection from "@/components/landing/cta-section";
import PublicFooter from "@/components/landing/public-footer";
import { useRouter } from "next/navigation";

const page = () => {
  const heroRef = useRef<HTMLElement | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const router = useRouter()

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(heroRef);
      const headline = q("[data-hero-headline]");
      const subcopy = q("[data-hero-subcopy]");
      const cta = q("[data-hero-cta]");
      const image = q("[data-hero-image]");
      const cards = q("[data-hero-card]");

      gsap.set([headline, subcopy, cta], { opacity: 0, y: 40 });
      gsap.set(image, { opacity: 0, y: 60, scale: 0.96 });
      gsap.set(cards, { opacity: 0, y: 40, rotate: -2 });

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

      intro
        .to(headline, { opacity: 1, y: 0, duration: 0.8 })
        .to(subcopy, { opacity: 1, y: 0, duration: 0.7 }, "-=0.4")
        .to(cta, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
        .to(image, { opacity: 1, y: 0, scale: 1, duration: 0.9 }, "-=0.4")
        .to(
          cards,
          {
            opacity: 1,
            y: 0,
            rotate: 0,
            duration: 0.8,
            stagger: 0.12,
          },
          "-=0.5",
        );

      gsap
        .timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top+=120",
            scrub: true,
          },
        })
        .to(headline, { y: -120, opacity: 0 })
        .to(subcopy, { y: -140, opacity: 0 }, "<")
        .to(cta, { y: -160, opacity: 0 }, "<")
        .to(image, { y: -220, opacity: 0, scale: 0.9 }, "<")
        .to(
          cards,
          {
            x: (index: number) => (index % 2 === 0 ? 160 : -160),
            y: -120,
            opacity: 0,
            rotate: (index: number) => (index % 2 === 0 ? 6 : -6),
            stagger: 0.08,
          },
          "<",
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        className="relative w-full min-h-svh h-screen p-4 overflow-hidden"
        style={{
          backgroundImage: "url(/images/house.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <video
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isVideoLoaded ? "opacity-100" : "opacity-0"}`}
          autoPlay
          loop
          muted
          playsInline
          onCanPlay={() => setIsVideoLoaded(true)}
        >
          <source src="/videos/housing.mp4" type="video/mp4" />
        </video>
        <div className="relative w-full h-full rounded-lg py-8 px-4 md:px-16 flex flex-col overflow-hidden">
          <PublicNav />
          <section
            ref={heroRef}
            className="flex flex-col justify-between w-full max-w-3xl mx-auto flex-1 mt-10"
          >
            <div className="space-y-5 flex flex-col items-center justify-center">
              <h1 className="text-6xl text-center font-bold" data-hero-headline>
                Your access to genuine tokenized real estate{" "}
              </h1>
              <p
                className="font-semibold md:text-2xl text-lg text-center text-primary/80"
                data-hero-subcopy
              >
                Manage your finances with our app that merges saving, investing,
                and planning tools to achieve your goals.
              </p>
              <Button
                className="text-lg rounded-full"
                size={"lg"}
                data-hero-cta
                onClick={() => router.push("/auth/sign-in")}
              >
                Get Started{" "}
                <ArrowRight className="w-5 h-5 bg-white text-primary rounded-full p-1" />
              </Button>
            </div>
            <div className="flex items-center justify-center relative w-full">
              <Card
                className="hidden md:block max-w-sm w-full absolute -left-16 top-10 rounded-2xl shadow-xl border border-white/30 z-20 bg-white/30 backdrop-blur-lg"
                data-hero-card
              >
                <CardContent className="px-3">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-white/25 rounded-full flex items-center justify-center shrink-0 backdrop-blur-sm">
                      <Image
                        src="/icons/house-icon.png"
                        alt="icon"
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">
                      Enugu Residential
                    </h3>
                  </div>
                  <div className="flex gap-3 w-full justify-between">
                    <div className="mb-6">
                      <p className="text-xs font-bold text-gray-500 mb-1">
                        Status:
                      </p>
                      <p className="text-sm text-gray-600 font-medium leading-tight">
                        Site clearing <br /> 100% complete.
                      </p>
                    </div>

                    <div className="bg-white/35 rounded-xl p-4 flex justify-between items-center backdrop-blur-sm border border-white/30">
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 mb-0.5">
                          Holdings:
                        </p>
                        <p className="font-bold text-lg text-gray-900">500</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-500 mb-0.5">
                          Current Value
                        </p>
                        <p className="font-bold text-lg text-gray-900">
                          ₦2,750,000
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card
                className="hidden md:block max-w-sm w-full absolute -right-16 bottom-10 rounded-2xl shadow-xl border border-white/30 z-20 bg-white/30 backdrop-blur-lg"
                data-hero-card
              >
                <CardContent className="px-2">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-white/25 rounded-full flex items-center justify-center shrink-0 backdrop-blur-sm">
                      <Image
                        src="/icons/house-icon.png"
                        alt="icon"
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">
                      Lagos Residential
                    </h3>
                  </div>

                  <div className="flex gap-3 w-full justify-between">
                    <div className="mb-6">
                      <p className="text-xs font-bold text-gray-500 mb-1">
                        Status:
                      </p>
                      <p className="text-sm text-gray-600 font-medium leading-tight">
                        Site clearing <br /> 100% complete.
                      </p>
                    </div>
                    <div className="bg-white/35 rounded-xl p-4 flex justify-between items-center backdrop-blur-sm border border-white/30">
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 mb-0.5">
                          Holdings:
                        </p>
                        <p className="font-bold text-lg text-gray-900">1000</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-500 mb-0.5">
                          Current Value
                        </p>
                        <p className="font-bold text-lg text-gray-900">
                          ₦5,500,000
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Image
                src="/images/palmhouse.jpeg"
                alt="Hero Image"
                width={500}
                height={500}
                className="md:w-[90%] rounded-2xl md:h-[90%] w-full h-full object-contain z-0"
                data-hero-image
              />
            </div>
          </section>
        </div>
      </section>
      <WhoWeAre />
      <ServicesSection />
      <InvestorsDashboard />
      <HowItWorks />
      <LicensesSection />
      <FAQ />
      <ContactSection />
      <CTASection />
      <PublicFooter />
    </>
  );
};

export default page;
