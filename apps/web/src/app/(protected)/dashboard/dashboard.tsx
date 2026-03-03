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
  TrendingUp,
  Star,
  FileText,
  Building2,
  PieChart,
} from "lucide-react";

export default function Dashboard() {
  const privateData = useQuery(orpc.privateData.queryOptions());

  return (
    <section className="flex flex-col gap-10 pb-20 bg-gray-50/30">
      {/* Total Portfolio Value Section */}
      <section className="w-full px-4 md:px-10 lg:px-16 pt-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <p className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">
              TOTAL PORTFOLIO VALUE
            </p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl md:text-6xl font-bold text-[#1a2e28]">
                $1,250,000<span className="text-2xl md:text-4xl text-gray-300">.00</span>
              </h2>
              <div className="flex items-center gap-1 text-[#22c55e] bg-[#22c55e]/10 px-2 py-1 rounded-full text-xs font-bold">
                <TrendingUp size={14} />
                <span>12.4%</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="rounded-full border-gray-200 text-gray-600 font-semibold px-6 hover:bg-gray-50"
            >
              <CirclePlus className="w-4 h-4 mr-2" /> Invest More
            </Button>
            <Button className="rounded-full bg-[#1a2e28] hover:bg-[#1a2e28]/90 text-white font-bold px-8 uppercase tracking-wider text-xs">
              GENERATE REPORT
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Cards Section */}
      <section className="max-w-7xl mx-auto w-full px-4 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Building2 className="w-5 h-5" />}
            label="ACTIVE STAKE"
            value="$450,000"
            subtext="Locked in 4 projects"
          />
          <StatCard
            icon={<PieChart className="w-5 h-5" />}
            label="TOKEN BALANCE"
            value="12,500 RCH"
            subtext="+2.5% vs last month"
            subtextHighlight
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="CURRENT VALUE"
            value="$512,000"
            subtext="Appreciating"
            subtextHighlight
          />
          <StatCard
            icon={<Monitor className="w-5 h-5" />}
            label="TOTAL ROI"
            value="+13.8%"
            subtext="Realized $62,400"
          />
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto w-full px-4 md:px-10 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Column: Project Highlight */}
          <div className="w-full lg:w-[65%] space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
                  <Star className="w-4 h-4 text-gray-700" />
                </div>
                <h3 className="text-xl font-bold text-[#1a2e28]">Project Highlight</h3>
              </div>
              <button className="text-sm font-semibold text-gray-500 hover:text-gray-700 underline underline-offset-4">
                View All Projects
              </button>
            </div>

            <div className="relative group rounded-3xl overflow-hidden shadow-2xl">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src="/images/palmhouse.jpeg"
                  alt="Enugu Residential Estate"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Project Badge */}
                <div className="absolute top-6 left-6">
                  <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-3 py-1">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">TOP INVESTMENT</span>
                  </div>
                </div>

                {/* Project Info Overlay */}
                <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                  <div className="space-y-1">
                    <h4 className="text-3xl font-bold text-white">Enugu Residential Estate</h4>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <Globe size={14} />
                      <span>Enugu, Nigeria • Phase 1 Construction</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">PROJECT PROGRESS</p>
                    <p className="text-4xl font-bold text-white">74%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ProjectDetailCard label="EXPECTED ROI" value="22.5% Per Annum" />
              <ProjectDetailCard label="COMPLETION DATE" value="Q4 2025" />
              <ProjectDetailCard label="RISK RATING" value="Low-Moderate" status="low-moderate" />
            </div>
          </div>

          {/* Right Column: Legal Documents */}
          <div className="w-full lg:w-[35%] space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
                <FileText className="w-4 h-4 text-gray-700" />
              </div>
              <h3 className="text-xl font-bold text-[#1a2e28]">Legal Documents</h3>
            </div>

            <div className="space-y-4">
              <DocumentCard title="Survey Plan" subtitle="VERIFIED OCT 2023" />
              <DocumentCard title="Digital Deed" subtitle="NFT CERTIFIED" />
              <DocumentCard title="Allocation Letter" subtitle="UNIT #4B-201" />
              
              <div className="mt-6 p-8 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-3 bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-gray-600 transition-colors">
                  <CirclePlus className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-gray-500 group-hover:text-gray-700">Upload additional documents</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

function StatCard({ icon, label, value, subtext, subtextHighlight }: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  subtext: string;
  subtextHighlight?: boolean;
}) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500">
          {icon}
        </div>
        <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
          {label}
        </p>
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-[#1a2e28]">{value}</p>
        <p className={`text-xs font-medium ${subtextHighlight ? 'text-[#22c55e]' : 'text-gray-400'}`}>
          {subtextHighlight && subtext.startsWith('+') ? '▲ ' : ''}
          {subtext}
        </p>
      </div>
    </div>
  );
}

function ProjectDetailCard({ label, value, status }: { label: string; value: string; status?: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-2">
      <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">{label}</p>
      <div className="flex items-center gap-2">
        {status === 'low-moderate' && <div className="w-2 h-2 rounded-full bg-[#22c55e]" />}
        <p className="text-sm font-bold text-[#1a2e28]">{value}</p>
      </div>
    </div>
  );
}

function DocumentCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-gray-200 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500">
          <FileText className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <p className="font-bold text-[#1a2e28]">{title}</p>
          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{subtitle}</p>
        </div>
      </div>
      <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-all">
        <Download className="w-5 h-5" />
      </button>
    </div>
  );
}
