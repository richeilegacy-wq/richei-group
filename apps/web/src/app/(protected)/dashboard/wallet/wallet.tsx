import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Banknote,
  CirclePlus,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Copy,
} from "lucide-react";

const referrals = [
  {
    id: 1,
    name: "Frank Gruillo",
    date: "Today 12:45 AM",
    amount: 20.0,
  },
  {
    id: 2,
    name: "Sarah Connors",
    date: "Today 1:15 AM",
    amount: 20.0,
  },
  {
    id: 3,
    name: "John Doe",
    date: "Today 2:30 AM",
    amount: 20.0,
  },
  {
    id: 4,
    name: "Alice Smith",
    date: "Today 3:00 AM",
    amount: 20.0,
  },
  {
    id: 5,
    name: "Alice Smith",
    date: "Today 3:00 AM",
    amount: 20.0,
  },
];

const transactions = [
  {
    id: 1,
    type: "deposit" as const,
    label: "Money Deposit",
    date: "Today 12:45 AM",
    amount: 500.0,
  },
  {
    id: 2,
    type: "withdrawal" as const,
    label: "Money Withdrawal",
    date: "Today 12:45 AM",
    amount: 500.0,
  },
  {
    id: 3,
    type: "deposit" as const,
    label: "Money Deposit",
    date: "Today 12:45 AM",
    amount: 500.0,
  },
  {
    id: 4,
    type: "withdrawal" as const,
    label: "Money Withdrawal",
    date: "Today 12:45 AM",
    amount: 500.0,
  },
  {
    id: 5,
    type: "deposit" as const,
    label: "Money Deposit",
    date: "Today 12:45 AM",
    amount: 500.0,
  },
];

const Wallet = () => {
  return (
    <section className="w-full h-full grid xl:grid-cols-5 grid-cols-1 gap-6 max-w-7xl container mx-auto py-10 px-4">
      <section className="xl:col-span-3 col-span-1 space-y-5">
        <div>
          <p className="text-2xl font-semibold">Wallet overview</p>
        </div>
        <div className="relative w-full max-w-7xl mx-auto rounded-2xl overflow-hidden min-h-[300px] md:min-h-[169px] flex items-center justify-center">
          <Image
            src="/images/cta-image.png"
            alt="CTA Background"
            fill
            className="object-cover"
            priority={false}
          />
          <div className="absolute inset-0 bg-[#263330]/85 mix-blend-multiply" />
          <div className="absolute inset-0 bg-linear-to-br from-[#1a2e28]/60 to-[#263330]/70" />
          <div className="relative z-10 flex flex-col justify-between px-6 md:px-16 w-full gap-4 py-5">
            <div className="text-white/80 flex flex-col md:flex-row gap-4">
              <p className="font-medium flex items-center gap-2">
                <Banknote />
                My balance
              </p>
            </div>
            <div className="flex lg:items-start items-start justify-between w-full gap-4 flex-col">
              <div className="flex gap-2 flex-col items-start">
                <p className="text-white text-4xl 2xl:text-5xl font-semibold">
                  ₦6,850,000.00
                </p>
                <p className="text-white/80 text-sm font-regular">
                  10%+ Since last week
                </p>
              </div>
              <div className="flex gap-2 flex-col sm:flex-row w-full lg:w-auto">
                <Button
                  size="lg"
                  className="bg-white text-sidebar-accent rounded-md w-full sm:w-auto"
                >
                  <CirclePlus /> Invest Now
                </Button>
                <Button
                  size="lg"
                  className="bg-white text-sidebar-accent rounded-md w-full sm:w-auto"
                >
                  <Download /> Withdraw
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xl font-semibold text-sidebar-accent">
              Recent Transactions
            </p>
            <button className="text-sm font-medium text-gray-500 hover:text-sidebar-accent transition-colors flex items-center gap-1">
              View all <ChevronRight size={14} />
            </button>
          </div>

          <div className="bg-sidebar rounded-xl overflow-hidden divide-y divide-gray-100">
            {transactions.map((tx) => {
              const isDeposit = tx.type === "deposit";
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between px-5 py-4 hover:bg-gray-50/60 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isDeposit
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      {isDeposit ? (
                        <ArrowDownLeft size={20} strokeWidth={2.5} />
                      ) : (
                        <ArrowUpRight size={20} strokeWidth={2.5} />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-sidebar-accent">
                        {tx.label}
                      </p>
                      <p className="text-xs text-gray-400">{tx.date}</p>
                    </div>
                  </div>
                  <p
                    className={`text-base font-semibold tabular-nums ${
                      isDeposit ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {isDeposit ? "+" : "−"}${tx.amount.toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="xl:col-span-2 col-span-1 space-y-5">
        <div>
          <p className="text-2xl font-semibold">Referrals</p>
        </div>

        <div className="relative w-full rounded-2xl overflow-hidden bg-[#DCE1E1] min-h-[300px] md:min-h-[169px] flex items-center">
          <div className="relative z-10 flex flex-col justify-between px-6 py-6 w-full gap-4">
            <p className="text-sidebar-accent text-lg font-semibold leading-snug max-w-[160px]">
              Earn free $20 on each referral you make
            </p>
            <button className="flex items-center gap-2 bg-sidebar-accent text-white text-sm font-medium rounded-full px-4 py-2 w-fit hover:bg-sidebar-accent/90 transition-colors">
              <Copy size={14} />
              Copy code
            </button>
          </div>
          <div className="absolute right-0 bottom-0 top-0 flex items-center pr-4">
            <Image
              src="/icons/referrals-icon.png"
              alt="Referrals"
              width={120}
              height={120}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xl font-semibold text-sidebar-accent">Recents</p>
            <button className="text-sm font-medium text-gray-500 hover:text-sidebar-accent transition-colors flex items-center gap-1">
              View all <ChevronRight size={14} />
            </button>
          </div>

          <div className="bg-sidebar rounded-xl overflow-hidden divide-y divide-gray-100">
            {referrals.map((ref) => (
              <div
                key={ref.id}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50/60 transition-colors cursor-pointer"
              >
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-sidebar-accent">
                    Referred &ldquo;{ref.name}&rdquo;
                  </p>
                  <p className="text-xs text-gray-400">{ref.date}</p>
                </div>
                <p className="text-base font-semibold tabular-nums text-emerald-600">
                  +${ref.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
};

export default Wallet;
