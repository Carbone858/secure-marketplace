"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";

const servicesAr = [
  "نجار",
  "دهان",
  "مبلط أرضيات",
  "مُقلم أشجار",
  "بستاني",
  "سباك",
  "كهربائي",
  "مقاول",
  "مصمم داخلي",
  "مُنظف منازل",
  "مصلح أجهزة",
];
const servicesEn = [
  "Carpenter",
  "Painter",
  "Floor Layer",
  "Arborist",
  "Gardener",
  "Plumber",
  "Electrician",
  "Contractor",
  "Interior Designer",
  "Cleaner",
  "Appliance Repair",
];

export default function DynamicServicesBar() {
  const locale = useLocale();
  const services = locale === "ar" ? servicesAr : servicesEn;
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % services.length);
    }, 2000);
    return () => clearTimeout(timeoutRef.current!);
  }, [index, services.length]);

  return (
    <section className="w-full bg-primary/5 py-6">
      <div className="container mx-auto px-4 flex items-center justify-center">
        <span className="text-lg font-medium text-muted-foreground me-2">
          {locale === "ar"
            ? "أفضل طريقة للعثور على"
            : "The best way to find a"}
        </span>
        <span className="text-lg font-bold text-primary transition-all duration-500 min-w-[120px]">
          {services[index]}
        </span>
      </div>
    </section>
  );
}
