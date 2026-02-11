"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "Is this solely based on cryptocurrency",
    answer:
      "Blockchain is our record-keeper, but your investment is in physical Nigerian land.",
  },
  {
    question: "Is it possible for me to visit the land",
    answer:
      "Yes. All our projects are physically verifiable. We organize scheduled site visits and can arrange private tours upon request.",
  },
  {
    question: "How are payments processed",
    answer:
      "We accept payments via direct bank transfer (Naira) and cryptocurrency (USDT/USDC). All transactions are recorded and reflected on your investor dashboard.",
  },
  {
    question: "Do you deal both on land and buildings",
    answer:
      "Yes. RichHei Assets covers both raw land acquisitions and residential development projects across Nigeria.",
  },
  {
    question: "How do non-crypto users navigate",
    answer:
      "You don't need any crypto knowledge. Pay in Naira via bank transfer, and we handle the tokenization behind the scenes. Your dashboard works the same either way.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="w-full bg-[#f5f5f0] py-20 px-4 md:px-16">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-12 md:gap-16">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary leading-tight mb-6">
            Frequently
            <br />
            Asked
            <br />
            Questions
          </h2>
          <p className="text-primary/70 text-base leading-relaxed">
            Everything you need to know about RicHei Assets can be answered.
            Have more questions?{" "}
            {/* TODO: Add contact page */}
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
