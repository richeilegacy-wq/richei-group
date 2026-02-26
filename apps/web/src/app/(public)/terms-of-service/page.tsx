"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { gsap } from "gsap";
import PublicNav from "@/components/landing/public-nav";
import PublicFooter from "@/components/landing/public-footer";

export default function PrivacyPolicyPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        "[data-anim='cs-bg-blob1']",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: "power2.out" },
      )
        .fromTo(
          "[data-anim='cs-bg-blob2']",
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.5, ease: "power2.out" },
          "-=1.2",
        )
        .fromTo(
          "[data-anim='cs-logo']",
          { y: -30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.5",
        )
        .fromTo(
          "[data-anim='cs-title']",
          { y: 40, opacity: 0, filter: "blur(10px)", skewY: 2 },
          { y: 0, opacity: 1, filter: "blur(0px)", skewY: 0, duration: 0.8 },
          "-=0.6",
        )
        .fromTo(
          "[data-anim='cs-subtitle']",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.5",
        )
        .fromTo(
          "[data-anim='cs-form']",
          { y: 20, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.2)" },
          "-=0.4",
        )
        .fromTo(
          "[data-anim='cs-footer']",
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          "-=0.2",
        );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
    toast.success("You have been added to the waitlist!");
  };

  return (
    <>
    <PublicNav className="mt-4"/>
    <div
      ref={containerRef}
      className="relative min-h-svh w-full flex flex-col items-center justify-center overflow-hidden bg-white"
    >
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <div
          data-anim="cs-bg-blob1"
          className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]"
        />
        <div
          data-anim="cs-bg-blob2"
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]"
        />

        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgNDBMMDAgMEw0MCAwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMCwwLDAsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')] opacity-50" />
      </div>

      <div className="relative z-10 w-full max-w-3xl px-6 flex flex-col items-center text-center">
        <div
          data-anim="cs-logo"
          className="mb-14 p-4 bg-white/50 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100"
        >
          <Image
            src="/images/logo.png"
            alt="Richei Group"
            width={75.72}
            height={41.7}
            priority
            className="contain"
          />
        </div>

        <h1
          data-anim="cs-title"
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-6"
        >
          Building the future of <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-600">
            tokenized real estate.
          </span>
        </h1>

        <p
          data-anim="cs-subtitle"
          className="text-lg md:text-xl text-gray-500 mb-10 max-w-xl mx-auto font-medium leading-relaxed"
        >
          We&apos;re preparing something extraordinary. Join our exclusive
          waitlist to be among the first to experience the new standard in real
          estate investing.
        </p>

        <div
          data-anim="cs-form"
          className="w-full max-w-md mx-auto relative z-20"
        >
          {!isSubmitted ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="pl-12 h-14 rounded-full border-gray-200 bg-white/80 backdrop-blur-md shadow-sm text-base focus-visible:ring-primary focus-visible:border-primary transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="h-14 rounded-full px-8 text-base font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 whitespace-nowrap bg-primary text-primary-foreground"
              >
                Notify Me
              </Button>
            </form>
          ) : (
            <div className="bg-green-50/80 backdrop-blur-md border border-green-200 rounded-full p-4 text-green-700 font-semibold flex items-center justify-center gap-3 shadow-sm transform transition-all">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              You&apos;re on the list! We&apos;ll be in touch.
            </div>
          )}
        </div>
      </div>

      <div
        data-anim="cs-footer"
        className="absolute bottom-8 left-0 right-0 text-center text-gray-400 text-sm font-medium z-10"
      >
        © {new Date().getFullYear()} Richei Group. All rights reserved.
      </div>
    </div>
    <PublicFooter/>
    </>
  );
}