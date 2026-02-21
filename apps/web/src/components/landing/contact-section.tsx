"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const formCard = section.querySelector("[data-contact-form]");
      const infoCard = section.querySelector("[data-contact-info]");

      if (formCard) {
        gsap.from(formCard, {
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
        });
      }

      if (infoCard) {
        gsap.from(infoCard, {
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          delay: 0.1,
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="w-full bg-[#f5f5f0] py-20 px-4 md:px-16"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 md:gap-14">
        <div
          data-contact-form
          className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 md:px-10 py-8 md:py-10"
        >
          <div className="mb-6 md:mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1f423e] mb-3">
              Got a question or interested in a property?
            </h2>
            <p className="text-primary/70 text-sm md:text-base max-w-xl">
              Let&apos;s make something happen together. Our team is ready to
              help you find your dream home or next investment.
            </p>
          </div>

          <form className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="contact-name"
                  className="text-xs font-semibold text-primary/80"
                >
                  Name
                </Label>
                <Input
                  id="contact-name"
                  placeholder="Your full name"
                  className="h-11 text-sm rounded-md bg-[#f9faf9]"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="contact-email"
                  className="text-xs font-semibold text-primary/80"
                >
                  Email
                </Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="email@example.com"
                  className="h-11 text-sm rounded-md bg-[#f9faf9]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="contact-project"
                className="text-xs font-semibold text-primary/80"
              >
                Project Description
              </Label>
              <Textarea
                id="contact-project"
                placeholder="Tell us about your property needs..."
                className="min-h-[140px] text-sm rounded-md bg-[#f9faf9]"
              />
            </div>

            <Button
              type="submit"
              className="mt-2 inline-flex items-center justify-center px-6 py-2.5 h-auto rounded-full text-sm font-semibold bg-[#1f423e] text-white hover:bg-[#1f423e]/90"
            >
              Send Now!
            </Button>
          </form>
        </div>

        <div data-contact-info className="flex flex-col gap-8">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Visit us</h3>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1f423e]/6 flex items-center justify-center text-[#1f423e]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">
                    Enugu Office
                  </p>
                  <p className="text-xs text-primary/70 leading-relaxed">
                    39 Chime Avenue New Haven Enugu, Enugu North Local Govt.
                    Area; Enugu State
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1f423e]/6 flex items-center justify-center text-[#1f423e]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">
                    Abuja Branch
                  </p>
                  <p className="text-xs text-primary/70 leading-relaxed">
                    6 Bakwu street, Wuse 2, Fct, Abuja.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1f423e]/6 flex items-center justify-center text-[#1f423e]">
                <Phone className="w-4 h-4" />
              </div>
              <p className="text-xs text-primary/80">+234 (0) 000 000 0000</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1f423e]/6 flex items-center justify-center text-[#1f423e]">
                <Mail className="w-4 h-4" />
              </div>
              <p className="text-xs text-primary/80">hello@richeigroup.com</p>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

