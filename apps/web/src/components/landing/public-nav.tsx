"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Route } from "next";
import { Menu, X, Phone, ArrowRight, ChevronDown } from "lucide-react";
import gsap from "gsap";
import {cn} from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#about" as Route, label: "About" },
  { 
    href: "/#services" as Route, 
    label: "Services",
    dropdown: [
      { href: "/#services" as Route, label: "Property Development" },
      { href: "/#services" as Route, label: "Construction" },
      { href: "/#services" as Route, label: "Land Surveys" },
      { href: "/#services" as Route, label: "Facility Management" },
      { href: "/#services" as Route, label: "Property Financing" },
    ]
  },
  { href: "/#projects" as Route, label: "Projects" },
  { href: "/#investors-tokenization" as Route, label: "Investors & Tokenization" },
  { href: "/#impact-sdgs" as Route, label: "Impact & SDGs" },
  { href: "/#contact" as Route, label: "Contact" },
];

type PublicNavProps = {
  className?: string;
  logoVariant?: "default" | "white";
};

export default function PublicNav({ className, logoVariant = "default" }: PublicNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150); // Small delay to prevent accidental closing
  };

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
    <header className={cn("md:px-8 w-full flex items-center justify-between sticky top-0 z-50 bg-white/80 backdrop-blur-md py-4 transition-all duration-300", className)}>
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
            link.dropdown ? (
              <div 
                key={link.label}
                onMouseEnter={() => handleMouseEnter(link.label)}
                onMouseLeave={handleMouseLeave}
              >
                <DropdownMenu 
                  open={openDropdown === link.label} 
                  onOpenChange={(open) => {
                    if (!open) handleMouseLeave();
                    else handleMouseEnter(link.label);
                  }}
                >
                  <DropdownMenuTrigger className="flex items-center gap-1 text-base font-medium text-primary/80 hover:text-primary transition-colors outline-none cursor-pointer">
                    {link.label}
                    <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", openDropdown === link.label && "rotate-180")} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="bg-white border-border/5 min-w-[200px] z-50"
                    onMouseEnter={() => handleMouseEnter(link.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {link.dropdown.map((sublink) => (
                      <DropdownMenuItem key={sublink.label} className="p-0">
                        <Link
                          href={sublink.href as Route}
                          className="w-full text-sm font-medium text-primary/80 hover:text-primary transition-colors py-2 px-4 block"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {sublink.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link
                className="text-base font-medium text-primary/80 hover:text-primary transition-colors"
                key={link.href}
                href={link.href as Route}
              >
                {link.label}
              </Link>
            )
          ))}
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
        {isOpen ? <X className="w-8 h-8 text-primary" /> : <Menu className="w-8 h-8 text-primary" />}
      </button>

      {/* Mobile Menu Overlay */}
      <div
        ref={menuRef}
        className="fixed inset-0 bg-background flex flex-col items-center justify-center -translate-y-full opacity-0 invisible"
        style={{ transform: "translateY(-100%)" }} // ensure initial state for SSR
      >
        <div ref={linksRef} className="flex flex-col items-center gap-6 overflow-y-auto max-h-[70vh] py-10 px-6">
          {navLinks.map((link) => (
            <div key={link.label} className="flex flex-col items-center gap-4">
              <Link
                href={link.href as Route}
                className="text-2xl font-bold hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
              {link.dropdown && (
                <div className="flex flex-col items-center gap-2">
                  {link.dropdown.map((sublink) => (
                    <Link
                      key={sublink.label}
                      href={sublink.href as Route}
                      className="text-lg font-medium text-primary/60 hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {sublink.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
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
