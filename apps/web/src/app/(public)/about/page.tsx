"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PublicNav from "@/components/landing/public-nav";
import PublicFooter from "@/components/landing/public-footer";
import { ArrowRight, Eye, Lightbulb, Key, Users } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const AboutPage = () => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hero animations
      const heroTl = gsap.timeline();
      heroTl
        .from(".hero-text", { y: 50, opacity: 0, duration: 1, ease: "power3.out" })
        .from(".hero-nav", { y: -20, opacity: 0, duration: 0.8 }, "-=0.5");

      // Redefining section animations
      gsap.from(".redefine-content", {
        scrollTrigger: {
          trigger: ".redefine-section",
          start: "top 80%",
        },
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".redefine-image", {
        scrollTrigger: {
          trigger: ".redefine-section",
          start: "top 80%",
        },
        x: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      });

      gsap.from(".stat-item", {
        scrollTrigger: {
          trigger: ".stats-section",
          start: "top 85%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
      });

      const statValues = gsap.utils.toArray<HTMLElement>("[data-stat-value]");

      statValues.forEach((el) => {
        const target = parseFloat(el.dataset.target ?? "0");
        const prefix = el.dataset.prefix ?? "";
        const suffix = el.dataset.suffix ?? "";
        const decimals = parseInt(el.dataset.decimals ?? "0", 10);

        const counter = { value: 0 };

        gsap.to(counter, {
          value: target,
          duration: 3.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          onUpdate: () => {
            const formatted = counter.value.toLocaleString(undefined, {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            });
            el.textContent = `${prefix}${formatted}${suffix}`;
          },
        });
      });

      // Core Values animations
      gsap.from(".value-card", {
        scrollTrigger: {
          trigger: ".values-section",
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });

      // Leadership animations
      gsap.from(".leader-card", {
        scrollTrigger: {
          trigger: ".leadership-section",
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });

      // CTA animations
      gsap.from(".cta-content", {
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 70%",
        },
        scale: 0.95,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] overflow-hidden">
        <Image
          src="/images/palmhouse.jpeg"
          alt="Modern Skyscraper"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent" />
        
        <div className="relative z-10 w-full h-full flex flex-col px-4 md:px-16 py-8">
          <div className="hero-nav w-full relative z-20">
            <PublicNav logoVariant="white" />
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto hero-text mt-10">
            <span className="text-[#1f423e] font-bold tracking-widest text-sm mb-4 uppercase">
              About Us
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Democratizing <span className="text-[#1f423e]">Real Estate</span> Investment
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
              Making premium property ownership accessible, transparent, and profitable for everyone through blockchain technology.
            </p>
          </div>
        </div>
      </section>

      {/* Redefining Property Ownership Section */}
      <section className="redefine-section py-20 px-4 md:px-16 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="redefine-content space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-primary leading-tight">
              Redefining Property Ownership in Africa
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Richei Group was born from a vision to transform the African property market. We started by identifying the gap between traditional real estate prestige and modern financial accessibility.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Our journey is one of innovation, bringing the future of investment to the continent. By leveraging distributed ledger technology, we enable fractional ownership of prime residential and commercial assets that were previously out of reach for the average investor.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Today, we are more than just a platform; we are an ecosystem building a borderless future where every individual can own a piece of Africa's growing skyline.
            </p>
          </div>
          
          <div className="redefine-image relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/cta-image.png" // Placeholder
              alt="Modern Architecture"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            <div className="absolute bottom-8 left-8 right-8 bg-[#1a1a1a] p-6 rounded-xl border border-white/10 backdrop-blur-sm">
              <span className="text-[#1f423e] font-bold text-xl block mb-1">2017</span>
              <p className="text-white/90 text-sm">
                The year we began our journey to revolutionize African real estate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div className="stat-item flex flex-col items-center">
              <div className="relative w-60 h-60 mb-4">
                <Image
                  src="/images/about/year.png"
                  alt="Commenced operations icon"
                  fill
                  className="object-contain"
                />
              </div>
             
           
            </div>

            <div className="stat-item flex flex-col items-center">
              <div className="relative w-60 h-60 mb-4">
                <Image
                  src="/images/about/survey.png"
                  alt="Land surveys icon"
                  fill
                  className="object-contain"
                />
              </div>
             
             
            </div>

            <div className="stat-item flex flex-col items-center">
              <div className="relative w-60 h-60 mb-4">
                <Image
                  src="/images/about/properties.png"
                  alt="Properties across Nigeria icon"
                  fill
                  className="object-contain"
                />
              </div>
             
            
            </div>
          </div>

          <p className="mt-12 text-center text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
            At RicHei Group, we are transforming the future of real estate in Africa with a
            commitment to integrity, long-term value, and maximizing the full potential of our
            clients&apos; properties.
          </p>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="values-section py-20 px-4 md:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Core Values</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            The principles that guide our mission to decentralize and democratize wealth creation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Eye,
              title: "Transparency",
              desc: "Immutable on-chain records for every transaction, ensuring complete clarity for all stakeholders."
            },
            {
              icon: Lightbulb,
              title: "Innovation",
              desc: "Pioneering the use of smart contracts to automate legal compliance and yield distribution."
            },
            {
              icon: Key,
              title: "Accessibility",
              desc: "Breaking entry barriers by allowing fractional investment in prime real estate assets."
            },
            {
              icon: Users,
              title: "Community",
              desc: "Building a borderless ecosystem where collective growth drives individual prosperity."
            }
          ].map((value, idx) => (
            <div key={idx} className="value-card bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-[#1f423e]/10 rounded-lg flex items-center justify-center mb-6 text-[#1f423e]">
                <value.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">{value.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {value.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="leadership-section py-20 px-4 md:px-16 bg-white max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Leadership Team</h2>
            <p className="text-gray-500 max-w-xl">
              Meet the visionaries combining real estate expertise with blockchain innovation.
            </p>
          </div>
          <Link href="/team" className="text-[#1f423e] font-semibold flex items-center gap-2 hover:gap-3 transition-all">
            View all team members <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Kofi Mensah",
              role: "Chief Executive Officer",
              image: "/images/who-we-are/coins.jpeg", // Placeholder
              desc: "Former investment banker with 15+ years in real estate development across West Africa."
            },
            {
              name: "Amara Okafor",
              role: "Chief Technology Officer",
              image: "/images/who-we-are/meeting.jpeg", // Placeholder
              desc: "Blockchain architect and former lead developer at a top European fintech firm."
            },
            {
              name: "David Smith",
              role: "Head of Operations",
              image: "/images/who-we-are/chart.jpeg", // Placeholder
              desc: "Expert in multi-national regulatory compliance and operational scaling for prop-tech."
            }
          ].map((leader, idx) => (
            <div key={idx} className="leader-card group">
              <div className="relative h-[400px] w-full rounded-2xl overflow-hidden mb-6 bg-gray-100">
                <Image
                  src={leader.image}
                  alt={leader.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0"
                />
              </div>
              <h3 className="text-xl font-bold text-primary">{leader.name}</h3>
              <p className="text-[#1f423e] text-sm font-medium mb-3">{leader.role}</p>
              <p className="text-gray-500 text-sm leading-relaxed">
                {leader.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-20 px-4 md:px-16">
        <div className="cta-content relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden min-h-[400px] flex items-center justify-center text-center px-6 py-12">
          {/* Background Image/Gradient */}
          <div className="absolute inset-0 bg-[#1a1a1a]">
             <Image
              src="/images/cta-image.png"
              alt="CTA Background"
              fill
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
          </div>

          <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to start your journey?
            </h2>
            <p className="text-white/70 text-lg mb-10">
              Join thousands of investors already building wealth through Richei Group's tokenized ecosystem.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-[#1f423e] hover:bg-[#1f423e]/90 text-white border-none rounded-full px-8 text-lg font-semibold"
              >
                Get Started Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-white text-white hover:bg-white/10 rounded-full px-8 text-lg font-semibold"
              >
                Browse Properties
              </Button>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
};

export default AboutPage;
