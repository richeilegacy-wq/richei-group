"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import { orpc } from "@/utils/orpc";
import {
  CirclePlus,
  Download,
  Banknote,
  BadgeCheck,
  AlertCircle,
  ArrowRight,
  Globe,
  Wallet,
  Coins,
  Monitor,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

export default function Dashboard() {
  const privateData = useQuery(orpc.privateData.queryOptions());

  return (
    <section className="flex flex-col gap-4">
      <section className="w-full px-4 md:px-10 lg:px-16 py-10">
        <div className="relative w-full max-w-7xl mx-auto rounded-2xl overflow-hidden min-h-[360px] md:min-h-[169px] flex items-center justify-center">
          <Image
            src="/images/cta-image.png"
            alt="CTA Background"
            fill
            className="object-cover"
            priority={false}
          />
          <div className="absolute inset-0 bg-[#263330]/85 mix-blend-multiply" />
          <div className="absolute inset-0 bg-linear-to-br from-[#1a2e28]/60 to-[#263330]/70" />
          <div className="relative z-10 flex flex-col justify-between px-6 md:px-16 w-full gap-6 py-5">
            <div className="text-primary-foreground flex flex-col md:flex-row gap-4">
              <p className="font-medium flex items-center gap-2">
                <Banknote />
                Total Portfolio value
              </p>
              <p className="font-semibold flex items-center gap-2">
                <BadgeCheck />
                Veified investor (Teir 3)
              </p>
            </div>
            <div className="flex lg:items-end items-start justify-between w-full gap-4 flex-col lg:flex-row">
              <div className="flex gap-2 xl:items-end flex-col xl:flex-row items-start">
                <p className="text-white text-4xl 2xl:text-5xl font-semibold">
                  ₦6,850,000.00
                </p>
                <p className="text-white text-sm font-regular">
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
                  className="bg-white text-sidebar-accent rounded-md w-fil sm:w-auto"
                >
                  <Download /> Withdraw
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto container px-4">
        <p className="text-2xl font-semibold text-sidebar-accent">
          My projects
        </p>
      </section>
      <section className="max-w-7xl mx-auto container px-4">
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="w-full lg:w-2/3 bg-sidebar overflow-hidden rounded-xl">
            <div className="relative w-full h-[250px]">
              <Image
                src="/images/project-1.png"
                alt="project-1"
                fill
                className="object-cover"
              />
              <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
                <AlertCircle size={14} className="text-yellow-500" />
                <span className="text-xs font-semibold text-sidebar-accent">
                  Under Construction
                </span>
              </div>
            </div>
            <div className="w-full p-4 space-y-4">
              <div className="w-full flex items-center justify-between">
                <p className="text-2xl font-semibold text-sidebar-accent">
                  Enugu Residential Estate (Phase 1)
                </p>
                <p className="text-sm font-regular">ID: #RIC-EN-001</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold">Progress tracker</p>
                <div className="flex gap-4 items-center justify-items-start">
                  <p className="text-xs flex gap-2">
                    Land Clearing{" "}
                    <span className="flex items-center gap-1 text-xs text-green-500 font-bold">
                      <BadgeCheck size={12} /> Done
                    </span>
                  </p>
                  <p className="text-xs flex gap-2">
                    Perimeter Fencing{" "}
                    <span className="flex items-center gap-1 text-xs text-orange-500 font-bold">
                      Pending
                    </span>
                  </p>
                  <p className="text-xs flex gap-2">
                    Internal Road Network{" "}
                    <span className="flex items-center gap-1 text-xs text-green-500 font-bold">
                      <BadgeCheck size={12} /> 70% Done
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/3 bg-sidebar overflow-hidden rounded-xl">
            <div className="p-4 flex items-center gap-2">
              <Globe size={16} className="text-sidebar-accent" />
              <p className="text-sm font-semibold text-sidebar-accent">
                RichHei Academy:
              </p>
            </div>
            <div className="relative w-full h-[180px] px-4">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image
                  src="/images/project-2.png"
                  alt="RichHei Academy"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm font-semibold text-sidebar-accent">
                Land verification:
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#263330] h-2 rounded-full"
                  style={{ width: "50%" }}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-sidebar-accent">50%</p>
                <button className="flex items-center gap-1 text-sm font-medium text-sidebar-accent border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors">
                  Continue <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto container px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-sidebar rounded-xl p-5 space-y-3">
            <Wallet size={24} className="text-sidebar-accent" />
            <p className="text-sm text-gray-500">Total Stake</p>
            <p className="text-2xl font-bold text-sidebar-accent">
              ₦500K{" "}
              <span className="text-sm font-normal text-gray-500">
                Initial stake
              </span>
            </p>
          </div>
          <div className="bg-sidebar rounded-xl p-5 space-y-3">
            <Coins size={24} className="text-sidebar-accent" />
            <p className="text-sm text-gray-500">Token Balance</p>
            <p className="text-2xl font-bold text-sidebar-accent">
              100
              <span className="text-sm font-normal text-gray-500">
                REPH1
              </span>{" "}
              <span className="text-sm font-normal text-gray-500">
                (Cost: ₦5k/ea)
              </span>
            </p>
          </div>
          <div className="bg-sidebar rounded-xl p-5 space-y-3">
            <Monitor size={24} className="text-sidebar-accent" />
            <p className="text-sm text-gray-500">Current Value</p>
            <p className="text-2xl font-bold text-sidebar-accent">
              ₦571K{" "}
              <span className="text-sm font-normal text-gray-500">
                (Appreciated)
              </span>
            </p>
          </div>
          <div className="bg-sidebar rounded-xl p-5 space-y-3">
            <RefreshCw size={24} className="text-sidebar-accent" />
            <p className="text-sm text-gray-500">Total ROI</p>
            <p className="text-2xl font-bold text-sidebar-accent">
              ₦71,000{" "}
              <span className="text-sm font-normal text-green-500">+14.2%</span>
            </p>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto container px-4 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold text-sidebar-accent">
            Documents
          </p>
          <p className="flex items-center gap-2 text-sm font-semibold text-sidebar-accent">
            <ShieldCheck size={18} className="text-green-600" /> IPFS Secured
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-sidebar rounded-xl overflow-hidden flex flex-col">
            <p className="text-sm font-bold italic text-sidebar-accent p-4 pb-2">
              Survey Plan
            </p>
            <div className="relative w-full h-[200px] px-4">
              <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src="/images/document.png"
                  alt="Survey Plan"
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col gap-2">
              <p className="text-sm text-sidebar-accent flex items-center gap-1">
                <BadgeCheck size={14} className="text-green-600" /> Verified by:
              </p>
              <p className="text-base font-semibold text-sidebar-accent">
                Enugu State Ministry of Lands.
              </p>
              <Button className="w-full bg-[#263330] text-white rounded-lg mt-auto hover:bg-[#1a2e28]">
                <Download size={16} /> Download
              </Button>
            </div>
          </div>
          <div className="bg-sidebar rounded-xl overflow-hidden flex flex-col">
            <p className="text-sm font-bold italic text-sidebar-accent p-4 pb-2">
              Digital Deed
            </p>
            <div className="relative w-full h-[200px] px-4">
              <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src="/images/document.png"
                  alt="Digital Deed"
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col gap-2">
              <p className="text-base text-sidebar-accent font-medium">
                The Digital Deed on the Ethereum network.
              </p>
              <Button className="w-full bg-[#263330] text-white rounded-lg mt-auto hover:bg-[#1a2e28]">
                <Download size={16} /> Download
              </Button>
            </div>
          </div>
          <div className="bg-sidebar rounded-xl overflow-hidden flex flex-col">
            <p className="text-sm font-bold italic text-sidebar-accent p-4 pb-2">
              Allocation Letter
            </p>
            <div className="relative w-full h-[200px] px-4">
              <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src="/images/document.png"
                  alt="Allocation Letter"
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col gap-2">
              <p className="text-lg text-sidebar-accent font-medium">
                Personal proof of plot assignment.
              </p>
              <Button className="w-full bg-[#263330] text-white rounded-lg mt-auto hover:bg-[#1a2e28]">
                <Download size={16} /> Download
              </Button>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
