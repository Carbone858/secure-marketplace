"use client";

import { useLocale, useTranslations } from "next-intl";
import { ClipboardList, MailCheck, Star } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: {
      ar: "صف المشروع",
      en: "Describe the project"
    },
    description: {
      ar: "أخبرنا بما تحتاج المساعدة فيه، وسنرسل المشروع إلى الشركات ذات الصلة.",
      en: "Tell us what you need help with, and we'll send your project to relevant companies."
    }
  },
  {
    icon: MailCheck,
    title: {
      ar: "تلقي العروض",
      en: "Receive offers"
    },
    description: {
      ar: "بعد فترة وجيزة، ستتلقى عروضاً غير ملزمة من شركات ومهنيين.",
      en: "Shortly after, you'll receive non-binding offers from companies and professionals."
    }
  },
  {
    icon: Star,
    title: {
      ar: "ابدأ الآن!",
      en: "Get started!"
    },
    description: {
      ar: "راجع العروض التي تلقيتها واختر الشركة المناسبة. بعد إتمام العمل، يمكنك كتابة تقييم.",
      en: "Review the offers you received and choose the right company. After the work is done, you can leave a review."
    }
  }
];

export default function HowItWorksSection() {
  const locale = useLocale();
  const t = useTranslations("home");

  return (
    <section className="py-4 bg-muted/30">
      <div className="w-full px-4 md:px-8">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4">
          {locale === "ar"
            ? "كيف يعمل الموقع؟"
            : "How does it work?"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {steps.map((step, i) => (
            <div
              key={i}
              className="w-full"
            >
              <div className={`flex items-center gap-3 ${locale === 'ar' ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`}>
                {locale === 'ar' ? (
                  <>
                    <h3 className="text-lg font-semibold mb-2">{step.title.ar}</h3>
                    <span className="flex items-center justify-center h-14 w-14 mt-1">
                      <step.icon className="h-8 w-8 text-primary" />
                    </span>
                  </>
                ) : (
                  <>
                    <span className="flex items-center justify-center h-14 w-14 mt-1">
                      <step.icon className="h-8 w-8 text-primary" />
                    </span>
                    <h3 className="text-lg font-semibold mb-2">{step.title.en}</h3>
                  </>
                )}
              </div>
              <p className={`text-muted-foreground text-base mt-2 ${locale === 'ar' ? 'text-right' : 'text-left'}`}>{locale === 'ar' ? step.description.ar : step.description.en}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
