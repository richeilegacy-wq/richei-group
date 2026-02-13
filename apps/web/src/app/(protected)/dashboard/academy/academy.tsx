"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BadgeCheck, ArrowRight } from "lucide-react";

export default function AcademyPage() {
  return (
    <section className="flex flex-col gap-8 pb-10">
      <section className="w-full px-4 md:px-10 lg:px-16 pt-6">
        <div className="w-full max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-sidebar-accent">
            Start learning
          </h1>
        </div>
      </section>

      <section className="w-full px-4 md:px-10 lg:px-16">
        <div className="relative w-full max-w-7xl mx-auto rounded-2xl overflow-hidden min-h-[300px] md:min-h-[360px] flex items-center">
          <Image
            src="/images/academy-placeholder-image.png"
            alt="Academy Banner"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-[#263330]/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-linear-to-r from-[#1a2e28]/90 via-[#263330]/70 to-transparent" />

          <div className="relative z-10 flex flex-col justify-center px-6 md:px-16 w-full max-w-3xl gap-6 py-10">
            <h2 className="text-white text-3xl md:text-5xl font-bold leading-tight">
              Welcome back!
            </h2>
            <p className="text-white/90 text-lg md:text-xl font-medium max-w-2xl">
              Professional real estate and investment literacy for the next
              generation of agents.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full px-4 md:px-10 lg:px-16">
        <div className="w-full max-w-7xl mx-auto space-y-6">
          <h2 className="text-xl font-semibold text-sidebar-accent">Recents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Course Card 1 */}
            <div className="bg-sidebar rounded-xl overflow-hidden border border-gray-100 flex flex-col h-full group hover:shadow-md transition-shadow">
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src="/images/academy-placeholder-image.png"
                  alt="Property appraisal"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>
              <div className="p-5 flex flex-col flex-1 gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-sidebar-accent line-clamp-2">
                    Property appraisal:
                  </h3>
                </div>

                <div className="mt-auto space-y-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#263330] h-2 rounded-full transition-all duration-500"
                      style={{ width: "75%" }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-sidebar-accent">
                      75%
                    </span>
                    <Button variant="outline" size="sm" className="gap-2 h-9">
                      In Process <ArrowRight size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Card 2 */}
            <div className="bg-sidebar rounded-xl overflow-hidden border border-gray-100 flex flex-col h-full group hover:shadow-md transition-shadow">
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src="/images/academy-placeholder-image.png"
                  alt="Final inspection"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>
              <div className="p-5 flex flex-col flex-1 gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-sidebar-accent line-clamp-2">
                    Final inspection:
                  </h3>
                </div>

                <div className="mt-auto space-y-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#263330] h-2 rounded-full transition-all duration-500"
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-sidebar-accent">
                      100%
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 h-9 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
                    >
                      Completed <BadgeCheck size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Card 3 */}
            <div className="bg-sidebar rounded-xl overflow-hidden border border-gray-100 flex flex-col h-full group hover:shadow-md transition-shadow">
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src="/images/academy-placeholder-image.png"
                  alt="Land verification"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>
              <div className="p-5 flex flex-col flex-1 gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-sidebar-accent line-clamp-2">
                    Land verification:
                  </h3>
                </div>

                <div className="mt-auto space-y-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#263330] h-2 rounded-full transition-all duration-500"
                      style={{ width: "50%" }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-sidebar-accent">
                      50%
                    </span>
                    <Button variant="outline" size="sm" className="gap-2 h-9">
                      Continue <ArrowRight size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-4 md:px-10 lg:px-16">
        <div className="w-full max-w-7xl mx-auto space-y-6">
          <h2 className="text-xl font-semibold text-sidebar-accent">
            Recommended for you
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Reusing cards structure but with different progress/status */}
            {/* Recommended Card 1 */}
            <div className="bg-sidebar rounded-xl overflow-hidden border border-gray-100 flex flex-col h-full group hover:shadow-md transition-shadow">
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src="/images/academy-placeholder-image.png"
                  alt="Property appraisal"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>
              <div className="p-5 flex flex-col flex-1 gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-sidebar-accent line-clamp-2">
                    Property appraisal:
                  </h3>
                </div>

                <div className="mt-auto space-y-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#263330] h-2 rounded-full transition-all duration-500"
                      style={{ width: "75%" }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-sidebar-accent">
                      75%
                    </span>
                    <Button variant="outline" size="sm" className="gap-2 h-9">
                      In Process <ArrowRight size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Card 2 */}
            <div className="bg-sidebar rounded-xl overflow-hidden border border-gray-100 flex flex-col h-full group hover:shadow-md transition-shadow">
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src="/images/academy-placeholder-image.png"
                  alt="Final inspection"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>
              <div className="p-5 flex flex-col flex-1 gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-sidebar-accent line-clamp-2">
                    Final inspection:
                  </h3>
                </div>

                <div className="mt-auto space-y-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#263330] h-2 rounded-full transition-all duration-500"
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-sidebar-accent">
                      100%
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 h-9 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
                    >
                      Completed <BadgeCheck size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Card 3 */}
            <div className="bg-sidebar rounded-xl overflow-hidden border border-gray-100 flex flex-col h-full group hover:shadow-md transition-shadow">
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src="/images/academy-placeholder-image.png"
                  alt="Land verification"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>
              <div className="p-5 flex flex-col flex-1 gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-sidebar-accent line-clamp-2">
                    Land verification:
                  </h3>
                </div>

                <div className="mt-auto space-y-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#263330] h-2 rounded-full transition-all duration-500"
                      style={{ width: "50%" }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-sidebar-accent">
                      50%
                    </span>
                    <Button variant="outline" size="sm" className="gap-2 h-9">
                      Continue <ArrowRight size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
