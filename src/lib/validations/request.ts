import { z } from 'zod';

export const requestStatusSchema = z.enum([
  'DRAFT',
  'PENDING',
  'ACTIVE',
  'MATCHING',
  'REVIEWING_OFFERS',
  'ACCEPTED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
  'EXPIRED',
]);

export const urgencyLevelSchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);

export const visibilityLevelSchema = z.enum(['PUBLIC', 'REGISTERED_ONLY', 'VERIFIED_COMPANIES']);

const createRequestBaseSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title is too long'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(5000, 'Description is too long'),
  categoryId: z.string().min(1, 'Please select a category'),
  subcategoryId: z.string().optional(),
  countryId: z.string().min(1, 'Please select a country'),
  cityId: z.string().min(1, 'Please select a city'),
  areaId: z.string().optional(),
  address: z.string().max(500).optional(),
  budgetMin: z.number().min(0, 'Budget must be 0 or greater').optional(),
  budgetMax: z.number().min(0, 'Budget must be 0 or greater').optional(),
  currency: z.string().default('USD'),
  deadline: z.string().optional().refine(
    (val) => {
      if (!val) return true;
      const d = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return d >= today;
    },
    { message: 'Deadline must be a future date' }
  ),
  urgency: urgencyLevelSchema.default('MEDIUM'),
  visibility: visibilityLevelSchema.default('PUBLIC'),
  images: z.array(z.string()).max(10, 'Maximum 10 images allowed').default([]),
  attachments: z.array(z.string()).max(5, 'Maximum 5 attachments allowed').default([]),
  tags: z.array(z.string()).max(10).default([]),
  allowRemote: z.boolean().default(false),
  requireVerification: z.boolean().default(false),
});

export const createRequestSchema = createRequestBaseSchema.refine(
  (data) => {
    if (data.budgetMin != null && data.budgetMax != null) {
      return data.budgetMin <= data.budgetMax;
    }
    return true;
  },
  {
    message: 'Minimum budget cannot exceed maximum budget',
    path: ['budgetMin'],
  }
);

export const updateRequestSchema = createRequestBaseSchema.partial().extend({
  status: requestStatusSchema.optional(),
});

export const requestFilterSchema = z.object({
  categoryId: z.string().optional(),
  countryId: z.string().optional(),
  cityId: z.string().optional(),
  status: requestStatusSchema.optional(),
  urgency: urgencyLevelSchema.optional(),
  budgetMin: z.number().optional(),
  budgetMax: z.number().optional(),
  search: z.string().optional(),
  userId: z.string().optional(),
  page: z.number().default(1),
  limit: z.number().max(50).default(10),
  sortBy: z.enum(['createdAt', 'deadline', 'budgetMax', 'urgency']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const offerSchema = z.object({
  requestId: z.string().min(1, 'Request ID is required'),
  price: z.number().min(0, 'Price must be positive'),
  currency: z.string().default('USD'),
  description: z.string().max(2000, 'Description is too long').optional(),
  estimatedDays: z.number().min(1).optional(),
  attachments: z.array(z.string()).max(5).default([]),
  message: z.string().max(2000).optional(),
});

export const updateOfferSchema = z.object({
  price: z.number().min(0).optional(),
  description: z.string().max(2000).optional(),
  estimatedDays: z.number().min(1).optional(),
  status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN', 'EXPIRED']).optional(),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type UpdateRequestInput = z.infer<typeof updateRequestSchema>;
export type RequestFilterInput = z.infer<typeof requestFilterSchema>;
export type OfferInput = z.infer<typeof offerSchema>;
export type UpdateOfferInput = z.infer<typeof updateOfferSchema>;

// Alias for backward compatibility
export const createOfferSchema = offerSchema;
export type CreateOfferInput = z.input<typeof offerSchema>;
