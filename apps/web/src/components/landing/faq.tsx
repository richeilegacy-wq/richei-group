"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "What is RicHei?",
    answer:
      "RicHei is a real estate investment and land development platform focused on creating structured, transparent, and profitable property opportunities for investors, agents, and communities.",
  },
  {
    question: "How can someone become a RicHei Land Agent?",
    answer:
      "Becoming a RicHei Land Agent means joining our sales and property advisory network to represent RicHei projects, market our properties, and earn commissions on successful sales. The process is simple: submit an application on our official platform, attend a short onboarding and orientation session, complete basic product knowledge training, get registered as an official RicHei Land Agent, receive marketing materials and project information, and start promoting and closing deals.",
  },
  {
    question: "Who can apply to be a RicHei Land Agent?",
    answer:
      "Individuals interested in real estate marketing, sales professionals, entrepreneurs, youth seeking income opportunities, and anyone passionate about property investment and client relations can apply to become a RicHei Land Agent.",
  },
  {
    question: "What are the requirements to become a RicHei Land Agent?",
    answer:
      "You need strong communication skills, a basic understanding of sales and marketing, a commitment to ethical business practices, and a willingness to complete RicHei onboarding training.",
  },
  {
    question: "How do RicHei Land Agents earn and what are the benefits?",
    answer:
      "RicHei Land Agents earn through commission on every verified land sale, performance bonuses, incentive rewards for high-performing agents, and possible leadership roles within the agent network. Benefits include a flexible working structure, access to verified property listings, a structured commission plan, marketing support, training and mentorship, and the opportunity for long-term career growth in real estate. RicHei Land Agents are not just sales representatives; they are partners in building communities and creating investment opportunities.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="w-full bg-[#f5f5f0] py-20 px-4 md:px-16">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-12 md:gap-16">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary leading-tight mb-6">
            Frequently Asked Questions (FAQ)
          </h2>
          <p className="text-primary/70 text-base leading-relaxed">
            Learn more about RicHei and how to become a RicHei Land Agent. Have
            more questions?{" "}
            <Link href="/" className="text-primary underline font-medium">
              Contact
            </Link>{" "}
            our team.
          </p>
        </div>

        <div className="flex flex-col">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="border-b border-primary/10 last:border-b-0">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer"
                >
                  <span
                    className={`text-base md:text-lg font-semibold transition-colors ${
                      isOpen ? "text-primary" : "text-primary/80"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <span className="shrink-0 w-8 h-8 flex items-center justify-center">
                    {isOpen ? (
                      <X className="w-5 h-5 text-primary" />
                    ) : (
                      <Plus className="w-5 h-5 text-primary/60" />
                    )}
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-primary/60 text-sm md:text-base leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
