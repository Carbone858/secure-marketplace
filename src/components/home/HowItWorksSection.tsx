"use client";

import { useLocale, useTranslations } from "next-intl";
import { ClipboardList, MailCheck, Star } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "صف المشروع",
    description:
      "أخبرنا بما تحتاج المساعدة فيه، وسنرسل المشروع إلى الشركات ذات الصلة.",
  },
  {
    icon: MailCheck,
    title: "تلقي العروض",
    description:
      "بعد فترة وجيزة، ستتلقى عروضاً غير ملزمة من شركات ومهنيين.",
  },
  {
    icon: Star,
    title: "ابدأ الآن!",
    description:
      "راجع العروض التي تلقيتها واختر الشركة المناسبة. بعد إتمام العمل، يمكنك كتابة تقييم.",
  },
];

export default function HowItWorksSection() {
  const locale = useLocale();
  const t = useTranslations("home");

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          {locale === "ar"
            ? "كيف يعمل الموقع؟"
            : "How does it work?"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center bg-card rounded-2xl shadow-sm p-8 h-full"
            >
              <span className="mb-4 flex items-center justify-center h-16 w-16 rounded-full bg-primary/10">
                <step.icon className="h-8 w-8 text-primary" />
              </span>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-base">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
