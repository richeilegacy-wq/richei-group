 "use client";

 import Image from "next/image";
 import { CircleDot } from "lucide-react";
 import { useEffect, useRef } from "react";
 import { gsap } from "gsap";
 import { ScrollTrigger } from "gsap/ScrollTrigger";

 gsap.registerPlugin(ScrollTrigger);

 const services = [
   {
     title: "Property Development",
     description:
       "RicHei Group specializes in end-to-end property development, transforming land into high-value residential, commercial, and mixed-use spaces. From site selection and design to project delivery, we focus on quality, sustainability, and long-term value for investors and communities.",
     image: "/images/services/house1.avif",
   },
   {
     title: "Construction",
     description:
       "We deliver top-tier construction services, handling everything from structural works to finishing details. Our team leverages modern building technologies and adheres to strict industry standards to deliver durable, efficient, and aesthetically refined projects.",
     image: "/images/services/construction.avif",
   },
   {
     title: "Land Surveys",
     description:
       "Our land survey services provide accurate mapping, boundary delineation, and land title verification. With a strong track record across Nigeria, we help clients de-risk acquisitions, ensure regulatory compliance, and make informed real estate decisions.",
     image: "/images/services/land_survey.avif",
   },
   {
     title: "Facility Management",
     description:
       "We provide comprehensive facility management solutions to enhance the efficiency, safety, and value of residential and commercial properties. From maintenance and security to energy management, our services are tailored to residents, investors, and tenants.",
     image: "/images/services/facility_management.avif",
   },
   {
     title: "Property Financing",
     description:
       "RicHei Group collaborates with financial institutions and partners to deliver innovative property financing solutions. We support clients with funding for land acquisition, development, and investment, making real estate ownership more accessible.",
     image: "/images/services/finance.avif",
   },
 ];

 const ServicesSection = () => {
   const sectionRef = useRef<HTMLElement | null>(null);
   const badgeRef = useRef<HTMLDivElement | null>(null);
   const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

   useEffect(() => {
     const section = sectionRef.current;
     if (!section) return;

     const ctx = gsap.context(() => {
       if (badgeRef.current) {
         gsap.from(badgeRef.current, {
           y: 40,
           opacity: 0,
           scale: 0.9,
           scrollTrigger: {
             trigger: badgeRef.current,
             start: "top 90%",
             end: "top 70%",
             scrub: 1,
           },
         });
       }

       cardRefs.current.forEach((card, index) => {
         if (!card) return;

         gsap.set(card, {
           y: 80,
           opacity: 0,
           scale: 0.96,
         });

         gsap
           .timeline({
             scrollTrigger: {
               trigger: card,
               start: "top 88%",
               end: "top 60%",
               scrub: 1.2 + index * 0.05,
             },
           })
           .to(card, {
             y: 0,
             opacity: 1,
             scale: 1,
             duration: 0.9,
             ease: "power3.out",
           });
       });
     }, section);

     return () => ctx.revert();
   }, []);

   return (
     <section
       id="services"
       ref={sectionRef}
       className="w-full bg-[#12221D] py-20 px-4 md:px-16 overflow-hidden"
     >
       <div className="max-w-6xl mx-auto">
         <div className="flex mb-10">
           <div
             ref={badgeRef}
             className="inline-flex items-center gap-2 bg-[#1D3A30] rounded-full px-4 py-2"
           >
             <CircleDot className="w-4 h-4 text-[#F6E0B5]" />
             <span className="text-sm font-medium text-[#F6E0B5]">
               Our Services
             </span>
           </div>
         </div>

         <div className="space-y-14">
           {services.map((service, index) => (
             <article
               key={service.title}
               ref={(el) => {
                 cardRefs.current[index] = el as HTMLDivElement;
               }}
               className={`service-card flex flex-col gap-10 md:items-center ${
                 index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
               }`}
             >
               <div className="md:w-1/2 space-y-4">
                 <h3 className="text-2xl md:text-3xl font-bold text-[#F6E0B5]">
                   {service.title}
                 </h3>
                 <p className="text-base md:text-lg text-[#F6E0B5]/80 leading-relaxed">
                   {service.description}
                 </p>
               </div>
               <div className="md:w-1/2">
                 <div className="relative w-full rounded-3xl overflow-hidden aspect-[16/9]">
                   <Image
                     src={service.image}
                     alt={service.title}
                     fill
                     sizes="(min-width: 1024px) 560px, (min-width: 768px) 480px, 100vw"
                     className="object-cover"
                   />
                 </div>
               </div>
             </article>
           ))}
         </div>
       </div>
     </section>
   );
 };

 export default ServicesSection;

