"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import z from "zod";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { gsap } from "gsap";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignUpPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isPending, startTransition] = useTransition();

  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const left = gsap.timeline({ defaults: { ease: "power3.out" } });

      left.fromTo(
        "[data-anim='left-panel']",
        { x: "-8%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.5 },
      );

      left.fromTo(
        "[data-anim='headline']",
        { y: 60, opacity: 0, skewY: 3 },
        { y: 0, opacity: 1, skewY: 0, duration: 0.45 },
        "-=0.35",
      );

      left.fromTo(
        "[data-anim='subcopy']",
        { y: 40, opacity: 0, filter: "blur(8px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.4 },
        "-=0.3",
      );

      left.fromTo(
        "[data-anim='hero-image']",
        { scale: 0.85, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.55, ease: "back.out(1.4)" },
        "-=0.25",
      );

      left.fromTo(
        "[data-anim='card-top']",
        { x: -120, y: 40, opacity: 0, rotation: -8, scale: 0.8 },
        {
          x: 0,
          y: 0,
          opacity: 1,
          rotation: 0,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.6)",
        },
        "-=0.4",
      );

      left.fromTo(
        "[data-anim='card-bottom']",
        { x: 120, y: -40, opacity: 0, rotation: 6, scale: 0.8 },
        {
          x: 0,
          y: 0,
          opacity: 1,
          rotation: 0,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.6)",
        },
        "-=0.4",
      );

      const right = gsap.timeline({ defaults: { ease: "power3.out" } });

      right.fromTo(
        "[data-anim='logo']",
        { scale: 0, opacity: 0, rotation: -180 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.4,
          ease: "back.out(2)",
        },
      );

      right.fromTo(
        "[data-anim='welcome']",
        { x: 60, opacity: 0, filter: "blur(6px)" },
        { x: 0, opacity: 1, filter: "blur(0px)", duration: 0.35 },
        "-=0.2",
      );

      right.fromTo(
        "[data-anim='welcome-sub']",
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3 },
        "-=0.15",
      );

      right.fromTo(
        "[data-anim='field-name']",
        { y: 30, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.3 },
        "-=0.15",
      );

      right.fromTo(
        "[data-anim='field-email']",
        { y: 30, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.3 },
        "-=0.15",
      );

      right.fromTo(
        "[data-anim='field-password']",
        { y: 30, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.3 },
        "-=0.15",
      );

      right.fromTo(
        "[data-anim='field-confirm-password']",
        { y: 30, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.3 },
        "-=0.15",
      );

      right.fromTo(
        "[data-anim='submit-btn']",
        { y: 20, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "elastic.out(1, 0.5)",
        },
        "-=0.15",
      );

      right.fromTo(
        "[data-anim='signup-link']",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.25 },
        "-=0.2",
      );
    });

    return () => ctx.revert();
  }, []);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        await authClient.signUp.email(
          {
            email: value.email,
            password: value.password,
            name: value.name,
          },
          {
            onSuccess: () => {
              router.push("/dashboard");
              toast.success("Sign up successful");
            },
            onError: (error) => {
              toast.error(error.error.message || error.error.statusText);
            },
          },
        );
      });
    },
    validators: {
      onSubmit: signUpSchema,
    },
  });

  return (
    <div className="flex min-h-svh w-full">
      <div
        data-anim="left-panel"
        className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden"
        ref={leftPanelRef}
      >
        <div className="flex flex-col justify-center px-12 xl:px-20 py-16 w-full relative z-10">
          <div className="max-w-lg">
            <h1
              data-anim="headline"
              className="text-4xl xl:text-5xl font-bold text-primary-foreground leading-tight mb-6"
            >
              Your access to genuine tokenized real estate
            </h1>
            <p
              data-anim="subcopy"
              className="text-lg text-primary-foreground/70 leading-relaxed"
            >
              Manage your finances with our app that merges saving, investing,
              and planning tools to achieve your goals.
            </p>
          </div>

          <div className="relative mt-10 w-full max-w-xl">
            <Card
              data-anim="card-top"
              className="max-w-[280px] w-full absolute -left-4 top-4 rounded-2xl shadow-2xl border-none z-20 bg-white"
            >
              <CardContent className="px-3 py-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                    <Image
                      src="/icons/house-icon.png"
                      alt="icon"
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900">
                    Enugu Residential
                  </h3>
                </div>
                <div className="flex gap-3 w-full justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 mb-0.5">
                      Status:
                    </p>
                    <p className="text-xs text-gray-600 font-medium leading-tight">
                      Site clearing <br /> 100% complete.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center gap-4">
                    <div>
                      <p className="text-[9px] font-bold text-gray-500 mb-0.5">
                        Holdings:
                      </p>
                      <p className="font-bold text-sm text-gray-900">500</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-gray-500 mb-0.5">
                        Current Value
                      </p>
                      <p className="font-bold text-sm text-gray-900">
                        ₦2,750,000
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Image
              data-anim="hero-image"
              src="/images/house.jpeg"
              alt="Hero Image"
              width={500}
              height={400}
              className="w-full rounded-2xl object-cover z-0 mt-8"
              priority
            />

            <Card
              data-anim="card-bottom"
              className="max-w-[300px] w-full absolute -right-6 bottom-6 rounded-2xl shadow-2xl border-none z-20 bg-white"
            >
              <CardContent className="px-3 py-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                    <Image
                      src="/icons/house-icon.png"
                      alt="icon"
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900">
                    Enugu Residential
                  </h3>
                </div>
                <div className="flex gap-3 w-full justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 mb-0.5">
                      Status:
                    </p>
                    <p className="text-xs text-gray-600 font-medium leading-tight">
                      Site clearing <br /> 100% complete.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center gap-4">
                    <div>
                      <p className="text-[9px] font-bold text-gray-500 mb-0.5">
                        Holdings:
                      </p>
                      <p className="font-bold text-sm text-gray-900">500</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-gray-500 mb-0.5">
                        Current Value
                      </p>
                      <p className="font-bold text-sm text-gray-900">
                        ₦2,750,000
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div
        ref={rightPanelRef}
        className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white"
      >
        <div className="w-full max-w-md space-y-8">
          <div>
            <Image
              data-anim="logo"
              src="/images/logo.png"
              alt="RichHei Group"
              width={120}
              height={48}
              className="mb-8"
              priority
            />
            <h2
              data-anim="welcome"
              className="text-3xl font-bold text-primary tracking-tight"
            >
              Create Account
            </h2>
            <p data-anim="welcome-sub" className="mt-2 text-muted-foreground">
              Sign up to start building your portfolio.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-5"
          >
            <fieldset
              disabled={isPending}
              className="space-y-5 disabled:opacity-60 disabled:pointer-events-none transition-opacity"
            >
              <div data-anim="field-name">
                <form.Field name="name">
                  {(field) => (
                    <Field
                      data-invalid={
                        field.state.meta.errors.length > 0 ? "true" : undefined
                      }
                    >
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-sm font-medium text-foreground"
                      >
                        Full Name
                      </FieldLabel>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <User className="w-4 h-4" />
                        </div>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="text"
                          placeholder="John Doe"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="pl-10 h-12 rounded-lg border-gray-200 text-sm focus-visible:border-primary focus-visible:ring-primary/20"
                        />
                      </div>
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </form.Field>
              </div>

              <div data-anim="field-email">
                <form.Field name="email">
                  {(field) => (
                    <Field
                      data-invalid={
                        field.state.meta.errors.length > 0 ? "true" : undefined
                      }
                    >
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-sm font-medium text-foreground"
                      >
                        Email Address
                      </FieldLabel>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <Mail className="w-4 h-4" />
                        </div>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="email"
                          placeholder="hello@example.com"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="pl-10 h-12 rounded-lg border-gray-200 text-sm focus-visible:border-primary focus-visible:ring-primary/20"
                        />
                      </div>
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </form.Field>
              </div>

              <div data-anim="field-password">
                <form.Field name="password">
                  {(field) => (
                    <Field
                      data-invalid={
                        field.state.meta.errors.length > 0 ? "true" : undefined
                      }
                    >
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-sm font-medium text-foreground"
                      >
                        Password
                      </FieldLabel>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <Lock className="w-4 h-4" />
                        </div>
                        <Input
                          id={field.name}
                          name={field.name}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••••"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="pl-10 pr-10 h-12 rounded-lg border-gray-200 text-sm focus-visible:border-primary focus-visible:ring-primary/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </form.Field>
              </div>

              <div data-anim="field-confirm-password">
                <form.Field name="confirmPassword">
                  {(field) => (
                    <Field
                      data-invalid={
                        field.state.meta.errors.length > 0 ? "true" : undefined
                      }
                    >
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-sm font-medium text-foreground"
                      >
                        Confirm Password
                      </FieldLabel>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <Lock className="w-4 h-4" />
                        </div>
                        <Input
                          id={field.name}
                          name={field.name}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••••"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="pl-10 pr-10 h-12 rounded-lg border-gray-200 text-sm focus-visible:border-primary focus-visible:ring-primary/20"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </form.Field>
              </div>

              <div data-anim="submit-btn">
                <form.Subscribe>
                  {(state) => (
                    <Button
                      type="submit"
                      className="w-full h-12 rounded-full text-base font-semibold gap-2"
                      disabled={
                        !state.canSubmit || state.isSubmitting || isPending
                      }
                    >
                      {state.isSubmitting || isPending
                        ? "Creating account..."
                        : "Create Account"}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </form.Subscribe>
              </div>
            </fieldset>
          </form>

          <p
            data-anim="signup-link"
            className="text-center text-sm text-muted-foreground"
          >
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="text-primary font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export const ComingSoonPage = () => {
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
  );
};

export default SignUpPage;
