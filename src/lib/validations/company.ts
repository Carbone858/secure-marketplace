import { z } from 'zod';

// Company registration step 1: Basic info
export const companyBasicInfoSchema = z.object({
  name: z
    .string()
    .min(2, 'Service provider name must be at least 2 characters')
    .max(100, 'Service provider name is too long')
    .trim(),
  description: z
    .string()
    .max(2000, 'Description is too long')
    .optional()
    .nullable(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .nullable(),
  phone: z
    .string()
    .regex(/^\+[1-9]\d{1,14}$/, 'Please enter a valid phone number with country code')
    .optional()
    .nullable(),
  website: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .nullable()
    .or(z.literal('')),
});

// Company registration step 2: Location
export const companyLocationSchema = z.object({
  countryId: z.string().min(1, 'Please select a country'),
  cityId: z.string().min(1, 'Please select a city'),
  address: z
    .string()
    .max(500, 'Address is too long')
    .optional()
    .nullable(),
});

// Company registration step 3: Services
export const companyServiceSchema = z.object({
  name: z.string().min(2, 'Service name must be at least 2 characters').max(100),
  description: z.string().max(1000).optional().nullable(),
  priceFrom: z.number().min(0).optional().nullable(),
  priceTo: z.number().min(0).optional().nullable(),
});

export const companyServicesSchema = z.object({
  services: z.array(companyServiceSchema).min(1, 'Please add at least one service'),
});

// Working hours schema
export const workingHoursDaySchema = z
  .string()
  .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format')
  .optional()
  .nullable();

export const companyWorkingHoursSchema = z.object({
  monday: workingHoursDaySchema,
  tuesday: workingHoursDaySchema,
  wednesday: workingHoursDaySchema,
  thursday: workingHoursDaySchema,
  friday: workingHoursDaySchema,
  saturday: workingHoursDaySchema,
  sunday: workingHoursDaySchema,
  timeZone: z.string().default('UTC'),
});

// Social links schema
export const companySocialLinksSchema = z.object({
  facebook: z.string().url().optional().nullable().or(z.literal('')),
  twitter: z.string().url().optional().nullable().or(z.literal('')),
  instagram: z.string().url().optional().nullable().or(z.literal('')),
  linkedin: z.string().url().optional().nullable().or(z.literal('')),
  youtube: z.string().url().optional().nullable().or(z.literal('')),
});

// Full company registration schema
export const companyRegistrationSchema = companyBasicInfoSchema
  .merge(companyLocationSchema)
  .merge(companyServicesSchema)
  .merge(z.object({ workingHours: companyWorkingHoursSchema.optional() }))
  .merge(z.object({ socialLinks: companySocialLinksSchema.optional() }));

// Company update schema
export const companyUpdateSchema = z.object({
  name: companyBasicInfoSchema.shape.name.optional(),
  description: companyBasicInfoSchema.shape.description.optional(),
  email: companyBasicInfoSchema.shape.email.optional(),
  phone: companyBasicInfoSchema.shape.phone.optional(),
  website: companyBasicInfoSchema.shape.website.optional(),
  countryId: companyLocationSchema.shape.countryId.optional(),
  cityId: companyLocationSchema.shape.cityId.optional(),
  address: companyLocationSchema.shape.address.optional(),
});

// Document upload schema
export const companyDocumentSchema = z.object({
  type: z.enum(['LICENSE', 'ID_CARD', 'COMMERCIAL_REGISTER', 'TAX_CERTIFICATE', 'OTHER']),
});

// Generate unique slug from company name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Types
export type CompanyBasicInfoInput = z.infer<typeof companyBasicInfoSchema>;
export type CompanyLocationInput = z.infer<typeof companyLocationSchema>;
export type CompanyServiceInput = z.infer<typeof companyServiceSchema>;
export type CompanyServicesInput = z.infer<typeof companyServicesSchema>;
export type CompanyWorkingHoursInput = z.infer<typeof companyWorkingHoursSchema>;
export type CompanySocialLinksInput = z.infer<typeof companySocialLinksSchema>;
export type CompanyRegistrationInput = z.infer<typeof companyRegistrationSchema>;
export type CompanyUpdateInput = z.infer<typeof companyUpdateSchema>;
