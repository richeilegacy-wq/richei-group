"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Route } from "next";
import { Menu, X, Phone, ArrowRight } from "lucide-react";
import gsap from "gsap";
import {cn} from "@/lib/utils";

const navLinks: { href: Route; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/about" as Route, label: "About" },
  { href: "/#faq" as Route, label: "FAQ" },
  { href: "/#contact" as Route, label: "Contact us" },
];

type PublicNavProps = {
  className?: string;
  logoVariant?: "default" | "white";
};

export default function PublicNav({ className, logoVariant = "default" }: PublicNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      tl.current = gsap
        .timeline({ paused: true })
        .to(menuRef.current, {
          y: 0,
          duration: 0.5,
          ease: "power2.inOut",
          autoAlpha: 1, // handles visibility: hidden automatically
        })
        .from(
          linksRef.current?.children || [],
          {
            y: 20,
            opacity: 0,
            duration: 0.3,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.2",
        );
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (isOpen) {
      tl.current?.play();
    } else {
      tl.current?.reverse();
    }
  }, [isOpen]);

  return (
    <header className={cn("md:px-8 w-full flex items-center justify-between relative z-50", className)}>
      <Image
        src={logoVariant === "white" ? "/images/logo-white.png" : "/images/logo.png"}
        alt="Logo"
        width={75.72}
        height={41.7}
      />

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center rounded-full bg-[#fff] p-1.5 pl-6 gap-2 shadow-sm border border-border/5">
        <div className="flex items-center justify-center gap-6 mr-4">
          {navLinks.map((link) => (
            <Link
              className="text-base font-medium text-primary/80 hover:text-primary transition-colors"
              key={link.href}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-center px-2">
          <Phone className="w-5 h-5 text-primary/80 fill-current" />
        </div>

        <Button className="text-base rounded-full pl-5 pr-1.5 py-1.5 h-auto" size={"default"}>
          <Link href="/auth/sign-in" className="flex items-center gap-3">
            <span>Get Started</span>
            <div className="w-8 h-8 rounded-full bg-[#ECF5E8] text-primary flex items-center justify-center">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </Button>
      </nav>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden z-50 relative p-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
      </button>

      {/* Mobile Menu Overlay */}
      <div
        ref={menuRef}
        className="fixed inset-0 bg-background flex flex-col items-center justify-center -translate-y-full opacity-0 invisible"
        style={{ transform: "translateY(-100%)" }} // ensure initial state for SSR
      >
        <div ref={linksRef} className="flex flex-col items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-3xl font-bold hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <Button
          className="text-lg rounded-full mt-8"
          size={"lg"}
          onClick={() => setIsOpen(false)}
        >
          <Link href="/auth/sign-in">Get Started</Link>
        </Button>
      </div>
    </header>
  );
}
