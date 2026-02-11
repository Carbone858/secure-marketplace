'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { toast } from 'sonner';
import {
  Loader2,
  MapPin,
  Star,
  Building2,
  CheckCircle,
  Globe,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Briefcase,
  ArrowLeft,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Company {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  coverImage: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  verificationStatus: string;
  createdAt: string;
  country: { name: string; nameAr: string | null };
  city: { name: string; nameAr: string | null };
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  services: {
    id: string;
    name: string;
    description: string | null;
    priceFrom: number | null;
    priceTo: number | null;
  }[];
  workingHours: Record<string, string> | null;
  socialLinks: Record<string, string> | null;
  reviews: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
      name: string | null;
      image: string | null;
    };
  }[];
  _count: {
    reviews: number;
    completedProjects: number;
  };
}

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const { user } = useAuth();

  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    fetchCompany();
  }, [params.slug]);

  const fetchCompany = async () => {
    try {
      const response = await fetch(`/api/companies/${params.slug}`);
      if (!response.ok) throw new Error('Failed to fetch company');
      const data = await response.json();
      setCompany(data.company);
    } catch (err) {
      toast.error('Failed to load company');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      router.push(`/${locale}/auth/login`);
      return;
    }

    setIsSubmittingReview(true);
    try {
      const response = await fetch(`/api/companies/${company?.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
      });

      if (!response.ok) throw new Error('Failed to submit review');

      toast.success('Review submitted successfully');
      setReviewComment('');
      setReviewRating(5);
      fetchCompany();
    } catch (err) {
      toast.error('Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleSendMessage = async () => {
    if (!user || !company) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: company.user.id,
          content: messageText,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      toast.success('Message sent successfully');
      setMessageText('');
      setMessageDialogOpen(false);
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  const averageRating =
    company?.reviews.length
      ? company.reviews.reduce((sum, r) => sum + r.rating, 0) / company.reviews.length
      : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Company not found</h1>
        <Button onClick={() => router.push(`/${locale}/companies`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Companies
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Cover Image */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-primary/20 to-primary/40 relative">
        {company.coverImage && (
          <img
            src={company.coverImage}
            alt={company.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        {/* Company Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Logo */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 border-4 border-background">
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Building2 className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold">{company.name}</h1>
                  {company.verificationStatus === 'VERIFIED' && (
                    <Badge className="bg-primary/100">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {company.city?.name}, {company.country?.name}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-warning" />
                    <span className="font-medium">{averageRating.toFixed(1)}</span>
                    <span>({company._count.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {company._count.completedProjects} projects
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Member since {new Date(company.createdAt).getFullYear()}
                  </div>
                </div>

                {company.description && (
                  <p className="text-muted-foreground max-w-2xl">{company.description}</p>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send Message to {company.name}</DialogTitle>
                        <DialogDescription>
                          Your message will be sent to the company.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <Textarea
                          placeholder="Write your message..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          rows={4}
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!messageText.trim()}
                          className="w-full"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {company.website && (
                    <Button variant="outline" asChild>
                      <a href={company.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        Website
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({company._count.reviews})</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {company.services.map((service) => (
                <Card key={service.id}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{service.name}</h3>
                    {service.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {service.description}
                      </p>
                    )}
                    {(service.priceFrom || service.priceTo) && (
                      <div className="text-sm">
                        <span className="font-medium">Price: </span>
                        {service.priceFrom && service.priceTo
                          ? `${service.priceFrom} - ${service.priceTo}`
                          : service.priceFrom
                          ? `From ${service.priceFrom}`
                          : `Up to ${service.priceTo}`}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Review Form */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Write a Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Rating</Label>
                      <div className="flex gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="p-1"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= reviewRating
                                  ? 'fill-warning text-warning'
                                  : 'text-muted-foreground/30'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="comment">Your Review</Label>
                      <Textarea
                        id="comment"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your experience..."
                        rows={4}
                        className="mt-2"
                      />
                    </div>
                    <Button
                      onClick={handleSubmitReview}
                      disabled={!reviewComment.trim() || isSubmittingReview}
                      className="w-full"
                    >
                      {isSubmittingReview ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        'Submit Review'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews List */}
              <div className="lg:col-span-2 space-y-4">
                {company.reviews.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                      <p className="text-muted-foreground">
                        Be the first to review this company
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  company.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src={review.user.image || undefined} />
                            <AvatarFallback>
                              {review.user.name?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{review.user.name}</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? 'fill-warning text-warning'
                                        : 'text-muted-foreground/30'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                            <p>{review.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="about">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">About {company.name}</h3>
                {company.description ? (
                  <p className="text-muted-foreground">{company.description}</p>
                ) : (
                  <p className="text-muted-foreground">No description available.</p>
                )}

                {company.workingHours && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Working Hours</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(company.workingHours).map(([day, hours]) => (
                        <div key={day} className="text-sm">
                          <span className="font-medium capitalize">{day}:</span>{' '}
                          <span className="text-muted-foreground">
                            {hours || 'Closed'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {company.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <a href={`mailto:${company.email}`} className="font-medium">
                          {company.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {company.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <a href={`tel:${company.phone}`} className="font-medium">
                          {company.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {company.address && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">{company.address}</p>
                      </div>
                    </div>
                  )}
                  {company.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Website</p>
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary"
                        >
                          {company.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
