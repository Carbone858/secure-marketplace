'use client';

import { CheckCircle2, Crown, Zap, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { toast } from 'sonner';

export default function MembershipPage() {
  const t = useTranslations('membership');
  const router = useRouter();

  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      description: 'Perfect for getting started and exploring opportunities.',
      features: ['Up to 5 offers per month', 'Basic profile visibility', 'Community support', 'Email notifications'],
      icon: Zap,
      buttonText: 'Current Plan',
      popular: false,
    },
    {
      name: 'Professional',
      price: '$29/mo',
      description: 'Ideal for small businesses looking to grow significantly.',
      features: ['Unlimited offers', 'Priority profile placement', 'Verified badge', 'Advanced analytics', '24/7 Priority support'],
      icon: Crown,
      buttonText: 'Upgrade Now',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations requiring maximum reach and control.',
      features: ['White-label solutions', 'Dedicated account manager', 'API access', 'Custom contract terms', 'Bulk company verification'],
      icon: ShieldCheck,
      buttonText: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          Choose the Perfect Plan for Your Business
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Unlock exclusive features, increase your visibility, and reach more customers with our membership tiers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.name} className={`relative flex flex-col ${plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'}`}>
            {plan.popular && (
              <div className="absolute top-0 right-0 left-0 -translate-y-1/2 flex justify-center">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider italic">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <plan.icon className={`h-6 w-6 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.price !== 'Free' && plan.price !== 'Custom' && <span className="text-muted-foreground text-sm font-medium">/month</span>}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={plan.popular ? 'default' : 'outline'}
                disabled={plan.price === 'Free'}
                onClick={() => toast.info('Payment gateway integration coming soon!')}
              >
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-20 text-center p-12 bg-muted/30 rounded-3xl border border-border/50">
        <h2 className="text-2xl font-bold mb-4 italic">Need a custom solution for your region?</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          We understand the unique challenges in certain markets. If you require specialized assistance or alternative payment methods, our team is here to help.
        </p>
        <Button variant="secondary" onClick={() => router.push('/contact')}>
          Contact Support Team
        </Button>
      </div>
    </div>
  );
}
