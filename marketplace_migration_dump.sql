--
-- PostgreSQL database dump
--

\restrict m08fy6fOw2bCqdQEMff7Uw82xM19wg2TpXqEfwKMnbehRZGInmdxeLSRKbAdcUp

-- Dumped from database version 16.12
-- Dumped by pg_dump version 16.12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: CompanyVerificationStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CompanyVerificationStatus" AS ENUM (
    'PENDING',
    'UNDER_REVIEW',
    'VERIFIED',
    'REJECTED',
    'EXPIRED'
);


ALTER TYPE public."CompanyVerificationStatus" OWNER TO postgres;

--
-- Name: HealthCategory; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."HealthCategory" AS ENUM (
    'API',
    'DATABASE',
    'CACHE',
    'AUTH',
    'REQUESTS',
    'MESSAGING',
    'UPLOADS',
    'SECURITY'
);


ALTER TYPE public."HealthCategory" OWNER TO postgres;

--
-- Name: HealthStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."HealthStatus" AS ENUM (
    'OK',
    'WARNING',
    'CRITICAL'
);


ALTER TYPE public."HealthStatus" OWNER TO postgres;

--
-- Name: MembershipDuration; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MembershipDuration" AS ENUM (
    'MONTHLY',
    'QUARTERLY',
    'YEARLY'
);


ALTER TYPE public."MembershipDuration" OWNER TO postgres;

--
-- Name: MembershipStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MembershipStatus" AS ENUM (
    'ACTIVE',
    'CANCELLED',
    'EXPIRED'
);


ALTER TYPE public."MembershipStatus" OWNER TO postgres;

--
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."NotificationType" AS ENUM (
    'MESSAGE',
    'PROJECT',
    'OFFER',
    'REQUEST',
    'SYSTEM'
);


ALTER TYPE public."NotificationType" OWNER TO postgres;

--
-- Name: OfferStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OfferStatus" AS ENUM (
    'PENDING',
    'ACCEPTED',
    'REJECTED',
    'WITHDRAWN',
    'EXPIRED'
);


ALTER TYPE public."OfferStatus" OWNER TO postgres;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED',
    'REFUNDED'
);


ALTER TYPE public."PaymentStatus" OWNER TO postgres;

--
-- Name: ProjectStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ProjectStatus" AS ENUM (
    'PENDING',
    'ACTIVE',
    'ON_HOLD',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."ProjectStatus" OWNER TO postgres;

--
-- Name: RequestStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RequestStatus" AS ENUM (
    'DRAFT',
    'PENDING',
    'ACTIVE',
    'MATCHING',
    'REVIEWING_OFFERS',
    'ACCEPTED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'EXPIRED'
);


ALTER TYPE public."RequestStatus" OWNER TO postgres;

--
-- Name: SecurityLogType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SecurityLogType" AS ENUM (
    'LOGIN',
    'LOGIN_FAILED',
    'LOGOUT',
    'REGISTER',
    'REGISTER_FAILED',
    'PASSWORD_RESET',
    'PASSWORD_RESET_FAILED',
    'EMAIL_VERIFIED',
    'EMAIL_VERIFICATION_FAILED',
    'ACCOUNT_LOCKED',
    'SUSPICIOUS_ACTIVITY'
);


ALTER TYPE public."SecurityLogType" OWNER TO postgres;

--
-- Name: SubscriptionPlan; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SubscriptionPlan" AS ENUM (
    'FREE',
    'BASIC',
    'PREMIUM',
    'ENTERPRISE'
);


ALTER TYPE public."SubscriptionPlan" OWNER TO postgres;

--
-- Name: UrgencyLevel; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UrgencyLevel" AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'URGENT'
);


ALTER TYPE public."UrgencyLevel" OWNER TO postgres;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'USER',
    'COMPANY',
    'ADMIN',
    'SUPER_ADMIN'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

--
-- Name: VisibilityLevel; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."VisibilityLevel" AS ENUM (
    'PUBLIC',
    'REGISTERED_ONLY',
    'VERIFIED_COMPANIES'
);


ALTER TYPE public."VisibilityLevel" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: alert_states; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alert_states (
    id text NOT NULL,
    service text NOT NULL,
    "lastAlertAt" timestamp(3) without time zone,
    "isSuppressed" boolean DEFAULT false NOT NULL,
    "failCount" integer DEFAULT 0 NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.alert_states OWNER TO postgres;

--
-- Name: areas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.areas (
    id text NOT NULL,
    "cityId" text NOT NULL,
    "nameEn" text NOT NULL,
    "nameAr" text NOT NULL,
    slug text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE public.areas OWNER TO postgres;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id text NOT NULL,
    name text NOT NULL,
    "nameEn" text NOT NULL,
    "nameAr" text NOT NULL,
    slug text NOT NULL,
    icon text,
    "iconName" text,
    "imageUrl" text,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "isFeatured" boolean DEFAULT false NOT NULL,
    "parentId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: cities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cities (
    id text NOT NULL,
    "countryId" text NOT NULL,
    "nameAr" text NOT NULL,
    "nameEn" text NOT NULL,
    slug text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE public.cities OWNER TO postgres;

--
-- Name: cms_pages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cms_pages (
    id text NOT NULL,
    title text NOT NULL,
    "titleAr" text,
    slug text NOT NULL,
    content text NOT NULL,
    "contentAr" text,
    "metaDescription" text,
    "metaKeywords" text,
    "isPublished" boolean DEFAULT true NOT NULL,
    "createdBy" text,
    "updatedBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.cms_pages OWNER TO postgres;

--
-- Name: cms_sections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cms_sections (
    id text NOT NULL,
    name text NOT NULL,
    identifier text NOT NULL,
    page text DEFAULT 'home'::text NOT NULL,
    content jsonb NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.cms_sections OWNER TO postgres;

--
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    id text NOT NULL,
    "userId" text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    logo text,
    website text,
    email text,
    phone text,
    "countryId" text,
    "cityId" text,
    address text,
    "verificationStatus" public."CompanyVerificationStatus" DEFAULT 'PENDING'::public."CompanyVerificationStatus" NOT NULL,
    "verifiedAt" timestamp(3) without time zone,
    "verifiedBy" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "isFeatured" boolean DEFAULT false NOT NULL,
    rating double precision DEFAULT 0 NOT NULL,
    "reviewCount" integer DEFAULT 0 NOT NULL,
    "currentPlan" public."SubscriptionPlan" DEFAULT 'FREE'::public."SubscriptionPlan" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "operationAreas" text[] DEFAULT ARRAY[]::text[],
    skills text[] DEFAULT ARRAY[]::text[]
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- Name: company_documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_documents (
    id text NOT NULL,
    "companyId" text NOT NULL,
    type text NOT NULL,
    "fileUrl" text NOT NULL,
    "fileName" text NOT NULL,
    "mimeType" text NOT NULL,
    "fileSize" integer NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "adminNotes" text,
    "uploadedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "reviewedAt" timestamp(3) without time zone
);


ALTER TABLE public.company_documents OWNER TO postgres;

--
-- Name: company_matching_preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_matching_preferences (
    id text NOT NULL,
    "companyId" text NOT NULL,
    "categoryIds" text[] DEFAULT ARRAY[]::text[],
    "cityIds" text[] DEFAULT ARRAY[]::text[],
    "budgetMin" double precision,
    "budgetMax" double precision,
    "urgencyLevels" text[] DEFAULT ARRAY[]::text[],
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.company_matching_preferences OWNER TO postgres;

--
-- Name: company_portfolio_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_portfolio_items (
    id text NOT NULL,
    "companyId" text NOT NULL,
    title text NOT NULL,
    description text,
    "imageUrl" text,
    "projectUrl" text,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.company_portfolio_items OWNER TO postgres;

--
-- Name: company_services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_services (
    id text NOT NULL,
    "companyId" text NOT NULL,
    name text NOT NULL,
    description text,
    "priceFrom" double precision,
    "priceTo" double precision,
    "isActive" boolean DEFAULT true NOT NULL,
    tags text[] DEFAULT ARRAY[]::text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.company_services OWNER TO postgres;

--
-- Name: company_social_links; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_social_links (
    id text NOT NULL,
    "companyId" text NOT NULL,
    facebook text,
    twitter text,
    instagram text,
    linkedin text,
    youtube text
);


ALTER TABLE public.company_social_links OWNER TO postgres;

--
-- Name: company_working_hours; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_working_hours (
    id text NOT NULL,
    "companyId" text NOT NULL,
    monday text,
    tuesday text,
    wednesday text,
    thursday text,
    friday text,
    saturday text,
    sunday text,
    "timeZone" text DEFAULT 'UTC'::text NOT NULL
);


ALTER TABLE public.company_working_hours OWNER TO postgres;

--
-- Name: countries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.countries (
    id text NOT NULL,
    code text NOT NULL,
    "nameAr" text NOT NULL,
    "nameEn" text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE public.countries OWNER TO postgres;

--
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    id text NOT NULL,
    name text NOT NULL,
    "nameAr" text,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- Name: feature_flags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.feature_flags (
    id text NOT NULL,
    key text NOT NULL,
    value boolean DEFAULT false NOT NULL,
    description text,
    category text DEFAULT 'general'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "descriptionAr" text,
    "isDynamic" boolean DEFAULT true NOT NULL,
    "nameAr" text,
    "nameEn" text,
    "sortOrder" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.feature_flags OWNER TO postgres;

--
-- Name: flag_audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flag_audit_logs (
    id text NOT NULL,
    "flagId" text NOT NULL,
    "flagKey" text NOT NULL,
    "adminId" text NOT NULL,
    "adminName" text,
    "prevValue" boolean NOT NULL,
    "newValue" boolean NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.flag_audit_logs OWNER TO postgres;

--
-- Name: health_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.health_logs (
    id text NOT NULL,
    service text NOT NULL,
    category public."HealthCategory" NOT NULL,
    status public."HealthStatus" NOT NULL,
    "latencyMs" integer,
    "statusCode" integer,
    "errorMessage" text,
    url text,
    details text,
    "retryCount" integer DEFAULT 0 NOT NULL,
    "testedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    source text DEFAULT 'synthetic'::text NOT NULL
);


ALTER TABLE public.health_logs OWNER TO postgres;

--
-- Name: internal_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.internal_messages (
    id text NOT NULL,
    "senderId" text NOT NULL,
    "recipientId" text,
    "departmentId" text,
    subject text NOT NULL,
    content text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    priority text DEFAULT 'NORMAL'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.internal_messages OWNER TO postgres;

--
-- Name: membership_plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.membership_plans (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    price double precision NOT NULL,
    currency text DEFAULT 'USD'::text NOT NULL,
    duration public."MembershipDuration" DEFAULT 'MONTHLY'::public."MembershipDuration" NOT NULL,
    features jsonb,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.membership_plans OWNER TO postgres;

--
-- Name: memberships; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.memberships (
    id text NOT NULL,
    "companyId" text NOT NULL,
    "planId" text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    status public."MembershipStatus" DEFAULT 'ACTIVE'::public."MembershipStatus" NOT NULL,
    "autoRenew" boolean DEFAULT false NOT NULL,
    "paymentMethod" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.memberships OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id text NOT NULL,
    "senderId" text NOT NULL,
    "recipientId" text NOT NULL,
    content text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "projectId" text,
    "requestId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: notification_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification_settings (
    id text NOT NULL,
    "userId" text NOT NULL,
    "emailNewOffers" boolean DEFAULT true NOT NULL,
    "emailRequestUpdates" boolean DEFAULT true NOT NULL,
    "emailMessages" boolean DEFAULT true NOT NULL,
    "emailMarketing" boolean DEFAULT false NOT NULL,
    "emailSecurityAlerts" boolean DEFAULT true NOT NULL,
    "pushNewOffers" boolean DEFAULT true NOT NULL,
    "pushRequestUpdates" boolean DEFAULT true NOT NULL,
    "pushMessages" boolean DEFAULT true NOT NULL,
    "smsSecurityAlerts" boolean DEFAULT true NOT NULL,
    "smsMarketing" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.notification_settings OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id text NOT NULL,
    "userId" text NOT NULL,
    type public."NotificationType" NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    data jsonb,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: offers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.offers (
    id text NOT NULL,
    "requestId" text NOT NULL,
    "companyId" text NOT NULL,
    price double precision NOT NULL,
    currency text DEFAULT 'USD'::text NOT NULL,
    description text,
    "estimatedDays" integer,
    attachments jsonb,
    message text,
    status public."OfferStatus" DEFAULT 'PENDING'::public."OfferStatus" NOT NULL,
    "expiresAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.offers OWNER TO postgres;

--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset_tokens (
    id text NOT NULL,
    email text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "usedAt" timestamp(3) without time zone
);


ALTER TABLE public.password_reset_tokens OWNER TO postgres;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id text NOT NULL,
    "membershipId" text NOT NULL,
    "companyId" text NOT NULL,
    amount double precision NOT NULL,
    currency text DEFAULT 'USD'::text NOT NULL,
    status public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus" NOT NULL,
    "paymentMethod" text,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: project_audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_audit_logs (
    id text NOT NULL,
    "requestId" text NOT NULL,
    "adminId" text NOT NULL,
    action text NOT NULL,
    reason text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.project_audit_logs OWNER TO postgres;

--
-- Name: project_files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_files (
    id text NOT NULL,
    "projectId" text NOT NULL,
    name text NOT NULL,
    url text NOT NULL,
    "mimeType" text,
    size integer,
    "uploadedBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.project_files OWNER TO postgres;

--
-- Name: project_milestones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_milestones (
    id text NOT NULL,
    "projectId" text NOT NULL,
    title text NOT NULL,
    description text,
    "dueDate" timestamp(3) without time zone,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.project_milestones OWNER TO postgres;

--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    "userId" text NOT NULL,
    "companyId" text NOT NULL,
    "requestId" text,
    "startDate" timestamp(3) without time zone,
    "endDate" timestamp(3) without time zone,
    budget double precision,
    currency text DEFAULT 'USD'::text NOT NULL,
    status public."ProjectStatus" DEFAULT 'PENDING'::public."ProjectStatus" NOT NULL,
    progress integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "completedByCompany" boolean DEFAULT false NOT NULL,
    "completedByUser" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    id text NOT NULL,
    token text NOT NULL,
    "userId" text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "revokedAt" timestamp(3) without time zone,
    "ipAddress" text,
    "userAgent" text
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id text NOT NULL,
    "companyId" text NOT NULL,
    "userId" text NOT NULL,
    "projectId" text,
    rating integer NOT NULL,
    comment text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: security_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.security_logs (
    id text NOT NULL,
    "userId" text,
    type public."SecurityLogType" NOT NULL,
    ip text NOT NULL,
    "userAgent" text,
    metadata jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.security_logs OWNER TO postgres;

--
-- Name: service_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service_requests (
    id text NOT NULL,
    "userId" text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    "categoryId" text NOT NULL,
    "subcategoryId" text,
    "countryId" text NOT NULL,
    "cityId" text NOT NULL,
    "areaId" text,
    address text,
    "budgetMin" double precision,
    "budgetMax" double precision,
    currency text DEFAULT 'USD'::text NOT NULL,
    deadline timestamp(3) without time zone,
    urgency public."UrgencyLevel" DEFAULT 'MEDIUM'::public."UrgencyLevel" NOT NULL,
    visibility public."VisibilityLevel" DEFAULT 'PUBLIC'::public."VisibilityLevel" NOT NULL,
    images jsonb,
    attachments jsonb,
    tags text[] DEFAULT ARRAY[]::text[],
    "allowRemote" boolean DEFAULT false NOT NULL,
    "requireVerification" boolean DEFAULT false NOT NULL,
    status public."RequestStatus" DEFAULT 'PENDING'::public."RequestStatus" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "viewCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.service_requests OWNER TO postgres;

--
-- Name: sla_reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sla_reports (
    id text NOT NULL,
    year integer NOT NULL,
    month integer NOT NULL,
    "uptimePercent" double precision NOT NULL,
    "totalChecks" integer NOT NULL,
    "failedChecks" integer NOT NULL,
    "downtimeMinutes" integer NOT NULL,
    "avgLatencyMs" integer NOT NULL,
    "incidentsByCategory" jsonb NOT NULL,
    "generatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.sla_reports OWNER TO postgres;

--
-- Name: staff_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.staff_members (
    id text NOT NULL,
    "userId" text NOT NULL,
    "roleId" text,
    "departmentId" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.staff_members OWNER TO postgres;

--
-- Name: staff_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.staff_roles (
    id text NOT NULL,
    name text NOT NULL,
    "nameAr" text,
    description text,
    permissions jsonb DEFAULT '[]'::jsonb NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.staff_roles OWNER TO postgres;

--
-- Name: user_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_settings (
    id text NOT NULL,
    "userId" text NOT NULL,
    "profileVisible" boolean DEFAULT true NOT NULL,
    "showEmail" boolean DEFAULT false NOT NULL,
    "showPhone" boolean DEFAULT false NOT NULL,
    "allowDirectMessages" boolean DEFAULT true NOT NULL,
    language text DEFAULT 'en'::text NOT NULL,
    timezone text DEFAULT 'UTC'::text NOT NULL,
    "deletionRequestedAt" timestamp(3) without time zone,
    "deletionReason" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.user_settings OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    "emailHash" text NOT NULL,
    password text NOT NULL,
    name text,
    phone text,
    role public."UserRole" DEFAULT 'USER'::public."UserRole" NOT NULL,
    avatar text,
    image text,
    "emailVerified" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "failedLoginAttempts" integer DEFAULT 0 NOT NULL,
    "lockedUntil" timestamp(3) without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: verification_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.verification_tokens (
    id text NOT NULL,
    email text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.verification_tokens OWNER TO postgres;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
05e2154b-3e1b-4623-86af-aa273b6e9791	b79f4782434c0ccc410896a71ff46dec21dcd1d689464033cc995d6215fcf669	2026-02-15 15:24:42.770623+01	20260215142442_init	\N	\N	2026-02-15 15:24:42.061625+01	1
03137588-2c79-438f-b439-788af3eedaa7	0e679a818d6e63e363d705ffa3d77bab8580732d2f7a005110228905bfd6e1e5	2026-02-18 09:10:06.69047+01	20260218081006_added_company_fields	\N	\N	2026-02-18 09:10:06.634921+01	1
\.


--
-- Data for Name: alert_states; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alert_states (id, service, "lastAlertAt", "isSuppressed", "failCount", "updatedAt") FROM stdin;
\.


--
-- Data for Name: areas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.areas (id, "cityId", "nameEn", "nameAr", slug, "isActive") FROM stdin;
bb67c6d3-7502-4c2b-9e1f-756291ebe177	58158b4a-efa8-4c56-9ea5-5a52d3154058	Al-Malki	المالكي	al-malki	t
e8567b27-649d-4f08-9366-f78d1ec99379	58158b4a-efa8-4c56-9ea5-5a52d3154058	Abu Rummaneh	أبو رمانة	abu-rummaneh	t
74c3cca1-a06a-4cad-a3ef-d330dbda1053	58158b4a-efa8-4c56-9ea5-5a52d3154058	Al-Shaalan	الشعلان	al-shaalan	t
81ece88a-76d9-4494-b096-2fc5c5cee496	58158b4a-efa8-4c56-9ea5-5a52d3154058	Bab Touma	باب توما	bab-touma	t
ec942f72-7b4d-45fd-b487-b711559401c5	58158b4a-efa8-4c56-9ea5-5a52d3154058	Al-Qassa	القصاع	al-qassa	t
cf622d2b-41b0-405d-8785-d6fcf7cac1f2	58158b4a-efa8-4c56-9ea5-5a52d3154058	Rukn al-Din	ركن الدين	rukn-al-din	t
5fc0f89d-6292-4b69-b2b8-486375944883	58158b4a-efa8-4c56-9ea5-5a52d3154058	Al-Muhajirin	المهاجرين	al-muhajirin	t
f6d6086a-bab3-4f43-97c0-a86eb119698a	58158b4a-efa8-4c56-9ea5-5a52d3154058	Al-Salihiyah	الصالحية	al-salihiyah	t
3e9f18ff-51b6-4ce3-84c4-59bf25036f11	bd30e776-bd79-492a-96d5-fcb306c35284	Jaramana	جرمانا	jaramana	t
2ff33174-a33a-4375-97c6-484445c8e67a	bd30e776-bd79-492a-96d5-fcb306c35284	Sahnaya	صحنايا	sahnaya	t
40de1fa3-ff0d-4636-8345-cb2caa63c4ff	bd30e776-bd79-492a-96d5-fcb306c35284	Darayya	داريا	darayya	t
1c62b8d6-ce26-4ce3-8e3c-f3c9816750e7	bd30e776-bd79-492a-96d5-fcb306c35284	Douma	دوما	douma	t
fc31087c-96a0-49c4-8be0-15ed2312fe7a	bd30e776-bd79-492a-96d5-fcb306c35284	Al-Tall	التل	al-tall	t
596c0283-3e65-4730-9059-78e85141c74a	bd30e776-bd79-492a-96d5-fcb306c35284	Al-Zabadani	الزبداني	al-zabadani	t
7a4dcdad-824e-45cc-9f41-7f8021c86020	bd30e776-bd79-492a-96d5-fcb306c35284	Yabroud	يبرود	yabroud	t
9d838f37-ca19-467c-8e22-3f7840dca396	bd30e776-bd79-492a-96d5-fcb306c35284	Al-Nabk	النبك	al-nabk	t
3a5852d5-e3ea-4d7b-a4a3-f6ef7e885f1c	bd30e776-bd79-492a-96d5-fcb306c35284	Qatana	قطنا	qatana	t
57a99753-507e-4d9a-b3b7-c675f30866d7	bd30e776-bd79-492a-96d5-fcb306c35284	Arbin	عربين	arbin	t
4a4f5520-22d8-4ddc-8a3a-b7875b270d3a	bd30e776-bd79-492a-96d5-fcb306c35284	Harasta	حرستا	harasta	t
4d052d31-48ea-4ae5-b52b-83fe8d702b90	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	Aleppo City	حلب المدينة	aleppo-city	t
bd909f57-a754-4a55-afc1-85919635bf20	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	Manbij	منبج	manbij	t
123c45d0-7c40-4df3-9e07-757869af1ffb	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	Al-Bab	الباب	al-bab	t
6052624d-93fc-47b0-8712-1ccd37373d0e	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	Afrin	عفرين	afrin	t
7a58bce2-eeba-4f18-99e8-a0688448a9c8	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	Azaz	أعزاز	azaz	t
4ae37aab-9a0b-4364-bb43-9b367fa10835	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	Jarabulus	جرابلس	jarabulus	t
a0d3c56c-1d8d-42f4-828b-f90255ab12d6	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	Ain al-Arab	عين العرب	ain-al-arab	t
00417a41-adc2-41ba-9165-5073fcd0aeec	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	Al-Safira	السفيرة	al-safira	t
da54650d-42d7-4bc8-ae76-e62ef0f45a9b	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	Deir Hafer	دير حافر	deir-hafer	t
6a42c07b-940c-46e7-974b-5e76f189ffd7	15820e35-2099-46b7-aae9-d03b92f5ba98	Homs City	حمص المدينة	homs-city	t
b621233a-1174-493e-b3de-4a60f5810a7c	15820e35-2099-46b7-aae9-d03b92f5ba98	Palmyra	تدمر	palmyra	t
0a9c6641-40a3-408b-95d4-3bd3efffbbb1	15820e35-2099-46b7-aae9-d03b92f5ba98	Al-Rastan	الرستن	al-rastan	t
d15a5160-c57f-4cc2-8cf2-038329466c7c	15820e35-2099-46b7-aae9-d03b92f5ba98	Talkalakh	تلكلخ	talkalakh	t
14e5669d-bfce-41f3-adca-24b92266d635	15820e35-2099-46b7-aae9-d03b92f5ba98	Al-Qusayr	القصير	al-qusayr	t
6361f9db-2fa4-47e7-a3dc-4ecb30875b53	15820e35-2099-46b7-aae9-d03b92f5ba98	Al-Makhram	المخرم	al-makhram	t
bdc1e2b6-9c7f-4e4f-8da0-b204266dafa7	a697d691-a44d-4906-86a1-858042061d96	Hama City	حماة المدينة	hama-city	t
b0b3533d-f2af-440c-88e8-5b188d282016	a697d691-a44d-4906-86a1-858042061d96	Masyaf	مصياف	masyaf	t
5e001e7b-54bb-47c7-8b40-8c72b6040c9d	a697d691-a44d-4906-86a1-858042061d96	Al-Salamiyah	السلمية	al-salamiyah	t
35f8bd75-d590-427e-9fa1-2d0051feccd2	a697d691-a44d-4906-86a1-858042061d96	Mahardeh	محردة	mahardeh	t
20f31990-19a9-44b8-be4d-daa6944c47cd	a697d691-a44d-4906-86a1-858042061d96	Al-Suqaylabiyah	السقيلبية	al-suqaylabiyah	t
0f9d6b6e-eb48-46b4-a606-d267680aeccc	9c9790a2-5cff-4de9-beac-6a2d6bd38206	Latakia City	اللاذقية المدينة	latakia-city	t
d9026650-d1ad-4ca8-9583-a9274eeb8b1f	9c9790a2-5cff-4de9-beac-6a2d6bd38206	Jableh	جبلة	jableh	t
e507d154-ce95-494f-96ab-f7968b49346e	9c9790a2-5cff-4de9-beac-6a2d6bd38206	Al-Haffah	الحفة	al-haffah	t
0e308996-6a32-4570-b2c6-d67e922a3b91	9c9790a2-5cff-4de9-beac-6a2d6bd38206	Al-Qardaha	القرداحة	al-qardaha	t
ac6d6200-7212-414c-887a-476ada7c997b	a96406fd-0fed-4163-b6e0-a92e59842a05	Tartous City	طرطوس المدينة	tartous-city	t
993f1884-6fad-45d4-9f41-34993153996a	a96406fd-0fed-4163-b6e0-a92e59842a05	Baniyas	بانياس	baniyas	t
6e3e5d61-2de0-4d08-bff3-faed75ca8853	a96406fd-0fed-4163-b6e0-a92e59842a05	Safita	صافيتا	safita	t
55642c8b-30d8-49f7-a5ad-581c1d73e8b5	a96406fd-0fed-4163-b6e0-a92e59842a05	Al-Dreikish	الدريكيش	al-dreikish	t
477c7158-70a3-4b25-ace4-99b4c3bc804c	a96406fd-0fed-4163-b6e0-a92e59842a05	Sheikh Badr	الشيخ بدر	sheikh-badr	t
54c24073-262a-44e8-b45f-de8606878afd	05ffd645-ae2d-4499-baad-0abf3ef162d3	Idlib City	إدلب المدينة	idlib-city	t
e0a51374-9d6b-4c3b-be11-852cfd750be0	05ffd645-ae2d-4499-baad-0abf3ef162d3	Maarat al-Numan	معرة النعمان	maarat-al-numan	t
5686f1b0-7562-482f-987c-df7b39d2ee02	05ffd645-ae2d-4499-baad-0abf3ef162d3	Ariha	أريحا	ariha	t
e7e8eb8a-e84a-4537-87e7-1269cfff59cc	05ffd645-ae2d-4499-baad-0abf3ef162d3	Jisr al-Shughur	جسر الشغور	jisr-al-shughur	t
a7dbd0c6-5c2c-4f9e-a556-ad7963d38261	05ffd645-ae2d-4499-baad-0abf3ef162d3	Harim	حارم	harim	t
7178bfdc-a6ed-47f8-ace8-ceeaf3e8cdf0	ae249f50-c0d1-450d-a049-32b4fe255055	Al-Mayadin	الميادين	al-mayadin	t
ce1518a0-c81d-49a9-abcb-1da077120c3f	58158b4a-efa8-4c56-9ea5-5a52d3154058	Al-Mazzeh	المزة	al-mazzeh	t
96cd323c-0330-4086-b549-ebfa2df7f6f3	bd30e776-bd79-492a-96d5-fcb306c35284	Al-Muaddamiyah	المعضمية	al-muaddamiyah	t
1b940730-95a6-4e6f-b176-4e899f3523aa	ae249f50-c0d1-450d-a049-32b4fe255055	Deir ez-Zor City	دير الزور المدينة	deir-ez-zor-city	t
df3fb902-ce19-4818-ab4a-9ede052526a9	ae249f50-c0d1-450d-a049-32b4fe255055	Al-Bukamal	البوكمال	al-bukamal	t
98a545de-4f88-422e-8f9d-ff58b2e54603	ae249f50-c0d1-450d-a049-32b4fe255055	Al-Ashara	الأشارة	al-ashara	t
1341e69b-c16e-46be-8617-fc92a6f21919	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	Raqqa City	الرقة المدينة	raqqa-city	t
b9882298-3c2b-481e-be6c-c4c1fb3d39fa	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	Al-Tabqa	الطبقة	al-tabqa	t
b73a2623-2351-47d9-9013-b8f1e4382eee	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	Tell Abyad	تل أبيض	tell-abyad	t
611df34c-10bd-4859-8d30-c626d8efeaca	c66a36d2-c2ab-424e-8f63-6c07cea22476	Al-Hasakah City	الحسكة المدينة	al-hasakah-city	t
1ca2d87f-ec82-4431-904e-36898a08c14d	c66a36d2-c2ab-424e-8f63-6c07cea22476	Qamishli	القامشلي	qamishli	t
1db69e06-a83a-4e51-adcc-55fa0e95397f	c66a36d2-c2ab-424e-8f63-6c07cea22476	Ras al-Ayn	رأس العين	ras-al-ayn	t
4206e6a0-cc50-4ae7-b3de-c965ef4ef060	c66a36d2-c2ab-424e-8f63-6c07cea22476	Al-Malikiyah	المالكية	al-malikiyah	t
e993181d-5c16-468f-8625-04e98832d027	6aea81c0-6329-4211-95dc-a59eaa0c121d	Daraa City	درعا المدينة	daraa-city	t
a3dd37a5-36d1-479e-bb2e-2f67ab5e780c	6aea81c0-6329-4211-95dc-a59eaa0c121d	Nawa	نوى	nawa	t
4fa37b5c-4ed8-49f6-a515-76805514989f	6aea81c0-6329-4211-95dc-a59eaa0c121d	Al-Sanamayn	الصنمين	al-sanamayn	t
b0705173-e7e0-4987-970f-6301b4cac95f	6aea81c0-6329-4211-95dc-a59eaa0c121d	Izra	إزرع	izra	t
950ef46f-52f5-45ea-bacd-d45e5f75a43d	6aea81c0-6329-4211-95dc-a59eaa0c121d	Jasim	جاسم	jasim	t
99d08b2b-2722-45b2-a358-1ae73fe79323	afdc544d-b2de-49df-948b-91ca4eebf02e	As-Suwayda City	السويداء المدينة	as-suwayda-city	t
8130e712-936d-4af5-a17f-759a8ffc182a	afdc544d-b2de-49df-948b-91ca4eebf02e	Shahba	شهبا	shahba	t
a2f899c6-427a-421f-be2a-c101190e37ad	afdc544d-b2de-49df-948b-91ca4eebf02e	Salkhad	صلخد	salkhad	t
e8f6f328-f124-497b-bc51-57814dd21379	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	Quneitra City	القنيطرة المدينة	quneitra-city	t
0fe8ed86-b128-4f74-a6de-a4aa6bfc7c49	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	Fiq	فيق	fiq	t
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, "nameEn", "nameAr", slug, icon, "iconName", "imageUrl", "sortOrder", "isActive", "isFeatured", "parentId", "createdAt", "updatedAt") FROM stdin;
98d60428-77df-4a56-8bca-4025dd191119	Cleaning	Cleaning	تنظيف	cleaning	🧹	sparkles	\N	6	t	t	\N	2026-02-15 14:30:20.245	2026-02-20 09:47:48.806
d69b3ed6-faf5-4746-ba0f-eb57708676aa	Moving	Moving	نقل عفش	moving	🚚	truck	\N	7	t	t	\N	2026-02-15 14:30:20.247	2026-02-20 09:47:48.808
c5168990-ce7e-4c39-b9ac-8fbbe3bdefb0	AC Installation	AC Installation	تركيب مكيفات	ac-install	\N	\N	\N	0	t	f	a104b06f-1cb5-4e34-8567-e8c136ccf452	2026-02-18 08:45:57.908	2026-02-20 09:47:48.826
5b49ca23-0797-411a-a41f-232b402d02fe	Education & Training	Education & Training	التعليم والتدريب	education	📚	school	\N	14	f	f	\N	2026-02-15 14:30:20.263	2026-02-20 09:47:48.786
b18f064e-30fd-4227-a6e0-94efae54d8f2	Lighting Install	Lighting Install	تركيب إنارة	lighting	\N	\N	\N	0	t	f	c5e2b66e-b100-41d9-bba8-e110b2abab71	2026-02-18 08:45:57.964	2026-02-20 09:47:48.854
a0b0eaea-a4e9-4ed0-add4-8273a72630ee	Generator Installation	Generator Installation	تركيب مولدات	generator-install	\N	\N	\N	0	t	f	c5e2b66e-b100-41d9-bba8-e110b2abab71	2026-02-18 08:45:57.966	2026-02-20 09:47:48.856
48e249e6-bf40-4338-8d91-16c2ffe0db3f	Events & Entertainment	Events & Entertainment	الفعاليات والترفيه	events	🎉	award	\N	15	f	f	\N	2026-02-15 14:30:20.265	2026-02-20 09:47:48.789
deb10409-fb05-4a07-a0f4-dda54988cd52	Photography	Photography	تصوير احترافي	photography	📷	camera	\N	16	t	f	71cdffe5-1523-4ae3-82c7-d76dc438f90f	2026-02-15 14:30:20.268	2026-02-20 09:47:49.05
c5e2b66e-b100-41d9-bba8-e110b2abab71	Electrical	Electrical	كهرباء	electrical	⚡	zap	\N	2	t	t	\N	2026-02-15 14:30:20.241	2026-02-20 09:47:48.797
98e85028-eaff-4c4c-a5ae-ccbe1c88e837	Plumbing	Plumbing	سباكة	plumbing	🔧	droplets	\N	3	t	t	\N	2026-02-15 14:30:20.239	2026-02-20 09:47:48.8
7049731f-af4e-489e-b560-096dfa6b7869	Construction	Construction	مقاولات	construction	🏗️	building	\N	5	t	t	\N	2026-02-15 14:30:20.231	2026-02-20 09:47:48.804
9ac120a7-3f97-47fd-b5ee-619b7711dcf4	Electrical Wiring	Electrical Wiring	تمديدات كهربائية	wiring	\N	\N	\N	0	t	f	c5e2b66e-b100-41d9-bba8-e110b2abab71	2026-02-18 08:45:57.961	2026-02-20 09:47:48.85
8981ac1a-f116-4694-898e-afda5de9b73c	Electrical Repairs	Electrical Repairs	إصلاح أعطال كهرباء	electrical-repair	\N	\N	\N	0	t	f	c5e2b66e-b100-41d9-bba8-e110b2abab71	2026-02-18 08:45:57.963	2026-02-20 09:47:48.852
38cb0fe6-bc94-4f20-b0ab-fc5ce125ec38	Electrical Panel	Electrical Panel	تركيب لوحات كهرباء	panel-install	\N	\N	\N	0	t	f	c5e2b66e-b100-41d9-bba8-e110b2abab71	2026-02-18 08:45:57.976	2026-02-20 09:47:48.865
8ad4b9e1-028d-48cb-b93d-ecd23520c68b	HVAC	HVAC	التدفئة والتبريد	hvac	❄️	hvac	\N	5	f	t	\N	2026-02-15 14:30:20.244	2026-02-20 09:47:48.753
ba67114a-555e-4275-980f-2dce64d575bc	IT & Technology	IT & Technology	تكنولوجيا المعلومات	it-technology	💻	it	\N	8	f	t	\N	2026-02-15 14:30:20.25	2026-02-20 09:47:48.77
627232ef-ea4d-4ebc-8f84-9554e9f511e8	Marketing & Advertising	Marketing & Advertising	التسويق والإعلان	marketing	📣	business	\N	11	f	f	\N	2026-02-15 14:30:20.257	2026-02-20 09:47:48.774
48005ecb-8c84-485d-b9bc-140dd788f72c	Transportation	Transportation	النقل	transportation	🚗	moving	\N	12	f	f	\N	2026-02-15 14:30:20.259	2026-02-20 09:47:48.778
9997915a-51af-4ce5-b775-0ed8079d0e8e	Healthcare	Healthcare	الرعاية الصحية	healthcare	🏥	health	\N	13	f	f	\N	2026-02-15 14:30:20.261	2026-02-20 09:47:48.782
4acb75e6-2c26-4912-8857-867cc55d05ed	Generator Maintenance	Generator Maintenance	صيانة مولدات	generator-maint	\N	\N	\N	0	t	f	c5e2b66e-b100-41d9-bba8-e110b2abab71	2026-02-18 08:45:57.969	2026-02-20 09:47:48.858
3d4fec38-cbdd-45e0-8fab-73e5a05a1600	Solar Panel Install	Solar Panel Install	تركيب طاقة شمسية	solar-install	\N	\N	\N	0	t	f	c5e2b66e-b100-41d9-bba8-e110b2abab71	2026-02-18 08:45:57.971	2026-02-20 09:47:48.861
0def337f-dd79-4734-9227-80c91e4a2bf9	Solar System Maint	Solar System Maint	صيانة طاقة شمسية	solar-maint	\N	\N	\N	0	t	f	c5e2b66e-b100-41d9-bba8-e110b2abab71	2026-02-18 08:45:57.973	2026-02-20 09:47:48.863
c79261af-78c0-4b45-97b6-d918a3b015c0	Backup Power Systems	Backup Power Systems	أنظمة طاقة احتياطية	backup-power	\N	\N	\N	0	t	f	c5e2b66e-b100-41d9-bba8-e110b2abab71	2026-02-18 08:45:57.978	2026-02-20 09:47:48.867
b52de601-ed5f-4be7-b531-55e4573892f1	Leak Detection & Repair	Leak Detection & Repair	كشف وإصلاح تسربات	leak-repair	\N	\N	\N	0	t	f	98e85028-eaff-4c4c-a5ae-ccbe1c88e837	2026-02-18 08:45:57.983	2026-02-20 09:47:48.872
6805a74f-f7f9-419c-858f-49b99247e35b	Pipe Installation	Pipe Installation	تمديد أنابيب	pipe-install	\N	\N	\N	0	t	f	98e85028-eaff-4c4c-a5ae-ccbe1c88e837	2026-02-18 08:45:57.985	2026-02-20 09:47:48.874
65ddaf4f-5020-4a5f-bcde-d6bea9a519ac	Water Heater Install	Water Heater Install	تركيب سخان مياه	water-heater-install	\N	\N	\N	0	t	f	98e85028-eaff-4c4c-a5ae-ccbe1c88e837	2026-02-18 08:45:57.987	2026-02-20 09:47:48.876
487b84b5-be40-43ae-b5ed-96a494083762	Water Heater Repair	Water Heater Repair	صيانة سخان مياه	water-heater-repair	\N	\N	\N	0	t	f	98e85028-eaff-4c4c-a5ae-ccbe1c88e837	2026-02-18 08:45:57.989	2026-02-20 09:47:48.878
bd693184-a710-441e-aa8b-d7c15901bac9	Bathroom Plumbing	Bathroom Plumbing	سباكة حمامات	bathroom-plumbing	\N	\N	\N	0	t	f	98e85028-eaff-4c4c-a5ae-ccbe1c88e837	2026-02-18 08:45:57.991	2026-02-20 09:47:48.88
e9264c4c-cd5f-4c68-acbd-e99f48182171	Kitchen Plumbing	Kitchen Plumbing	سباكة مطابخ	kitchen-plumbing	\N	\N	\N	0	t	f	98e85028-eaff-4c4c-a5ae-ccbe1c88e837	2026-02-18 08:45:57.992	2026-02-20 09:47:48.883
dd57d659-e8bf-4a47-897c-1fb44c56a16d	Accounting Services	Accounting Services	خدمات محاسبية	accounting	📊	calculator	\N	10	t	f	4ff97148-cb5b-41af-b3b8-d69d88d126d9	2026-02-15 14:30:20.255	2026-02-20 09:47:49.015
11552f47-066a-4cad-b38a-2c74eed0bed4	Legal Consultation	Legal Consultation	استشارات قانونية	legal	⚖️	gavel	\N	9	t	f	4ff97148-cb5b-41af-b3b8-d69d88d126d9	2026-02-15 14:30:20.252	2026-02-20 09:47:49.019
5037cea3-0eba-4061-b365-33a8ce2b99e5	Drain Cleaning	Drain Cleaning	تسليك مجاري	drain-cleaning	\N	\N	\N	0	t	f	98e85028-eaff-4c4c-a5ae-ccbe1c88e837	2026-02-18 08:45:57.994	2026-02-20 09:47:48.885
a536318f-3dd6-4a64-ab44-cd425b104b2e	Water Tank Install	Water Tank Install	تركيب خزانات	water-tank-install	\N	\N	\N	0	t	f	98e85028-eaff-4c4c-a5ae-ccbe1c88e837	2026-02-18 08:45:57.998	2026-02-20 09:47:48.887
dc97169e-d2c7-4af6-93a5-5010ab9d86f0	Pump Installation	Pump Installation	تركيب مضخات مياه	pump-install	\N	\N	\N	0	t	f	98e85028-eaff-4c4c-a5ae-ccbe1c88e837	2026-02-18 08:45:58	2026-02-20 09:47:48.889
3905c75e-18d0-4ef1-b58a-d3e1a7ce5463	General Contractor	General Contractor	مقاول عام	general-contractor	\N	\N	\N	0	t	f	7049731f-af4e-489e-b560-096dfa6b7869	2026-02-18 08:45:58.033	2026-02-20 09:47:48.912
5c720069-74be-4ad8-807c-e064c1521c4f	Home Renovation	Home Renovation	ترميم منازل	home-renovation	\N	\N	\N	0	t	f	7049731f-af4e-489e-b560-096dfa6b7869	2026-02-18 08:45:58.035	2026-02-20 09:47:48.914
47186941-ba55-49bd-97b8-2b54e376f36b	Kitchen Renovation	Kitchen Renovation	تجديد مطابخ	kitchen-reno	\N	\N	\N	0	t	f	7049731f-af4e-489e-b560-096dfa6b7869	2026-02-18 08:45:58.036	2026-02-20 09:47:48.916
5db5637c-2d55-46eb-b46b-6c5c9aa87a19	Bathroom Renovation	Bathroom Renovation	تجديد حمامات	bathroom-reno	\N	\N	\N	0	t	f	7049731f-af4e-489e-b560-096dfa6b7869	2026-02-18 08:45:58.039	2026-02-20 09:47:48.918
eb3a5f87-d152-41c0-a704-4dd4f93ed87d	Tile Installation	Tile Installation	تركيب بلاط	tile-install	\N	\N	\N	0	t	f	7049731f-af4e-489e-b560-096dfa6b7869	2026-02-18 08:45:58.041	2026-02-20 09:47:48.92
2e57b799-12e9-40aa-9519-c462f5d458ba	Flooring Installation	Flooring Installation	تركيب أرضيات	flooring	\N	\N	\N	0	t	f	7049731f-af4e-489e-b560-096dfa6b7869	2026-02-18 08:45:58.043	2026-02-20 09:47:48.922
84885f89-be5a-4750-baac-92ce56f45288	Gypsum Board	Gypsum Board	جبس بورد	gypsum	\N	\N	\N	0	t	f	7049731f-af4e-489e-b560-096dfa6b7869	2026-02-18 08:45:58.045	2026-02-20 09:47:48.923
e9fcae5a-1a61-4f96-adca-e1bee96da919	Painting Services	Painting Services	دهانات وديكور	painting	\N	\N	\N	0	t	f	7049731f-af4e-489e-b560-096dfa6b7869	2026-02-18 08:45:58.047	2026-02-20 09:47:48.925
93ad7de3-d02d-47c7-9138-22daa3c2c0b4	Roofing	Roofing	عزل أسطح	roofing	\N	\N	\N	0	t	f	7049731f-af4e-489e-b560-096dfa6b7869	2026-02-18 08:45:58.049	2026-02-20 09:47:48.927
5794040d-4834-4d81-a7c3-99d2f4d9383b	Concrete & Masonry	Concrete & Masonry	أعمال باطون وبناء	concrete	\N	\N	\N	0	t	f	7049731f-af4e-489e-b560-096dfa6b7869	2026-02-18 08:45:58.051	2026-02-20 09:47:48.928
c0e5b849-e7e0-461d-a535-0e84d6d7f791	Structural Repairs	Structural Repairs	تدعيم إنشائي	structural	\N	\N	\N	0	t	f	7049731f-af4e-489e-b560-096dfa6b7869	2026-02-18 08:45:58.053	2026-02-20 09:47:48.93
459e22dc-d5aa-4f49-9284-d416e3201e34	Home Cleaning	Home Cleaning	تنظيف منازل	home-cleaning	\N	\N	\N	0	t	f	98d60428-77df-4a56-8bca-4025dd191119	2026-02-18 08:45:58.058	2026-02-20 09:47:48.934
b63a2fe5-171f-4db4-95ee-b16a8210eb9d	Deep Cleaning	Deep Cleaning	تنظيف عميق	deep-cleaning	\N	\N	\N	0	t	f	98d60428-77df-4a56-8bca-4025dd191119	2026-02-18 08:45:58.06	2026-02-20 09:47:48.936
fcd17d77-74e4-4cec-83b1-12e99b00c62f	Office Cleaning	Office Cleaning	تنظيف مكاتب	office-cleaning	\N	\N	\N	0	t	f	98d60428-77df-4a56-8bca-4025dd191119	2026-02-18 08:45:58.061	2026-02-20 09:47:48.938
37316c32-bf7c-4282-87b9-78417ffb611d	Post-Construction	Post-Construction	تنظيف بعد البناء	post-construction	\N	\N	\N	0	t	f	98d60428-77df-4a56-8bca-4025dd191119	2026-02-18 08:45:58.063	2026-02-20 09:47:48.94
b51d67bd-090c-4383-b27d-fc53244989af	Carpet Cleaning	Carpet Cleaning	تنظيف سجاد وموكيت	carpet-cleaning	\N	\N	\N	0	t	f	98d60428-77df-4a56-8bca-4025dd191119	2026-02-18 08:45:58.065	2026-02-20 09:47:48.941
be163dd8-9324-47c1-b07a-3d727382acd4	Sofa Cleaning	Sofa Cleaning	تنظيف كنب ومفروشات	sofa-cleaning	\N	\N	\N	0	t	f	98d60428-77df-4a56-8bca-4025dd191119	2026-02-18 08:45:58.067	2026-02-20 09:47:48.943
70eeca24-013d-4546-9567-3b42927e8364	Window Cleaning	Window Cleaning	تنظيف واجهات زجاجية	window-cleaning	\N	\N	\N	0	t	f	98d60428-77df-4a56-8bca-4025dd191119	2026-02-18 08:45:58.069	2026-02-20 09:47:48.945
0a715def-3e28-46b5-b8e2-1d5e47af7730	Water Tank Cleaning	Water Tank Cleaning	تعقيم خزانات المياه	tank-cleaning	\N	\N	\N	0	t	f	98d60428-77df-4a56-8bca-4025dd191119	2026-02-18 08:45:58.071	2026-02-20 09:47:48.947
2f34e68f-344a-4a04-8ca5-0ef67fb6f5f7	Disinfection Services	Disinfection Services	خدمات تعقيم شامل	disinfection	\N	\N	\N	0	t	f	98d60428-77df-4a56-8bca-4025dd191119	2026-02-18 08:45:58.072	2026-02-20 09:47:48.948
24ca6098-169b-46bb-993d-a130327b16f9	Furniture Moving	Furniture Moving	نقل أثاث	furniture-moving	\N	\N	\N	0	t	f	d69b3ed6-faf5-4746-ba0f-eb57708676aa	2026-02-18 08:45:58.076	2026-02-20 09:47:48.952
a3529217-903e-4710-b70c-2b15b18ecaa7	House Moving	House Moving	نقل منازل	house-moving	\N	\N	\N	0	t	f	d69b3ed6-faf5-4746-ba0f-eb57708676aa	2026-02-18 08:45:58.078	2026-02-20 09:47:48.954
0cfccd84-7b2e-460a-9075-74f3d8dc4586	Office Moving	Office Moving	نقل مكاتب وشركات	office-moving	\N	\N	\N	0	t	f	d69b3ed6-faf5-4746-ba0f-eb57708676aa	2026-02-18 08:45:58.08	2026-02-20 09:47:48.956
0c79abc5-cdde-4d82-8bb1-898d546fee4e	Packing Services	Packing Services	خدمات تغليف	packing-services	\N	\N	\N	0	t	f	d69b3ed6-faf5-4746-ba0f-eb57708676aa	2026-02-18 08:45:58.083	2026-02-20 09:47:48.958
a42fec55-2abc-4caa-856b-d80e4ac7ab45	Storage Services	Storage Services	خدمات تخزين	storage-services	\N	\N	\N	0	t	f	d69b3ed6-faf5-4746-ba0f-eb57708676aa	2026-02-18 08:45:58.084	2026-02-20 09:47:48.96
9e64837b-ee22-4570-b1f2-9c6c938107ea	Landscape Design	Landscape Design	تصميم حدائق	landscape	\N	\N	\N	0	t	f	71cdffe5-1523-4ae3-82c7-d76dc438f90f	2026-02-18 08:45:58.026	2026-02-20 09:47:49.035
3d27de5e-9b46-4986-a1ca-06f0d477a2ba	AC Repair	AC Repair	صيانة مكيفات	ac-repair	\N	\N	\N	0	t	f	a104b06f-1cb5-4e34-8567-e8c136ccf452	2026-02-18 08:45:57.934	2026-02-20 09:47:48.828
9be45a5d-3632-4446-b3ac-818c1d4afbad	AC Maintenance	AC Maintenance	عقود صيانة	ac-maintenance	\N	\N	\N	0	t	f	a104b06f-1cb5-4e34-8567-e8c136ccf452	2026-02-18 08:45:57.944	2026-02-20 09:47:48.831
fa0319a9-a593-44fc-8248-8a7eb47b459e	Custom Furniture	Custom Furniture	تفصيل أثاث	custom-furniture	\N	\N	\N	0	t	f	9216b9d5-8efb-4d0a-8d35-b5d47386c27f	2026-02-18 08:45:58.005	2026-02-20 09:47:48.894
5fdddb70-8cc9-45bb-9560-72d5fb2a86e0	Door Install & Repair	Door Install & Repair	تركيب وصيانة أبواب	door-install	\N	\N	\N	0	t	f	9216b9d5-8efb-4d0a-8d35-b5d47386c27f	2026-02-18 08:45:58.007	2026-02-20 09:47:48.896
995b2165-0444-4801-acca-dc5c3a566f2a	Kitchen Cabinets	Kitchen Cabinets	خزائن مطبخ	kitchen-cabinets	\N	\N	\N	0	t	f	9216b9d5-8efb-4d0a-8d35-b5d47386c27f	2026-02-18 08:45:58.01	2026-02-20 09:47:48.898
7f0933d0-c036-49ee-a498-62bb23e051fb	Bedroom Wardrobes	Bedroom Wardrobes	خزائن ملابس	wardrobes	\N	\N	\N	0	t	f	9216b9d5-8efb-4d0a-8d35-b5d47386c27f	2026-02-18 08:45:58.012	2026-02-20 09:47:48.9
a4f932f4-17e0-4e68-9a2c-1c0b2f054756	Wood Flooring	Wood Flooring	باركيه وأرضيات	wood-flooring	\N	\N	\N	0	t	f	9216b9d5-8efb-4d0a-8d35-b5d47386c27f	2026-02-18 08:45:58.014	2026-02-20 09:47:48.902
a15ec8f6-c7e5-40bc-888c-5e6179104677	Pergolas & Outdoor	Pergolas & Outdoor	مظلات خشبية	pergolas	\N	\N	\N	0	t	f	9216b9d5-8efb-4d0a-8d35-b5d47386c27f	2026-02-18 08:45:58.017	2026-02-20 09:47:48.904
5fa8962e-80f2-4550-bdfa-fe31d3b7d741	Office Furniture	Office Furniture	أثاث مكتبي	office-furniture	\N	\N	\N	0	t	f	9216b9d5-8efb-4d0a-8d35-b5d47386c27f	2026-02-18 08:45:58.019	2026-02-20 09:47:48.906
372a27be-f9b8-4e31-aa38-ca2366223d6d	Furniture Repair	Furniture Repair	إصلاح أثاث	furniture-repair	\N	\N	\N	0	t	f	9216b9d5-8efb-4d0a-8d35-b5d47386c27f	2026-02-18 08:45:58.021	2026-02-20 09:47:48.908
61452801-a110-4604-817d-a4374db967c0	Equipment Transport	Equipment Transport	نقل معدات	equipment-transport	\N	\N	\N	0	t	f	d69b3ed6-faf5-4746-ba0f-eb57708676aa	2026-02-18 08:45:58.086	2026-02-20 09:47:48.963
e0ea0aaf-8c5e-448f-97a3-c5188ec89ee9	Local Delivery	Local Delivery	توصيل بضائع محلي	local-delivery	\N	\N	\N	0	t	f	d69b3ed6-faf5-4746-ba0f-eb57708676aa	2026-02-18 08:45:58.088	2026-02-20 09:47:48.965
cfaf55d4-d957-4f91-9944-8e9262fa5c58	Heavy Equipment	Heavy Equipment	نقل معدات ثقيلة	heavy-moving	\N	\N	\N	0	t	f	d69b3ed6-faf5-4746-ba0f-eb57708676aa	2026-02-18 08:45:58.09	2026-02-20 09:47:48.967
145dab2a-0441-446c-978b-42b317a37707	IT Support	IT Support	دعم فني وتقني	it-support	\N	\N	\N	0	t	f	bc71903c-a271-4a56-b90e-f94b041f684c	2026-02-18 08:45:58.095	2026-02-20 09:47:48.973
534cc6e7-53c8-48c0-a34d-de3c0ebfeac8	Social Media Mgmt	Social Media Mgmt	إدارة صفحات سوشيال	social-media	\N	\N	\N	0	t	f	c800df55-740a-4bf4-abcf-9fb8dc54aa85	2026-02-18 08:45:58.141	2026-02-20 09:47:49.004
96e8b578-f00f-46c4-b0bc-9997bf549722	Content Creation	Content Creation	صناعة محتوى	content-creation	\N	\N	\N	0	t	f	c800df55-740a-4bf4-abcf-9fb8dc54aa85	2026-02-18 08:45:58.143	2026-02-20 09:47:49.01
8ad81af4-5eeb-4433-8c16-382b0653f1c2	Tax Consultation	Tax Consultation	استشارات ضريبية	tax-consult	\N	\N	\N	0	t	f	4ff97148-cb5b-41af-b3b8-d69d88d126d9	2026-02-18 08:45:58.123	2026-02-20 09:47:49.017
c578b972-ee6e-4efe-b2df-37efe0fcacf8	Company Registration	Company Registration	تأسيس شركات	company-reg	\N	\N	\N	0	t	f	4ff97148-cb5b-41af-b3b8-d69d88d126d9	2026-02-18 08:45:58.125	2026-02-20 09:47:49.021
4e4ff339-844e-4804-982c-c3e7e315be9e	Business Consulting	Business Consulting	استشارات أعمال	business-consult	\N	\N	\N	0	t	f	4ff97148-cb5b-41af-b3b8-d69d88d126d9	2026-02-18 08:45:58.127	2026-02-20 09:47:49.024
85ecc7e5-742e-4b3a-9d61-40c0e86a59c8	Interior Design	Interior Design	تصميم داخلي	interior-design	🎨	interior-design	\N	2	t	t	71cdffe5-1523-4ae3-82c7-d76dc438f90f	2026-02-15 14:30:20.237	2026-02-20 09:47:49.034
9f883a2f-cae6-461b-91ce-d01c592774c3	Graphic Design	Graphic Design	تصميم جرافيك	graphic-design	\N	\N	\N	0	t	f	71cdffe5-1523-4ae3-82c7-d76dc438f90f	2026-02-18 08:45:58.144	2026-02-20 09:47:49.037
f684e579-7a25-44dc-a309-265dbfd1f2d2	Branding & Identity	Branding & Identity	هوية بصرية	branding	\N	\N	\N	0	t	f	71cdffe5-1523-4ae3-82c7-d76dc438f90f	2026-02-18 08:45:58.139	2026-02-20 09:47:49.039
e2e4e7b7-f108-4f74-a653-f52e0483fa40	3D Visualization	3D Visualization	تصميم ثلاثي الأبعاد	3d-visual	\N	\N	\N	0	t	f	71cdffe5-1523-4ae3-82c7-d76dc438f90f	2026-02-18 08:45:58.028	2026-02-20 09:47:49.043
ae16d3d8-b2f0-47e4-843d-d41cc8a4028d	Interior Design	Interior Design	تصميم داخلي	interior-design-service	\N	\N	\N	0	f	f	85ecc7e5-742e-4b3a-9d61-40c0e86a59c8	2026-02-18 08:45:58.023	2026-02-18 09:21:58.612
3ea6e974-2ce7-4d5f-b861-dc0b63179f54	Legal Consultation	Legal Consultation	استشارات قانونية	legal-consult	\N	\N	\N	0	f	f	11552f47-066a-4cad-b38a-2c74eed0bed4	2026-02-18 08:45:58.132	2026-02-18 09:21:58.635
40e2b96d-4cdc-496b-8a2c-24b8c85096e0	Contract Drafting	Contract Drafting	صياغة عقود	contracts	\N	\N	\N	0	f	f	11552f47-066a-4cad-b38a-2c74eed0bed4	2026-02-18 08:45:58.134	2026-02-18 09:21:58.635
45c52652-5754-48c1-b0a7-3d6fdeae7fbd	Accounting Services	Accounting Services	خدمات محاسبية	accounting-service	\N	\N	\N	0	f	f	dd57d659-e8bf-4a47-897c-1fb44c56a16d	2026-02-18 08:45:58.12	2026-02-18 09:21:58.642
a104b06f-1cb5-4e34-8567-e8c136ccf452	AC & HVAC	AC & HVAC	تكييف وتبريد	ac	\N	fan	\N	1	t	t	\N	2026-02-18 09:21:58.673	2026-02-20 09:47:48.794
9216b9d5-8efb-4d0a-8d35-b5d47386c27f	Carpentry	Carpentry	نجارة	carpentry	\N	hammer	\N	4	t	t	\N	2026-02-18 09:21:58.684	2026-02-20 09:47:48.802
bc71903c-a271-4a56-b90e-f94b041f684c	IT Support	IT Support	دعم تقني	it	\N	cpu	\N	8	t	t	\N	2026-02-18 09:21:58.692	2026-02-20 09:47:48.811
c800df55-740a-4bf4-abcf-9fb8dc54aa85	Digital Services	Digital Services	خدمات رقمية	digital	\N	globe	\N	9	t	t	\N	2026-02-18 09:21:58.694	2026-02-20 09:47:48.813
4ff97148-cb5b-41af-b3b8-d69d88d126d9	Business	Business	أعمال	business	\N	briefcase	\N	10	t	t	\N	2026-02-18 09:21:58.696	2026-02-20 09:47:48.815
71cdffe5-1523-4ae3-82c7-d76dc438f90f	Design	Design	تصميم	design	\N	palette	\N	11	t	t	\N	2026-02-18 09:21:58.698	2026-02-20 09:47:48.817
e4b87995-9082-4431-b055-d53c0bea18ab	Central AC Systems	Central AC Systems	تكييف مركزي	central-ac	\N	\N	\N	0	t	f	a104b06f-1cb5-4e34-8567-e8c136ccf452	2026-02-18 08:45:57.946	2026-02-20 09:47:48.833
99d200f3-6346-4394-b99e-f13bfcbf45b4	Heating Repair	Heating Repair	صيانة أنظمة تدفئة	heating-repair	\N	\N	\N	0	t	f	a104b06f-1cb5-4e34-8567-e8c136ccf452	2026-02-18 08:45:57.948	2026-02-20 09:47:48.836
c51e73dc-ef12-4653-9e28-09fad77b21fc	Duct Install & Cleaning	Duct Install & Cleaning	تركيب وتنظيف دكت	duct-cleaning	\N	\N	\N	0	t	f	a104b06f-1cb5-4e34-8567-e8c136ccf452	2026-02-18 08:45:57.95	2026-02-20 09:47:48.838
998ed8b1-59de-4c05-a4f1-318c4475145f	Thermostat Install	Thermostat Install	تركيب ترموستات	thermostat	\N	\N	\N	0	t	f	a104b06f-1cb5-4e34-8567-e8c136ccf452	2026-02-18 08:45:57.952	2026-02-20 09:47:48.84
a2ff47e5-f2ed-41e1-867e-0345dc56eb6b	Gas Refill	Gas Refill	تعبئة غاز	gas-refill	\N	\N	\N	0	t	f	a104b06f-1cb5-4e34-8567-e8c136ccf452	2026-02-18 08:45:57.954	2026-02-20 09:47:48.842
a9a06bd3-95b8-4356-8ce3-c652f61f660b	HVAC Inspection	HVAC Inspection	فحص أنظمة التكييف	hvac-inspection	\N	\N	\N	0	t	f	a104b06f-1cb5-4e34-8567-e8c136ccf452	2026-02-18 08:45:57.957	2026-02-20 09:47:48.844
094e4723-4046-4698-a5e2-fe3cc59c3245	Network Installation	Network Installation	تمديد شبكات	network-install	\N	\N	\N	0	t	f	bc71903c-a271-4a56-b90e-f94b041f684c	2026-02-18 08:45:58.097	2026-02-20 09:47:48.975
86a76eb4-918a-4476-ad5c-b1f84fe9ec4a	Server Installation	Server Installation	تركيب سيرفرات	server-install	\N	\N	\N	0	t	f	bc71903c-a271-4a56-b90e-f94b041f684c	2026-02-18 08:45:58.099	2026-02-20 09:47:48.977
0908a7a2-ca8f-4190-8dee-a43331dd59c8	Server Maintenance	Server Maintenance	صيانة سيرفرات	server-maint	\N	\N	\N	0	t	f	bc71903c-a271-4a56-b90e-f94b041f684c	2026-02-18 08:45:58.101	2026-02-20 09:47:48.979
1b0eb73a-0e17-4dfc-8299-1376df9f40e7	Hardware Repair	Hardware Repair	صيانة أجهزة كمبيوتر	hardware-repair	\N	\N	\N	0	t	f	bc71903c-a271-4a56-b90e-f94b041f684c	2026-02-18 08:45:58.104	2026-02-20 09:47:48.981
6da456be-fbf2-4421-8140-0fd4efcc9edc	Printer Setup	Printer Setup	تعريف طابعات	printer-setup	\N	\N	\N	0	t	f	bc71903c-a271-4a56-b90e-f94b041f684c	2026-02-18 08:45:58.106	2026-02-20 09:47:48.982
7245e6a5-a8fe-4f53-85ea-86ead7b76474	CCTV Integration	CCTV Integration	ربط كاميرات بالشبكة	cctv-it	\N	\N	\N	0	t	f	bc71903c-a271-4a56-b90e-f94b041f684c	2026-02-18 08:45:58.108	2026-02-20 09:47:48.984
6c3eb205-4e70-41d4-8bee-2c8af2adadd1	Maintenance Contracts	Maintenance Contracts	عقود صيانة دورية	system-contracts	\N	\N	\N	0	t	f	bc71903c-a271-4a56-b90e-f94b041f684c	2026-02-18 09:21:58.892	2026-02-20 09:47:48.986
647011ed-6560-47ee-9091-7b129a07c9ae	Data Recovery	Data Recovery	استعادة بيانات	data-recovery	\N	\N	\N	0	t	f	bc71903c-a271-4a56-b90e-f94b041f684c	2026-02-18 09:21:58.894	2026-02-20 09:47:48.989
a58e3f12-ee73-4839-ada6-973b6de1db94	Website Development	Website Development	تصميم وتطوير مواقع	web-dev	\N	\N	\N	0	t	f	c800df55-740a-4bf4-abcf-9fb8dc54aa85	2026-02-18 08:45:58.11	2026-02-20 09:47:48.994
b2a5e338-73ff-42a6-8dc3-b80d4e6fc5fc	E-commerce Dev	E-commerce Dev	متاجر إلكترونية	ecommerce	\N	\N	\N	0	t	f	c800df55-740a-4bf4-abcf-9fb8dc54aa85	2026-02-18 09:21:58.899	2026-02-20 09:47:48.996
9aa93818-7b3e-4196-b853-03648df182fb	Mobile App Dev	Mobile App Dev	تطبيقات موبايل	app-dev	\N	\N	\N	0	t	f	c800df55-740a-4bf4-abcf-9fb8dc54aa85	2026-02-18 08:45:58.112	2026-02-20 09:47:48.998
50187776-a7e9-41bb-9d8f-8fcc73bf7eb0	UI/UX Design	UI/UX Design	تصميم واجهات المستخدم	ui-ux	\N	\N	\N	0	t	f	c800df55-740a-4bf4-abcf-9fb8dc54aa85	2026-02-18 09:21:58.904	2026-02-20 09:47:49
d2c3038f-cc14-4e68-804e-03c1373cf56b	Digital Marketing	Digital Marketing	تسويق رقمي	digital-marketing	\N	\N	\N	0	t	f	c800df55-740a-4bf4-abcf-9fb8dc54aa85	2026-02-18 08:45:58.114	2026-02-20 09:47:49.002
ae53a59e-003d-49e7-9e87-697ee990cc54	SEO Services	SEO Services	تحسين محركات البحث	seo	\N	\N	\N	0	t	f	c800df55-740a-4bf4-abcf-9fb8dc54aa85	2026-02-18 08:45:58.116	2026-02-20 09:47:49.006
f4f9931a-f98b-4d38-bb26-5cad9c963e15	Paid Ads Mgmt	Paid Ads Mgmt	إدارة حملات إعلانية	paid-ads	\N	\N	\N	0	t	f	c800df55-740a-4bf4-abcf-9fb8dc54aa85	2026-02-18 09:21:58.916	2026-02-20 09:47:49.008
03d91ca1-5212-4f7b-83a1-42400912048c	HR & Recruitment	HR & Recruitment	توظيف وموارد بشرية	hr-recruitment	\N	\N	\N	0	t	f	4ff97148-cb5b-41af-b3b8-d69d88d126d9	2026-02-18 09:21:58.931	2026-02-20 09:47:49.022
2f9602ea-0a83-4153-ab0b-3bfa296db823	Office Setup	Office Setup	تجهيز مكاتب	office-setup	\N	\N	\N	0	t	f	4ff97148-cb5b-41af-b3b8-d69d88d126d9	2026-02-18 09:21:58.934	2026-02-20 09:47:49.026
a32a9674-3e61-4eae-9263-8a792adf53eb	PRO Services	PRO Services	خدمات تعقيب	pro-services	\N	\N	\N	0	t	f	4ff97148-cb5b-41af-b3b8-d69d88d126d9	2026-02-18 09:21:58.936	2026-02-20 09:47:49.028
28584798-4de1-496c-9fd0-b88f7ad41a93	Translation	Translation	ترجمة معتمدة	translation	\N	\N	\N	0	t	f	4ff97148-cb5b-41af-b3b8-d69d88d126d9	2026-02-18 09:21:58.938	2026-02-20 09:47:49.029
06dee9e7-8564-4afe-9544-715d48872bbb	Logo Design	Logo Design	تصميم شعارات	logo-design	\N	\N	\N	0	t	f	71cdffe5-1523-4ae3-82c7-d76dc438f90f	2026-02-18 09:21:58.95	2026-02-20 09:47:49.041
0c401f45-8f32-4a40-81c7-c12a0063e6f3	Architectural Design	Architectural Design	تصميم معماري	architecture	\N	\N	\N	0	t	f	71cdffe5-1523-4ae3-82c7-d76dc438f90f	2026-02-18 09:21:58.953	2026-02-20 09:47:49.045
80ba105a-f0fb-4361-841c-cee2fe88003d	Video Production	Video Production	إنتاج فيديو	video-production	\N	\N	\N	0	t	f	71cdffe5-1523-4ae3-82c7-d76dc438f90f	2026-02-18 09:21:58.955	2026-02-20 09:47:49.048
\.


--
-- Data for Name: cities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cities (id, "countryId", "nameAr", "nameEn", slug, "isActive") FROM stdin;
58158b4a-efa8-4c56-9ea5-5a52d3154058	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	دمشق	Damascus	damascus	t
bd30e776-bd79-492a-96d5-fcb306c35284	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ريف دمشق	Rif Dimashq	rif-dimashq	t
f4e3d694-b3ca-48ef-8d1e-a8d23228363e	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	حلب	Aleppo	aleppo	t
15820e35-2099-46b7-aae9-d03b92f5ba98	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	حمص	Homs	homs	t
a697d691-a44d-4906-86a1-858042061d96	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	حماة	Hama	hama	t
9c9790a2-5cff-4de9-beac-6a2d6bd38206	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	اللاذقية	Latakia	latakia	t
a96406fd-0fed-4163-b6e0-a92e59842a05	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	طرطوس	Tartous	tartous	t
05ffd645-ae2d-4499-baad-0abf3ef162d3	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	إدلب	Idlib	idlib	t
ae249f50-c0d1-450d-a049-32b4fe255055	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	دير الزور	Deir ez-Zor	deir-ez-zor	t
6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	الرقة	Raqqa	raqqa	t
c66a36d2-c2ab-424e-8f63-6c07cea22476	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	الحسكة	Al-Hasakah	al-hasakah	t
6aea81c0-6329-4211-95dc-a59eaa0c121d	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	درعا	Daraa	daraa	t
afdc544d-b2de-49df-948b-91ca4eebf02e	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	السويداء	As-Suwayda	as-suwayda	t
7c135b2a-f162-49ba-85dd-d39a6c98d6eb	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	القنيطرة	Quneitra	quneitra	t
\.


--
-- Data for Name: cms_pages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cms_pages (id, title, "titleAr", slug, content, "contentAr", "metaDescription", "metaKeywords", "isPublished", "createdBy", "updatedBy", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: cms_sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cms_sections (id, name, identifier, page, content, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (id, "userId", name, slug, description, logo, website, email, phone, "countryId", "cityId", address, "verificationStatus", "verifiedAt", "verifiedBy", "isActive", "isFeatured", rating, "reviewCount", "currentPlan", "createdAt", "updatedAt", "operationAreas", skills) FROM stdin;
10d60a0c-7439-4497-85c3-8152164c6a6a	1b804e9c-1a66-4436-b031-5f958678241c	شركة البناء الذهبي	golden-construction	شركة متخصصة في أعمال البناء	\N	\N	\N	\N	\N	\N	دمشق - المزة	PENDING	\N	\N	t	f	4.8	0	FREE	2026-02-15 14:24:56.459	2026-02-15 14:24:56.459	{}	{}
09934ff0-7d67-45d3-8410-8e1c8b3e5cd3	cd94e3ff-3c6e-4619-ab5a-1bc0d65724b5	Best Legal Services Works	best-legal-services-works-0	We are a leading provider of Legal Services services in Quneitra. dedicated to quality and customer satisfaction.	\N	\N	company_1771167476796_0@test.com	+963976455296	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	63 Main St, Quneitra	VERIFIED	2026-02-15 14:57:56.804	\N	t	f	4.2	66	FREE	2026-02-15 14:57:56.806	2026-02-15 14:57:56.806	{}	{}
6622b800-1eed-40a5-a065-7043056c8752	9ece38ff-9830-43b1-adf8-567c1e002119	Top Interior Design Co.	top-interior-design-co--1	We are a leading provider of Interior Design services in Raqqa. dedicated to quality and customer satisfaction.	\N	\N	company_1771167476825_1@test.com	+963961850709	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	25 Main St, Raqqa	VERIFIED	2026-02-15 14:57:56.828	\N	t	f	4.1	77	FREE	2026-02-15 14:57:56.829	2026-02-15 14:57:56.829	{}	{}
a8e7eba3-e044-47d2-80ce-17ef63bc463c	2a474982-5739-47fb-81f2-e1273e800c55	Quick Events & Entertainment Co.	quick-events-entertainment-co--2	We are a leading provider of Events & Entertainment services in Homs. dedicated to quality and customer satisfaction.	\N	\N	company_1771167476836_2@test.com	+963929435966	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	26 Main St, Homs	VERIFIED	2026-02-15 14:57:56.838	\N	t	f	4.9	52	FREE	2026-02-15 14:57:56.839	2026-02-15 14:57:56.839	{}	{}
38f19daa-ac24-4fa2-b62a-72277a1a8360	6bfe5d3c-4f60-44d0-aa2d-8ed9d0f57667	Smart Plumbing Co.	smart-plumbing-co--3	We are a leading provider of Plumbing services in Damascus. dedicated to quality and customer satisfaction.	\N	\N	company_1771167476846_3@test.com	+963970934659	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	92 Main St, Damascus	VERIFIED	2026-02-15 14:57:56.848	\N	t	f	4.7	91	FREE	2026-02-15 14:57:56.849	2026-02-15 14:57:56.849	{}	{}
a931b943-9edf-47d6-8226-6aae1288af72	1fe1195e-328a-4400-8f78-e85a8d9de7c4	Syrian Cleaning Services Trading	syrian-cleaning-services-trading-4	We are a leading provider of Cleaning Services services in Tartous. dedicated to quality and customer satisfaction.	\N	\N	company_1771167476857_4@test.com	+963973946826	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	43 Main St, Tartous	VERIFIED	2026-02-15 14:57:56.86	\N	t	f	3.4	16	FREE	2026-02-15 14:57:56.861	2026-02-15 14:57:56.861	{}	{}
651a1131-29df-4885-a239-5f496a4df65b	544573f8-a70a-4a36-96e1-b7c0e6833973	Best Healthcare Est.	best-healthcare-est--5	We are a leading provider of Healthcare services in Idlib. dedicated to quality and customer satisfaction.	\N	\N	company_1771167476868_5@test.com	+963933044828	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	43 Main St, Idlib	VERIFIED	2026-02-15 14:57:56.87	\N	t	f	3.6	26	FREE	2026-02-15 14:57:56.871	2026-02-15 14:57:56.871	{}	{}
c95873a0-1b7f-4207-8feb-5bb1c3dfab20	63ce3333-64c3-4c0d-97b5-9b517d2ff19d	International Marketing & Advertising Works	international-marketing-advertising-works-6	We are a leading provider of Marketing & Advertising services in Latakia. dedicated to quality and customer satisfaction.	\N	\N	company_1771167476875_6@test.com	+963965642331	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	62 Main St, Latakia	VERIFIED	2026-02-15 14:57:56.877	\N	t	f	3.7	41	FREE	2026-02-15 14:57:56.878	2026-02-15 14:57:56.878	{}	{}
b1a1f5e5-9a00-434a-b0fc-23a39a4b02cb	db5f03ed-641a-4fc7-909e-50c1eaa6091d	International IT & Technology Works	international-it-technology-works-7	We are a leading provider of IT & Technology services in Damascus. dedicated to quality and customer satisfaction.	\N	\N	company_1771167476884_7@test.com	+963958785812	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	16 Main St, Damascus	VERIFIED	2026-02-15 14:57:56.886	\N	t	f	3.8	82	FREE	2026-02-15 14:57:56.888	2026-02-15 14:57:56.888	{}	{}
898fb124-eea5-4e91-a75f-3727fa64846a	68c307a7-517b-4cdd-9fa2-95bf939c0b44	Modern Moving & Relocation Tech	modern-moving-relocation-tech-8	We are a leading provider of Moving & Relocation services in Deir ez-Zor. dedicated to quality and customer satisfaction.	\N	\N	company_1771167476893_8@test.com	+963932567316	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	18 Main St, Deir ez-Zor	VERIFIED	2026-02-15 14:57:56.895	\N	t	f	4.3	74	FREE	2026-02-15 14:57:56.896	2026-02-15 14:57:56.896	{}	{}
2d88d171-3c61-4aab-861a-cc583e6e3650	00a886d6-2514-4dd6-b1bf-96a9fa2cecb6	Smart Marketing & Advertising Works	smart-marketing-advertising-works-9	We are a leading provider of Marketing & Advertising services in Quneitra. dedicated to quality and customer satisfaction.	\N	\N	company_1771167476901_9@test.com	+963959044918	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	79 Main St, Quneitra	VERIFIED	2026-02-15 14:57:56.902	\N	t	f	4.3	23	FREE	2026-02-15 14:57:56.903	2026-02-15 14:57:56.903	{}	{}
02c49c0b-0661-4a76-bb90-8ea4eeed496e	ee8397dd-bcc4-41ae-b2a5-27ef6b72109a	Aleppo Plumbing Experts	aleppo-plumbing-experts-10	We are a leading provider of Plumbing services in Aleppo. dedicated to quality and customer satisfaction.	\N	\N	company_1771167476909_10@test.com	+963947741156	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	66 Main St, Aleppo	VERIFIED	2026-02-15 14:57:56.911	\N	t	f	3.7	96	FREE	2026-02-15 14:57:56.912	2026-02-15 14:57:56.912	{}	{}
eceb4b5f-a76f-43e0-8343-3cc6c2728171	9102078e-ab50-4df9-a7ec-65c2464a03d8	Smart Electrical Works	smart-electrical-works-11	We are a leading provider of Electrical services in Damascus. dedicated to quality and customer satisfaction.	\N	\N	company_1771167476917_11@test.com	+963987157509	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	16 Main St, Damascus	VERIFIED	2026-02-15 14:57:56.919	\N	t	t	4.8	99	FREE	2026-02-15 14:57:56.92	2026-02-15 14:57:56.92	{}	{}
e7858e72-5933-4390-81a5-aed38d2b1084	f89fe900-2d7f-4a6f-85c7-a33f4d06941d	Best Interior Design Trading	best-interior-design-trading-12	We are a leading provider of Interior Design services in Raqqa. dedicated to quality and customer satisfaction.	\N	\N	company_1771167476925_12@test.com	+963967106976	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	93 Main St, Raqqa	VERIFIED	2026-02-15 14:57:56.928	\N	t	f	3.6	31	FREE	2026-02-15 14:57:56.929	2026-02-15 14:57:56.929	{}	{}
dd0bec95-470e-4405-837d-3d212b92c221	fc7cdc8c-efbe-410e-99dc-f94f77090096	Best Marketing & Advertising Company	best-marketing-advertising-company-13	We are a leading provider of Marketing & Advertising services in Hama. dedicated to quality and customer satisfaction.	\N	\N	company_1771167476934_13@test.com	+963928107927	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	15 Main St, Hama	VERIFIED	2026-02-15 14:57:56.935	\N	t	f	3.4	5	FREE	2026-02-15 14:57:56.936	2026-02-15 14:57:56.936	{}	{}
23d07de8-6624-4169-bad5-8a1c10105b76	d0471954-54fd-4fdd-9dbd-5885d810cd30	Aleppo HVAC Company	aleppo-hvac-company-14	We are a leading provider of HVAC services in Damascus. dedicated to quality and customer satisfaction.	\N	\N	company_1771167476939_14@test.com	+963940973317	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	82 Main St, Damascus	VERIFIED	2026-02-15 14:57:56.941	\N	t	f	3.9	21	FREE	2026-02-15 14:57:56.942	2026-02-15 14:57:56.942	{}	{}
4bd71185-0c47-4a2c-8fb2-50809150c97d	8b31467b-a846-4ac4-aee7-6f5880fd3e7b	Modern Healthcare Trading	modern-healthcare-trading-15	We are a leading provider of Healthcare services in Quneitra. dedicated to quality and customer satisfaction.	\N	\N	company_1771167476945_15@test.com	+963952523306	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	100 Main St, Quneitra	VERIFIED	2026-02-15 14:57:56.947	\N	t	f	3.4	100	FREE	2026-02-15 14:57:56.948	2026-02-15 14:57:56.948	{}	{}
bc952ede-b7fb-4e64-82d2-d652f4fa8319	40892513-50c2-4a41-9f1a-be224ae492fa	Golden Moving & Relocation Solutions	golden-moving-relocation-solutions-16	We are a leading provider of Moving & Relocation services in Aleppo. dedicated to quality and customer satisfaction.	\N	\N	company_1771167476950_16@test.com	+963984180018	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	63 Main St, Aleppo	VERIFIED	2026-02-15 14:57:56.952	\N	t	t	5	40	FREE	2026-02-15 14:57:56.953	2026-02-15 14:57:56.953	{}	{}
7406b765-8b22-4d42-8ee1-ec840c927403	c852f2e7-95ec-4b51-a6b4-f9dd6079e64f	Smart Plumbing Team	smart-plumbing-team-17	We are a leading provider of Plumbing services in Idlib. dedicated to quality and customer satisfaction.	\N	\N	company_1771167476958_17@test.com	+963980571313	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	100 Main St, Idlib	VERIFIED	2026-02-15 14:57:56.96	\N	t	f	4.2	50	FREE	2026-02-15 14:57:56.961	2026-02-15 14:57:56.961	{}	{}
1cb70d6c-9679-4ca7-b997-f1c8e30bffc7	6a4d8b84-efd3-44fd-82bc-ee188ec1776d	Modern Construction & Building Pro	modern-construction-building-pro-18	We are a leading provider of Construction & Building services in Deir ez-Zor. dedicated to quality and customer satisfaction.	\N	\N	company_1771167476965_18@test.com	+963963193392	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	96 Main St, Deir ez-Zor	VERIFIED	2026-02-15 14:57:56.968	\N	t	f	4.7	94	FREE	2026-02-15 14:57:56.969	2026-02-15 14:57:56.969	{}	{}
da04413c-9221-4de2-b5c7-c6f0bed43a68	2b1bfbaf-1f04-4124-bd01-68c75f8acd95	National Marketing & Advertising Trading	national-marketing-advertising-trading-19	We are a leading provider of Marketing & Advertising services in Idlib. dedicated to quality and customer satisfaction.	\N	\N	company_1771167476975_19@test.com	+963986133083	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	26 Main St, Idlib	VERIFIED	2026-02-15 14:57:56.977	\N	t	f	3.2	88	FREE	2026-02-15 14:57:56.978	2026-02-15 14:57:56.978	{}	{}
c34fbba1-6879-452f-aa00-f24807bdae67	8b7f1800-caca-4959-a6d8-4c763c4775f0	Smart IT & Technology Co.	smart-it-technology-co--20	We are a leading provider of IT & Technology services in As-Suwayda. dedicated to quality and customer satisfaction.	\N	\N	company_1771167476986_20@test.com	+963964499194	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	19 Main St, As-Suwayda	VERIFIED	2026-02-15 14:57:56.988	\N	t	t	3.8	61	FREE	2026-02-15 14:57:56.989	2026-02-15 14:57:56.989	{}	{}
f3e5c31c-fc5d-4f9a-9b89-48b48bbd2ccc	4f3d2896-0e00-4f98-b579-ba9254f28c1f	Elite IT & Technology Group	elite-it-technology-group-21	We are a leading provider of IT & Technology services in Al-Hasakah. dedicated to quality and customer satisfaction.	\N	\N	company_1771167476992_21@test.com	+963994645871	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	23 Main St, Al-Hasakah	VERIFIED	2026-02-15 14:57:56.994	\N	t	t	3.8	92	FREE	2026-02-15 14:57:56.995	2026-02-15 14:57:56.995	{}	{}
a3ddeb1a-b884-440f-bf1e-f356f3475390	3da19a13-09aa-4c8c-a338-a50a373a1351	Modern Construction & Building Works	modern-construction-building-works-22	We are a leading provider of Construction & Building services in Latakia. dedicated to quality and customer satisfaction.	\N	\N	company_1771167477002_22@test.com	+963912599119	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	55 Main St, Latakia	VERIFIED	2026-02-15 14:57:57.003	\N	t	f	3.2	96	FREE	2026-02-15 14:57:57.004	2026-02-15 14:57:57.004	{}	{}
2f9b30b0-f459-442b-916e-916ecf6c15f0	35afcd35-0119-4670-955a-8bc235d4c360	Modern Plumbing Contracting	modern-plumbing-contracting-23	We are a leading provider of Plumbing services in Hama. dedicated to quality and customer satisfaction.	\N	\N	company_1771167477010_23@test.com	+963953330193	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	16 Main St, Hama	VERIFIED	2026-02-15 14:57:57.013	\N	t	f	3.6	67	FREE	2026-02-15 14:57:57.014	2026-02-15 14:57:57.014	{}	{}
831f4768-84c9-4565-8df4-4ea85b58cdc4	329bb7c8-2ecb-4357-aa27-6baed0b1e3b7	Syrian Interior Design Tech	syrian-interior-design-tech-24	We are a leading provider of Interior Design services in Quneitra. dedicated to quality and customer satisfaction.	\N	\N	company_1771167477016_24@test.com	+963953325542	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	99 Main St, Quneitra	VERIFIED	2026-02-15 14:57:57.017	\N	t	f	3.6	93	FREE	2026-02-15 14:57:57.018	2026-02-15 14:57:57.018	{}	{}
2ac795a8-68f4-4e28-9f02-7d59dd441378	bdc971d7-081d-41e5-97b3-507d834f66b0	Advanced Plumbing Services	advanced-plumbing-services-25	We are a leading provider of Plumbing services in Aleppo. dedicated to quality and customer satisfaction.	\N	\N	company_1771167477020_25@test.com	+963977686188	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	94 Main St, Aleppo	VERIFIED	2026-02-15 14:57:57.022	\N	t	f	4.3	19	FREE	2026-02-15 14:57:57.024	2026-02-15 14:57:57.024	{}	{}
e1136d43-b708-4c0b-91da-abc62271ed7c	acadb284-8dc5-470b-bdb6-6169ba6f9ba5	Golden Accounting & Finance Experts	golden-accounting-finance-experts-26	We are a leading provider of Accounting & Finance services in Hama. dedicated to quality and customer satisfaction.	\N	\N	company_1771167477028_26@test.com	+963940883647	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	17 Main St, Hama	VERIFIED	2026-02-15 14:57:57.03	\N	t	f	4.1	15	FREE	2026-02-15 14:57:57.031	2026-02-15 14:57:57.031	{}	{}
a8d3b2c7-a0de-4ef1-8125-6f968dec232e	e7e2d5aa-92f8-42d8-bad0-9055614c9da9	Advanced Plumbing Team	advanced-plumbing-team-27	We are a leading provider of Plumbing services in Al-Hasakah. dedicated to quality and customer satisfaction.	\N	\N	company_1771167477034_27@test.com	+963997220161	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	87 Main St, Al-Hasakah	VERIFIED	2026-02-15 14:57:57.036	\N	t	f	3.7	53	FREE	2026-02-15 14:57:57.038	2026-02-15 14:57:57.038	{}	{}
2b1a0d4f-64c8-4d5a-bc4a-55b1d1ef2d7f	31494848-428e-4d55-b324-2eb64c380f32	National Transportation Trading	national-transportation-trading-28	We are a leading provider of Transportation services in Hama. dedicated to quality and customer satisfaction.	\N	\N	company_1771167477044_28@test.com	+963951470060	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	88 Main St, Hama	VERIFIED	2026-02-15 14:57:57.045	\N	t	f	4.1	13	FREE	2026-02-15 14:57:57.046	2026-02-15 14:57:57.046	{}	{}
c3ef53dd-e544-4ba3-ad12-498d7dcd1d6a	762f836e-6368-4fa0-9757-af9898900a8d	International Interior Design Solutions	international-interior-design-solutions-29	We are a leading provider of Interior Design services in Tartous. dedicated to quality and customer satisfaction.	\N	\N	company_1771167477050_29@test.com	+963923094622	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	43 Main St, Tartous	VERIFIED	2026-02-15 14:57:57.052	\N	t	f	4.8	91	FREE	2026-02-15 14:57:57.053	2026-02-15 14:57:57.053	{}	{}
09fca32f-1763-4fcd-a4a5-53355dc6a1b6	1963ba9d-85f7-4456-9803-24ff87187b82	Best Interior Design Group	best-interior-design-group-30	We are a leading provider of Interior Design services in Damascus. dedicated to quality and customer satisfaction.	\N	\N	company_1771167477058_30@test.com	+963915533581	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	14 Main St, Damascus	VERIFIED	2026-02-15 14:57:57.06	\N	t	t	4	58	FREE	2026-02-15 14:57:57.061	2026-02-15 14:57:57.061	{}	{}
1a56e389-835f-47d6-a343-a7082cf48da8	f2315d3e-8a9c-4b13-bb8d-d6b5fe9935a2	Damascus Cleaning Services Group	damascus-cleaning-services-group-31	We are a leading provider of Cleaning Services services in Homs. dedicated to quality and customer satisfaction.	\N	\N	company_1771167477063_31@test.com	+963919449040	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	6 Main St, Homs	VERIFIED	2026-02-15 14:57:57.065	\N	t	f	3.4	56	FREE	2026-02-15 14:57:57.066	2026-02-15 14:57:57.066	{}	{}
8f98efa5-0537-468b-8824-a8d5ae06f70a	83bab9c2-d7f5-49a5-aa8e-d1a1bd06ff95	Quick Moving & Relocation Company	quick-moving-relocation-company-32	We are a leading provider of Moving & Relocation services in Idlib. dedicated to quality and customer satisfaction.	\N	\N	company_1771167477072_32@test.com	+963986664529	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	86 Main St, Idlib	VERIFIED	2026-02-15 14:57:57.074	\N	t	t	4.2	15	FREE	2026-02-15 14:57:57.076	2026-02-15 14:57:57.076	{}	{}
632e5803-222d-4d47-977b-9158fbd6c5ed	c12cca1b-8fd4-4e38-8f19-528ab2a2ed33	Elite Moving & Relocation Services	elite-moving-relocation-services-33	We are a leading provider of Moving & Relocation services in Homs. dedicated to quality and customer satisfaction.	\N	\N	company_1771167477082_33@test.com	+963989582682	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	40 Main St, Homs	VERIFIED	2026-02-15 14:57:57.084	\N	t	t	3.5	91	FREE	2026-02-15 14:57:57.085	2026-02-15 14:57:57.085	{}	{}
053bf10d-775c-415b-b666-77c9ef5581fb	596dc79c-62e9-4580-a86b-615f19709d59	Advanced Photography & Video Co.	advanced-photography-video-co--34	We are a leading provider of Photography & Video services in Homs. dedicated to quality and customer satisfaction.	\N	\N	company_1771167477089_34@test.com	+963937576737	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	16 Main St, Homs	VERIFIED	2026-02-15 14:57:57.091	\N	t	f	3.2	29	FREE	2026-02-15 14:57:57.092	2026-02-15 14:57:57.092	{}	{}
8687adaa-2226-4eed-a750-5fe5d1b4d443	ed8d9767-2516-4d15-87c4-8261b69a6ea7	Advanced Cleaning Services Tech	advanced-cleaning-services-tech-35	We are a leading provider of Cleaning Services services in Hama. dedicated to quality and customer satisfaction.	\N	\N	company_1771167477099_35@test.com	+963932419541	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	81 Main St, Hama	VERIFIED	2026-02-15 14:57:57.101	\N	t	f	3.5	39	FREE	2026-02-15 14:57:57.102	2026-02-15 14:57:57.102	{}	{}
3b3858bb-defc-4224-a78c-0d9b78cb0422	18c8e3e0-1a95-467d-8a49-a027cee0e5bd	Professional Events & Entertainment Group	professional-events-entertainment-group-36	We are a leading provider of Events & Entertainment services in Aleppo. dedicated to quality and customer satisfaction.	\N	\N	company_1771167477109_36@test.com	+963924914285	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	71 Main St, Aleppo	VERIFIED	2026-02-15 14:57:57.111	\N	t	f	4	49	FREE	2026-02-15 14:57:57.112	2026-02-15 14:57:57.112	{}	{}
971dda5d-9fcb-4f63-bc4e-b7311d910995	f0dcfb62-8351-4e33-a4e0-844c95e04c78	Damascus Photography & Video Tech	damascus-photography-video-tech-37	We are a leading provider of Photography & Video services in Homs. dedicated to quality and customer satisfaction.	\N	\N	company_1771167477117_37@test.com	+963995288571	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	88 Main St, Homs	VERIFIED	2026-02-15 14:57:57.118	\N	t	f	3.7	18	FREE	2026-02-15 14:57:57.119	2026-02-15 14:57:57.119	{}	{}
dd0beeee-aafe-4d80-95b4-98af7a591d08	338a9c72-8a9b-4f08-a381-b527ceea416d	Elite Electrical Trading	elite-electrical-trading-38	We are a leading provider of Electrical services in Al-Hasakah. dedicated to quality and customer satisfaction.	\N	\N	company_1771167477123_38@test.com	+963951010280	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	69 Main St, Al-Hasakah	VERIFIED	2026-02-15 14:57:57.125	\N	t	t	4.8	50	FREE	2026-02-15 14:57:57.126	2026-02-15 14:57:57.126	{}	{}
e34dd89c-ac5a-410b-9af7-78bf92be3380	134e670e-7b08-4a59-bc2d-0589d08b6dcd	Modern HVAC Contracting	modern-hvac-contracting-39	We are a leading provider of HVAC services in Quneitra. dedicated to quality and customer satisfaction.	\N	\N	company_1771167477129_39@test.com	+963993751149	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	21 Main St, Quneitra	VERIFIED	2026-02-15 14:57:57.13	\N	t	f	3.4	91	FREE	2026-02-15 14:57:57.131	2026-02-15 14:57:57.131	{}	{}
e02ee9ba-fbab-41f2-ae87-c5cb9b176793	36a2106b-e2be-4917-bdb4-abd8e97d8917	Elite Legal Services Works	elite-legal-services-works-40	We are a leading provider of Legal Services services in As-Suwayda. dedicated to quality and customer satisfaction.	\N	\N	company_1771167477139_40@test.com	+963945410130	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	57 Main St, As-Suwayda	VERIFIED	2026-02-15 14:57:57.14	\N	t	f	3.3	18	FREE	2026-02-15 14:57:57.141	2026-02-15 14:57:57.141	{}	{}
12d3948f-3116-4d18-bf40-c1733feeda88	112e2545-b79b-4375-b02e-ab398816ccd0	Royal Legal Services Solutions	royal-legal-services-solutions-41	We are a leading provider of Legal Services services in Raqqa. dedicated to quality and customer satisfaction.	\N	\N	company_1771167477144_41@test.com	+963938730405	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	11 Main St, Raqqa	VERIFIED	2026-02-15 14:57:57.146	\N	t	t	4	67	FREE	2026-02-15 14:57:57.147	2026-02-15 14:57:57.147	{}	{}
ecf4ec72-2dfb-4088-b886-b3c2d4c36801	1dc82269-4fd8-4f16-8810-88d97fbad231	International Electrical Masters	international-electrical-masters-42	We are a leading provider of Electrical services in Raqqa. dedicated to quality and customer satisfaction.	\N	\N	company_1771167477152_42@test.com	+963910816295	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	7 Main St, Raqqa	VERIFIED	2026-02-15 14:57:57.154	\N	t	f	3.3	43	FREE	2026-02-15 14:57:57.155	2026-02-15 14:57:57.155	{}	{}
81bddc12-aa07-4e3b-9381-eb806592bb1c	15253bbb-7d62-4674-ad27-c66475936580	National Education & Training Team	national-education-training-team-43	We are a leading provider of Education & Training services in Idlib. dedicated to quality and customer satisfaction.	\N	\N	company_1771167477157_43@test.com	+963912407603	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	100 Main St, Idlib	VERIFIED	2026-02-15 14:57:57.158	\N	t	t	4.1	41	FREE	2026-02-15 14:57:57.159	2026-02-15 14:57:57.159	{}	{}
3dc17100-d4f2-447d-8afd-f6c460d5437a	02d635af-3510-4db3-9e4f-b0afad0cd7b3	Royal Legal Services Pro	royal-legal-services-pro-44	We are a leading provider of Legal Services services in Tartous. dedicated to quality and customer satisfaction.	\N	\N	company_1771167477165_44@test.com	+963927300033	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	57 Main St, Tartous	VERIFIED	2026-02-15 14:57:57.167	\N	t	f	3.3	33	FREE	2026-02-15 14:57:57.168	2026-02-15 14:57:57.168	{}	{}
7f95a622-3350-4e20-be5b-028d3f1a6bfc	fec2caba-d192-4c45-ad49-3a0c9c6781e5	Damascus IT & Technology Team	damascus-it-technology-team-45	We are a leading provider of IT & Technology services in Idlib. dedicated to quality and customer satisfaction.	\N	\N	company_1771167477171_45@test.com	+963998835706	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	14 Main St, Idlib	VERIFIED	2026-02-15 14:57:57.173	\N	t	f	4.1	38	FREE	2026-02-15 14:57:57.174	2026-02-15 14:57:57.174	{}	{}
bbf90c29-cff6-40a1-960e-af2be3d3f6ea	e3d943a7-207f-4bcd-bf06-d9a11968160f	Quick Legal Services Company	quick-legal-services-company-46	We are a leading provider of Legal Services services in Al-Hasakah. dedicated to quality and customer satisfaction.	\N	\N	company_1771167477177_46@test.com	+963977538042	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	63 Main St, Al-Hasakah	VERIFIED	2026-02-15 14:57:57.179	\N	t	f	4.9	77	FREE	2026-02-15 14:57:57.18	2026-02-15 14:57:57.18	{}	{}
68cc0eda-195d-4e30-a133-6b00a158316e	8ba353a3-cf79-4e4c-861c-e11c23537b2c	National Education & Training Team	national-education-training-team-47	We are a leading provider of Education & Training services in Damascus. dedicated to quality and customer satisfaction.	\N	\N	company_1771167477182_47@test.com	+963938344073	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	59 Main St, Damascus	VERIFIED	2026-02-15 14:57:57.184	\N	t	f	4.1	33	FREE	2026-02-15 14:57:57.185	2026-02-15 14:57:57.185	{}	{}
65e42772-ed92-444e-9299-d0693da9c0da	45b866f8-d3d2-413f-9c1b-c5763e4bc8a1	Golden Electrical Works	golden-electrical-works-48	We are a leading provider of Electrical services in Daraa. dedicated to quality and customer satisfaction.	\N	\N	company_1771167477188_48@test.com	+963917759652	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	12 Main St, Daraa	VERIFIED	2026-02-15 14:57:57.191	\N	t	t	4.6	18	FREE	2026-02-15 14:57:57.192	2026-02-15 14:57:57.192	{}	{}
d0756acd-e685-4c61-bbc6-f5048fb2a008	d7b8c332-1260-4ffb-9ee9-071f556c8d6f	Royal Electrical Pro	royal-electrical-pro-49	We are a leading provider of Electrical services in Tartous. dedicated to quality and customer satisfaction.	\N	\N	company_1771167477196_49@test.com	+963996763712	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	61 Main St, Tartous	VERIFIED	2026-02-15 14:57:57.198	\N	t	f	4.1	68	FREE	2026-02-15 14:57:57.199	2026-02-15 14:57:57.199	{}	{}
a84f8507-9ad1-49f8-870f-3633631e82e6	bf3e8af2-ec70-47f5-86f5-b95627c3bda6	thtytyty	thtytyty	dgvdfsgdgfhkhkdsfsgdgdgggdg	\N	\N	\N	jhkhkhkhk	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9		PENDING	\N	\N	t	f	0	0	FREE	2026-02-18 09:28:33.582	2026-02-18 09:28:33.582	{}	{}
a3c32361-e862-490a-9bff-d1ed70232cdd	709f0a1e-1bdd-4c0d-9509-9f26a46e9d03	ghgh	ghgh	hghghghghghghghghghghghghghgh	\N	\N	\N	0754224578	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	hghghgh	PENDING	\N	\N	t	f	0	0	FREE	2026-02-18 11:22:15.253	2026-02-18 11:22:15.253	{ghghghgh}	{hghgh}
02b117e8-c46b-48c3-bd84-72a036e5bb92	f7e8b243-5e91-46b0-befa-bdf1f7062b4d	popopopop	popopopop	popopopopopopopopopopopoppopo	\N	\N	\N	0758585857	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	popopop	PENDING	\N	\N	t	f	0	0	FREE	2026-02-18 11:24:43.867	2026-02-18 11:24:43.867	{popo,popop}	{popopop}
a5f91ac4-4c87-4654-9b5c-9cb7e79fb200	366db2af-9cf4-45d6-b0b7-896f68acd563	Verified Company	company-company-1771325474650	Company	\N				\N	\N		VERIFIED	\N	\N	t	f	0	0	FREE	2026-02-17 10:51:14.652	2026-02-20 09:47:53.597	{}	{d69b3ed6-faf5-4746-ba0f-eb57708676aa}
9e70375d-9019-4515-84c9-9fa94407bd2a	63a0f3bf-e2fe-4353-88a1-8f6c12cb74c9	Pending Company	pending-company-1771325474678	Pending Company	\N	\N	\N	\N	\N	\N	\N	PENDING	\N	\N	t	f	0	0	FREE	2026-02-17 10:51:14.679	2026-02-20 09:47:53.607	{}	{}
1dc049d4-5522-46d5-a3b3-be1c73c3aabc	62f62f5f-5b4e-496b-a6a0-ab5cee9fef2f	Elite Generator Installation Partners	generator-installation-en-mlsahelkt6h	We are a professional Generator Installation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-a0b0eaea-mlsahelkt6h@demo.marketplace.com	+13466595736	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:40.383	\N	t	f	4.2	55	PREMIUM	2025-08-22 09:21:32.767	2026-02-18 17:11:40.386	{}	{a0b0eaea-a4e9-4ed0-add4-8273a72630ee,lang:en}
4ec5ed60-dbcf-4998-90a8-581212cdf8a3	29da849a-4580-4649-867b-5fadf3717615	خبراء تركيب مولدات للخدمات	ar-generator-installation-mlsahenubxx	نحن شركة متخصصة في تقديم خدمات تركيب مولدات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-a0b0eaea-mlsahenubxx@demo.marketplace.com	+966177988064	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:40.414	\N	t	f	4.8	59	BASIC	2025-08-07 00:53:09.392	2026-02-18 17:11:40.416	{}	{a0b0eaea-a4e9-4ed0-add4-8273a72630ee,lang:ar}
a9cf152b-6e30-499f-aa06-1ac2f8c2a050	b87ea0b5-388a-4dff-8531-fe9cf8b0119b	Swift Electrical Solutions	electrical-en-mlsaheo23q1	We are a professional Electrical service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-c5e2b66e-mlsaheo23q1@demo.marketplace.com	+16759281253	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	VERIFIED	2026-02-18 17:11:40.421	\N	t	f	4.6	56	BASIC	2025-10-06 22:01:25.037	2026-02-18 17:11:40.424	{}	{c5e2b66e-b100-41d9-bba8-e110b2abab71,lang:en}
cb663200-0690-412c-8824-1bf51bf600c4	fdf9e7f6-3076-4e7f-b7aa-577addb4afe9	شركة كهرباء الاحترافية	ar-electrical-mlsaheo98ef	نحن شركة متخصصة في تقديم خدمات كهرباء بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-c5e2b66e-mlsaheo98ef@demo.marketplace.com	+966760375735	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	VERIFIED	2026-02-18 17:11:40.427	\N	t	t	4.2	73	PREMIUM	2026-01-02 02:34:38.9	2026-02-18 17:11:40.429	{}	{c5e2b66e-b100-41d9-bba8-e110b2abab71,lang:ar}
cb31f6b1-2c17-48a4-b1be-6476d3afc082	c796b4d5-8c52-4c88-8266-1a1cacff7667	Apex Generator Installation Team	generator-installation-en-mlsaheof1y6	We are a professional Generator Installation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-a0b0eaea-mlsaheof1y6@demo.marketplace.com	+16180299949	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:40.434	\N	t	f	3.9	27	PREMIUM	2026-02-07 00:55:43.702	2026-02-18 17:11:40.436	{}	{a0b0eaea-a4e9-4ed0-add4-8273a72630ee,lang:en}
b91e1329-659b-459f-8481-14238d8bbff8	07529ccc-3693-4d64-9708-7b9fde46d985	Pro Solar System Maint Services	solar-system-maint-en-mlsaheqhf75	We are a professional Solar System Maint service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-0def337f-mlsaheqhf75@demo.marketplace.com	+11587689556	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:40.509	\N	t	f	3.6	62	FREE	2025-12-30 01:48:54.618	2026-02-18 17:11:40.512	{}	{0def337f-dd79-4734-9227-80c91e4a2bf9,lang:en}
f1c68811-5f3d-4bb2-9a09-4fa781fce65d	124e0827-ed4d-4dc4-89ac-b74b53fbdab3	مركز تركيب مولدات الاحترافية	ar-generator-installation-mlsaheolncx	نحن شركة متخصصة في تقديم خدمات تركيب مولدات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-a0b0eaea-mlsaheolncx@demo.marketplace.com	+966149252564	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	VERIFIED	2026-02-18 17:11:40.44	\N	t	f	4	84	PREMIUM	2025-08-17 05:08:01.439	2026-02-18 17:11:40.443	{}	{a0b0eaea-a4e9-4ed0-add4-8273a72630ee,lang:ar}
5858efab-5f2e-47c0-985d-76dc454723c4	4ba0a302-91cb-41a5-a28d-517c473c2065	Apex Electrical Wiring Co	electrical-wiring-en-mlsaheotq9a	We are a professional Electrical Wiring service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-9ac120a7-mlsaheotq9a@demo.marketplace.com	+18305102251	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:40.447	\N	t	f	4.4	58	FREE	2025-12-11 08:15:57.065	2026-02-18 17:11:40.449	{}	{9ac120a7-3f97-47fd-b5ee-619b7711dcf4,lang:en}
52e91ee2-a7c0-416b-8965-cad85484245a	1d0c984f-e2c8-4cdd-a44c-76223c82e0a6	مجموعة تمديدات كهربائية المتكاملة	ar-electrical-wiring-mlsaheoyw0t	نحن شركة متخصصة في تقديم خدمات تمديدات كهربائية بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-9ac120a7-mlsaheoyw0t@demo.marketplace.com	+966131693314	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	VERIFIED	2026-02-18 17:11:40.453	\N	t	t	4.7	35	PREMIUM	2025-11-18 21:42:47.209	2026-02-18 17:11:40.455	{}	{9ac120a7-3f97-47fd-b5ee-619b7711dcf4,lang:ar}
293ab753-84ac-42ca-9ef1-90af63dd47d8	2bc91a16-e2f1-41bf-92f6-0d1f49050b86	Pro Electrical Repairs Team	electrical-repairs-en-mlsahep40ou	We are a professional Electrical Repairs service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-8981ac1a-mlsahep40ou@demo.marketplace.com	+13954083462	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	VERIFIED	2026-02-18 17:11:40.46	\N	t	f	4	33	PREMIUM	2025-03-03 11:43:56.244	2026-02-18 17:11:40.462	{}	{8981ac1a-f116-4694-898e-afda5de9b73c,lang:en}
d3d01663-b962-4e35-ba22-3236fbf504af	e839e05a-faa7-49a0-8f21-561e7876add7	شركة إصلاح أعطال كهرباء الاحترافية	ar-electrical-repairs-mlsahepc8zl	نحن شركة متخصصة في تقديم خدمات إصلاح أعطال كهرباء بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-8981ac1a-mlsahepc8zl@demo.marketplace.com	+966832089690	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	VERIFIED	2026-02-18 17:11:40.466	\N	t	t	4.1	35	FREE	2025-03-04 17:42:50.199	2026-02-18 17:11:40.468	{}	{8981ac1a-f116-4694-898e-afda5de9b73c,lang:ar}
ad68a98e-22bc-42da-9994-902cb79fea97	bebd56bd-920c-4191-b538-7ee6266cfcd1	Best Lighting Install Group	lighting-install-en-mlsaheph4es	We are a professional Lighting Install service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-b18f064e-mlsaheph4es@demo.marketplace.com	+15871703418	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:40.472	\N	t	f	4.8	84	BASIC	2026-01-17 00:39:54.341	2026-02-18 17:11:40.474	{}	{b18f064e-30fd-4227-a6e0-94efae54d8f2,lang:en}
2f0b2e62-d336-43e6-9873-35cb35e04a3f	1327c7f7-3fe2-4c3f-812f-9982d281d4dc	مجموعة تركيب إنارة المتكاملة	ar-lighting-install-mlsahepnf55	نحن شركة متخصصة في تقديم خدمات تركيب إنارة بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-b18f064e-mlsahepnf55@demo.marketplace.com	+966682088300	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	VERIFIED	2026-02-18 17:11:40.478	\N	t	t	3.7	40	BASIC	2026-01-04 19:56:45.521	2026-02-18 17:11:40.48	{}	{b18f064e-30fd-4227-a6e0-94efae54d8f2,lang:ar}
f6e3be0b-a1f1-43ed-a5df-79b2458b8409	53acafe8-5155-4a19-8907-264f7a3c8a89	Alpha Generator Maintenance Team	generator-maintenance-en-mlsaheptetz	We are a professional Generator Maintenance service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-4acb75e6-mlsaheptetz@demo.marketplace.com	+19401991189	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	VERIFIED	2026-02-18 17:11:40.483	\N	t	f	4.3	60	PREMIUM	2025-06-15 21:18:17.78	2026-02-18 17:11:40.485	{}	{4acb75e6-2c26-4912-8857-867cc55d05ed,lang:en}
53901b76-0da0-4da3-bc59-dea8919f8ec6	7c9b5c9a-b112-4107-a549-ee1e013cf643	مؤسسة صيانة مولدات المتكاملة	ar-generator-maintenance-mlsahepz7gl	نحن شركة متخصصة في تقديم خدمات صيانة مولدات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-4acb75e6-mlsahepz7gl@demo.marketplace.com	+966481638049	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:40.49	\N	t	f	4.8	12	FREE	2025-06-30 20:24:08.019	2026-02-18 17:11:40.493	{}	{4acb75e6-2c26-4912-8857-867cc55d05ed,lang:ar}
f84427d8-a5be-43d9-bf42-1ea42ceff811	37cb05e4-eb79-476a-8afb-d1f6a7e869c8	Prime Solar Panel Install Hub	solar-panel-install-en-mlsaheq5j5d	We are a professional Solar Panel Install service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-3d4fec38-mlsaheq5j5d@demo.marketplace.com	+14930443018	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	VERIFIED	2026-02-18 17:11:40.496	\N	t	f	4.2	7	FREE	2025-06-17 19:07:54.271	2026-02-18 17:11:40.498	{}	{3d4fec38-cbdd-45e0-8fab-73e5a05a1600,lang:en}
a6f055db-5531-44b1-8696-3ee9d07a0a97	ebc9a3e9-e67e-40b2-a88c-950d3b9d81f2	مركز تركيب طاقة شمسية الاحترافية	ar-solar-panel-install-mlsaheqbrz5	نحن شركة متخصصة في تقديم خدمات تركيب طاقة شمسية بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-3d4fec38-mlsaheqbrz5@demo.marketplace.com	+966708823377	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	VERIFIED	2026-02-18 17:11:40.502	\N	t	f	4.6	63	PREMIUM	2025-09-14 01:16:23.014	2026-02-18 17:11:40.504	{}	{3d4fec38-cbdd-45e0-8fab-73e5a05a1600,lang:ar}
341df313-2d2b-401d-8b61-18f3e8b5e1c2	8779106a-44b5-40dd-b98c-7174b169c716	مؤسسة صيانة طاقة شمسية المتكاملة	ar-solar-system-maint-mlsaheqproj	نحن شركة متخصصة في تقديم خدمات صيانة طاقة شمسية بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-0def337f-mlsaheqproj@demo.marketplace.com	+966553623847	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	VERIFIED	2026-02-18 17:11:40.519	\N	t	f	3.8	54	PREMIUM	2025-06-24 11:17:31.456	2026-02-18 17:11:40.522	{}	{0def337f-dd79-4734-9227-80c91e4a2bf9,lang:ar}
11438679-1527-4bb5-a9ea-e6e0c9e1d9a2	ae70bcba-380e-4e13-a37d-149ea2e1b805	Pro Electrical Panel Hub	electrical-panel-en-mlsaher0gff	We are a professional Electrical Panel service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-38cb0fe6-mlsaher0gff@demo.marketplace.com	+14981850283	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	VERIFIED	2026-02-18 17:11:40.529	\N	t	f	4.3	81	BASIC	2025-10-03 15:13:39.063	2026-02-18 17:11:40.531	{}	{38cb0fe6-bc94-4f20-b0ab-fc5ce125ec38,lang:en}
140006e6-7a95-45c1-9313-e88a2b8e51e2	30b8edb5-086f-4fa9-be8e-15beed418fb2	مؤسسة تركيب لوحات كهرباء المتكاملة	ar-electrical-panel-mlsaher8wxq	نحن شركة متخصصة في تقديم خدمات تركيب لوحات كهرباء بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-38cb0fe6-mlsaher8wxq@demo.marketplace.com	+966764105637	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	VERIFIED	2026-02-18 17:11:40.534	\N	t	f	4.5	8	PREMIUM	2025-07-21 00:17:08.542	2026-02-18 17:11:40.536	{}	{38cb0fe6-bc94-4f20-b0ab-fc5ce125ec38,lang:ar}
7d415f3a-0f22-453d-aff6-af8163de2e22	92feb1f4-3395-4400-8be6-d9f089da9c2c	Prime Backup Power Systems Hub	backup-power-systems-en-mlsaherdyrf	We are a professional Backup Power Systems service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-c79261af-mlsaherdyrf@demo.marketplace.com	+19403485289	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	VERIFIED	2026-02-18 17:11:40.54	\N	t	f	4.3	79	FREE	2026-02-01 00:32:27.298	2026-02-18 17:11:40.542	{}	{c79261af-78c0-4b45-97b6-d918a3b015c0,lang:en}
7a5046cb-0b3f-4376-9a0c-7a2af6d3444e	7631e165-9c85-44e1-a41a-305e4ead9d56	مؤسسة أنظمة طاقة احتياطية المتكاملة	ar-backup-power-systems-mlsaherkp39	نحن شركة متخصصة في تقديم خدمات أنظمة طاقة احتياطية بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-c79261af-mlsaherkp39@demo.marketplace.com	+966488029023	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	VERIFIED	2026-02-18 17:11:40.548	\N	t	f	3.7	63	FREE	2025-08-23 18:30:57.877	2026-02-18 17:11:40.55	{}	{c79261af-78c0-4b45-97b6-d918a3b015c0,lang:ar}
bfea7737-dd71-44b8-bee2-ffb3fed0ea1b	a3426510-1570-472e-94eb-82c1fabba7ea	Prime Plumbing Services	plumbing-en-mlsaherrioh	We are a professional Plumbing service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-98e85028-mlsaherrioh@demo.marketplace.com	+18518957972	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	VERIFIED	2026-02-18 17:11:40.558	\N	t	f	3.8	75	PREMIUM	2025-06-18 18:33:25.044	2026-02-18 17:11:40.561	{}	{98e85028-eaff-4c4c-a5ae-ccbe1c88e837,lang:en}
002f634b-682b-4f69-bd9e-d1ac11407634	e7942d61-cf12-4d8c-81bc-4d18a45cfa2e	مجموعة سباكة الاحترافية	ar-plumbing-mlsahes2ou1	نحن شركة متخصصة في تقديم خدمات سباكة بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-98e85028-mlsahes2ou1@demo.marketplace.com	+966449210563	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	VERIFIED	2026-02-18 17:11:40.565	\N	t	f	4	43	PREMIUM	2025-11-27 09:49:18.315	2026-02-18 17:11:40.567	{}	{98e85028-eaff-4c4c-a5ae-ccbe1c88e837,lang:ar}
340a1f80-17a3-4357-b661-c537dc66fd98	58edd111-7a3d-4ea5-8ecd-490eb2078eb4	Expert Leak Detection & Repair Partners	leak-detection-repair-en-mlsahes8qja	We are a professional Leak Detection & Repair service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-b52de601-mlsahes8qja@demo.marketplace.com	+14654536797	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	VERIFIED	2026-02-18 17:11:40.573	\N	t	f	4.1	30	BASIC	2025-07-22 21:58:59.688	2026-02-18 17:11:40.575	{}	{b52de601-ed5f-4be7-b531-55e4573892f1,lang:en}
6b84f100-5e0a-4f0e-a10e-90ea1873d086	9bd504e5-9e70-473e-8d75-d44a8ac300fb	مجموعة كشف وإصلاح تسربات المتخصصة	ar-leak-detection-repair-mlsahesgdnd	نحن شركة متخصصة في تقديم خدمات كشف وإصلاح تسربات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-b52de601-mlsahesgdnd@demo.marketplace.com	+966480697451	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	VERIFIED	2026-02-18 17:11:40.578	\N	t	f	4.3	79	BASIC	2025-09-22 12:49:29.971	2026-02-18 17:11:40.58	{}	{b52de601-ed5f-4be7-b531-55e4573892f1,lang:ar}
b8911267-990a-4ead-90ec-c6b17e5526f3	f98c5eed-fc93-4d51-a778-a55daab7cd1a	Alpha Pipe Installation Works	pipe-installation-en-mlsahesma4j	We are a professional Pipe Installation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-6805a74f-mlsahesma4j@demo.marketplace.com	+11816630417	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	VERIFIED	2026-02-18 17:11:40.585	\N	t	t	3.8	9	FREE	2025-06-07 13:18:43.713	2026-02-18 17:11:40.588	{}	{6805a74f-f7f9-419c-858f-49b99247e35b,lang:en}
2f3287b4-2a9d-4d07-ba0b-4be23db0de11	b2bad518-cf02-415e-900f-2d0091c7d953	مؤسسة تمديد أنابيب المتخصصة	ar-pipe-installation-mlsahestzld	نحن شركة متخصصة في تقديم خدمات تمديد أنابيب بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-6805a74f-mlsahestzld@demo.marketplace.com	+966682755126	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:40.591	\N	t	f	4.9	27	PREMIUM	2025-03-19 01:04:56.384	2026-02-18 17:11:40.593	{}	{6805a74f-f7f9-419c-858f-49b99247e35b,lang:ar}
0cc3b01b-047f-4f0a-949a-da4a19de62d3	30e92593-0f2f-45e4-a20d-f2e48fc8c8c9	Expert Water Heater Install Team	water-heater-install-en-mlsahesy3jp	We are a professional Water Heater Install service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-65ddaf4f-mlsahesy3jp@demo.marketplace.com	+12768956974	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:40.599	\N	t	f	3.8	54	BASIC	2025-07-27 20:59:44.692	2026-02-18 17:11:40.602	{}	{65ddaf4f-5020-4a5f-bcde-d6bea9a519ac,lang:en}
3a6c73a3-ddf2-44b2-80d9-e6fff5487aa7	073b6581-4892-4bcc-94d1-6700acf4b243	شركة تركيب سخان مياه المتميزة	ar-water-heater-install-mlsahet8uls	نحن شركة متخصصة في تقديم خدمات تركيب سخان مياه بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-65ddaf4f-mlsahet8uls@demo.marketplace.com	+966427546466	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	VERIFIED	2026-02-18 17:11:40.607	\N	t	f	4.3	33	BASIC	2025-08-08 00:11:45.075	2026-02-18 17:11:40.61	{}	{65ddaf4f-5020-4a5f-bcde-d6bea9a519ac,lang:ar}
f6b00b02-a931-403b-8c2f-d1f6a7e4e373	24ee0189-e4eb-4646-b74f-3fe744481ba4	Star Water Heater Repair Group	water-heater-repair-en-mlsahetggvr	We are a professional Water Heater Repair service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-487b84b5-mlsahetggvr@demo.marketplace.com	+11041229047	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	VERIFIED	2026-02-18 17:11:40.615	\N	t	t	4.3	39	FREE	2025-04-07 08:36:41.872	2026-02-18 17:11:40.617	{}	{487b84b5-be40-43ae-b5ed-96a494083762,lang:en}
822c65cc-7b48-4a51-9dce-03b805d912ac	e402e6f1-9878-47a0-9b2c-e778c9ed92a8	خبراء صيانة سخان مياه المتكاملة	ar-water-heater-repair-mlsahetmdyr	نحن شركة متخصصة في تقديم خدمات صيانة سخان مياه بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-487b84b5-mlsahetmdyr@demo.marketplace.com	+966750784161	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	VERIFIED	2026-02-18 17:11:40.621	\N	t	t	4.9	13	BASIC	2025-07-13 01:45:34.405	2026-02-18 17:11:40.624	{}	{487b84b5-be40-43ae-b5ed-96a494083762,lang:ar}
5c44fdf1-40fb-42d6-b1e5-71803ea11ec1	bbda4294-fded-4edd-9331-89cca75e9665	Alpha Bathroom Plumbing Services	bathroom-plumbing-en-mlsahettn7h	We are a professional Bathroom Plumbing service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-bd693184-mlsahettn7h@demo.marketplace.com	+13433217856	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	VERIFIED	2026-02-18 17:11:40.628	\N	t	f	3.7	36	FREE	2025-08-20 20:37:24.786	2026-02-18 17:11:40.631	{}	{bd693184-a710-441e-aa8b-d7c15901bac9,lang:en}
54ae506e-5696-483d-9467-27609207f7fe	52353b5c-8faa-4df5-96c0-7fd27fe758e3	شركة سباكة حمامات للخدمات	ar-bathroom-plumbing-mlsaheu0ka1	نحن شركة متخصصة في تقديم خدمات سباكة حمامات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-bd693184-mlsaheu0ka1@demo.marketplace.com	+966454982896	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	VERIFIED	2026-02-18 17:11:40.634	\N	t	f	4.4	24	FREE	2025-08-13 19:04:26.227	2026-02-18 17:11:40.637	{}	{bd693184-a710-441e-aa8b-d7c15901bac9,lang:ar}
eb03b39f-10d1-43fd-88a0-133aa4722eb3	80c90484-1b48-435c-aa44-97be6267f53f	Expert Kitchen Plumbing Team	kitchen-plumbing-en-mlsaheu6rgi	We are a professional Kitchen Plumbing service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-e9264c4c-mlsaheu6rgi@demo.marketplace.com	+19858518190	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	VERIFIED	2026-02-18 17:11:40.642	\N	t	f	4.9	61	PREMIUM	2025-09-23 05:42:50.097	2026-02-18 17:11:40.644	{}	{e9264c4c-cd5f-4c68-acbd-e99f48182171,lang:en}
0b636e8a-9b0a-47c6-970e-ee346333672a	edbe7046-6c9d-404f-b423-3525a1764443	مجموعة سباكة مطابخ للخدمات	ar-kitchen-plumbing-mlsaheudj8c	نحن شركة متخصصة في تقديم خدمات سباكة مطابخ بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-e9264c4c-mlsaheudj8c@demo.marketplace.com	+966233123914	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	VERIFIED	2026-02-18 17:11:40.648	\N	t	f	4.2	68	PREMIUM	2025-06-07 19:13:59.632	2026-02-18 17:11:40.651	{}	{e9264c4c-cd5f-4c68-acbd-e99f48182171,lang:ar}
ee06c0f4-9003-43ac-b6ce-395e4b950e45	0e07dc7b-5f3d-4a20-b2f0-a67ed2c08f4d	Swift Drain Cleaning Team	drain-cleaning-en-mlsaheuj99d	We are a professional Drain Cleaning service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-5037cea3-mlsaheuj99d@demo.marketplace.com	+18032683757	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	VERIFIED	2026-02-18 17:11:40.654	\N	t	f	4.6	82	BASIC	2025-04-16 13:05:48.532	2026-02-18 17:11:40.656	{}	{5037cea3-0eba-4061-b365-33a8ce2b99e5,lang:en}
9507bdc6-cb4d-4e0d-97cd-692181faff26	3747b232-0d7a-4944-846b-a51580a228e5	مؤسسة تسليك مجاري المتكاملة	ar-drain-cleaning-mlsaheup642	نحن شركة متخصصة في تقديم خدمات تسليك مجاري بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-5037cea3-mlsaheup642@demo.marketplace.com	+966366349443	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	VERIFIED	2026-02-18 17:11:40.66	\N	t	t	3.7	19	BASIC	2026-02-05 12:34:58.511	2026-02-18 17:11:40.662	{}	{5037cea3-0eba-4061-b365-33a8ce2b99e5,lang:ar}
18f7f965-07b7-45f0-a1d4-465e7cf3cf41	db999a75-c6a3-494d-8eea-254adff592df	Star Water Tank Install Co	water-tank-install-en-mlsaheuvdzu	We are a professional Water Tank Install service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-a536318f-mlsaheuvdzu@demo.marketplace.com	+11424278074	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:40.665	\N	t	f	4.5	8	PREMIUM	2025-05-09 14:37:32.27	2026-02-18 17:11:40.668	{}	{a536318f-3dd6-4a64-ab44-cd425b104b2e,lang:en}
1fd9acdd-12e5-48b5-98bf-1eee9ccef52e	2741ff2d-4557-41f1-b8ab-e809924aff46	Best Graphic Design Co	graphic-design-en-mlsahgi59hz	We are a professional Graphic Design service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-9f883a2f-mlsahgi59hz@demo.marketplace.com	+15437164560	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:42.8	\N	t	t	4	72	BASIC	2025-12-20 16:19:00.892	2026-02-18 17:11:42.803	{}	{9f883a2f-cae6-461b-91ce-d01c592774c3,lang:en}
1d08683f-ba9c-4306-b77f-b0ea35af0146	014b31f3-b4df-4c6f-815f-f826ee095b7b	مؤسسة تركيب خزانات الاحترافية	ar-water-tank-install-mlsahev1buc	نحن شركة متخصصة في تقديم خدمات تركيب خزانات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-a536318f-mlsahev1buc@demo.marketplace.com	+966444625727	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:40.672	\N	t	f	4.1	66	PREMIUM	2025-05-05 15:18:42.931	2026-02-18 17:11:40.675	{}	{a536318f-3dd6-4a64-ab44-cd425b104b2e,lang:ar}
496c7fd2-f65b-49c0-a622-43d3f85431bd	f0df8991-5e63-463e-973e-11cec0638e48	Swift Pump Installation Works	pump-installation-en-mlsahev8o6l	We are a professional Pump Installation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-dc97169e-mlsahev8o6l@demo.marketplace.com	+19373082548	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	VERIFIED	2026-02-18 17:11:40.679	\N	t	f	4.8	75	BASIC	2026-01-19 09:23:26.961	2026-02-18 17:11:40.681	{}	{dc97169e-d2c7-4af6-93a5-5010ab9d86f0,lang:en}
31386bd4-1f10-4d21-98f4-1328df15123c	45d44eb9-38f2-4f51-ae85-c9e14a1d9d80	مؤسسة تركيب مضخات مياه المتكاملة	ar-pump-installation-mlsahevfhfc	نحن شركة متخصصة في تقديم خدمات تركيب مضخات مياه بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-dc97169e-mlsahevfhfc@demo.marketplace.com	+966619520810	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	VERIFIED	2026-02-18 17:11:40.686	\N	t	t	3.8	16	FREE	2025-12-01 23:24:56.765	2026-02-18 17:11:40.688	{}	{dc97169e-d2c7-4af6-93a5-5010ab9d86f0,lang:ar}
e5e51790-f515-4060-9c03-2313884f56d2	68187ef5-20a9-4632-b12e-07f04ee1242c	Top Construction Partners	construction-en-mlsahevlzoi	We are a professional Construction service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-7049731f-mlsahevlzoi@demo.marketplace.com	+15910847685	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:40.691	\N	t	f	3.5	17	PREMIUM	2025-03-25 07:05:45.326	2026-02-18 17:11:40.693	{}	{7049731f-af4e-489e-b560-096dfa6b7869,lang:en}
0356a263-c377-4278-aa4f-3a0095e16b3b	28411ee0-719d-4592-bb85-c998a4c29687	مجموعة مقاولات المتخصصة	ar-construction-mlsahevrk27	نحن شركة متخصصة في تقديم خدمات مقاولات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-7049731f-mlsahevrk27@demo.marketplace.com	+966816490239	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:40.697	\N	t	f	4.2	50	PREMIUM	2025-12-10 21:08:11.339	2026-02-18 17:11:40.699	{}	{7049731f-af4e-489e-b560-096dfa6b7869,lang:ar}
e4fb8a6e-9cbd-4084-8a70-04cc83e437ca	61c1d221-d6b1-4215-afc5-db6ecba9ca31	Pro General Contractor Team	general-contractor-en-mlsahevw7sp	We are a professional General Contractor service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-3905c75e-mlsahevw7sp@demo.marketplace.com	+18768107176	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	VERIFIED	2026-02-18 17:11:40.706	\N	t	t	3.9	45	PREMIUM	2025-07-28 10:10:46.155	2026-02-18 17:11:40.708	{}	{3905c75e-18d0-4ef1-b58a-d3e1a7ce5463,lang:en}
0b70ff70-ff6d-4384-b3af-94fb9f32881e	943cf3bd-ccc0-4a01-aab8-7e4dcf962777	مؤسسة مقاول عام للخدمات	ar-general-contractor-mlsahew6d45	نحن شركة متخصصة في تقديم خدمات مقاول عام بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-3905c75e-mlsahew6d45@demo.marketplace.com	+966308869162	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	VERIFIED	2026-02-18 17:11:40.712	\N	t	f	4.7	57	FREE	2025-04-26 22:02:05.647	2026-02-18 17:11:40.715	{}	{3905c75e-18d0-4ef1-b58a-d3e1a7ce5463,lang:ar}
8dc5bd11-48cb-4202-be4a-af964573fa17	a7c19083-22b9-48cf-bf9f-2a82b84910d5	Prime Home Renovation Co	home-renovation-en-mlsahewb7jg	We are a professional Home Renovation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-5c720069-mlsahewb7jg@demo.marketplace.com	+15423734323	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	VERIFIED	2026-02-18 17:11:40.719	\N	t	f	5	77	PREMIUM	2025-11-03 22:09:24.996	2026-02-18 17:11:40.721	{}	{5c720069-74be-4ad8-807c-e064c1521c4f,lang:en}
085558c0-c649-4396-8301-d60306837f19	85f6494d-9167-473f-9947-79447cb6ec0e	خبراء ترميم منازل المتكاملة	ar-home-renovation-mlsahewluzv	نحن شركة متخصصة في تقديم خدمات ترميم منازل بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-5c720069-mlsahewluzv@demo.marketplace.com	+966961243153	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:40.729	\N	t	f	4	64	FREE	2026-01-08 17:21:46.974	2026-02-18 17:11:40.732	{}	{5c720069-74be-4ad8-807c-e064c1521c4f,lang:ar}
52dd5600-e7be-4c4f-b3dc-52a642c5c7ae	e8709acd-8bf1-4ac5-b778-4317a99eff34	Prime Kitchen Renovation Services	kitchen-renovation-en-mlsahewup1x	We are a professional Kitchen Renovation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-47186941-mlsahewup1x@demo.marketplace.com	+19317319171	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	VERIFIED	2026-02-18 17:11:40.738	\N	t	f	3.7	8	PREMIUM	2025-10-28 21:36:48.532	2026-02-18 17:11:40.741	{}	{47186941-ba55-49bd-97b8-2b54e376f36b,lang:en}
5828af8a-2074-4c77-a5c6-2a42fdb0a7f2	75c21ff1-0d09-414d-8647-4b892232d1d9	خبراء تجديد مطابخ الاحترافية	ar-kitchen-renovation-mlsahex2kyj	نحن شركة متخصصة في تقديم خدمات تجديد مطابخ بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-47186941-mlsahex2kyj@demo.marketplace.com	+966648240157	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:40.745	\N	t	f	3.8	76	BASIC	2025-04-12 20:31:39.999	2026-02-18 17:11:40.748	{}	{47186941-ba55-49bd-97b8-2b54e376f36b,lang:ar}
31682336-d1da-4cfc-9b02-c592edbf9435	d68d97c7-fef4-4ac1-b6e3-2186d6f854cb	Star Bathroom Renovation Co	bathroom-renovation-en-mlsahexaacu	We are a professional Bathroom Renovation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-5db5637c-mlsahexaacu@demo.marketplace.com	+17091816941	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	VERIFIED	2026-02-18 17:11:40.756	\N	t	f	3.6	45	PREMIUM	2025-10-08 10:02:30.543	2026-02-18 17:11:40.758	{}	{5db5637c-2d55-46eb-b46b-6c5c9aa87a19,lang:en}
e788ec7f-1669-4302-b31b-3988482d13c9	735d0b11-045f-46dd-b9a1-0bfc32df08cc	شركة تجديد حمامات المتميزة	ar-bathroom-renovation-mlsahexjf8m	نحن شركة متخصصة في تقديم خدمات تجديد حمامات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-5db5637c-mlsahexjf8m@demo.marketplace.com	+966306379427	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	VERIFIED	2026-02-18 17:11:40.763	\N	t	f	4.3	80	FREE	2025-08-21 10:43:11.112	2026-02-18 17:11:40.766	{}	{5db5637c-2d55-46eb-b46b-6c5c9aa87a19,lang:ar}
e77fff54-8672-4671-8a74-011674f8027f	8e646713-0a34-4e7d-acf3-129d1d0f63d1	Alpha Tile Installation Experts	tile-installation-en-mlsahexsszx	We are a professional Tile Installation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-eb3a5f87-mlsahexsszx@demo.marketplace.com	+11030644284	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	VERIFIED	2026-02-18 17:11:40.771	\N	t	t	3.7	20	BASIC	2025-10-11 17:49:32.569	2026-02-18 17:11:40.774	{}	{eb3a5f87-d152-41c0-a704-4dd4f93ed87d,lang:en}
046fab42-5963-4d94-bede-371ce29336c6	d6b4ca3a-da86-425f-b40d-cbcf25f44272	مجموعة تركيب بلاط للخدمات	ar-tile-installation-mlsahey0naj	نحن شركة متخصصة في تقديم خدمات تركيب بلاط بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-eb3a5f87-mlsahey0naj@demo.marketplace.com	+966788321274	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	VERIFIED	2026-02-18 17:11:40.779	\N	t	f	4.5	14	PREMIUM	2025-10-30 05:01:44.733	2026-02-18 17:11:40.781	{}	{eb3a5f87-d152-41c0-a704-4dd4f93ed87d,lang:ar}
a2741c1f-f87a-47bb-9c44-a858fffa7bc2	73a938eb-bb07-4959-9878-2de89129e605	Swift Flooring Installation Agency	flooring-installation-en-mlsahey77fu	We are a professional Flooring Installation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-2e57b799-mlsahey77fu@demo.marketplace.com	+11909030241	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:40.786	\N	t	f	4	9	PREMIUM	2025-11-04 16:13:17.581	2026-02-18 17:11:40.788	{}	{2e57b799-12e9-40aa-9519-c462f5d458ba,lang:en}
4109b9bc-ac84-4b59-8e65-91c1b9c5fbaf	cfe30cdd-4d8c-40f9-ad59-224dd2f37e86	مؤسسة تركيب أرضيات للخدمات	ar-flooring-installation-mlsaheyf7q0	نحن شركة متخصصة في تقديم خدمات تركيب أرضيات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-2e57b799-mlsaheyf7q0@demo.marketplace.com	+966725342335	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	VERIFIED	2026-02-18 17:11:40.799	\N	t	f	4.3	35	FREE	2026-01-16 23:24:35.741	2026-02-18 17:11:40.802	{}	{2e57b799-12e9-40aa-9519-c462f5d458ba,lang:ar}
812dc80f-ea2d-4841-8a5f-9131164b2235	f0a63e32-1d31-4fbb-bc53-e46bc4b90fd3	Alpha Gypsum Board Team	gypsum-board-en-mlsaheytevk	We are a professional Gypsum Board service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-84885f89-mlsaheytevk@demo.marketplace.com	+12293879165	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	VERIFIED	2026-02-18 17:11:40.809	\N	t	f	4.7	49	PREMIUM	2025-09-18 20:09:35.527	2026-02-18 17:11:40.812	{}	{84885f89-be5a-4750-baac-92ce56f45288,lang:en}
b7eba3cb-b6fc-4753-845d-0c1decb3188a	ae927beb-09fc-447c-a063-f06e4fbd047a	مؤسسة جبس بورد المتخصصة	ar-gypsum-board-mlsahez1ihv	نحن شركة متخصصة في تقديم خدمات جبس بورد بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-84885f89-mlsahez1ihv@demo.marketplace.com	+966191738076	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	VERIFIED	2026-02-18 17:11:40.816	\N	t	f	4.4	42	FREE	2025-12-09 13:16:03.96	2026-02-18 17:11:40.818	{}	{84885f89-be5a-4750-baac-92ce56f45288,lang:ar}
66f3c9b1-5236-4e68-a792-c6386dae4c55	763f7d6b-60aa-44ce-9074-c89a8f899fdb	Elite Painting Services Hub	painting-services-en-mlsahez8val	We are a professional Painting Services service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-e9fcae5a-mlsahez8val@demo.marketplace.com	+12548572872	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	VERIFIED	2026-02-18 17:11:40.823	\N	t	f	4.6	70	FREE	2025-03-21 14:41:28.263	2026-02-18 17:11:40.826	{}	{e9fcae5a-1a61-4f96-adca-e1bee96da919,lang:en}
c7154ed2-6abe-4581-8258-128fde8751e5	88359a10-d44a-47ee-acef-fb60d2ed0cab	خبراء دهانات وديكور المتخصصة	ar-painting-services-mlsahezfpgm	نحن شركة متخصصة في تقديم خدمات دهانات وديكور بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-e9fcae5a-mlsahezfpgm@demo.marketplace.com	+966308938468	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:40.831	\N	t	f	3.8	82	PREMIUM	2025-04-22 21:51:56.202	2026-02-18 17:11:40.833	{}	{e9fcae5a-1a61-4f96-adca-e1bee96da919,lang:ar}
8de5eb96-48fb-4b13-9c79-40044bca6998	b18d9727-741a-4bfd-a514-deb789713c5d	Best Roofing Agency	roofing-en-mlsahezn64o	We are a professional Roofing service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-93ad7de3-mlsahezn64o@demo.marketplace.com	+13210475875	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	VERIFIED	2026-02-18 17:11:40.838	\N	t	f	4.7	9	BASIC	2025-05-12 03:43:24.43	2026-02-18 17:11:40.841	{}	{93ad7de3-d02d-47c7-9138-22daa3c2c0b4,lang:en}
a00bd6b0-42d2-4065-bcd7-e1084cc3447a	e45c2222-6280-4538-8b63-b404d0e5aaad	Alpha Disinfection Services Team	disinfection-services-en-mlsahf4sw00	We are a professional Disinfection Services service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-2f34e68f-mlsahf4sw00@demo.marketplace.com	+14105724455	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:41.022	\N	t	f	4.2	45	BASIC	2025-12-10 18:30:56.502	2026-02-18 17:11:41.024	{}	{2f34e68f-344a-4a04-8ca5-0ef67fb6f5f7,lang:en}
d112a2ca-ff7f-4418-9b25-6823c7ca759c	67c10466-2a67-4fd7-845f-07ea928e3c0e	مؤسسة عزل أسطح المتكاملة	ar-roofing-mlsahezuvtg	نحن شركة متخصصة في تقديم خدمات عزل أسطح بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-93ad7de3-mlsahezuvtg@demo.marketplace.com	+966874355816	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	VERIFIED	2026-02-18 17:11:40.845	\N	t	f	4.9	34	FREE	2025-09-09 20:17:53.053	2026-02-18 17:11:40.848	{}	{93ad7de3-d02d-47c7-9138-22daa3c2c0b4,lang:ar}
03122378-f23c-421a-ad56-456bbb56a3e7	219b4f98-940f-45eb-acc9-7bbc263e725b	Apex Concrete & Masonry Services	concrete-masonry-en-mlsahf04gyl	We are a professional Concrete & Masonry service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-5794040d-mlsahf04gyl@demo.marketplace.com	+19172310505	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	VERIFIED	2026-02-18 17:11:40.855	\N	t	f	4.1	14	FREE	2025-04-20 16:25:50.213	2026-02-18 17:11:40.859	{}	{5794040d-4834-4d81-a7c3-99d2f4d9383b,lang:en}
e2e754c7-c4ab-41a5-9931-b72f8bed64dd	c48923d9-ff59-4c9f-84f3-1cfed056a633	مجموعة أعمال باطون وبناء للخدمات	ar-concrete-masonry-mlsahf0cknq	نحن شركة متخصصة في تقديم خدمات أعمال باطون وبناء بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-5794040d-mlsahf0cknq@demo.marketplace.com	+966790233711	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:40.866	\N	t	t	3.8	75	PREMIUM	2025-11-02 13:56:54.01	2026-02-18 17:11:40.869	{}	{5794040d-4834-4d81-a7c3-99d2f4d9383b,lang:ar}
f6a7b6ae-366c-4740-b758-3f816fd5207d	b0b5af49-e77a-4218-b189-2a7a92c3e05f	Star Structural Repairs Team	structural-repairs-en-mlsahf0nxjc	We are a professional Structural Repairs service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-c0e5b849-mlsahf0nxjc@demo.marketplace.com	+19284048078	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	VERIFIED	2026-02-18 17:11:40.874	\N	t	f	4.7	75	PREMIUM	2025-08-24 06:30:58.881	2026-02-18 17:11:40.879	{}	{c0e5b849-e7e0-461d-a535-0e84d6d7f791,lang:en}
ffaf317a-5439-42c2-a2ef-c503af4457a7	1ff6d023-7d1c-4cf7-99ed-473a0bd7eadd	خبراء تدعيم إنشائي المتخصصة	ar-structural-repairs-mlsahf0x8mu	نحن شركة متخصصة في تقديم خدمات تدعيم إنشائي بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-c0e5b849-mlsahf0x8mu@demo.marketplace.com	+966916185306	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:40.884	\N	t	t	3.9	28	BASIC	2025-09-22 01:26:30.337	2026-02-18 17:11:40.887	{}	{c0e5b849-e7e0-461d-a535-0e84d6d7f791,lang:ar}
d0701cf2-5b17-405f-8a4e-dbdccd41ba3d	5313b531-08a9-4a2e-a28e-82e62a3294b7	Swift Cleaning Experts	cleaning-en-mlsahf146px	We are a professional Cleaning service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-98d60428-mlsahf146px@demo.marketplace.com	+14398735158	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	VERIFIED	2026-02-18 17:11:40.892	\N	t	f	4	78	BASIC	2025-12-19 14:21:42.176	2026-02-18 17:11:40.895	{}	{98d60428-77df-4a56-8bca-4025dd191119,lang:en}
36c54e28-1965-48e5-a4db-c5f1b80aeb6d	21a7f254-a00e-4708-bfee-6fc6e1418e2d	مركز تنظيف المتميزة	ar-cleaning-mlsahf1cqdb	نحن شركة متخصصة في تقديم خدمات تنظيف بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-98d60428-mlsahf1cqdb@demo.marketplace.com	+966955056205	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:40.903	\N	t	f	4.9	68	PREMIUM	2025-08-01 04:27:25.302	2026-02-18 17:11:40.907	{}	{98d60428-77df-4a56-8bca-4025dd191119,lang:ar}
c42c65ce-9307-44d5-9706-96b7abafcf6c	2ef1b41b-1a36-48ec-8461-b9138c02bc3a	Prime Home Cleaning Works	home-cleaning-en-mlsahf1o40e	We are a professional Home Cleaning service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-459e22dc-mlsahf1o40e@demo.marketplace.com	+14311440774	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:40.912	\N	t	f	4.2	26	BASIC	2025-03-30 14:31:44.892	2026-02-18 17:11:40.915	{}	{459e22dc-d5aa-4f49-9284-d416e3201e34,lang:en}
3f73ecec-d20e-44d8-a62e-37ffe5957139	a198b956-8cfb-4892-8e30-40c210a4f4c1	مؤسسة تنظيف منازل للخدمات	ar-home-cleaning-mlsahf1wu4s	نحن شركة متخصصة في تقديم خدمات تنظيف منازل بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-459e22dc-mlsahf1wu4s@demo.marketplace.com	+966689406985	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	VERIFIED	2026-02-18 17:11:40.922	\N	t	t	4.9	36	BASIC	2025-04-05 22:59:02.031	2026-02-18 17:11:40.924	{}	{459e22dc-d5aa-4f49-9284-d416e3201e34,lang:ar}
98f951fd-2896-41de-a809-aaa52ca2640f	b277c5a5-f913-472e-9962-29be2890acc2	Pro Deep Cleaning Agency	deep-cleaning-en-mlsahf26i6g	We are a professional Deep Cleaning service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-b63a2fe5-mlsahf26i6g@demo.marketplace.com	+13861358160	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	VERIFIED	2026-02-18 17:11:40.929	\N	t	f	4.1	74	PREMIUM	2025-10-18 07:53:08.767	2026-02-18 17:11:40.933	{}	{b63a2fe5-171f-4db4-95ee-b16a8210eb9d,lang:en}
ac5e02ae-174a-43cf-9d51-8cd543014e84	206dfa0d-c614-42a6-9ede-865e66768b98	شركة تنظيف عميق المتميزة	ar-deep-cleaning-mlsahf2gavm	نحن شركة متخصصة في تقديم خدمات تنظيف عميق بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-b63a2fe5-mlsahf2gavm@demo.marketplace.com	+966898389991	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:40.94	\N	t	f	4.3	19	FREE	2025-08-22 04:27:14.136	2026-02-18 17:11:40.942	{}	{b63a2fe5-171f-4db4-95ee-b16a8210eb9d,lang:ar}
916dd82c-e6f2-4a6e-98e0-c962fde87f17	391ffbac-ec9a-4496-9b7c-30bbb55f858c	Top Office Cleaning Agency	office-cleaning-en-mlsahf2n3mj	We are a professional Office Cleaning service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-fcd17d77-mlsahf2n3mj@demo.marketplace.com	+15775824275	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	VERIFIED	2026-02-18 17:11:40.946	\N	t	f	3.9	38	PREMIUM	2025-08-03 06:09:46.262	2026-02-18 17:11:40.948	{}	{fcd17d77-74e4-4cec-83b1-12e99b00c62f,lang:en}
a547ef9a-bccd-4657-ab44-3802b9eb97e3	d80c3bee-2c3d-4684-9ea3-069735ae3f27	شركة تنظيف مكاتب المتكاملة	ar-office-cleaning-mlsahf2ubih	نحن شركة متخصصة في تقديم خدمات تنظيف مكاتب بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-fcd17d77-mlsahf2ubih@demo.marketplace.com	+966437459518	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	VERIFIED	2026-02-18 17:11:40.952	\N	t	f	4.1	52	PREMIUM	2025-05-18 02:12:36.987	2026-02-18 17:11:40.955	{}	{fcd17d77-74e4-4cec-83b1-12e99b00c62f,lang:ar}
4eedcd9f-37bb-4848-ad95-269fc02cf299	cd52c9c0-5a4d-4ade-a8b3-ccb5bf414380	Apex Post-Construction Partners	post-construction-en-mlsahf2za5h	We are a professional Post-Construction service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-37316c32-mlsahf2za5h@demo.marketplace.com	+12895535787	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:40.958	\N	t	f	4.2	63	PREMIUM	2025-10-04 00:19:45.343	2026-02-18 17:11:40.96	{}	{37316c32-bf7c-4282-87b9-78417ffb611d,lang:en}
51b4a067-3129-4ba1-98ef-71c6cce892b5	2ed0daed-6856-4924-96ab-f0d13172a34b	مركز تنظيف بعد البناء المتخصصة	ar-post-construction-mlsahf36lrn	نحن شركة متخصصة في تقديم خدمات تنظيف بعد البناء بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-37316c32-mlsahf36lrn@demo.marketplace.com	+966315157539	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	VERIFIED	2026-02-18 17:11:40.965	\N	t	f	3.6	54	FREE	2025-04-28 00:10:11.553	2026-02-18 17:11:40.967	{}	{37316c32-bf7c-4282-87b9-78417ffb611d,lang:ar}
d7fffd43-77fa-436d-a0a1-7de65c030f50	d49d8464-e722-42d3-afcd-e0e08b3b8fd7	Pro Carpet Cleaning Hub	carpet-cleaning-en-mlsahf3culp	We are a professional Carpet Cleaning service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-b51d67bd-mlsahf3culp@demo.marketplace.com	+13505468562	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	VERIFIED	2026-02-18 17:11:40.97	\N	t	f	4.2	6	BASIC	2025-09-23 04:36:30.187	2026-02-18 17:11:40.973	{}	{b51d67bd-090c-4383-b27d-fc53244989af,lang:en}
2d527f5c-ba59-4993-ae9d-51555d251f8f	d99b37e9-eb86-4204-a848-0413ffe81365	مركز تنظيف سجاد وموكيت المتخصصة	ar-carpet-cleaning-mlsahf3j6xw	نحن شركة متخصصة في تقديم خدمات تنظيف سجاد وموكيت بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-b51d67bd-mlsahf3j6xw@demo.marketplace.com	+966430070972	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:40.978	\N	t	t	3.6	28	BASIC	2025-11-07 23:52:55.505	2026-02-18 17:11:40.98	{}	{b51d67bd-090c-4383-b27d-fc53244989af,lang:ar}
76d4e0ff-9ed9-4251-aded-93523f7be181	c8598814-86f2-4861-b52c-d7e480ff814d	Swift Sofa Cleaning Solutions	sofa-cleaning-en-mlsahf3pha0	We are a professional Sofa Cleaning service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-be163dd8-mlsahf3pha0@demo.marketplace.com	+17141910808	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:40.983	\N	t	f	4	66	BASIC	2025-04-21 04:57:02.342	2026-02-18 17:11:40.985	{}	{be163dd8-9324-47c1-b07a-3d727382acd4,lang:en}
ddc5c7c9-0faa-450a-aef8-2ab0c771d8dc	eac4eed1-371f-4440-ad4b-871744aa8984	مركز تنظيف كنب ومفروشات للخدمات	ar-sofa-cleaning-mlsahf3v356	نحن شركة متخصصة في تقديم خدمات تنظيف كنب ومفروشات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-be163dd8-mlsahf3v356@demo.marketplace.com	+966369570567	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	VERIFIED	2026-02-18 17:11:40.99	\N	t	t	4.4	81	PREMIUM	2025-11-16 17:14:55.431	2026-02-18 17:11:40.993	{}	{be163dd8-9324-47c1-b07a-3d727382acd4,lang:ar}
f71a8a95-9e3e-48bd-b33b-8ad0b3265080	f7dee9c3-b6aa-4d7e-b70e-7b77b165f109	Elite Window Cleaning Experts	window-cleaning-en-mlsahf42ulq	We are a professional Window Cleaning service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-70eeca24-mlsahf42ulq@demo.marketplace.com	+11890035872	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:40.996	\N	t	f	4.7	20	BASIC	2026-01-05 01:54:48.851	2026-02-18 17:11:40.998	{}	{70eeca24-013d-4546-9567-3b42927e8364,lang:en}
58dbb70a-1c10-46ec-a3d8-88ddf539890a	6aa4af89-1090-4508-b90c-9d41b9284746	مركز تنظيف واجهات زجاجية للخدمات	ar-window-cleaning-mlsahf47ldf	نحن شركة متخصصة في تقديم خدمات تنظيف واجهات زجاجية بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-70eeca24-mlsahf47ldf@demo.marketplace.com	+966271558739	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	VERIFIED	2026-02-18 17:11:41.003	\N	t	f	3.9	30	BASIC	2025-11-20 18:05:44.117	2026-02-18 17:11:41.005	{}	{70eeca24-013d-4546-9567-3b42927e8364,lang:ar}
81778cee-a0a9-492f-91bd-b8239f772cae	06a50665-9217-43df-a3b6-d5f1e9a36bb9	Prime Water Tank Cleaning Services	water-tank-cleaning-en-mlsahf4eqzf	We are a professional Water Tank Cleaning service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-0a715def-mlsahf4eqzf@demo.marketplace.com	+17577874680	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	VERIFIED	2026-02-18 17:11:41.009	\N	t	f	3.7	67	FREE	2025-04-29 01:28:40.594	2026-02-18 17:11:41.011	{}	{0a715def-3e28-46b5-b8e2-1d5e47af7730,lang:en}
3b434ba6-9391-4e3b-a99a-00f6bfac009b	3f0e11ff-d51b-46a3-b968-dde9381ecc62	شركة تعقيم خزانات المياه المتكاملة	ar-water-tank-cleaning-mlsahf4j8qb	نحن شركة متخصصة في تقديم خدمات تعقيم خزانات المياه بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-0a715def-mlsahf4j8qb@demo.marketplace.com	+966992325401	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:41.015	\N	t	f	4.8	51	FREE	2025-11-29 04:57:42.727	2026-02-18 17:11:41.019	{}	{0a715def-3e28-46b5-b8e2-1d5e47af7730,lang:ar}
7477148d-266f-4cc5-aa11-df6f57d811ea	fd13f70c-61eb-4f0a-9aed-31b3e2cc024b	مركز خدمات تعقيم شامل المتميزة	ar-disinfection-services-mlsahf4x8t9	نحن شركة متخصصة في تقديم خدمات خدمات تعقيم شامل بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-2f34e68f-mlsahf4x8t9@demo.marketplace.com	+966164338343	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:41.027	\N	t	f	4	45	FREE	2025-07-14 11:16:42.881	2026-02-18 17:11:41.031	{}	{2f34e68f-344a-4a04-8ca5-0ef67fb6f5f7,lang:ar}
ff4db01b-9a5b-480b-a2d9-f062ed735138	287bad21-366b-4fb9-8063-f3d31965d548	Expert Moving Agency	moving-en-mlsahf54rzl	We are a professional Moving service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-d69b3ed6-mlsahf54rzl@demo.marketplace.com	+18970659443	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:41.035	\N	t	f	5	82	FREE	2025-06-27 05:06:02.363	2026-02-18 17:11:41.037	{}	{d69b3ed6-faf5-4746-ba0f-eb57708676aa,lang:en}
2010f990-5a13-4b64-adb9-43616c0cdd2a	c4c667aa-d0aa-4377-a92b-53e7a9f08255	شركة نقل عفش للخدمات	ar-moving-mlsahf5ao0p	نحن شركة متخصصة في تقديم خدمات نقل عفش بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-d69b3ed6-mlsahf5ao0p@demo.marketplace.com	+966976920638	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	VERIFIED	2026-02-18 17:11:41.04	\N	t	f	4.4	68	BASIC	2025-04-26 23:40:00.216	2026-02-18 17:11:41.042	{}	{d69b3ed6-faf5-4746-ba0f-eb57708676aa,lang:ar}
8eb630f5-f957-4411-8a12-73d659d9b457	c35aa196-7c98-4b2a-9cee-6ee9546e2a19	Alpha Furniture Moving Services	furniture-moving-en-mlsahf5hmr0	We are a professional Furniture Moving service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-24ca6098-mlsahf5hmr0@demo.marketplace.com	+19302585450	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	VERIFIED	2026-02-18 17:11:41.047	\N	t	f	5	31	BASIC	2025-08-30 20:42:10.797	2026-02-18 17:11:41.05	{}	{24ca6098-169b-46bb-993d-a130327b16f9,lang:en}
9569c71d-886b-4894-b9cf-7f09d9e9dee8	702c4539-3155-4942-9bf7-333827fcff1f	مؤسسة نقل أثاث المتكاملة	ar-furniture-moving-mlsahf5m99c	نحن شركة متخصصة في تقديم خدمات نقل أثاث بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-24ca6098-mlsahf5m99c@demo.marketplace.com	+966223454790	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	VERIFIED	2026-02-18 17:11:41.053	\N	t	f	3.5	68	FREE	2025-03-16 00:13:32.02	2026-02-18 17:11:41.055	{}	{24ca6098-169b-46bb-993d-a130327b16f9,lang:ar}
c14d108c-a416-4001-bde0-6ac6aa6b5882	ae3e853c-6817-49cf-971a-b752ea1c4d0d	Swift House Moving Experts	house-moving-en-mlsahf5s1xq	We are a professional House Moving service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-a3529217-mlsahf5s1xq@demo.marketplace.com	+15539291226	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	VERIFIED	2026-02-18 17:11:41.063	\N	t	t	3.7	5	PREMIUM	2026-02-16 07:48:43.923	2026-02-18 17:11:41.065	{}	{a3529217-903e-4710-b70c-2b15b18ecaa7,lang:en}
c49e77e7-d7a6-4808-b543-e10d04f3287a	665aaea9-a27f-4458-8851-9962c183cf35	مركز نقل منازل للخدمات	ar-house-moving-mlsahf62xll	نحن شركة متخصصة في تقديم خدمات نقل منازل بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-a3529217-mlsahf62xll@demo.marketplace.com	+966110464842	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	VERIFIED	2026-02-18 17:11:41.069	\N	t	f	4	15	PREMIUM	2025-03-03 14:55:49.868	2026-02-18 17:11:41.072	{}	{a3529217-903e-4710-b70c-2b15b18ecaa7,lang:ar}
4b558d13-e757-425a-bef7-c818bc127dd3	58809954-83a1-422f-aec7-d4483807247d	Pro Office Moving Co	office-moving-en-mlsahf6a685	We are a professional Office Moving service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-0cfccd84-mlsahf6a685@demo.marketplace.com	+12606748121	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	VERIFIED	2026-02-18 17:11:41.076	\N	t	f	3.8	10	PREMIUM	2025-06-04 01:04:30.564	2026-02-18 17:11:41.078	{}	{0cfccd84-7b2e-460a-9075-74f3d8dc4586,lang:en}
c44a0658-bc07-4f4b-8f36-83a619f681c4	4b3a1040-2897-45c3-85c7-13769aa6ca4e	مؤسسة نقل مكاتب وشركات المتخصصة	ar-office-moving-mlsahf6fiuz	نحن شركة متخصصة في تقديم خدمات نقل مكاتب وشركات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-0cfccd84-mlsahf6fiuz@demo.marketplace.com	+966779508542	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	VERIFIED	2026-02-18 17:11:41.082	\N	t	f	4	33	FREE	2025-06-27 03:24:50.072	2026-02-18 17:11:41.084	{}	{0cfccd84-7b2e-460a-9075-74f3d8dc4586,lang:ar}
70aa73ca-9743-434b-ae0c-40b4046797a7	0d57a830-3fb6-427b-bcb0-c1ddff25b1b9	Expert Packing Services Services	packing-services-en-mlsahf6mfzr	We are a professional Packing Services service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-0c79abc5-mlsahf6mfzr@demo.marketplace.com	+18299738511	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	VERIFIED	2026-02-18 17:11:41.089	\N	t	t	3.6	76	PREMIUM	2025-05-18 07:07:13.113	2026-02-18 17:11:41.091	{}	{0c79abc5-cdde-4d82-8bb1-898d546fee4e,lang:en}
fdde7898-1594-4271-928e-e4598dfb558d	66b2454a-affe-4262-b11d-3b53191b0a89	خبراء خدمات تغليف للخدمات	ar-packing-services-mlsahf6s98y	نحن شركة متخصصة في تقديم خدمات خدمات تغليف بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-0c79abc5-mlsahf6s98y@demo.marketplace.com	+966354535277	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:41.095	\N	t	t	3.9	71	FREE	2025-11-28 01:53:35.982	2026-02-18 17:11:41.097	{}	{0c79abc5-cdde-4d82-8bb1-898d546fee4e,lang:ar}
94c5bbd0-bb87-43de-8f4f-20c86515f595	ca3db9f5-4cb0-4377-ac2d-4ff73fdba186	Top Storage Services Co	storage-services-en-mlsahf6ybxa	We are a professional Storage Services service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-a42fec55-mlsahf6ybxa@demo.marketplace.com	+13353581974	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	VERIFIED	2026-02-18 17:11:41.103	\N	t	f	3.8	18	PREMIUM	2025-06-01 22:48:03.722	2026-02-18 17:11:41.105	{}	{a42fec55-2abc-4caa-856b-d80e4ac7ab45,lang:en}
4bb4ca2d-ece2-4a4a-b1dd-b8c18aba8393	b53783b7-7687-4cf8-a6ae-bc23cfa3ec9d	مجموعة خدمات تخزين للخدمات	ar-storage-services-mlsahf76nzo	نحن شركة متخصصة في تقديم خدمات خدمات تخزين بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-a42fec55-mlsahf76nzo@demo.marketplace.com	+966348032180	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	VERIFIED	2026-02-18 17:11:41.109	\N	t	f	4.7	78	PREMIUM	2025-03-20 16:02:14.504	2026-02-18 17:11:41.111	{}	{a42fec55-2abc-4caa-856b-d80e4ac7ab45,lang:ar}
acfff4a4-ad34-405f-a936-ce773e4b8078	e9a7c07f-4465-4590-b0bd-ac0a6b811280	Alpha Equipment Transport Group	equipment-transport-en-mlsahf7dipb	We are a professional Equipment Transport service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-61452801-mlsahf7dipb@demo.marketplace.com	+15245610738	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	VERIFIED	2026-02-18 17:11:41.116	\N	t	f	5	8	BASIC	2026-02-08 02:01:18.13	2026-02-18 17:11:41.118	{}	{61452801-a110-4604-817d-a4374db967c0,lang:en}
d4e97014-def2-48d7-aa14-c229984abc7e	f31209f3-92a3-4c38-9400-6b0fbc97bf6d	خبراء نقل معدات الاحترافية	ar-equipment-transport-mlsahf7j5fw	نحن شركة متخصصة في تقديم خدمات نقل معدات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-61452801-mlsahf7j5fw@demo.marketplace.com	+966412894614	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:41.122	\N	t	f	4.3	25	PREMIUM	2025-06-04 19:39:29.586	2026-02-18 17:11:41.124	{}	{61452801-a110-4604-817d-a4374db967c0,lang:ar}
a062fd75-9270-4a3b-9c66-001886bad31b	0f9f89c0-6330-475d-b0d2-aff9ceeaea73	Elite Local Delivery Experts	local-delivery-en-mlsahf7okdu	We are a professional Local Delivery service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-e0ea0aaf-mlsahf7okdu@demo.marketplace.com	+11963776955	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:41.128	\N	t	f	3.9	29	BASIC	2025-10-31 03:37:01.654	2026-02-18 17:11:41.131	{}	{e0ea0aaf-8c5e-448f-97a3-c5188ec89ee9,lang:en}
b755445e-192d-431d-8146-ba718275f229	f1db7e7b-1ad8-4994-9f9e-d27dc838b324	شركة توصيل بضائع محلي المتكاملة	ar-local-delivery-mlsahf7w0n2	نحن شركة متخصصة في تقديم خدمات توصيل بضائع محلي بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-e0ea0aaf-mlsahf7w0n2@demo.marketplace.com	+966972186050	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	VERIFIED	2026-02-18 17:11:41.135	\N	t	t	3.9	57	BASIC	2025-08-09 08:08:56.724	2026-02-18 17:11:41.137	{}	{e0ea0aaf-8c5e-448f-97a3-c5188ec89ee9,lang:ar}
4f48ede4-6a63-4389-a054-bfdc7a21316b	0e83bd4c-b390-41d3-8349-6719a8cc2006	Alpha Heavy Equipment Services	heavy-equipment-en-mlsahf82kbg	We are a professional Heavy Equipment service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-cfaf55d4-mlsahf82kbg@demo.marketplace.com	+18414526666	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	VERIFIED	2026-02-18 17:11:41.142	\N	t	t	4.4	44	PREMIUM	2026-01-19 14:19:37.008	2026-02-18 17:11:41.145	{}	{cfaf55d4-d957-4f91-9944-8e9262fa5c58,lang:en}
cd3cf8b8-5011-4597-92ab-b81d7e2127f8	33c25a72-7632-4d3c-90fa-00aa7cd55544	مركز نقل معدات ثقيلة المتكاملة	ar-heavy-equipment-mlsahf8a342	نحن شركة متخصصة في تقديم خدمات نقل معدات ثقيلة بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-cfaf55d4-mlsahf8a342@demo.marketplace.com	+966126469753	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	VERIFIED	2026-02-18 17:11:41.149	\N	t	f	3.7	30	FREE	2025-05-21 18:07:05.047	2026-02-18 17:11:41.151	{}	{cfaf55d4-d957-4f91-9944-8e9262fa5c58,lang:ar}
2ce6cdbd-f2fb-4ea4-83dc-2da67f1d2d4d	a417c192-16a3-47e2-83e2-6665269563fe	Prime AC Installation Co	ac-installation-en-mlsahf8g3aj	We are a professional AC Installation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-c5168990-mlsahf8g3aj@demo.marketplace.com	+13398968362	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:41.156	\N	t	t	4.3	71	BASIC	2025-08-03 22:02:01.787	2026-02-18 17:11:41.158	{}	{c5168990-ce7e-4c39-b9ac-8fbbe3bdefb0,lang:en}
00781c8f-bc9a-47f6-b525-9545a903bb63	04dc41ff-d4b6-472f-a5b1-ab83f6bb0cab	مؤسسة تركيب مكيفات المتخصصة	ar-ac-installation-mlsahf8nfit	نحن شركة متخصصة في تقديم خدمات تركيب مكيفات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-c5168990-mlsahf8nfit@demo.marketplace.com	+966808855462	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	VERIFIED	2026-02-18 17:11:41.161	\N	t	f	4.9	48	FREE	2026-01-15 12:25:23.561	2026-02-18 17:11:41.164	{}	{c5168990-ce7e-4c39-b9ac-8fbbe3bdefb0,lang:ar}
7c955564-d1a5-4e5a-b64a-f02e63f7badc	3dbacd10-e479-438b-8919-69dc2daf2ac7	Prime Electrical Wiring Services	electrical-wiring-en-mlsahf8siva	We are a professional Electrical Wiring service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-9ac120a7-mlsahf8siva@demo.marketplace.com	+18677344997	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	VERIFIED	2026-02-18 17:11:41.166	\N	t	f	4.2	66	FREE	2026-02-09 11:49:09.793	2026-02-18 17:11:41.17	{}	{9ac120a7-3f97-47fd-b5ee-619b7711dcf4,lang:en}
d1039413-edeb-4f08-890e-320fb6d86dfb	d7212165-de51-46ba-afd9-753bd7c8ad90	مجموعة تمديدات كهربائية المتخصصة	ar-electrical-wiring-mlsahf8zqlr	نحن شركة متخصصة في تقديم خدمات تمديدات كهربائية بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-9ac120a7-mlsahf8zqlr@demo.marketplace.com	+966491292252	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	VERIFIED	2026-02-18 17:11:41.174	\N	t	f	4.2	24	BASIC	2025-12-21 10:51:34.476	2026-02-18 17:11:41.176	{}	{9ac120a7-3f97-47fd-b5ee-619b7711dcf4,lang:ar}
ed60822f-ed25-4394-9b76-ba15c8c76a86	8753c12a-d43e-44bb-9aae-13a5979492a6	Prime Electrical Repairs Services	electrical-repairs-en-mlsahf95lly	We are a professional Electrical Repairs service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-8981ac1a-mlsahf95lly@demo.marketplace.com	+13991039460	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:41.18	\N	t	f	4.3	65	FREE	2025-06-21 06:11:30.541	2026-02-18 17:11:41.184	{}	{8981ac1a-f116-4694-898e-afda5de9b73c,lang:en}
25482fdb-e7b3-45cb-ab07-29c286eb994d	983459b2-b391-42c6-9a83-d49639abe660	شركة إصلاح أعطال كهرباء للخدمات	ar-electrical-repairs-mlsahf9ewed	نحن شركة متخصصة في تقديم خدمات إصلاح أعطال كهرباء بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-8981ac1a-mlsahf9ewed@demo.marketplace.com	+966601531176	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	VERIFIED	2026-02-18 17:11:41.188	\N	t	f	4.3	7	PREMIUM	2025-06-12 21:39:43.706	2026-02-18 17:11:41.191	{}	{8981ac1a-f116-4694-898e-afda5de9b73c,lang:ar}
e2da62b4-c1fa-49c2-8eb3-6b07dcc32ad7	fb2173ed-4557-472d-9997-8de481c985b7	Top Lighting Install Experts	lighting-install-en-mlsahf9jd1h	We are a professional Lighting Install service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-b18f064e-mlsahf9jd1h@demo.marketplace.com	+12749380028	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:41.194	\N	t	f	4.2	56	BASIC	2025-07-07 17:12:24.57	2026-02-18 17:11:41.197	{}	{b18f064e-30fd-4227-a6e0-94efae54d8f2,lang:en}
43fa3292-a248-4564-9791-cf18ca38fcb2	3e11f30c-114b-4aed-9ab6-533a20657d84	شركة تركيب إنارة الاحترافية	ar-lighting-install-mlsahf9rnx9	نحن شركة متخصصة في تقديم خدمات تركيب إنارة بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-b18f064e-mlsahf9rnx9@demo.marketplace.com	+966814205876	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:41.201	\N	t	f	4	7	FREE	2025-09-06 01:42:14.531	2026-02-18 17:11:41.203	{}	{b18f064e-30fd-4227-a6e0-94efae54d8f2,lang:ar}
3a4d2f33-c974-4e05-8e86-82431403299d	5997993f-b1a9-4d72-8bc2-17a4487dac76	Apex Generator Maintenance Solutions	generator-maintenance-en-mlsahf9weg7	We are a professional Generator Maintenance service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-4acb75e6-mlsahf9weg7@demo.marketplace.com	+19719456334	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:41.206	\N	t	f	4.6	35	PREMIUM	2025-04-19 04:07:56.164	2026-02-18 17:11:41.208	{}	{4acb75e6-2c26-4912-8857-867cc55d05ed,lang:en}
d5b6ca71-d945-431c-a2c8-72916db79ed7	b01ce7dd-86e3-4302-888c-c0c467c1b0fd	مجموعة صيانة مولدات المتكاملة	ar-generator-maintenance-mlsahfa1hqt	نحن شركة متخصصة في تقديم خدمات صيانة مولدات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-4acb75e6-mlsahfa1hqt@demo.marketplace.com	+966226330106	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:41.216	\N	t	f	3.6	39	BASIC	2025-08-08 12:02:17.496	2026-02-18 17:11:41.218	{}	{4acb75e6-2c26-4912-8857-867cc55d05ed,lang:ar}
efb84a07-f4d5-476b-ab69-77fa294a4cfe	da1a96a5-0238-41d0-83f5-92872e345ca7	Swift Solar Panel Install Partners	solar-panel-install-en-mlsahfabfc2	We are a professional Solar Panel Install service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-3d4fec38-mlsahfabfc2@demo.marketplace.com	+11859624577	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:41.221	\N	t	t	4.4	32	PREMIUM	2025-08-09 07:55:33.307	2026-02-18 17:11:41.223	{}	{3d4fec38-cbdd-45e0-8fab-73e5a05a1600,lang:en}
66d1c979-8b61-441e-a960-d43a69746cc1	55618e79-712e-4ee0-afdf-f96133bae7ba	مركز تركيب طاقة شمسية الاحترافية	ar-solar-panel-install-mlsahfai907	نحن شركة متخصصة في تقديم خدمات تركيب طاقة شمسية بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-3d4fec38-mlsahfai907@demo.marketplace.com	+966537976792	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:41.228	\N	t	f	4.5	23	FREE	2025-08-10 10:09:53.527	2026-02-18 17:11:41.231	{}	{3d4fec38-cbdd-45e0-8fab-73e5a05a1600,lang:ar}
81977324-132b-4161-aaf3-ed068b728680	6572478b-4699-4045-97e9-3043e273ae7a	Star Solar System Maint Partners	solar-system-maint-en-mlsahfaniub	We are a professional Solar System Maint service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-0def337f-mlsahfaniub@demo.marketplace.com	+12889900568	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:41.233	\N	t	t	4.8	27	FREE	2025-05-22 09:29:08.267	2026-02-18 17:11:41.235	{}	{0def337f-dd79-4734-9227-80c91e4a2bf9,lang:en}
6398cd5d-2a41-4378-9050-b2304b955c9f	80d940d2-4cce-4087-82bf-a2f46b047b95	مؤسسة صيانة طاقة شمسية المتميزة	ar-solar-system-maint-mlsahfatcsp	نحن شركة متخصصة في تقديم خدمات صيانة طاقة شمسية بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-0def337f-mlsahfatcsp@demo.marketplace.com	+966550906040	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	VERIFIED	2026-02-18 17:11:41.24	\N	t	t	4.8	31	PREMIUM	2026-01-08 06:18:19.842	2026-02-18 17:11:41.242	{}	{0def337f-dd79-4734-9227-80c91e4a2bf9,lang:ar}
16282096-7a49-4dc7-b55b-84b65db2e66c	fd7351e8-b72a-4648-aaed-9bf59e4521e5	Swift Electrical Panel Services	electrical-panel-en-mlsahfaz2jq	We are a professional Electrical Panel service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-38cb0fe6-mlsahfaz2jq@demo.marketplace.com	+13125279250	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	VERIFIED	2026-02-18 17:11:41.245	\N	t	f	3.9	64	FREE	2025-10-04 13:20:28.944	2026-02-18 17:11:41.247	{}	{38cb0fe6-bc94-4f20-b0ab-fc5ce125ec38,lang:en}
b539dd3d-a32a-4068-bce7-2bf31e4af6bc	d73ede55-b61a-4da1-a490-d3eb6af1087f	مؤسسة تركيب لوحات كهرباء الاحترافية	ar-electrical-panel-mlsahfb43rn	نحن شركة متخصصة في تقديم خدمات تركيب لوحات كهرباء بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-38cb0fe6-mlsahfb43rn@demo.marketplace.com	+966247702221	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:41.251	\N	t	t	4.1	32	BASIC	2025-07-25 16:08:56.956	2026-02-18 17:11:41.253	{}	{38cb0fe6-bc94-4f20-b0ab-fc5ce125ec38,lang:ar}
7e1f22b1-18e1-42ea-81f5-31cd32f40e2e	a2ed2291-7a9b-4198-87ee-8d0b75631494	Best Backup Power Systems Services	backup-power-systems-en-mlsahfba9as	We are a professional Backup Power Systems service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-c79261af-mlsahfba9as@demo.marketplace.com	+16399521828	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:41.257	\N	t	f	3.6	21	PREMIUM	2025-06-15 08:50:25.281	2026-02-18 17:11:41.259	{}	{c79261af-78c0-4b45-97b6-d918a3b015c0,lang:en}
97023076-6098-41ef-9072-93861483beaf	550a0c57-25aa-49be-bc07-ef7a7a2794e2	مركز أنظمة طاقة احتياطية المتميزة	ar-backup-power-systems-mlsahfbfrd4	نحن شركة متخصصة في تقديم خدمات أنظمة طاقة احتياطية بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-c79261af-mlsahfbfrd4@demo.marketplace.com	+966522591606	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	VERIFIED	2026-02-18 17:11:41.262	\N	t	f	4.8	56	PREMIUM	2025-09-21 11:32:39.791	2026-02-18 17:11:41.264	{}	{c79261af-78c0-4b45-97b6-d918a3b015c0,lang:ar}
34f0f49c-5de8-4fa3-9f9f-b6375e4fb892	5801db4f-b3b5-41e6-afe0-c73f239acdce	Top Leak Detection & Repair Services	leak-detection-repair-en-mlsahfblh57	We are a professional Leak Detection & Repair service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-b52de601-mlsahfblh57@demo.marketplace.com	+19037463768	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:41.268	\N	t	f	4.2	26	FREE	2025-03-24 18:05:02.545	2026-02-18 17:11:41.27	{}	{b52de601-ed5f-4be7-b531-55e4573892f1,lang:en}
d4167f0e-5c4f-402c-84f9-10abd58ba47e	f915186c-edab-4a8a-acd2-edc2670763c0	مؤسسة كشف وإصلاح تسربات المتخصصة	ar-leak-detection-repair-mlsahfbryge	نحن شركة متخصصة في تقديم خدمات كشف وإصلاح تسربات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-b52de601-mlsahfbryge@demo.marketplace.com	+966519114299	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	VERIFIED	2026-02-18 17:11:41.273	\N	t	t	4.6	40	BASIC	2025-10-23 15:02:39.201	2026-02-18 17:11:41.275	{}	{b52de601-ed5f-4be7-b531-55e4573892f1,lang:ar}
1b6e00d4-a95b-4336-bb78-4ae22f840849	95bc1e28-2fc9-446d-9ce4-9cd11b09de67	Prime Pipe Installation Experts	pipe-installation-en-mlsahfbwryv	We are a professional Pipe Installation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-6805a74f-mlsahfbwryv@demo.marketplace.com	+15010760897	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:41.278	\N	t	t	4.7	14	FREE	2025-07-16 22:26:20.844	2026-02-18 17:11:41.281	{}	{6805a74f-f7f9-419c-858f-49b99247e35b,lang:en}
16e7aafd-63ae-4739-818c-6775d2943489	6f4f34a3-766e-4794-8cc7-4fcaa5084007	مركز تمديد أنابيب الاحترافية	ar-pipe-installation-mlsahfc2zu1	نحن شركة متخصصة في تقديم خدمات تمديد أنابيب بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-6805a74f-mlsahfc2zu1@demo.marketplace.com	+966356946091	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	VERIFIED	2026-02-18 17:11:41.285	\N	t	f	3.9	19	BASIC	2025-12-14 16:51:14.354	2026-02-18 17:11:41.287	{}	{6805a74f-f7f9-419c-858f-49b99247e35b,lang:ar}
2675ce2b-6873-4bc0-9ac8-0f52910ae78e	51d69ec2-046e-468c-8506-82f81fc94d60	Best Water Heater Install Experts	water-heater-install-en-mlsahfc8d3m	We are a professional Water Heater Install service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-65ddaf4f-mlsahfc8d3m@demo.marketplace.com	+13495523048	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	VERIFIED	2026-02-18 17:11:41.29	\N	t	f	3.8	64	PREMIUM	2025-04-17 00:45:17.615	2026-02-18 17:11:41.292	{}	{65ddaf4f-5020-4a5f-bcde-d6bea9a519ac,lang:en}
6a8609ef-0b83-4336-a9b5-fad4d2619d77	71d79daa-c149-4dee-966a-f2c24d2f620b	مركز تركيب سخان مياه الاحترافية	ar-water-heater-install-mlsahfcdpr2	نحن شركة متخصصة في تقديم خدمات تركيب سخان مياه بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-65ddaf4f-mlsahfcdpr2@demo.marketplace.com	+966518047642	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:41.296	\N	t	t	4.8	28	FREE	2025-06-26 07:05:43.371	2026-02-18 17:11:41.298	{}	{65ddaf4f-5020-4a5f-bcde-d6bea9a519ac,lang:ar}
3afd3b72-25e7-4379-b84a-fdb040c998ea	eb8c2fe5-2d7e-454e-b752-2e8ed548101a	Prime Water Heater Repair Team	water-heater-repair-en-mlsahfcjf0c	We are a professional Water Heater Repair service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-487b84b5-mlsahfcjf0c@demo.marketplace.com	+13731663043	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:41.303	\N	t	f	4.7	36	FREE	2025-10-07 00:54:29.633	2026-02-18 17:11:41.306	{}	{487b84b5-be40-43ae-b5ed-96a494083762,lang:en}
7935018a-c7a3-4df3-9986-e57afcae9f4b	e317300a-0a9c-43f1-9f04-49a7c99d42ea	شركة صيانة سخان مياه المتخصصة	ar-water-heater-repair-mlsahfcvwxv	نحن شركة متخصصة في تقديم خدمات صيانة سخان مياه بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-487b84b5-mlsahfcvwxv@demo.marketplace.com	+966937220342	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:41.314	\N	t	t	4.6	5	FREE	2026-01-26 20:40:24.476	2026-02-18 17:11:41.317	{}	{487b84b5-be40-43ae-b5ed-96a494083762,lang:ar}
82b8b390-13ea-49d2-b07c-f4b7a99cd4e5	1ced8951-82e9-4386-b96b-21ab93c74846	Prime Bathroom Plumbing Services	bathroom-plumbing-en-mlsahfd3e22	We are a professional Bathroom Plumbing service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-bd693184-mlsahfd3e22@demo.marketplace.com	+14569333226	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:41.324	\N	t	t	4.1	66	FREE	2025-10-02 10:42:01.051	2026-02-18 17:11:41.327	{}	{bd693184-a710-441e-aa8b-d7c15901bac9,lang:en}
462c9021-d665-42db-aded-e36c96ca1aa4	dcfbc7e9-370a-4954-9fd0-e9038f6b050d	خبراء سباكة حمامات الاحترافية	ar-bathroom-plumbing-mlsahfdcajj	نحن شركة متخصصة في تقديم خدمات سباكة حمامات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-bd693184-mlsahfdcajj@demo.marketplace.com	+966272651208	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	VERIFIED	2026-02-18 17:11:41.332	\N	t	f	4.4	15	PREMIUM	2025-07-20 14:11:19.773	2026-02-18 17:11:41.334	{}	{bd693184-a710-441e-aa8b-d7c15901bac9,lang:ar}
cf3a51b7-a4e9-48af-a6c2-ffc377f7b0b7	b834ecd2-6349-47ff-9e63-5e3c2a3c0c1d	Expert Kitchen Plumbing Agency	kitchen-plumbing-en-mlsahfdl2yb	We are a professional Kitchen Plumbing service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-e9264c4c-mlsahfdl2yb@demo.marketplace.com	+19795713014	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:41.34	\N	t	f	3.9	22	FREE	2025-05-28 20:04:29.523	2026-02-18 17:11:41.343	{}	{e9264c4c-cd5f-4c68-acbd-e99f48182171,lang:en}
8f5bab24-c03c-47b4-b9f1-b76333a457d8	dfc80419-2af7-492e-90ae-1f33182fa61e	مركز سباكة مطابخ الاحترافية	ar-kitchen-plumbing-mlsahfdtcg8	نحن شركة متخصصة في تقديم خدمات سباكة مطابخ بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-e9264c4c-mlsahfdtcg8@demo.marketplace.com	+966350461806	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:41.352	\N	t	t	4.5	15	BASIC	2026-01-15 23:27:48.937	2026-02-18 17:11:41.354	{}	{e9264c4c-cd5f-4c68-acbd-e99f48182171,lang:ar}
9f0bb99d-b377-4718-ada2-fcb98f8a108d	1c9eafc8-b236-4230-86cf-53bc31844f4d	Pro Accounting Services Hub	accounting-services-en-mlsahfe5u6u	We are a professional Accounting Services service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-dd57d659-mlsahfe5u6u@demo.marketplace.com	+17479323023	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:41.36	\N	t	f	4.8	38	PREMIUM	2025-02-20 06:33:56.613	2026-02-18 17:11:41.362	{}	{dd57d659-e8bf-4a47-897c-1fb44c56a16d,lang:en}
760d7e02-176d-4ccd-8497-bfd2390a903a	f36cebb3-23f3-450f-9e02-e2aef07503a7	شركة خدمات محاسبية المتميزة	ar-accounting-services-mlsahfechxv	نحن شركة متخصصة في تقديم خدمات خدمات محاسبية بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-dd57d659-mlsahfechxv@demo.marketplace.com	+966370828774	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	VERIFIED	2026-02-18 17:11:41.367	\N	t	f	4.6	83	PREMIUM	2025-08-25 14:28:43.746	2026-02-18 17:11:41.369	{}	{dd57d659-e8bf-4a47-897c-1fb44c56a16d,lang:ar}
1d70545b-a9e9-44b5-b5d4-d1c84fe17fcc	e3bf7989-b3b1-4138-b7b1-47cf93b0954f	Alpha Legal Consultation Experts	legal-consultation-en-mlsahfeilpw	We are a professional Legal Consultation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-11552f47-mlsahfeilpw@demo.marketplace.com	+16397926397	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	VERIFIED	2026-02-18 17:11:41.374	\N	t	t	3.6	70	PREMIUM	2025-03-25 09:24:35.38	2026-02-18 17:11:41.377	{}	{11552f47-066a-4cad-b38a-2c74eed0bed4,lang:en}
dd824086-7e08-47fa-8ac4-240c841115ba	2b502400-6faf-4bc0-b414-9ad1d502b010	مركز استشارات قانونية الاحترافية	ar-legal-consultation-mlsahferrd4	نحن شركة متخصصة في تقديم خدمات استشارات قانونية بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-11552f47-mlsahferrd4@demo.marketplace.com	+966331477503	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:41.382	\N	t	f	3.6	68	BASIC	2025-06-03 09:32:24.789	2026-02-18 17:11:41.384	{}	{11552f47-066a-4cad-b38a-2c74eed0bed4,lang:ar}
86e2a771-6f26-434a-a863-43199a9badce	ce7f6c27-4226-4971-bc9b-665c6d76e0bc	Pro Photography Partners	photography-en-mlsahfexlg6	We are a professional Photography service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-deb10409-mlsahfexlg6@demo.marketplace.com	+11664514437	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	VERIFIED	2026-02-18 17:11:41.388	\N	t	t	4.6	16	FREE	2025-06-28 09:38:14.31	2026-02-18 17:11:41.391	{}	{deb10409-fb05-4a07-a0f4-dda54988cd52,lang:en}
610bdfb4-ab48-42f5-b1ef-577c8414cb7b	82e1639b-8b2b-43dd-abfb-31ca8cafd4ef	مركز تصوير احترافي المتميزة	ar-photography-mlsahff506w	نحن شركة متخصصة في تقديم خدمات تصوير احترافي بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-deb10409-mlsahff506w@demo.marketplace.com	+966162101619	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:41.396	\N	t	t	4.9	73	BASIC	2025-11-12 15:31:25.582	2026-02-18 17:11:41.399	{}	{deb10409-fb05-4a07-a0f4-dda54988cd52,lang:ar}
3280b972-80e1-4540-8ddb-1db39f616319	b9384a49-f030-4e35-bc81-6dbda9a09684	Alpha Drain Cleaning Team	drain-cleaning-en-mlsahffd9sr	We are a professional Drain Cleaning service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-5037cea3-mlsahffd9sr@demo.marketplace.com	+12436893678	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	VERIFIED	2026-02-18 17:11:41.406	\N	t	f	4.5	54	BASIC	2025-08-08 22:37:23.46	2026-02-18 17:11:41.409	{}	{5037cea3-0eba-4061-b365-33a8ce2b99e5,lang:en}
d3484f23-9dcc-4fac-895f-1042c989c45c	a40e94ad-8697-4e19-9061-c9066c447551	Expert Paid Ads Mgmt Team	paid-ads-mgmt-en-mlsahgru90j	We are a professional Paid Ads Mgmt service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-f4f9931a-mlsahgru90j@demo.marketplace.com	+13382441160	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:43.148	\N	t	f	3.5	66	FREE	2025-08-23 18:50:22.8	2026-02-18 17:11:43.15	{}	{f4f9931a-f98b-4d38-bb26-5cad9c963e15,lang:en}
3e50d263-e6ff-4dbd-a139-113a581946e8	f2fedc70-b1a1-44e2-b0df-fd61aafa1c01	مؤسسة تسليك مجاري للخدمات	ar-drain-cleaning-mlsahffngil	نحن شركة متخصصة في تقديم خدمات تسليك مجاري بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-5037cea3-mlsahffngil@demo.marketplace.com	+966367976693	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	VERIFIED	2026-02-18 17:11:41.414	\N	t	f	4.4	69	BASIC	2025-02-25 00:03:18.617	2026-02-18 17:11:41.416	{}	{5037cea3-0eba-4061-b365-33a8ce2b99e5,lang:ar}
aa6f63e6-053e-4b2f-a967-05e4bece4cd8	2b28d76a-9e08-4819-b3db-494d3225b003	Apex Water Tank Install Group	water-tank-install-en-mlsahffutcn	We are a professional Water Tank Install service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-a536318f-mlsahffutcn@demo.marketplace.com	+17636635328	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:41.422	\N	t	f	4	73	FREE	2025-09-19 13:54:47.895	2026-02-18 17:11:41.424	{}	{a536318f-3dd6-4a64-ab44-cd425b104b2e,lang:en}
f5175355-dce8-4a72-b3e6-7d9c720384b9	6b72f3bc-4286-46bc-922f-da61137270f0	مؤسسة تركيب خزانات الاحترافية	ar-water-tank-install-mlsahfg2apj	نحن شركة متخصصة في تقديم خدمات تركيب خزانات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-a536318f-mlsahfg2apj@demo.marketplace.com	+966520889482	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	VERIFIED	2026-02-18 17:11:41.429	\N	t	f	3.7	7	PREMIUM	2025-03-01 10:05:50.972	2026-02-18 17:11:41.431	{}	{a536318f-3dd6-4a64-ab44-cd425b104b2e,lang:ar}
308140c9-2e67-4d07-bd24-9501fe8047f4	88e290d9-148a-4170-931a-15a3a406d534	Expert Pump Installation Team	pump-installation-en-mlsahfgbjg2	We are a professional Pump Installation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-dc97169e-mlsahfgbjg2@demo.marketplace.com	+17047566207	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	VERIFIED	2026-02-18 17:11:41.439	\N	t	f	4.4	26	BASIC	2025-09-22 14:08:48.247	2026-02-18 17:11:41.443	{}	{dc97169e-d2c7-4af6-93a5-5010ab9d86f0,lang:en}
c8802041-02e2-4d08-b7e5-e124e2da094a	5b951b65-6828-427c-addc-54325cadea26	مركز تركيب مضخات مياه المتخصصة	ar-pump-installation-mlsahfgkhjz	نحن شركة متخصصة في تقديم خدمات تركيب مضخات مياه بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-dc97169e-mlsahfgkhjz@demo.marketplace.com	+966874911417	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	VERIFIED	2026-02-18 17:11:41.449	\N	t	f	4.6	33	FREE	2025-07-02 07:11:52.284	2026-02-18 17:11:41.452	{}	{dc97169e-d2c7-4af6-93a5-5010ab9d86f0,lang:ar}
b282fcb0-cf27-4706-974e-808f0176c25e	02232b5c-571a-464c-b774-c5afc8212b65	Elite General Contractor Partners	general-contractor-en-mlsahfgtx40	We are a professional General Contractor service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-3905c75e-mlsahfgtx40@demo.marketplace.com	+19700780598	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:41.455	\N	t	f	4.9	26	BASIC	2025-12-23 05:49:43.482	2026-02-18 17:11:41.457	{}	{3905c75e-18d0-4ef1-b58a-d3e1a7ce5463,lang:en}
0965ae1a-1605-4774-a7dd-7f440443afcc	66190256-af93-4386-abb4-94f142d24eb4	مؤسسة مقاول عام المتخصصة	ar-general-contractor-mlsahfgyomw	نحن شركة متخصصة في تقديم خدمات مقاول عام بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-3905c75e-mlsahfgyomw@demo.marketplace.com	+966419250778	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:41.461	\N	t	f	4.4	70	FREE	2026-01-10 18:19:25.539	2026-02-18 17:11:41.464	{}	{3905c75e-18d0-4ef1-b58a-d3e1a7ce5463,lang:ar}
89af0e0e-cde5-4b54-8705-73ef1b41156c	dd3fd528-0178-430d-aad5-188e3d53f625	Prime Home Renovation Solutions	home-renovation-en-mlsahfh5r7l	We are a professional Home Renovation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-5c720069-mlsahfh5r7l@demo.marketplace.com	+15110553100	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	VERIFIED	2026-02-18 17:11:41.468	\N	t	f	5	68	BASIC	2025-08-10 20:00:42.419	2026-02-18 17:11:41.471	{}	{5c720069-74be-4ad8-807c-e064c1521c4f,lang:en}
75bd1156-26d4-40cf-96ca-fc526c6a7c8a	732b6f66-bfd3-45ed-9c1a-d971120c01a8	شركة ترميم منازل الاحترافية	ar-home-renovation-mlsahfhb89j	نحن شركة متخصصة في تقديم خدمات ترميم منازل بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-5c720069-mlsahfhb89j@demo.marketplace.com	+966842141243	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	VERIFIED	2026-02-18 17:11:41.477	\N	t	f	4.3	51	BASIC	2026-01-20 05:24:11.554	2026-02-18 17:11:41.48	{}	{5c720069-74be-4ad8-807c-e064c1521c4f,lang:ar}
5ab7c639-f1ff-4ff0-8496-8c46fac43433	7f7c2f75-cbd2-461e-8883-a5f148c457f6	Elite Kitchen Renovation Works	kitchen-renovation-en-mlsahfhltzt	We are a professional Kitchen Renovation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-47186941-mlsahfhltzt@demo.marketplace.com	+17704199011	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	VERIFIED	2026-02-18 17:11:41.484	\N	t	f	3.5	13	BASIC	2025-09-10 08:23:47.099	2026-02-18 17:11:41.486	{}	{47186941-ba55-49bd-97b8-2b54e376f36b,lang:en}
3fe71727-f104-4d95-84d1-b836919eb579	0c487a2d-e7e1-496b-a56b-719ef219ae0f	شركة تجديد مطابخ المتميزة	ar-kitchen-renovation-mlsahfhra38	نحن شركة متخصصة في تقديم خدمات تجديد مطابخ بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-47186941-mlsahfhra38@demo.marketplace.com	+966354388396	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:41.49	\N	t	f	5	42	FREE	2025-07-23 18:20:42.409	2026-02-18 17:11:41.493	{}	{47186941-ba55-49bd-97b8-2b54e376f36b,lang:ar}
7274d61a-b2bb-4633-80b7-015df0a7092b	f6b84167-90ce-4b83-9df5-624c50bbff51	Alpha Bathroom Renovation Solutions	bathroom-renovation-en-mlsahfhy8r5	We are a professional Bathroom Renovation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-5db5637c-mlsahfhy8r5@demo.marketplace.com	+16484560990	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	VERIFIED	2026-02-18 17:11:41.497	\N	t	f	4.7	11	FREE	2026-02-16 02:10:30.158	2026-02-18 17:11:41.499	{}	{5db5637c-2d55-46eb-b46b-6c5c9aa87a19,lang:en}
d2ddcb20-e851-400e-b1c4-b296e6fc7f25	36e5cd34-ca04-42fd-8b80-67379c4164ac	شركة تجديد حمامات للخدمات	ar-bathroom-renovation-mlsahfi45dz	نحن شركة متخصصة في تقديم خدمات تجديد حمامات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-5db5637c-mlsahfi45dz@demo.marketplace.com	+966307779045	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	VERIFIED	2026-02-18 17:11:41.503	\N	t	f	4	31	FREE	2025-07-14 20:56:16.185	2026-02-18 17:11:41.505	{}	{5db5637c-2d55-46eb-b46b-6c5c9aa87a19,lang:ar}
cb47b2f8-7ec3-4fa8-a3d9-84358ce5a182	c96a1db0-27bc-4a29-a43b-95d9f995e915	Apex Tile Installation Co	tile-installation-en-mlsahfiaynq	We are a professional Tile Installation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-eb3a5f87-mlsahfiaynq@demo.marketplace.com	+11068761329	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:41.508	\N	t	t	5	38	PREMIUM	2025-07-22 14:29:35.473	2026-02-18 17:11:41.51	{}	{eb3a5f87-d152-41c0-a704-4dd4f93ed87d,lang:en}
289b56ae-8cfc-4dad-a519-feec722ff419	de9773e3-3f99-4aae-bbf2-491288edf6f0	مؤسسة تركيب بلاط المتخصصة	ar-tile-installation-mlsahfiff01	نحن شركة متخصصة في تقديم خدمات تركيب بلاط بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-eb3a5f87-mlsahfiff01@demo.marketplace.com	+966178815753	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	VERIFIED	2026-02-18 17:11:41.513	\N	t	f	3.9	23	BASIC	2025-06-26 03:18:15.048	2026-02-18 17:11:41.515	{}	{eb3a5f87-d152-41c0-a704-4dd4f93ed87d,lang:ar}
8f8f8a22-50dc-4d90-83e1-6557cf20f4da	ddace876-6789-42c2-9f48-c4a99d8afb8b	Top Flooring Installation Agency	flooring-installation-en-mlsahfilll6	We are a professional Flooring Installation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-2e57b799-mlsahfilll6@demo.marketplace.com	+15333428965	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	VERIFIED	2026-02-18 17:11:41.52	\N	t	f	4.1	60	BASIC	2025-06-01 09:49:10.046	2026-02-18 17:11:41.522	{}	{2e57b799-12e9-40aa-9519-c462f5d458ba,lang:en}
d1b6710b-fabf-408f-9e6f-7c299cf5563b	7d87746e-cb49-444b-b1ee-08de26c8167f	مجموعة تركيب أرضيات المتميزة	ar-flooring-installation-mlsahfirmgo	نحن شركة متخصصة في تقديم خدمات تركيب أرضيات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-2e57b799-mlsahfirmgo@demo.marketplace.com	+966684564765	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:41.525	\N	t	f	4.2	71	BASIC	2025-02-23 17:28:09.602	2026-02-18 17:11:41.527	{}	{2e57b799-12e9-40aa-9519-c462f5d458ba,lang:ar}
c44535b9-5913-49fa-a944-c4cbddf2d1c3	73e51220-0138-4620-90f8-d81db2c1cd40	Best Gypsum Board Experts	gypsum-board-en-mlsahfivj55	We are a professional Gypsum Board service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-84885f89-mlsahfivj55@demo.marketplace.com	+13997923660	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:41.531	\N	t	f	3.8	58	BASIC	2025-12-13 20:49:49.781	2026-02-18 17:11:41.533	{}	{84885f89-be5a-4750-baac-92ce56f45288,lang:en}
eb6af15f-e0a6-4b20-825d-bd83be4bbefc	fa5b4290-8f69-4b54-98db-62bf60405727	مركز جبس بورد للخدمات	ar-gypsum-board-mlsahfj453y	نحن شركة متخصصة في تقديم خدمات جبس بورد بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-84885f89-mlsahfj453y@demo.marketplace.com	+966760747424	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:41.538	\N	t	t	4	45	FREE	2025-12-27 08:57:02.227	2026-02-18 17:11:41.54	{}	{84885f89-be5a-4750-baac-92ce56f45288,lang:ar}
99ce4f14-91be-4783-9a37-e01b968097d3	7e8f59dc-cc17-4b70-9bf8-e7fd5839d840	Prime Painting Services Hub	painting-services-en-mlsahfj977q	We are a professional Painting Services service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-e9fcae5a-mlsahfj977q@demo.marketplace.com	+13971330849	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	VERIFIED	2026-02-18 17:11:41.544	\N	t	t	3.8	20	PREMIUM	2025-08-25 21:23:36.623	2026-02-18 17:11:41.546	{}	{e9fcae5a-1a61-4f96-adca-e1bee96da919,lang:en}
e5728628-395a-4cf0-b71f-0948595302a7	4a53151a-df85-4799-9a5b-67ec65e6fd15	خبراء دهانات وديكور للخدمات	ar-painting-services-mlsahfjf09d	نحن شركة متخصصة في تقديم خدمات دهانات وديكور بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-e9fcae5a-mlsahfjf09d@demo.marketplace.com	+966407422332	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	VERIFIED	2026-02-18 17:11:41.55	\N	t	f	3.8	27	BASIC	2025-06-07 23:58:21.134	2026-02-18 17:11:41.552	{}	{e9fcae5a-1a61-4f96-adca-e1bee96da919,lang:ar}
7bd46297-b3e4-4aa0-87f4-c1c07a5dbbb1	11741cc1-cea6-44b8-9636-5b7cebf75be9	Elite Roofing Works	roofing-en-mlsahfjkunm	We are a professional Roofing service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-93ad7de3-mlsahfjkunm@demo.marketplace.com	+17845966354	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	VERIFIED	2026-02-18 17:11:41.555	\N	t	f	4.3	31	FREE	2026-02-03 23:49:25.514	2026-02-18 17:11:41.557	{}	{93ad7de3-d02d-47c7-9138-22daa3c2c0b4,lang:en}
ed111c42-cf54-4d3f-967e-a6ac18a90670	ebb5943d-7717-445f-8207-913f531440be	Star Post-Construction Solutions	post-construction-en-mlsahfljt8s	We are a professional Post-Construction service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-37316c32-mlsahfljt8s@demo.marketplace.com	+14286715367	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:41.626	\N	t	f	4.5	7	FREE	2025-07-14 20:15:25.089	2026-02-18 17:11:41.628	{}	{37316c32-bf7c-4282-87b9-78417ffb611d,lang:en}
30a65c78-8cd0-4a17-b51b-1ae6635c530a	15bb988b-f630-4fed-a6ed-b143ae5b963c	خبراء عزل أسطح المتخصصة	ar-roofing-mlsahfjrs1y	نحن شركة متخصصة في تقديم خدمات عزل أسطح بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-93ad7de3-mlsahfjrs1y@demo.marketplace.com	+966509196371	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:41.562	\N	t	f	3.7	43	FREE	2025-03-25 00:35:39.045	2026-02-18 17:11:41.565	{}	{93ad7de3-d02d-47c7-9138-22daa3c2c0b4,lang:ar}
7a6cd8ed-a957-430b-a43f-2c93eff894a5	623cf24f-8dea-4bba-b61e-52685553aead	Apex Concrete & Masonry Agency	concrete-masonry-en-mlsahfjxx3e	We are a professional Concrete & Masonry service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-5794040d-mlsahfjxx3e@demo.marketplace.com	+15812063852	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	VERIFIED	2026-02-18 17:11:41.568	\N	t	f	4.9	44	BASIC	2025-08-24 15:56:00.835	2026-02-18 17:11:41.57	{}	{5794040d-4834-4d81-a7c3-99d2f4d9383b,lang:en}
35fc1765-6c51-4136-a18e-611028e16383	2b309f45-938b-4bbf-ab8d-dfd03a6ae605	خبراء أعمال باطون وبناء المتخصصة	ar-concrete-masonry-mlsahfk3wci	نحن شركة متخصصة في تقديم خدمات أعمال باطون وبناء بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-5794040d-mlsahfk3wci@demo.marketplace.com	+966439489308	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:41.573	\N	t	t	4.1	70	PREMIUM	2025-07-10 03:13:24.06	2026-02-18 17:11:41.576	{}	{5794040d-4834-4d81-a7c3-99d2f4d9383b,lang:ar}
22957a3f-9615-4d10-977c-59f9b7eb57b6	cddeb485-1b3b-4b17-94b4-92bd322e316e	Prime Structural Repairs Team	structural-repairs-en-mlsahfk8c83	We are a professional Structural Repairs service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-c0e5b849-mlsahfk8c83@demo.marketplace.com	+17421952328	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	VERIFIED	2026-02-18 17:11:41.579	\N	t	t	3.7	37	BASIC	2026-01-23 01:50:52.05	2026-02-18 17:11:41.581	{}	{c0e5b849-e7e0-461d-a535-0e84d6d7f791,lang:en}
70d11366-d089-4d04-a541-ebfc7bcaf630	dbd5e625-e76f-4232-80b0-9086584f8d7a	مجموعة تدعيم إنشائي المتميزة	ar-structural-repairs-mlsahfke9sz	نحن شركة متخصصة في تقديم خدمات تدعيم إنشائي بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-c0e5b849-mlsahfke9sz@demo.marketplace.com	+966351703101	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	VERIFIED	2026-02-18 17:11:41.585	\N	t	f	3.5	10	FREE	2025-10-28 06:38:03.006	2026-02-18 17:11:41.587	{}	{c0e5b849-e7e0-461d-a535-0e84d6d7f791,lang:ar}
0ab5d49a-c195-419a-8ee1-041886e8de5a	b259d10b-b50b-4879-98c5-d490722d7215	Top Home Cleaning Co	home-cleaning-en-mlsahfkkkvm	We are a professional Home Cleaning service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-459e22dc-mlsahfkkkvm@demo.marketplace.com	+18921706102	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:41.59	\N	t	f	4.5	24	PREMIUM	2025-05-27 13:23:03.393	2026-02-18 17:11:41.592	{}	{459e22dc-d5aa-4f49-9284-d416e3201e34,lang:en}
0f154fc6-bb72-4bc6-b38b-74240667bdac	6bb3dd85-4c86-4f0d-b156-91ece787dff8	مؤسسة تنظيف منازل المتميزة	ar-home-cleaning-mlsahfkpkmx	نحن شركة متخصصة في تقديم خدمات تنظيف منازل بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-459e22dc-mlsahfkpkmx@demo.marketplace.com	+966658242340	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:41.595	\N	t	f	4.6	31	PREMIUM	2025-05-08 21:54:24.288	2026-02-18 17:11:41.597	{}	{459e22dc-d5aa-4f49-9284-d416e3201e34,lang:ar}
7af1f169-621f-466f-bf6b-2546723c856a	85526136-5e32-4690-981c-3aaf533a15c8	Swift Deep Cleaning Co	deep-cleaning-en-mlsahfkwz1h	We are a professional Deep Cleaning service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-b63a2fe5-mlsahfkwz1h@demo.marketplace.com	+17966349055	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	VERIFIED	2026-02-18 17:11:41.603	\N	t	f	4.5	56	BASIC	2025-02-22 14:43:41.622	2026-02-18 17:11:41.605	{}	{b63a2fe5-171f-4db4-95ee-b16a8210eb9d,lang:en}
8f41c3d3-ba8b-4a3b-b176-f150d1c848cd	560d034e-621b-49cd-98ff-8f74acbba2c9	مؤسسة تنظيف عميق الاحترافية	ar-deep-cleaning-mlsahfl2j50	نحن شركة متخصصة في تقديم خدمات تنظيف عميق بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-b63a2fe5-mlsahfl2j50@demo.marketplace.com	+966881296966	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	VERIFIED	2026-02-18 17:11:41.608	\N	t	t	4.8	71	PREMIUM	2025-07-28 01:55:33.446	2026-02-18 17:11:41.61	{}	{b63a2fe5-171f-4db4-95ee-b16a8210eb9d,lang:ar}
6f359150-fc77-47c6-aaa9-65d01b704ccf	d673fa62-c6a3-4c2b-88dd-7bb6e1e7f716	Top Office Cleaning Team	office-cleaning-en-mlsahfl7mhu	We are a professional Office Cleaning service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-fcd17d77-mlsahfl7mhu@demo.marketplace.com	+12530431680	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	VERIFIED	2026-02-18 17:11:41.615	\N	t	t	4	81	FREE	2025-04-15 20:36:36.568	2026-02-18 17:11:41.617	{}	{fcd17d77-74e4-4cec-83b1-12e99b00c62f,lang:en}
a4580c26-e5e8-48d5-aa8c-41a3f1c19685	c5b69370-8261-40f3-b78a-767cecbb952e	مجموعة تنظيف مكاتب المتخصصة	ar-office-cleaning-mlsahfleqk3	نحن شركة متخصصة في تقديم خدمات تنظيف مكاتب بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-fcd17d77-mlsahfleqk3@demo.marketplace.com	+966832165955	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	VERIFIED	2026-02-18 17:11:41.62	\N	t	f	4.5	72	PREMIUM	2025-08-16 18:48:40.38	2026-02-18 17:11:41.622	{}	{fcd17d77-74e4-4cec-83b1-12e99b00c62f,lang:ar}
6bf51628-afb6-4189-b7da-985324d34844	51ab4052-cc7a-437e-a705-25e88ad9f13b	خبراء تنظيف بعد البناء المتخصصة	ar-post-construction-mlsahflq51s	نحن شركة متخصصة في تقديم خدمات تنظيف بعد البناء بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-37316c32-mlsahflq51s@demo.marketplace.com	+966954838464	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:41.633	\N	t	f	4.2	55	PREMIUM	2025-05-13 11:11:00.493	2026-02-18 17:11:41.636	{}	{37316c32-bf7c-4282-87b9-78417ffb611d,lang:ar}
36d35dd1-b3be-4a15-bfa2-8dc574b8cb55	cba1c8e1-d0b2-47ae-8ba0-e833fb290fae	Pro Carpet Cleaning Partners	carpet-cleaning-en-mlsahflx6kq	We are a professional Carpet Cleaning service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-b51d67bd-mlsahflx6kq@demo.marketplace.com	+17889294838	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	VERIFIED	2026-02-18 17:11:41.641	\N	t	f	4.2	81	BASIC	2025-12-27 10:48:19.382	2026-02-18 17:11:41.644	{}	{b51d67bd-090c-4383-b27d-fc53244989af,lang:en}
bd41a365-8a8a-41fe-a953-3740e88c3133	c2653f93-6b22-4d7a-aa7a-c11919c048bf	مؤسسة تنظيف سجاد وموكيت المتخصصة	ar-carpet-cleaning-mlsahfm537i	نحن شركة متخصصة في تقديم خدمات تنظيف سجاد وموكيت بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-b51d67bd-mlsahfm537i@demo.marketplace.com	+966515663272	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	VERIFIED	2026-02-18 17:11:41.647	\N	t	f	4	56	PREMIUM	2025-08-15 19:59:08.937	2026-02-18 17:11:41.649	{}	{b51d67bd-090c-4383-b27d-fc53244989af,lang:ar}
85e149ef-d6a8-4106-91cc-785f6f25a6d1	30e1c34a-cb97-4658-9505-1aa33097d00f	Star Sofa Cleaning Hub	sofa-cleaning-en-mlsahfmax0x	We are a professional Sofa Cleaning service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-be163dd8-mlsahfmax0x@demo.marketplace.com	+14683157100	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:41.652	\N	t	f	4.9	67	BASIC	2025-12-15 15:01:00.163	2026-02-18 17:11:41.654	{}	{be163dd8-9324-47c1-b07a-3d727382acd4,lang:en}
6bd11f7b-bcb9-46bc-ae88-84f0fd1ff942	6a1fadd7-2902-4dcf-a978-11b57d364031	خبراء تنظيف كنب ومفروشات للخدمات	ar-sofa-cleaning-mlsahfmf2nb	نحن شركة متخصصة في تقديم خدمات تنظيف كنب ومفروشات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-be163dd8-mlsahfmf2nb@demo.marketplace.com	+966535740577	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	VERIFIED	2026-02-18 17:11:41.658	\N	t	t	3.8	7	BASIC	2025-08-23 08:50:42.068	2026-02-18 17:11:41.66	{}	{be163dd8-9324-47c1-b07a-3d727382acd4,lang:ar}
5d47d827-cd4d-4ed0-89e1-1febbe47194c	70bb61c6-ec8b-4148-b9ad-1442e20d1df1	Swift Window Cleaning Hub	window-cleaning-en-mlsahfml5rk	We are a professional Window Cleaning service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-70eeca24-mlsahfml5rk@demo.marketplace.com	+13307072030	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	VERIFIED	2026-02-18 17:11:41.664	\N	t	f	4.4	36	PREMIUM	2025-05-18 16:11:48.181	2026-02-18 17:11:41.666	{}	{70eeca24-013d-4546-9567-3b42927e8364,lang:en}
1b519422-1af3-4b55-a38f-cd5fdf791f7d	e5260403-5ddf-43b9-b3cc-1216ea2ac526	مركز تنظيف واجهات زجاجية المتميزة	ar-window-cleaning-mlsahfmraad	نحن شركة متخصصة في تقديم خدمات تنظيف واجهات زجاجية بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-70eeca24-mlsahfmraad@demo.marketplace.com	+966129549363	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:41.67	\N	t	f	4.3	72	PREMIUM	2025-08-05 02:49:27.111	2026-02-18 17:11:41.672	{}	{70eeca24-013d-4546-9567-3b42927e8364,lang:ar}
d1187765-d5c7-40d6-9a0a-e22e2bd8c0a6	6bf09618-37cb-43a7-aadf-abbaba5c288e	Star Water Tank Cleaning Agency	water-tank-cleaning-en-mlsahfmydju	We are a professional Water Tank Cleaning service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-0a715def-mlsahfmydju@demo.marketplace.com	+15565627810	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	VERIFIED	2026-02-18 17:11:41.677	\N	t	f	4.8	33	FREE	2026-01-06 15:25:02.993	2026-02-18 17:11:41.679	{}	{0a715def-3e28-46b5-b8e2-1d5e47af7730,lang:en}
5e819789-d702-4abf-bd69-3e7b72a0412f	eec71ed8-1f5b-4546-8293-259f3e016371	شركة تعقيم خزانات المياه المتكاملة	ar-water-tank-cleaning-mlsahfn33p0	نحن شركة متخصصة في تقديم خدمات تعقيم خزانات المياه بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-0a715def-mlsahfn33p0@demo.marketplace.com	+966586428253	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	VERIFIED	2026-02-18 17:11:41.682	\N	t	f	4.1	8	PREMIUM	2025-08-22 12:25:25.093	2026-02-18 17:11:41.684	{}	{0a715def-3e28-46b5-b8e2-1d5e47af7730,lang:ar}
76fea2d8-6da1-4c76-8647-5e962847314d	304baca0-32dd-41c3-a3c6-27b776ae8056	Best Disinfection Services Experts	disinfection-services-en-mlsahfnar6g	We are a professional Disinfection Services service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-2f34e68f-mlsahfnar6g@demo.marketplace.com	+19099987047	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	VERIFIED	2026-02-18 17:11:41.688	\N	t	f	3.6	61	BASIC	2025-06-22 00:54:56.656	2026-02-18 17:11:41.69	{}	{2f34e68f-344a-4a04-8ca5-0ef67fb6f5f7,lang:en}
001c489d-7183-4d62-9a52-8a4602169562	23633c6a-4af7-42ed-9540-d5cb8673052d	مركز خدمات تعقيم شامل المتخصصة	ar-disinfection-services-mlsahfnfew8	نحن شركة متخصصة في تقديم خدمات خدمات تعقيم شامل بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-2f34e68f-mlsahfnfew8@demo.marketplace.com	+966609636591	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:41.693	\N	t	f	4	9	BASIC	2025-07-06 10:11:14.34	2026-02-18 17:11:41.695	{}	{2f34e68f-344a-4a04-8ca5-0ef67fb6f5f7,lang:ar}
3e914277-9614-4a95-bfbb-71c7fafa8b24	de5962b7-21ea-425c-8a4c-8bca031b721f	Prime Furniture Moving Services	furniture-moving-en-mlsahfnl2km	We are a professional Furniture Moving service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-24ca6098-mlsahfnl2km@demo.marketplace.com	+19333586672	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	VERIFIED	2026-02-18 17:11:41.7	\N	t	f	4.7	68	BASIC	2025-12-03 08:30:01.679	2026-02-18 17:11:41.702	{}	{24ca6098-169b-46bb-993d-a130327b16f9,lang:en}
e22d0e3f-d272-4bd5-ba77-3d7db0c8f487	7fa673b5-f717-4f97-924f-c38cc9959b37	شركة نقل أثاث المتميزة	ar-furniture-moving-mlsahfnrvzl	نحن شركة متخصصة في تقديم خدمات نقل أثاث بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-24ca6098-mlsahfnrvzl@demo.marketplace.com	+966312924678	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	VERIFIED	2026-02-18 17:11:41.705	\N	t	f	3.5	76	BASIC	2025-11-02 04:26:03.367	2026-02-18 17:11:41.707	{}	{24ca6098-169b-46bb-993d-a130327b16f9,lang:ar}
2d555182-3150-4c2e-bb9b-20c984114ebb	599adaba-ef92-4bec-87d8-fc5642e56331	Expert House Moving Agency	house-moving-en-mlsahfnwrgh	We are a professional House Moving service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-a3529217-mlsahfnwrgh@demo.marketplace.com	+13756286076	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	VERIFIED	2026-02-18 17:11:41.711	\N	t	t	4.6	53	PREMIUM	2025-02-23 11:20:26.078	2026-02-18 17:11:41.713	{}	{a3529217-903e-4710-b70c-2b15b18ecaa7,lang:en}
6d6a400d-8ab9-441c-9f08-a8bf43393018	55c87b89-584e-4b83-b46b-9a20fd382c3a	مركز نقل منازل الاحترافية	ar-house-moving-mlsahfo2c3y	نحن شركة متخصصة في تقديم خدمات نقل منازل بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-a3529217-mlsahfo2c3y@demo.marketplace.com	+966744985657	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	VERIFIED	2026-02-18 17:11:41.717	\N	t	t	3.8	15	PREMIUM	2025-07-17 19:39:07.02	2026-02-18 17:11:41.719	{}	{a3529217-903e-4710-b70c-2b15b18ecaa7,lang:ar}
c60b3167-399d-4df1-adf0-272b3cd7fb1e	74c84929-6d74-417f-8d14-5d98f201e4ef	Swift Office Moving Works	office-moving-en-mlsahfo8xe0	We are a professional Office Moving service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-0cfccd84-mlsahfo8xe0@demo.marketplace.com	+14473424402	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:41.723	\N	t	f	4.6	68	PREMIUM	2025-07-14 04:56:41.198	2026-02-18 17:11:41.727	{}	{0cfccd84-7b2e-460a-9075-74f3d8dc4586,lang:en}
4fa10c90-7ead-4133-8b2f-263718b8903f	24372f8b-c1a0-4c13-9272-ad0a5f8dfba8	شركة نقل مكاتب وشركات المتميزة	ar-office-moving-mlsahfogz97	نحن شركة متخصصة في تقديم خدمات نقل مكاتب وشركات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-0cfccd84-mlsahfogz97@demo.marketplace.com	+966357271701	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:41.731	\N	t	f	5	76	BASIC	2025-06-26 05:15:33.564	2026-02-18 17:11:41.733	{}	{0cfccd84-7b2e-460a-9075-74f3d8dc4586,lang:ar}
e75aba0a-dccc-4665-ba21-908fdc6389ea	019f2231-8f94-4aba-b806-c2f389376389	Prime Packing Services Solutions	packing-services-en-mlsahfompxe	We are a professional Packing Services service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-0c79abc5-mlsahfompxe@demo.marketplace.com	+16572334707	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	VERIFIED	2026-02-18 17:11:41.736	\N	t	f	4.2	31	FREE	2025-09-28 22:52:42.632	2026-02-18 17:11:41.739	{}	{0c79abc5-cdde-4d82-8bb1-898d546fee4e,lang:en}
bb0ab996-f37b-4f98-b7c0-f6f569fbc8eb	27293b4f-f737-4d67-ab1c-5412e61eda8a	مؤسسة خدمات تغليف المتكاملة	ar-packing-services-mlsahfos7oi	نحن شركة متخصصة في تقديم خدمات خدمات تغليف بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-0c79abc5-mlsahfos7oi@demo.marketplace.com	+966908556256	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:41.743	\N	t	f	3.7	76	FREE	2026-01-26 04:25:22.495	2026-02-18 17:11:41.745	{}	{0c79abc5-cdde-4d82-8bb1-898d546fee4e,lang:ar}
f66dbc99-a6e9-4b07-a095-3d913631d3c3	992a85a6-c39e-4f67-b7c9-043b1b3e05e5	Best Storage Services Agency	storage-services-en-mlsahfoyhnq	We are a professional Storage Services service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-a42fec55-mlsahfoyhnq@demo.marketplace.com	+13013325076	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:41.748	\N	t	f	3.5	21	PREMIUM	2025-10-07 12:08:55.653	2026-02-18 17:11:41.75	{}	{a42fec55-2abc-4caa-856b-d80e4ac7ab45,lang:en}
6e8206d9-81e9-4857-b0a4-83f7baf099fb	52f38995-cf50-46e7-8c30-6bdfa2d7fd84	مجموعة خدمات تخزين الاحترافية	ar-storage-services-mlsahfp3x4z	نحن شركة متخصصة في تقديم خدمات خدمات تخزين بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-a42fec55-mlsahfp3x4z@demo.marketplace.com	+966234910775	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	VERIFIED	2026-02-18 17:11:41.754	\N	t	f	3.6	18	BASIC	2025-07-10 21:41:16.629	2026-02-18 17:11:41.757	{}	{a42fec55-2abc-4caa-856b-d80e4ac7ab45,lang:ar}
208442cb-7a2c-4497-a000-7e288a7a6a1e	52ce8591-9e6d-46f8-b2b2-f9400bbad8be	Elite Social Media Mgmt Experts	social-media-mgmt-en-mlsahfpawn8	We are a professional Social Media Mgmt service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-534cc6e7-mlsahfpawn8@demo.marketplace.com	+15334335225	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:41.761	\N	t	f	4.2	28	PREMIUM	2025-10-25 12:14:49.535	2026-02-18 17:11:41.763	{}	{534cc6e7-53c8-48c0-a34d-de3c0ebfeac8,lang:en}
3d7e2cac-87f8-45e0-9d66-ff3da58c4c48	26bb26e2-dd4a-4398-9126-230dbd586fb1	Swift Custom Furniture Co	custom-furniture-en-mlsahfrd4m5	We are a professional Custom Furniture service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-fa0319a9-mlsahfrd4m5@demo.marketplace.com	+18605667086	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	VERIFIED	2026-02-18 17:11:41.836	\N	t	f	3.5	43	PREMIUM	2025-03-11 11:16:01.066	2026-02-18 17:11:41.838	{}	{fa0319a9-a593-44fc-8248-8a7eb47b459e,lang:en}
b3ad0d82-b00c-47b0-8086-4e49c451d969	a417e5d5-f08c-436a-be39-952055b0cdb5	مجموعة إدارة صفحات سوشيال المتكاملة	ar-social-media-mgmt-mlsahfpgoyn	نحن شركة متخصصة في تقديم خدمات إدارة صفحات سوشيال بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-534cc6e7-mlsahfpgoyn@demo.marketplace.com	+966989378514	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	VERIFIED	2026-02-18 17:11:41.767	\N	t	t	4.8	19	FREE	2025-12-26 13:18:19.255	2026-02-18 17:11:41.77	{}	{534cc6e7-53c8-48c0-a34d-de3c0ebfeac8,lang:ar}
7a210d95-a94b-4503-9436-92d7d658deea	5205a222-6178-46a5-b554-2bf1ac7e141c	Pro Graphic Design Services	graphic-design-en-mlsahfpnfma	We are a professional Graphic Design service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-9f883a2f-mlsahfpnfma@demo.marketplace.com	+15495941892	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	VERIFIED	2026-02-18 17:11:41.774	\N	t	f	3.5	73	PREMIUM	2025-07-14 20:25:03.589	2026-02-18 17:11:41.776	{}	{9f883a2f-cae6-461b-91ce-d01c592774c3,lang:en}
de2d7934-f39e-4029-b0af-7f1757888431	4dd79df0-29c4-4c4f-ab42-8d1b7687af3c	مجموعة تصميم جرافيك للخدمات	ar-graphic-design-mlsahfptjvw	نحن شركة متخصصة في تقديم خدمات تصميم جرافيك بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-9f883a2f-mlsahfptjvw@demo.marketplace.com	+966867644210	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:41.78	\N	t	f	4.5	55	FREE	2025-06-04 12:56:07.084	2026-02-18 17:11:41.783	{}	{9f883a2f-cae6-461b-91ce-d01c592774c3,lang:ar}
39437dce-45d5-4b57-b5ec-e75f27f76cf5	4f6a8ca1-6ed2-47f8-b4c4-02b3acf0104f	Pro Branding & Identity Agency	branding-identity-en-mlsahfq06rn	We are a professional Branding & Identity service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-f684e579-mlsahfq06rn@demo.marketplace.com	+11599440781	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	VERIFIED	2026-02-18 17:11:41.787	\N	t	f	4.9	18	FREE	2025-07-04 20:14:32.29	2026-02-18 17:11:41.789	{}	{f684e579-7a25-44dc-a309-265dbfd1f2d2,lang:en}
4cabb6dd-8444-46c9-8b37-a3f51cd08864	0456fe2b-894b-4d44-825f-c1c975aaa6c1	مؤسسة هوية بصرية الاحترافية	ar-branding-identity-mlsahfq6726	نحن شركة متخصصة في تقديم خدمات هوية بصرية بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-f684e579-mlsahfq6726@demo.marketplace.com	+966844799597	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	VERIFIED	2026-02-18 17:11:41.792	\N	t	t	3.8	66	BASIC	2025-04-03 18:07:04.578	2026-02-18 17:11:41.795	{}	{f684e579-7a25-44dc-a309-265dbfd1f2d2,lang:ar}
d21cefda-955a-47fb-ac26-98de5dcab94b	0426459d-ebe8-4747-b1eb-da95ec2354e3	Swift 3D Visualization Agency	3d-visualization-en-mlsahfqc099	We are a professional 3D Visualization service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-e2e4e7b7-mlsahfqc099@demo.marketplace.com	+11757085486	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:41.799	\N	t	f	4.6	17	PREMIUM	2026-01-20 14:46:21.213	2026-02-18 17:11:41.801	{}	{e2e4e7b7-f108-4f74-a653-f52e0483fa40,lang:en}
b121db1d-2ad0-44cd-9393-05311a681373	5f1740a1-c00d-4a31-a25c-7fbf3027a69b	مؤسسة تصميم ثلاثي الأبعاد المتميزة	ar-3d-visualization-mlsahfqhu14	نحن شركة متخصصة في تقديم خدمات تصميم ثلاثي الأبعاد بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-e2e4e7b7-mlsahfqhu14@demo.marketplace.com	+966962517190	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:41.804	\N	t	f	4.6	10	BASIC	2025-05-07 09:19:28.289	2026-02-18 17:11:41.806	{}	{e2e4e7b7-f108-4f74-a653-f52e0483fa40,lang:ar}
ad4991db-2682-4332-94c8-80217934e7fa	b854a080-5f5c-4645-bc27-8173ffd3b5a7	Pro AC Repair Works	ac-repair-en-mlsahfqn1hi	We are a professional AC Repair service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-3d27de5e-mlsahfqn1hi@demo.marketplace.com	+12790494045	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:41.811	\N	t	f	4.8	55	PREMIUM	2025-09-17 10:07:45.508	2026-02-18 17:11:41.813	{}	{3d27de5e-9b46-4986-a1ca-06f0d477a2ba,lang:en}
4e68c823-ab32-4903-ba63-ec289e10152d	31f785ae-f4f8-4aa7-ac38-c6b3924dae15	شركة صيانة مكيفات للخدمات	ar-ac-repair-mlsahfqwn19	نحن شركة متخصصة في تقديم خدمات صيانة مكيفات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-3d27de5e-mlsahfqwn19@demo.marketplace.com	+966950813007	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:41.818	\N	t	t	4.3	75	FREE	2025-05-25 20:23:43.599	2026-02-18 17:11:41.82	{}	{3d27de5e-9b46-4986-a1ca-06f0d477a2ba,lang:ar}
560e943f-4bee-4eed-8053-de70ff89a22e	e36b910f-acaa-47b5-b1c3-49fe8676d5dc	Swift AC Maintenance Agency	ac-maintenance-en-mlsahfr201s	We are a professional AC Maintenance service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-9be45a5d-mlsahfr201s@demo.marketplace.com	+13637697443	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	VERIFIED	2026-02-18 17:11:41.825	\N	t	t	3.9	16	PREMIUM	2025-09-13 02:58:02.254	2026-02-18 17:11:41.827	{}	{9be45a5d-3632-4446-b3ac-818c1d4afbad,lang:en}
e018fabc-95f3-4377-8cce-02a4e7ca800d	2fef40bf-ddac-4918-ae81-0314fe9bbd8d	مؤسسة عقود صيانة للخدمات	ar-ac-maintenance-mlsahfr8g4r	نحن شركة متخصصة في تقديم خدمات عقود صيانة بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-9be45a5d-mlsahfr8g4r@demo.marketplace.com	+966142229373	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:41.83	\N	t	t	4.6	34	PREMIUM	2025-12-23 07:47:21.979	2026-02-18 17:11:41.832	{}	{9be45a5d-3632-4446-b3ac-818c1d4afbad,lang:ar}
aa0c046a-63ce-4f15-9406-2c2e50ab34ce	87409c3e-fc66-4c66-a5b6-d753fbfa40fa	خبراء تفصيل أثاث الاحترافية	ar-custom-furniture-mlsahfrjjmh	نحن شركة متخصصة في تقديم خدمات تفصيل أثاث بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-fa0319a9-mlsahfrjjmh@demo.marketplace.com	+966503883838	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:41.842	\N	t	f	4.9	72	PREMIUM	2025-03-10 17:36:54.806	2026-02-18 17:11:41.845	{}	{fa0319a9-a593-44fc-8248-8a7eb47b459e,lang:ar}
0122aad6-db4e-4d72-bb30-2f21ae1dc368	4aeaf680-084b-4d30-87ba-20da60e37af4	Expert Door Install & Repair Team	door-install-repair-en-mlsahfrq4zq	We are a professional Door Install & Repair service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-5fdddb70-mlsahfrq4zq@demo.marketplace.com	+15657238356	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	VERIFIED	2026-02-18 17:11:41.848	\N	t	t	3.8	39	BASIC	2025-05-26 15:09:38.749	2026-02-18 17:11:41.85	{}	{5fdddb70-8cc9-45bb-9560-72d5fb2a86e0,lang:en}
2393dd73-7578-441d-b3a7-d78ca27a401b	cb99234a-53e8-40c8-bfb3-d0b620377f43	مؤسسة تركيب وصيانة أبواب الاحترافية	ar-door-install-repair-mlsahfrw08q	نحن شركة متخصصة في تقديم خدمات تركيب وصيانة أبواب بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-5fdddb70-mlsahfrw08q@demo.marketplace.com	+966683745931	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	VERIFIED	2026-02-18 17:11:41.854	\N	t	f	4.8	19	PREMIUM	2025-06-22 23:18:18.397	2026-02-18 17:11:41.857	{}	{5fdddb70-8cc9-45bb-9560-72d5fb2a86e0,lang:ar}
cf1f569d-1c84-4521-a732-079e2b6feccd	8c6b4110-ed14-4a77-883a-5082235acc13	Swift Kitchen Cabinets Experts	kitchen-cabinets-en-mlsahfs1gss	We are a professional Kitchen Cabinets service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-995b2165-mlsahfs1gss@demo.marketplace.com	+18169387289	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	VERIFIED	2026-02-18 17:11:41.859	\N	t	f	4.1	22	FREE	2025-10-30 02:30:44.586	2026-02-18 17:11:41.862	{}	{995b2165-0444-4801-acca-dc5c3a566f2a,lang:en}
a4599160-f458-40f8-bfa1-7aaedde69e0a	b6341baa-9165-4b79-b78e-eab6cdb3c2d4	خبراء خزائن مطبخ المتكاملة	ar-kitchen-cabinets-mlsahfs7x2d	نحن شركة متخصصة في تقديم خدمات خزائن مطبخ بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-995b2165-mlsahfs7x2d@demo.marketplace.com	+966445056256	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	VERIFIED	2026-02-18 17:11:41.866	\N	t	f	4.3	17	PREMIUM	2026-02-01 02:50:56.731	2026-02-18 17:11:41.868	{}	{995b2165-0444-4801-acca-dc5c3a566f2a,lang:ar}
ab51d599-3531-4acc-9124-04466a068f66	f2f9b28c-a583-465c-b993-27c921be404c	Expert Bedroom Wardrobes Services	bedroom-wardrobes-en-mlsahfsdi9t	We are a professional Bedroom Wardrobes service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-7f0933d0-mlsahfsdi9t@demo.marketplace.com	+11035259006	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	VERIFIED	2026-02-18 17:11:41.871	\N	t	t	4.1	38	BASIC	2025-12-30 17:53:01.604	2026-02-18 17:11:41.873	{}	{7f0933d0-c036-49ee-a498-62bb23e051fb,lang:en}
bf1ad3e6-8193-4330-9c44-021bf0c61b27	b82a1192-b0f4-40bf-9c3c-1eb5b1f754c1	خبراء خزائن ملابس المتكاملة	ar-bedroom-wardrobes-mlsahfsix9z	نحن شركة متخصصة في تقديم خدمات خزائن ملابس بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-7f0933d0-mlsahfsix9z@demo.marketplace.com	+966611491911	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:41.877	\N	t	f	4.8	16	PREMIUM	2025-08-25 04:06:16.419	2026-02-18 17:11:41.88	{}	{7f0933d0-c036-49ee-a498-62bb23e051fb,lang:ar}
bcd89386-2da6-4259-9f4e-e8f78c9104d0	b29d524d-f7ba-4106-9923-bad2f37922fb	Apex Wood Flooring Experts	wood-flooring-en-mlsahfspa6m	We are a professional Wood Flooring service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-a4f932f4-mlsahfspa6m@demo.marketplace.com	+16610212982	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:41.883	\N	t	f	3.6	57	FREE	2025-08-02 22:19:48.685	2026-02-18 17:11:41.886	{}	{a4f932f4-17e0-4e68-9a2c-1c0b2f054756,lang:en}
5c85f502-3a50-4108-bc4e-e846904cdcf1	d10fba07-dd0a-41d6-9453-92afd851f7c7	خبراء باركيه وأرضيات المتكاملة	ar-wood-flooring-mlsahfsvz48	نحن شركة متخصصة في تقديم خدمات باركيه وأرضيات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-a4f932f4-mlsahfsvz48@demo.marketplace.com	+966630383087	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:41.889	\N	t	f	4.6	48	FREE	2025-02-28 23:24:52.489	2026-02-18 17:11:41.891	{}	{a4f932f4-17e0-4e68-9a2c-1c0b2f054756,lang:ar}
59a99f60-12b8-4350-ba45-2aee0d957441	cbbb4212-5af6-4210-a81f-a9f3924e08de	Top Pergolas & Outdoor Partners	pergolas-outdoor-en-mlsahft2iqs	We are a professional Pergolas & Outdoor service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-a15ec8f6-mlsahft2iqs@demo.marketplace.com	+12701139013	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	VERIFIED	2026-02-18 17:11:41.896	\N	t	f	4.9	30	BASIC	2025-07-22 22:42:06.151	2026-02-18 17:11:41.898	{}	{a15ec8f6-c7e5-40bc-888c-5e6179104677,lang:en}
39f022c1-e60f-4f19-b114-42452caac274	39729ad2-543c-4f51-b8fb-3ef8bed48dd2	مؤسسة مظلات خشبية الاحترافية	ar-pergolas-outdoor-mlsahft7wbl	نحن شركة متخصصة في تقديم خدمات مظلات خشبية بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-a15ec8f6-mlsahft7wbl@demo.marketplace.com	+966245333926	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	VERIFIED	2026-02-18 17:11:41.902	\N	t	f	4.9	31	PREMIUM	2025-12-04 07:18:13.248	2026-02-18 17:11:41.904	{}	{a15ec8f6-c7e5-40bc-888c-5e6179104677,lang:ar}
d02f6fd4-c766-4581-8f8b-5e661af5d5ac	3b347bcd-896c-446d-8243-02b572287132	Apex Office Furniture Agency	office-furniture-en-mlsahftd9n8	We are a professional Office Furniture service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-5fa8962e-mlsahftd9n8@demo.marketplace.com	+15662658136	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	VERIFIED	2026-02-18 17:11:41.909	\N	t	f	4.7	12	FREE	2025-12-17 01:04:15.704	2026-02-18 17:11:41.911	{}	{5fa8962e-80f2-4550-bdfa-fe31d3b7d741,lang:en}
eeeb8e73-b683-4b63-a6c7-fc43a5ae1f6d	1d7a13c8-7aff-4c7e-9599-f2c6bb3e1a23	شركة أثاث مكتبي المتكاملة	ar-office-furniture-mlsahftk649	نحن شركة متخصصة في تقديم خدمات أثاث مكتبي بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-5fa8962e-mlsahftk649@demo.marketplace.com	+966615748372	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	VERIFIED	2026-02-18 17:11:41.915	\N	t	f	3.6	56	PREMIUM	2026-01-12 14:41:45.747	2026-02-18 17:11:41.917	{}	{5fa8962e-80f2-4550-bdfa-fe31d3b7d741,lang:ar}
0720cc8d-b49b-455f-8ddf-67bf5b8f7db1	80bf4274-7d6f-40b2-a14b-26cbc9828c37	Star Furniture Repair Co	furniture-repair-en-mlsahftr6wc	We are a professional Furniture Repair service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-372a27be-mlsahftr6wc@demo.marketplace.com	+12704490120	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	VERIFIED	2026-02-18 17:11:41.922	\N	t	f	3.9	61	PREMIUM	2025-05-20 07:33:22.326	2026-02-18 17:11:41.924	{}	{372a27be-f9b8-4e31-aa38-ca2366223d6d,lang:en}
3d6584af-a602-4403-a794-9cd68b297f24	aee91c4c-f77e-4644-adb0-fdd23482485d	مركز إصلاح أثاث المتميزة	ar-furniture-repair-mlsahftxq0z	نحن شركة متخصصة في تقديم خدمات إصلاح أثاث بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-372a27be-mlsahftxq0z@demo.marketplace.com	+966137675504	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	VERIFIED	2026-02-18 17:11:41.928	\N	t	f	3.8	76	PREMIUM	2025-08-16 05:51:14.484	2026-02-18 17:11:41.93	{}	{372a27be-f9b8-4e31-aa38-ca2366223d6d,lang:ar}
99f8d910-3332-49f2-ae8d-2b92c06e7116	b1d443a7-d4f3-4343-ae67-f244340f16c8	Star Equipment Transport Services	equipment-transport-en-mlsahfu37wh	We are a professional Equipment Transport service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-61452801-mlsahfu37wh@demo.marketplace.com	+18264159379	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:41.935	\N	t	t	3.7	35	PREMIUM	2026-02-15 09:20:30.804	2026-02-18 17:11:41.938	{}	{61452801-a110-4604-817d-a4374db967c0,lang:en}
80a987a7-eff0-4cd8-963d-2630ab6f1885	cbffea3f-5f7b-4d9b-8046-886a58fc9d9d	مؤسسة نقل معدات للخدمات	ar-equipment-transport-mlsahfuc5to	نحن شركة متخصصة في تقديم خدمات نقل معدات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-61452801-mlsahfuc5to@demo.marketplace.com	+966638217735	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:41.943	\N	t	f	4.4	41	FREE	2025-04-10 03:36:27.059	2026-02-18 17:11:41.946	{}	{61452801-a110-4604-817d-a4374db967c0,lang:ar}
acefc67b-e690-4b0d-ba62-8b64ab45ceaf	50a6c582-8a6f-443f-8ac4-862f172cae48	Pro Local Delivery Services	local-delivery-en-mlsahfuk998	We are a professional Local Delivery service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-e0ea0aaf-mlsahfuk998@demo.marketplace.com	+18777741972	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	VERIFIED	2026-02-18 17:11:41.951	\N	t	f	4.4	65	BASIC	2025-09-16 05:27:01.783	2026-02-18 17:11:41.953	{}	{e0ea0aaf-8c5e-448f-97a3-c5188ec89ee9,lang:en}
18028774-d085-40b7-b219-0fe274e61390	b51291ba-fb57-4e80-bc67-e4a0bae66c79	شركة توصيل بضائع محلي المتكاملة	ar-local-delivery-mlsahfuqblc	نحن شركة متخصصة في تقديم خدمات توصيل بضائع محلي بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-e0ea0aaf-mlsahfuqblc@demo.marketplace.com	+966714310491	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:41.957	\N	t	f	3.9	84	BASIC	2025-12-05 23:30:57.134	2026-02-18 17:11:41.959	{}	{e0ea0aaf-8c5e-448f-97a3-c5188ec89ee9,lang:ar}
635f9e01-6f25-4be6-b40c-30110f86fc3a	97fe3cd0-68fa-4ab8-9bc4-47a68f463ae6	Alpha Heavy Equipment Co	heavy-equipment-en-mlsahfuwsg1	We are a professional Heavy Equipment service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-cfaf55d4-mlsahfuwsg1@demo.marketplace.com	+17545593984	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:41.965	\N	t	t	4.6	23	PREMIUM	2025-04-20 01:27:28.671	2026-02-18 17:11:41.967	{}	{cfaf55d4-d957-4f91-9944-8e9262fa5c58,lang:en}
a6f6dc55-873c-4437-92fa-e340c3c08687	31f4de5f-b174-47fb-aeb8-26caae81d7c3	خبراء نقل معدات ثقيلة الاحترافية	ar-heavy-equipment-mlsahfv5tcm	نحن شركة متخصصة في تقديم خدمات نقل معدات ثقيلة بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-cfaf55d4-mlsahfv5tcm@demo.marketplace.com	+966366324954	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	VERIFIED	2026-02-18 17:11:41.971	\N	t	f	4.5	65	FREE	2025-09-03 07:50:07.97	2026-02-18 17:11:41.973	{}	{cfaf55d4-d957-4f91-9944-8e9262fa5c58,lang:ar}
69659b35-a79d-4fa0-8dac-157a2d08e764	7837921f-19eb-45ca-b1bd-b6365dd40651	Elite IT Support Experts	it-support-en-mlsahfvbvnh	We are a professional IT Support service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-145dab2a-mlsahfvbvnh@demo.marketplace.com	+14161699530	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:41.979	\N	t	f	4.1	65	FREE	2025-08-03 18:06:24.093	2026-02-18 17:11:41.981	{}	{145dab2a-0441-446c-978b-42b317a37707,lang:en}
4dbedd3c-9b20-4071-b03f-c6c40b3b584e	cf347d27-93e3-43b9-a573-a53ab5c3f696	Expert Landscape Design Works	landscape-design-en-mlsahfxfuf9	We are a professional Landscape Design service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-9e64837b-mlsahfxfuf9@demo.marketplace.com	+13642100178	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:42.054	\N	t	t	4.3	55	BASIC	2025-06-05 20:20:19.068	2026-02-18 17:11:42.056	{}	{9e64837b-ee22-4570-b1f2-9c6c938107ea,lang:en}
c06f7a05-df7f-4b92-8dba-084d6c56a48d	6512b42a-a776-4b03-9f6c-b9ba71097284	مجموعة دعم فني وتقني الاحترافية	ar-it-support-mlsahfviow3	نحن شركة متخصصة في تقديم خدمات دعم فني وتقني بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-145dab2a-mlsahfviow3@demo.marketplace.com	+966708831434	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:41.984	\N	t	f	3.6	29	FREE	2025-04-20 06:37:01.738	2026-02-18 17:11:41.986	{}	{145dab2a-0441-446c-978b-42b317a37707,lang:ar}
ab8804fa-6ee0-4290-b33f-9c8e3ee8f6c0	678941d1-898c-494e-97ed-0ddec9844990	Best Content Creation Group	content-creation-en-mlsahfvoy9x	We are a professional Content Creation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-96e8b578-mlsahfvoy9x@demo.marketplace.com	+15936631307	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	VERIFIED	2026-02-18 17:11:41.991	\N	t	f	4.8	9	FREE	2025-09-27 05:06:52.514	2026-02-18 17:11:41.993	{}	{96e8b578-f00f-46c4-b0bc-9997bf549722,lang:en}
fbd53942-84b9-465d-8875-ac88f6f0733f	f78fe74c-0154-4073-b86d-92bbbecc5170	خبراء صناعة محتوى المتكاملة	ar-content-creation-mlsahfvvggz	نحن شركة متخصصة في تقديم خدمات صناعة محتوى بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-96e8b578-mlsahfvvggz@demo.marketplace.com	+966172506937	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:41.998	\N	t	f	4.5	78	BASIC	2025-05-30 13:32:54.135	2026-02-18 17:11:42	{}	{96e8b578-f00f-46c4-b0bc-9997bf549722,lang:ar}
6732dc6e-f1c2-451f-95c1-da86870542c4	41d6ed8b-3890-4632-9b66-fe03c8d93c67	Top Tax Consultation Agency	tax-consultation-en-mlsahfw0nb2	We are a professional Tax Consultation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-8ad81af4-mlsahfw0nb2@demo.marketplace.com	+12672000729	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:42.004	\N	t	f	4.6	64	BASIC	2025-11-16 18:02:06.433	2026-02-18 17:11:42.006	{}	{8ad81af4-5eeb-4433-8c16-382b0653f1c2,lang:en}
81b85a8d-b536-4c93-b9d6-ed22a44d1639	744cb174-1d85-4ab7-b2bc-b4b41b6218cb	مجموعة استشارات ضريبية للخدمات	ar-tax-consultation-mlsahfw72p8	نحن شركة متخصصة في تقديم خدمات استشارات ضريبية بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-8ad81af4-mlsahfw72p8@demo.marketplace.com	+966541967100	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	VERIFIED	2026-02-18 17:11:42.01	\N	t	f	3.7	80	PREMIUM	2025-03-07 18:30:04.753	2026-02-18 17:11:42.013	{}	{8ad81af4-5eeb-4433-8c16-382b0653f1c2,lang:ar}
44a44696-0ba1-44a6-b2d3-4f51edb81e65	902b6a26-308f-41d7-8cb2-f0bb9f4b4dc1	Swift Company Registration Solutions	company-registration-en-mlsahfwegex	We are a professional Company Registration service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-c578b972-mlsahfwegex@demo.marketplace.com	+12663319601	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	VERIFIED	2026-02-18 17:11:42.017	\N	t	f	4	20	BASIC	2025-06-04 03:27:21.541	2026-02-18 17:11:42.019	{}	{c578b972-ee6e-4efe-b2df-37efe0fcacf8,lang:en}
34cc726c-169c-4cee-813b-a6843a82004d	00392931-c468-43aa-bbfd-64378ddebb02	خبراء تأسيس شركات للخدمات	ar-company-registration-mlsahfwkbhg	نحن شركة متخصصة في تقديم خدمات تأسيس شركات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-c578b972-mlsahfwkbhg@demo.marketplace.com	+966746046137	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	VERIFIED	2026-02-18 17:11:42.023	\N	t	f	3.6	16	PREMIUM	2025-11-09 23:55:52.882	2026-02-18 17:11:42.025	{}	{c578b972-ee6e-4efe-b2df-37efe0fcacf8,lang:ar}
1d1a101b-693f-4128-8229-38d18a746b24	d044fa29-032b-4968-96d4-3bdd482bc336	Apex Business Consulting Works	business-consulting-en-mlsahfwq6gi	We are a professional Business Consulting service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-4e4ff339-mlsahfwq6gi@demo.marketplace.com	+14075650655	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:42.028	\N	t	f	4.5	8	PREMIUM	2025-12-24 17:46:37.649	2026-02-18 17:11:42.031	{}	{4e4ff339-844e-4804-982c-c3e7e315be9e,lang:en}
c7b1349c-225f-4731-953e-d035f30c4a3a	a7b0d785-e0e5-4bd3-bcc5-d03fcf9746c0	خبراء استشارات أعمال المتخصصة	ar-business-consulting-mlsahfwxmtf	نحن شركة متخصصة في تقديم خدمات استشارات أعمال بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-4e4ff339-mlsahfwxmtf@demo.marketplace.com	+966615900931	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	VERIFIED	2026-02-18 17:11:42.036	\N	t	f	4.2	71	BASIC	2026-01-15 21:33:13.284	2026-02-18 17:11:42.038	{}	{4e4ff339-844e-4804-982c-c3e7e315be9e,lang:ar}
71be7c32-5a3e-4fa0-bc6b-d20053dadecc	f658f9e7-9683-4bbb-ab8e-f323099877a7	Apex Interior Design Co	interior-design-en-mlsahfx31bk	We are a professional Interior Design service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-85ecc7e5-mlsahfx31bk@demo.marketplace.com	+15085086778	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	VERIFIED	2026-02-18 17:11:42.041	\N	t	f	4.1	73	FREE	2025-05-15 05:00:52.037	2026-02-18 17:11:42.043	{}	{85ecc7e5-742e-4b3a-9d61-40c0e86a59c8,lang:en}
381ab95f-46e4-4bb3-a99f-4cbb41f1c771	9b88f737-b510-403c-897f-5d35539f107b	مركز تصميم داخلي المتخصصة	ar-interior-design-mlsahfx9g58	نحن شركة متخصصة في تقديم خدمات تصميم داخلي بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-85ecc7e5-mlsahfx9g58@demo.marketplace.com	+966671964802	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	VERIFIED	2026-02-18 17:11:42.048	\N	t	f	4.6	26	FREE	2025-11-21 14:01:25.627	2026-02-18 17:11:42.05	{}	{85ecc7e5-742e-4b3a-9d61-40c0e86a59c8,lang:ar}
f80c9512-59cb-4b3d-a3e2-921f6df0af70	279956bc-0203-4aea-915d-2931e18aa2d3	مؤسسة تصميم حدائق المتكاملة	ar-landscape-design-mlsahfxmtk3	نحن شركة متخصصة في تقديم خدمات تصميم حدائق بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-9e64837b-mlsahfxmtk3@demo.marketplace.com	+966697021032	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:42.062	\N	t	f	4.9	33	BASIC	2025-06-19 21:46:17.758	2026-02-18 17:11:42.064	{}	{9e64837b-ee22-4570-b1f2-9c6c938107ea,lang:ar}
068c7198-bb70-4d33-b799-0956ed37de40	1d58252d-f7a3-4952-a7a2-94ab4e6159c4	Alpha AC & HVAC Services	ac-hvac-en-mlsahfxu0w4	We are a professional AC & HVAC service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-a104b06f-mlsahfxu0w4@demo.marketplace.com	+16376665776	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:42.068	\N	t	f	4.4	38	FREE	2026-02-08 10:39:11.314	2026-02-18 17:11:42.07	{}	{a104b06f-1cb5-4e34-8567-e8c136ccf452,lang:en}
5e589249-09a1-4bc1-bf4d-add47e1a4220	67db029d-f7b5-476c-98ff-e6ba83897d59	مؤسسة تكييف وتبريد المتميزة	ar-ac-hvac-mlsahfy0hzr	نحن شركة متخصصة في تقديم خدمات تكييف وتبريد بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-a104b06f-mlsahfy0hzr@demo.marketplace.com	+966868301960	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	VERIFIED	2026-02-18 17:11:42.076	\N	t	f	3.7	29	FREE	2025-02-26 17:16:40.619	2026-02-18 17:11:42.078	{}	{a104b06f-1cb5-4e34-8567-e8c136ccf452,lang:ar}
37b6470d-fbe4-4701-935f-07a2b5369c90	0812d9a5-4d83-442c-b250-e18f58ec9535	Prime AC Installation Co	ac-installation-en-mlsahfy7yaw	We are a professional AC Installation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-c5168990-mlsahfy7yaw@demo.marketplace.com	+15412640780	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:42.082	\N	t	f	4.9	29	PREMIUM	2025-03-29 05:56:29.831	2026-02-18 17:11:42.084	{}	{c5168990-ce7e-4c39-b9ac-8fbbe3bdefb0,lang:en}
813716fd-b09d-4f6b-a0e6-572797a352bf	61421aa7-8466-4402-b210-216e05014fcd	شركة تركيب مكيفات المتميزة	ar-ac-installation-mlsahfycodg	نحن شركة متخصصة في تقديم خدمات تركيب مكيفات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-c5168990-mlsahfycodg@demo.marketplace.com	+966548447682	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	VERIFIED	2026-02-18 17:11:42.088	\N	t	f	3.5	35	FREE	2025-06-21 21:07:13.823	2026-02-18 17:11:42.091	{}	{c5168990-ce7e-4c39-b9ac-8fbbe3bdefb0,lang:ar}
200fbc66-4798-4025-a105-b80d7bb04616	8761e2ab-e9ce-4fe4-8ec7-9b5cfe9d4b3d	Elite AC Repair Team	ac-repair-en-mlsahfykdb6	We are a professional AC Repair service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-3d27de5e-mlsahfykdb6@demo.marketplace.com	+15467714331	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:42.094	\N	t	f	4.3	75	BASIC	2025-12-27 14:43:51.817	2026-02-18 17:11:42.097	{}	{3d27de5e-9b46-4986-a1ca-06f0d477a2ba,lang:en}
53530f99-1550-442c-8bd3-4a28ac2a2dad	6818a8fb-3894-4b5f-a3aa-d0d4500b249b	مجموعة صيانة مكيفات المتميزة	ar-ac-repair-mlsahfyqq4u	نحن شركة متخصصة في تقديم خدمات صيانة مكيفات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-3d27de5e-mlsahfyqq4u@demo.marketplace.com	+966975171165	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	VERIFIED	2026-02-18 17:11:42.102	\N	t	f	3.9	5	BASIC	2025-08-14 13:37:31.974	2026-02-18 17:11:42.104	{}	{3d27de5e-9b46-4986-a1ca-06f0d477a2ba,lang:ar}
4bce24ff-7515-41dd-9ffe-9e3188944fc3	87e5255a-5521-4adf-a22e-0ad606cea0a8	Swift AC Maintenance Partners	ac-maintenance-en-mlsahfyx0px	We are a professional AC Maintenance service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-9be45a5d-mlsahfyx0px@demo.marketplace.com	+13374600386	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:42.108	\N	t	f	4.1	57	PREMIUM	2025-10-22 11:10:59.355	2026-02-18 17:11:42.111	{}	{9be45a5d-3632-4446-b3ac-818c1d4afbad,lang:en}
2e93e99c-7690-4d84-8afa-78951732dcc0	f8478020-957e-4fb9-8332-a150ee6aed93	مركز عقود صيانة المتخصصة	ar-ac-maintenance-mlsahfz8l3o	نحن شركة متخصصة في تقديم خدمات عقود صيانة بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-9be45a5d-mlsahfz8l3o@demo.marketplace.com	+966457586477	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	VERIFIED	2026-02-18 17:11:42.124	\N	t	f	3.9	76	BASIC	2025-04-28 02:17:42.893	2026-02-18 17:11:42.127	{}	{9be45a5d-3632-4446-b3ac-818c1d4afbad,lang:ar}
4147cd2b-4d17-4519-a74e-bf6968c23a91	69052a48-eada-4001-8cef-b10b23c4d5fd	Swift Central AC Systems Experts	central-ac-systems-en-mlsahfzoep5	We are a professional Central AC Systems service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-e4b87995-mlsahfzoep5@demo.marketplace.com	+12221721737	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	VERIFIED	2026-02-18 17:11:42.138	\N	t	f	4.4	70	BASIC	2025-04-01 11:18:27.73	2026-02-18 17:11:42.141	{}	{e4b87995-9082-4431-b055-d53c0bea18ab,lang:en}
20629f71-3ee4-4131-8e7d-d29436f8743f	86e74ae4-2697-4f3c-b616-1612197f418f	مجموعة تكييف مركزي المتخصصة	ar-central-ac-systems-mlsahg02sy7	نحن شركة متخصصة في تقديم خدمات تكييف مركزي بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-e4b87995-mlsahg02sy7@demo.marketplace.com	+966203071030	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	VERIFIED	2026-02-18 17:11:42.153	\N	t	f	3.7	73	BASIC	2025-03-16 01:57:20.172	2026-02-18 17:11:42.155	{}	{e4b87995-9082-4431-b055-d53c0bea18ab,lang:ar}
83822060-fa86-43aa-83a9-7595a1c15b1e	74eefda0-1741-4026-ac95-a79f4ee494cb	Star Heating Repair Hub	heating-repair-en-mlsahg0f1i7	We are a professional Heating Repair service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-99d200f3-mlsahg0f1i7@demo.marketplace.com	+13264501028	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:42.165	\N	t	f	4.6	33	BASIC	2025-12-01 00:33:22.308	2026-02-18 17:11:42.168	{}	{99d200f3-6346-4394-b99e-f13bfcbf45b4,lang:en}
512932b0-f234-474c-9b48-dbc6e51aa32c	81cc9e9a-0738-41e9-92e8-7d041b2c808e	مؤسسة صيانة أنظمة تدفئة الاحترافية	ar-heating-repair-mlsahg0rfnp	نحن شركة متخصصة في تقديم خدمات صيانة أنظمة تدفئة بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-99d200f3-mlsahg0rfnp@demo.marketplace.com	+966602487757	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:42.177	\N	t	t	5	45	FREE	2025-02-26 08:33:20.114	2026-02-18 17:11:42.18	{}	{99d200f3-6346-4394-b99e-f13bfcbf45b4,lang:ar}
cb09e2a5-dd5d-4273-81b6-b0ae593b8248	05b816d7-8b53-4d98-8ca4-7e25c7df4344	Swift Duct Install & Cleaning Agency	duct-install-cleaning-en-mlsahg15p4c	We are a professional Duct Install & Cleaning service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-c51e73dc-mlsahg15p4c@demo.marketplace.com	+11341568575	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	VERIFIED	2026-02-18 17:11:42.19	\N	t	f	4	32	BASIC	2026-02-03 03:23:02.246	2026-02-18 17:11:42.193	{}	{c51e73dc-ef12-4653-9e28-09fad77b21fc,lang:en}
90d6e7e8-1920-4d24-b489-4372c6aef92e	458134c0-285b-4d41-a389-dbc326cdc5af	مؤسسة تركيب وتنظيف دكت المتميزة	ar-duct-install-cleaning-mlsahg1lspv	نحن شركة متخصصة في تقديم خدمات تركيب وتنظيف دكت بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-c51e73dc-mlsahg1lspv@demo.marketplace.com	+966131215627	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	VERIFIED	2026-02-18 17:11:42.208	\N	t	f	4.4	27	PREMIUM	2026-01-13 08:23:53.086	2026-02-18 17:11:42.211	{}	{c51e73dc-ef12-4653-9e28-09fad77b21fc,lang:ar}
6ad5c95d-da6f-4b89-8b80-0811224119ab	64221107-5dce-4f2d-96d2-e67f4afe062b	Elite Thermostat Install Partners	thermostat-install-en-mlsahg1xjox	We are a professional Thermostat Install service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-998ed8b1-mlsahg1xjox@demo.marketplace.com	+12475831537	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:42.215	\N	t	f	4	61	FREE	2026-01-11 08:05:23.575	2026-02-18 17:11:42.217	{}	{998ed8b1-59de-4c05-a4f1-318c4475145f,lang:en}
9d090842-4691-404b-9e0f-c5bf1425fa5f	70200c0f-8d8b-4132-84b8-c087435f1e6e	مركز تركيب ترموستات المتخصصة	ar-thermostat-install-mlsahg22o8c	نحن شركة متخصصة في تقديم خدمات تركيب ترموستات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-998ed8b1-mlsahg22o8c@demo.marketplace.com	+966249499479	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:42.221	\N	t	t	4.6	48	PREMIUM	2025-11-18 20:49:21.107	2026-02-18 17:11:42.223	{}	{998ed8b1-59de-4c05-a4f1-318c4475145f,lang:ar}
97f0f56b-53ac-4ff6-93e2-7945de174b86	88086409-4048-478c-8587-18ac3de9e3e2	Best Gas Refill Hub	gas-refill-en-mlsahg29sml	We are a professional Gas Refill service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-a2ff47e5-mlsahg29sml@demo.marketplace.com	+19403799867	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:42.228	\N	t	t	4.9	58	FREE	2025-06-20 05:59:14.374	2026-02-18 17:11:42.23	{}	{a2ff47e5-f2ed-41e1-867e-0345dc56eb6b,lang:en}
87674fa9-340b-442d-a3d3-6b8fcda6bcbb	b69eedd3-bf4a-40b9-aab0-732803622ce8	مؤسسة تعبئة غاز للخدمات	ar-gas-refill-mlsahg2fe5c	نحن شركة متخصصة في تقديم خدمات تعبئة غاز بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-a2ff47e5-mlsahg2fe5c@demo.marketplace.com	+966328026518	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:42.234	\N	t	f	4.9	25	PREMIUM	2025-12-07 16:14:21.427	2026-02-18 17:11:42.237	{}	{a2ff47e5-f2ed-41e1-867e-0345dc56eb6b,lang:ar}
eb9791bd-27bf-4947-90fc-08a8d0a7d9ad	60ba5e1a-d3b8-42c4-a9f8-377aeac92fda	Star HVAC Inspection Co	hvac-inspection-en-mlsahg2ron4	We are a professional HVAC Inspection service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-a9a06bd3-mlsahg2ron4@demo.marketplace.com	+15977630521	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	VERIFIED	2026-02-18 17:11:42.25	\N	t	f	4.3	44	FREE	2025-03-20 09:11:37.084	2026-02-18 17:11:42.254	{}	{a9a06bd3-95b8-4356-8ce3-c652f61f660b,lang:en}
cb32d88a-b2a9-49c6-9df0-9cf4f7c69712	594740a1-89a1-4830-ae86-a68d2c641653	خبراء فحص أنظمة التكييف للخدمات	ar-hvac-inspection-mlsahg35vmx	نحن شركة متخصصة في تقديم خدمات فحص أنظمة التكييف بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-a9a06bd3-mlsahg35vmx@demo.marketplace.com	+966474326364	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:42.26	\N	t	f	4.3	19	PREMIUM	2025-12-29 23:34:13.406	2026-02-18 17:11:42.262	{}	{a9a06bd3-95b8-4356-8ce3-c652f61f660b,lang:ar}
795022b8-e7da-474f-94e4-c00eff1e76be	e07bdb9f-85e8-4f62-b4ad-15aae616eb90	Alpha Carpentry Solutions	carpentry-en-mlsahg3c5fg	We are a professional Carpentry service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-9216b9d5-mlsahg3c5fg@demo.marketplace.com	+12615125527	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	VERIFIED	2026-02-18 17:11:42.268	\N	t	f	4.3	23	FREE	2026-01-28 07:47:55.39	2026-02-18 17:11:42.271	{}	{9216b9d5-8efb-4d0a-8d35-b5d47386c27f,lang:en}
6190d412-8890-4498-b8cf-7391ed517fb7	a1e4f4d5-15e8-48db-8841-2c8c9d1524ae	شركة نجارة المتميزة	ar-carpentry-mlsahg3kksi	نحن شركة متخصصة في تقديم خدمات نجارة بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-9216b9d5-mlsahg3kksi@demo.marketplace.com	+966844837184	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	VERIFIED	2026-02-18 17:11:42.275	\N	t	f	4.7	18	BASIC	2025-04-22 21:10:51.331	2026-02-18 17:11:42.277	{}	{9216b9d5-8efb-4d0a-8d35-b5d47386c27f,lang:ar}
016614d5-2697-4a39-8d8f-e4a42bba173c	cb2e751d-735f-4e7f-86d5-53b25e19edc7	Expert Custom Furniture Services	custom-furniture-en-mlsahg3q1r6	We are a professional Custom Furniture service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-fa0319a9-mlsahg3q1r6@demo.marketplace.com	+18539734677	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	VERIFIED	2026-02-18 17:11:42.281	\N	t	f	4.9	37	BASIC	2025-06-14 21:53:43.777	2026-02-18 17:11:42.283	{}	{fa0319a9-a593-44fc-8248-8a7eb47b459e,lang:en}
966bb61f-5097-4062-8362-4e9e47614de4	0d47f840-dabc-41cb-ac5e-fc93319b458e	شركة تفصيل أثاث المتميزة	ar-custom-furniture-mlsahg3wh1q	نحن شركة متخصصة في تقديم خدمات تفصيل أثاث بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-fa0319a9-mlsahg3wh1q@demo.marketplace.com	+966960700589	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	VERIFIED	2026-02-18 17:11:42.287	\N	t	f	3.6	14	FREE	2025-11-05 12:53:53.135	2026-02-18 17:11:42.289	{}	{fa0319a9-a593-44fc-8248-8a7eb47b459e,lang:ar}
ed62a2a8-cc6d-4271-a5de-fdeb5137831b	3dc2fee9-10f4-4e5d-809f-11bb5d9c592d	Star Door Install & Repair Agency	door-install-repair-en-mlsahg42aeb	We are a professional Door Install & Repair service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-5fdddb70-mlsahg42aeb@demo.marketplace.com	+12729428199	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	VERIFIED	2026-02-18 17:11:42.292	\N	t	f	4.4	9	BASIC	2025-08-25 08:59:48.742	2026-02-18 17:11:42.295	{}	{5fdddb70-8cc9-45bb-9560-72d5fb2a86e0,lang:en}
b73e766a-68bd-4d5a-b1b1-e38243a952c1	fbc4c376-26fe-44f4-b414-da327a9ea050	مجموعة تركيب وصيانة أبواب الاحترافية	ar-door-install-repair-mlsahg47srq	نحن شركة متخصصة في تقديم خدمات تركيب وصيانة أبواب بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-5fdddb70-mlsahg47srq@demo.marketplace.com	+966827928380	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	VERIFIED	2026-02-18 17:11:42.298	\N	t	t	4.6	14	PREMIUM	2025-09-16 17:38:04.841	2026-02-18 17:11:42.3	{}	{5fdddb70-8cc9-45bb-9560-72d5fb2a86e0,lang:ar}
d8b223f4-6b57-4227-86bd-7cacc14fb94e	dd22c5d6-72e9-48eb-9d62-722bcda284e0	Star Kitchen Cabinets Partners	kitchen-cabinets-en-mlsahg4d0m1	We are a professional Kitchen Cabinets service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-995b2165-mlsahg4d0m1@demo.marketplace.com	+13911860939	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:42.303	\N	t	t	3.9	53	FREE	2025-03-20 07:39:58.605	2026-02-18 17:11:42.305	{}	{995b2165-0444-4801-acca-dc5c3a566f2a,lang:en}
8d7d4f8d-c331-4b84-a5ef-d0aaf508ae3a	52fd6b3d-557d-4ffe-9afe-f9122050b05a	شركة خزائن مطبخ الاحترافية	ar-kitchen-cabinets-mlsahg4i9bt	نحن شركة متخصصة في تقديم خدمات خزائن مطبخ بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-995b2165-mlsahg4i9bt@demo.marketplace.com	+966369370545	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	VERIFIED	2026-02-18 17:11:42.309	\N	t	f	4.1	34	FREE	2025-09-27 21:37:00.012	2026-02-18 17:11:42.312	{}	{995b2165-0444-4801-acca-dc5c3a566f2a,lang:ar}
6be761c7-4cc4-478c-8fd9-59c3210175d4	469f23b3-ea37-4756-987d-c6963f032a02	Expert Bedroom Wardrobes Group	bedroom-wardrobes-en-mlsahg4oi8u	We are a professional Bedroom Wardrobes service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-7f0933d0-mlsahg4oi8u@demo.marketplace.com	+15274683084	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	VERIFIED	2026-02-18 17:11:42.315	\N	t	t	4.9	81	FREE	2025-12-02 01:31:12.202	2026-02-18 17:11:42.317	{}	{7f0933d0-c036-49ee-a498-62bb23e051fb,lang:en}
57b4f966-2443-43f1-ad25-a20bebf5b6cc	9139513e-aed2-4768-91c6-1288edb14468	شركة خزائن ملابس المتميزة	ar-bedroom-wardrobes-mlsahg4uloq	نحن شركة متخصصة في تقديم خدمات خزائن ملابس بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-7f0933d0-mlsahg4uloq@demo.marketplace.com	+966545781398	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:42.32	\N	t	f	4.2	62	BASIC	2026-02-10 08:09:47.56	2026-02-18 17:11:42.323	{}	{7f0933d0-c036-49ee-a498-62bb23e051fb,lang:ar}
8e23c46f-7184-4037-808e-fe28cf446f85	247feba4-3606-463b-a8d7-12e3bba429c0	Best Wood Flooring Agency	wood-flooring-en-mlsahg5043o	We are a professional Wood Flooring service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-a4f932f4-mlsahg5043o@demo.marketplace.com	+11510739253	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	VERIFIED	2026-02-18 17:11:42.328	\N	t	f	3.9	79	PREMIUM	2025-06-26 02:52:39.82	2026-02-18 17:11:42.331	{}	{a4f932f4-17e0-4e68-9a2c-1c0b2f054756,lang:en}
4473e3f0-93e7-41e7-99c9-6f06d96fc27f	44002ec2-47b4-46b3-9bb3-0fc1ac4a119e	مجموعة باركيه وأرضيات المتميزة	ar-wood-flooring-mlsahg573bh	نحن شركة متخصصة في تقديم خدمات باركيه وأرضيات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-a4f932f4-mlsahg573bh@demo.marketplace.com	+966844767117	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	VERIFIED	2026-02-18 17:11:42.334	\N	t	f	4.5	40	BASIC	2025-07-07 01:12:02.8	2026-02-18 17:11:42.336	{}	{a4f932f4-17e0-4e68-9a2c-1c0b2f054756,lang:ar}
a6b262fa-c8fa-4e31-a39b-95b855a45520	bde05142-5f96-438a-ae0f-74a929a6f2c9	Alpha Pergolas & Outdoor Group	pergolas-outdoor-en-mlsahg5d7mc	We are a professional Pergolas & Outdoor service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-a15ec8f6-mlsahg5d7mc@demo.marketplace.com	+12672527634	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:42.339	\N	t	f	4.1	31	PREMIUM	2026-01-03 18:21:44.443	2026-02-18 17:11:42.341	{}	{a15ec8f6-c7e5-40bc-888c-5e6179104677,lang:en}
cb1d55fa-850f-41f7-9ab6-78b03aff5848	86009149-d8af-4380-a5d5-20ae8ec252ff	Elite E-commerce Dev Team	e-commerce-dev-en-mlsahgbax0z	We are a professional E-commerce Dev service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-b2a5e338-mlsahgbax0z@demo.marketplace.com	+13428063718	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:42.553	\N	t	f	3.9	15	BASIC	2026-01-04 08:21:51.77	2026-02-18 17:11:42.555	{}	{b2a5e338-73ff-42a6-8dc3-b80d4e6fc5fc,lang:en}
e1cf69a3-48ee-4053-b96a-748d594d1d3b	27ad2a42-72e2-4388-8f41-5b59346ddfff	مؤسسة مظلات خشبية للخدمات	ar-pergolas-outdoor-mlsahg5i4aj	نحن شركة متخصصة في تقديم خدمات مظلات خشبية بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-a15ec8f6-mlsahg5i4aj@demo.marketplace.com	+966183528119	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:42.345	\N	t	f	3.8	25	BASIC	2025-05-01 11:00:08.853	2026-02-18 17:11:42.347	{}	{a15ec8f6-c7e5-40bc-888c-5e6179104677,lang:ar}
a1c5853a-bdcf-4679-8f72-9970a2eb57dc	203a79f6-b743-49a2-986b-6f5e9526eec1	Best Office Furniture Team	office-furniture-en-mlsahg5oiob	We are a professional Office Furniture service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-5fa8962e-mlsahg5oiob@demo.marketplace.com	+18629995936	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	VERIFIED	2026-02-18 17:11:42.351	\N	t	f	4.9	79	FREE	2025-09-08 21:19:03.6	2026-02-18 17:11:42.353	{}	{5fa8962e-80f2-4550-bdfa-fe31d3b7d741,lang:en}
f2fbad1f-d838-42bb-9b07-40ad7859bca7	4521d63e-91a8-48b6-8c79-c2d6e3e9c029	مؤسسة أثاث مكتبي المتكاملة	ar-office-furniture-mlsahg5u9hl	نحن شركة متخصصة في تقديم خدمات أثاث مكتبي بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-5fa8962e-mlsahg5u9hl@demo.marketplace.com	+966907993017	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	VERIFIED	2026-02-18 17:11:42.357	\N	t	f	3.8	49	FREE	2025-11-13 15:07:04.093	2026-02-18 17:11:42.359	{}	{5fa8962e-80f2-4550-bdfa-fe31d3b7d741,lang:ar}
6ac2d0ac-d030-4e13-ae8f-94fc3567fb25	66988cca-3788-41ba-83ef-5c77c68faff0	Top Furniture Repair Partners	furniture-repair-en-mlsahg60mjh	We are a professional Furniture Repair service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-372a27be-mlsahg60mjh@demo.marketplace.com	+19202484248	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	VERIFIED	2026-02-18 17:11:42.362	\N	t	f	4.1	64	BASIC	2025-04-27 19:02:35.943	2026-02-18 17:11:42.365	{}	{372a27be-f9b8-4e31-aa38-ca2366223d6d,lang:en}
2f3d5544-009d-4088-98f8-da7a20a63288	89a6cf7b-f972-455c-b457-681fe754f9a9	مجموعة إصلاح أثاث المتكاملة	ar-furniture-repair-mlsahg66qhk	نحن شركة متخصصة في تقديم خدمات إصلاح أثاث بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-372a27be-mlsahg66qhk@demo.marketplace.com	+966278655457	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	VERIFIED	2026-02-18 17:11:42.369	\N	t	f	3.8	19	BASIC	2025-08-24 23:29:48.882	2026-02-18 17:11:42.371	{}	{372a27be-f9b8-4e31-aa38-ca2366223d6d,lang:ar}
0e2145a4-ebda-4c07-98e3-ac590f0881b9	a2b0b46e-c3e1-43a0-bc7f-cff4527519ba	Apex IT Support Hub	it-support-en-mlsahg6de8p	We are a professional IT Support service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-bc71903c-mlsahg6de8p@demo.marketplace.com	+13878691977	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:42.375	\N	t	t	4.5	63	PREMIUM	2025-03-11 14:12:46.044	2026-02-18 17:11:42.377	{}	{bc71903c-a271-4a56-b90e-f94b041f684c,lang:en}
e4ca1aa5-c35f-4432-bcb8-cfc8b81618dc	e6b3c846-9a24-4cea-9fef-05ad205be29b	مجموعة دعم تقني للخدمات	ar-it-support-mlsahg6j2q1	نحن شركة متخصصة في تقديم خدمات دعم تقني بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-bc71903c-mlsahg6j2q1@demo.marketplace.com	+966160757293	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	VERIFIED	2026-02-18 17:11:42.381	\N	t	f	3.6	83	PREMIUM	2025-05-27 19:53:33.367	2026-02-18 17:11:42.383	{}	{bc71903c-a271-4a56-b90e-f94b041f684c,lang:ar}
84ac83df-d665-4e91-ad2b-f68745ee8ade	e6c502cd-084a-4714-ab7f-d970b68a36a3	Star IT Support Works	it-support-en-mlsahg6pxyb	We are a professional IT Support service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-145dab2a-mlsahg6pxyb@demo.marketplace.com	+16146723082	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	VERIFIED	2026-02-18 17:11:42.387	\N	t	f	3.7	25	FREE	2025-06-13 04:43:16.664	2026-02-18 17:11:42.389	{}	{145dab2a-0441-446c-978b-42b317a37707,lang:en}
44ecc5fc-6e1a-4ab2-8523-f8d304e05b33	ef84ebd6-e279-4151-89f9-4af43f9be931	خبراء دعم فني وتقني المتخصصة	ar-it-support-mlsahg6u9uq	نحن شركة متخصصة في تقديم خدمات دعم فني وتقني بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-145dab2a-mlsahg6u9uq@demo.marketplace.com	+966194911083	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:42.394	\N	t	f	3.6	29	PREMIUM	2025-07-22 12:22:46.817	2026-02-18 17:11:42.396	{}	{145dab2a-0441-446c-978b-42b317a37707,lang:ar}
ba7fd4bf-f566-44c4-baf3-734c86aa93b5	b91bf290-4420-4ff4-a951-fec0ac830d88	Top Network Installation Services	network-installation-en-mlsahg71hel	We are a professional Network Installation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-094e4723-mlsahg71hel@demo.marketplace.com	+19080485084	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	VERIFIED	2026-02-18 17:11:42.4	\N	t	f	4.3	80	BASIC	2025-05-04 21:15:19.336	2026-02-18 17:11:42.402	{}	{094e4723-4046-4698-a5e2-fe3cc59c3245,lang:en}
730e9485-519a-41a4-b27b-11ea03349b12	5dfdd78e-1a22-4541-8a51-0752afc5f3ce	شركة تمديد شبكات للخدمات	ar-network-installation-mlsahg77nq7	نحن شركة متخصصة في تقديم خدمات تمديد شبكات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-094e4723-mlsahg77nq7@demo.marketplace.com	+966241786372	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	VERIFIED	2026-02-18 17:11:42.407	\N	t	f	4.8	5	BASIC	2025-08-23 11:43:27.475	2026-02-18 17:11:42.409	{}	{094e4723-4046-4698-a5e2-fe3cc59c3245,lang:ar}
dc97938c-1acd-4233-a1d0-625ce41ce343	2fb40163-2ecc-4f2c-87ba-7ec3eafc9b27	Elite Business Group	business-en-mlsahgdhz7r	We are a professional Business service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-4ff97148-mlsahgdhz7r@demo.marketplace.com	+19970547518	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:42.631	\N	t	f	4.1	32	PREMIUM	2025-10-22 11:47:20.92	2026-02-18 17:11:42.633	{}	{4ff97148-cb5b-41af-b3b8-d69d88d126d9,lang:en}
99682135-cd57-481a-b030-c092849e8014	f5f7e31a-ac7c-41bc-952b-1ba70a650996	Prime Server Installation Agency	server-installation-en-mlsahg7efzi	We are a professional Server Installation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-86a76eb4-mlsahg7efzi@demo.marketplace.com	+13930321038	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	VERIFIED	2026-02-18 17:11:42.413	\N	t	f	4.9	82	FREE	2025-04-02 04:05:36.575	2026-02-18 17:11:42.416	{}	{86a76eb4-918a-4476-ad5c-b1f84fe9ec4a,lang:en}
18c5f96c-ccdd-40b1-89d5-37628c6fc959	f9619203-b83a-4963-83f6-4dbee638ecd9	خبراء تركيب سيرفرات الاحترافية	ar-server-installation-mlsahg7l4eh	نحن شركة متخصصة في تقديم خدمات تركيب سيرفرات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-86a76eb4-mlsahg7l4eh@demo.marketplace.com	+966327245433	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:42.419	\N	t	f	3.8	49	PREMIUM	2025-05-01 15:46:18.095	2026-02-18 17:11:42.422	{}	{86a76eb4-918a-4476-ad5c-b1f84fe9ec4a,lang:ar}
2d70465c-a02b-4732-9dd8-5e30cfa58d82	b8f1c024-3c33-452b-a4c8-1a2fa485de1e	Swift Server Maintenance Partners	server-maintenance-en-mlsahg7rm6u	We are a professional Server Maintenance service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-0908a7a2-mlsahg7rm6u@demo.marketplace.com	+15918579408	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	VERIFIED	2026-02-18 17:11:42.426	\N	t	f	4.9	12	BASIC	2026-01-15 06:30:40.579	2026-02-18 17:11:42.428	{}	{0908a7a2-ca8f-4190-8dee-a43331dd59c8,lang:en}
d32869a4-aa78-45ad-9287-72678a933df8	0470cafb-7b47-48ef-b420-dd2d953d44f8	شركة صيانة سيرفرات المتميزة	ar-server-maintenance-mlsahg7xxcl	نحن شركة متخصصة في تقديم خدمات صيانة سيرفرات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-0908a7a2-mlsahg7xxcl@demo.marketplace.com	+966606786997	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:42.431	\N	t	f	4.8	27	BASIC	2025-11-10 19:20:25.096	2026-02-18 17:11:42.433	{}	{0908a7a2-ca8f-4190-8dee-a43331dd59c8,lang:ar}
857a45e7-bc0f-4660-ad0c-3e7d5b48abcd	a0e92a88-80ef-4ac2-b126-86e0555445fd	Pro Hardware Repair Agency	hardware-repair-en-mlsahg84frq	We are a professional Hardware Repair service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-1b0eb73a-mlsahg84frq@demo.marketplace.com	+14619374980	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	VERIFIED	2026-02-18 17:11:42.439	\N	t	t	4.7	9	BASIC	2025-11-10 09:46:01.736	2026-02-18 17:11:42.441	{}	{1b0eb73a-0e17-4dfc-8299-1376df9f40e7,lang:en}
873cbb9a-c2da-424b-91b9-c8fac94b66c7	5f05f0d2-cea9-4818-b8b4-595b011b889e	مؤسسة صيانة أجهزة كمبيوتر للخدمات	ar-hardware-repair-mlsahg8ajve	نحن شركة متخصصة في تقديم خدمات صيانة أجهزة كمبيوتر بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-1b0eb73a-mlsahg8ajve@demo.marketplace.com	+966177770365	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	VERIFIED	2026-02-18 17:11:42.444	\N	t	f	3.6	44	PREMIUM	2025-08-13 23:53:57.419	2026-02-18 17:11:42.447	{}	{1b0eb73a-0e17-4dfc-8299-1376df9f40e7,lang:ar}
9c37b9b2-eb94-464f-941c-bfb0eb7f2f65	73eec17f-830b-4412-9a50-1b8083c40309	Prime Printer Setup Services	printer-setup-en-mlsahg8g7eo	We are a professional Printer Setup service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-6da456be-mlsahg8g7eo@demo.marketplace.com	+12918155831	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	VERIFIED	2026-02-18 17:11:42.451	\N	t	f	3.9	35	BASIC	2025-06-05 21:22:03.132	2026-02-18 17:11:42.453	{}	{6da456be-fbf2-4421-8140-0fd4efcc9edc,lang:en}
c59c78b8-1244-44e0-903d-cc744079c0e1	e3ea6219-1c9d-4400-8c36-a9f3d1ebc65c	مؤسسة تعريف طابعات المتكاملة	ar-printer-setup-mlsahg8m04r	نحن شركة متخصصة في تقديم خدمات تعريف طابعات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-6da456be-mlsahg8m04r@demo.marketplace.com	+966665124568	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	VERIFIED	2026-02-18 17:11:42.457	\N	t	f	3.9	50	FREE	2025-06-11 15:09:12.129	2026-02-18 17:11:42.459	{}	{6da456be-fbf2-4421-8140-0fd4efcc9edc,lang:ar}
99f7eb6a-c51a-4647-a977-d10c87e3f0bb	02732adb-e1d1-4099-af24-0d3655e4234d	Apex CCTV Integration Solutions	cctv-integration-en-mlsahg8scst	We are a professional CCTV Integration service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-7245e6a5-mlsahg8scst@demo.marketplace.com	+16182116171	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	VERIFIED	2026-02-18 17:11:42.463	\N	t	f	4.9	68	FREE	2025-07-03 19:58:25.473	2026-02-18 17:11:42.465	{}	{7245e6a5-a8fe-4f53-85ea-86ead7b76474,lang:en}
e7b59da2-7b13-4529-8321-ddfbd1baf23a	d8a4c58c-1755-456a-b36b-4c0c6d577523	مركز ربط كاميرات بالشبكة للخدمات	ar-cctv-integration-mlsahg8yis3	نحن شركة متخصصة في تقديم خدمات ربط كاميرات بالشبكة بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-7245e6a5-mlsahg8yis3@demo.marketplace.com	+966257670745	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	VERIFIED	2026-02-18 17:11:42.471	\N	t	f	3.7	77	PREMIUM	2026-01-25 15:59:41.101	2026-02-18 17:11:42.473	{}	{7245e6a5-a8fe-4f53-85ea-86ead7b76474,lang:ar}
57cfe1de-bf6a-4780-8e66-90f8dcc29f01	fe272144-94e3-4d54-a807-fd8e5ed0c20d	Elite Maintenance Contracts Hub	maintenance-contracts-en-mlsahg9649j	We are a professional Maintenance Contracts service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-6c3eb205-mlsahg9649j@demo.marketplace.com	+19279368888	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	VERIFIED	2026-02-18 17:11:42.478	\N	t	f	4.9	26	PREMIUM	2025-10-30 22:43:58.996	2026-02-18 17:11:42.48	{}	{6c3eb205-4e70-41d4-8bee-2c8af2adadd1,lang:en}
daefa5ab-c6d5-41aa-9a15-4c4164de4814	0a70a231-4b53-4a58-b68c-8b1247bd763e	مجموعة عقود صيانة دورية المتخصصة	ar-maintenance-contracts-mlsahg9dhyw	نحن شركة متخصصة في تقديم خدمات عقود صيانة دورية بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-6c3eb205-mlsahg9dhyw@demo.marketplace.com	+966887154274	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	VERIFIED	2026-02-18 17:11:42.484	\N	t	f	4.9	52	FREE	2025-07-15 02:11:24.595	2026-02-18 17:11:42.486	{}	{6c3eb205-4e70-41d4-8bee-2c8af2adadd1,lang:ar}
69164c45-aafc-4423-9638-1eeb5c92efff	92342dde-3b11-4cbf-befb-d23ce1f07627	Expert Data Recovery Co	data-recovery-en-mlsahg9j0zk	We are a professional Data Recovery service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-647011ed-mlsahg9j0zk@demo.marketplace.com	+16018192505	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	VERIFIED	2026-02-18 17:11:42.491	\N	t	f	4.6	26	PREMIUM	2025-07-28 18:32:19.9	2026-02-18 17:11:42.493	{}	{647011ed-6560-47ee-9091-7b129a07c9ae,lang:en}
e213a83a-6596-4cbb-9b32-45d4a0b6ab67	ebc6c8f7-41a4-4f44-82fd-814eca2cc908	مجموعة استعادة بيانات المتخصصة	ar-data-recovery-mlsahg9qhb4	نحن شركة متخصصة في تقديم خدمات استعادة بيانات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-647011ed-mlsahg9qhb4@demo.marketplace.com	+966110548820	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:42.497	\N	t	f	4.2	14	BASIC	2025-07-27 12:46:04.876	2026-02-18 17:11:42.499	{}	{647011ed-6560-47ee-9091-7b129a07c9ae,lang:ar}
5aaf548e-15ee-4020-b49a-f2bf50ea5ab2	72b76cc7-55b1-464e-bdf5-2b935e9926fc	Alpha Digital Services Works	digital-services-en-mlsahg9wpvk	We are a professional Digital Services service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-c800df55-mlsahg9wpvk@demo.marketplace.com	+16367203213	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	VERIFIED	2026-02-18 17:11:42.503	\N	t	f	4.1	38	FREE	2025-05-21 03:00:14.616	2026-02-18 17:11:42.505	{}	{c800df55-740a-4bf4-abcf-9fb8dc54aa85,lang:en}
bb1875a7-6ac8-4f9b-85dc-018c2cb20fcd	7dd08ad6-aeee-424b-8ab5-cb1c8c33342c	مؤسسة خدمات رقمية المتميزة	ar-digital-services-mlsahga20v0	نحن شركة متخصصة في تقديم خدمات خدمات رقمية بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-c800df55-mlsahga20v0@demo.marketplace.com	+966404242832	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	VERIFIED	2026-02-18 17:11:42.509	\N	t	f	4.6	55	FREE	2025-10-04 05:47:03.378	2026-02-18 17:11:42.511	{}	{c800df55-740a-4bf4-abcf-9fb8dc54aa85,lang:ar}
037a52fb-78af-4890-9919-4f6027aa92b4	06f83626-2292-4b41-90a9-e69568120694	Alpha Social Media Mgmt Group	social-media-mgmt-en-mlsahga84pf	We are a professional Social Media Mgmt service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-534cc6e7-mlsahga84pf@demo.marketplace.com	+14771292459	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	VERIFIED	2026-02-18 17:11:42.514	\N	t	f	4.7	82	PREMIUM	2025-11-08 21:14:39.149	2026-02-18 17:11:42.516	{}	{534cc6e7-53c8-48c0-a34d-de3c0ebfeac8,lang:en}
ffe649a5-165b-4d83-a023-9c7ec9c05f4e	a699c062-f277-443a-b65c-ee8e190076d7	مؤسسة إدارة صفحات سوشيال المتخصصة	ar-social-media-mgmt-mlsahgae3h8	نحن شركة متخصصة في تقديم خدمات إدارة صفحات سوشيال بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-534cc6e7-mlsahgae3h8@demo.marketplace.com	+966293447437	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	VERIFIED	2026-02-18 17:11:42.521	\N	t	f	4.3	81	FREE	2025-10-14 13:01:27.637	2026-02-18 17:11:42.523	{}	{534cc6e7-53c8-48c0-a34d-de3c0ebfeac8,lang:ar}
9b3bca6e-f117-418b-a990-8ad23a801ce0	37b45f0f-c74b-4ec8-ae1f-739bce39fe15	Star Content Creation Services	content-creation-en-mlsahgal3bq	We are a professional Content Creation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-96e8b578-mlsahgal3bq@demo.marketplace.com	+14915315712	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:42.528	\N	t	f	4.9	46	PREMIUM	2025-11-23 09:01:59.309	2026-02-18 17:11:42.53	{}	{96e8b578-f00f-46c4-b0bc-9997bf549722,lang:en}
0b9019d7-f29b-4569-bc03-b6302e3f3d0f	0824fd96-40b0-4a35-83d6-55394cf7eca7	مجموعة صناعة محتوى المتميزة	ar-content-creation-mlsahgar0lg	نحن شركة متخصصة في تقديم خدمات صناعة محتوى بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-96e8b578-mlsahgar0lg@demo.marketplace.com	+966666852993	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	VERIFIED	2026-02-18 17:11:42.534	\N	t	f	4.3	77	BASIC	2025-10-23 05:32:02.938	2026-02-18 17:11:42.536	{}	{96e8b578-f00f-46c4-b0bc-9997bf549722,lang:ar}
ed5c3f9c-68e2-44f9-91ff-0b6d4ee6ba2d	d4e1bab1-03b1-452c-b7a0-e7c7871d9928	Alpha Website Development Works	website-development-en-mlsahgayvsj	We are a professional Website Development service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-a58e3f12-mlsahgayvsj@demo.marketplace.com	+19828436743	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	VERIFIED	2026-02-18 17:11:42.541	\N	t	f	4.1	30	FREE	2025-05-25 14:21:14.631	2026-02-18 17:11:42.543	{}	{a58e3f12-ee73-4839-ada6-973b6de1db94,lang:en}
523ea909-ef4e-419c-b8a2-50f025852089	f85da087-3d66-4b01-9ca7-5d1baee8a1e7	مجموعة تصميم وتطوير مواقع المتميزة	ar-website-development-mlsahgb46lx	نحن شركة متخصصة في تقديم خدمات تصميم وتطوير مواقع بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-a58e3f12-mlsahgb46lx@demo.marketplace.com	+966598409034	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:42.547	\N	t	t	4.4	51	FREE	2026-01-11 04:10:37.237	2026-02-18 17:11:42.549	{}	{a58e3f12-ee73-4839-ada6-973b6de1db94,lang:ar}
5bf17a64-ba87-4a30-a387-47ca74ef2274	1d6a0f4e-faa2-48dd-9525-05f186bf89c0	مجموعة متاجر إلكترونية المتكاملة	ar-e-commerce-dev-mlsahgbg81u	نحن شركة متخصصة في تقديم خدمات متاجر إلكترونية بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-b2a5e338-mlsahgbg81u@demo.marketplace.com	+966118234424	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:42.56	\N	t	f	4.6	52	PREMIUM	2025-07-26 09:47:06.169	2026-02-18 17:11:42.563	{}	{b2a5e338-73ff-42a6-8dc3-b80d4e6fc5fc,lang:ar}
64aee47c-581b-412c-9d40-90998c54018f	842174c5-3e39-4bbd-905a-78bb52239079	Prime Mobile App Dev Team	mobile-app-dev-en-mlsahgbo4ok	We are a professional Mobile App Dev service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-9aa93818-mlsahgbo4ok@demo.marketplace.com	+17945940976	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	VERIFIED	2026-02-18 17:11:42.567	\N	t	f	4.9	44	FREE	2026-01-31 00:05:51.899	2026-02-18 17:11:42.569	{}	{9aa93818-7b3e-4196-b853-03648df182fb,lang:en}
fe56a934-cc7d-4006-9cee-a03f87a363af	68f8e694-adf1-4aa5-8c39-b0e981538f14	مركز تطبيقات موبايل المتخصصة	ar-mobile-app-dev-mlsahgbu6wp	نحن شركة متخصصة في تقديم خدمات تطبيقات موبايل بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-9aa93818-mlsahgbu6wp@demo.marketplace.com	+966909492224	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:42.573	\N	t	t	4.2	73	FREE	2026-02-02 06:12:38.369	2026-02-18 17:11:42.575	{}	{9aa93818-7b3e-4196-b853-03648df182fb,lang:ar}
de8218c5-828b-4ef6-aaac-61d06a4ceb5e	2d2e9dba-aefa-4cf0-9288-a4929088321d	Best UI/UX Design Experts	ui-ux-design-en-mlsahgc0cpg	We are a professional UI/UX Design service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-50187776-mlsahgc0cpg@demo.marketplace.com	+11169324882	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	VERIFIED	2026-02-18 17:11:42.579	\N	t	f	4.9	51	PREMIUM	2025-12-27 12:52:28.28	2026-02-18 17:11:42.582	{}	{50187776-a7e9-41bb-9d8f-8fcc73bf7eb0,lang:en}
8a5cb0e4-6eb2-4749-8166-98cf86e181ed	f5b85036-58db-4730-8d17-2aa8dce63c2b	مجموعة تصميم واجهات المستخدم المتكاملة	ar-ui-ux-design-mlsahgc6jl1	نحن شركة متخصصة في تقديم خدمات تصميم واجهات المستخدم بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-50187776-mlsahgc6jl1@demo.marketplace.com	+966788765279	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	VERIFIED	2026-02-18 17:11:42.585	\N	t	f	4.6	45	PREMIUM	2026-01-14 04:54:10.813	2026-02-18 17:11:42.587	{}	{50187776-a7e9-41bb-9d8f-8fcc73bf7eb0,lang:ar}
ec770c73-5bd7-47b7-af2a-281247dd18a7	f0a6b363-4455-47aa-8250-6c2338872a57	Expert Digital Marketing Works	digital-marketing-en-mlsahgccwkk	We are a professional Digital Marketing service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-d2c3038f-mlsahgccwkk@demo.marketplace.com	+11375194962	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	VERIFIED	2026-02-18 17:11:42.591	\N	t	f	4.9	41	FREE	2026-02-01 07:38:28.453	2026-02-18 17:11:42.593	{}	{d2c3038f-cc14-4e68-804e-03c1373cf56b,lang:en}
8d11bda8-3e97-46a2-a732-1eef7299fd35	4b9b2f13-70ad-4dd4-ba90-0c172ed55d7d	خبراء تسويق رقمي للخدمات	ar-digital-marketing-mlsahgcij9p	نحن شركة متخصصة في تقديم خدمات تسويق رقمي بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-d2c3038f-mlsahgcij9p@demo.marketplace.com	+966875896335	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:42.598	\N	t	f	5	43	FREE	2025-09-09 15:19:17.474	2026-02-18 17:11:42.601	{}	{d2c3038f-cc14-4e68-804e-03c1373cf56b,lang:ar}
0f59f64e-e4ed-424c-90cf-8ecbcb2829e4	284da8a7-59fc-4a36-bf56-53142735f062	Expert SEO Services Works	seo-services-en-mlsahgcqfmw	We are a professional SEO Services service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-ae53a59e-mlsahgcqfmw@demo.marketplace.com	+16864507593	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	VERIFIED	2026-02-18 17:11:42.605	\N	t	f	4.2	21	FREE	2025-08-25 18:10:43.871	2026-02-18 17:11:42.608	{}	{ae53a59e-003d-49e7-9e87-697ee990cc54,lang:en}
e7b903e6-bcf9-4d96-9c51-ed075af2b16a	4f34def0-b65d-4efb-b896-fdc919bc3888	شركة تحسين محركات البحث المتخصصة	ar-seo-services-mlsahgcx8n8	نحن شركة متخصصة في تقديم خدمات تحسين محركات البحث بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-ae53a59e-mlsahgcx8n8@demo.marketplace.com	+966442940491	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:42.611	\N	t	f	4.4	5	PREMIUM	2025-09-09 19:34:05.728	2026-02-18 17:11:42.613	{}	{ae53a59e-003d-49e7-9e87-697ee990cc54,lang:ar}
d7913930-213e-4ecd-91c4-774c50d49a67	f132742e-cb92-427a-8d43-0aa34115942e	Elite Paid Ads Mgmt Agency	paid-ads-mgmt-en-mlsahgd33gk	We are a professional Paid Ads Mgmt service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-f4f9931a-mlsahgd33gk@demo.marketplace.com	+17439390670	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:42.618	\N	t	t	4.5	30	PREMIUM	2025-08-18 13:07:08.217	2026-02-18 17:11:42.62	{}	{f4f9931a-f98b-4d38-bb26-5cad9c963e15,lang:en}
83ace95b-b592-4266-845d-b783ced6b417	b56c99a9-2784-4a7d-97b6-7dcf34ef7bd6	مجموعة إدارة حملات إعلانية المتميزة	ar-paid-ads-mgmt-mlsahgdbgdb	نحن شركة متخصصة في تقديم خدمات إدارة حملات إعلانية بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-f4f9931a-mlsahgdbgdb@demo.marketplace.com	+966686952379	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	VERIFIED	2026-02-18 17:11:42.625	\N	t	f	4.3	65	PREMIUM	2025-04-08 01:18:17.072	2026-02-18 17:11:42.627	{}	{f4f9931a-f98b-4d38-bb26-5cad9c963e15,lang:ar}
b5d2808d-e8d1-4ee9-831d-63a8422e6cfe	705ac7c7-51d3-4e41-a6ff-5b787b58134f	مؤسسة أعمال المتميزة	ar-business-mlsahgdne6v	نحن شركة متخصصة في تقديم خدمات أعمال بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-4ff97148-mlsahgdne6v@demo.marketplace.com	+966830720919	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	VERIFIED	2026-02-18 17:11:42.637	\N	t	f	4.9	41	BASIC	2025-12-13 06:40:25.389	2026-02-18 17:11:42.639	{}	{4ff97148-cb5b-41af-b3b8-d69d88d126d9,lang:ar}
b3940348-c883-48e5-8523-51119f810e66	e422a041-f75b-4228-a902-305cf80a1aae	Pro Accounting Services Agency	accounting-services-en-mlsahgdscc7	We are a professional Accounting Services service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-dd57d659-mlsahgdscc7@demo.marketplace.com	+14227397282	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	VERIFIED	2026-02-18 17:11:42.644	\N	t	f	3.8	5	PREMIUM	2025-03-18 17:49:48.686	2026-02-18 17:11:42.646	{}	{dd57d659-e8bf-4a47-897c-1fb44c56a16d,lang:en}
26ed7154-d466-43a7-868f-d2fdb6e4838b	09846831-1fdc-4d30-9998-7f54f54eaea7	مؤسسة خدمات محاسبية للخدمات	ar-accounting-services-mlsahgdzktj	نحن شركة متخصصة في تقديم خدمات خدمات محاسبية بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-dd57d659-mlsahgdzktj@demo.marketplace.com	+966329705946	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:42.651	\N	t	f	4.3	28	FREE	2025-12-05 01:01:11.335	2026-02-18 17:11:42.653	{}	{dd57d659-e8bf-4a47-897c-1fb44c56a16d,lang:ar}
7a5e4312-e38b-4cf9-ab96-fc31d16955b7	5bf4c7f8-f440-42fb-925c-ed31c0b02745	Swift Legal Consultation Co	legal-consultation-en-mlsahge6av5	We are a professional Legal Consultation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-11552f47-mlsahge6av5@demo.marketplace.com	+17330744218	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:42.657	\N	t	t	4.1	70	FREE	2025-04-10 10:49:34.597	2026-02-18 17:11:42.659	{}	{11552f47-066a-4cad-b38a-2c74eed0bed4,lang:en}
d86d53fa-7340-4141-ab8a-3abd03a7c76d	98149768-4d82-44c7-a516-7f8c22c4c216	مركز استشارات قانونية المتخصصة	ar-legal-consultation-mlsahgecp8w	نحن شركة متخصصة في تقديم خدمات استشارات قانونية بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-11552f47-mlsahgecp8w@demo.marketplace.com	+966415185649	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:42.663	\N	t	f	4.7	5	FREE	2025-07-15 15:18:39.284	2026-02-18 17:11:42.665	{}	{11552f47-066a-4cad-b38a-2c74eed0bed4,lang:ar}
23afb2f3-4459-41e7-9040-40d03bef0aad	befccf5f-2c82-4b96-9669-9202750df638	Star Tax Consultation Partners	tax-consultation-en-mlsahgei26m	We are a professional Tax Consultation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-8ad81af4-mlsahgei26m@demo.marketplace.com	+14272666557	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	VERIFIED	2026-02-18 17:11:42.668	\N	t	f	4.6	37	FREE	2026-02-12 16:23:12.07	2026-02-18 17:11:42.671	{}	{8ad81af4-5eeb-4433-8c16-382b0653f1c2,lang:en}
7dba23e6-eb3b-4b44-b5bd-f7c2934475bb	dea984e1-c198-4872-ad62-4b113e235d35	مجموعة استشارات ضريبية المتخصصة	ar-tax-consultation-mlsahgeox6p	نحن شركة متخصصة في تقديم خدمات استشارات ضريبية بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-8ad81af4-mlsahgeox6p@demo.marketplace.com	+966678089694	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:42.674	\N	t	f	4.1	73	PREMIUM	2025-07-18 04:58:50.168	2026-02-18 17:11:42.677	{}	{8ad81af4-5eeb-4433-8c16-382b0653f1c2,lang:ar}
cba6f6ee-4fde-4ca1-95fa-f566ed812c22	7b38ee51-d14c-4154-9cff-16e68022478e	Star Company Registration Experts	company-registration-en-mlsahgeux8s	We are a professional Company Registration service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-c578b972-mlsahgeux8s@demo.marketplace.com	+14004244920	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	VERIFIED	2026-02-18 17:11:42.681	\N	t	t	4.6	10	PREMIUM	2025-03-25 02:31:29.565	2026-02-18 17:11:42.683	{}	{c578b972-ee6e-4efe-b2df-37efe0fcacf8,lang:en}
d3224074-d2ce-4d8c-a01b-5305b16b0066	64cc5c67-bc20-460f-809c-8ce7b3c2cb9d	مؤسسة تأسيس شركات المتخصصة	ar-company-registration-mlsahgf0ebn	نحن شركة متخصصة في تقديم خدمات تأسيس شركات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-c578b972-mlsahgf0ebn@demo.marketplace.com	+966314736696	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:42.687	\N	t	f	4	27	PREMIUM	2025-05-31 07:32:57.706	2026-02-18 17:11:42.689	{}	{c578b972-ee6e-4efe-b2df-37efe0fcacf8,lang:ar}
8e9c61ef-3699-4ec4-8def-3b5507a2ba9e	12dfad0c-0622-4da1-9f63-4c423ea96f2a	Prime Business Consulting Services	business-consulting-en-mlsahgf70bu	We are a professional Business Consulting service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-4e4ff339-mlsahgf70bu@demo.marketplace.com	+17827183938	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	VERIFIED	2026-02-18 17:11:42.693	\N	t	f	4.1	60	FREE	2025-12-17 19:39:13.043	2026-02-18 17:11:42.696	{}	{4e4ff339-844e-4804-982c-c3e7e315be9e,lang:en}
09f6c7e6-0fb6-4462-b1fe-d2cc048436f3	228391ff-da15-4c2b-ad6e-09f1d9619413	مؤسسة استشارات أعمال المتكاملة	ar-business-consulting-mlsahgfcssd	نحن شركة متخصصة في تقديم خدمات استشارات أعمال بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-4e4ff339-mlsahgfcssd@demo.marketplace.com	+966637109810	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:42.7	\N	t	f	4.2	16	BASIC	2025-08-14 11:26:46.875	2026-02-18 17:11:42.702	{}	{4e4ff339-844e-4804-982c-c3e7e315be9e,lang:ar}
b09235f9-6933-4fce-9b7f-68fda58cce63	1f04e16f-b733-4db5-b2fd-74df85ba9107	Swift HR & Recruitment Services	hr-recruitment-en-mlsahgfjg3m	We are a professional HR & Recruitment service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-03d91ca1-mlsahgfjg3m@demo.marketplace.com	+19318698926	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:42.706	\N	t	f	4.2	55	PREMIUM	2025-10-14 05:28:11.925	2026-02-18 17:11:42.708	{}	{03d91ca1-5212-4f7b-83a1-42400912048c,lang:en}
7a254ba7-cb84-4be2-91e3-1a630f12fe76	c5a69745-081b-4d84-a9d8-9f22b46e1dde	شركة توظيف وموارد بشرية المتخصصة	ar-hr-recruitment-mlsahgfpb4w	نحن شركة متخصصة في تقديم خدمات توظيف وموارد بشرية بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-03d91ca1-mlsahgfpb4w@demo.marketplace.com	+966984673389	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:42.712	\N	t	f	4.5	42	FREE	2025-10-08 05:42:28.193	2026-02-18 17:11:42.714	{}	{03d91ca1-5212-4f7b-83a1-42400912048c,lang:ar}
30755662-c0eb-41e4-afe2-9b406d8c4ffd	e4e478de-4b69-4463-9f74-70d77d6d3012	Top Office Setup Experts	office-setup-en-mlsahgfvgp3	We are a professional Office Setup service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-2f9602ea-mlsahgfvgp3@demo.marketplace.com	+13562117627	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	VERIFIED	2026-02-18 17:11:42.718	\N	t	f	3.9	16	PREMIUM	2025-11-05 04:13:26.195	2026-02-18 17:11:42.72	{}	{2f9602ea-0a83-4153-ab0b-3bfa296db823,lang:en}
670efe6e-57b4-4b85-9a80-cd7e718b6a99	8835469a-611a-4ddf-8a38-5def414ccd18	مجموعة تجهيز مكاتب للخدمات	ar-office-setup-mlsahgg1x98	نحن شركة متخصصة في تقديم خدمات تجهيز مكاتب بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-2f9602ea-mlsahgg1x98@demo.marketplace.com	+966760697488	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:42.725	\N	t	f	4.4	53	BASIC	2025-12-28 21:49:06.253	2026-02-18 17:11:42.729	{}	{2f9602ea-0a83-4153-ab0b-3bfa296db823,lang:ar}
d9fd2983-ac58-45a7-aa88-af07d4eecd4c	bc91a26d-cd67-4455-8209-a0e89d580c5c	Elite PRO Services Services	pro-services-en-mlsahgga9e1	We are a professional PRO Services service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-a32a9674-mlsahgga9e1@demo.marketplace.com	+11591635383	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	VERIFIED	2026-02-18 17:11:42.735	\N	t	t	4.8	45	FREE	2026-01-20 23:39:16.417	2026-02-18 17:11:42.737	{}	{a32a9674-3e61-4eae-9263-8a792adf53eb,lang:en}
5bc4c6c9-e56a-4e3f-bb93-d31f7049862a	e0ebcd78-9f3e-4f4b-81bc-d23c657b159a	خبراء خدمات تعقيب المتكاملة	ar-pro-services-mlsahggi3qw	نحن شركة متخصصة في تقديم خدمات خدمات تعقيب بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-a32a9674-mlsahggi3qw@demo.marketplace.com	+966285692865	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	VERIFIED	2026-02-18 17:11:42.742	\N	t	t	4.4	66	BASIC	2025-05-01 06:13:31.557	2026-02-18 17:11:42.745	{}	{a32a9674-3e61-4eae-9263-8a792adf53eb,lang:ar}
1a8029f0-49ce-4ed6-9b48-9d88233c4fd3	3afada04-f187-49d8-b9af-fa2bcad702a8	Pro Translation Group	translation-en-mlsahggqiiv	We are a professional Translation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-28584798-mlsahggqiiv@demo.marketplace.com	+17255081062	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:42.749	\N	t	f	3.9	74	PREMIUM	2025-12-15 07:23:09.153	2026-02-18 17:11:42.752	{}	{28584798-4de1-496c-9fd0-b88f7ad41a93,lang:en}
12bb6679-d73e-42f4-8845-f64cf61becc6	f62153d1-c3df-4cf2-a375-a37397d6d979	شركة ترجمة معتمدة للخدمات	ar-translation-mlsahggxjox	نحن شركة متخصصة في تقديم خدمات ترجمة معتمدة بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-28584798-mlsahggxjox@demo.marketplace.com	+966167105199	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:42.757	\N	t	f	4.2	42	BASIC	2025-04-07 04:08:46.926	2026-02-18 17:11:42.759	{}	{28584798-4de1-496c-9fd0-b88f7ad41a93,lang:ar}
fba4b102-282e-4d64-a215-4910aa2724b5	bc444bd2-d77d-4f4a-8aea-5a345f988158	Swift Design Co	design-en-mlsahgh5uky	We are a professional Design service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-71cdffe5-mlsahgh5uky@demo.marketplace.com	+16234507992	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	VERIFIED	2026-02-18 17:11:42.765	\N	t	t	3.6	58	PREMIUM	2026-01-26 17:33:46.689	2026-02-18 17:11:42.768	{}	{71cdffe5-1523-4ae3-82c7-d76dc438f90f,lang:en}
12036603-fdfe-4f28-99d5-9aeb1751a0d8	e7b3614a-b1a8-43bd-b0bd-65e25f826837	مجموعة تصميم المتكاملة	ar-design-mlsahghef5y	نحن شركة متخصصة في تقديم خدمات تصميم بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-71cdffe5-mlsahghef5y@demo.marketplace.com	+966409775572	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:42.776	\N	t	f	4.6	68	PREMIUM	2025-10-13 09:23:44.987	2026-02-18 17:11:42.779	{}	{71cdffe5-1523-4ae3-82c7-d76dc438f90f,lang:ar}
081cb3ea-0074-4ffd-a17a-66427addcb91	f4ceb662-3ffd-45d5-935a-60593ebb1bc5	Best Photography Agency	photography-en-mlsahghobzy	We are a professional Photography service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-deb10409-mlsahghobzy@demo.marketplace.com	+15637563812	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:42.784	\N	t	f	4.9	12	PREMIUM	2025-08-29 04:24:57.355	2026-02-18 17:11:42.786	{}	{deb10409-fb05-4a07-a0f4-dda54988cd52,lang:en}
eb6a88ca-61e8-497f-857f-d677ad6db98e	ceff3f8a-34e1-42bf-9cf9-e86fd0f34019	خبراء تصوير احترافي للخدمات	ar-photography-mlsahghxc4s	نحن شركة متخصصة في تقديم خدمات تصوير احترافي بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-deb10409-mlsahghxc4s@demo.marketplace.com	+966852500984	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	VERIFIED	2026-02-18 17:11:42.793	\N	t	f	3.7	83	FREE	2026-01-09 04:26:42.898	2026-02-18 17:11:42.795	{}	{deb10409-fb05-4a07-a0f4-dda54988cd52,lang:ar}
f876bab0-85e0-4165-a815-c2e0e9b36c3a	930ce1cc-5c40-46ef-80de-04e8bf044f3c	شركة تصميم جرافيك المتميزة	ar-graphic-design-mlsahgiduyu	نحن شركة متخصصة في تقديم خدمات تصميم جرافيك بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-9f883a2f-mlsahgiduyu@demo.marketplace.com	+966407386022	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	VERIFIED	2026-02-18 17:11:42.811	\N	t	t	4.8	75	FREE	2025-07-14 07:57:34.091	2026-02-18 17:11:42.813	{}	{9f883a2f-cae6-461b-91ce-d01c592774c3,lang:ar}
5d98fae9-3591-47fc-98ae-2a7424111dfc	d9124894-67f1-41d0-854e-0652add2b63c	Alpha Branding & Identity Solutions	branding-identity-en-mlsahgim5w6	We are a professional Branding & Identity service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-f684e579-mlsahgim5w6@demo.marketplace.com	+15176264087	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:42.817	\N	t	t	4	8	BASIC	2025-09-11 00:40:40.586	2026-02-18 17:11:42.82	{}	{f684e579-7a25-44dc-a309-265dbfd1f2d2,lang:en}
2d1634e5-eae0-4c53-a247-8c57900c813d	917c9f83-f5b7-448d-bf27-ff8c81b3e5f8	مجموعة هوية بصرية المتميزة	ar-branding-identity-mlsahgismm0	نحن شركة متخصصة في تقديم خدمات هوية بصرية بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-f684e579-mlsahgismm0@demo.marketplace.com	+966621523904	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:42.823	\N	t	f	4.6	38	PREMIUM	2025-06-06 02:51:33.61	2026-02-18 17:11:42.825	{}	{f684e579-7a25-44dc-a309-265dbfd1f2d2,lang:ar}
9e2ccd85-c3f4-4677-86af-314fbf6183ac	6dd5faa3-48ea-4051-8d54-e3c6c36c2288	Star 3D Visualization Experts	3d-visualization-en-mlsahgiyuqs	We are a professional 3D Visualization service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-e2e4e7b7-mlsahgiyuqs@demo.marketplace.com	+13840096079	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	VERIFIED	2026-02-18 17:11:42.828	\N	t	t	3.7	34	PREMIUM	2025-08-24 17:28:53.105	2026-02-18 17:11:42.831	{}	{e2e4e7b7-f108-4f74-a653-f52e0483fa40,lang:en}
03a38024-9ec2-4281-87a6-608f45a085ae	175365c5-92ff-40c4-bd74-4a0a7703b781	مؤسسة تصميم ثلاثي الأبعاد المتكاملة	ar-3d-visualization-mlsahgj3gbq	نحن شركة متخصصة في تقديم خدمات تصميم ثلاثي الأبعاد بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-e2e4e7b7-mlsahgj3gbq@demo.marketplace.com	+966371452960	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:42.834	\N	t	f	5	53	BASIC	2025-12-11 11:54:09.163	2026-02-18 17:11:42.836	{}	{e2e4e7b7-f108-4f74-a653-f52e0483fa40,lang:ar}
b9e67a1b-f8c1-4c1e-8568-6ed765a86aad	1f391e89-3b32-4bf6-bc3f-8f25f39480c7	Alpha Interior Design Hub	interior-design-en-mlsahgj9g3g	We are a professional Interior Design service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-85ecc7e5-mlsahgj9g3g@demo.marketplace.com	+19815382698	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:42.84	\N	t	f	3.5	41	FREE	2025-02-28 06:35:06.01	2026-02-18 17:11:42.842	{}	{85ecc7e5-742e-4b3a-9d61-40c0e86a59c8,lang:en}
cede0669-a6d0-444d-8d4e-3cd66e17c9f5	339d8d17-99dc-4d9a-8e32-bb8220dc757d	خبراء تصميم داخلي المتميزة	ar-interior-design-mlsahgjfirb	نحن شركة متخصصة في تقديم خدمات تصميم داخلي بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-85ecc7e5-mlsahgjfirb@demo.marketplace.com	+966860766957	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:42.845	\N	t	t	4.2	11	BASIC	2026-01-30 18:17:17.11	2026-02-18 17:11:42.847	{}	{85ecc7e5-742e-4b3a-9d61-40c0e86a59c8,lang:ar}
33cfc9e0-062d-43ff-bf06-8c0cd362340f	e54e148f-4412-4104-987e-36d8d50e0d39	Pro Landscape Design Experts	landscape-design-en-mlsahgjkn6n	We are a professional Landscape Design service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-9e64837b-mlsahgjkn6n@demo.marketplace.com	+19836077897	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	VERIFIED	2026-02-18 17:11:42.85	\N	t	t	3.8	61	FREE	2026-02-13 06:06:32.109	2026-02-18 17:11:42.852	{}	{9e64837b-ee22-4570-b1f2-9c6c938107ea,lang:en}
c4f3fe57-9504-41e1-8d8c-3f31ace0b064	b22c7a97-09ec-43e6-95e7-769ddf76fa80	مركز تصميم حدائق المتكاملة	ar-landscape-design-mlsahgjpko2	نحن شركة متخصصة في تقديم خدمات تصميم حدائق بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-9e64837b-mlsahgjpko2@demo.marketplace.com	+966508530614	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:42.856	\N	t	t	4.9	31	FREE	2025-11-06 21:55:34.633	2026-02-18 17:11:42.858	{}	{9e64837b-ee22-4570-b1f2-9c6c938107ea,lang:ar}
c4cbd171-a19d-4d89-afef-387905a6a849	85694ebe-70c9-47d3-8160-fbb9e8c6f3cf	Expert Logo Design Team	logo-design-en-mlsahgjvu1g	We are a professional Logo Design service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-06dee9e7-mlsahgjvu1g@demo.marketplace.com	+19405278180	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:42.861	\N	t	f	4.9	11	BASIC	2025-03-18 02:39:27.58	2026-02-18 17:11:42.863	{}	{06dee9e7-8564-4afe-9544-715d48872bbb,lang:en}
6f8311d2-c1ef-4612-819d-3192756b10d4	09c56172-af36-4e8c-a9d1-8acbb359eb28	مؤسسة تصميم شعارات المتميزة	ar-logo-design-mlsahgk0rut	نحن شركة متخصصة في تقديم خدمات تصميم شعارات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-06dee9e7-mlsahgk0rut@demo.marketplace.com	+966174194570	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:42.867	\N	t	f	3.6	48	PREMIUM	2025-03-31 12:54:39.588	2026-02-18 17:11:42.869	{}	{06dee9e7-8564-4afe-9544-715d48872bbb,lang:ar}
226d2630-eda2-414e-a8ca-4d8785599c61	6b6f6928-a50f-4562-b18a-c37b9283e526	Best Architectural Design Partners	architectural-design-en-mlsahgk6ztz	We are a professional Architectural Design service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-0c401f45-mlsahgk6ztz@demo.marketplace.com	+18380702707	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:42.873	\N	t	t	4.8	69	BASIC	2025-05-17 05:16:06.068	2026-02-18 17:11:42.875	{}	{0c401f45-8f32-4a40-81c7-c12a0063e6f3,lang:en}
8c593878-2ecc-4b67-8260-cd232f99e141	bcd2ecf2-23e5-473b-a1c4-2cba498d4ce2	شركة تصميم معماري الاحترافية	ar-architectural-design-mlsahgkcm69	نحن شركة متخصصة في تقديم خدمات تصميم معماري بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-0c401f45-mlsahgkcm69@demo.marketplace.com	+966183506239	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:42.879	\N	t	f	3.8	80	BASIC	2025-04-09 08:14:31.158	2026-02-18 17:11:42.881	{}	{0c401f45-8f32-4a40-81c7-c12a0063e6f3,lang:ar}
2061d19d-140b-47c7-80c9-73c327a0f8d7	4ef2e1fa-3b7c-46c1-8685-c0caceb17df3	Swift Video Production Co	video-production-en-mlsahgkhebf	We are a professional Video Production service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-80ba105a-mlsahgkhebf@demo.marketplace.com	+11730208399	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	VERIFIED	2026-02-18 17:11:42.884	\N	t	f	4.6	77	PREMIUM	2026-01-28 16:23:27.834	2026-02-18 17:11:42.886	{}	{80ba105a-f0fb-4361-841c-cee2fe88003d,lang:en}
c1ac37ab-34b7-4bd4-8604-a9422c1da88e	72e5663f-9d8a-4edf-9636-4fe3f35af9d6	خبراء إنتاج فيديو المتخصصة	ar-video-production-mlsahgkn94m	نحن شركة متخصصة في تقديم خدمات إنتاج فيديو بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-80ba105a-mlsahgkn94m@demo.marketplace.com	+966691891606	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:42.889	\N	t	f	4.8	33	BASIC	2025-05-14 23:42:35.737	2026-02-18 17:11:42.891	{}	{80ba105a-f0fb-4361-841c-cee2fe88003d,lang:ar}
b2b73b2f-fbf8-4f6f-8da0-9caebaf65013	8a08973c-ebaf-4304-ac3b-2b1af0dc559a	Prime Central AC Systems Partners	central-ac-systems-en-mlsahgktoup	We are a professional Central AC Systems service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-e4b87995-mlsahgktoup@demo.marketplace.com	+13038485077	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	VERIFIED	2026-02-18 17:11:42.896	\N	t	f	3.5	30	BASIC	2025-10-28 20:34:18.392	2026-02-18 17:11:42.898	{}	{e4b87995-9082-4431-b055-d53c0bea18ab,lang:en}
a4e73631-b89c-4cf9-b3a7-9e64427f58fb	68cbab23-12cf-4543-9e1e-a6f19f4863cf	مجموعة تكييف مركزي المتميزة	ar-central-ac-systems-mlsahgkz6fv	نحن شركة متخصصة في تقديم خدمات تكييف مركزي بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-e4b87995-mlsahgkz6fv@demo.marketplace.com	+966754109992	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	VERIFIED	2026-02-18 17:11:42.902	\N	t	f	3.6	46	FREE	2025-03-01 06:12:27.599	2026-02-18 17:11:42.904	{}	{e4b87995-9082-4431-b055-d53c0bea18ab,lang:ar}
55acfda9-aebb-46ed-9403-b8f17a379dee	6fe2388c-d729-41ca-9a47-d03d91286ab4	Elite Heating Repair Co	heating-repair-en-mlsahgl5nr1	We are a professional Heating Repair service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-99d200f3-mlsahgl5nr1@demo.marketplace.com	+11176699616	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:42.908	\N	t	f	3.8	14	FREE	2025-05-13 05:32:28.712	2026-02-18 17:11:42.91	{}	{99d200f3-6346-4394-b99e-f13bfcbf45b4,lang:en}
21eef442-35c0-4090-83fa-0cc36eed2239	b590e414-4a57-46dc-ab3b-fa541e84a9ba	شركة صيانة أنظمة تدفئة للخدمات	ar-heating-repair-mlsahglbfqj	نحن شركة متخصصة في تقديم خدمات صيانة أنظمة تدفئة بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-99d200f3-mlsahglbfqj@demo.marketplace.com	+966203684600	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	VERIFIED	2026-02-18 17:11:42.914	\N	t	f	3.5	43	BASIC	2026-02-01 10:14:49.697	2026-02-18 17:11:42.916	{}	{99d200f3-6346-4394-b99e-f13bfcbf45b4,lang:ar}
2f910a14-ab6c-483b-9068-08dbf1006c47	057ec602-1652-4b2a-9d5a-2db40e966dff	Prime Duct Install & Cleaning Group	duct-install-cleaning-en-mlsahglhq7d	We are a professional Duct Install & Cleaning service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-c51e73dc-mlsahglhq7d@demo.marketplace.com	+11830597566	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:42.919	\N	t	t	4.1	63	PREMIUM	2025-10-04 10:49:28.227	2026-02-18 17:11:42.922	{}	{c51e73dc-ef12-4653-9e28-09fad77b21fc,lang:en}
ac3653e6-6445-4d92-be12-bfaf05ec72e5	dfe052c6-a962-4ee2-bd4c-375e34fa2da4	خبراء تركيب وتنظيف دكت المتميزة	ar-duct-install-cleaning-mlsahglohbm	نحن شركة متخصصة في تقديم خدمات تركيب وتنظيف دكت بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-c51e73dc-mlsahglohbm@demo.marketplace.com	+966102599126	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	VERIFIED	2026-02-18 17:11:42.926	\N	t	t	3.7	58	PREMIUM	2025-11-04 04:43:37.337	2026-02-18 17:11:42.929	{}	{c51e73dc-ef12-4653-9e28-09fad77b21fc,lang:ar}
fcca8268-81ac-4309-9d3b-8eb27c5a8bc7	b2993066-5dc5-4144-ab77-aa9e96522b3a	Swift Thermostat Install Experts	thermostat-install-en-mlsahglu7ox	We are a professional Thermostat Install service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-998ed8b1-mlsahglu7ox@demo.marketplace.com	+11440575623	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	VERIFIED	2026-02-18 17:11:42.933	\N	t	f	4.8	32	BASIC	2025-05-05 01:54:32.419	2026-02-18 17:11:42.935	{}	{998ed8b1-59de-4c05-a4f1-318c4475145f,lang:en}
428acd71-dff1-413c-a871-72a9d9334a62	641bf7c2-0c19-4ccb-81ed-02efa95b8c2b	مجموعة تركيب ترموستات المتكاملة	ar-thermostat-install-mlsahgm1173	نحن شركة متخصصة في تقديم خدمات تركيب ترموستات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-998ed8b1-mlsahgm1173@demo.marketplace.com	+966525796085	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	VERIFIED	2026-02-18 17:11:42.939	\N	t	t	3.8	15	PREMIUM	2025-11-06 08:28:35.991	2026-02-18 17:11:42.942	{}	{998ed8b1-59de-4c05-a4f1-318c4475145f,lang:ar}
159e9f0f-1e9d-4170-b3c1-65c6032b46d1	8ed77bf5-9fc4-4135-9a5b-5cfc2a4a7629	Pro Gas Refill Experts	gas-refill-en-mlsahgm75re	We are a professional Gas Refill service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-a2ff47e5-mlsahgm75re@demo.marketplace.com	+17924871481	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	VERIFIED	2026-02-18 17:11:42.946	\N	t	f	4.5	8	BASIC	2026-01-28 20:03:23.052	2026-02-18 17:11:42.948	{}	{a2ff47e5-f2ed-41e1-867e-0345dc56eb6b,lang:en}
97bb7023-da4d-4a0c-bc64-5895bb525742	3429f8e8-4c12-4266-845e-bc49a56ebb06	مجموعة تعبئة غاز المتكاملة	ar-gas-refill-mlsahgmd1ek	نحن شركة متخصصة في تقديم خدمات تعبئة غاز بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-a2ff47e5-mlsahgmd1ek@demo.marketplace.com	+966769041547	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	VERIFIED	2026-02-18 17:11:42.952	\N	t	f	3.8	63	PREMIUM	2025-08-16 21:35:34.197	2026-02-18 17:11:42.954	{}	{a2ff47e5-f2ed-41e1-867e-0345dc56eb6b,lang:ar}
a3ce843c-d8c1-45fa-a272-3619cfcf464e	787d4575-c701-41fd-8990-d6ca1d09f004	Apex HVAC Inspection Services	hvac-inspection-en-mlsahgmjxgy	We are a professional HVAC Inspection service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-a9a06bd3-mlsahgmjxgy@demo.marketplace.com	+11916099779	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:42.958	\N	t	f	4.6	61	FREE	2025-07-06 06:18:22.14	2026-02-18 17:11:42.96	{}	{a9a06bd3-95b8-4356-8ce3-c652f61f660b,lang:en}
5257362a-86e9-4821-a28f-4a7f758e8094	d48fcf05-908b-45a5-8de2-0fbead2d8028	شركة فحص أنظمة التكييف المتخصصة	ar-hvac-inspection-mlsahgmoltr	نحن شركة متخصصة في تقديم خدمات فحص أنظمة التكييف بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-a9a06bd3-mlsahgmoltr@demo.marketplace.com	+966857109175	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:42.963	\N	t	f	4.9	77	PREMIUM	2025-11-11 22:09:12.343	2026-02-18 17:11:42.966	{}	{a9a06bd3-95b8-4356-8ce3-c652f61f660b,lang:ar}
d898a667-0c22-47f3-820d-314ea1fbe5af	20b37e0d-16a0-4111-8f95-bf2186a3e8d0	Pro Network Installation Solutions	network-installation-en-mlsahgmuu6g	We are a professional Network Installation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-094e4723-mlsahgmuu6g@demo.marketplace.com	+17885184335	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	VERIFIED	2026-02-18 17:11:42.969	\N	t	f	4.3	14	FREE	2025-03-10 10:03:32.333	2026-02-18 17:11:42.971	{}	{094e4723-4046-4698-a5e2-fe3cc59c3245,lang:en}
7fd643ad-a94c-4f99-be49-fa830e49ec1d	33aa4105-0958-47d7-9285-9642e5c717fb	مجموعة تمديد شبكات الاحترافية	ar-network-installation-mlsahgn0ikx	نحن شركة متخصصة في تقديم خدمات تمديد شبكات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-094e4723-mlsahgn0ikx@demo.marketplace.com	+966986967093	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	VERIFIED	2026-02-18 17:11:42.975	\N	t	t	4.8	56	PREMIUM	2025-09-13 21:55:51.916	2026-02-18 17:11:42.978	{}	{094e4723-4046-4698-a5e2-fe3cc59c3245,lang:ar}
6e811803-d5d2-444c-adcf-4c33b5f97bb5	768d6504-c4bf-4289-910e-d76a7cae10d7	Top Server Installation Co	server-installation-en-mlsahgn73vi	We are a professional Server Installation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-86a76eb4-mlsahgn73vi@demo.marketplace.com	+18861269856	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:42.982	\N	t	f	3.9	40	FREE	2026-02-17 06:59:53.874	2026-02-18 17:11:42.984	{}	{86a76eb4-918a-4476-ad5c-b1f84fe9ec4a,lang:en}
37b9cf74-71ce-4502-a894-4926f432466f	a86fd955-781b-475c-9dbb-4746c47581af	مركز تركيب سيرفرات الاحترافية	ar-server-installation-mlsahgnd31d	نحن شركة متخصصة في تقديم خدمات تركيب سيرفرات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-86a76eb4-mlsahgnd31d@demo.marketplace.com	+966425602081	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:42.988	\N	t	f	4.1	5	PREMIUM	2025-07-15 00:24:23.365	2026-02-18 17:11:42.99	{}	{86a76eb4-918a-4476-ad5c-b1f84fe9ec4a,lang:ar}
4bf72db5-4777-4640-8c9e-448b6ad4234f	189568d6-c452-466e-a8ce-f1e7d5710f71	Top Server Maintenance Services	server-maintenance-en-mlsahgnkks9	We are a professional Server Maintenance service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-0908a7a2-mlsahgnkks9@demo.marketplace.com	+18312470995	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:42.995	\N	t	f	4.9	53	BASIC	2025-03-06 09:56:26.481	2026-02-18 17:11:42.997	{}	{0908a7a2-ca8f-4190-8dee-a43331dd59c8,lang:en}
699c977b-2221-416b-94e1-012d42236725	4495bbaf-52c0-47d8-bfe0-1cb9865b5b10	شركة صيانة سيرفرات المتكاملة	ar-server-maintenance-mlsahgnquzh	نحن شركة متخصصة في تقديم خدمات صيانة سيرفرات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-0908a7a2-mlsahgnquzh@demo.marketplace.com	+966548667447	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:43.001	\N	t	t	4.2	73	FREE	2025-12-19 19:22:36.29	2026-02-18 17:11:43.003	{}	{0908a7a2-ca8f-4190-8dee-a43331dd59c8,lang:ar}
dc534b51-b33d-4e68-b448-a7e194a1758e	16f18bc6-5341-4724-a55c-60193bf7afda	Prime Hardware Repair Solutions	hardware-repair-en-mlsahgnxvs5	We are a professional Hardware Repair service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-1b0eb73a-mlsahgnxvs5@demo.marketplace.com	+12466399006	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:43.008	\N	t	f	3.8	28	FREE	2025-10-21 05:25:06.212	2026-02-18 17:11:43.01	{}	{1b0eb73a-0e17-4dfc-8299-1376df9f40e7,lang:en}
48a63c30-ef22-40c8-a7df-fe7e973fe782	7a75097d-47e2-4ce6-8c12-522cf1018990	مركز صيانة أجهزة كمبيوتر الاحترافية	ar-hardware-repair-mlsahgo37l1	نحن شركة متخصصة في تقديم خدمات صيانة أجهزة كمبيوتر بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-1b0eb73a-mlsahgo37l1@demo.marketplace.com	+966247193401	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	VERIFIED	2026-02-18 17:11:43.014	\N	t	f	4.8	11	BASIC	2025-12-13 21:07:29.722	2026-02-18 17:11:43.017	{}	{1b0eb73a-0e17-4dfc-8299-1376df9f40e7,lang:ar}
5e783316-ce58-49f7-8f12-2c9b460e5e8e	d0fa317a-c56b-4982-adb9-4f07c8ce9f9c	Swift Printer Setup Partners	printer-setup-en-mlsahgob4re	We are a professional Printer Setup service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-6da456be-mlsahgob4re@demo.marketplace.com	+13334533089	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	VERIFIED	2026-02-18 17:11:43.025	\N	t	f	3.9	37	FREE	2025-09-19 02:44:55.581	2026-02-18 17:11:43.027	{}	{6da456be-fbf2-4421-8140-0fd4efcc9edc,lang:en}
4d2eb40f-0864-46f6-992f-c6b92ddb37be	5d9a77ee-636b-443a-868e-e642d8c1c4fa	مركز تعريف طابعات المتكاملة	ar-printer-setup-mlsahgok1sy	نحن شركة متخصصة في تقديم خدمات تعريف طابعات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-6da456be-mlsahgok1sy@demo.marketplace.com	+966867287202	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:43.031	\N	t	f	4.2	78	BASIC	2025-08-04 22:10:26.067	2026-02-18 17:11:43.034	{}	{6da456be-fbf2-4421-8140-0fd4efcc9edc,lang:ar}
ae7c4ce8-7455-45ff-b8a1-278e05b29598	e4181dba-e5c1-4c65-8c17-8ad55407a819	Pro CCTV Integration Experts	cctv-integration-en-mlsahgorh6a	We are a professional CCTV Integration service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-7245e6a5-mlsahgorh6a@demo.marketplace.com	+17230469158	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	VERIFIED	2026-02-18 17:11:43.037	\N	t	f	4.7	14	PREMIUM	2025-08-05 04:55:51.915	2026-02-18 17:11:43.04	{}	{7245e6a5-a8fe-4f53-85ea-86ead7b76474,lang:en}
56d1c4c5-731b-4896-8bc3-1c93041a1be2	4e7ac101-1e64-40e2-897b-4868ffd77705	مؤسسة ربط كاميرات بالشبكة المتكاملة	ar-cctv-integration-mlsahgoxstu	نحن شركة متخصصة في تقديم خدمات ربط كاميرات بالشبكة بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-7245e6a5-mlsahgoxstu@demo.marketplace.com	+966272776144	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	VERIFIED	2026-02-18 17:11:43.043	\N	t	f	4.1	41	PREMIUM	2025-04-19 15:53:55.288	2026-02-18 17:11:43.045	{}	{7245e6a5-a8fe-4f53-85ea-86ead7b76474,lang:ar}
557d338f-5fa9-4c12-adb8-b57286ea05c9	f73cacc9-a823-4e36-b772-bc4eba6e50d2	Best Maintenance Contracts Experts	maintenance-contracts-en-mlsahgp2l90	We are a professional Maintenance Contracts service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-6c3eb205-mlsahgp2l90@demo.marketplace.com	+19691922736	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	VERIFIED	2026-02-18 17:11:43.049	\N	t	f	4.7	33	PREMIUM	2025-09-18 04:27:26.077	2026-02-18 17:11:43.051	{}	{6c3eb205-4e70-41d4-8bee-2c8af2adadd1,lang:en}
3f22a66f-dd2c-4759-9a9f-d595dc161dbe	fabc231a-38fe-4221-a3b2-da9d23dddf06	خبراء عقود صيانة دورية المتخصصة	ar-maintenance-contracts-mlsahgp8ss3	نحن شركة متخصصة في تقديم خدمات عقود صيانة دورية بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-6c3eb205-mlsahgp8ss3@demo.marketplace.com	+966976230066	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:43.055	\N	t	f	4.4	37	PREMIUM	2025-07-02 19:47:07.913	2026-02-18 17:11:43.057	{}	{6c3eb205-4e70-41d4-8bee-2c8af2adadd1,lang:ar}
38037cbb-1af9-4f05-b1ca-c8af23ab53f4	bc0db561-fba5-44e7-8471-72854fec9f59	Best Data Recovery Partners	data-recovery-en-mlsahgpewz2	We are a professional Data Recovery service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-647011ed-mlsahgpewz2@demo.marketplace.com	+15529112109	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:43.061	\N	t	f	3.9	30	FREE	2025-03-06 06:22:59.454	2026-02-18 17:11:43.063	{}	{647011ed-6560-47ee-9091-7b129a07c9ae,lang:en}
73789e74-3419-46c6-a996-f22a84684081	53fd7767-37a1-4d93-aed4-32deec707197	شركة استعادة بيانات الاحترافية	ar-data-recovery-mlsahgpkvut	نحن شركة متخصصة في تقديم خدمات استعادة بيانات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-647011ed-mlsahgpkvut@demo.marketplace.com	+966119399110	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:43.067	\N	t	f	4.5	62	PREMIUM	2025-08-16 15:34:09.514	2026-02-18 17:11:43.069	{}	{647011ed-6560-47ee-9091-7b129a07c9ae,lang:ar}
5a8f24ee-6d81-4774-a75d-6bf87e6bc7a3	a43dd4a2-4f3f-4837-8074-98aa8be85c3d	Expert Website Development Experts	website-development-en-mlsahgprfrw	We are a professional Website Development service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-a58e3f12-mlsahgprfrw@demo.marketplace.com	+17947533543	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:43.074	\N	t	f	4.3	70	FREE	2025-08-10 10:25:14.507	2026-02-18 17:11:43.076	{}	{a58e3f12-ee73-4839-ada6-973b6de1db94,lang:en}
7c4db384-6679-44b3-bd2a-e5c394aa7bd5	a02be373-64ba-4a17-aefd-63e347a391df	شركة تصميم وتطوير مواقع المتميزة	ar-website-development-mlsahgpxg7v	نحن شركة متخصصة في تقديم خدمات تصميم وتطوير مواقع بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-a58e3f12-mlsahgpxg7v@demo.marketplace.com	+966411079274	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	VERIFIED	2026-02-18 17:11:43.08	\N	t	f	4.4	46	BASIC	2025-08-12 02:58:58.816	2026-02-18 17:11:43.082	{}	{a58e3f12-ee73-4839-ada6-973b6de1db94,lang:ar}
9118e3c5-995c-4e67-a225-cb0a7bdeb66f	f3e17ae5-47cc-4f14-bbe8-50654a8f6d62	Top E-commerce Dev Co	e-commerce-dev-en-mlsahgq3fe8	We are a professional E-commerce Dev service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-b2a5e338-mlsahgq3fe8@demo.marketplace.com	+11030361516	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	VERIFIED	2026-02-18 17:11:43.085	\N	t	t	3.8	36	PREMIUM	2025-04-17 23:03:34.617	2026-02-18 17:11:43.088	{}	{b2a5e338-73ff-42a6-8dc3-b80d4e6fc5fc,lang:en}
bd5f34dc-6c76-49cc-90ff-71c55c714d58	2690459f-a4cc-4e89-8028-5f5c5066eb2e	شركة متاجر إلكترونية الاحترافية	ar-e-commerce-dev-mlsahgq9eec	نحن شركة متخصصة في تقديم خدمات متاجر إلكترونية بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-b2a5e338-mlsahgq9eec@demo.marketplace.com	+966442314037	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:43.092	\N	t	t	4.6	43	PREMIUM	2025-02-24 19:24:35.542	2026-02-18 17:11:43.094	{}	{b2a5e338-73ff-42a6-8dc3-b80d4e6fc5fc,lang:ar}
e282d9b4-6ef8-4899-ab2b-ff902acff9a4	6b73b5b3-d4af-4048-bb10-132937dc2826	Pro Mobile App Dev Experts	mobile-app-dev-en-mlsahgqff0m	We are a professional Mobile App Dev service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-9aa93818-mlsahgqff0m@demo.marketplace.com	+19899775009	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:43.098	\N	t	f	4.1	16	FREE	2025-07-24 15:55:10.35	2026-02-18 17:11:43.1	{}	{9aa93818-7b3e-4196-b853-03648df182fb,lang:en}
7af309d4-b374-4d25-b2cf-e8c99b7e9f10	d3b915d5-9436-47c9-9e36-dbb6466de4b5	خبراء تطبيقات موبايل المتكاملة	ar-mobile-app-dev-mlsahgql797	نحن شركة متخصصة في تقديم خدمات تطبيقات موبايل بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-9aa93818-mlsahgql797@demo.marketplace.com	+966967592516	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	VERIFIED	2026-02-18 17:11:43.104	\N	t	f	4.6	44	PREMIUM	2025-08-15 09:45:47.182	2026-02-18 17:11:43.106	{}	{9aa93818-7b3e-4196-b853-03648df182fb,lang:ar}
5ca7e207-2964-4604-a28a-b55397cbf9e2	90e02423-28b2-43c6-84f4-8f0f6e1905a9	Elite UI/UX Design Partners	ui-ux-design-en-mlsahgqszq5	We are a professional UI/UX Design service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-50187776-mlsahgqszq5@demo.marketplace.com	+16507972843	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:43.111	\N	t	f	3.8	41	BASIC	2025-09-04 07:25:34.363	2026-02-18 17:11:43.113	{}	{50187776-a7e9-41bb-9d8f-8fcc73bf7eb0,lang:en}
afee415a-ec54-4ae7-bd6a-388ced9009d3	2e128cb7-4f9a-4a00-a7a9-df1bcf5d8b13	خبراء تصميم واجهات المستخدم المتميزة	ar-ui-ux-design-mlsahgqx64c	نحن شركة متخصصة في تقديم خدمات تصميم واجهات المستخدم بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-50187776-mlsahgqx64c@demo.marketplace.com	+966775545135	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	VERIFIED	2026-02-18 17:11:43.117	\N	t	f	4.9	77	FREE	2025-08-05 15:52:26.262	2026-02-18 17:11:43.119	{}	{50187776-a7e9-41bb-9d8f-8fcc73bf7eb0,lang:ar}
d21cd955-7999-49ed-bd53-a4013dd91227	4c6fb6c1-8d13-4397-8e22-6332906d9c33	Pro Digital Marketing Team	digital-marketing-en-mlsahgr4xxa	We are a professional Digital Marketing service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-d2c3038f-mlsahgr4xxa@demo.marketplace.com	+16357353955	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:43.123	\N	t	t	4.2	49	FREE	2025-03-12 00:21:26.737	2026-02-18 17:11:43.126	{}	{d2c3038f-cc14-4e68-804e-03c1373cf56b,lang:en}
24bea03d-5a6c-4fd8-9fcf-573c1de1ac78	be965ba5-51e2-4d1a-8337-b448eadc5d94	مجموعة تسويق رقمي المتخصصة	ar-digital-marketing-mlsahgraq7t	نحن شركة متخصصة في تقديم خدمات تسويق رقمي بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-d2c3038f-mlsahgraq7t@demo.marketplace.com	+966857473492	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:43.129	\N	t	t	3.9	77	FREE	2025-05-18 00:10:34.628	2026-02-18 17:11:43.132	{}	{d2c3038f-cc14-4e68-804e-03c1373cf56b,lang:ar}
5ca18b0b-39ed-47d8-9df0-f54e310d05de	c5336036-266d-467b-a4fc-185dc57630c9	Expert SEO Services Works	seo-services-en-mlsahgrhhp7	We are a professional SEO Services service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-ae53a59e-mlsahgrhhp7@demo.marketplace.com	+14530913456	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	VERIFIED	2026-02-18 17:11:43.136	\N	t	f	4	72	BASIC	2025-05-16 03:29:28.258	2026-02-18 17:11:43.138	{}	{ae53a59e-003d-49e7-9e87-697ee990cc54,lang:en}
651a7336-f31d-4774-91ee-2adfd81d9624	c4c79b9f-ec38-479f-b71a-3d936c9c08f7	مركز تحسين محركات البحث المتميزة	ar-seo-services-mlsahgrnt5f	نحن شركة متخصصة في تقديم خدمات تحسين محركات البحث بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-ae53a59e-mlsahgrnt5f@demo.marketplace.com	+966216303142	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	VERIFIED	2026-02-18 17:11:43.141	\N	t	f	3.5	15	BASIC	2025-08-13 04:06:15.39	2026-02-18 17:11:43.144	{}	{ae53a59e-003d-49e7-9e87-697ee990cc54,lang:ar}
82fb02b4-7139-4c04-8ec8-b81a10fba140	5af1e01d-8665-4992-9eb3-8092c1b574f7	شركة إدارة حملات إعلانية الاحترافية	ar-paid-ads-mgmt-mlsahgs069g	نحن شركة متخصصة في تقديم خدمات إدارة حملات إعلانية بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-f4f9931a-mlsahgs069g@demo.marketplace.com	+966724537939	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:43.154	\N	t	f	4.7	57	BASIC	2025-12-06 12:16:32.645	2026-02-18 17:11:43.157	{}	{f4f9931a-f98b-4d38-bb26-5cad9c963e15,lang:ar}
1c46d4b1-7578-488f-b370-28233cf262d3	5879a4de-a93c-48ee-ac6a-d5398226b4af	Swift HR & Recruitment Solutions	hr-recruitment-en-mlsahgs75ph	We are a professional HR & Recruitment service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-03d91ca1-mlsahgs75ph@demo.marketplace.com	+16174786015	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	VERIFIED	2026-02-18 17:11:43.161	\N	t	f	3.9	54	PREMIUM	2025-09-07 00:58:01.901	2026-02-18 17:11:43.164	{}	{03d91ca1-5212-4f7b-83a1-42400912048c,lang:en}
589084be-6759-45ee-81ee-e7b543c4270c	121815ba-775a-42ac-8f65-8af681c055e1	شركة توظيف وموارد بشرية المتخصصة	ar-hr-recruitment-mlsahgscyh8	نحن شركة متخصصة في تقديم خدمات توظيف وموارد بشرية بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-03d91ca1-mlsahgscyh8@demo.marketplace.com	+966896190122	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	VERIFIED	2026-02-18 17:11:43.167	\N	t	f	4.1	72	PREMIUM	2025-10-18 22:37:08.581	2026-02-18 17:11:43.17	{}	{03d91ca1-5212-4f7b-83a1-42400912048c,lang:ar}
7db0d44a-d4b1-4248-ba5c-a4b73339535f	845b9c4e-9f64-40d8-8537-f1dc0edb51ca	Swift Office Setup Solutions	office-setup-en-mlsahgsjl9t	We are a professional Office Setup service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-2f9602ea-mlsahgsjl9t@demo.marketplace.com	+19652793218	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:43.173	\N	t	f	5	22	PREMIUM	2025-05-17 16:33:25.553	2026-02-18 17:11:43.176	{}	{2f9602ea-0a83-4153-ab0b-3bfa296db823,lang:en}
40608e2c-7b61-4764-acf4-a36c2aca67e5	29f8c5e6-d0b0-4977-a9d5-b7d150626f4a	مؤسسة تجهيز مكاتب الاحترافية	ar-office-setup-mlsahgspngc	نحن شركة متخصصة في تقديم خدمات تجهيز مكاتب بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-2f9602ea-mlsahgspngc@demo.marketplace.com	+966313400802	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	VERIFIED	2026-02-18 17:11:43.179	\N	t	t	4	59	BASIC	2026-01-10 22:42:47.424	2026-02-18 17:11:43.181	{}	{2f9602ea-0a83-4153-ab0b-3bfa296db823,lang:ar}
deb6fdc9-a012-416c-9e7a-3f55a3f6a424	5333d926-c10c-491e-bb99-5212c9ce5fe5	Pro PRO Services Works	pro-services-en-mlsahgsuffy	We are a professional PRO Services service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-a32a9674-mlsahgsuffy@demo.marketplace.com	+13791182358	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:43.186	\N	t	f	4.3	13	BASIC	2025-09-13 10:14:44.545	2026-02-18 17:11:43.189	{}	{a32a9674-3e61-4eae-9263-8a792adf53eb,lang:en}
ad06c81c-490a-446c-b295-031227913e0d	9daa8f68-2bd0-49f0-8351-6a03d994ab74	شركة خدمات تعقيب للخدمات	ar-pro-services-mlsahgt2blj	نحن شركة متخصصة في تقديم خدمات خدمات تعقيب بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-a32a9674-mlsahgt2blj@demo.marketplace.com	+966713028715	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	VERIFIED	2026-02-18 17:11:43.193	\N	t	f	3.7	57	PREMIUM	2025-06-01 13:55:20.732	2026-02-18 17:11:43.195	{}	{a32a9674-3e61-4eae-9263-8a792adf53eb,lang:ar}
11268c0c-a36d-4ec3-858c-9eb7aa5a7ee0	92fda5b7-f29a-4b99-ace9-6f46b933ae92	Elite Translation Hub	translation-en-mlsahgt89lh	We are a professional Translation service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-28584798-mlsahgt89lh@demo.marketplace.com	+15674011414	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	VERIFIED	2026-02-18 17:11:43.2	\N	t	f	4.6	50	PREMIUM	2025-07-24 15:33:14.171	2026-02-18 17:11:43.202	{}	{28584798-4de1-496c-9fd0-b88f7ad41a93,lang:en}
9457d05c-91df-4fd0-a5c1-170442da9562	784c22f9-1f5f-412a-b8ee-c7366384da6a	مركز ترجمة معتمدة المتميزة	ar-translation-mlsahgtfxvi	نحن شركة متخصصة في تقديم خدمات ترجمة معتمدة بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-28584798-mlsahgtfxvi@demo.marketplace.com	+966806909408	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	VERIFIED	2026-02-18 17:11:43.206	\N	t	f	3.5	84	FREE	2026-02-09 00:49:27.476	2026-02-18 17:11:43.208	{}	{28584798-4de1-496c-9fd0-b88f7ad41a93,lang:ar}
851ac05c-d49b-42c2-8530-b7751e153002	c61068a7-a02e-4d31-961f-37c3f1c0c360	Expert Logo Design Group	logo-design-en-mlsahgtl3km	We are a professional Logo Design service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-06dee9e7-mlsahgtl3km@demo.marketplace.com	+14065428962	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:43.212	\N	t	f	3.7	28	PREMIUM	2025-04-28 16:30:21.994	2026-02-18 17:11:43.214	{}	{06dee9e7-8564-4afe-9544-715d48872bbb,lang:en}
9dbbb9c2-8eed-4eb1-96db-5a81409b0058	2e64fcbd-dc4a-4400-a89e-a1a86d5d8b88	مركز تصميم شعارات المتميزة	ar-logo-design-mlsahgtsq7y	نحن شركة متخصصة في تقديم خدمات تصميم شعارات بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-06dee9e7-mlsahgtsq7y@demo.marketplace.com	+966508572142	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	VERIFIED	2026-02-18 17:11:43.219	\N	t	f	3.6	40	FREE	2025-11-24 23:31:49.461	2026-02-18 17:11:43.222	{}	{06dee9e7-8564-4afe-9544-715d48872bbb,lang:ar}
3d285c28-b416-4159-bef6-d2e658eb9911	5aedcc26-795f-4c12-9c8a-a6ac38f98c13	Star Architectural Design Partners	architectural-design-en-mlsahgtzh31	We are a professional Architectural Design service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-0c401f45-mlsahgtzh31@demo.marketplace.com	+14003613882	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	VERIFIED	2026-02-18 17:11:43.226	\N	t	f	4.3	7	BASIC	2025-03-30 01:46:40.064	2026-02-18 17:11:43.228	{}	{0c401f45-8f32-4a40-81c7-c12a0063e6f3,lang:en}
1485702f-dd07-4488-952f-a712d5941197	d8b0e6fa-f701-43ca-9948-2e98adaea26f	خبراء تصميم معماري المتميزة	ar-architectural-design-mlsahgu69c9	نحن شركة متخصصة في تقديم خدمات تصميم معماري بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-0c401f45-mlsahgu69c9@demo.marketplace.com	+966633555696	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	VERIFIED	2026-02-18 17:11:43.233	\N	t	f	4.6	24	FREE	2025-04-20 13:43:58.399	2026-02-18 17:11:43.235	{}	{0c401f45-8f32-4a40-81c7-c12a0063e6f3,lang:ar}
9e8329ac-1173-4b38-99ce-db919eb9a226	efb3ec23-e1c9-451b-b132-faeac6343dad	Top Video Production Team	video-production-en-mlsahgucf10	We are a professional Video Production service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.	\N	\N	co-en-80ba105a-mlsahgucf10@demo.marketplace.com	+15439291295	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	VERIFIED	2026-02-18 17:11:43.238	\N	t	f	4.2	34	FREE	2026-01-08 20:49:51.917	2026-02-18 17:11:43.241	{}	{80ba105a-f0fb-4361-841c-cee2fe88003d,lang:en}
2e2e74bd-4e4d-4d75-86ba-3ab0f7020767	546ef993-0ec4-434a-97be-370ac7b22791	خبراء إنتاج فيديو المتخصصة	ar-video-production-mlsahguis8l	نحن شركة متخصصة في تقديم خدمات إنتاج فيديو بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.	\N	\N	co-ar-80ba105a-mlsahguis8l@demo.marketplace.com	+966597842636	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	VERIFIED	2026-02-18 17:11:43.245	\N	t	f	4	58	PREMIUM	2025-05-05 06:51:34.351	2026-02-18 17:11:43.247	{}	{80ba105a-f0fb-4361-841c-cee2fe88003d,lang:ar}
\.


--
-- Data for Name: company_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company_documents (id, "companyId", type, "fileUrl", "fileName", "mimeType", "fileSize", status, "adminNotes", "uploadedAt", "reviewedAt") FROM stdin;
\.


--
-- Data for Name: company_matching_preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company_matching_preferences (id, "companyId", "categoryIds", "cityIds", "budgetMin", "budgetMax", "urgencyLevels", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: company_portfolio_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company_portfolio_items (id, "companyId", title, description, "imageUrl", "projectUrl", "sortOrder", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: company_services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company_services (id, "companyId", name, description, "priceFrom", "priceTo", "isActive", tags, "createdAt", "updatedAt") FROM stdin;
ef4897be-ddea-4e4a-8ba2-db99d0bf7c20	09934ff0-7d67-45d3-8410-8e1c8b3e5cd3	Legal Services	Professional Legal Services services.	410	1198	t	{}	2026-02-15 14:57:56.812	2026-02-15 14:57:56.812
99357a85-4d21-48fb-9853-08f70253aa8a	09934ff0-7d67-45d3-8410-8e1c8b3e5cd3	HVAC	Additional service: HVAC	\N	\N	t	{}	2026-02-15 14:57:56.822	2026-02-15 14:57:56.822
44479f4f-e5bb-4a3d-8b8f-cf05bdde24b0	09934ff0-7d67-45d3-8410-8e1c8b3e5cd3	Interior Design	Additional service: Interior Design	\N	\N	t	{}	2026-02-15 14:57:56.825	2026-02-15 14:57:56.825
295b9edd-95d0-40cf-a483-a5e6921acb26	6622b800-1eed-40a5-a065-7043056c8752	Interior Design	Professional Interior Design services.	408	1602	t	{}	2026-02-15 14:57:56.831	2026-02-15 14:57:56.831
0aa53779-595e-4b0a-979d-5115be0585e0	6622b800-1eed-40a5-a065-7043056c8752	Events & Entertainment	Additional service: Events & Entertainment	\N	\N	t	{}	2026-02-15 14:57:56.833	2026-02-15 14:57:56.833
d313744d-7bfe-499e-b83e-9c7df14919a0	6622b800-1eed-40a5-a065-7043056c8752	Legal Services	Additional service: Legal Services	\N	\N	t	{}	2026-02-15 14:57:56.835	2026-02-15 14:57:56.835
b6af3be3-37fd-44b7-b00b-ef2997613d64	a8e7eba3-e044-47d2-80ce-17ef63bc463c	Events & Entertainment	Professional Events & Entertainment services.	448	942	t	{}	2026-02-15 14:57:56.841	2026-02-15 14:57:56.841
20a335f7-064b-4774-973e-b89e148b9b78	a8e7eba3-e044-47d2-80ce-17ef63bc463c	Plumbing	Additional service: Plumbing	\N	\N	t	{}	2026-02-15 14:57:56.843	2026-02-15 14:57:56.843
ef6559cb-f0a8-4b94-b5d6-92e10a2d99f4	a8e7eba3-e044-47d2-80ce-17ef63bc463c	Interior Design	Additional service: Interior Design	\N	\N	t	{}	2026-02-15 14:57:56.845	2026-02-15 14:57:56.845
19fd57b3-9840-4c7a-877d-cecee348c8fe	38f19daa-ac24-4fa2-b62a-72277a1a8360	Plumbing	Professional Plumbing services.	261	1343	t	{}	2026-02-15 14:57:56.852	2026-02-15 14:57:56.852
c82021a5-714f-4d31-b40d-ccfbbc91749e	38f19daa-ac24-4fa2-b62a-72277a1a8360	Construction & Building	Additional service: Construction & Building	\N	\N	t	{}	2026-02-15 14:57:56.854	2026-02-15 14:57:56.854
02a422d2-689d-4c1b-aabc-2eef25cf58d4	38f19daa-ac24-4fa2-b62a-72277a1a8360	Photography & Video	Additional service: Photography & Video	\N	\N	t	{}	2026-02-15 14:57:56.856	2026-02-15 14:57:56.856
433a1493-4e34-4fcc-9e21-ae90304e332d	a931b943-9edf-47d6-8226-6aae1288af72	Cleaning Services	Professional Cleaning Services services.	354	649	t	{}	2026-02-15 14:57:56.863	2026-02-15 14:57:56.863
c0557f53-c007-4707-87fe-7f8335d990e3	a931b943-9edf-47d6-8226-6aae1288af72	Plumbing	Additional service: Plumbing	\N	\N	t	{}	2026-02-15 14:57:56.865	2026-02-15 14:57:56.865
c9f875cf-caf4-46d3-a74a-1276b47078da	a931b943-9edf-47d6-8226-6aae1288af72	Marketing & Advertising	Additional service: Marketing & Advertising	\N	\N	t	{}	2026-02-15 14:57:56.867	2026-02-15 14:57:56.867
55af7213-ceea-497c-bd69-5aca980fcff0	651a1131-29df-4885-a239-5f496a4df65b	Healthcare	Professional Healthcare services.	401	1275	t	{}	2026-02-15 14:57:56.874	2026-02-15 14:57:56.874
2f16218f-fb30-4b24-a1ec-91f6509a835d	c95873a0-1b7f-4207-8feb-5bb1c3dfab20	Marketing & Advertising	Professional Marketing & Advertising services.	255	943	t	{}	2026-02-15 14:57:56.88	2026-02-15 14:57:56.88
10405892-74bc-4ee3-97fd-1aa5b458c489	c95873a0-1b7f-4207-8feb-5bb1c3dfab20	Cleaning Services	Additional service: Cleaning Services	\N	\N	t	{}	2026-02-15 14:57:56.882	2026-02-15 14:57:56.882
6d46b1b7-2b98-4003-82e3-8dc0b98e0db9	c95873a0-1b7f-4207-8feb-5bb1c3dfab20	Plumbing	Additional service: Plumbing	\N	\N	t	{}	2026-02-15 14:57:56.883	2026-02-15 14:57:56.883
a3871551-94d8-4f5e-a31c-c2040d9fd7b8	b1a1f5e5-9a00-434a-b0fc-23a39a4b02cb	IT & Technology	Professional IT & Technology services.	339	1574	t	{}	2026-02-15 14:57:56.89	2026-02-15 14:57:56.89
e200847b-d3d1-41ab-bbf3-776f2a7cc0e4	b1a1f5e5-9a00-434a-b0fc-23a39a4b02cb	Legal Services	Additional service: Legal Services	\N	\N	t	{}	2026-02-15 14:57:56.892	2026-02-15 14:57:56.892
139916c3-7401-4afe-bc12-d716943b356c	898fb124-eea5-4e91-a75f-3727fa64846a	Moving & Relocation	Professional Moving & Relocation services.	306	1729	t	{}	2026-02-15 14:57:56.899	2026-02-15 14:57:56.899
93eeeefd-3645-4c93-a25f-8b44e41083dd	2d88d171-3c61-4aab-861a-cc583e6e3650	Marketing & Advertising	Professional Marketing & Advertising services.	216	1272	t	{}	2026-02-15 14:57:56.905	2026-02-15 14:57:56.905
9b9b1ba0-ac95-44cd-b566-88ec0113198e	2d88d171-3c61-4aab-861a-cc583e6e3650	Healthcare	Additional service: Healthcare	\N	\N	t	{}	2026-02-15 14:57:56.907	2026-02-15 14:57:56.907
0c60d915-984a-4d98-8100-798d42d30350	2d88d171-3c61-4aab-861a-cc583e6e3650	Education & Training	Additional service: Education & Training	\N	\N	t	{}	2026-02-15 14:57:56.908	2026-02-15 14:57:56.908
bfc11b8f-1753-4343-8cc1-98ac5ad58c73	02c49c0b-0661-4a76-bb90-8ea4eeed496e	Plumbing	Professional Plumbing services.	401	1882	t	{}	2026-02-15 14:57:56.915	2026-02-15 14:57:56.915
8f2cc003-b1d4-4a9a-8102-af1499887f14	02c49c0b-0661-4a76-bb90-8ea4eeed496e	Electrical	Additional service: Electrical	\N	\N	t	{}	2026-02-15 14:57:56.917	2026-02-15 14:57:56.917
0c87c839-b65b-4584-b312-f8fcc6fb0a89	eceb4b5f-a76f-43e0-8343-3cc6c2728171	Electrical	Professional Electrical services.	219	797	t	{}	2026-02-15 14:57:56.922	2026-02-15 14:57:56.922
570080c2-66eb-4684-a514-75617c84f145	eceb4b5f-a76f-43e0-8343-3cc6c2728171	Healthcare	Additional service: Healthcare	\N	\N	t	{}	2026-02-15 14:57:56.924	2026-02-15 14:57:56.924
4385375c-cc51-41bc-9695-d4efc0b6f683	e7858e72-5933-4390-81a5-aed38d2b1084	Interior Design	Professional Interior Design services.	207	1880	t	{}	2026-02-15 14:57:56.931	2026-02-15 14:57:56.931
c2fc7919-2617-4628-a12f-33c3db2f467e	e7858e72-5933-4390-81a5-aed38d2b1084	Accounting & Finance	Additional service: Accounting & Finance	\N	\N	t	{}	2026-02-15 14:57:56.933	2026-02-15 14:57:56.933
fc109068-f565-4bd1-ae2b-433ea9974815	dd0bec95-470e-4405-837d-3d212b92c221	Marketing & Advertising	Professional Marketing & Advertising services.	245	1071	t	{}	2026-02-15 14:57:56.938	2026-02-15 14:57:56.938
bca11992-cdc3-4789-b5f3-d2753245c965	23d07de8-6624-4169-bad5-8a1c10105b76	HVAC	Professional HVAC services.	339	1085	t	{}	2026-02-15 14:57:56.944	2026-02-15 14:57:56.944
d6e89c8c-ff0c-40ee-bb08-c40ae2c697ee	4bd71185-0c47-4a2c-8fb2-50809150c97d	Healthcare	Professional Healthcare services.	256	924	t	{}	2026-02-15 14:57:56.95	2026-02-15 14:57:56.95
04ab69f3-fd35-4c9f-9188-0d89a83c104a	bc952ede-b7fb-4e64-82d2-d652f4fa8319	Moving & Relocation	Professional Moving & Relocation services.	140	1120	t	{}	2026-02-15 14:57:56.957	2026-02-15 14:57:56.957
693b1fd0-e4e3-40e1-90c5-7a195a3cec5e	7406b765-8b22-4d42-8ee1-ec840c927403	Plumbing	Professional Plumbing services.	217	708	t	{}	2026-02-15 14:57:56.962	2026-02-15 14:57:56.962
a1bd9f32-959c-48ec-bf65-9d3334be0feb	7406b765-8b22-4d42-8ee1-ec840c927403	Transportation	Additional service: Transportation	\N	\N	t	{}	2026-02-15 14:57:56.964	2026-02-15 14:57:56.964
4e26129f-88c0-484f-98ea-ac5e965e247d	7406b765-8b22-4d42-8ee1-ec840c927403	Accounting & Finance	Additional service: Accounting & Finance	\N	\N	t	{}	2026-02-15 14:57:56.965	2026-02-15 14:57:56.965
c0dfa7b6-bf4d-4ab7-b1e7-9424f11a9e61	1cb70d6c-9679-4ca7-b997-f1c8e30bffc7	Construction & Building	Professional Construction & Building services.	224	1396	t	{}	2026-02-15 14:57:56.971	2026-02-15 14:57:56.971
8ac58e1d-b12c-4ab6-853b-9795a49f2b39	1cb70d6c-9679-4ca7-b997-f1c8e30bffc7	Accounting & Finance	Additional service: Accounting & Finance	\N	\N	t	{}	2026-02-15 14:57:56.973	2026-02-15 14:57:56.973
d37367be-9bff-4c6b-9420-12bc39bb2975	1cb70d6c-9679-4ca7-b997-f1c8e30bffc7	Marketing & Advertising	Additional service: Marketing & Advertising	\N	\N	t	{}	2026-02-15 14:57:56.974	2026-02-15 14:57:56.974
3b078d79-a029-4d2c-a4ad-50d4cf44b70a	da04413c-9221-4de2-b5c7-c6f0bed43a68	Marketing & Advertising	Professional Marketing & Advertising services.	360	782	t	{}	2026-02-15 14:57:56.98	2026-02-15 14:57:56.98
9943013b-77c9-4862-a045-ffc87fc38510	da04413c-9221-4de2-b5c7-c6f0bed43a68	Education & Training	Additional service: Education & Training	\N	\N	t	{}	2026-02-15 14:57:56.982	2026-02-15 14:57:56.982
660d7baf-5b1f-47e0-b730-2bfce2cc1f01	da04413c-9221-4de2-b5c7-c6f0bed43a68	Education & Training	Additional service: Education & Training	\N	\N	t	{}	2026-02-15 14:57:56.985	2026-02-15 14:57:56.985
08c6b76b-ad58-41be-b571-cf00959a565a	c34fbba1-6879-452f-aa00-f24807bdae67	IT & Technology	Professional IT & Technology services.	361	693	t	{}	2026-02-15 14:57:56.99	2026-02-15 14:57:56.99
53593e94-da7a-41ce-a669-754f0a2598a6	c34fbba1-6879-452f-aa00-f24807bdae67	Plumbing	Additional service: Plumbing	\N	\N	t	{}	2026-02-15 14:57:56.992	2026-02-15 14:57:56.992
df355f2f-773b-436b-b6b8-2909665e7ce0	f3e5c31c-fc5d-4f9a-9b89-48b48bbd2ccc	IT & Technology	Professional IT & Technology services.	379	1738	t	{}	2026-02-15 14:57:56.997	2026-02-15 14:57:56.997
e041be92-c980-4284-a754-0988be5f039a	f3e5c31c-fc5d-4f9a-9b89-48b48bbd2ccc	Education & Training	Additional service: Education & Training	\N	\N	t	{}	2026-02-15 14:57:56.999	2026-02-15 14:57:56.999
73853af5-de49-43dd-8ca2-b501aab792b3	f3e5c31c-fc5d-4f9a-9b89-48b48bbd2ccc	Construction & Building	Additional service: Construction & Building	\N	\N	t	{}	2026-02-15 14:57:57.001	2026-02-15 14:57:57.001
6bb8808e-cdc1-4709-8297-38f81a352396	a3ddeb1a-b884-440f-bf1e-f356f3475390	Construction & Building	Professional Construction & Building services.	336	1425	t	{}	2026-02-15 14:57:57.006	2026-02-15 14:57:57.006
e15396a7-237d-43e3-9a58-efc47f2edb23	a3ddeb1a-b884-440f-bf1e-f356f3475390	Legal Services	Additional service: Legal Services	\N	\N	t	{}	2026-02-15 14:57:57.007	2026-02-15 14:57:57.007
3d613b6b-b273-4a6a-887f-971c1dd8c034	a3ddeb1a-b884-440f-bf1e-f356f3475390	Photography & Video	Additional service: Photography & Video	\N	\N	t	{}	2026-02-15 14:57:57.009	2026-02-15 14:57:57.009
6606c5ad-3305-4cc8-91ee-c6fa62e30932	2f9b30b0-f459-442b-916e-916ecf6c15f0	Plumbing	Professional Plumbing services.	189	1392	t	{}	2026-02-15 14:57:57.016	2026-02-15 14:57:57.016
a3a21195-e849-4bfb-aa85-64562570c2b2	831f4768-84c9-4565-8df4-4ea85b58cdc4	Interior Design	Professional Interior Design services.	307	983	t	{}	2026-02-15 14:57:57.02	2026-02-15 14:57:57.02
740eaa9f-7909-436a-8e26-d84b8c7f98da	2ac795a8-68f4-4e28-9f02-7d59dd441378	Plumbing	Professional Plumbing services.	412	827	t	{}	2026-02-15 14:57:57.026	2026-02-15 14:57:57.026
8b3ce1d8-3f4e-4368-9210-e18b8bd98f7b	2ac795a8-68f4-4e28-9f02-7d59dd441378	Marketing & Advertising	Additional service: Marketing & Advertising	\N	\N	t	{}	2026-02-15 14:57:57.028	2026-02-15 14:57:57.028
60f655ce-199d-414d-934a-a114c78b1ced	e1136d43-b708-4c0b-91da-abc62271ed7c	Accounting & Finance	Professional Accounting & Finance services.	499	1787	t	{}	2026-02-15 14:57:57.032	2026-02-15 14:57:57.032
34c39256-16ae-4a11-bc4c-ba85819b8e1f	e1136d43-b708-4c0b-91da-abc62271ed7c	Construction & Building	Additional service: Construction & Building	\N	\N	t	{}	2026-02-15 14:57:57.034	2026-02-15 14:57:57.034
d615f7e7-a98f-4e5b-a3b0-9e766f121ae5	a8d3b2c7-a0de-4ef1-8125-6f968dec232e	Plumbing	Professional Plumbing services.	193	670	t	{}	2026-02-15 14:57:57.04	2026-02-15 14:57:57.04
64982237-ab7e-40f4-83d1-dea017f63276	a8d3b2c7-a0de-4ef1-8125-6f968dec232e	Electrical	Additional service: Electrical	\N	\N	t	{}	2026-02-15 14:57:57.042	2026-02-15 14:57:57.042
79ca9b7c-f2db-4078-80fb-f176c0784122	a8d3b2c7-a0de-4ef1-8125-6f968dec232e	Legal Services	Additional service: Legal Services	\N	\N	t	{}	2026-02-15 14:57:57.043	2026-02-15 14:57:57.043
303c897b-103e-40a4-b12c-3f255b51466e	2b1a0d4f-64c8-4d5a-bc4a-55b1d1ef2d7f	Transportation	Professional Transportation services.	401	779	t	{}	2026-02-15 14:57:57.048	2026-02-15 14:57:57.048
f96abc40-ab9f-4ab8-8c24-151e8724e787	2b1a0d4f-64c8-4d5a-bc4a-55b1d1ef2d7f	Plumbing	Additional service: Plumbing	\N	\N	t	{}	2026-02-15 14:57:57.049	2026-02-15 14:57:57.049
5e96dd21-eae3-42e6-8a30-96ae4fcfbae4	c3ef53dd-e544-4ba3-ad12-498d7dcd1d6a	Interior Design	Professional Interior Design services.	108	803	t	{}	2026-02-15 14:57:57.055	2026-02-15 14:57:57.055
ab3cb475-cf9d-4ac8-acf7-4b42be6818d8	c3ef53dd-e544-4ba3-ad12-498d7dcd1d6a	Legal Services	Additional service: Legal Services	\N	\N	t	{}	2026-02-15 14:57:57.057	2026-02-15 14:57:57.057
97f3afeb-fd1a-4398-8759-d8792ec27fd8	c3ef53dd-e544-4ba3-ad12-498d7dcd1d6a	Photography & Video	Additional service: Photography & Video	\N	\N	t	{}	2026-02-15 14:57:57.058	2026-02-15 14:57:57.058
9a973149-384a-4dc7-b1a8-21bd2e30ec7a	09fca32f-1763-4fcd-a4a5-53355dc6a1b6	Interior Design	Professional Interior Design services.	459	1722	t	{}	2026-02-15 14:57:57.062	2026-02-15 14:57:57.062
7223087d-3e27-47b5-a0a6-d8d89e8f8238	1a56e389-835f-47d6-a343-a7082cf48da8	Cleaning Services	Professional Cleaning Services services.	476	1909	t	{}	2026-02-15 14:57:57.069	2026-02-15 14:57:57.069
ad7d19c3-5587-4cd9-94e5-95d52babf2c9	1a56e389-835f-47d6-a343-a7082cf48da8	Moving & Relocation	Additional service: Moving & Relocation	\N	\N	t	{}	2026-02-15 14:57:57.07	2026-02-15 14:57:57.07
5f8ce9af-7e81-4384-997c-781102f18004	1a56e389-835f-47d6-a343-a7082cf48da8	IT & Technology	Additional service: IT & Technology	\N	\N	t	{}	2026-02-15 14:57:57.071	2026-02-15 14:57:57.071
8c70e70e-07f8-4487-b635-c1686a0b4d4e	8f98efa5-0537-468b-8824-a8d5ae06f70a	Moving & Relocation	Professional Moving & Relocation services.	393	1762	t	{}	2026-02-15 14:57:57.078	2026-02-15 14:57:57.078
92cd9198-8a24-41df-8fed-f11f70388726	8f98efa5-0537-468b-8824-a8d5ae06f70a	Education & Training	Additional service: Education & Training	\N	\N	t	{}	2026-02-15 14:57:57.08	2026-02-15 14:57:57.08
6289ccbd-4b80-4dfb-b21c-7fb4440c9eac	8f98efa5-0537-468b-8824-a8d5ae06f70a	Interior Design	Additional service: Interior Design	\N	\N	t	{}	2026-02-15 14:57:57.082	2026-02-15 14:57:57.082
3a831b47-c519-46f6-bf54-f10ddd245ad8	632e5803-222d-4d47-977b-9158fbd6c5ed	Moving & Relocation	Professional Moving & Relocation services.	496	1340	t	{}	2026-02-15 14:57:57.087	2026-02-15 14:57:57.087
ebf1751f-8661-4e38-85e7-6da47e1a697c	632e5803-222d-4d47-977b-9158fbd6c5ed	Accounting & Finance	Additional service: Accounting & Finance	\N	\N	t	{}	2026-02-15 14:57:57.088	2026-02-15 14:57:57.088
0c0289ac-e4a8-41a5-8e62-22f67db3df89	632e5803-222d-4d47-977b-9158fbd6c5ed	Education & Training	Additional service: Education & Training	\N	\N	t	{}	2026-02-15 14:57:57.089	2026-02-15 14:57:57.089
5312d5f2-840a-4aab-ad86-f7f7637147d1	053bf10d-775c-415b-b666-77c9ef5581fb	Photography & Video	Professional Photography & Video services.	165	1860	t	{}	2026-02-15 14:57:57.095	2026-02-15 14:57:57.095
10d8b1a0-7890-4a10-a532-c02f54250c6a	053bf10d-775c-415b-b666-77c9ef5581fb	Interior Design	Additional service: Interior Design	\N	\N	t	{}	2026-02-15 14:57:57.097	2026-02-15 14:57:57.097
20f2d429-10cb-41c7-8af6-51412f6b12cd	053bf10d-775c-415b-b666-77c9ef5581fb	HVAC	Additional service: HVAC	\N	\N	t	{}	2026-02-15 14:57:57.099	2026-02-15 14:57:57.099
baec30f0-d65b-4594-98fb-b70dd88abae2	8687adaa-2226-4eed-a750-5fe5d1b4d443	Cleaning Services	Professional Cleaning Services services.	143	1893	t	{}	2026-02-15 14:57:57.103	2026-02-15 14:57:57.103
c4992a06-a22d-44f3-8ad2-b9e97ecc77a3	8687adaa-2226-4eed-a750-5fe5d1b4d443	Healthcare	Additional service: Healthcare	\N	\N	t	{}	2026-02-15 14:57:57.105	2026-02-15 14:57:57.105
b3246329-58a4-4619-91b7-3700e4a73ede	8687adaa-2226-4eed-a750-5fe5d1b4d443	Moving & Relocation	Additional service: Moving & Relocation	\N	\N	t	{}	2026-02-15 14:57:57.107	2026-02-15 14:57:57.107
0333d273-7286-42c9-b0e5-3c1ad5ebc013	3b3858bb-defc-4224-a78c-0d9b78cb0422	Events & Entertainment	Professional Events & Entertainment services.	299	1108	t	{}	2026-02-15 14:57:57.114	2026-02-15 14:57:57.114
4c740884-9c2c-46e3-8f6a-48a5acd6309c	3b3858bb-defc-4224-a78c-0d9b78cb0422	Photography & Video	Additional service: Photography & Video	\N	\N	t	{}	2026-02-15 14:57:57.115	2026-02-15 14:57:57.115
2dbb1fab-5cef-4739-8247-12a8d780208c	3b3858bb-defc-4224-a78c-0d9b78cb0422	Marketing & Advertising	Additional service: Marketing & Advertising	\N	\N	t	{}	2026-02-15 14:57:57.116	2026-02-15 14:57:57.116
f6bac5fa-0a7b-4bba-95b4-2097a372b4e3	971dda5d-9fcb-4f63-bc4e-b7311d910995	Photography & Video	Professional Photography & Video services.	291	680	t	{}	2026-02-15 14:57:57.122	2026-02-15 14:57:57.122
9e83bfb4-1819-4bbf-be31-2035f3e624a4	dd0beeee-aafe-4d80-95b4-98af7a591d08	Electrical	Professional Electrical services.	347	835	t	{}	2026-02-15 14:57:57.128	2026-02-15 14:57:57.128
580ed8d0-2e4d-451a-910f-a2710be83c95	e34dd89c-ac5a-410b-9af7-78bf92be3380	HVAC	Professional HVAC services.	237	921	t	{}	2026-02-15 14:57:57.133	2026-02-15 14:57:57.133
fbff6da5-33cb-4c74-86c5-361268fc356e	e34dd89c-ac5a-410b-9af7-78bf92be3380	Accounting & Finance	Additional service: Accounting & Finance	\N	\N	t	{}	2026-02-15 14:57:57.135	2026-02-15 14:57:57.135
b62794da-8bbe-442c-8d66-26021424706f	e34dd89c-ac5a-410b-9af7-78bf92be3380	Plumbing	Additional service: Plumbing	\N	\N	t	{}	2026-02-15 14:57:57.138	2026-02-15 14:57:57.138
335db30c-986a-410b-8899-567b66013aca	e02ee9ba-fbab-41f2-ae87-c5cb9b176793	Legal Services	Professional Legal Services services.	332	1120	t	{}	2026-02-15 14:57:57.143	2026-02-15 14:57:57.143
11ecfd48-01e6-4e33-9a97-fc0096802c43	e02ee9ba-fbab-41f2-ae87-c5cb9b176793	Healthcare	Additional service: Healthcare	\N	\N	t	{}	2026-02-15 14:57:57.144	2026-02-15 14:57:57.144
58dadaa3-47e5-45e1-8bb9-88a6394f72c5	12d3948f-3116-4d18-bf40-c1733feeda88	Legal Services	Professional Legal Services services.	402	1843	t	{}	2026-02-15 14:57:57.15	2026-02-15 14:57:57.15
fdb11432-487e-48fa-b307-06f3f6d889f5	12d3948f-3116-4d18-bf40-c1733feeda88	Cleaning Services	Additional service: Cleaning Services	\N	\N	t	{}	2026-02-15 14:57:57.152	2026-02-15 14:57:57.152
8d3cfb15-ec5a-4eb7-90b7-ae8356f77506	ecf4ec72-2dfb-4088-b886-b3c2d4c36801	Electrical	Professional Electrical services.	244	1683	t	{}	2026-02-15 14:57:57.157	2026-02-15 14:57:57.157
6731c697-f0af-4592-80d1-2ebb8897b115	81bddc12-aa07-4e3b-9381-eb806592bb1c	Education & Training	Professional Education & Training services.	436	728	t	{}	2026-02-15 14:57:57.162	2026-02-15 14:57:57.162
244cc930-e3d2-4aa0-929a-5e11cb6b1c31	81bddc12-aa07-4e3b-9381-eb806592bb1c	Healthcare	Additional service: Healthcare	\N	\N	t	{}	2026-02-15 14:57:57.164	2026-02-15 14:57:57.164
b48ab154-e7e2-4928-b2ed-b58b39e3d9d6	3dc17100-d4f2-447d-8afd-f6c460d5437a	Legal Services	Professional Legal Services services.	261	1192	t	{}	2026-02-15 14:57:57.17	2026-02-15 14:57:57.17
54c90686-c4d7-49ab-804c-57046279c504	3dc17100-d4f2-447d-8afd-f6c460d5437a	Transportation	Additional service: Transportation	\N	\N	t	{}	2026-02-15 14:57:57.171	2026-02-15 14:57:57.171
ce278efb-4b54-4cda-90ba-d398b51dc703	7f95a622-3350-4e20-be5b-028d3f1a6bfc	IT & Technology	Professional IT & Technology services.	222	1360	t	{}	2026-02-15 14:57:57.176	2026-02-15 14:57:57.176
ab3b7bea-3b97-4bef-bca1-c780f22478b2	bbf90c29-cff6-40a1-960e-af2be3d3f6ea	Legal Services	Professional Legal Services services.	115	883	t	{}	2026-02-15 14:57:57.182	2026-02-15 14:57:57.182
edd6bef4-57d5-4741-9f14-6dc39c3bb1b4	68cc0eda-195d-4e30-a133-6b00a158316e	Education & Training	Professional Education & Training services.	304	1596	t	{}	2026-02-15 14:57:57.186	2026-02-15 14:57:57.186
cde6d5a6-13f0-467e-a831-d6cc32eddeb3	68cc0eda-195d-4e30-a133-6b00a158316e	IT & Technology	Additional service: IT & Technology	\N	\N	t	{}	2026-02-15 14:57:57.187	2026-02-15 14:57:57.187
5f710c67-d8d1-458f-b87e-f0435f956783	65e42772-ed92-444e-9299-d0693da9c0da	Electrical	Professional Electrical services.	109	761	t	{}	2026-02-15 14:57:57.194	2026-02-15 14:57:57.194
e1a88e4d-2a8a-4c83-835c-bb83552aa633	65e42772-ed92-444e-9299-d0693da9c0da	Legal Services	Additional service: Legal Services	\N	\N	t	{}	2026-02-15 14:57:57.196	2026-02-15 14:57:57.196
81960e9b-5090-4888-b831-93bb7c0ef824	d0756acd-e685-4c61-bbc6-f5048fb2a008	Electrical	Professional Electrical services.	335	1488	t	{}	2026-02-15 14:57:57.2	2026-02-15 14:57:57.2
b5424834-1c4f-4f7d-8b57-eac77e12587b	a84f8507-9ad1-49f8-870f-3633631e82e6	Video Production	Service provided in category: Video Production	\N	\N	t	{BOTH,"إنتاج فيديو"}	2026-02-18 09:28:33.621	2026-02-18 09:28:33.621
431f91b7-44bb-4a16-b3d5-7eb24b0fbf6a	a3c32361-e862-490a-9bff-d1ed70232cdd	Furniture Moving	Service provided in category: Furniture Moving	\N	\N	t	{BOTH,"نقل أثاث"}	2026-02-18 11:22:15.279	2026-02-18 11:22:15.279
fa5a628c-ae15-4163-a87c-831dae6a74ea	a3c32361-e862-490a-9bff-d1ed70232cdd	Packing Services	Service provided in category: Packing Services	\N	\N	t	{BOTH,"خدمات تغليف"}	2026-02-18 11:22:15.294	2026-02-18 11:22:15.294
4b36fbce-3612-4242-9a9a-1fc0f1bffe4f	a3c32361-e862-490a-9bff-d1ed70232cdd	Storage Services	Service provided in category: Storage Services	\N	\N	t	{BOTH,"خدمات تخزين"}	2026-02-18 11:22:15.296	2026-02-18 11:22:15.296
dc53a1ea-a409-4358-913a-9f369264fb51	02b117e8-c46b-48c3-bd84-72a036e5bb92	Thermostat Install	Service provided in category: Thermostat Install	\N	\N	t	{BOTH,"تركيب ترموستات"}	2026-02-18 11:24:43.88	2026-02-18 11:24:43.88
ec485895-ece2-4752-b3ce-c0cd6639593a	02b117e8-c46b-48c3-bd84-72a036e5bb92	HVAC Inspection	Service provided in category: HVAC Inspection	\N	\N	t	{BOTH,"فحص أنظمة التكييف"}	2026-02-18 11:24:43.885	2026-02-18 11:24:43.885
\.


--
-- Data for Name: company_social_links; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company_social_links (id, "companyId", facebook, twitter, instagram, linkedin, youtube) FROM stdin;
9f183fb8-82e8-4eb4-a30a-bc9befa8c03f	a5f91ac4-4c87-4654-9b5c-9cb7e79fb200	\N	\N	\N	\N	\N
\.


--
-- Data for Name: company_working_hours; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company_working_hours (id, "companyId", monday, tuesday, wednesday, thursday, friday, saturday, sunday, "timeZone") FROM stdin;
\.


--
-- Data for Name: countries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.countries (id, code, "nameAr", "nameEn", "isActive") FROM stdin;
578bae1f-39a4-4f77-bd22-8061a7c3a9d5	SY	سوريا	Syria	t
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (id, name, "nameAr", description, "isActive", "createdAt", "updatedAt") FROM stdin;
1be6d281-edb7-4ead-a7e0-ec6f65d8d5cc	Management	الإدارة	Executive and senior management team	t	2026-02-18 11:51:07.894	2026-02-18 11:51:07.894
b2c4c477-fb04-4e15-ab20-127a53c351dc	Customer Support	دعم العملاء	Handles customer inquiries and support requests	t	2026-02-18 11:51:07.9	2026-02-18 11:51:07.9
c6b35048-59fe-45d8-a9d2-273f056d0cd1	Operations	العمليات	Day-to-day platform operations	t	2026-02-18 11:51:07.903	2026-02-18 11:51:07.903
f167c8c8-ed3c-4c7f-b9b2-ee36e33b960d	Content & Marketing	المحتوى والتسويق	Manages content, marketing, and communications	t	2026-02-18 11:51:07.906	2026-02-18 11:51:07.906
c8fa1eeb-3a89-47c8-af3e-306bc0911dde	Technical	التقني	Technical team and development	t	2026-02-18 11:51:07.909	2026-02-18 11:51:07.909
\.


--
-- Data for Name: feature_flags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.feature_flags (id, key, value, description, category, "createdAt", "updatedAt", "descriptionAr", "isDynamic", "nameAr", "nameEn", "sortOrder") FROM stdin;
\.


--
-- Data for Name: flag_audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.flag_audit_logs (id, "flagId", "flagKey", "adminId", "adminName", "prevValue", "newValue", "createdAt") FROM stdin;
\.


--
-- Data for Name: health_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.health_logs (id, service, category, status, "latencyMs", "statusCode", "errorMessage", url, details, "retryCount", "testedAt", source) FROM stdin;
cmm6oljsn0000n3tsj8mt11wt	db-connection	DATABASE	OK	140	\N	\N	\N	\N	0	2026-02-28 18:55:34.775	synthetic
cmm6oljst0001n3tsy2uwrw7i	auth-login-workflow	AUTH	OK	1823	401	\N	http://localhost:3000/api/auth/login	\N	0	2026-02-28 18:55:34.781	synthetic
cmm6oljsw0002n3tspj6soqx3	request-post-workflow	REQUESTS	OK	1799	401	\N	http://localhost:3000/api/requests	\N	0	2026-02-28 18:55:34.784	synthetic
cmm6oljsy0003n3tsdec7szpv	api-categories	API	OK	1813	200	\N	http://localhost:3000/api/categories	\N	0	2026-02-28 18:55:34.787	synthetic
cmm6oljt10004n3ts6k8x3lpz	api-requests-list	REQUESTS	OK	81	200	\N	http://localhost:3000/api/requests	\N	0	2026-02-28 18:55:34.789	synthetic
cmm6oljt30005n3ts13kjt5ky	api-auth-session	AUTH	OK	952	200	\N	http://localhost:3000/api/auth/session	\N	0	2026-02-28 18:55:34.791	synthetic
cmm6oljt50006n3tsp79200qt	api-upload-health	UPLOADS	OK	408	405	\N	http://localhost:3000/api/upload	\N	0	2026-02-28 18:55:34.793	synthetic
cmm6oljt70007n3tsqsojjep0	api-notifications	MESSAGING	OK	15	401	\N	http://localhost:3000/api/notifications	\N	0	2026-02-28 18:55:34.795	synthetic
cmm6oljta0008n3tskykcykqo	security-xss-probe	SECURITY	OK	1806	200	\N	http://localhost:3000/api/requests?search=%3Cscript%3Ealert(1)%3C%2Fscript%3E	\N	0	2026-02-28 18:55:34.798	synthetic
cmm6oljtc0009n3ts47b7hnj4	security-sqli-probe	SECURITY	OK	74	200	\N	http://localhost:3000/api/requests?search=' OR '1'='1	\N	0	2026-02-28 18:55:34.8	synthetic
cmm6oljte000an3ts7tbj4q64	security-auth-bypass	SECURITY	OK	19	401	\N	http://localhost:3000/api/admin/users	\N	0	2026-02-28 18:55:34.802	synthetic
cmm6on0kg000bn3tsxu4v1oxi	db-connection	DATABASE	OK	94	\N	\N	\N	\N	0	2026-02-28 18:56:43.169	synthetic
cmm6on0ko000cn3tsq8e1t6ty	auth-login-workflow	AUTH	OK	297	401	\N	http://localhost:3000/api/auth/login	\N	0	2026-02-28 18:56:43.177	synthetic
cmm6on0kr000dn3ts3k35otre	request-post-workflow	REQUESTS	OK	275	401	\N	http://localhost:3000/api/requests	\N	0	2026-02-28 18:56:43.179	synthetic
cmm6on0ks000en3tsszkxcjmw	api-categories	API	OK	113	200	\N	http://localhost:3000/api/categories	\N	0	2026-02-28 18:56:43.181	synthetic
cmm6on0ku000fn3tsujz5ag3l	api-requests-list	REQUESTS	OK	235	200	\N	http://localhost:3000/api/requests	\N	0	2026-02-28 18:56:43.182	synthetic
cmm6on0kv000gn3ts4kig1xru	api-auth-session	AUTH	OK	83	200	\N	http://localhost:3000/api/auth/session	\N	0	2026-02-28 18:56:43.184	synthetic
cmm6on0kw000hn3tsz4xhhbcl	api-upload-health	UPLOADS	OK	40	405	\N	http://localhost:3000/api/upload	\N	0	2026-02-28 18:56:43.185	synthetic
cmm6on0ky000in3ts4makwre4	api-notifications	MESSAGING	OK	11	401	\N	http://localhost:3000/api/notifications	\N	0	2026-02-28 18:56:43.186	synthetic
cmm6on0kz000jn3tsj2hr2wn0	security-xss-probe	SECURITY	OK	275	200	\N	http://localhost:3000/api/requests?search=%3Cscript%3Ealert(1)%3C%2Fscript%3E	\N	0	2026-02-28 18:56:43.188	synthetic
cmm6on0l0000kn3tsp8j5w77y	security-sqli-probe	SECURITY	OK	84	200	\N	http://localhost:3000/api/requests?search=' OR '1'='1	\N	0	2026-02-28 18:56:43.189	synthetic
cmm6on0l2000ln3tsb8gcdy30	security-auth-bypass	SECURITY	OK	22	401	\N	http://localhost:3000/api/admin/users	\N	0	2026-02-28 18:56:43.191	synthetic
cmm6oopb4000mn3tse0icpglp	db-connection	DATABASE	OK	81	\N	\N	\N	\N	0	2026-02-28 18:58:01.889	synthetic
cmm6oopb8000nn3tsnik4ovus	auth-login-workflow	AUTH	OK	1882	401	\N	http://localhost:3000/api/auth/login	\N	0	2026-02-28 18:58:01.893	synthetic
cmm6oopba000on3tsoqhckl47	request-post-workflow	REQUESTS	OK	1858	401	\N	http://localhost:3000/api/requests	\N	0	2026-02-28 18:58:01.895	synthetic
cmm6oopbc000pn3ts0mti0lht	api-categories	API	OK	1877	200	\N	http://localhost:3000/api/categories	\N	0	2026-02-28 18:58:01.896	synthetic
cmm6oopbd000qn3tsj4h2ojam	api-requests-list	REQUESTS	OK	146	200	\N	http://localhost:3000/api/requests	\N	0	2026-02-28 18:58:01.897	synthetic
cmm6oopbe000rn3tsotxs0n38	api-auth-session	AUTH	OK	432	200	\N	http://localhost:3000/api/auth/session	\N	0	2026-02-28 18:58:01.899	synthetic
cmm6oopbh000sn3tskprb86f5	api-upload-health	UPLOADS	OK	450	405	\N	http://localhost:3000/api/upload	\N	0	2026-02-28 18:58:01.902	synthetic
cmm6oopbj000tn3ts8c4uu0ev	api-notifications	MESSAGING	OK	9	401	\N	http://localhost:3000/api/notifications	\N	0	2026-02-28 18:58:01.904	synthetic
cmm6oopbl000un3tsjzde961i	security-xss-probe	SECURITY	OK	1871	200	\N	http://localhost:3000/api/requests?search=%3Cscript%3Ealert(1)%3C%2Fscript%3E	\N	0	2026-02-28 18:58:01.906	synthetic
cmm6oopbn000vn3ts733flpim	security-sqli-probe	SECURITY	OK	92	200	\N	http://localhost:3000/api/requests?search=' OR '1'='1	\N	0	2026-02-28 18:58:01.908	synthetic
cmm6oopbp000wn3tsnuziwy2j	security-auth-bypass	SECURITY	OK	15	401	\N	http://localhost:3000/api/admin/users	\N	0	2026-02-28 18:58:01.909	synthetic
cmm6p8g0b0000h33hl41q0usk	db-connection	DATABASE	OK	84	\N	\N	\N	\N	0	2026-02-28 19:13:22.955	synthetic
cmm6p8g0j0001h33hbok886rq	auth-login-workflow	AUTH	OK	1986	401	\N	http://localhost:3000/api/auth/login	\N	0	2026-02-28 19:13:22.964	synthetic
cmm6p8g0n0002h33hgtmtej6m	request-post-workflow	REQUESTS	OK	1963	401	\N	http://localhost:3000/api/requests	\N	0	2026-02-28 19:13:22.968	synthetic
cmm6p8g0p0003h33h3o02do0r	api-categories	API	OK	1975	200	\N	http://localhost:3000/api/categories	\N	0	2026-02-28 19:13:22.97	synthetic
cmm6p8g0r0004h33h75q9riy2	api-requests-list	REQUESTS	OK	167	200	\N	http://localhost:3000/api/requests	\N	0	2026-02-28 19:13:22.971	synthetic
cmm6p8g0t0005h33htmtp7t7m	api-auth-session	AUTH	OK	960	200	\N	http://localhost:3000/api/auth/session	\N	0	2026-02-28 19:13:22.974	synthetic
cmm6p8g0v0006h33het12hk0r	api-upload-health	UPLOADS	OK	375	405	\N	http://localhost:3000/api/upload	\N	0	2026-02-28 19:13:22.976	synthetic
cmm6p8g0x0007h33h5jbjxh12	api-notifications	MESSAGING	OK	17	401	\N	http://localhost:3000/api/notifications	\N	0	2026-02-28 19:13:22.978	synthetic
cmm6p8g100008h33h2gn0n7da	security-xss-probe	SECURITY	OK	1968	200	\N	http://localhost:3000/api/requests?search=%3Cscript%3Ealert(1)%3C%2Fscript%3E	\N	0	2026-02-28 19:13:22.981	synthetic
cmm6p8g120009h33h0llrtteg	security-sqli-probe	SECURITY	OK	142	200	\N	http://localhost:3000/api/requests?search=' OR '1'='1	\N	0	2026-02-28 19:13:22.983	synthetic
cmm6p8g14000ah33hn8533q49	security-auth-bypass	SECURITY	OK	28	401	\N	http://localhost:3000/api/admin/users	\N	0	2026-02-28 19:13:22.985	synthetic
cmm6pargg000bh33hx68piffu	db-connection	DATABASE	OK	78	\N	\N	\N	\N	0	2026-02-28 19:15:11.105	synthetic
cmm6pargo000ch33h1swaxina	auth-login-workflow	AUTH	OK	690	401	\N	http://localhost:3000/api/auth/login	\N	0	2026-02-28 19:15:11.113	synthetic
cmm6pargq000dh33h5akn028y	request-post-workflow	REQUESTS	OK	669	401	\N	http://localhost:3000/api/requests	\N	0	2026-02-28 19:15:11.114	synthetic
cmm6pargs000eh33hsjw8qzg1	api-categories	API	OK	679	200	\N	http://localhost:3000/api/categories	\N	0	2026-02-28 19:15:11.116	synthetic
cmm6pargu000fh33hk1ewqcar	api-requests-list	REQUESTS	OK	131	200	\N	http://localhost:3000/api/requests	\N	0	2026-02-28 19:15:11.118	synthetic
cmm6pargv000gh33hsjcck30f	api-auth-session	AUTH	OK	545	200	\N	http://localhost:3000/api/auth/session	\N	0	2026-02-28 19:15:11.119	synthetic
cmm6pargw000hh33hcluremjh	api-upload-health	UPLOADS	OK	326	405	\N	http://localhost:3000/api/upload	\N	0	2026-02-28 19:15:11.121	synthetic
cmm6pargy000ih33h9r2uhi0z	api-notifications	MESSAGING	OK	10	401	\N	http://localhost:3000/api/notifications	\N	0	2026-02-28 19:15:11.122	synthetic
cmm6pargz000jh33hf5s7plff	security-xss-probe	SECURITY	OK	675	200	\N	http://localhost:3000/api/requests?search=%3Cscript%3Ealert(1)%3C%2Fscript%3E	\N	0	2026-02-28 19:15:11.123	synthetic
cmm6parh0000kh33ho1i33flu	security-sqli-probe	SECURITY	OK	69	200	\N	http://localhost:3000/api/requests?search=' OR '1'='1	\N	0	2026-02-28 19:15:11.125	synthetic
cmm6parh2000lh33h4qfkzy06	security-auth-bypass	SECURITY	OK	14	401	\N	http://localhost:3000/api/admin/users	\N	0	2026-02-28 19:15:11.127	synthetic
\.


--
-- Data for Name: internal_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.internal_messages (id, "senderId", "recipientId", "departmentId", subject, content, "isRead", priority, "createdAt") FROM stdin;
\.


--
-- Data for Name: membership_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.membership_plans (id, name, description, price, currency, duration, features, "isActive", "createdAt", "updatedAt") FROM stdin;
0cc1523c-3f6f-4c29-bfb9-1a8feddeff20	Basic	Perfect for small businesses starting out	0	SYP	MONTHLY	["List your company", "Receive up to 5 offers/month", "Basic profile"]	t	2026-02-15 14:30:20.271	2026-02-20 09:47:46.898
7e49c5c0-3997-44ea-9ef0-72619f1da2d4	Professional	For growing businesses that need more visibility	50000	SYP	MONTHLY	["Unlimited offers", "Priority listing", "Verified badge", "Analytics dashboard"]	t	2026-02-15 14:30:20.278	2026-02-20 09:47:46.909
cd657866-f756-4827-b6b3-a82516a888f6	Enterprise	For large companies seeking maximum exposure	150000	SYP	MONTHLY	["Everything in Professional", "Featured company", "Dedicated support", "Custom branding", "API access"]	t	2026-02-15 14:30:20.28	2026-02-20 09:47:46.911
\.


--
-- Data for Name: memberships; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.memberships (id, "companyId", "planId", "startDate", "endDate", status, "autoRenew", "paymentMethod", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, "senderId", "recipientId", content, "isRead", "projectId", "requestId", "createdAt") FROM stdin;
983870d7-844d-45d2-8291-3f3fb7abe3d0	366db2af-9cf4-45d6-b0b7-896f68acd563	b96647af-284a-45d0-a08d-4853f9d59fbc	thanks 	t	\N	\N	2026-03-03 11:08:42.374
\.


--
-- Data for Name: notification_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification_settings (id, "userId", "emailNewOffers", "emailRequestUpdates", "emailMessages", "emailMarketing", "emailSecurityAlerts", "pushNewOffers", "pushRequestUpdates", "pushMessages", "smsSecurityAlerts", "smsMarketing", "createdAt", "updatedAt") FROM stdin;
62077ddd-033b-4857-afad-d2bd74196c27	b96647af-284a-45d0-a08d-4853f9d59fbc	t	t	t	f	t	t	t	t	t	f	2026-02-18 12:05:43.926	2026-02-18 12:05:43.926
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, "userId", type, title, message, data, "isRead", "createdAt") FROM stdin;
d23755d4-0379-4bdf-96cb-ec484e47bbc0	366db2af-9cf4-45d6-b0b7-896f68acd563	PROJECT	Offer Accepted - New Project	Your offer for "AAAAAAA" has been accepted! A new project has been created.	{"offerId": "6ab0cb93-cf4f-4a31-b2ce-a9ed9267fa22", "projectId": "98fd938a-1c1c-4bee-b0f6-64107f9eb5e2"}	f	2026-03-02 09:31:30.083
f1a11cff-0527-401e-bb52-f30a8ee0dc05	b96647af-284a-45d0-a08d-4853f9d59fbc	OFFER	New Offer Received	Verified Company submitted an offer on your project "DDDDDD".	{"offerId": "4dc222ef-0f9f-4319-ae8a-ff6d4d0b0cd3", "requestId": "28960d08-d878-42e7-9f4d-51fdc92abaa1"}	f	2026-03-02 10:46:06.452
2e42e048-da09-4586-8c91-ec73f5ab8fa8	366db2af-9cf4-45d6-b0b7-896f68acd563	PROJECT	Offer Accepted - New Project	Your offer for "DDDDDD" has been accepted! A new project has been created.	{"offerId": "4dc222ef-0f9f-4319-ae8a-ff6d4d0b0cd3", "projectId": "563886a6-a870-49de-b215-9802626e97f7"}	f	2026-03-02 13:24:18.298
76b0ece6-3d7e-4701-8ace-7970a39d5ecd	b96647af-284a-45d0-a08d-4853f9d59fbc	MESSAGE	New Message	You have a new message from Verified Company	{"senderId": "366db2af-9cf4-45d6-b0b7-896f68acd563", "messageId": "983870d7-844d-45d2-8291-3f3fb7abe3d0"}	f	2026-03-03 11:08:42.383
\.


--
-- Data for Name: offers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.offers (id, "requestId", "companyId", price, currency, description, "estimatedDays", attachments, message, status, "expiresAt", "createdAt", "updatedAt") FROM stdin;
6ab0cb93-cf4f-4a31-b2ce-a9ed9267fa22	30f960df-fc88-4d33-a757-cce99fa6905d	a5f91ac4-4c87-4654-9b5c-9cb7e79fb200	250	USD	GGGGGGGGGGGGGGGGG	12	[]	\N	ACCEPTED	2026-03-09 09:21:03.224	2026-03-02 09:21:03.227	2026-03-02 09:31:30.066
e17e01b8-c3b4-4239-a508-4dbe0e9082b2	82f95882-6f34-44ce-8c43-ad3772e10253	a5f91ac4-4c87-4654-9b5c-9cb7e79fb200	250	USD	FDDDDDDDDDDDDDDDDDDDDD	10	[]	\N	PENDING	2026-03-09 09:32:16.355	2026-03-02 09:32:16.358	2026-03-02 09:32:16.358
4dc222ef-0f9f-4319-ae8a-ff6d4d0b0cd3	28960d08-d878-42e7-9f4d-51fdc92abaa1	a5f91ac4-4c87-4654-9b5c-9cb7e79fb200	150	USD	jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj	22	[]	\N	ACCEPTED	2026-03-09 10:46:06.425	2026-03-02 10:46:06.429	2026-03-02 13:24:18.281
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.password_reset_tokens (id, email, token, expires, "createdAt", "usedAt") FROM stdin;
2f235da4-f245-4551-94e3-c7c252e97a94	user@secure-marketplace.com	a3f5365d113552b7f65b5aa3256f9815c3ae6dc086cd0765d7fdac49d17a0bbb69789edf5eaf599736faa5bfb8509f6ead844561df254047eb4c02d4938136c3	2026-02-24 10:53:51.636	2026-02-24 09:53:51.638	\N
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, "membershipId", "companyId", amount, currency, status, "paymentMethod", description, "createdAt") FROM stdin;
\.


--
-- Data for Name: project_audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_audit_logs (id, "requestId", "adminId", action, reason, "createdAt") FROM stdin;
cmm7v4px10000z0zspqrs3b3h	30f960df-fc88-4d33-a757-cce99fa6905d	2849b948-60db-409c-aac1-5dc6cf411051	APPROVED	\N	2026-03-01 14:46:13.045
cmm7vd4ob0001z0zsnuw4pap6	82f95882-6f34-44ce-8c43-ad3772e10253	2849b948-60db-409c-aac1-5dc6cf411051	APPROVED	\N	2026-03-01 14:52:45.42
cmm91yx3l00015t7xs5gb9eaf	28960d08-d878-42e7-9f4d-51fdc92abaa1	2849b948-60db-409c-aac1-5dc6cf411051	APPROVED	\N	2026-03-02 10:45:25.905
\.


--
-- Data for Name: project_files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_files (id, "projectId", name, url, "mimeType", size, "uploadedBy", "createdAt") FROM stdin;
\.


--
-- Data for Name: project_milestones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_milestones (id, "projectId", title, description, "dueDate", status, "createdAt") FROM stdin;
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, title, description, "userId", "companyId", "requestId", "startDate", "endDate", budget, currency, status, progress, "createdAt", "updatedAt", "completedByCompany", "completedByUser") FROM stdin;
98fd938a-1c1c-4bee-b0f6-64107f9eb5e2	AAAAAAA	AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA	b96647af-284a-45d0-a08d-4853f9d59fbc	a5f91ac4-4c87-4654-9b5c-9cb7e79fb200	30f960df-fc88-4d33-a757-cce99fa6905d	\N	\N	250	USD	ACTIVE	0	2026-03-02 09:31:30.078	2026-03-02 13:44:31.768	f	f
563886a6-a870-49de-b215-9802626e97f7	DDDDDD	DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD	b96647af-284a-45d0-a08d-4853f9d59fbc	a5f91ac4-4c87-4654-9b5c-9cb7e79fb200	28960d08-d878-42e7-9f4d-51fdc92abaa1	\N	\N	150	USD	ACTIVE	0	2026-03-02 13:24:18.293	2026-03-02 13:44:31.768	f	f
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_tokens (id, token, "userId", "expiresAt", "createdAt", "revokedAt", "ipAddress", "userAgent") FROM stdin;
c94a7811-2e4f-42ab-8d21-b748ccdc3ce5	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIyODQ5Yjk0OC02MGRiLTQwOWMtYWFjMS01ZGM2Y2Y0MTEwNTEiLCJlbWFpbCI6ImFkbWluQHNlY3VyZS1tYXJrZXRwbGFjZS5jb20iLCJyb2xlIjoiQURNSU4iLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc3MTQxNDE1OCwiZXhwIjoxNzcyMDE4OTU4LCJhdWQiOiJzZWN1cmUtbWFya2V0cGxhY2UiLCJpc3MiOiJzZWN1cmUtbWFya2V0cGxhY2UtYXBpIn0.XXmnY9XBKsViBJlV4Pa37G6J7dnOR9S9M6ZmmD4kmJ0	2849b948-60db-409c-aac1-5dc6cf411051	2026-02-25 11:29:18.493	2026-02-18 11:29:18.495	2026-02-18 11:30:28.257	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
cabe05eb-ac5b-49d4-aa5d-bd8ce8132f91	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI1YTUyOWY1MC03NzYxLTQwNDktYTAyMy0xYjkxMjBiMjQ0ZDciLCJlbWFpbCI6Im93bmVyQHNlY3VyZS1tYXJrZXRwbGFjZS5jb20iLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc3MTQxNDI0MCwiZXhwIjoxNzcyMDE5MDQwLCJhdWQiOiJzZWN1cmUtbWFya2V0cGxhY2UiLCJpc3MiOiJzZWN1cmUtbWFya2V0cGxhY2UtYXBpIn0.SAHV7YQ5499Hklehlfq5KAGbC_-hpqPvJcaZwgEEzPE	5a529f50-7761-4049-a023-1b9120b244d7	2026-02-25 11:30:40.562	2026-02-18 11:30:40.563	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
52d03318-979e-442b-84fe-3133309fe3d7	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI1YTUyOWY1MC03NzYxLTQwNDktYTAyMy0xYjkxMjBiMjQ0ZDciLCJlbWFpbCI6Im93bmVyQHNlY3VyZS1tYXJrZXRwbGFjZS5jb20iLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc3MTQxNTIyNSwiZXhwIjoxNzcyMDIwMDI1LCJhdWQiOiJzZWN1cmUtbWFya2V0cGxhY2UiLCJpc3MiOiJzZWN1cmUtbWFya2V0cGxhY2UtYXBpIn0.SAAGP7jVHKrlaY_l4kCGmZ3hmdmMk6k7VOVIqfmiajE	5a529f50-7761-4049-a023-1b9120b244d7	2026-02-25 11:47:05.23	2026-02-18 11:47:05.232	2026-02-18 11:57:42.357	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
c0a71c00-1e63-45d4-835a-8dc832213734	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJiOTY2NDdhZi0yODRhLTQ1ZDAtYTA4ZC00ODUzZjlkNTlmYmMiLCJlbWFpbCI6InVzZXJAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJVU0VSIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzE0MTU5MDYsImV4cCI6MTc3MjAyMDcwNiwiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.q1fKwDVNXxiMPUbQYnJ4MpX6SfXjfUU6SXEjP644kKo	b96647af-284a-45d0-a08d-4853f9d59fbc	2026-02-25 11:58:26.959	2026-02-18 11:58:26.961	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
af3f1430-651a-46ed-91d7-b92b4b3f31e5	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJiOTY2NDdhZi0yODRhLTQ1ZDAtYTA4ZC00ODUzZjlkNTlmYmMiLCJlbWFpbCI6InVzZXJAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJVU0VSIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzE0MTYyNjksImV4cCI6MTc3MjAyMTA2OSwiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.IOug0y-Q1O15r119ikiYUKHzuks0ZA07vW0Uh6y1xL4	b96647af-284a-45d0-a08d-4853f9d59fbc	2026-02-25 12:04:29.896	2026-02-18 12:04:29.899	2026-02-18 12:06:48.614	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
f4846a11-004b-4736-a117-03388b1fe9d8	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIzNjZkYjJhZi05Y2Y0LTQ1ZDYtYjBiNy04OTZmNjhhY2Q1NjMiLCJlbWFpbCI6ImNvbXBhbnlAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJDT01QQU5ZIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzE0MTcxOTQsImV4cCI6MTc3MjAyMTk5NCwiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.8e6YwYU0YELhukHr1T4UcoT-qho3jHsYybjZIpUpbOM	366db2af-9cf4-45d6-b0b7-896f68acd563	2026-02-25 12:19:54.505	2026-02-18 12:19:54.507	2026-02-18 12:20:22.537	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
895b877d-fd4c-4fa8-908e-d9e70b1cb95a	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIzNjZkYjJhZi05Y2Y0LTQ1ZDYtYjBiNy04OTZmNjhhY2Q1NjMiLCJlbWFpbCI6ImNvbXBhbnlAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJDT01QQU5ZIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzE0MTczNTEsImV4cCI6MTc3MjAyMjE1MSwiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.J4vxvqQ1QCrh4XOKesawh2cxjVvh3vjC05TNOR3shRw	366db2af-9cf4-45d6-b0b7-896f68acd563	2026-02-25 12:22:31.388	2026-02-18 12:22:31.389	2026-02-18 12:30:51.576	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
64380adc-17c0-4597-a173-1159ede4bf48	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIzNjZkYjJhZi05Y2Y0LTQ1ZDYtYjBiNy04OTZmNjhhY2Q1NjMiLCJlbWFpbCI6ImNvbXBhbnlAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJDT01QQU5ZIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzE0MTc5OTYsImV4cCI6MTc3MjAyMjc5NiwiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.z6H96zCtBmP0j-YF5hcf8e63SixXkIhF4z0DPL7D_4o	366db2af-9cf4-45d6-b0b7-896f68acd563	2026-02-25 12:33:16.132	2026-02-18 12:33:16.133	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
009d2488-c6ab-458e-ae26-87f38f3817d3	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIzNjZkYjJhZi05Y2Y0LTQ1ZDYtYjBiNy04OTZmNjhhY2Q1NjMiLCJlbWFpbCI6ImNvbXBhbnlAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJDT01QQU5ZIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzE0MTkwOTYsImV4cCI6MTc3MjAyMzg5NiwiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.NGO6KAZYvXltc3tsRtaXxeZC_c2ReL74XDjDnUZrLmM	366db2af-9cf4-45d6-b0b7-896f68acd563	2026-02-25 12:51:36.596	2026-02-18 12:51:36.597	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
ea70be97-7bd9-447b-9084-d5c4d95fbb9f	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIzNjZkYjJhZi05Y2Y0LTQ1ZDYtYjBiNy04OTZmNjhhY2Q1NjMiLCJlbWFpbCI6ImNvbXBhbnlAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJDT01QQU5ZIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzE0MjAyNDEsImV4cCI6MTc3MjAyNTA0MSwiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.GTjurOc2ks8dTTpaQOS18XJGZXXaB7O5N1buNcx4aRI	366db2af-9cf4-45d6-b0b7-896f68acd563	2026-02-25 13:10:41.803	2026-02-18 13:10:41.805	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
dc228f0d-ad19-4319-a22c-31da48c516e9	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIzNjZkYjJhZi05Y2Y0LTQ1ZDYtYjBiNy04OTZmNjhhY2Q1NjMiLCJlbWFpbCI6ImNvbXBhbnlAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJDT01QQU5ZIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzE0MjI5MTIsImV4cCI6MTc3MjAyNzcxMiwiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.i0bOZURKWolVHon_IkZtqs1INwurG2v08Iwh2p5oFXI	366db2af-9cf4-45d6-b0b7-896f68acd563	2026-02-25 13:55:12.025	2026-02-18 13:55:12.029	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
4eb1a3a8-d9c1-4ed7-9ffa-6354a308a87c	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJiOTY2NDdhZi0yODRhLTQ1ZDAtYTA4ZC00ODUzZjlkNTlmYmMiLCJlbWFpbCI6InVzZXJAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJVU0VSIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzE1ODEyMjksImV4cCI6MTc3MjE4NjAyOSwiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.TK1AijFs-dXiDTNQ6VKcscxNj2eEJLuG9y8bphZ2zwE	b96647af-284a-45d0-a08d-4853f9d59fbc	2026-02-27 09:53:49.463	2026-02-20 09:53:49.475	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
50a9d730-089a-4e06-a928-d2ed33e3fd1a	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJiOTY2NDdhZi0yODRhLTQ1ZDAtYTA4ZC00ODUzZjlkNTlmYmMiLCJlbWFpbCI6InVzZXJAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJVU0VSIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzE1ODEyMzMsImV4cCI6MTc3MjE4NjAzMywiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.7zQGxyoQ3TIWAgOIBTTvsYj0-f2NujrE0OlGVcj9mg8	b96647af-284a-45d0-a08d-4853f9d59fbc	2026-02-27 09:53:53.705	2026-02-20 09:53:53.716	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
68dcda3f-691d-4dfd-b697-a39728dd758d	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJiOTY2NDdhZi0yODRhLTQ1ZDAtYTA4ZC00ODUzZjlkNTlmYmMiLCJlbWFpbCI6InVzZXJAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJVU0VSIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzE1ODc0NTgsImV4cCI6MTc3MjE5MjI1OCwiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.GKq44Q2Pvj2ukWcOPQCuv_ganWlyi367Ig35TMYvJC0	b96647af-284a-45d0-a08d-4853f9d59fbc	2026-02-27 11:37:38.686	2026-02-20 11:37:38.688	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
a463c638-c070-4e91-8a58-fe4ed15cef48	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJiOTY2NDdhZi0yODRhLTQ1ZDAtYTA4ZC00ODUzZjlkNTlmYmMiLCJlbWFpbCI6InVzZXJAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJVU0VSIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzE5MjYyNTgsImV4cCI6MTc3MjUzMTA1OCwiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.1G8ziqpnejtJ-FS2RwKk0tgr99YXlYHvDa4l0xXG8b4	b96647af-284a-45d0-a08d-4853f9d59fbc	2026-03-26 09:44:18.116	2026-02-24 09:44:18.118	2026-02-24 09:45:02.975	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
546888ad-1e8b-48c2-99c9-26fbb2278f5e	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJiOTY2NDdhZi0yODRhLTQ1ZDAtYTA4ZC00ODUzZjlkNTlmYmMiLCJlbWFpbCI6InVzZXJAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJVU0VSIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzIyOTU5NDksImV4cCI6MTc3MjkwMDc0OSwiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.ex-1n8CPYiHLyFNFa3mi4b5wfBMFCTMLQGOj0DynikA	b96647af-284a-45d0-a08d-4853f9d59fbc	2026-03-07 16:25:49.953	2026-02-28 16:25:49.954	2026-02-28 16:30:29.084	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
9fd65a6d-a579-4d03-af97-3c6e30f21610	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJiOTY2NDdhZi0yODRhLTQ1ZDAtYTA4ZC00ODUzZjlkNTlmYmMiLCJlbWFpbCI6InVzZXJAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJVU0VSIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzIyOTc5MDksImV4cCI6MTc3MjkwMjcwOSwiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.ebg9CLuWnF9mpee80w3pGdeGL4O_8fIJJGoVzlHXTQM	b96647af-284a-45d0-a08d-4853f9d59fbc	2026-03-07 16:58:29.519	2026-02-28 16:58:29.521	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
0dedb34b-c51c-4a3d-9010-c16d0ca0f204	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIyODQ5Yjk0OC02MGRiLTQwOWMtYWFjMS01ZGM2Y2Y0MTEwNTEiLCJlbWFpbCI6ImFkbWluQHNlY3VyZS1tYXJrZXRwbGFjZS5jb20iLCJyb2xlIjoiQURNSU4iLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc3MjMwNDgzMSwiZXhwIjoxNzcyOTA5NjMxLCJhdWQiOiJzZWN1cmUtbWFya2V0cGxhY2UiLCJpc3MiOiJzZWN1cmUtbWFya2V0cGxhY2UtYXBpIn0.MtzD7II7TNxc7JhNsWVwtcv2mLlsar5limaHg9stMM8	2849b948-60db-409c-aac1-5dc6cf411051	2026-03-07 18:53:51.282	2026-02-28 18:53:51.284	2026-02-28 19:26:56.488	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
62a0c0c7-640f-4de3-80da-f9bbb612ee20	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJiOTY2NDdhZi0yODRhLTQ1ZDAtYTA4ZC00ODUzZjlkNTlmYmMiLCJlbWFpbCI6InVzZXJAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJVU0VSIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzIzMDY4NzcsImV4cCI6MTc3MjkxMTY3NywiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.YiyJbg0x3T2Sc9szkNvHVCqQHLMczwwRHd31jImNaY8	b96647af-284a-45d0-a08d-4853f9d59fbc	2026-03-07 19:27:57.949	2026-02-28 19:27:57.95	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
43fa9078-584b-41d1-a87e-d0ac0d905ad7	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJiOTY2NDdhZi0yODRhLTQ1ZDAtYTA4ZC00ODUzZjlkNTlmYmMiLCJlbWFpbCI6InVzZXJAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJVU0VSIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzIzNjg4NzMsImV4cCI6MTc3Mjk3MzY3MywiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.rpsiciD4uH4NkqHwH7zbhdGH-VotFJN8EOFgMlvbkfE	b96647af-284a-45d0-a08d-4853f9d59fbc	2026-03-08 12:41:13.061	2026-03-01 12:41:13.063	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
7c747202-7c08-4332-9077-b5005e3cf46c	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIzNjZkYjJhZi05Y2Y0LTQ1ZDYtYjBiNy04OTZmNjhhY2Q1NjMiLCJlbWFpbCI6ImNvbXBhbnlAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJDT01QQU5ZIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzIzNjg5NDAsImV4cCI6MTc3Mjk3Mzc0MCwiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.iSpVYRJoEXojebN7_OdKUsKGTJvD8L4FGq30eO2XDmc	366db2af-9cf4-45d6-b0b7-896f68acd563	2026-03-08 12:42:20.881	2026-03-01 12:42:20.883	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0
6d38f52b-ea51-46f4-b35b-ee3e77f8f4ed	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIyODQ5Yjk0OC02MGRiLTQwOWMtYWFjMS01ZGM2Y2Y0MTEwNTEiLCJlbWFpbCI6ImFkbWluQHNlY3VyZS1tYXJrZXRwbGFjZS5jb20iLCJyb2xlIjoiQURNSU4iLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc3MjM3NTEwNywiZXhwIjoxNzcyOTc5OTA3LCJhdWQiOiJzZWN1cmUtbWFya2V0cGxhY2UiLCJpc3MiOiJzZWN1cmUtbWFya2V0cGxhY2UtYXBpIn0.ZJXPiCCrxFfSzLF-nbgJi32Yv9Kkb5-sz4aT9g9-nkM	2849b948-60db-409c-aac1-5dc6cf411051	2026-03-08 14:25:07.311	2026-03-01 14:25:07.312	2026-03-01 14:51:08.07	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
ee616d35-db1e-446b-a041-e60af12449fb	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIyODQ5Yjk0OC02MGRiLTQwOWMtYWFjMS01ZGM2Y2Y0MTEwNTEiLCJlbWFpbCI6ImFkbWluQHNlY3VyZS1tYXJrZXRwbGFjZS5jb20iLCJyb2xlIjoiQURNSU4iLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc3MjM3NjcxNSwiZXhwIjoxNzcyOTgxNTE1LCJhdWQiOiJzZWN1cmUtbWFya2V0cGxhY2UiLCJpc3MiOiJzZWN1cmUtbWFya2V0cGxhY2UtYXBpIn0.mYak0wJhdk5VUTlS32MF2hxCMuQN1Cfo0ia5YgStK10	2849b948-60db-409c-aac1-5dc6cf411051	2026-03-08 14:51:55.858	2026-03-01 14:51:55.859	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
ff29e79d-e48e-492b-9beb-7c4427d7b2f8	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJiOTY2NDdhZi0yODRhLTQ1ZDAtYTA4ZC00ODUzZjlkNTlmYmMiLCJlbWFpbCI6InVzZXJAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJVU0VSIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzI0NDAyMzEsImV4cCI6MTc3MzA0NTAzMSwiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.3LGAIDMBTBtL4cj2rEZ3AryR3O9gEOMrOitA5kwAGFY	b96647af-284a-45d0-a08d-4853f9d59fbc	2026-03-09 08:30:31.189	2026-03-02 08:30:31.191	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
76d6abcb-3c71-4c07-add5-b5fdd4366052	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIzNjZkYjJhZi05Y2Y0LTQ1ZDYtYjBiNy04OTZmNjhhY2Q1NjMiLCJlbWFpbCI6ImNvbXBhbnlAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJDT01QQU5ZIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzI0NDAyNzQsImV4cCI6MTc3MzA0NTA3NCwiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.rjgytqhHetpWH4a61Kc6ZQoCF1zv2cB8eOARQbteLaw	366db2af-9cf4-45d6-b0b7-896f68acd563	2026-03-09 08:31:14.4	2026-03-02 08:31:14.402	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0
2728f934-9e68-4930-8b79-418abea55fa1	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIyODQ5Yjk0OC02MGRiLTQwOWMtYWFjMS01ZGM2Y2Y0MTEwNTEiLCJlbWFpbCI6ImFkbWluQHNlY3VyZS1tYXJrZXRwbGFjZS5jb20iLCJyb2xlIjoiQURNSU4iLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc3MjQ0MDM0OSwiZXhwIjoxNzczMDQ1MTQ5LCJhdWQiOiJzZWN1cmUtbWFya2V0cGxhY2UiLCJpc3MiOiJzZWN1cmUtbWFya2V0cGxhY2UtYXBpIn0.Ql4hSde9IHXOEgm8UqvFTYtzguKdjfFlh6Oyek1hsgI	2849b948-60db-409c-aac1-5dc6cf411051	2026-03-09 08:32:29.385	2026-03-02 08:32:29.386	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
69faeeb3-707f-475d-a953-4bb865f853d2	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJiOTY2NDdhZi0yODRhLTQ1ZDAtYTA4ZC00ODUzZjlkNTlmYmMiLCJlbWFpbCI6InVzZXJAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJVU0VSIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzI0NDMyOTMsImV4cCI6MTc3MzA0ODA5MywiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.lQBA6g8d-kgcvLRCt4JXnenhmJVOL41onBPj33MFCLY	b96647af-284a-45d0-a08d-4853f9d59fbc	2026-03-09 09:21:33.707	2026-03-02 09:21:33.709	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
6843dbe5-b740-49a2-83ff-55010122479d	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIyODQ5Yjk0OC02MGRiLTQwOWMtYWFjMS01ZGM2Y2Y0MTEwNTEiLCJlbWFpbCI6ImFkbWluQHNlY3VyZS1tYXJrZXRwbGFjZS5jb20iLCJyb2xlIjoiQURNSU4iLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc3MjQ0ODE5NiwiZXhwIjoxNzczMDUyOTk2LCJhdWQiOiJzZWN1cmUtbWFya2V0cGxhY2UiLCJpc3MiOiJzZWN1cmUtbWFya2V0cGxhY2UtYXBpIn0.Xl8I1uPE56HQWgrhItj4NIEiqRiUKAL0TNAt0-_lvRc	2849b948-60db-409c-aac1-5dc6cf411051	2026-03-09 10:43:16.949	2026-03-02 10:43:16.951	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
f250eae2-cf02-419d-84be-ff46f1cd69fc	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIzNjZkYjJhZi05Y2Y0LTQ1ZDYtYjBiNy04OTZmNjhhY2Q1NjMiLCJlbWFpbCI6ImNvbXBhbnlAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJDT01QQU5ZIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzI0NTU0NjQsImV4cCI6MTc3MzA2MDI2NCwiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.4z0OngrgPV9QHI92L7024z3Lsn7Sau9IuMD-QfeFvmU	366db2af-9cf4-45d6-b0b7-896f68acd563	2026-03-09 12:44:24.052	2026-03-02 12:44:24.054	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0
08254d5b-0d6e-4d50-bf3d-551d072cdf0d	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIzNjZkYjJhZi05Y2Y0LTQ1ZDYtYjBiNy04OTZmNjhhY2Q1NjMiLCJlbWFpbCI6ImNvbXBhbnlAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJDT01QQU5ZIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzI0NTc4MzAsImV4cCI6MTc3MzA2MjYzMCwiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.nui4h5bOp0W7VRa9J0w_ylYKdetYALNXMu898mBfiKY	366db2af-9cf4-45d6-b0b7-896f68acd563	2026-03-09 13:23:50.504	2026-03-02 13:23:50.506	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0
47dc2730-55bd-470f-bc49-1c8e75193760	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJiOTY2NDdhZi0yODRhLTQ1ZDAtYTA4ZC00ODUzZjlkNTlmYmMiLCJlbWFpbCI6InVzZXJAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJVU0VSIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzI0Njk2NzYsImV4cCI6MTc3MzA3NDQ3NiwiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.ZZul6PUI0kCNg4AzUL6HjZxS5ZJEYtUbAKPdZnBYbMY	b96647af-284a-45d0-a08d-4853f9d59fbc	2026-03-09 16:41:16.535	2026-03-02 16:41:16.537	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
fe8e9125-0ad5-4cca-8597-082fe02d0cd5	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIzNjZkYjJhZi05Y2Y0LTQ1ZDYtYjBiNy04OTZmNjhhY2Q1NjMiLCJlbWFpbCI6ImNvbXBhbnlAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJDT01QQU5ZIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzI0Njk3NDYsImV4cCI6MTc3MzA3NDU0NiwiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.CjTWp3XTbsYLLAhUvx97VTEAFpHI0kDDts6kLpsUmXE	366db2af-9cf4-45d6-b0b7-896f68acd563	2026-03-09 16:42:26.989	2026-03-02 16:42:26.99	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0
ff043bb1-3cbd-4726-a594-5c4c545f869f	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJiOTY2NDdhZi0yODRhLTQ1ZDAtYTA4ZC00ODUzZjlkNTlmYmMiLCJlbWFpbCI6InVzZXJAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJVU0VSIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzI0NzQ5NDcsImV4cCI6MTc3MzA3OTc0NywiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.yb6HGgMYc7ACLaWnEtf-W54JagMsl0461t3Fow04F-o	b96647af-284a-45d0-a08d-4853f9d59fbc	2026-03-09 18:09:07.471	2026-03-02 18:09:07.472	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
112e8ee9-0c60-47ce-b6d1-63504f5afbdb	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJiOTY2NDdhZi0yODRhLTQ1ZDAtYTA4ZC00ODUzZjlkNTlmYmMiLCJlbWFpbCI6InVzZXJAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJVU0VSIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzI1MzQyNTMsImV4cCI6MTc3MzEzOTA1MywiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.s01xJB_Mx28uWHGqJYRba5AG_9zmugEk60n4ssCkzQk	b96647af-284a-45d0-a08d-4853f9d59fbc	2026-03-10 10:37:33.004	2026-03-03 10:37:33.005	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
bec24db0-6bb0-4b5b-bb76-266bfc2f0072	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIzNjZkYjJhZi05Y2Y0LTQ1ZDYtYjBiNy04OTZmNjhhY2Q1NjMiLCJlbWFpbCI6ImNvbXBhbnlAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJDT01QQU5ZIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzI1MzQyNjMsImV4cCI6MTc3MzEzOTA2MywiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.6vw3aPfmQcMvAXmjHeZIPCHXgtMTcZ3V2JszrLsUZ4c	366db2af-9cf4-45d6-b0b7-896f68acd563	2026-03-10 10:37:43.257	2026-03-03 10:37:43.258	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0
d05909f4-27c3-4901-ab0c-33caa9e28d50	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIzNjZkYjJhZi05Y2Y0LTQ1ZDYtYjBiNy04OTZmNjhhY2Q1NjMiLCJlbWFpbCI6ImNvbXBhbnlAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJDT01QQU5ZIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzI1MzYwNzgsImV4cCI6MTc3MzE0MDg3OCwiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.iYbOMw85lKKJUYpa93abSkYmobVAtWiYGdOnCK9WleA	366db2af-9cf4-45d6-b0b7-896f68acd563	2026-03-10 11:07:58.946	2026-03-03 11:07:58.947	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0
dd251de4-4d87-47a5-b509-19c001ff0ef6	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJiOTY2NDdhZi0yODRhLTQ1ZDAtYTA4ZC00ODUzZjlkNTlmYmMiLCJlbWFpbCI6InVzZXJAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJVU0VSIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzI1MzYxNjEsImV4cCI6MTc3MzE0MDk2MSwiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.9zG4lKvaAJcOrZOi-ofa8MBkzH-WyjDOxGP4gneLbyc	b96647af-284a-45d0-a08d-4853f9d59fbc	2026-03-10 11:09:21.42	2026-03-03 11:09:21.421	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
c6e53f03-1bd0-4b05-953b-75fc266b0f3d	eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIzNjZkYjJhZi05Y2Y0LTQ1ZDYtYjBiNy04OTZmNjhhY2Q1NjMiLCJlbWFpbCI6ImNvbXBhbnlAc2VjdXJlLW1hcmtldHBsYWNlLmNvbSIsInJvbGUiOiJDT01QQU5ZIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzI1MzkxNjksImV4cCI6MTc3MzE0Mzk2OSwiYXVkIjoic2VjdXJlLW1hcmtldHBsYWNlIiwiaXNzIjoic2VjdXJlLW1hcmtldHBsYWNlLWFwaSJ9.rhTgmfFOfvvc3mX0M6Vx01V8VvmiVp_81jV9xMFulyw	366db2af-9cf4-45d6-b0b7-896f68acd563	2026-03-10 11:59:29.097	2026-03-03 11:59:29.098	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, "companyId", "userId", "projectId", rating, comment, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: security_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.security_logs (id, "userId", type, ip, "userAgent", metadata, "createdAt") FROM stdin;
6ff2d024-5af2-4124-bc74-b7b21a64578a	2849b948-60db-409c-aac1-5dc6cf411051	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": false}	2026-02-18 11:29:18.509
3acb676f-1cb8-44de-a5ea-9807df2dd3ae	2849b948-60db-409c-aac1-5dc6cf411051	LOGOUT	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{}	2026-02-18 11:30:28.273
9c44272f-bc64-4039-b355-4af1650ab28b	5a529f50-7761-4049-a023-1b9120b244d7	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": false}	2026-02-18 11:30:40.566
3137705c-5955-466f-ac5e-281a3f69179b	5a529f50-7761-4049-a023-1b9120b244d7	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": false}	2026-02-18 11:47:05.236
a1269ad5-c2fb-4185-88ac-c89fa0cb92a3	5a529f50-7761-4049-a023-1b9120b244d7	LOGOUT	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{}	2026-02-18 11:57:42.444
aebbd4b6-fe9a-44d5-96e6-4a888097ef11	b96647af-284a-45d0-a08d-4853f9d59fbc	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": false}	2026-02-18 11:58:26.965
dd6d5f22-76be-4482-a599-13a808eff529	b96647af-284a-45d0-a08d-4853f9d59fbc	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": false}	2026-02-18 12:04:29.911
0528acf6-09e5-435d-aec0-9c5def611267	b96647af-284a-45d0-a08d-4853f9d59fbc	LOGOUT	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{}	2026-02-18 12:06:48.634
f1e41f05-bd74-45ab-9490-e9a6543ba86a	366db2af-9cf4-45d6-b0b7-896f68acd563	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": false}	2026-02-18 12:19:54.513
9b14aefc-9c12-4bfa-b134-e046096f8324	366db2af-9cf4-45d6-b0b7-896f68acd563	LOGOUT	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{}	2026-02-18 12:20:22.548
732b43a1-e7e7-45aa-a759-7201fcb009af	366db2af-9cf4-45d6-b0b7-896f68acd563	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": false}	2026-02-18 12:22:31.396
a7285898-1925-41ce-a3f5-92ba2a069d06	366db2af-9cf4-45d6-b0b7-896f68acd563	LOGOUT	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{}	2026-02-18 12:30:51.611
578ee3cc-18e1-4d07-ab9f-61c52ab68828	366db2af-9cf4-45d6-b0b7-896f68acd563	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": false}	2026-02-18 12:33:16.14
8f484f3f-7ca5-45be-85a4-bc316541af1d	366db2af-9cf4-45d6-b0b7-896f68acd563	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": false}	2026-02-18 12:51:36.612
3fdb6690-babc-4f96-8046-a22bc78cff8e	366db2af-9cf4-45d6-b0b7-896f68acd563	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": false}	2026-02-18 13:10:41.82
73ac0030-b66f-4f9c-9086-41d99d56c919	366db2af-9cf4-45d6-b0b7-896f68acd563	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": false}	2026-02-18 13:55:12.039
a35c82f2-fc59-4330-9375-a2fd50dae5c7	b96647af-284a-45d0-a08d-4853f9d59fbc	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": false}	2026-02-20 09:53:49.516
86da9aa2-e7c8-4244-93cc-b09068fcfed5	b96647af-284a-45d0-a08d-4853f9d59fbc	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": false}	2026-02-20 09:53:53.726
cdd80dae-bdfa-4dd6-8119-0d17eaa8f21b	b96647af-284a-45d0-a08d-4853f9d59fbc	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": false}	2026-02-20 11:37:38.692
f98f8b42-1149-4928-b17a-389f6ed4cf21	\N	REGISTER	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"userId": "c10278db-184c-4242-97c2-5c2fb7ac68b1"}	2026-02-24 09:43:33.575
0eca6196-ade3-43ab-9edc-a051a4de0d2f	b96647af-284a-45d0-a08d-4853f9d59fbc	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": true}	2026-02-24 09:44:18.148
8b8b17a9-0421-4bff-bac7-82021706b154	b96647af-284a-45d0-a08d-4853f9d59fbc	LOGOUT	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{}	2026-02-24 09:45:02.993
9a32b679-83d1-4f7b-9fa5-189f2ca5df77	\N	REGISTER_FAILED	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"reason": "email_exists"}	2026-02-24 09:45:42.199
23aba39d-19d6-4022-bb6a-12de76df64c2	c10278db-184c-4242-97c2-5c2fb7ac68b1	LOGIN_FAILED	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"reason": "email_not_verified"}	2026-02-24 09:47:33.838
18e848da-85a6-4e1f-92ef-677ace610188	b96647af-284a-45d0-a08d-4853f9d59fbc	LOGIN_FAILED	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"reason": "invalid_password", "failedAttempts": 1}	2026-02-24 09:47:48.831
074e85d2-c025-437c-8f2f-e7588955e615	b96647af-284a-45d0-a08d-4853f9d59fbc	LOGIN_FAILED	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"reason": "invalid_password", "failedAttempts": 2}	2026-02-24 09:47:52.02
ce694cd2-e0c0-4741-a1cf-be375a38c5e7	b96647af-284a-45d0-a08d-4853f9d59fbc	LOGIN_FAILED	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"reason": "invalid_password", "failedAttempts": 3}	2026-02-24 09:47:52.948
723be210-a038-48fe-9b45-de7c8ebe5dc3	b96647af-284a-45d0-a08d-4853f9d59fbc	LOGIN_FAILED	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"reason": "invalid_password", "failedAttempts": 4}	2026-02-24 09:47:53.683
2aa5d0c3-98b2-4070-b814-6b5464bec567	b96647af-284a-45d0-a08d-4853f9d59fbc	ACCOUNT_LOCKED	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"lockedUntil": "2026-02-24T10:17:54.294Z", "failedAttempts": 5}	2026-02-24 09:47:54.295
0a14c9ad-7942-4c72-87ba-7939e8617de6	b96647af-284a-45d0-a08d-4853f9d59fbc	LOGIN_FAILED	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"reason": "account_locked", "lockedUntil": "2026-02-24T10:17:54.286Z"}	2026-02-24 09:48:35.498
805c5be2-c989-40f1-9b43-da815c783f62	b96647af-284a-45d0-a08d-4853f9d59fbc	LOGIN_FAILED	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"reason": "account_locked", "lockedUntil": "2026-02-24T10:17:54.286Z"}	2026-02-24 09:52:42.034
212e618e-2183-4030-a05b-85632ce42f2d	b96647af-284a-45d0-a08d-4853f9d59fbc	PASSWORD_RESET	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"emailSent": true}	2026-02-24 09:53:51.645
fcee9bf0-4903-4af5-b60e-c091f35e28da	b96647af-284a-45d0-a08d-4853f9d59fbc	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": false}	2026-02-28 16:25:49.976
2f257acb-2715-4a28-903d-f90a8408a0be	b96647af-284a-45d0-a08d-4853f9d59fbc	LOGOUT	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{}	2026-02-28 16:30:29.101
ef7c2f9c-da1c-4ad7-ad5a-092ecf45ad29	b96647af-284a-45d0-a08d-4853f9d59fbc	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": false}	2026-02-28 16:58:29.526
437e378e-4c7e-40e2-8208-70738e1f931c	2849b948-60db-409c-aac1-5dc6cf411051	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": false}	2026-02-28 18:53:51.304
bbcf132f-f345-4135-8098-b1f0808f35fe	\N	LOGIN_FAILED	::1	node	{"email": "hea***", "reason": "user_not_found_or_inactive"}	2026-02-28 18:55:33.301
f13569a1-ad56-4565-a55e-9abb387ee2da	\N	LOGIN_FAILED	::1	node	{"email": "hea***", "reason": "user_not_found_or_inactive"}	2026-02-28 18:56:42.96
5ab81b71-994a-466d-9ab0-a82d41a8f15d	\N	LOGIN_FAILED	::1	node	{"email": "hea***", "reason": "user_not_found_or_inactive"}	2026-02-28 18:58:00.834
77ae87ea-ef58-44c4-a2ae-c21394ff4b2d	\N	LOGIN_FAILED	::1	node	{"email": "hea***", "reason": "user_not_found_or_inactive"}	2026-02-28 19:13:21.423
9532d8df-063e-46d6-a391-fd65a81e0f8a	\N	LOGIN_FAILED	::1	node	{"email": "hea***", "reason": "user_not_found_or_inactive"}	2026-02-28 19:15:10.083
0e35e75e-aab8-4739-bcc5-f86b93b69031	2849b948-60db-409c-aac1-5dc6cf411051	LOGOUT	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{}	2026-02-28 19:26:56.497
3bc1e2be-8c7e-4d92-af67-4de688452565	b96647af-284a-45d0-a08d-4853f9d59fbc	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": false}	2026-02-28 19:27:57.954
9cf0d808-be1e-4441-ae2e-fa6aaf52950d	b96647af-284a-45d0-a08d-4853f9d59fbc	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": false}	2026-03-01 12:41:13.098
a028075c-54ba-4dc0-9e8e-af9514df5181	366db2af-9cf4-45d6-b0b7-896f68acd563	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	{"rememberMe": false}	2026-03-01 12:42:20.887
9de3f490-25ac-4e59-80b4-9a6b6d4e7194	2849b948-60db-409c-aac1-5dc6cf411051	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": false}	2026-03-01 14:25:07.338
0144bd99-f03b-41c0-bf9e-fb3b008c006e	2849b948-60db-409c-aac1-5dc6cf411051	LOGOUT	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{}	2026-03-01 14:51:08.084
0e48d15a-8f7c-4d2f-8425-5d331f88d553	2849b948-60db-409c-aac1-5dc6cf411051	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": false}	2026-03-01 14:51:55.863
509b8498-95dc-4c27-a2e6-ff135d81916d	b96647af-284a-45d0-a08d-4853f9d59fbc	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": false}	2026-03-02 08:30:31.226
9b990a4e-1b95-4519-9fd1-0b041c5cb71e	366db2af-9cf4-45d6-b0b7-896f68acd563	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	{"rememberMe": false}	2026-03-02 08:31:14.404
08d8bda8-b865-4075-b148-899f44fb9468	2849b948-60db-409c-aac1-5dc6cf411051	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": false}	2026-03-02 08:32:29.392
d03831ad-7241-45c1-80bc-818aad0b2703	b96647af-284a-45d0-a08d-4853f9d59fbc	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": false}	2026-03-02 09:21:33.714
006682cc-982e-443c-919f-e8bed68bf572	2849b948-60db-409c-aac1-5dc6cf411051	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": false}	2026-03-02 10:43:16.965
9db71996-84a3-4e55-8aaf-4b875648cecc	366db2af-9cf4-45d6-b0b7-896f68acd563	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	{"rememberMe": false}	2026-03-02 12:44:24.071
c9f6fc05-87e3-4311-8323-88bdb1af71a5	366db2af-9cf4-45d6-b0b7-896f68acd563	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	{"rememberMe": false}	2026-03-02 13:23:50.51
9a7f2a6c-527f-4e45-b327-5f0d98e4e1d9	b96647af-284a-45d0-a08d-4853f9d59fbc	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": false}	2026-03-02 16:41:16.541
6cd08f24-0ade-4d8a-b539-80d0809a7629	366db2af-9cf4-45d6-b0b7-896f68acd563	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	{"rememberMe": false}	2026-03-02 16:42:27.004
1af5b62e-4dc9-41cd-8041-85b4ce6b2f70	b96647af-284a-45d0-a08d-4853f9d59fbc	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": false}	2026-03-02 18:09:07.488
c2656ed8-3ee5-4003-ac77-d02cfa0c89e9	b96647af-284a-45d0-a08d-4853f9d59fbc	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": false}	2026-03-03 10:37:33.033
28cfe120-7e5e-482a-840b-d37ebdccc327	366db2af-9cf4-45d6-b0b7-896f68acd563	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	{"rememberMe": false}	2026-03-03 10:37:43.263
89df8f70-bedf-4b61-af3c-73836b6a8d18	366db2af-9cf4-45d6-b0b7-896f68acd563	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	{"rememberMe": false}	2026-03-03 11:07:58.95
34a6a851-4575-425a-9d8f-4d5bfcced8b9	b96647af-284a-45d0-a08d-4853f9d59fbc	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	{"rememberMe": false}	2026-03-03 11:09:21.425
c645b6a3-8f19-415e-9db3-4cb410aa177a	366db2af-9cf4-45d6-b0b7-896f68acd563	LOGIN	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	{"rememberMe": false}	2026-03-03 11:59:29.105
\.


--
-- Data for Name: service_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service_requests (id, "userId", title, description, "categoryId", "subcategoryId", "countryId", "cityId", "areaId", address, "budgetMin", "budgetMax", currency, deadline, urgency, visibility, images, attachments, tags, "allowRemote", "requireVerification", status, "isActive", "viewCount", "createdAt", "updatedAt") FROM stdin;
26846724-f26f-4e95-96b6-37c464e0a643	a130bf73-f351-4a22-a24d-0f9e9753cb71	Technical Blog Writing	Looking for a writer with tech background to write 4 detailed articles about Cloud Computing and AI.	28584798-4de1-496c-9fd0-b88f7ad41a93	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	200	400	USD	2026-12-31 00:00:00	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	314	2026-01-26 02:57:47.829	2026-02-28 19:23:57.573
918b9b53-1384-41a0-8c1b-abcbe90c8c8a	7f65f52e-949f-493b-9ebf-4af5e98b832b	Custom E-commerce Website Development	Looking for a full-stack developer to build a scalable e-commerce platform using Next.js and Node.js. Must include payment integration.	a58e3f12-ee73-4839-ada6-973b6de1db94	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	2000	5000	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	418	2026-01-28 02:47:59.814	2026-02-18 16:23:24.733
4d37defd-3673-4ebb-b8df-98a97267006f	1abb39df-0929-4386-aff1-8a5ae3668375	SEO & Content Marketing Strategy	We need an SEO expert to improve our Google ranking and create a 3-month content calendar.	627232ef-ea4d-4ebc-8f84-9554e9f511e8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	800	2000	USD	\N	URGENT	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	46	2026-01-20 00:31:12.896	2026-02-18 16:23:24.735
ff3c84bb-91cb-4b9e-9706-6146d5d77066	2dae1352-4180-4f5f-8606-7cd01c61b9d8	SEO & Content Marketing Strategy	We need an SEO expert to improve our Google ranking and create a 3-month content calendar.	627232ef-ea4d-4ebc-8f84-9554e9f511e8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	800	2000	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	387	2026-02-02 03:04:37.034	2026-02-18 16:23:24.738
b338b213-5fba-4c15-be5c-cdb2341bd46b	1cec89ac-cdb8-41fb-81ea-2650126f551f	Business Plan for Startup	Need a financial consultant to help create a 5-year business plan and financial projection for a tech startup.	4e4ff339-844e-4804-982c-c3e7e315be9e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	1000	3000	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	448	2026-02-15 01:00:21.026	2026-02-18 16:23:24.74
40d0674b-d2ba-47e3-b06d-e3eaecf4e315	068d20f7-d8fe-405f-b31b-989f997b2042	Promotional Video Editing	Need a professional video editor to create a 60-second promo video for our new product. Raw footage provided.	80ba105a-f0fb-4361-841c-cee2fe88003d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	300	800	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	109	2026-01-22 13:13:33.874	2026-02-18 16:23:24.745
91598dd6-e1d6-4e7a-8fa9-f1b9ee3df692	bc441d06-eb20-43fe-8728-97ad52f2d99f	SEO & Content Marketing Strategy	We need an SEO expert to improve our Google ranking and create a 3-month content calendar.	627232ef-ea4d-4ebc-8f84-9554e9f511e8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	800	2000	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	268	2026-02-03 17:35:42.438	2026-02-18 16:23:24.748
2a8c8070-a28d-4b0f-89ce-b149f3111efb	1abb39df-0929-4386-aff1-8a5ae3668375	Custom E-commerce Website Development	Looking for a full-stack developer to build a scalable e-commerce platform using Next.js and Node.js. Must include payment integration.	a58e3f12-ee73-4839-ada6-973b6de1db94	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	2000	5000	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	45	2026-02-11 17:11:27.141	2026-02-18 16:23:24.753
97840648-da1f-4db0-b81f-ba2cc0e38f87	2dae1352-4180-4f5f-8606-7cd01c61b9d8	Mobile App Development for Food Delivery	Need a native iOS and Android app for a new food delivery service. Features include GPS tracking, user profiles, and order management.	9aa93818-7b3e-4196-b853-03648df182fb	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	3000	8000	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	161	2026-02-15 14:20:59.698	2026-02-18 16:23:24.756
c8c13c4c-0d28-447d-a259-ae00f28c55c5	1abb39df-0929-4386-aff1-8a5ae3668375	Promotional Video Editing	Need a professional video editor to create a 60-second promo video for our new product. Raw footage provided.	80ba105a-f0fb-4361-841c-cee2fe88003d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	300	800	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	89	2026-01-30 21:35:09.409	2026-02-18 16:23:24.763
4fd53a21-7def-4277-b2d5-8ce9ce0e2b79	d20125d0-2ced-46c1-893f-52e813af1c53	Business Plan for Startup	Need a financial consultant to help create a 5-year business plan and financial projection for a tech startup.	4e4ff339-844e-4804-982c-c3e7e315be9e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	1000	3000	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	4	2026-02-09 15:19:03.292	2026-02-18 16:23:24.765
356d7a22-a26f-4d88-9dd0-5cd73cda1727	2dae1352-4180-4f5f-8606-7cd01c61b9d8	Mobile App Development for Food Delivery	Need a native iOS and Android app for a new food delivery service. Features include GPS tracking, user profiles, and order management.	9aa93818-7b3e-4196-b853-03648df182fb	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	3000	8000	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	123	2026-02-09 19:06:26.776	2026-02-18 16:23:24.768
dd99e3bd-a1a6-4020-8e9f-f68036f283c6	1dc82269-4fd8-4f16-8810-88d97fbad231	HVAC Service Required	We are looking for a professional provider for HVAC. Please review the project requirements and submit a competitive proposal.	8ad4b9e1-028d-48cb-b93d-ecd23520c68b	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	330	1153	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-09 03:58:41.661	2026-02-18 16:23:24.77
0c8d90be-0248-4a9a-a7ed-56720e7ad032	63ce3333-64c3-4c0d-97b5-9b517d2ff19d	HVAC Service Required	We are looking for a professional provider for HVAC. Please review the project requirements and submit a competitive proposal.	8ad4b9e1-028d-48cb-b93d-ecd23520c68b	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	538	612	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-17 19:43:51.011	2026-02-18 16:23:24.773
cb8bb06f-62ad-4d3e-8342-5a024501384f	329bb7c8-2ecb-4357-aa27-6baed0b1e3b7	Generator Installation Service Required	We are looking for a professional provider for Generator Installation. Please review the project requirements and submit a competitive proposal.	a0b0eaea-a4e9-4ed0-add4-8273a72630ee	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	501	1638	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-16 12:07:14.589	2026-02-18 16:23:24.775
6f180968-2dc6-4dbe-8ddd-61ce58fadaa8	9d01669c-4bd3-4f02-8179-90ca8de71870	SEO & Content Marketing Strategy edit	We need an SEO expert to improve our Google ranking and create a 3-month content calendar.	627232ef-ea4d-4ebc-8f84-9554e9f511e8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	800	2000	USD	\N	MEDIUM	PUBLIC	[]	\N	{lang:en}	f	f	ACTIVE	t	194	2026-02-10 08:34:24.994	2026-02-28 19:20:39.331
78863d4e-a90c-4a60-9401-e0638a03d271	dec3a0ef-1e8a-4363-bde8-73765431b2b4	Python Data Scraping Script	Need a Python script to scrape real estate data from 3 major websites daily and export to CSV.	647011ed-6560-47ee-9091-7b129a07c9ae	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	200	500	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	45	2026-02-15 15:02:58.387	2026-02-18 16:23:24.794
9894afd3-03f8-47a7-ab7f-1d17c9419d85	bc441d06-eb20-43fe-8728-97ad52f2d99f	Business Plan for Startup	Need a financial consultant to help create a 5-year business plan and financial projection for a tech startup.	4e4ff339-844e-4804-982c-c3e7e315be9e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	1000	3000	USD	\N	URGENT	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	424	2026-02-13 00:35:40.371	2026-02-18 16:23:24.78
9afa74be-eead-4b39-8df1-8b0ac7b39bdc	068d20f7-d8fe-405f-b31b-989f997b2042	Business Plan for Startup	Need a financial consultant to help create a 5-year business plan and financial projection for a tech startup.	4e4ff339-844e-4804-982c-c3e7e315be9e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	1000	3000	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	151	2026-02-02 11:00:19.338	2026-02-18 16:23:24.782
49cd6812-9cbc-4783-83c1-ec897f2ef9e6	9d01669c-4bd3-4f02-8179-90ca8de71870	Python Data Scraping Script	Need a Python script to scrape real estate data from 3 major websites daily and export to CSV.	647011ed-6560-47ee-9091-7b129a07c9ae	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	200	500	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	9	2026-02-10 20:39:37.805	2026-02-18 16:23:24.785
9a5c0992-2bf2-4950-8f7b-414390478366	a130bf73-f351-4a22-a24d-0f9e9753cb71	SEO & Content Marketing Strategy	We need an SEO expert to improve our Google ranking and create a 3-month content calendar.	627232ef-ea4d-4ebc-8f84-9554e9f511e8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	800	2000	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	337	2026-02-06 23:10:49.541	2026-02-18 16:23:24.787
d23b75d2-2c65-44a5-93f2-390f897d573c	068d20f7-d8fe-405f-b31b-989f997b2042	Mobile App Development for Food Delivery	Need a native iOS and Android app for a new food delivery service. Features include GPS tracking, user profiles, and order management.	9aa93818-7b3e-4196-b853-03648df182fb	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	3000	8000	USD	\N	URGENT	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	73	2026-02-08 08:47:56.946	2026-02-18 16:23:24.789
6dc41952-e6b2-4f98-90d8-2a245a2a4d9b	2dae1352-4180-4f5f-8606-7cd01c61b9d8	Technical Blog Writing	Looking for a writer with tech background to write 4 detailed articles about Cloud Computing and AI.	28584798-4de1-496c-9fd0-b88f7ad41a93	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	200	400	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	137	2026-02-17 02:23:50.169	2026-02-18 16:23:24.792
e48d7f8b-da6a-42e1-9c93-8f25475faa6e	105bb1c7-f9b9-48b8-a031-76d2b52c2eff	Promotional Video Editing	Need a professional video editor to create a 60-second promo video for our new product. Raw footage provided.	80ba105a-f0fb-4361-841c-cee2fe88003d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	300	800	USD	\N	URGENT	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	325	2026-02-14 15:08:31.706	2026-02-18 16:23:24.795
2a4fd66f-b602-4497-aff2-ca7fa5fb5e1e	5cfbcdd0-0b36-4921-a3c2-fa504ca8a20d	Brand Identity Design	Looking for a creative designer to build a complete brand identity including logo, color palette, and business cards.	ae16d3d8-b2f0-47e4-843d-d41cc8a4028d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	500	1500	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	71	2026-01-25 19:05:27.86	2026-02-18 16:23:24.797
fb5f8182-34b9-4eea-a96e-952028dfcd3a	068d20f7-d8fe-405f-b31b-989f997b2042	Business Plan for Startup	Need a financial consultant to help create a 5-year business plan and financial projection for a tech startup.	4e4ff339-844e-4804-982c-c3e7e315be9e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	1000	3000	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	490	2026-02-14 21:30:31.307	2026-02-18 16:23:24.802
3408e2dc-6389-4d86-912c-263ee1f15117	9d01669c-4bd3-4f02-8179-90ca8de71870	Python Data Scraping Script	Need a Python script to scrape real estate data from 3 major websites daily and export to CSV.	647011ed-6560-47ee-9091-7b129a07c9ae	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	200	500	USD	\N	URGENT	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	231	2026-02-02 10:50:37.45	2026-02-18 16:23:24.805
b9bfa502-1d6a-4245-b425-699ae1abe8fe	b074439b-dfb8-4bd9-92b5-b58137b917aa	Business Plan for Startup	Need a financial consultant to help create a 5-year business plan and financial projection for a tech startup.	4e4ff339-844e-4804-982c-c3e7e315be9e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	1000	3000	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	409	2026-02-11 04:23:34.648	2026-02-18 16:23:24.808
3afddad6-f57f-43f3-bc6c-3b5e31cc63c4	105bb1c7-f9b9-48b8-a031-76d2b52c2eff	Python Data Scraping Script	Need a Python script to scrape real estate data from 3 major websites daily and export to CSV.	647011ed-6560-47ee-9091-7b129a07c9ae	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	200	500	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	190	2026-01-20 08:50:33.136	2026-02-18 16:23:24.811
ae831c8c-6a68-47c0-9c5a-7868856f6259	284e1c70-ae85-4096-a43d-0a407ad229af	Generator Installation Service Required	We are looking for a professional provider for Generator Installation. Please review the project requirements and submit a competitive proposal.	a0b0eaea-a4e9-4ed0-add4-8273a72630ee	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	528	707	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-14 12:32:42.118	2026-02-18 16:23:24.813
c9ab7605-64a4-4a2c-b7eb-45ad1b36d7ed	1abb39df-0929-4386-aff1-8a5ae3668375	IT & Technology Service Required	We are looking for a professional provider for IT & Technology. Please review the project requirements and submit a competitive proposal.	ba67114a-555e-4275-980f-2dce64d575bc	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	520	1254	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-15 04:31:15.039	2026-02-18 16:23:24.816
f97ec72d-7779-4071-a5b4-1bd407631763	2a474982-5739-47fb-81f2-e1273e800c55	IT & Technology Service Required	We are looking for a professional provider for IT & Technology. Please review the project requirements and submit a competitive proposal.	ba67114a-555e-4275-980f-2dce64d575bc	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	357	1346	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-10 12:17:32.021	2026-02-18 16:23:24.819
693f3d39-52e9-49f6-8134-937c7b278bf1	d20125d0-2ced-46c1-893f-52e813af1c53	Promotional Video Editing	Need a professional video editor to create a 60-second promo video for our new product. Raw footage provided.	80ba105a-f0fb-4361-841c-cee2fe88003d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	300	800	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	30	2026-02-08 19:31:32.173	2026-02-18 16:23:24.824
26f8ed56-ab01-4c18-994b-255e843211de	1abb39df-0929-4386-aff1-8a5ae3668375	Mobile App Development for Food Delivery	Need a native iOS and Android app for a new food delivery service. Features include GPS tracking, user profiles, and order management.	9aa93818-7b3e-4196-b853-03648df182fb	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	3000	8000	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	74	2026-01-26 08:02:30.637	2026-02-18 16:23:24.826
16d8aed1-dc2e-4e44-9243-e82eb8db0a98	90a57a13-7f68-46a3-92ff-d9417f02e2d9	SEO & Content Marketing Strategy	We need an SEO expert to improve our Google ranking and create a 3-month content calendar.	627232ef-ea4d-4ebc-8f84-9554e9f511e8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	800	2000	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	284	2026-02-17 15:37:02.845	2026-02-18 16:23:24.829
54ac4972-55c7-4e93-bf6e-4acf731a2944	a130bf73-f351-4a22-a24d-0f9e9753cb71	Python Data Scraping Script	Need a Python script to scrape real estate data from 3 major websites daily and export to CSV.	647011ed-6560-47ee-9091-7b129a07c9ae	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	200	500	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	461	2026-02-15 13:00:56.778	2026-02-18 16:23:24.831
2d0d11d2-9bfd-495a-84e8-d1fdb9c456ab	d20125d0-2ced-46c1-893f-52e813af1c53	SEO & Content Marketing Strategy	We need an SEO expert to improve our Google ranking and create a 3-month content calendar.	627232ef-ea4d-4ebc-8f84-9554e9f511e8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	800	2000	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	147	2026-02-11 03:41:48.911	2026-02-18 16:23:24.833
4ae8d96e-69ce-42e2-b9b0-b2c84ab11e39	8083129e-0ea5-4508-b7d5-cde138d9dadb	Brand Identity Design	Looking for a creative designer to build a complete brand identity including logo, color palette, and business cards.	ae16d3d8-b2f0-47e4-843d-d41cc8a4028d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	500	1500	USD	\N	URGENT	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	251	2026-02-04 15:45:36.851	2026-02-18 16:23:24.839
95f9867c-fe87-4160-8c91-b213fc4c35c5	dec3a0ef-1e8a-4363-bde8-73765431b2b4	Promotional Video Editing	Need a professional video editor to create a 60-second promo video for our new product. Raw footage provided.	80ba105a-f0fb-4361-841c-cee2fe88003d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	300	800	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	188	2026-02-02 22:33:11.016	2026-02-18 16:23:24.841
97a79955-4c65-4fd5-991f-cc58f5912e9c	105bb1c7-f9b9-48b8-a031-76d2b52c2eff	Custom E-commerce Website Development	Looking for a full-stack developer to build a scalable e-commerce platform using Next.js and Node.js. Must include payment integration.	a58e3f12-ee73-4839-ada6-973b6de1db94	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	2000	5000	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	149	2026-01-27 08:12:21.11	2026-02-18 16:23:24.844
c7708cf6-78c7-4736-81e9-ccf0a27697e3	284e1c70-ae85-4096-a43d-0a407ad229af	Brand Identity Design	Looking for a creative designer to build a complete brand identity including logo, color palette, and business cards.	ae16d3d8-b2f0-47e4-843d-d41cc8a4028d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	500	1500	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	490	2026-02-06 04:27:22.096	2026-02-18 16:23:24.847
6ebafc36-38ed-4614-9350-d91d44a82d85	1cec89ac-cdb8-41fb-81ea-2650126f551f	Promotional Video Editing	Need a professional video editor to create a 60-second promo video for our new product. Raw footage provided.	80ba105a-f0fb-4361-841c-cee2fe88003d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	300	800	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	2	2026-02-11 10:57:02.548	2026-02-18 16:23:24.85
675bbd10-6fd5-4991-86fb-e681d2df1e87	90a57a13-7f68-46a3-92ff-d9417f02e2d9	Promotional Video Editing	Need a professional video editor to create a 60-second promo video for our new product. Raw footage provided.	80ba105a-f0fb-4361-841c-cee2fe88003d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	300	800	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	489	2026-01-29 05:06:58.758	2026-02-18 16:23:24.852
f6193532-a307-41a5-81b5-0ed170ede12f	1abb39df-0929-4386-aff1-8a5ae3668375	Transportation Service Required	We are looking for a professional provider for Transportation. Please review the project requirements and submit a competitive proposal.	48005ecb-8c84-485d-b9bc-140dd788f72c	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	548	1219	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-16 02:52:06.43	2026-02-18 16:23:24.855
cc2dbc47-3701-4243-afdb-0afe82d1b405	b074439b-dfb8-4bd9-92b5-b58137b917aa	Promotional Video Editing	Need a professional video editor to create a 60-second promo video for our new product. Raw footage provided.	80ba105a-f0fb-4361-841c-cee2fe88003d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	300	800	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	405	2026-01-20 12:38:42.603	2026-02-18 16:23:24.858
26e1bde3-98d0-47ba-9a3d-1f289ed20cc5	2849b948-60db-409c-aac1-5dc6cf411051	Transportation Service Required	We are looking for a professional provider for Transportation. Please review the project requirements and submit a competitive proposal.	48005ecb-8c84-485d-b9bc-140dd788f72c	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	101	1281	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-11 09:14:08.964	2026-02-18 16:23:24.86
892cdbfb-94b0-487e-8512-0f1ccc5c1683	284e1c70-ae85-4096-a43d-0a407ad229af	Healthcare Service Required	We are looking for a professional provider for Healthcare. Please review the project requirements and submit a competitive proposal.	9997915a-51af-4ce5-b775-0ed8079d0e8e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	558	1736	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-13 16:34:41.806	2026-02-18 16:23:24.863
5c6f002e-fe58-40a0-925c-ac07e957f5fa	068d20f7-d8fe-405f-b31b-989f997b2042	Healthcare Service Required	We are looking for a professional provider for Healthcare. Please review the project requirements and submit a competitive proposal.	9997915a-51af-4ce5-b775-0ed8079d0e8e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	265	1439	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-17 09:39:44.104	2026-02-18 16:23:24.865
d2b7db39-523d-496b-b98b-c59b3c4b3cba	a130bf73-f351-4a22-a24d-0f9e9753cb71	Python Data Scraping Script	Need a Python script to scrape real estate data from 3 major websites daily and export to CSV.	647011ed-6560-47ee-9091-7b129a07c9ae	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	200	500	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	375	2026-01-28 15:45:08.881	2026-02-18 16:23:24.871
0158e4d3-e5e9-46cd-8fae-28b572e33462	cbe519db-242b-4272-ba76-2a8becc4effb	Business Plan for Startup	Need a financial consultant to help create a 5-year business plan and financial projection for a tech startup.	4e4ff339-844e-4804-982c-c3e7e315be9e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	1000	3000	USD	\N	URGENT	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	188	2026-01-30 13:40:44.438	2026-02-18 16:23:24.876
5115fd8a-29d6-4dfb-817f-1729cc3936cc	90a57a13-7f68-46a3-92ff-d9417f02e2d9	Promotional Video Editing	Need a professional video editor to create a 60-second promo video for our new product. Raw footage provided.	80ba105a-f0fb-4361-841c-cee2fe88003d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	300	800	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	461	2026-01-19 14:16:23.173	2026-02-18 16:23:24.88
f89c7422-6cfc-4154-bf72-20de168c67da	068d20f7-d8fe-405f-b31b-989f997b2042	Custom E-commerce Website Development	Looking for a full-stack developer to build a scalable e-commerce platform using Next.js and Node.js. Must include payment integration.	a58e3f12-ee73-4839-ada6-973b6de1db94	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	2000	5000	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	93	2026-01-28 09:52:05.729	2026-02-18 16:23:24.882
3a66333f-da78-443b-bde4-579732ad2a34	b074439b-dfb8-4bd9-92b5-b58137b917aa	Business Plan for Startup	Need a financial consultant to help create a 5-year business plan and financial projection for a tech startup.	4e4ff339-844e-4804-982c-c3e7e315be9e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	1000	3000	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	80	2026-01-21 14:38:58.877	2026-02-18 16:23:24.885
c1a1cf51-799b-46c2-a896-467862a7b677	dec3a0ef-1e8a-4363-bde8-73765431b2b4	Brand Identity Design	Looking for a creative designer to build a complete brand identity including logo, color palette, and business cards.	ae16d3d8-b2f0-47e4-843d-d41cc8a4028d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	500	1500	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	402	2026-01-31 23:29:06.924	2026-02-18 16:23:24.888
25ec6c03-2443-4b2f-9c96-1df4c3e29217	cbe519db-242b-4272-ba76-2a8becc4effb	Custom E-commerce Website Development	Looking for a full-stack developer to build a scalable e-commerce platform using Next.js and Node.js. Must include payment integration.	a58e3f12-ee73-4839-ada6-973b6de1db94	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	2000	5000	USD	\N	URGENT	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	188	2026-02-07 22:42:48.811	2026-02-18 16:23:24.891
7b30f492-0bea-4277-bc1b-e506d58d5208	bd0313b9-45a5-4ec5-84f0-bb0f8b98c7ab	Brand Identity Design	Looking for a creative designer to build a complete brand identity including logo, color palette, and business cards.	ae16d3d8-b2f0-47e4-843d-d41cc8a4028d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	500	1500	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	439	2026-01-31 10:45:20.431	2026-02-18 16:23:24.895
80bcc0fd-f30b-4b64-b2ad-73e3970a70ab	bc441d06-eb20-43fe-8728-97ad52f2d99f	Brand Identity Design	Looking for a creative designer to build a complete brand identity including logo, color palette, and business cards.	ae16d3d8-b2f0-47e4-843d-d41cc8a4028d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	500	1500	USD	\N	URGENT	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	5	2026-01-19 13:28:19.521	2026-02-18 16:23:24.897
a30ac3ac-91d4-49ab-b3a1-ad62edffcfd0	068d20f7-d8fe-405f-b31b-989f997b2042	Technical Blog Writing	Looking for a writer with tech background to write 4 detailed articles about Cloud Computing and AI.	28584798-4de1-496c-9fd0-b88f7ad41a93	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	200	400	USD	\N	URGENT	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	375	2026-02-01 15:35:54.735	2026-02-18 16:23:24.899
a4468de8-5316-4d23-90a0-a3fc862fa55c	90a57a13-7f68-46a3-92ff-d9417f02e2d9	Business Plan for Startup	Need a financial consultant to help create a 5-year business plan and financial projection for a tech startup.	4e4ff339-844e-4804-982c-c3e7e315be9e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	1000	3000	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	395	2026-02-11 11:20:12.482	2026-02-18 16:23:24.902
a41144dc-035b-4698-ba8d-2d5414fd98d8	8083129e-0ea5-4508-b7d5-cde138d9dadb	Promotional Video Editing	Need a professional video editor to create a 60-second promo video for our new product. Raw footage provided.	80ba105a-f0fb-4361-841c-cee2fe88003d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	300	800	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	4	2026-02-03 07:14:27.38	2026-02-18 16:23:24.904
2863f160-faec-46da-9cf2-d8f8e1056a5d	112e2545-b79b-4375-b02e-ab398816ccd0	Education & Training Service Required	We are looking for a professional provider for Education & Training. Please review the project requirements and submit a competitive proposal.	5b49ca23-0797-411a-a41f-232b402d02fe	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	418	1896	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-13 11:35:00.557	2026-02-18 16:23:24.907
c032988f-f27e-4667-ae83-a8791bc98817	5cfbcdd0-0b36-4921-a3c2-fa504ca8a20d	Education & Training Service Required	We are looking for a professional provider for Education & Training. Please review the project requirements and submit a competitive proposal.	5b49ca23-0797-411a-a41f-232b402d02fe	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	522	699	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-11 03:19:06.099	2026-02-18 16:23:24.909
f32ea215-6731-485d-b9ab-5e0ee149d92b	00a886d6-2514-4dd6-b1bf-96a9fa2cecb6	Events & Entertainment Service Required	We are looking for a professional provider for Events & Entertainment. Please review the project requirements and submit a competitive proposal.	48e249e6-bf40-4338-8d91-16c2ffe0db3f	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	381	782	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-13 04:28:19.517	2026-02-18 16:23:24.911
528e4de6-0ee2-48d2-bbec-4307f36d33d1	2849b948-60db-409c-aac1-5dc6cf411051	Events & Entertainment Service Required	We are looking for a professional provider for Events & Entertainment. Please review the project requirements and submit a competitive proposal.	48e249e6-bf40-4338-8d91-16c2ffe0db3f	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	192	1401	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-14 06:12:11.689	2026-02-18 16:23:24.913
5b39d0f5-a39a-42d0-b812-7a384b398f7f	d20125d0-2ced-46c1-893f-52e813af1c53	Custom E-commerce Website Development	Looking for a full-stack developer to build a scalable e-commerce platform using Next.js and Node.js. Must include payment integration.	a58e3f12-ee73-4839-ada6-973b6de1db94	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	2000	5000	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	380	2026-01-28 23:54:33.759	2026-02-18 16:23:24.918
d89945ce-b493-45db-89ec-ab819a39864a	068d20f7-d8fe-405f-b31b-989f997b2042	SEO & Content Marketing Strategy	We need an SEO expert to improve our Google ranking and create a 3-month content calendar.	627232ef-ea4d-4ebc-8f84-9554e9f511e8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	800	2000	USD	\N	URGENT	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	464	2026-01-28 10:25:07.322	2026-02-18 16:23:24.922
60bb4aa9-995a-4f6a-9792-de681c2a6cde	284e1c70-ae85-4096-a43d-0a407ad229af	Promotional Video Editing	Need a professional video editor to create a 60-second promo video for our new product. Raw footage provided.	80ba105a-f0fb-4361-841c-cee2fe88003d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	300	800	USD	\N	URGENT	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	290	2026-01-28 08:37:38.781	2026-02-18 16:23:24.924
50945afd-4701-40b6-a77b-f866a27a9aab	7f65f52e-949f-493b-9ebf-4af5e98b832b	Brand Identity Design	Looking for a creative designer to build a complete brand identity including logo, color palette, and business cards.	ae16d3d8-b2f0-47e4-843d-d41cc8a4028d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	500	1500	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	424	2026-01-26 06:09:15.756	2026-02-18 16:23:24.926
d89f4d49-7aab-49ee-bad3-42ab1a2e298a	8083129e-0ea5-4508-b7d5-cde138d9dadb	Business Plan for Startup	Need a financial consultant to help create a 5-year business plan and financial projection for a tech startup.	4e4ff339-844e-4804-982c-c3e7e315be9e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	1000	3000	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	314	2026-02-10 17:13:09.929	2026-02-18 16:23:24.929
415908b9-e9dd-4b8a-875f-f4f2ba16c0a7	bc441d06-eb20-43fe-8728-97ad52f2d99f	Promotional Video Editing	Need a professional video editor to create a 60-second promo video for our new product. Raw footage provided.	80ba105a-f0fb-4361-841c-cee2fe88003d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	300	800	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	363	2026-01-21 15:17:55.268	2026-02-18 16:23:24.934
e82a0546-d5c6-470f-bb92-37e07f553083	5cfbcdd0-0b36-4921-a3c2-fa504ca8a20d	Mobile App Development for Food Delivery	Need a native iOS and Android app for a new food delivery service. Features include GPS tracking, user profiles, and order management.	9aa93818-7b3e-4196-b853-03648df182fb	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	3000	8000	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	386	2026-02-03 19:12:50.301	2026-02-18 16:23:24.936
e55b8855-0ebf-47f3-af84-6a3186eae70f	9d01669c-4bd3-4f02-8179-90ca8de71870	Python Data Scraping Script	Need a Python script to scrape real estate data from 3 major websites daily and export to CSV.	647011ed-6560-47ee-9091-7b129a07c9ae	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	200	500	USD	\N	URGENT	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	242	2026-01-29 14:54:25.249	2026-02-18 16:23:24.938
15de5f03-b999-49ed-bc1c-548cec836428	fc08c893-00af-44a4-b355-18d5c8b3e36f	SEO & Content Marketing Strategy	We need an SEO expert to improve our Google ranking and create a 3-month content calendar.	627232ef-ea4d-4ebc-8f84-9554e9f511e8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	800	2000	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	298	2026-02-09 09:33:26.524	2026-02-18 16:23:24.94
9bc739dd-dd5b-4fd4-8a29-7743831276bd	d20125d0-2ced-46c1-893f-52e813af1c53	Brand Identity Design	Looking for a creative designer to build a complete brand identity including logo, color palette, and business cards.	ae16d3d8-b2f0-47e4-843d-d41cc8a4028d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	500	1500	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	101	2026-02-18 06:49:27.906	2026-02-18 16:23:24.943
e45bba5a-878e-408c-88c7-5f33d07dd23c	b074439b-dfb8-4bd9-92b5-b58137b917aa	Mobile App Development for Food Delivery	Need a native iOS and Android app for a new food delivery service. Features include GPS tracking, user profiles, and order management.	9aa93818-7b3e-4196-b853-03648df182fb	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	3000	8000	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	180	2026-02-17 08:24:07.158	2026-02-18 16:23:24.945
85030959-91b4-40ee-8de6-68056c4abba0	90a57a13-7f68-46a3-92ff-d9417f02e2d9	SEO & Content Marketing Strategy	We need an SEO expert to improve our Google ranking and create a 3-month content calendar.	627232ef-ea4d-4ebc-8f84-9554e9f511e8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	800	2000	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	68	2026-01-30 23:37:45.205	2026-02-18 16:23:24.947
64eab684-4310-483d-a12b-a63010733f00	5cfbcdd0-0b36-4921-a3c2-fa504ca8a20d	Mobile App Development for Food Delivery	Need a native iOS and Android app for a new food delivery service. Features include GPS tracking, user profiles, and order management.	9aa93818-7b3e-4196-b853-03648df182fb	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	3000	8000	USD	\N	URGENT	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	70	2026-01-22 07:11:09.602	2026-02-18 16:23:24.949
d9434e18-5afd-49f3-8774-7f0921be0db2	90a57a13-7f68-46a3-92ff-d9417f02e2d9	Electrical Service Required	We are looking for a professional provider for Electrical. Please review the project requirements and submit a competitive proposal.	c5e2b66e-b100-41d9-bba8-e110b2abab71	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	330	1165	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-17 12:34:33.293	2026-02-18 16:23:24.951
e7c7db48-93db-4e81-8a8d-2bed1151224a	762f836e-6368-4fa0-9757-af9898900a8d	Electrical Service Required	We are looking for a professional provider for Electrical. Please review the project requirements and submit a competitive proposal.	c5e2b66e-b100-41d9-bba8-e110b2abab71	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	470	1736	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-16 16:18:13.923	2026-02-18 16:23:24.953
08f186b9-c2d2-4e9b-9fdc-82bdc530803f	2849b948-60db-409c-aac1-5dc6cf411051	Plumbing Service Required	We are looking for a professional provider for Plumbing. Please review the project requirements and submit a competitive proposal.	98e85028-eaff-4c4c-a5ae-ccbe1c88e837	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	420	1800	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-12 22:19:21.179	2026-02-18 16:23:24.955
bdb071d0-3c72-4560-872e-6fb692fcdbe6	366db2af-9cf4-45d6-b0b7-896f68acd563	Construction Service Required	We are looking for a professional provider for Construction. Please review the project requirements and submit a competitive proposal.	7049731f-af4e-489e-b560-096dfa6b7869	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	263	615	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-10 06:00:58.231	2026-02-18 16:23:24.959
68f8db2a-069a-437a-a7bc-c1716f95142b	1b804e9c-1a66-4436-b031-5f958678241c	Construction Service Required	We are looking for a professional provider for Construction. Please review the project requirements and submit a competitive proposal.	7049731f-af4e-489e-b560-096dfa6b7869	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	563	1950	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-14 00:10:02.545	2026-02-18 16:23:24.962
c9ae6946-7a53-41a8-add0-5cec5c9ddbfc	2dae1352-4180-4f5f-8606-7cd01c61b9d8	Cleaning Service Required	We are looking for a professional provider for Cleaning. Please review the project requirements and submit a competitive proposal.	98d60428-77df-4a56-8bca-4025dd191119	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	556	707	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-17 18:50:35.534	2026-02-18 16:23:24.965
9afc4482-31a9-4e49-861e-972c8bd6376a	cbe519db-242b-4272-ba76-2a8becc4effb	Brand Identity Design	Looking for a creative designer to build a complete brand identity including logo, color palette, and business cards.	ae16d3d8-b2f0-47e4-843d-d41cc8a4028d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	500	1500	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	27	2026-02-10 01:48:34.659	2026-02-18 16:23:24.967
907f14a4-d1b1-4a51-952e-e03ca20701bf	8083129e-0ea5-4508-b7d5-cde138d9dadb	Python Data Scraping Script	Need a Python script to scrape real estate data from 3 major websites daily and export to CSV.	647011ed-6560-47ee-9091-7b129a07c9ae	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	200	500	USD	\N	URGENT	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	348	2026-02-17 14:24:53.098	2026-02-18 16:23:24.969
8a58b0f6-a184-4e7d-9087-f4cb52d776cf	b074439b-dfb8-4bd9-92b5-b58137b917aa	Python Data Scraping Script	Need a Python script to scrape real estate data from 3 major websites daily and export to CSV.	647011ed-6560-47ee-9091-7b129a07c9ae	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	200	500	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	451	2026-02-15 15:55:40.756	2026-02-18 16:23:24.973
fcf76779-6eec-43cb-80b4-c15d00b91251	cbe519db-242b-4272-ba76-2a8becc4effb	Promotional Video Editing	Need a professional video editor to create a 60-second promo video for our new product. Raw footage provided.	80ba105a-f0fb-4361-841c-cee2fe88003d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	300	800	USD	\N	URGENT	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	329	2026-02-17 20:42:38.187	2026-02-18 16:23:24.975
58e4fb14-dd88-4943-ae1c-0e6ee1a801eb	e37dbeda-0d5f-4a04-a0df-2fd87726258c	Custom E-commerce Website Development	Looking for a full-stack developer to build a scalable e-commerce platform using Next.js and Node.js. Must include payment integration.	a58e3f12-ee73-4839-ada6-973b6de1db94	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	2000	5000	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	382	2026-01-26 18:01:44.777	2026-02-18 16:23:24.977
e38541b7-2930-47cf-88e9-f27647372134	cbe519db-242b-4272-ba76-2a8becc4effb	SEO & Content Marketing Strategy	We need an SEO expert to improve our Google ranking and create a 3-month content calendar.	627232ef-ea4d-4ebc-8f84-9554e9f511e8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	800	2000	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	280	2026-02-02 21:45:02.378	2026-02-18 16:23:24.979
379fb6cd-beb8-4c20-a1cc-5999d2e654a6	284e1c70-ae85-4096-a43d-0a407ad229af	Business Plan for Startup	Need a financial consultant to help create a 5-year business plan and financial projection for a tech startup.	4e4ff339-844e-4804-982c-c3e7e315be9e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	1000	3000	USD	\N	URGENT	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	26	2026-01-26 09:53:59.365	2026-02-18 16:23:24.981
4b6d43fe-a55d-4eca-950e-cce954fd76e4	dec3a0ef-1e8a-4363-bde8-73765431b2b4	Python Data Scraping Script	Need a Python script to scrape real estate data from 3 major websites daily and export to CSV.	647011ed-6560-47ee-9091-7b129a07c9ae	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	200	500	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	436	2026-02-11 16:35:17.802	2026-02-18 16:23:24.984
b6e1926b-e8ff-48d5-be04-4efbbd58b3af	1abb39df-0929-4386-aff1-8a5ae3668375	Custom E-commerce Website Development	Looking for a full-stack developer to build a scalable e-commerce platform using Next.js and Node.js. Must include payment integration.	a58e3f12-ee73-4839-ada6-973b6de1db94	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	2000	5000	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	469	2026-02-13 18:47:01.593	2026-02-18 16:23:24.986
dbb335cd-772e-40e5-be68-e9c24994b5a6	068d20f7-d8fe-405f-b31b-989f997b2042	Mobile App Development for Food Delivery	Need a native iOS and Android app for a new food delivery service. Features include GPS tracking, user profiles, and order management.	9aa93818-7b3e-4196-b853-03648df182fb	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	3000	8000	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	187	2026-02-04 11:38:12.488	2026-02-18 16:23:24.988
bd958d04-4034-47c9-bc49-652b14364d09	dec3a0ef-1e8a-4363-bde8-73765431b2b4	Business Plan for Startup	Need a financial consultant to help create a 5-year business plan and financial projection for a tech startup.	4e4ff339-844e-4804-982c-c3e7e315be9e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	1000	3000	USD	\N	URGENT	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	178	2026-01-20 00:30:38.683	2026-02-18 16:23:24.99
1c6ed6cb-6dfd-45ea-9807-ccfe5c19a1d9	1cec89ac-cdb8-41fb-81ea-2650126f551f	Custom E-commerce Website Development	Looking for a full-stack developer to build a scalable e-commerce platform using Next.js and Node.js. Must include payment integration.	a58e3f12-ee73-4839-ada6-973b6de1db94	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	2000	5000	USD	\N	URGENT	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	157	2026-02-03 06:33:11.489	2026-02-18 16:23:24.992
36ff73b9-7ba4-436d-b7e3-1ba8d95c8c8a	5cfbcdd0-0b36-4921-a3c2-fa504ca8a20d	Promotional Video Editing	Need a professional video editor to create a 60-second promo video for our new product. Raw footage provided.	80ba105a-f0fb-4361-841c-cee2fe88003d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	300	800	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	202	2026-02-12 18:20:09.01	2026-02-18 16:23:24.994
130464a3-f5db-49e9-8b22-868d12e120bf	068d20f7-d8fe-405f-b31b-989f997b2042	Moving Service Required	We are looking for a professional provider for Moving. Please review the project requirements and submit a competitive proposal.	d69b3ed6-faf5-4746-ba0f-eb57708676aa	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	135	1093	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-16 17:23:17.227	2026-02-18 16:23:25.003
5546f4cf-a98f-4295-9f26-26ae67ccbcab	709f0a1e-1bdd-4c0d-9509-9f26a46e9d03	AC Installation Service Required	We are looking for a professional provider for AC Installation. Please review the project requirements and submit a competitive proposal.	c5168990-ce7e-4c39-b9ac-8fbbe3bdefb0	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	344	904	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-16 21:20:20.465	2026-02-18 16:23:25.006
fbd25136-151f-4956-b9b5-c8a02a0b19c4	709f0a1e-1bdd-4c0d-9509-9f26a46e9d03	Design Service Required	We are looking for a professional provider for Design. Please review the project requirements and submit a competitive proposal.	71cdffe5-1523-4ae3-82c7-d76dc438f90f	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	550	676	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-09 04:55:59.398	2026-02-18 16:23:25.009
ef7bc069-12b3-4be7-b5be-29acc4928c33	2dae1352-4180-4f5f-8606-7cd01c61b9d8	Mobile App Development for Food Delivery	Need a native iOS and Android app for a new food delivery service. Features include GPS tracking, user profiles, and order management.	9aa93818-7b3e-4196-b853-03648df182fb	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	3000	8000	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	469	2026-02-17 21:47:49.144	2026-02-18 16:23:25.011
0a0385e4-4b2f-4d3b-848a-6ae7db386fd2	1cec89ac-cdb8-41fb-81ea-2650126f551f	Promotional Video Editing	Need a professional video editor to create a 60-second promo video for our new product. Raw footage provided.	80ba105a-f0fb-4361-841c-cee2fe88003d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	300	800	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	397	2026-02-08 05:05:31.837	2026-02-18 16:23:25.014
f6b6e02a-bbaf-4127-b5dd-c98ffb8df7ee	1abb39df-0929-4386-aff1-8a5ae3668375	Promotional Video Editing	Need a professional video editor to create a 60-second promo video for our new product. Raw footage provided.	80ba105a-f0fb-4361-841c-cee2fe88003d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	300	800	USD	\N	URGENT	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	20	2026-01-22 00:32:50.04	2026-02-18 16:23:25.017
9459a9aa-9f5f-4cc5-9f73-8337d4044281	1abb39df-0929-4386-aff1-8a5ae3668375	SEO & Content Marketing Strategy	We need an SEO expert to improve our Google ranking and create a 3-month content calendar.	627232ef-ea4d-4ebc-8f84-9554e9f511e8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	800	2000	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	74	2026-01-21 03:00:36.64	2026-02-18 16:23:25.019
cb2352dd-3f57-486d-a192-625b60cb2b90	cbe519db-242b-4272-ba76-2a8becc4effb	Mobile App Development for Food Delivery	Need a native iOS and Android app for a new food delivery service. Features include GPS tracking, user profiles, and order management.	9aa93818-7b3e-4196-b853-03648df182fb	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	3000	8000	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	42	2026-02-01 10:31:06.418	2026-02-18 16:23:25.022
09b8e24e-fb50-4b93-b2e8-68010fc0ee34	dec3a0ef-1e8a-4363-bde8-73765431b2b4	Promotional Video Editing	Need a professional video editor to create a 60-second promo video for our new product. Raw footage provided.	80ba105a-f0fb-4361-841c-cee2fe88003d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	300	800	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	355	2026-02-07 04:17:39.391	2026-02-18 16:23:25.025
bf9bc5f4-e93c-4e9a-8944-e5d76b9d8dcb	9d01669c-4bd3-4f02-8179-90ca8de71870	Custom E-commerce Website Development	Looking for a full-stack developer to build a scalable e-commerce platform using Next.js and Node.js. Must include payment integration.	a58e3f12-ee73-4839-ada6-973b6de1db94	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	2000	5000	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	422	2026-02-03 08:08:15.963	2026-02-18 16:23:25.028
e16530d3-27c4-4a40-b8af-fc450c5df595	fc08c893-00af-44a4-b355-18d5c8b3e36f	Mobile App Development for Food Delivery	Need a native iOS and Android app for a new food delivery service. Features include GPS tracking, user profiles, and order management.	9aa93818-7b3e-4196-b853-03648df182fb	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	3000	8000	USD	\N	URGENT	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	87	2026-01-30 11:02:35.584	2026-02-18 16:23:25.031
915f9011-4bc1-4301-add9-91324f55e80c	5cfbcdd0-0b36-4921-a3c2-fa504ca8a20d	Business Plan for Startup	Need a financial consultant to help create a 5-year business plan and financial projection for a tech startup.	4e4ff339-844e-4804-982c-c3e7e315be9e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	1000	3000	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	66	2026-02-13 13:54:18.847	2026-02-18 16:23:25.034
e7c3d905-123b-466b-a1a2-63c8a77331d5	a130bf73-f351-4a22-a24d-0f9e9753cb71	Mobile App Development for Food Delivery	Need a native iOS and Android app for a new food delivery service. Features include GPS tracking, user profiles, and order management.	9aa93818-7b3e-4196-b853-03648df182fb	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	3000	8000	USD	\N	URGENT	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	225	2026-01-25 17:06:52.711	2026-02-18 16:23:25.037
e21ea1b2-1610-4771-b5bb-6251df2cae99	1abb39df-0929-4386-aff1-8a5ae3668375	Business Plan for Startup	Need a financial consultant to help create a 5-year business plan and financial projection for a tech startup.	4e4ff339-844e-4804-982c-c3e7e315be9e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	1000	3000	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	224	2026-02-15 14:39:48.876	2026-02-18 16:23:25.04
b51a6926-6105-4fb6-a46c-9b5ffddb431b	284e1c70-ae85-4096-a43d-0a407ad229af	Promotional Video Editing	Need a professional video editor to create a 60-second promo video for our new product. Raw footage provided.	80ba105a-f0fb-4361-841c-cee2fe88003d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	300	800	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	247	2026-02-04 15:35:36.576	2026-02-18 16:23:25.043
f0a8ba24-cdd4-4532-a7ff-a83c7bb7504b	9d01669c-4bd3-4f02-8179-90ca8de71870	Technical Blog Writing	Looking for a writer with tech background to write 4 detailed articles about Cloud Computing and AI.	28584798-4de1-496c-9fd0-b88f7ad41a93	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	200	400	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	442	2026-02-12 05:01:44.907	2026-02-18 16:23:25.046
69b64b00-92a4-408b-92c0-d7687c3767d0	40892513-50c2-4a41-9f1a-be224ae492fa	Electrical Wiring Service Required	We are looking for a professional provider for Electrical Wiring. Please review the project requirements and submit a competitive proposal.	9ac120a7-3f97-47fd-b5ee-619b7711dcf4	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	262	679	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-15 18:49:34.664	2026-02-18 16:23:25.051
d0d165a9-911a-44af-96e6-c6fed889d673	8083129e-0ea5-4508-b7d5-cde138d9dadb	Electrical Repairs Service Required	We are looking for a professional provider for Electrical Repairs. Please review the project requirements and submit a competitive proposal.	8981ac1a-f116-4694-898e-afda5de9b73c	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	467	744	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-18 01:10:55.105	2026-02-18 16:23:25.057
a27e0b4b-122e-4f56-9397-0882d87885a0	2b1bfbaf-1f04-4124-bd01-68c75f8acd95	Electrical Repairs Service Required	We are looking for a professional provider for Electrical Repairs. Please review the project requirements and submit a competitive proposal.	8981ac1a-f116-4694-898e-afda5de9b73c	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	154	1487	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-14 13:22:44.857	2026-02-18 16:23:25.06
03b9eb58-1767-4c25-a029-99fbbc0ecd24	3da19a13-09aa-4c8c-a338-a50a373a1351	Lighting Install Service Required	We are looking for a professional provider for Lighting Install. Please review the project requirements and submit a competitive proposal.	b18f064e-30fd-4227-a6e0-94efae54d8f2	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	495	1042	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-12 09:16:17.236	2026-02-18 16:23:25.064
37591e9d-1086-43f6-ace3-8919c5280ea7	1b804e9c-1a66-4436-b031-5f958678241c	Lighting Install Service Required	We are looking for a professional provider for Lighting Install. Please review the project requirements and submit a competitive proposal.	b18f064e-30fd-4227-a6e0-94efae54d8f2	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	509	936	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-12 00:51:06.104	2026-02-18 16:23:25.066
001917ad-3d75-4404-a648-a159d0169064	762f836e-6368-4fa0-9757-af9898900a8d	Generator Maintenance Service Required	We are looking for a professional provider for Generator Maintenance. Please review the project requirements and submit a competitive proposal.	4acb75e6-2c26-4912-8857-867cc55d05ed	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	324	1047	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-16 18:01:46.737	2026-02-18 16:23:25.069
cbd31f76-b857-4af1-9851-2167d2106066	4f3d2896-0e00-4f98-b579-ba9254f28c1f	Generator Maintenance Service Required	We are looking for a professional provider for Generator Maintenance. Please review the project requirements and submit a competitive proposal.	4acb75e6-2c26-4912-8857-867cc55d05ed	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	196	1297	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-13 00:33:39.406	2026-02-18 16:23:25.072
8fa45ada-5ae4-4eb8-815e-7745c624778a	284e1c70-ae85-4096-a43d-0a407ad229af	Solar Panel Install Service Required	We are looking for a professional provider for Solar Panel Install. Please review the project requirements and submit a competitive proposal.	3d4fec38-cbdd-45e0-8fab-73e5a05a1600	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	124	1050	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-12 09:40:28.013	2026-02-18 16:23:25.074
168b24b9-e89a-4ff1-ab58-4744d527fdac	8b7f1800-caca-4959-a6d8-4c763c4775f0	Solar Panel Install Service Required	We are looking for a professional provider for Solar Panel Install. Please review the project requirements and submit a competitive proposal.	3d4fec38-cbdd-45e0-8fab-73e5a05a1600	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	418	839	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-11 17:22:08.982	2026-02-18 16:23:25.077
889c105d-f3ee-4dd4-81fc-b4d6fb523c63	5a529f50-7761-4049-a023-1b9120b244d7	Solar System Maint Service Required	We are looking for a professional provider for Solar System Maint. Please review the project requirements and submit a competitive proposal.	0def337f-dd79-4734-9227-80c91e4a2bf9	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	587	1275	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-17 22:35:17.729	2026-02-18 16:23:25.08
86adf060-b5a3-40a5-85a6-0e9f887573db	5cfbcdd0-0b36-4921-a3c2-fa504ca8a20d	Solar System Maint Service Required	We are looking for a professional provider for Solar System Maint. Please review the project requirements and submit a competitive proposal.	0def337f-dd79-4734-9227-80c91e4a2bf9	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	101	1243	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-17 01:54:08.307	2026-02-18 16:23:25.082
c0c58594-8c26-4cf5-922e-473608c78b4e	9d01669c-4bd3-4f02-8179-90ca8de71870	Electrical Panel Service Required	We are looking for a professional provider for Electrical Panel. Please review the project requirements and submit a competitive proposal.	38cb0fe6-bc94-4f20-b0ab-fc5ce125ec38	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	310	886	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-13 14:52:38.558	2026-02-18 16:23:25.085
8bc4a28f-aab4-4c7a-899a-3cac52b3d7f0	2a474982-5739-47fb-81f2-e1273e800c55	Electrical Panel Service Required	We are looking for a professional provider for Electrical Panel. Please review the project requirements and submit a competitive proposal.	38cb0fe6-bc94-4f20-b0ab-fc5ce125ec38	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	344	1213	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-17 10:24:41.728	2026-02-18 16:23:25.088
6aea2ca1-9467-4fe4-96a5-85f4126a0212	8ea63e67-d7e4-4104-93de-361bba4a4aa9	Backup Power Systems Service Required	We are looking for a professional provider for Backup Power Systems. Please review the project requirements and submit a competitive proposal.	c79261af-78c0-4b45-97b6-d918a3b015c0	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	218	1786	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-17 04:39:17.711	2026-02-18 16:23:25.091
171fc283-cbfa-4cf7-9360-0432eb6d52bb	105bb1c7-f9b9-48b8-a031-76d2b52c2eff	Backup Power Systems Service Required	We are looking for a professional provider for Backup Power Systems. Please review the project requirements and submit a competitive proposal.	c79261af-78c0-4b45-97b6-d918a3b015c0	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	447	887	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-16 06:29:00.562	2026-02-18 16:23:25.094
d2369125-f111-4cf4-8658-6eb8b54e2716	5cfbcdd0-0b36-4921-a3c2-fa504ca8a20d	Leak Detection & Repair Service Required	We are looking for a professional provider for Leak Detection & Repair. Please review the project requirements and submit a competitive proposal.	b52de601-ed5f-4be7-b531-55e4573892f1	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	549	1093	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-17 16:40:20.162	2026-02-18 16:23:25.099
8df77249-6398-44e4-99be-620db93ba012	4f3d2896-0e00-4f98-b579-ba9254f28c1f	Pipe Installation Service Required	We are looking for a professional provider for Pipe Installation. Please review the project requirements and submit a competitive proposal.	6805a74f-f7f9-419c-858f-49b99247e35b	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	499	669	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-16 10:11:34.839	2026-02-18 16:23:25.102
2fc2a16d-c8f2-46c1-bdf3-54a0c7cb64e3	8ba353a3-cf79-4e4c-861c-e11c23537b2c	Water Heater Install Service Required	We are looking for a professional provider for Water Heater Install. Please review the project requirements and submit a competitive proposal.	65ddaf4f-5020-4a5f-bcde-d6bea9a519ac	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	439	1697	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-09 20:10:19.822	2026-02-18 16:23:25.108
cb6487b4-0e5b-4ab9-91f5-73e0d1cc755c	18c8e3e0-1a95-467d-8a49-a027cee0e5bd	Water Heater Install Service Required	We are looking for a professional provider for Water Heater Install. Please review the project requirements and submit a competitive proposal.	65ddaf4f-5020-4a5f-bcde-d6bea9a519ac	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	304	777	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-08 22:30:05.142	2026-02-18 16:23:25.11
460a7812-522c-4392-a9af-c667c196edc9	105bb1c7-f9b9-48b8-a031-76d2b52c2eff	Water Heater Repair Service Required	We are looking for a professional provider for Water Heater Repair. Please review the project requirements and submit a competitive proposal.	487b84b5-be40-43ae-b5ed-96a494083762	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	312	1582	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-13 00:02:30.327	2026-02-18 16:23:25.111
ea3f56be-c331-46f1-a4cb-3fa20164fd3e	1cec89ac-cdb8-41fb-81ea-2650126f551f	Water Heater Repair Service Required	We are looking for a professional provider for Water Heater Repair. Please review the project requirements and submit a competitive proposal.	487b84b5-be40-43ae-b5ed-96a494083762	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	252	1737	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-12 15:38:42.911	2026-02-18 16:23:25.114
82be221f-47ae-4256-a6b9-779ca3759584	36a2106b-e2be-4917-bdb4-abd8e97d8917	Bathroom Plumbing Service Required	We are looking for a professional provider for Bathroom Plumbing. Please review the project requirements and submit a competitive proposal.	bd693184-a710-441e-aa8b-d7c15901bac9	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	166	651	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-15 11:09:04.129	2026-02-18 16:23:25.116
60d4a97f-4651-4966-872f-ee2a485a7926	31494848-428e-4d55-b324-2eb64c380f32	Bathroom Plumbing Service Required	We are looking for a professional provider for Bathroom Plumbing. Please review the project requirements and submit a competitive proposal.	bd693184-a710-441e-aa8b-d7c15901bac9	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	108	1759	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-14 03:23:30.651	2026-02-18 16:23:25.118
b1ad901a-6000-41e3-abc8-3caf69957a26	02d635af-3510-4db3-9e4f-b0afad0cd7b3	Kitchen Plumbing Service Required	We are looking for a professional provider for Kitchen Plumbing. Please review the project requirements and submit a competitive proposal.	e9264c4c-cd5f-4c68-acbd-e99f48182171	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	316	1363	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-17 22:45:45.544	2026-02-18 16:23:25.12
bc10e3bb-329b-4403-bf50-6e4f1f7eef1c	1fe1195e-328a-4400-8f78-e85a8d9de7c4	Kitchen Plumbing Service Required	We are looking for a professional provider for Kitchen Plumbing. Please review the project requirements and submit a competitive proposal.	e9264c4c-cd5f-4c68-acbd-e99f48182171	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	541	2036	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-08 21:21:17.691	2026-02-18 16:23:25.122
826969b0-e9fe-462a-a622-e30a54a4946c	6a4d8b84-efd3-44fd-82bc-ee188ec1776d	Accounting Services Service Required	We are looking for a professional provider for Accounting Services. Please review the project requirements and submit a competitive proposal.	dd57d659-e8bf-4a47-897c-1fb44c56a16d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	288	1845	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-08 23:01:15.182	2026-02-18 16:23:25.124
efdffb3c-044f-43ff-a55f-56aa0f4d1bd2	8ea63e67-d7e4-4104-93de-361bba4a4aa9	Accounting Services Service Required	We are looking for a professional provider for Accounting Services. Please review the project requirements and submit a competitive proposal.	dd57d659-e8bf-4a47-897c-1fb44c56a16d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	201	685	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-10 05:04:36.487	2026-02-18 16:23:25.126
266e60c6-5056-4cdf-b313-5ab0f038fa84	068d20f7-d8fe-405f-b31b-989f997b2042	Legal Consultation Service Required	We are looking for a professional provider for Legal Consultation. Please review the project requirements and submit a competitive proposal.	11552f47-066a-4cad-b38a-2c74eed0bed4	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	155	1011	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-14 08:40:41.481	2026-02-18 16:23:25.128
f53ba940-34a7-4f49-af41-1fe865b00c40	1dc82269-4fd8-4f16-8810-88d97fbad231	Legal Consultation Service Required	We are looking for a professional provider for Legal Consultation. Please review the project requirements and submit a competitive proposal.	11552f47-066a-4cad-b38a-2c74eed0bed4	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	262	1417	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-09 20:08:19.301	2026-02-18 16:23:25.13
23f76b9f-0cad-4014-8570-1e58804a1696	9d01669c-4bd3-4f02-8179-90ca8de71870	Photography Service Required	We are looking for a professional provider for Photography. Please review the project requirements and submit a competitive proposal.	deb10409-fb05-4a07-a0f4-dda54988cd52	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	219	1489	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-11 17:29:11.628	2026-02-18 16:23:25.132
3b59be5f-5919-4587-867b-f8ad933af791	596dc79c-62e9-4580-a86b-615f19709d59	Drain Cleaning Service Required	We are looking for a professional provider for Drain Cleaning. Please review the project requirements and submit a competitive proposal.	5037cea3-0eba-4061-b365-33a8ce2b99e5	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	374	1961	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-10 19:38:52.893	2026-02-18 16:23:25.136
08079bf6-c804-42fc-b177-29fdfb67466e	1abb39df-0929-4386-aff1-8a5ae3668375	Drain Cleaning Service Required	We are looking for a professional provider for Drain Cleaning. Please review the project requirements and submit a competitive proposal.	5037cea3-0eba-4061-b365-33a8ce2b99e5	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	555	1803	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-12 01:49:12.481	2026-02-18 16:23:25.139
9a641fb4-9ca9-412c-b00f-ca5cdefd0340	5a529f50-7761-4049-a023-1b9120b244d7	Water Tank Install Service Required	We are looking for a professional provider for Water Tank Install. Please review the project requirements and submit a competitive proposal.	a536318f-3dd6-4a64-ab44-cd425b104b2e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	331	1911	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-14 10:17:40.194	2026-02-18 16:23:25.141
4c5e33be-4009-4f1c-959a-52d3e2df5069	8083129e-0ea5-4508-b7d5-cde138d9dadb	Pump Installation Service Required	We are looking for a professional provider for Pump Installation. Please review the project requirements and submit a competitive proposal.	dc97169e-d2c7-4af6-93a5-5010ab9d86f0	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	350	1236	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-15 19:37:55.664	2026-02-18 16:23:25.147
4b4b8dce-c492-4714-aa6a-1b86adea1243	90a57a13-7f68-46a3-92ff-d9417f02e2d9	Pump Installation Service Required	We are looking for a professional provider for Pump Installation. Please review the project requirements and submit a competitive proposal.	dc97169e-d2c7-4af6-93a5-5010ab9d86f0	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	592	1808	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-16 13:31:26.056	2026-02-18 16:23:25.148
521a3165-f6e7-47d9-8089-034f743922a1	1cec89ac-cdb8-41fb-81ea-2650126f551f	General Contractor Service Required	We are looking for a professional provider for General Contractor. Please review the project requirements and submit a competitive proposal.	3905c75e-18d0-4ef1-b58a-d3e1a7ce5463	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	300	1362	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-13 00:04:46.023	2026-02-18 16:23:25.15
396634ff-d5d2-4579-b9c3-f8d8b134aa04	709f0a1e-1bdd-4c0d-9509-9f26a46e9d03	General Contractor Service Required	We are looking for a professional provider for General Contractor. Please review the project requirements and submit a competitive proposal.	3905c75e-18d0-4ef1-b58a-d3e1a7ce5463	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	108	901	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-14 22:18:27.244	2026-02-18 16:23:25.152
53d6baa2-6aa0-42d7-9614-6cd42b40245c	8ba353a3-cf79-4e4c-861c-e11c23537b2c	Home Renovation Service Required	We are looking for a professional provider for Home Renovation. Please review the project requirements and submit a competitive proposal.	5c720069-74be-4ad8-807c-e064c1521c4f	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	587	1188	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-17 05:17:10.809	2026-02-18 16:23:25.154
a65db5c6-39ae-4b16-9442-194d2a541058	105bb1c7-f9b9-48b8-a031-76d2b52c2eff	Home Renovation Service Required	We are looking for a professional provider for Home Renovation. Please review the project requirements and submit a competitive proposal.	5c720069-74be-4ad8-807c-e064c1521c4f	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	539	1818	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-10 08:13:28.068	2026-02-18 16:23:25.156
6d6e401c-7caf-4561-bf54-9f337444d650	6bfe5d3c-4f60-44d0-aa2d-8ed9d0f57667	Kitchen Renovation Service Required	We are looking for a professional provider for Kitchen Renovation. Please review the project requirements and submit a competitive proposal.	47186941-ba55-49bd-97b8-2b54e376f36b	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	159	744	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-09 15:16:14.973	2026-02-18 16:23:25.158
e28a85ba-97fd-4c4b-b67f-a0917191c097	1dc82269-4fd8-4f16-8810-88d97fbad231	Kitchen Renovation Service Required	We are looking for a professional provider for Kitchen Renovation. Please review the project requirements and submit a competitive proposal.	47186941-ba55-49bd-97b8-2b54e376f36b	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	397	1096	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-10 02:05:20.487	2026-02-18 16:23:25.16
87f70811-751b-44c0-8575-bdcde197bee6	2a474982-5739-47fb-81f2-e1273e800c55	Bathroom Renovation Service Required	We are looking for a professional provider for Bathroom Renovation. Please review the project requirements and submit a competitive proposal.	5db5637c-2d55-46eb-b46b-6c5c9aa87a19	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	322	1366	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-09 20:52:43.117	2026-02-18 16:23:25.162
67c326fc-dfbc-4fc4-9b93-698a75089890	00a886d6-2514-4dd6-b1bf-96a9fa2cecb6	Bathroom Renovation Service Required	We are looking for a professional provider for Bathroom Renovation. Please review the project requirements and submit a competitive proposal.	5db5637c-2d55-46eb-b46b-6c5c9aa87a19	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	177	1614	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-12 11:30:17.516	2026-02-18 16:23:25.164
e5311421-c9d4-4680-afb0-a4d6b535e16c	596dc79c-62e9-4580-a86b-615f19709d59	Tile Installation Service Required	We are looking for a professional provider for Tile Installation. Please review the project requirements and submit a competitive proposal.	eb3a5f87-d152-41c0-a704-4dd4f93ed87d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	320	945	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-13 12:17:34.672	2026-02-18 16:23:25.166
1270fe5b-b379-4a99-aba2-79846b7ef777	284e1c70-ae85-4096-a43d-0a407ad229af	Tile Installation Service Required	We are looking for a professional provider for Tile Installation. Please review the project requirements and submit a competitive proposal.	eb3a5f87-d152-41c0-a704-4dd4f93ed87d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	564	1654	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-10 20:41:41.586	2026-02-18 16:23:25.168
bcdcaf95-0011-4974-8329-52462906441e	8b31467b-a846-4ac4-aee7-6f5880fd3e7b	Flooring Installation Service Required	We are looking for a professional provider for Flooring Installation. Please review the project requirements and submit a competitive proposal.	2e57b799-12e9-40aa-9519-c462f5d458ba	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	507	2001	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-13 00:58:37.47	2026-02-18 16:23:25.172
396336d6-327e-47aa-9a16-c72164682428	45b866f8-d3d2-413f-9c1b-c5763e4bc8a1	Gypsum Board Service Required	We are looking for a professional provider for Gypsum Board. Please review the project requirements and submit a competitive proposal.	84885f89-be5a-4750-baac-92ce56f45288	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	389	1529	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-16 02:54:38.152	2026-02-18 16:23:25.174
84e4acb8-706b-474a-94c4-754e3f38a032	7f65f52e-949f-493b-9ebf-4af5e98b832b	Gypsum Board Service Required	We are looking for a professional provider for Gypsum Board. Please review the project requirements and submit a competitive proposal.	84885f89-be5a-4750-baac-92ce56f45288	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	253	1129	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-11 05:21:16.179	2026-02-18 16:23:25.175
d3255d70-ee2d-4286-91bc-743770060e4b	31494848-428e-4d55-b324-2eb64c380f32	Painting Services Service Required	We are looking for a professional provider for Painting Services. Please review the project requirements and submit a competitive proposal.	e9fcae5a-1a61-4f96-adca-e1bee96da919	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	545	888	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-13 07:52:30.897	2026-02-18 16:23:25.177
53e7f82d-f022-457a-a196-288e51ed0caa	7f65f52e-949f-493b-9ebf-4af5e98b832b	Painting Services Service Required	We are looking for a professional provider for Painting Services. Please review the project requirements and submit a competitive proposal.	e9fcae5a-1a61-4f96-adca-e1bee96da919	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	242	1091	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-18 05:35:40.55	2026-02-18 16:23:25.178
ce151a91-424a-4c1d-bcfd-d7529f91595e	762f836e-6368-4fa0-9757-af9898900a8d	Roofing Service Required	We are looking for a professional provider for Roofing. Please review the project requirements and submit a competitive proposal.	93ad7de3-d02d-47c7-9138-22daa3c2c0b4	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	180	1427	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-11 04:19:49.427	2026-02-18 16:23:25.179
6284a305-ba7a-4e2e-89b4-8a5355bb42f1	2849b948-60db-409c-aac1-5dc6cf411051	Roofing Service Required	We are looking for a professional provider for Roofing. Please review the project requirements and submit a competitive proposal.	93ad7de3-d02d-47c7-9138-22daa3c2c0b4	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	528	1375	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-14 05:53:36.506	2026-02-18 16:23:25.181
3481d849-a887-410c-9722-91e65f8e5f92	45b866f8-d3d2-413f-9c1b-c5763e4bc8a1	Concrete & Masonry Service Required	We are looking for a professional provider for Concrete & Masonry. Please review the project requirements and submit a competitive proposal.	5794040d-4834-4d81-a7c3-99d2f4d9383b	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	533	1444	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-16 12:25:14.413	2026-02-18 16:23:25.184
18862652-b3cc-4fdc-b952-619558a84fb6	9d01669c-4bd3-4f02-8179-90ca8de71870	Structural Repairs Service Required	We are looking for a professional provider for Structural Repairs. Please review the project requirements and submit a competitive proposal.	c0e5b849-e7e0-461d-a535-0e84d6d7f791	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	272	788	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-14 06:15:24.802	2026-02-18 16:23:25.185
821d63d5-387f-40ec-9dfa-b162831223e9	8b31467b-a846-4ac4-aee7-6f5880fd3e7b	Structural Repairs Service Required	We are looking for a professional provider for Structural Repairs. Please review the project requirements and submit a competitive proposal.	c0e5b849-e7e0-461d-a535-0e84d6d7f791	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	161	1716	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-17 17:27:52.4	2026-02-18 16:23:25.186
29139f73-3942-494c-9fb2-41323c75aa4e	8b31467b-a846-4ac4-aee7-6f5880fd3e7b	Home Cleaning Service Required	We are looking for a professional provider for Home Cleaning. Please review the project requirements and submit a competitive proposal.	459e22dc-d5aa-4f49-9284-d416e3201e34	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	354	1996	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-14 11:49:15.133	2026-02-18 16:23:25.188
da2deca6-60e1-4122-b99c-8df7642dcf94	544573f8-a70a-4a36-96e1-b7c0e6833973	Home Cleaning Service Required	We are looking for a professional provider for Home Cleaning. Please review the project requirements and submit a competitive proposal.	459e22dc-d5aa-4f49-9284-d416e3201e34	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	492	1080	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-10 00:49:42.046	2026-02-18 16:23:25.189
23db5f0b-9a4d-4e30-aa4d-7bc15b6d2b1d	596dc79c-62e9-4580-a86b-615f19709d59	Deep Cleaning Service Required	We are looking for a professional provider for Deep Cleaning. Please review the project requirements and submit a competitive proposal.	b63a2fe5-171f-4db4-95ee-b16a8210eb9d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	173	1114	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-12 15:55:50.236	2026-02-18 16:23:25.19
8d9e58bd-549f-45d5-9942-e1902979376d	6bfe5d3c-4f60-44d0-aa2d-8ed9d0f57667	Deep Cleaning Service Required	We are looking for a professional provider for Deep Cleaning. Please review the project requirements and submit a competitive proposal.	b63a2fe5-171f-4db4-95ee-b16a8210eb9d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	481	1422	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-15 16:40:38.287	2026-02-18 16:23:25.192
d4e3a77d-f2f1-4219-a94c-29c03ededec2	2a474982-5739-47fb-81f2-e1273e800c55	Office Cleaning Service Required	We are looking for a professional provider for Office Cleaning. Please review the project requirements and submit a competitive proposal.	fcd17d77-74e4-4cec-83b1-12e99b00c62f	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	244	1955	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-17 14:27:00.15	2026-02-18 16:23:25.194
950d38a6-1906-4252-81b3-f57c7ece876e	8083129e-0ea5-4508-b7d5-cde138d9dadb	Post-Construction Service Required	We are looking for a professional provider for Post-Construction. Please review the project requirements and submit a competitive proposal.	37316c32-bf7c-4282-87b9-78417ffb611d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	278	768	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-16 16:18:01.794	2026-02-18 16:23:25.197
c9dcde0c-9f03-45bc-be4e-6cce987fccfb	5cfbcdd0-0b36-4921-a3c2-fa504ca8a20d	Post-Construction Service Required	We are looking for a professional provider for Post-Construction. Please review the project requirements and submit a competitive proposal.	37316c32-bf7c-4282-87b9-78417ffb611d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	375	705	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-16 07:02:35.923	2026-02-18 16:23:25.198
9ffecc3d-8f73-42fb-8ee6-a7e1af292d72	1cec89ac-cdb8-41fb-81ea-2650126f551f	Carpet Cleaning Service Required	We are looking for a professional provider for Carpet Cleaning. Please review the project requirements and submit a competitive proposal.	b51d67bd-090c-4383-b27d-fc53244989af	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	526	694	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-08 20:34:57.953	2026-02-18 16:23:25.2
1fc15f26-5caf-4f63-b459-6992182a4fd0	6bfe5d3c-4f60-44d0-aa2d-8ed9d0f57667	Carpet Cleaning Service Required	We are looking for a professional provider for Carpet Cleaning. Please review the project requirements and submit a competitive proposal.	b51d67bd-090c-4383-b27d-fc53244989af	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	253	1317	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-10 15:51:22.075	2026-02-18 16:23:25.201
764d639c-6c62-44f8-a0ee-c0e1bd1474fe	15253bbb-7d62-4674-ad27-c66475936580	Sofa Cleaning Service Required	We are looking for a professional provider for Sofa Cleaning. Please review the project requirements and submit a competitive proposal.	be163dd8-9324-47c1-b07a-3d727382acd4	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	410	1754	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-10 10:57:03.762	2026-02-18 16:23:25.204
4aded644-dec0-4975-94dc-1e005b0e255c	1abb39df-0929-4386-aff1-8a5ae3668375	Window Cleaning Service Required	We are looking for a professional provider for Window Cleaning. Please review the project requirements and submit a competitive proposal.	70eeca24-013d-4546-9567-3b42927e8364	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	172	1320	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-13 05:45:53.07	2026-02-18 16:23:25.206
79fea1ee-6160-447e-ba25-30c01bda2e04	5cfbcdd0-0b36-4921-a3c2-fa504ca8a20d	Window Cleaning Service Required	We are looking for a professional provider for Window Cleaning. Please review the project requirements and submit a competitive proposal.	70eeca24-013d-4546-9567-3b42927e8364	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	596	694	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-10 07:06:58.641	2026-02-18 16:23:25.207
5988d257-2a21-4078-a975-98c0aca18a7a	40892513-50c2-4a41-9f1a-be224ae492fa	Water Tank Cleaning Service Required	We are looking for a professional provider for Water Tank Cleaning. Please review the project requirements and submit a competitive proposal.	0a715def-3e28-46b5-b8e2-1d5e47af7730	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	503	1804	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-09 14:14:27.968	2026-02-18 16:23:25.208
0fbe1c41-dd36-43e7-a07e-2ba319b6e37a	8b7f1800-caca-4959-a6d8-4c763c4775f0	Water Tank Cleaning Service Required	We are looking for a professional provider for Water Tank Cleaning. Please review the project requirements and submit a competitive proposal.	0a715def-3e28-46b5-b8e2-1d5e47af7730	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	301	921	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-10 04:27:38.232	2026-02-18 16:23:25.21
8fd50e67-57bc-4f14-b24f-8fd0cc958376	3da19a13-09aa-4c8c-a338-a50a373a1351	Disinfection Services Service Required	We are looking for a professional provider for Disinfection Services. Please review the project requirements and submit a competitive proposal.	2f34e68f-344a-4a04-8ca5-0ef67fb6f5f7	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	175	1600	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-13 17:16:13.008	2026-02-18 16:23:25.212
a9df37ef-1cee-4345-aa0d-c4774d150994	9102078e-ab50-4df9-a7ec-65c2464a03d8	Disinfection Services Service Required	We are looking for a professional provider for Disinfection Services. Please review the project requirements and submit a competitive proposal.	2f34e68f-344a-4a04-8ca5-0ef67fb6f5f7	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	366	866	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-14 23:00:54.478	2026-02-18 16:23:25.214
22c13cd3-9c3a-4bd8-bfbe-5a9bcc546b69	1b804e9c-1a66-4436-b031-5f958678241c	Furniture Moving Service Required	We are looking for a professional provider for Furniture Moving. Please review the project requirements and submit a competitive proposal.	24ca6098-169b-46bb-993d-a130327b16f9	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	184	877	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-11 15:22:26.231	2026-02-18 16:23:25.216
ee6911bb-1cd3-4712-944e-8b708e98c464	2849b948-60db-409c-aac1-5dc6cf411051	Furniture Moving Service Required	We are looking for a professional provider for Furniture Moving. Please review the project requirements and submit a competitive proposal.	24ca6098-169b-46bb-993d-a130327b16f9	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	589	1901	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-14 07:30:59.997	2026-02-18 16:23:25.218
e2f9ed44-3301-445b-bd04-e93ed0c67f81	105bb1c7-f9b9-48b8-a031-76d2b52c2eff	House Moving Service Required	We are looking for a professional provider for House Moving. Please review the project requirements and submit a competitive proposal.	a3529217-903e-4710-b70c-2b15b18ecaa7	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	488	1731	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-13 14:23:26.108	2026-02-18 16:23:25.22
14ff4dd4-102c-4ea8-9814-e25eac4825a4	63a0f3bf-e2fe-4353-88a1-8f6c12cb74c9	House Moving Service Required	We are looking for a professional provider for House Moving. Please review the project requirements and submit a competitive proposal.	a3529217-903e-4710-b70c-2b15b18ecaa7	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	211	1459	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-11 08:36:28.372	2026-02-18 16:23:25.221
2083d8f1-26f3-4edd-a8c9-793c735375c0	18c8e3e0-1a95-467d-8a49-a027cee0e5bd	Office Moving Service Required	We are looking for a professional provider for Office Moving. Please review the project requirements and submit a competitive proposal.	0cfccd84-7b2e-460a-9075-74f3d8dc4586	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	352	1495	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-11 05:43:40.427	2026-02-18 16:23:25.225
3d394f80-f131-4aad-b505-454378c89f56	1fe1195e-328a-4400-8f78-e85a8d9de7c4	Packing Services Service Required	We are looking for a professional provider for Packing Services. Please review the project requirements and submit a competitive proposal.	0c79abc5-cdde-4d82-8bb1-898d546fee4e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	364	715	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-14 00:23:34.768	2026-02-18 16:23:25.227
6547e924-ba70-4e50-a4c1-058d7f717e50	8083129e-0ea5-4508-b7d5-cde138d9dadb	Packing Services Service Required	We are looking for a professional provider for Packing Services. Please review the project requirements and submit a competitive proposal.	0c79abc5-cdde-4d82-8bb1-898d546fee4e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	522	996	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-17 03:32:18.553	2026-02-18 16:23:25.229
100580e6-cec5-41b9-8759-2354470b788f	134e670e-7b08-4a59-bc2d-0589d08b6dcd	Storage Services Service Required	We are looking for a professional provider for Storage Services. Please review the project requirements and submit a competitive proposal.	a42fec55-2abc-4caa-856b-d80e4ac7ab45	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	425	1190	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-09 03:09:28.393	2026-02-18 16:23:25.233
cd86b786-ea4a-4393-987c-2d53d3b57782	762f836e-6368-4fa0-9757-af9898900a8d	Social Media Mgmt Service Required	We are looking for a professional provider for Social Media Mgmt. Please review the project requirements and submit a competitive proposal.	534cc6e7-53c8-48c0-a34d-de3c0ebfeac8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	547	894	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-14 21:15:19.653	2026-02-18 16:23:25.235
fc8e8655-7a23-4411-9e0f-5ec5f2b50ec5	2dae1352-4180-4f5f-8606-7cd01c61b9d8	Social Media Mgmt Service Required	We are looking for a professional provider for Social Media Mgmt. Please review the project requirements and submit a competitive proposal.	534cc6e7-53c8-48c0-a34d-de3c0ebfeac8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	157	1836	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-16 23:44:08.72	2026-02-18 16:23:25.237
4f66b5ca-3ad1-46b4-ab42-322ce386a1c5	9d01669c-4bd3-4f02-8179-90ca8de71870	Legal Consultation Service Required	We are looking for a professional provider for Legal Consultation. Please review the project requirements and submit a competitive proposal.	3ea6e974-2ce7-4d5f-b861-dc0b63179f54	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	524	923	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-15 21:27:52.001	2026-02-18 16:23:25.239
40ce4845-e8db-4e62-a1ad-976b385736be	1abb39df-0929-4386-aff1-8a5ae3668375	Legal Consultation Service Required	We are looking for a professional provider for Legal Consultation. Please review the project requirements and submit a competitive proposal.	3ea6e974-2ce7-4d5f-b861-dc0b63179f54	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	271	725	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-09 02:21:31.916	2026-02-18 16:23:25.24
b0de7f4d-d444-456e-a85f-b3e239a0410a	15253bbb-7d62-4674-ad27-c66475936580	Contract Drafting Service Required	We are looking for a professional provider for Contract Drafting. Please review the project requirements and submit a competitive proposal.	40e2b96d-4cdc-496b-8a2c-24b8c85096e0	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	302	1324	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-13 04:37:53.633	2026-02-18 16:23:25.243
704abddb-9800-4b8d-9084-1985f57c42d2	6a4d8b84-efd3-44fd-82bc-ee188ec1776d	Contract Drafting Service Required	We are looking for a professional provider for Contract Drafting. Please review the project requirements and submit a competitive proposal.	40e2b96d-4cdc-496b-8a2c-24b8c85096e0	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	399	1987	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-08 16:12:10.492	2026-02-18 16:23:25.245
f527a002-711f-4ed5-9351-6b7e8fac404c	105bb1c7-f9b9-48b8-a031-76d2b52c2eff	Accounting Services Service Required	We are looking for a professional provider for Accounting Services. Please review the project requirements and submit a competitive proposal.	45c52652-5754-48c1-b0a7-3d6fdeae7fbd	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	186	1658	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-15 15:47:25.832	2026-02-18 16:23:25.247
89f2bc1b-72bc-42d2-a33b-1db681a11241	31494848-428e-4d55-b324-2eb64c380f32	Accounting Services Service Required	We are looking for a professional provider for Accounting Services. Please review the project requirements and submit a competitive proposal.	45c52652-5754-48c1-b0a7-3d6fdeae7fbd	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	293	1138	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-12 15:30:54.548	2026-02-18 16:23:25.249
33437238-94ae-4208-804e-3e8f6dfd8501	36a2106b-e2be-4917-bdb4-abd8e97d8917	Graphic Design Service Required	We are looking for a professional provider for Graphic Design. Please review the project requirements and submit a competitive proposal.	9f883a2f-cae6-461b-91ce-d01c592774c3	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	217	1181	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-10 14:10:23.065	2026-02-18 16:23:25.251
16848fec-5c98-419a-a38a-ac19e431e7ed	8b7f1800-caca-4959-a6d8-4c763c4775f0	Graphic Design Service Required	We are looking for a professional provider for Graphic Design. Please review the project requirements and submit a competitive proposal.	9f883a2f-cae6-461b-91ce-d01c592774c3	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	317	756	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-15 00:07:25.526	2026-02-18 16:23:25.253
42f02ca8-89bd-48c7-b977-713d33db4896	329bb7c8-2ecb-4357-aa27-6baed0b1e3b7	Branding & Identity Service Required	We are looking for a professional provider for Branding & Identity. Please review the project requirements and submit a competitive proposal.	f684e579-7a25-44dc-a309-265dbfd1f2d2	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	407	1678	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-17 12:08:20.952	2026-02-18 16:23:25.254
824f8c60-2404-41f3-af60-b360d9be96fc	544573f8-a70a-4a36-96e1-b7c0e6833973	3D Visualization Service Required	We are looking for a professional provider for 3D Visualization. Please review the project requirements and submit a competitive proposal.	e2e4e7b7-f108-4f74-a653-f52e0483fa40	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	344	1257	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-18 11:39:29.399	2026-02-18 16:23:25.258
ecdbce12-0144-4ba6-8c27-ce830e8913d2	5a529f50-7761-4049-a023-1b9120b244d7	3D Visualization Service Required	We are looking for a professional provider for 3D Visualization. Please review the project requirements and submit a competitive proposal.	e2e4e7b7-f108-4f74-a653-f52e0483fa40	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	253	1583	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-09 02:04:28.677	2026-02-18 16:23:25.259
fb4c996d-d65b-41e1-be45-558b3859827b	2b1bfbaf-1f04-4124-bd01-68c75f8acd95	AC Repair Service Required	We are looking for a professional provider for AC Repair. Please review the project requirements and submit a competitive proposal.	3d27de5e-9b46-4986-a1ca-06f0d477a2ba	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	150	1120	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-12 12:35:25.728	2026-02-18 16:23:25.261
f9b28d37-65a6-467a-bfd7-65f482d901d8	329bb7c8-2ecb-4357-aa27-6baed0b1e3b7	AC Repair Service Required	We are looking for a professional provider for AC Repair. Please review the project requirements and submit a competitive proposal.	3d27de5e-9b46-4986-a1ca-06f0d477a2ba	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	481	1917	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-15 10:34:00.717	2026-02-18 16:23:25.263
434d08a0-44df-4334-9185-728b12d19339	2b1bfbaf-1f04-4124-bd01-68c75f8acd95	AC Maintenance Service Required	We are looking for a professional provider for AC Maintenance. Please review the project requirements and submit a competitive proposal.	9be45a5d-3632-4446-b3ac-818c1d4afbad	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	173	1281	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-15 15:57:50.682	2026-02-18 16:23:25.267
830226b2-ab99-469a-b7a2-11e08db78da3	40892513-50c2-4a41-9f1a-be224ae492fa	Custom Furniture Service Required	We are looking for a professional provider for Custom Furniture. Please review the project requirements and submit a competitive proposal.	fa0319a9-a593-44fc-8248-8a7eb47b459e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	159	717	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-16 03:56:56.821	2026-02-18 16:23:25.269
4de3d284-4b96-4bb9-8d69-eba47b2e2f1c	40892513-50c2-4a41-9f1a-be224ae492fa	Custom Furniture Service Required	We are looking for a professional provider for Custom Furniture. Please review the project requirements and submit a competitive proposal.	fa0319a9-a593-44fc-8248-8a7eb47b459e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	245	1532	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-11 20:08:06.363	2026-02-18 16:23:25.271
e297a8e6-726e-497e-908b-50f68d9842bd	31494848-428e-4d55-b324-2eb64c380f32	Door Install & Repair Service Required	We are looking for a professional provider for Door Install & Repair. Please review the project requirements and submit a competitive proposal.	5fdddb70-8cc9-45bb-9560-72d5fb2a86e0	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	549	758	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-16 08:25:20.918	2026-02-18 16:23:25.273
8ba88116-78e0-4fcd-9ddf-77ffa02d9be1	6bfe5d3c-4f60-44d0-aa2d-8ed9d0f57667	Door Install & Repair Service Required	We are looking for a professional provider for Door Install & Repair. Please review the project requirements and submit a competitive proposal.	5fdddb70-8cc9-45bb-9560-72d5fb2a86e0	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	106	1243	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-16 19:30:48.371	2026-02-18 16:23:25.275
dda05658-f3f5-4440-9999-7e7f96b00fdf	40892513-50c2-4a41-9f1a-be224ae492fa	Kitchen Cabinets Service Required	We are looking for a professional provider for Kitchen Cabinets. Please review the project requirements and submit a competitive proposal.	995b2165-0444-4801-acca-dc5c3a566f2a	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	369	1731	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-09 05:54:57.401	2026-02-18 16:23:25.277
420abc13-aad3-4653-b1ec-9184c0a96976	134e670e-7b08-4a59-bc2d-0589d08b6dcd	Kitchen Cabinets Service Required	We are looking for a professional provider for Kitchen Cabinets. Please review the project requirements and submit a competitive proposal.	995b2165-0444-4801-acca-dc5c3a566f2a	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	132	1671	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-14 00:52:18.564	2026-02-18 16:23:25.279
19c08b82-523f-4227-9020-ec5a96f1f52a	1b804e9c-1a66-4436-b031-5f958678241c	Bedroom Wardrobes Service Required	We are looking for a professional provider for Bedroom Wardrobes. Please review the project requirements and submit a competitive proposal.	7f0933d0-c036-49ee-a498-62bb23e051fb	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	441	923	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-11 01:21:43.212	2026-02-18 16:23:25.281
83e8aaad-fe8d-483f-bdb0-36edb1740d16	00a886d6-2514-4dd6-b1bf-96a9fa2cecb6	Bedroom Wardrobes Service Required	We are looking for a professional provider for Bedroom Wardrobes. Please review the project requirements and submit a competitive proposal.	7f0933d0-c036-49ee-a498-62bb23e051fb	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	466	1718	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-15 13:51:56.222	2026-02-18 16:23:25.283
f69b5b7c-f0c2-419d-9274-46d97d9250d6	6bfe5d3c-4f60-44d0-aa2d-8ed9d0f57667	Wood Flooring Service Required	We are looking for a professional provider for Wood Flooring. Please review the project requirements and submit a competitive proposal.	a4f932f4-17e0-4e68-9a2c-1c0b2f054756	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	495	801	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-10 21:08:15.09	2026-02-18 16:23:25.284
ca6ca107-68c9-4b50-86d0-5485129db8e2	284e1c70-ae85-4096-a43d-0a407ad229af	Wood Flooring Service Required	We are looking for a professional provider for Wood Flooring. Please review the project requirements and submit a competitive proposal.	a4f932f4-17e0-4e68-9a2c-1c0b2f054756	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	119	857	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-11 21:07:13.503	2026-02-18 16:23:25.286
29523683-f12f-472a-b675-794c05d64164	18c8e3e0-1a95-467d-8a49-a027cee0e5bd	Pergolas & Outdoor Service Required	We are looking for a professional provider for Pergolas & Outdoor. Please review the project requirements and submit a competitive proposal.	a15ec8f6-c7e5-40bc-888c-5e6179104677	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	112	1528	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-09 18:28:59.574	2026-02-18 16:23:25.29
0377ed9d-1091-4d91-a4bb-f8101fe0c905	63ce3333-64c3-4c0d-97b5-9b517d2ff19d	Office Furniture Service Required	We are looking for a professional provider for Office Furniture. Please review the project requirements and submit a competitive proposal.	5fa8962e-80f2-4550-bdfa-fe31d3b7d741	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	421	1336	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-11 02:24:38.903	2026-02-18 16:23:25.292
ce0fe4cf-94c3-4bd8-b40c-eab89de57665	762f836e-6368-4fa0-9757-af9898900a8d	Office Furniture Service Required	We are looking for a professional provider for Office Furniture. Please review the project requirements and submit a competitive proposal.	5fa8962e-80f2-4550-bdfa-fe31d3b7d741	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	343	1395	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-10 14:26:14.501	2026-02-18 16:23:25.294
c375ee7f-a640-4a35-82c7-ea895db0a244	90a57a13-7f68-46a3-92ff-d9417f02e2d9	Furniture Repair Service Required	We are looking for a professional provider for Furniture Repair. Please review the project requirements and submit a competitive proposal.	372a27be-f9b8-4e31-aa38-ca2366223d6d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	293	1029	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-17 23:26:06.381	2026-02-18 16:23:25.296
e97040dc-95c5-49fb-bd9f-3bdacc6fd527	338a9c72-8a9b-4f08-a381-b527ceea416d	Furniture Repair Service Required	We are looking for a professional provider for Furniture Repair. Please review the project requirements and submit a competitive proposal.	372a27be-f9b8-4e31-aa38-ca2366223d6d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	332	1150	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-16 08:03:31.284	2026-02-18 16:23:25.299
13e1066e-9f35-4d0b-912d-d1ca9a9bb649	1963ba9d-85f7-4456-9803-24ff87187b82	Equipment Transport Service Required	We are looking for a professional provider for Equipment Transport. Please review the project requirements and submit a competitive proposal.	61452801-a110-4604-817d-a4374db967c0	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	517	1474	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-12 20:45:59.635	2026-02-18 16:23:25.304
fba564bc-4320-4f74-9c03-34aee61ce424	1963ba9d-85f7-4456-9803-24ff87187b82	Local Delivery Service Required	We are looking for a professional provider for Local Delivery. Please review the project requirements and submit a competitive proposal.	e0ea0aaf-8c5e-448f-97a3-c5188ec89ee9	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	569	1023	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-09 00:37:26.959	2026-02-18 16:23:25.306
71f5efdb-07c0-4192-9501-e73445d5662e	3da19a13-09aa-4c8c-a338-a50a373a1351	Local Delivery Service Required	We are looking for a professional provider for Local Delivery. Please review the project requirements and submit a competitive proposal.	e0ea0aaf-8c5e-448f-97a3-c5188ec89ee9	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	475	1034	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-14 16:47:13.475	2026-02-18 16:23:25.309
c7a822b8-dc00-4afc-b7b6-e8e602793442	40892513-50c2-4a41-9f1a-be224ae492fa	Heavy Equipment Service Required	We are looking for a professional provider for Heavy Equipment. Please review the project requirements and submit a competitive proposal.	cfaf55d4-d957-4f91-9944-8e9262fa5c58	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	254	1673	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-13 22:54:36.762	2026-02-18 16:23:25.311
60632c9e-7c66-4855-8862-3761d0035dea	2dae1352-4180-4f5f-8606-7cd01c61b9d8	Heavy Equipment Service Required	We are looking for a professional provider for Heavy Equipment. Please review the project requirements and submit a competitive proposal.	cfaf55d4-d957-4f91-9944-8e9262fa5c58	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	142	792	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-08 20:08:44.247	2026-02-18 16:23:25.313
d38ee864-6b4a-4b1f-ae27-27c1905356ef	7f65f52e-949f-493b-9ebf-4af5e98b832b	IT Support Service Required	We are looking for a professional provider for IT Support. Please review the project requirements and submit a competitive proposal.	145dab2a-0441-446c-978b-42b317a37707	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	337	1182	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-12 15:04:02.165	2026-02-18 16:23:25.316
d91069d2-01c7-47ee-9ef2-e4f713fa7bc8	338a9c72-8a9b-4f08-a381-b527ceea416d	IT Support Service Required	We are looking for a professional provider for IT Support. Please review the project requirements and submit a competitive proposal.	145dab2a-0441-446c-978b-42b317a37707	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	174	1394	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-12 06:57:05.412	2026-02-18 16:23:25.317
c19b47b6-a934-480f-a0ac-8d7d34c225c1	709f0a1e-1bdd-4c0d-9509-9f26a46e9d03	Content Creation Service Required	We are looking for a professional provider for Content Creation. Please review the project requirements and submit a competitive proposal.	96e8b578-f00f-46c4-b0bc-9997bf549722	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	307	1869	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-17 05:26:19.793	2026-02-18 16:23:25.319
a139b2c8-d2fa-4b75-8b07-7138a9bbe837	8b7f1800-caca-4959-a6d8-4c763c4775f0	Content Creation Service Required	We are looking for a professional provider for Content Creation. Please review the project requirements and submit a competitive proposal.	96e8b578-f00f-46c4-b0bc-9997bf549722	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	521	1116	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-10 07:33:09.235	2026-02-18 16:23:25.321
94285ef9-1dea-44c0-8b7b-dd11b2cb929c	35afcd35-0119-4670-955a-8bc235d4c360	Tax Consultation Service Required	We are looking for a professional provider for Tax Consultation. Please review the project requirements and submit a competitive proposal.	8ad81af4-5eeb-4433-8c16-382b0653f1c2	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	460	1031	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-11 11:59:46.578	2026-02-18 16:23:25.324
9c715e76-88ac-4b5a-94c6-b3e4e9d2b9d2	8ba353a3-cf79-4e4c-861c-e11c23537b2c	Company Registration Service Required	We are looking for a professional provider for Company Registration. Please review the project requirements and submit a competitive proposal.	c578b972-ee6e-4efe-b2df-37efe0fcacf8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	241	2005	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-12 22:27:21.277	2026-02-18 16:23:25.328
b4d92658-dcfa-4e65-84d9-16e3dc394094	63ce3333-64c3-4c0d-97b5-9b517d2ff19d	Company Registration Service Required	We are looking for a professional provider for Company Registration. Please review the project requirements and submit a competitive proposal.	c578b972-ee6e-4efe-b2df-37efe0fcacf8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	191	999	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-12 11:05:00.7	2026-02-18 16:23:25.33
17a0e55a-ef1c-48d6-8373-19e7517f580c	329bb7c8-2ecb-4357-aa27-6baed0b1e3b7	Interior Design Service Required	We are looking for a professional provider for Interior Design. Please review the project requirements and submit a competitive proposal.	85ecc7e5-742e-4b3a-9d61-40c0e86a59c8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	567	1278	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-13 12:02:19.21	2026-02-18 16:23:25.332
f9d9c557-91f8-4d05-8061-3f63b60b0277	40892513-50c2-4a41-9f1a-be224ae492fa	Interior Design Service Required	We are looking for a professional provider for Interior Design. Please review the project requirements and submit a competitive proposal.	85ecc7e5-742e-4b3a-9d61-40c0e86a59c8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	515	1878	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-14 17:45:13.575	2026-02-18 16:23:25.334
c708dc5c-b523-4952-8e41-ab0375d220f1	45b866f8-d3d2-413f-9c1b-c5763e4bc8a1	Landscape Design Service Required	We are looking for a professional provider for Landscape Design. Please review the project requirements and submit a competitive proposal.	9e64837b-ee22-4570-b1f2-9c6c938107ea	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	441	1639	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-13 11:45:57.289	2026-02-18 16:23:25.336
9679ee2d-e307-4f3c-9032-5120b10745c0	6bfe5d3c-4f60-44d0-aa2d-8ed9d0f57667	Landscape Design Service Required	We are looking for a professional provider for Landscape Design. Please review the project requirements and submit a competitive proposal.	9e64837b-ee22-4570-b1f2-9c6c938107ea	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	315	1268	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-17 06:46:34.265	2026-02-18 16:23:25.338
347b83d7-42ab-4661-9bca-c1304fc95407	5a529f50-7761-4049-a023-1b9120b244d7	AC & HVAC Service Required	We are looking for a professional provider for AC & HVAC. Please review the project requirements and submit a competitive proposal.	a104b06f-1cb5-4e34-8567-e8c136ccf452	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	472	719	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-13 22:18:40.987	2026-02-18 16:23:25.34
28b174aa-1986-489f-ae96-50ee9d22aea5	02d635af-3510-4db3-9e4f-b0afad0cd7b3	Carpentry Service Required	We are looking for a professional provider for Carpentry. Please review the project requirements and submit a competitive proposal.	9216b9d5-8efb-4d0a-8d35-b5d47386c27f	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	321	1953	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-10 16:09:18.061	2026-02-18 16:23:25.343
b9ec93e9-b14f-4edc-8ce3-26e81d946b39	5cfbcdd0-0b36-4921-a3c2-fa504ca8a20d	Carpentry Service Required	We are looking for a professional provider for Carpentry. Please review the project requirements and submit a competitive proposal.	9216b9d5-8efb-4d0a-8d35-b5d47386c27f	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	460	1375	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-12 05:13:12.61	2026-02-18 16:23:25.345
2f76ab7a-e3cf-441d-a89d-a2ebd02166b1	8b7f1800-caca-4959-a6d8-4c763c4775f0	IT Support Service Required	We are looking for a professional provider for IT Support. Please review the project requirements and submit a competitive proposal.	bc71903c-a271-4a56-b90e-f94b041f684c	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	290	1867	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-11 04:55:41.052	2026-02-18 16:23:25.347
3cb43c92-ea7f-4e9b-aa4d-40568902b9ef	068d20f7-d8fe-405f-b31b-989f997b2042	IT Support Service Required	We are looking for a professional provider for IT Support. Please review the project requirements and submit a competitive proposal.	bc71903c-a271-4a56-b90e-f94b041f684c	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	455	1389	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-12 03:36:07.339	2026-02-18 16:23:25.349
1ea53a63-dd26-41ae-8fe9-1c9ad598934d	134e670e-7b08-4a59-bc2d-0589d08b6dcd	Digital Services Service Required	We are looking for a professional provider for Digital Services. Please review the project requirements and submit a competitive proposal.	c800df55-740a-4bf4-abcf-9fb8dc54aa85	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	223	1086	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-12 14:19:13.097	2026-02-18 16:23:25.351
56002d2d-4253-4349-a895-6e35f0b71a3b	35afcd35-0119-4670-955a-8bc235d4c360	Digital Services Service Required	We are looking for a professional provider for Digital Services. Please review the project requirements and submit a competitive proposal.	c800df55-740a-4bf4-abcf-9fb8dc54aa85	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	232	997	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-11 03:30:49.939	2026-02-18 16:23:25.353
8e18380b-8da7-477a-9e64-97a3c954606b	1abb39df-0929-4386-aff1-8a5ae3668375	Business Service Required	We are looking for a professional provider for Business. Please review the project requirements and submit a competitive proposal.	4ff97148-cb5b-41af-b3b8-d69d88d126d9	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	210	1692	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-14 22:27:26.816	2026-02-18 16:23:25.354
f8e3464c-6051-43a3-abb2-5236ba6000f4	112e2545-b79b-4375-b02e-ab398816ccd0	Business Service Required	We are looking for a professional provider for Business. Please review the project requirements and submit a competitive proposal.	4ff97148-cb5b-41af-b3b8-d69d88d126d9	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	273	1541	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-11 23:56:08.759	2026-02-18 16:23:25.356
6eb5a538-9e02-4793-8562-3028f2101fc1	00a886d6-2514-4dd6-b1bf-96a9fa2cecb6	Central AC Systems Service Required	We are looking for a professional provider for Central AC Systems. Please review the project requirements and submit a competitive proposal.	e4b87995-9082-4431-b055-d53c0bea18ab	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	541	1646	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-11 01:44:00.05	2026-02-18 16:23:25.36
cd245aa2-2cf2-42a3-9e61-c0e845ad7e42	134e670e-7b08-4a59-bc2d-0589d08b6dcd	Central AC Systems Service Required	We are looking for a professional provider for Central AC Systems. Please review the project requirements and submit a competitive proposal.	e4b87995-9082-4431-b055-d53c0bea18ab	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	187	1885	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-09 23:33:29.071	2026-02-18 16:23:25.362
1909faf8-4e8a-45d7-bb29-2ae85901b4d4	762f836e-6368-4fa0-9757-af9898900a8d	Heating Repair Service Required	We are looking for a professional provider for Heating Repair. Please review the project requirements and submit a competitive proposal.	99d200f3-6346-4394-b99e-f13bfcbf45b4	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	446	1515	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-15 00:17:15.528	2026-02-18 16:23:25.364
e1d4bc72-44a4-475f-a77b-6ade4759b5af	8ea63e67-d7e4-4104-93de-361bba4a4aa9	Heating Repair Service Required	We are looking for a professional provider for Heating Repair. Please review the project requirements and submit a competitive proposal.	99d200f3-6346-4394-b99e-f13bfcbf45b4	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	566	643	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-12 08:49:13.086	2026-02-18 16:23:25.366
6378edc9-6ab1-47f3-9e99-a719cd22f93f	63a0f3bf-e2fe-4353-88a1-8f6c12cb74c9	Duct Install & Cleaning Service Required	We are looking for a professional provider for Duct Install & Cleaning. Please review the project requirements and submit a competitive proposal.	c51e73dc-ef12-4653-9e28-09fad77b21fc	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	125	1299	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-11 10:19:30.508	2026-02-18 16:23:25.37
dfb7ce4a-0e77-483f-a920-e4c2bed72dbb	5a529f50-7761-4049-a023-1b9120b244d7	Thermostat Install Service Required	We are looking for a professional provider for Thermostat Install. Please review the project requirements and submit a competitive proposal.	998ed8b1-59de-4c05-a4f1-318c4475145f	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	585	1810	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-11 02:21:32.475	2026-02-18 16:23:25.372
b6694c82-9e82-4fa2-9bb1-860ac3348b23	90a57a13-7f68-46a3-92ff-d9417f02e2d9	Thermostat Install Service Required	We are looking for a professional provider for Thermostat Install. Please review the project requirements and submit a competitive proposal.	998ed8b1-59de-4c05-a4f1-318c4475145f	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	321	1544	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-13 17:41:36.592	2026-02-18 16:23:25.373
fbd5c8ed-6df3-42f3-b41a-a33411169bbb	709f0a1e-1bdd-4c0d-9509-9f26a46e9d03	Gas Refill Service Required	We are looking for a professional provider for Gas Refill. Please review the project requirements and submit a competitive proposal.	a2ff47e5-f2ed-41e1-867e-0345dc56eb6b	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	122	1091	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-15 18:59:30.308	2026-02-18 16:23:25.375
9353c913-bd2c-411b-a157-281f5d9a7fcb	544573f8-a70a-4a36-96e1-b7c0e6833973	Gas Refill Service Required	We are looking for a professional provider for Gas Refill. Please review the project requirements and submit a competitive proposal.	a2ff47e5-f2ed-41e1-867e-0345dc56eb6b	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	204	1079	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-15 18:32:00.116	2026-02-18 16:23:25.377
e6bda2a9-b469-431b-8dac-14d54c19f00e	2dae1352-4180-4f5f-8606-7cd01c61b9d8	HVAC Inspection Service Required	We are looking for a professional provider for HVAC Inspection. Please review the project requirements and submit a competitive proposal.	a9a06bd3-95b8-4356-8ce3-c652f61f660b	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	346	1450	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-12 00:57:18.493	2026-02-18 16:23:25.379
b3333af7-2cd9-4ade-978a-b1d7a7b348c0	4f3d2896-0e00-4f98-b579-ba9254f28c1f	HVAC Inspection Service Required	We are looking for a professional provider for HVAC Inspection. Please review the project requirements and submit a competitive proposal.	a9a06bd3-95b8-4356-8ce3-c652f61f660b	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	365	1753	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-12 15:19:14.475	2026-02-18 16:23:25.381
1b3b1492-e9a5-4d31-af80-fa3172096b15	329bb7c8-2ecb-4357-aa27-6baed0b1e3b7	Network Installation Service Required	We are looking for a professional provider for Network Installation. Please review the project requirements and submit a competitive proposal.	094e4723-4046-4698-a5e2-fe3cc59c3245	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	468	1516	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-18 11:51:57.619	2026-02-18 16:23:25.383
56bc5a0f-19f5-4c84-8798-ab748d3ae13d	2849b948-60db-409c-aac1-5dc6cf411051	Network Installation Service Required	We are looking for a professional provider for Network Installation. Please review the project requirements and submit a competitive proposal.	094e4723-4046-4698-a5e2-fe3cc59c3245	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	212	1061	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-15 02:18:46.378	2026-02-18 16:23:25.385
c4a4a34c-3634-4635-80e5-74b180d89d8b	40892513-50c2-4a41-9f1a-be224ae492fa	Server Installation Service Required	We are looking for a professional provider for Server Installation. Please review the project requirements and submit a competitive proposal.	86a76eb4-918a-4476-ad5c-b1f84fe9ec4a	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	452	1036	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-16 21:27:50.365	2026-02-18 16:23:25.387
1d56495d-afb6-4aca-8335-2f0305e441e5	63a0f3bf-e2fe-4353-88a1-8f6c12cb74c9	Server Installation Service Required	We are looking for a professional provider for Server Installation. Please review the project requirements and submit a competitive proposal.	86a76eb4-918a-4476-ad5c-b1f84fe9ec4a	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	569	1071	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-17 19:24:47.264	2026-02-18 16:23:25.389
5494360f-1cfe-4ea1-9ce0-46a3abcd2291	40892513-50c2-4a41-9f1a-be224ae492fa	Server Maintenance Service Required	We are looking for a professional provider for Server Maintenance. Please review the project requirements and submit a competitive proposal.	0908a7a2-ca8f-4190-8dee-a43331dd59c8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	301	1534	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-14 14:07:10.186	2026-02-18 16:23:25.393
c9182c04-1a74-43b5-8e48-2a005545cb71	1963ba9d-85f7-4456-9803-24ff87187b82	Hardware Repair Service Required	We are looking for a professional provider for Hardware Repair. Please review the project requirements and submit a competitive proposal.	1b0eb73a-0e17-4dfc-8299-1376df9f40e7	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	415	2087	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-13 01:40:59.024	2026-02-18 16:23:25.395
ef6065b2-2d38-4bce-b7ca-9507148e1131	02d635af-3510-4db3-9e4f-b0afad0cd7b3	Hardware Repair Service Required	We are looking for a professional provider for Hardware Repair. Please review the project requirements and submit a competitive proposal.	1b0eb73a-0e17-4dfc-8299-1376df9f40e7	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	216	1572	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-18 02:18:13.971	2026-02-18 16:23:25.398
35b8875c-a904-4a8b-8f66-0676d3921f8f	338a9c72-8a9b-4f08-a381-b527ceea416d	Printer Setup Service Required	We are looking for a professional provider for Printer Setup. Please review the project requirements and submit a competitive proposal.	6da456be-fbf2-4421-8140-0fd4efcc9edc	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	518	829	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-17 22:10:44.788	2026-02-18 16:23:25.4
b28bf0bc-7bb9-4d87-b62e-84a94a150c31	544573f8-a70a-4a36-96e1-b7c0e6833973	Printer Setup Service Required	We are looking for a professional provider for Printer Setup. Please review the project requirements and submit a competitive proposal.	6da456be-fbf2-4421-8140-0fd4efcc9edc	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	486	682	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-14 07:50:51.271	2026-02-18 16:23:25.402
05bc7172-5fb6-4e0f-a311-ce94d580a71b	2dae1352-4180-4f5f-8606-7cd01c61b9d8	CCTV Integration Service Required	We are looking for a professional provider for CCTV Integration. Please review the project requirements and submit a competitive proposal.	7245e6a5-a8fe-4f53-85ea-86ead7b76474	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	389	974	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-10 09:46:51.991	2026-02-18 16:23:25.406
be0fe802-9ca8-42a5-9db5-6485edc208a6	112e2545-b79b-4375-b02e-ab398816ccd0	Maintenance Contracts Service Required	We are looking for a professional provider for Maintenance Contracts. Please review the project requirements and submit a competitive proposal.	6c3eb205-4e70-41d4-8bee-2c8af2adadd1	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	166	1387	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-11 06:14:36.253	2026-02-18 16:23:25.409
d734bd94-bf50-4f86-99db-74a9a8cecb7b	544573f8-a70a-4a36-96e1-b7c0e6833973	Maintenance Contracts Service Required	We are looking for a professional provider for Maintenance Contracts. Please review the project requirements and submit a competitive proposal.	6c3eb205-4e70-41d4-8bee-2c8af2adadd1	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	574	1128	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-08 19:09:05.243	2026-02-18 16:23:25.41
2fcaf3c4-3aed-4237-b2c9-7e376b244b0f	8b31467b-a846-4ac4-aee7-6f5880fd3e7b	E-commerce Dev Service Required	We are looking for a professional provider for E-commerce Dev. Please review the project requirements and submit a competitive proposal.	b2a5e338-73ff-42a6-8dc3-b80d4e6fc5fc	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	352	1817	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-18 12:32:07.066	2026-02-18 16:23:25.412
c1370cac-8235-4d63-aa63-31f008ce05de	8b31467b-a846-4ac4-aee7-6f5880fd3e7b	E-commerce Dev Service Required	We are looking for a professional provider for E-commerce Dev. Please review the project requirements and submit a competitive proposal.	b2a5e338-73ff-42a6-8dc3-b80d4e6fc5fc	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	257	1683	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-09 06:45:00.26	2026-02-18 16:23:25.415
0becbb7f-6aa8-4628-9bf5-dab3d5de7aa7	5cfbcdd0-0b36-4921-a3c2-fa504ca8a20d	UI/UX Design Service Required	We are looking for a professional provider for UI/UX Design. Please review the project requirements and submit a competitive proposal.	50187776-a7e9-41bb-9d8f-8fcc73bf7eb0	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	332	666	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-09 05:40:42.945	2026-02-18 16:23:25.417
ae80bcc0-8d16-4133-b625-19be834d7df0	83bab9c2-d7f5-49a5-aa8e-d1a1bd06ff95	UI/UX Design Service Required	We are looking for a professional provider for UI/UX Design. Please review the project requirements and submit a competitive proposal.	50187776-a7e9-41bb-9d8f-8fcc73bf7eb0	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	131	1664	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-08 20:09:12.846	2026-02-18 16:23:25.419
7f4db047-434f-4d0e-b499-396623e80c19	00a886d6-2514-4dd6-b1bf-96a9fa2cecb6	Digital Marketing Service Required	We are looking for a professional provider for Digital Marketing. Please review the project requirements and submit a competitive proposal.	d2c3038f-cc14-4e68-804e-03c1373cf56b	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	306	1548	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-12 05:35:02.055	2026-02-18 16:23:25.421
48c4cdb5-8071-4ce3-8a0b-4403f011ee5a	2849b948-60db-409c-aac1-5dc6cf411051	Digital Marketing Service Required	We are looking for a professional provider for Digital Marketing. Please review the project requirements and submit a competitive proposal.	d2c3038f-cc14-4e68-804e-03c1373cf56b	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	210	1720	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-13 03:28:43.673	2026-02-18 16:23:25.423
9c01751d-bef2-4be1-9c56-d9a51d9c0791	105bb1c7-f9b9-48b8-a031-76d2b52c2eff	SEO Services Service Required	We are looking for a professional provider for SEO Services. Please review the project requirements and submit a competitive proposal.	ae53a59e-003d-49e7-9e87-697ee990cc54	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	438	646	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-15 13:53:38.001	2026-02-18 16:23:25.425
5568a05b-ac92-4c82-a51f-f5b491d46b49	2b1bfbaf-1f04-4124-bd01-68c75f8acd95	Paid Ads Mgmt Service Required	We are looking for a professional provider for Paid Ads Mgmt. Please review the project requirements and submit a competitive proposal.	f4f9931a-f98b-4d38-bb26-5cad9c963e15	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	138	1947	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-14 09:34:09.032	2026-02-18 16:23:25.428
55495cdc-fa24-4206-8265-70737f8c1189	1fe1195e-328a-4400-8f78-e85a8d9de7c4	Paid Ads Mgmt Service Required	We are looking for a professional provider for Paid Ads Mgmt. Please review the project requirements and submit a competitive proposal.	f4f9931a-f98b-4d38-bb26-5cad9c963e15	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	153	1957	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-12 10:20:21.667	2026-02-18 16:23:25.43
09a47c3e-514f-4a6e-a427-908cf4d48d03	7f65f52e-949f-493b-9ebf-4af5e98b832b	HR & Recruitment Service Required	We are looking for a professional provider for HR & Recruitment. Please review the project requirements and submit a competitive proposal.	03d91ca1-5212-4f7b-83a1-42400912048c	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	331	1508	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-13 18:57:37.863	2026-02-18 16:23:25.432
e92c4e29-fb85-44ee-8e18-93d0ad7d4283	2a474982-5739-47fb-81f2-e1273e800c55	HR & Recruitment Service Required	We are looking for a professional provider for HR & Recruitment. Please review the project requirements and submit a competitive proposal.	03d91ca1-5212-4f7b-83a1-42400912048c	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	319	1977	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-09 03:38:28.585	2026-02-18 16:23:25.434
efd80c98-72b6-4f22-a820-7330fa89e057	5cfbcdd0-0b36-4921-a3c2-fa504ca8a20d	Office Setup Service Required	We are looking for a professional provider for Office Setup. Please review the project requirements and submit a competitive proposal.	2f9602ea-0a83-4153-ab0b-3bfa296db823	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	488	2035	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-12 14:52:02.063	2026-02-18 16:23:25.436
a7a1654b-40a1-4018-a456-1e091ee94804	15253bbb-7d62-4674-ad27-c66475936580	Office Setup Service Required	We are looking for a professional provider for Office Setup. Please review the project requirements and submit a competitive proposal.	2f9602ea-0a83-4153-ab0b-3bfa296db823	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	380	664	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-13 07:42:59.001	2026-02-18 16:23:25.438
5f74b936-6a2a-41cd-a75d-871f062b07b8	63a0f3bf-e2fe-4353-88a1-8f6c12cb74c9	PRO Services Service Required	We are looking for a professional provider for PRO Services. Please review the project requirements and submit a competitive proposal.	a32a9674-3e61-4eae-9263-8a792adf53eb	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	306	1439	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-14 04:43:59.717	2026-02-18 16:23:25.44
312e7caf-9ffe-4f88-b774-c404eebcba42	8b31467b-a846-4ac4-aee7-6f5880fd3e7b	PRO Services Service Required	We are looking for a professional provider for PRO Services. Please review the project requirements and submit a competitive proposal.	a32a9674-3e61-4eae-9263-8a792adf53eb	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	352	1136	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-09 18:02:35.427	2026-02-18 16:23:25.442
fccccee9-ca3b-493c-9c31-7c5a3c7e3dfe	112e2545-b79b-4375-b02e-ab398816ccd0	Logo Design Service Required	We are looking for a professional provider for Logo Design. Please review the project requirements and submit a competitive proposal.	06dee9e7-8564-4afe-9544-715d48872bbb	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	466	1030	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-15 03:00:23.458	2026-02-18 16:23:25.446
3cc5c032-9de0-4151-8b86-5f83d44e28d2	5cfbcdd0-0b36-4921-a3c2-fa504ca8a20d	Architectural Design Service Required	We are looking for a professional provider for Architectural Design. Please review the project requirements and submit a competitive proposal.	0c401f45-8f32-4a40-81c7-c12a0063e6f3	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	495	972	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-15 03:13:01.077	2026-02-18 16:23:25.449
4cd8029e-d5c8-40be-a45d-bb87fa530ff3	1dc82269-4fd8-4f16-8810-88d97fbad231	Architectural Design Service Required	We are looking for a professional provider for Architectural Design. Please review the project requirements and submit a competitive proposal.	0c401f45-8f32-4a40-81c7-c12a0063e6f3	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	199	1889	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-12 07:33:50.8	2026-02-18 16:23:25.451
ec4cfcc9-a9d9-42bd-b7d0-b9e26361cb58	1cec89ac-cdb8-41fb-81ea-2650126f551f	مطلوب خدمة التدفئة والتبريد بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في التدفئة والتبريد. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	8ad4b9e1-028d-48cb-b93d-ecd23520c68b	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	367	774	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-14 06:42:19.975	2026-02-18 16:23:25.453
9d0aae44-dc0a-488f-81cf-d036726cc4b4	2a474982-5739-47fb-81f2-e1273e800c55	مطلوب خدمة التدفئة والتبريد بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في التدفئة والتبريد. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	8ad4b9e1-028d-48cb-b93d-ecd23520c68b	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	263	878	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-16 07:33:18.563	2026-02-18 16:23:25.456
e3277c83-dcee-4ecd-8872-64e3da77f176	31494848-428e-4d55-b324-2eb64c380f32	ابحث عن خدمة تركيب مولدات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تركيب مولدات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	a0b0eaea-a4e9-4ed0-add4-8273a72630ee	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	182	947	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-16 11:11:44.789	2026-02-18 16:23:25.458
61269322-5be9-4931-b054-144e545b8794	1b804e9c-1a66-4436-b031-5f958678241c	مطلوب خدمة تكنولوجيا المعلومات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تكنولوجيا المعلومات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	ba67114a-555e-4275-980f-2dce64d575bc	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	550	1181	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-12 02:51:14.329	2026-02-18 16:23:25.463
9e2d8b72-43dd-4367-9932-5d0f43c6fbae	2a474982-5739-47fb-81f2-e1273e800c55	ابحث عن خدمة تكنولوجيا المعلومات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تكنولوجيا المعلومات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	ba67114a-555e-4275-980f-2dce64d575bc	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	476	1000	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-15 06:02:19.989	2026-02-18 16:23:25.465
cc4cd5d1-de41-4d3a-be03-3755c3fbb52e	18c8e3e0-1a95-467d-8a49-a027cee0e5bd	ابحث عن خدمة التسويق والإعلان بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في التسويق والإعلان. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	627232ef-ea4d-4ebc-8f84-9554e9f511e8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	257	641	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-14 15:22:18.789	2026-02-18 16:23:25.467
8655d7a8-7a22-472b-b28d-4af93a858fa5	2b1bfbaf-1f04-4124-bd01-68c75f8acd95	مطلوب خدمة التسويق والإعلان بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في التسويق والإعلان. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	627232ef-ea4d-4ebc-8f84-9554e9f511e8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	586	1254	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-15 13:00:23.577	2026-02-18 16:23:25.469
3a4cf967-0ef3-477e-bef3-3ed4051fa966	105bb1c7-f9b9-48b8-a031-76d2b52c2eff	مطلوب خدمة النقل بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في النقل. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	48005ecb-8c84-485d-b9bc-140dd788f72c	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	509	1450	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-16 15:02:10.999	2026-02-18 16:23:25.47
49bae669-9b5c-493c-b6aa-5318f447dd47	068d20f7-d8fe-405f-b31b-989f997b2042	ابحث عن خدمة النقل بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في النقل. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	48005ecb-8c84-485d-b9bc-140dd788f72c	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	463	617	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-16 07:35:01.552	2026-02-18 16:23:25.472
2daba0ce-da54-465a-8dbf-1ddf225ff6b9	134e670e-7b08-4a59-bc2d-0589d08b6dcd	مطلوب خدمة الرعاية الصحية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في الرعاية الصحية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	9997915a-51af-4ce5-b775-0ed8079d0e8e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	154	816	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-17 17:27:45.066	2026-02-18 16:23:25.474
a7ed64fe-65d6-4e46-ac87-53b59619a487	31494848-428e-4d55-b324-2eb64c380f32	مطلوب خدمة الرعاية الصحية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في الرعاية الصحية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	9997915a-51af-4ce5-b775-0ed8079d0e8e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	207	994	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-13 16:57:07.179	2026-02-18 16:23:25.476
ebcab277-9825-4e12-a52c-d0ba03e2928e	134e670e-7b08-4a59-bc2d-0589d08b6dcd	احتاج الى خدمة التعليم والتدريب بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في التعليم والتدريب. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	5b49ca23-0797-411a-a41f-232b402d02fe	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	579	878	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-18 07:53:41.554	2026-02-18 16:23:25.481
73fd3c5e-b224-41ec-a3da-26cb046f264f	15253bbb-7d62-4674-ad27-c66475936580	مطلوب خدمة الفعاليات والترفيه بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في الفعاليات والترفيه. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	48e249e6-bf40-4338-8d91-16c2ffe0db3f	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	511	1239	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-13 14:32:01.083	2026-02-18 16:23:25.482
c1fe6a5c-56a6-4c61-b114-31c7bd3ada7b	2b1bfbaf-1f04-4124-bd01-68c75f8acd95	مطلوب خدمة الفعاليات والترفيه بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في الفعاليات والترفيه. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	48e249e6-bf40-4338-8d91-16c2ffe0db3f	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	195	915	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-18 02:46:18.15	2026-02-18 16:23:25.484
262478db-2bd1-43e3-a390-e69b38d08c99	2dae1352-4180-4f5f-8606-7cd01c61b9d8	ابحث عن خدمة سباكة بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في سباكة. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	98e85028-eaff-4c4c-a5ae-ccbe1c88e837	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	289	1052	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-16 10:30:25.895	2026-02-18 16:23:25.488
3cf41746-0603-4464-89fe-a3ddef188313	068d20f7-d8fe-405f-b31b-989f997b2042	مطلوب خدمة سباكة بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في سباكة. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	98e85028-eaff-4c4c-a5ae-ccbe1c88e837	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	176	1081	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-17 11:44:45.669	2026-02-18 16:23:25.491
b4f7ba80-e10c-4547-9fd7-f263f7774d1d	134e670e-7b08-4a59-bc2d-0589d08b6dcd	مطلوب خدمة مقاولات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في مقاولات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	7049731f-af4e-489e-b560-096dfa6b7869	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	235	895	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-13 02:48:44.546	2026-02-18 16:23:25.493
21a9a344-dc9e-4487-be92-9a2fe20da934	1abb39df-0929-4386-aff1-8a5ae3668375	مطلوب خدمة مقاولات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في مقاولات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	7049731f-af4e-489e-b560-096dfa6b7869	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	327	762	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-14 03:06:06.118	2026-02-18 16:23:25.495
d98b3132-9923-4683-a925-378d9156bd51	134e670e-7b08-4a59-bc2d-0589d08b6dcd	ابحث عن خدمة تنظيف بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تنظيف. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	98d60428-77df-4a56-8bca-4025dd191119	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	521	1274	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-18 02:16:35.705	2026-02-18 16:23:25.496
b83fc32b-3890-4690-9f5b-9654ecc334a1	02d635af-3510-4db3-9e4f-b0afad0cd7b3	احتاج الى خدمة تنظيف بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تنظيف. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	98d60428-77df-4a56-8bca-4025dd191119	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	209	586	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-11 18:29:07.186	2026-02-18 16:23:25.498
1a8bc748-59f4-4f0c-baee-75a92ffa35bf	02d635af-3510-4db3-9e4f-b0afad0cd7b3	مطلوب خدمة نقل عفش بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في نقل عفش. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	d69b3ed6-faf5-4746-ba0f-eb57708676aa	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	183	812	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-12 00:32:48.718	2026-02-18 16:23:25.5
eec71f66-6eec-491b-920e-86fe967e38de	02d635af-3510-4db3-9e4f-b0afad0cd7b3	مطلوب خدمة نقل عفش بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في نقل عفش. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	d69b3ed6-faf5-4746-ba0f-eb57708676aa	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	201	918	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-12 22:06:46.164	2026-02-18 16:23:25.502
e8dd175b-810f-4f89-a1c0-45eb1a2a7f9a	1cec89ac-cdb8-41fb-81ea-2650126f551f	مطلوب خدمة تركيب مكيفات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تركيب مكيفات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	c5168990-ce7e-4c39-b9ac-8fbbe3bdefb0	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	154	721	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-15 16:14:37.364	2026-02-18 16:23:25.503
0be0a4fa-87a0-403b-a736-0f1a94c78d9f	15253bbb-7d62-4674-ad27-c66475936580	مطلوب خدمة تركيب مكيفات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تركيب مكيفات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	c5168990-ce7e-4c39-b9ac-8fbbe3bdefb0	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	343	348	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-14 04:36:46.961	2026-02-18 16:23:25.505
9e9354c6-6ce6-46c2-9992-8088a61dde2b	1cec89ac-cdb8-41fb-81ea-2650126f551f	ابحث عن خدمة تمديدات كهربائية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تمديدات كهربائية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	9ac120a7-3f97-47fd-b5ee-619b7711dcf4	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	476	1266	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-15 16:50:40.46	2026-02-18 16:23:25.507
8b83d9cc-34ce-441a-83c6-709dc263c45b	1963ba9d-85f7-4456-9803-24ff87187b82	مطلوب خدمة جبس بورد بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في جبس بورد. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	84885f89-be5a-4750-baac-92ce56f45288	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	469	856	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-18 03:22:32.813	2026-02-18 16:23:25.509
b69ec6c5-99b7-4529-b8c6-843f0c866b8d	105bb1c7-f9b9-48b8-a031-76d2b52c2eff	مطلوب خدمة إصلاح أعطال كهرباء بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في إصلاح أعطال كهرباء. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	8981ac1a-f116-4694-898e-afda5de9b73c	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	221	320	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-15 01:34:51.004	2026-02-18 16:23:25.513
9aaf8a81-f0d6-4e7f-b958-f0e49c67da5e	105bb1c7-f9b9-48b8-a031-76d2b52c2eff	ابحث عن خدمة إصلاح أعطال كهرباء بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في إصلاح أعطال كهرباء. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	8981ac1a-f116-4694-898e-afda5de9b73c	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	367	896	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-16 09:54:43.392	2026-02-18 16:23:25.515
6aed73b9-9d64-4b36-9e54-2697ebf88875	1dc82269-4fd8-4f16-8810-88d97fbad231	ابحث عن خدمة تركيب إنارة بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تركيب إنارة. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	b18f064e-30fd-4227-a6e0-94efae54d8f2	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	108	265	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-17 01:36:04.293	2026-02-18 16:23:25.517
f9f3935e-bda6-4ee8-8b4c-c5f760055d56	15253bbb-7d62-4674-ad27-c66475936580	احتاج الى خدمة تركيب إنارة بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تركيب إنارة. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	b18f064e-30fd-4227-a6e0-94efae54d8f2	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	409	1164	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-17 17:48:06.588	2026-02-18 16:23:25.519
88b97061-5a3f-47ba-ab70-f51c22ba0630	02d635af-3510-4db3-9e4f-b0afad0cd7b3	مطلوب خدمة صيانة مولدات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في صيانة مولدات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	4acb75e6-2c26-4912-8857-867cc55d05ed	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	424	626	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-13 15:18:28.525	2026-02-18 16:23:25.522
6e4924f2-5fd7-4a91-8e54-3ffbec384a0b	1b804e9c-1a66-4436-b031-5f958678241c	ابحث عن خدمة صيانة مولدات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في صيانة مولدات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	4acb75e6-2c26-4912-8857-867cc55d05ed	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	347	1292	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-16 05:43:45.872	2026-02-18 16:23:25.524
fce4867e-9c5b-4d30-813a-36ae94f042f5	112e2545-b79b-4375-b02e-ab398816ccd0	ابحث عن خدمة تركيب طاقة شمسية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تركيب طاقة شمسية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	3d4fec38-cbdd-45e0-8fab-73e5a05a1600	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	586	1332	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-13 13:31:20.971	2026-02-18 16:23:25.527
a2927898-5511-4078-bb9f-5505f763bfae	1963ba9d-85f7-4456-9803-24ff87187b82	مطلوب خدمة تركيب طاقة شمسية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تركيب طاقة شمسية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	3d4fec38-cbdd-45e0-8fab-73e5a05a1600	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	225	1221	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-17 23:24:40.123	2026-02-18 16:23:25.529
d0c3b213-7c31-4c02-acd6-d09bd95f7eed	1dc82269-4fd8-4f16-8810-88d97fbad231	مطلوب خدمة صيانة طاقة شمسية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في صيانة طاقة شمسية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	0def337f-dd79-4734-9227-80c91e4a2bf9	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	220	1190	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-15 09:41:46.061	2026-02-18 16:23:25.533
c62be7a2-6ecb-46f2-8c02-851a23319735	112e2545-b79b-4375-b02e-ab398816ccd0	ابحث عن خدمة تركيب لوحات كهرباء بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تركيب لوحات كهرباء. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	38cb0fe6-bc94-4f20-b0ab-fc5ce125ec38	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	226	864	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-17 03:50:04.311	2026-02-18 16:23:25.536
a56eab2b-2a43-4d30-9950-4611edf06be7	00a886d6-2514-4dd6-b1bf-96a9fa2cecb6	احتاج الى خدمة تركيب لوحات كهرباء بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تركيب لوحات كهرباء. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	38cb0fe6-bc94-4f20-b0ab-fc5ce125ec38	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	241	1078	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-11 21:08:17.442	2026-02-18 16:23:25.538
333cb0c3-f6f3-4a22-af7a-e0ca88382e42	2a474982-5739-47fb-81f2-e1273e800c55	مطلوب خدمة أنظمة طاقة احتياطية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في أنظمة طاقة احتياطية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	c79261af-78c0-4b45-97b6-d918a3b015c0	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	416	1373	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-14 23:49:13.825	2026-02-18 16:23:25.542
ab8dc9b7-f261-48ce-8d19-3ea24b8b8492	068d20f7-d8fe-405f-b31b-989f997b2042	ابحث عن خدمة كشف وإصلاح تسربات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في كشف وإصلاح تسربات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	b52de601-ed5f-4be7-b531-55e4573892f1	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	422	1386	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-11 19:56:31.392	2026-02-18 16:23:25.545
6862cc02-4b64-4f7b-a486-1ffca1ba32b4	1cec89ac-cdb8-41fb-81ea-2650126f551f	احتاج الى خدمة كشف وإصلاح تسربات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في كشف وإصلاح تسربات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	b52de601-ed5f-4be7-b531-55e4573892f1	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	142	251	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-15 15:07:43.68	2026-02-18 16:23:25.547
ee3c30a1-0add-4e07-bf71-9bfa2c53c07c	134e670e-7b08-4a59-bc2d-0589d08b6dcd	ابحث عن خدمة تمديد أنابيب بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تمديد أنابيب. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	6805a74f-f7f9-419c-858f-49b99247e35b	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	158	925	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-12 07:48:16.576	2026-02-18 16:23:25.549
621230b6-63dd-4480-8186-104c9e36e595	1dc82269-4fd8-4f16-8810-88d97fbad231	مطلوب خدمة تمديد أنابيب بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تمديد أنابيب. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	6805a74f-f7f9-419c-858f-49b99247e35b	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	390	1005	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-17 21:10:54.447	2026-02-18 16:23:25.551
4fc5635f-e98b-44d0-97a6-ffe839de7e58	1fe1195e-328a-4400-8f78-e85a8d9de7c4	ابحث عن خدمة تركيب سخان مياه بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تركيب سخان مياه. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	65ddaf4f-5020-4a5f-bcde-d6bea9a519ac	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	589	757	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-12 03:36:44.487	2026-02-18 16:23:25.553
6759103a-63b8-424a-bb2f-6f1189025e60	105bb1c7-f9b9-48b8-a031-76d2b52c2eff	ابحث عن خدمة تركيب سخان مياه بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تركيب سخان مياه. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	65ddaf4f-5020-4a5f-bcde-d6bea9a519ac	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	569	1041	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-14 07:28:19.899	2026-02-18 16:23:25.556
d9ab8cf0-eae1-4329-ab32-fc9c67ed555f	1963ba9d-85f7-4456-9803-24ff87187b82	احتاج الى خدمة صيانة سخان مياه بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في صيانة سخان مياه. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	487b84b5-be40-43ae-b5ed-96a494083762	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	162	627	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-17 07:03:50.705	2026-02-18 16:23:25.558
b1e4bba0-da06-43fd-996f-0db4a7249347	2dae1352-4180-4f5f-8606-7cd01c61b9d8	احتاج الى خدمة صيانة سخان مياه بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في صيانة سخان مياه. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	487b84b5-be40-43ae-b5ed-96a494083762	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	146	742	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-15 22:26:34.161	2026-02-18 16:23:25.56
8dc85e67-0fb2-43e4-97d0-a8efa9c082ea	1abb39df-0929-4386-aff1-8a5ae3668375	ابحث عن خدمة سباكة حمامات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في سباكة حمامات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	bd693184-a710-441e-aa8b-d7c15901bac9	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	509	1163	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-18 14:24:00.254	2026-02-18 16:23:25.563
701f16f5-723f-40c5-83f8-e8288622ca2f	2b1bfbaf-1f04-4124-bd01-68c75f8acd95	احتاج الى خدمة سباكة مطابخ بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في سباكة مطابخ. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	e9264c4c-cd5f-4c68-acbd-e99f48182171	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	225	866	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-12 03:11:36.044	2026-02-18 16:23:25.567
548a3f1c-ac26-4c1e-9c49-e07afeb925a5	134e670e-7b08-4a59-bc2d-0589d08b6dcd	احتاج الى خدمة خدمات محاسبية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في خدمات محاسبية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	dd57d659-e8bf-4a47-897c-1fb44c56a16d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	334	1107	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-12 20:15:46.873	2026-02-18 16:23:25.572
2a23318a-a350-4d82-80fe-861a0c0faa2d	1abb39df-0929-4386-aff1-8a5ae3668375	مطلوب خدمة خدمات محاسبية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في خدمات محاسبية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	dd57d659-e8bf-4a47-897c-1fb44c56a16d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	534	761	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-14 19:38:38.866	2026-02-18 16:23:25.574
90f421b4-dc1a-4b59-ace1-d83d1453bd5c	18c8e3e0-1a95-467d-8a49-a027cee0e5bd	ابحث عن خدمة استشارات قانونية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في استشارات قانونية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	11552f47-066a-4cad-b38a-2c74eed0bed4	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	296	825	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-12 22:43:57.351	2026-02-18 16:23:25.576
8c961758-b67e-4b88-9ee1-118ab81aaa4e	15253bbb-7d62-4674-ad27-c66475936580	مطلوب خدمة استشارات قانونية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في استشارات قانونية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	11552f47-066a-4cad-b38a-2c74eed0bed4	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	286	492	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-13 04:13:58.979	2026-02-18 16:23:25.579
74362099-0c04-4bc5-b9c9-172c4ae92e0e	1cec89ac-cdb8-41fb-81ea-2650126f551f	مطلوب خدمة تصوير احترافي بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تصوير احترافي. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	deb10409-fb05-4a07-a0f4-dda54988cd52	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	395	891	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-17 01:34:44.334	2026-02-18 16:23:25.581
3afea4b9-9f04-443c-95ca-0643cf60068e	112e2545-b79b-4375-b02e-ab398816ccd0	احتاج الى خدمة تصوير احترافي بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تصوير احترافي. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	deb10409-fb05-4a07-a0f4-dda54988cd52	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	100	409	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-17 18:18:35.886	2026-02-18 16:23:25.583
9ca59d5a-9af2-49c3-87c8-9e49ec882b19	1abb39df-0929-4386-aff1-8a5ae3668375	مطلوب خدمة تسليك مجاري بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تسليك مجاري. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	5037cea3-0eba-4061-b365-33a8ce2b99e5	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	569	1496	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-17 20:01:28.898	2026-02-18 16:23:25.585
3ba30c2c-332e-40fc-bf8f-31fe3cc3cbda	134e670e-7b08-4a59-bc2d-0589d08b6dcd	احتاج الى خدمة تسليك مجاري بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تسليك مجاري. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	5037cea3-0eba-4061-b365-33a8ce2b99e5	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	410	1341	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-14 07:48:20.06	2026-02-18 16:23:25.588
3e60a5b2-c993-4cb7-b566-df05f5b7b15d	1cec89ac-cdb8-41fb-81ea-2650126f551f	مطلوب خدمة تركيب خزانات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تركيب خزانات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	a536318f-3dd6-4a64-ab44-cd425b104b2e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	437	589	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-13 08:27:53.89	2026-02-18 16:23:25.59
19a816b5-55fe-4139-a84d-ab8df0a0f688	15253bbb-7d62-4674-ad27-c66475936580	مطلوب خدمة تركيب خزانات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تركيب خزانات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	a536318f-3dd6-4a64-ab44-cd425b104b2e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	477	778	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-13 12:22:56.874	2026-02-18 16:23:25.593
5c5b2024-4ebd-43e4-892d-acf385cd2cb9	2dae1352-4180-4f5f-8606-7cd01c61b9d8	احتاج الى خدمة تركيب مضخات مياه بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تركيب مضخات مياه. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	dc97169e-d2c7-4af6-93a5-5010ab9d86f0	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	511	859	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-15 02:52:37.746	2026-02-18 16:23:25.597
1c4c936b-ef24-4e76-94ee-8a2f571a1f1b	2b1bfbaf-1f04-4124-bd01-68c75f8acd95	احتاج الى خدمة مقاول عام بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في مقاول عام. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	3905c75e-18d0-4ef1-b58a-d3e1a7ce5463	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	388	425	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-17 21:41:53.693	2026-02-18 16:23:25.602
430452c7-22c4-4ffd-b540-e517158a49e6	02d635af-3510-4db3-9e4f-b0afad0cd7b3	ابحث عن خدمة ترميم منازل بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في ترميم منازل. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	5c720069-74be-4ad8-807c-e064c1521c4f	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	148	538	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-13 04:35:01.529	2026-02-18 16:23:25.604
15be45ec-3296-4d0f-bf3b-4ebec4fb4938	1dc82269-4fd8-4f16-8810-88d97fbad231	ابحث عن خدمة ترميم منازل بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في ترميم منازل. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	5c720069-74be-4ad8-807c-e064c1521c4f	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	481	524	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-13 07:42:44.302	2026-02-18 16:23:25.606
8409f2de-ec01-4da6-b6f2-5f55a47ba282	1963ba9d-85f7-4456-9803-24ff87187b82	احتاج الى خدمة تجديد مطابخ بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تجديد مطابخ. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	47186941-ba55-49bd-97b8-2b54e376f36b	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	533	758	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-17 10:15:09.155	2026-02-18 16:23:25.608
2450a36d-2a3b-47ff-a05e-90e775c88922	1b804e9c-1a66-4436-b031-5f958678241c	احتاج الى خدمة تجديد مطابخ بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تجديد مطابخ. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	47186941-ba55-49bd-97b8-2b54e376f36b	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	265	589	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-16 03:37:40.749	2026-02-18 16:23:25.61
479cc7f8-97d1-455b-a2ea-63f820343e60	1963ba9d-85f7-4456-9803-24ff87187b82	احتاج الى خدمة تجديد حمامات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تجديد حمامات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	5db5637c-2d55-46eb-b46b-6c5c9aa87a19	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	328	344	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-11 19:21:06.038	2026-02-18 16:23:25.612
14dafebc-66e2-41b2-a381-55f2fca7da86	284e1c70-ae85-4096-a43d-0a407ad229af	ابحث عن خدمة تجديد حمامات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تجديد حمامات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	5db5637c-2d55-46eb-b46b-6c5c9aa87a19	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	574	634	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-12 20:05:45.75	2026-02-18 16:23:25.614
96f5edbd-0780-4da5-9bee-a98490f2f355	18c8e3e0-1a95-467d-8a49-a027cee0e5bd	مطلوب خدمة تركيب بلاط بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تركيب بلاط. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	eb3a5f87-d152-41c0-a704-4dd4f93ed87d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	216	383	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-12 08:17:00.557	2026-02-18 16:23:25.616
192bccb9-9a7b-4eb3-bace-b451410f9346	15253bbb-7d62-4674-ad27-c66475936580	ابحث عن خدمة تركيب بلاط بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تركيب بلاط. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	eb3a5f87-d152-41c0-a704-4dd4f93ed87d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	264	489	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-12 01:03:20.335	2026-02-18 16:23:25.618
a76ef05a-fa19-425d-8307-ac8846d896a9	1dc82269-4fd8-4f16-8810-88d97fbad231	احتاج الى خدمة تركيب أرضيات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تركيب أرضيات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	2e57b799-12e9-40aa-9519-c462f5d458ba	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	415	722	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-17 21:31:38.636	2026-02-18 16:23:25.62
20d0a1d8-1b00-44ab-be79-145bf6b7e6bb	1abb39df-0929-4386-aff1-8a5ae3668375	ابحث عن خدمة تركيب أرضيات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تركيب أرضيات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	2e57b799-12e9-40aa-9519-c462f5d458ba	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	282	1161	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-14 20:27:51.984	2026-02-18 16:23:25.621
9e30ba22-b411-4517-b001-cbbd0f527ae9	112e2545-b79b-4375-b02e-ab398816ccd0	احتاج الى خدمة جبس بورد بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في جبس بورد. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	84885f89-be5a-4750-baac-92ce56f45288	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	406	1053	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-12 03:37:00.714	2026-02-18 16:23:25.623
60775a34-7bff-408d-9301-e1de0e69daeb	1b804e9c-1a66-4436-b031-5f958678241c	ابحث عن خدمة دهانات وديكور بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في دهانات وديكور. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	e9fcae5a-1a61-4f96-adca-e1bee96da919	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	115	759	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-17 18:32:23.521	2026-02-18 16:23:25.627
1323bbb9-b4fe-49d3-bc49-a0209edcb722	1fe1195e-328a-4400-8f78-e85a8d9de7c4	مطلوب خدمة عزل أسطح بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في عزل أسطح. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	93ad7de3-d02d-47c7-9138-22daa3c2c0b4	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	257	861	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-16 09:31:43.861	2026-02-18 16:23:25.629
7d62b962-6864-4a58-9583-2e2eef331368	2b1bfbaf-1f04-4124-bd01-68c75f8acd95	احتاج الى خدمة عزل أسطح بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في عزل أسطح. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	93ad7de3-d02d-47c7-9138-22daa3c2c0b4	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	346	1218	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-14 20:11:45.426	2026-02-18 16:23:25.632
589dc038-7777-4956-9339-66b722671123	134e670e-7b08-4a59-bc2d-0589d08b6dcd	احتاج الى خدمة أعمال باطون وبناء بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في أعمال باطون وبناء. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	5794040d-4834-4d81-a7c3-99d2f4d9383b	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	202	581	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-12 08:28:57.938	2026-02-18 16:23:25.633
883bacd6-a329-4cc5-bea4-6d80e2cde3ae	1963ba9d-85f7-4456-9803-24ff87187b82	احتاج الى خدمة أعمال باطون وبناء بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في أعمال باطون وبناء. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	5794040d-4834-4d81-a7c3-99d2f4d9383b	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	173	684	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-15 03:16:39.284	2026-02-18 16:23:25.636
1bf68dee-b25f-45e4-9046-b8f9fb6550c3	1abb39df-0929-4386-aff1-8a5ae3668375	ابحث عن خدمة تدعيم إنشائي بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تدعيم إنشائي. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	c0e5b849-e7e0-461d-a535-0e84d6d7f791	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	125	993	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-13 06:11:27.44	2026-02-18 16:23:25.639
51618505-84f5-4f00-90eb-4357de9ea679	31494848-428e-4d55-b324-2eb64c380f32	ابحث عن خدمة تدعيم إنشائي بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تدعيم إنشائي. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	c0e5b849-e7e0-461d-a535-0e84d6d7f791	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	138	1112	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-12 22:52:48.49	2026-02-18 16:23:25.64
567db394-2227-4d0e-a649-734b286916f4	2b1bfbaf-1f04-4124-bd01-68c75f8acd95	ابحث عن خدمة تنظيف منازل بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تنظيف منازل. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	459e22dc-d5aa-4f49-9284-d416e3201e34	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	290	412	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-17 11:24:19.955	2026-02-18 16:23:25.642
c5934894-cfe0-445c-b428-ca5ab04b20e0	02d635af-3510-4db3-9e4f-b0afad0cd7b3	مطلوب خدمة تنظيف منازل بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تنظيف منازل. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	459e22dc-d5aa-4f49-9284-d416e3201e34	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	263	616	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-17 18:54:03.631	2026-02-18 16:23:25.644
37efd934-5a04-4d40-8ecd-86b386e6bd01	2849b948-60db-409c-aac1-5dc6cf411051	احتاج الى خدمة تنظيف عميق بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تنظيف عميق. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	b63a2fe5-171f-4db4-95ee-b16a8210eb9d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	211	403	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-15 15:15:28.252	2026-02-18 16:23:25.645
8f2be314-5faf-4f0b-8832-27e6798dd351	134e670e-7b08-4a59-bc2d-0589d08b6dcd	ابحث عن خدمة تنظيف عميق بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تنظيف عميق. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	b63a2fe5-171f-4db4-95ee-b16a8210eb9d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	578	922	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-15 18:49:08.829	2026-02-18 16:23:25.647
e55aa21d-223d-40d7-93f0-c54729d0eb22	18c8e3e0-1a95-467d-8a49-a027cee0e5bd	احتاج الى خدمة تنظيف مكاتب بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تنظيف مكاتب. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	fcd17d77-74e4-4cec-83b1-12e99b00c62f	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	555	1459	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-13 22:05:42.124	2026-02-18 16:23:25.648
4f51adfa-99ac-41e5-83f2-3668f366914a	068d20f7-d8fe-405f-b31b-989f997b2042	ابحث عن خدمة تنظيف بعد البناء بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تنظيف بعد البناء. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	37316c32-bf7c-4282-87b9-78417ffb611d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	585	878	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-12 14:49:17.593	2026-02-18 16:23:25.652
1df1d4b4-2f3e-4cab-908d-85e626901532	18c8e3e0-1a95-467d-8a49-a027cee0e5bd	مطلوب خدمة تنظيف بعد البناء بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تنظيف بعد البناء. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	37316c32-bf7c-4282-87b9-78417ffb611d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	556	1424	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-17 10:44:51.734	2026-02-18 16:23:25.653
67cad739-0890-483d-b0e6-d5bd5021dde1	1cec89ac-cdb8-41fb-81ea-2650126f551f	ابحث عن خدمة تنظيف سجاد وموكيت بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تنظيف سجاد وموكيت. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	b51d67bd-090c-4383-b27d-fc53244989af	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	394	1369	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-13 08:20:09.417	2026-02-18 16:23:25.656
574ff175-564d-4f61-a77e-91c05e2d86fc	2a474982-5739-47fb-81f2-e1273e800c55	احتاج الى خدمة تنظيف سجاد وموكيت بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تنظيف سجاد وموكيت. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	b51d67bd-090c-4383-b27d-fc53244989af	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	405	1266	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-14 07:28:02.984	2026-02-18 16:23:25.658
f2c7e647-393e-490b-8e57-9dcd87b4d9f6	1abb39df-0929-4386-aff1-8a5ae3668375	مطلوب خدمة تنظيف كنب ومفروشات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تنظيف كنب ومفروشات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	be163dd8-9324-47c1-b07a-3d727382acd4	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	191	785	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-15 03:45:44.813	2026-02-18 16:23:25.661
365d2b50-25c2-4244-8545-4671935fb41c	105bb1c7-f9b9-48b8-a031-76d2b52c2eff	مطلوب خدمة تنظيف واجهات زجاجية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تنظيف واجهات زجاجية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	70eeca24-013d-4546-9567-3b42927e8364	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	414	1075	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-12 04:45:15.357	2026-02-18 16:23:25.664
2d3cfc96-0a6e-4ac6-b6b5-30403a5255fc	02d635af-3510-4db3-9e4f-b0afad0cd7b3	ابحث عن خدمة تنظيف واجهات زجاجية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تنظيف واجهات زجاجية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	70eeca24-013d-4546-9567-3b42927e8364	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	484	1048	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-16 19:30:32.339	2026-02-18 16:23:25.666
c23d3438-6094-4a7a-83c0-109f53244b8b	1cec89ac-cdb8-41fb-81ea-2650126f551f	احتاج الى خدمة تعقيم خزانات المياه بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تعقيم خزانات المياه. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	0a715def-3e28-46b5-b8e2-1d5e47af7730	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	596	1371	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-16 01:40:48.119	2026-02-18 16:23:25.668
dbe74f36-364d-4888-8ddf-0f3ec52fc9ff	105bb1c7-f9b9-48b8-a031-76d2b52c2eff	ابحث عن خدمة تعقيم خزانات المياه بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تعقيم خزانات المياه. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	0a715def-3e28-46b5-b8e2-1d5e47af7730	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	159	616	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-16 11:00:42.506	2026-02-18 16:23:25.67
5f466ed8-8960-4eb7-99e4-a69e50d3bf1c	1dc82269-4fd8-4f16-8810-88d97fbad231	ابحث عن خدمة خدمات تعقيم شامل بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في خدمات تعقيم شامل. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	2f34e68f-344a-4a04-8ca5-0ef67fb6f5f7	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	232	841	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-15 19:40:46.261	2026-02-18 16:23:25.672
0c297857-58b0-4026-8198-8c48fefff2af	105bb1c7-f9b9-48b8-a031-76d2b52c2eff	ابحث عن خدمة خدمات تعقيم شامل بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في خدمات تعقيم شامل. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	2f34e68f-344a-4a04-8ca5-0ef67fb6f5f7	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	125	650	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-17 02:07:21.83	2026-02-18 16:23:25.674
6090fb61-61f9-42c7-8fd4-4eadcfa9c9e9	1dc82269-4fd8-4f16-8810-88d97fbad231	ابحث عن خدمة نقل أثاث بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في نقل أثاث. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	24ca6098-169b-46bb-993d-a130327b16f9	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	311	1019	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-12 13:15:02.632	2026-02-18 16:23:25.678
1669de30-95ca-48f6-97d7-9af2fd19fdf3	112e2545-b79b-4375-b02e-ab398816ccd0	ابحث عن خدمة نقل منازل بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في نقل منازل. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	a3529217-903e-4710-b70c-2b15b18ecaa7	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	148	775	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-16 03:22:42.871	2026-02-18 16:23:25.68
0d204ac1-a9cb-4b67-81a7-5d33c856c382	1dc82269-4fd8-4f16-8810-88d97fbad231	احتاج الى خدمة نقل منازل بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في نقل منازل. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	a3529217-903e-4710-b70c-2b15b18ecaa7	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	303	671	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-16 15:42:40.248	2026-02-18 16:23:25.682
0f418399-95ed-436d-862d-433799dbbc2a	105bb1c7-f9b9-48b8-a031-76d2b52c2eff	احتاج الى خدمة نقل مكاتب وشركات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في نقل مكاتب وشركات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	0cfccd84-7b2e-460a-9075-74f3d8dc4586	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	195	1031	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-13 00:11:41.012	2026-02-18 16:23:25.684
074f875c-2e5c-453f-82e5-750fb24066e2	112e2545-b79b-4375-b02e-ab398816ccd0	مطلوب خدمة نقل مكاتب وشركات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في نقل مكاتب وشركات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	0cfccd84-7b2e-460a-9075-74f3d8dc4586	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	455	994	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-11 22:46:42.633	2026-02-18 16:23:25.686
6e3ea044-377b-4f07-bc08-f19604a7911a	284e1c70-ae85-4096-a43d-0a407ad229af	احتاج الى خدمة خدمات تغليف بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في خدمات تغليف. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	0c79abc5-cdde-4d82-8bb1-898d546fee4e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	596	1161	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-13 19:43:41.283	2026-02-18 16:23:25.687
a3c9e498-257d-43f2-806e-9318c77f5504	1fe1195e-328a-4400-8f78-e85a8d9de7c4	ابحث عن خدمة خدمات تغليف بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في خدمات تغليف. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	0c79abc5-cdde-4d82-8bb1-898d546fee4e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	144	1077	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-14 18:47:52.212	2026-02-18 16:23:25.689
c3ebc628-6623-421b-b8ac-7fdb306f40ca	2b1bfbaf-1f04-4124-bd01-68c75f8acd95	ابحث عن خدمة خدمات تخزين بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في خدمات تخزين. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	a42fec55-2abc-4caa-856b-d80e4ac7ab45	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	358	497	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-17 17:34:22.857	2026-02-18 16:23:25.691
a48ca03e-0cab-41b2-8dfc-dc408b1f5740	18c8e3e0-1a95-467d-8a49-a027cee0e5bd	ابحث عن خدمة خدمات تخزين بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في خدمات تخزين. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	a42fec55-2abc-4caa-856b-d80e4ac7ab45	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	256	364	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-16 02:20:19.416	2026-02-18 16:23:25.693
0b4a1a17-9cff-4b20-ba77-07c33033846d	105bb1c7-f9b9-48b8-a031-76d2b52c2eff	ابحث عن خدمة تصميم داخلي بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تصميم داخلي. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	ae16d3d8-b2f0-47e4-843d-d41cc8a4028d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	518	1000	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-18 04:59:54.214	2026-02-18 16:23:25.694
7d8d782b-3974-4b46-ad8f-e35bc06600a3	00a886d6-2514-4dd6-b1bf-96a9fa2cecb6	احتاج الى خدمة تصميم داخلي بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تصميم داخلي. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	ae16d3d8-b2f0-47e4-843d-d41cc8a4028d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	225	613	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-14 11:34:34.042	2026-02-18 16:23:25.696
9a071ffc-33f8-453d-a632-ea05121da819	2849b948-60db-409c-aac1-5dc6cf411051	مطلوب خدمة إدارة صفحات سوشيال بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في إدارة صفحات سوشيال. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	534cc6e7-53c8-48c0-a34d-de3c0ebfeac8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	193	671	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-17 14:58:31.944	2026-02-18 16:23:25.698
5c8863c4-f5eb-40c1-9d59-6da61a734776	068d20f7-d8fe-405f-b31b-989f997b2042	ابحث عن خدمة استشارات قانونية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في استشارات قانونية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	3ea6e974-2ce7-4d5f-b861-dc0b63179f54	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	378	476	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-15 16:24:42.109	2026-02-18 16:23:25.703
231be36e-b0fd-4c94-bd9c-8aafdaef82d0	112e2545-b79b-4375-b02e-ab398816ccd0	مطلوب خدمة استشارات قانونية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في استشارات قانونية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	3ea6e974-2ce7-4d5f-b861-dc0b63179f54	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	415	866	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-17 03:11:23.633	2026-02-18 16:23:25.705
e6352b69-0821-425a-ae77-6946e25854b3	2a474982-5739-47fb-81f2-e1273e800c55	ابحث عن خدمة صياغة عقود بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في صياغة عقود. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	40e2b96d-4cdc-496b-8a2c-24b8c85096e0	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	397	1334	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-13 19:03:26.583	2026-02-18 16:23:25.707
f980bf83-c3db-4433-b091-7d4164b55d8d	2a474982-5739-47fb-81f2-e1273e800c55	احتاج الى خدمة صياغة عقود بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في صياغة عقود. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	40e2b96d-4cdc-496b-8a2c-24b8c85096e0	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	291	966	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-12 13:02:55.414	2026-02-18 16:23:25.71
6e5ec75c-81e4-46d6-8d2a-5e72f7aac1c5	02d635af-3510-4db3-9e4f-b0afad0cd7b3	مطلوب خدمة خدمات محاسبية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في خدمات محاسبية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	45c52652-5754-48c1-b0a7-3d6fdeae7fbd	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	540	1365	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-17 15:48:11.579	2026-02-18 16:23:25.713
5de8e4cd-0a38-483c-85fb-d32cc47e1f48	112e2545-b79b-4375-b02e-ab398816ccd0	ابحث عن خدمة خدمات محاسبية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في خدمات محاسبية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	45c52652-5754-48c1-b0a7-3d6fdeae7fbd	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	153	506	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-17 06:26:55.604	2026-02-18 16:23:25.715
2098a16f-49a7-4dc8-9a6b-bebb795a0433	1dc82269-4fd8-4f16-8810-88d97fbad231	ابحث عن خدمة تصميم جرافيك بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تصميم جرافيك. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	9f883a2f-cae6-461b-91ce-d01c592774c3	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	228	247	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-15 00:42:30.97	2026-02-18 16:23:25.718
b498edc0-81b1-4f07-882d-e8234808bc4c	02d635af-3510-4db3-9e4f-b0afad0cd7b3	احتاج الى خدمة تصميم جرافيك بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تصميم جرافيك. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	9f883a2f-cae6-461b-91ce-d01c592774c3	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	265	569	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-16 22:18:14.827	2026-02-18 16:23:25.72
b0a6a222-4b21-440f-a1ae-b5cd6b78b7a7	068d20f7-d8fe-405f-b31b-989f997b2042	ابحث عن خدمة هوية بصرية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في هوية بصرية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	f684e579-7a25-44dc-a309-265dbfd1f2d2	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	560	1478	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-12 21:53:06.272	2026-02-18 16:23:25.722
ed5b21e6-14b0-4b4b-a983-c106a22c601f	2dae1352-4180-4f5f-8606-7cd01c61b9d8	ابحث عن خدمة هوية بصرية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في هوية بصرية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	f684e579-7a25-44dc-a309-265dbfd1f2d2	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	302	1046	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-11 20:46:13.424	2026-02-18 16:23:25.725
2f4d1011-4507-4ae0-a9c5-f4d45fc3be81	2849b948-60db-409c-aac1-5dc6cf411051	ابحث عن خدمة تصميم ثلاثي الأبعاد بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تصميم ثلاثي الأبعاد. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	e2e4e7b7-f108-4f74-a653-f52e0483fa40	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	335	1172	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-14 04:05:28.731	2026-02-18 16:23:25.728
caf0b303-49e2-482d-882e-935d447d0d5c	284e1c70-ae85-4096-a43d-0a407ad229af	احتاج الى خدمة صيانة مكيفات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في صيانة مكيفات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	3d27de5e-9b46-4986-a1ca-06f0d477a2ba	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	540	1169	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-12 08:14:21.662	2026-02-18 16:23:25.737
fddbbceb-aaf9-40e3-a05b-5b9ebea4000f	31494848-428e-4d55-b324-2eb64c380f32	احتاج الى خدمة عقود صيانة بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في عقود صيانة. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	9be45a5d-3632-4446-b3ac-818c1d4afbad	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	118	966	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-14 09:40:30.982	2026-02-18 16:23:25.741
ecb656ce-f9da-42dd-bc8f-2bfdbe24c6aa	284e1c70-ae85-4096-a43d-0a407ad229af	ابحث عن خدمة عقود صيانة بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في عقود صيانة. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	9be45a5d-3632-4446-b3ac-818c1d4afbad	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	531	1485	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-13 13:46:45.19	2026-02-18 16:23:25.745
654b81e7-2e0d-4e8f-926c-6bab68b061f3	1b804e9c-1a66-4436-b031-5f958678241c	ابحث عن خدمة تفصيل أثاث بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تفصيل أثاث. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	fa0319a9-a593-44fc-8248-8a7eb47b459e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	461	1086	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-12 03:03:19.117	2026-02-18 16:23:25.75
1fb1263f-8cf0-4fa3-82c4-472f8105b3e9	00a886d6-2514-4dd6-b1bf-96a9fa2cecb6	مطلوب خدمة تفصيل أثاث بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تفصيل أثاث. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	fa0319a9-a593-44fc-8248-8a7eb47b459e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	478	1303	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-14 11:46:55.702	2026-02-18 16:23:25.752
7e9d1a5d-f696-4433-8afa-5b1bc1a151cf	2849b948-60db-409c-aac1-5dc6cf411051	ابحث عن خدمة تركيب وصيانة أبواب بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تركيب وصيانة أبواب. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	5fdddb70-8cc9-45bb-9560-72d5fb2a86e0	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	492	956	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-16 19:21:56.116	2026-02-18 16:23:25.756
1d81e657-b8f1-45e9-9e1b-6427ee67fa20	284e1c70-ae85-4096-a43d-0a407ad229af	احتاج الى خدمة تركيب وصيانة أبواب بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تركيب وصيانة أبواب. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	5fdddb70-8cc9-45bb-9560-72d5fb2a86e0	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	271	434	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-13 03:13:28.2	2026-02-18 16:23:25.759
0699263a-1d21-4917-92ee-aa51a80781d2	2a474982-5739-47fb-81f2-e1273e800c55	احتاج الى خدمة خزائن مطبخ بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في خزائن مطبخ. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	995b2165-0444-4801-acca-dc5c3a566f2a	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	200	403	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-15 06:01:56.121	2026-02-18 16:23:25.763
c75f99f6-ac42-49af-a960-f7e65dd5f5a2	2dae1352-4180-4f5f-8606-7cd01c61b9d8	مطلوب خدمة خزائن مطبخ بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في خزائن مطبخ. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	995b2165-0444-4801-acca-dc5c3a566f2a	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	375	1239	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-14 10:11:12.539	2026-02-18 16:23:25.767
8334c8ea-fcb4-480d-958c-4d42f967503d	1fe1195e-328a-4400-8f78-e85a8d9de7c4	ابحث عن خدمة خزائن ملابس بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في خزائن ملابس. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	7f0933d0-c036-49ee-a498-62bb23e051fb	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	474	1447	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-15 14:43:42.817	2026-02-18 16:23:25.771
81467f48-44f0-4abd-944c-adcdda9fe258	284e1c70-ae85-4096-a43d-0a407ad229af	مطلوب خدمة خزائن ملابس بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في خزائن ملابس. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	7f0933d0-c036-49ee-a498-62bb23e051fb	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	415	791	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-13 19:36:37.114	2026-02-18 16:23:25.773
6074305a-09c6-4a5c-9778-8fa61a61db04	00a886d6-2514-4dd6-b1bf-96a9fa2cecb6	مطلوب خدمة باركيه وأرضيات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في باركيه وأرضيات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	a4f932f4-17e0-4e68-9a2c-1c0b2f054756	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	315	1230	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-16 10:00:27.499	2026-02-18 16:23:25.776
a0f84bbd-7e1d-4046-bedd-31ebec2c4e11	15253bbb-7d62-4674-ad27-c66475936580	احتاج الى خدمة مظلات خشبية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في مظلات خشبية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	a15ec8f6-c7e5-40bc-888c-5e6179104677	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	377	1049	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-17 12:39:40.056	2026-02-18 16:23:25.782
e9296768-3469-4670-8e3f-ca4f2cf0fb9b	15253bbb-7d62-4674-ad27-c66475936580	مطلوب خدمة مظلات خشبية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في مظلات خشبية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	a15ec8f6-c7e5-40bc-888c-5e6179104677	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	210	565	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-15 10:23:22.182	2026-02-18 16:23:25.786
8694b334-a132-4746-93db-8c84a8e02194	31494848-428e-4d55-b324-2eb64c380f32	احتاج الى خدمة أثاث مكتبي بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في أثاث مكتبي. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	5fa8962e-80f2-4550-bdfa-fe31d3b7d741	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	204	654	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-15 19:46:17.822	2026-02-18 16:23:25.788
cf5d4d50-46d4-4c2f-a038-1654fa8eb7ee	1abb39df-0929-4386-aff1-8a5ae3668375	مطلوب خدمة أثاث مكتبي بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في أثاث مكتبي. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	5fa8962e-80f2-4550-bdfa-fe31d3b7d741	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	131	959	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-17 00:20:49.205	2026-02-18 16:23:25.791
5ea5a575-1ee6-4c97-bf28-01427ee8bd49	1b804e9c-1a66-4436-b031-5f958678241c	احتاج الى خدمة إصلاح أثاث بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في إصلاح أثاث. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	372a27be-f9b8-4e31-aa38-ca2366223d6d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	545	972	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-14 09:53:42.048	2026-02-18 16:23:25.793
857b77a3-4a83-4efe-9e84-1c6f25a022c4	31494848-428e-4d55-b324-2eb64c380f32	مطلوب خدمة إصلاح أثاث بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في إصلاح أثاث. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	372a27be-f9b8-4e31-aa38-ca2366223d6d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	528	1526	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-17 20:26:04.431	2026-02-18 16:23:25.795
2b33c5e1-9355-43c0-a27d-4e3487225d13	1cec89ac-cdb8-41fb-81ea-2650126f551f	احتاج الى خدمة نقل معدات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في نقل معدات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	61452801-a110-4604-817d-a4374db967c0	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	560	975	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-13 10:34:41.567	2026-02-18 16:23:25.799
30c7b8f4-afc0-459b-a9cf-62a33a828695	1abb39df-0929-4386-aff1-8a5ae3668375	ابحث عن خدمة نقل معدات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في نقل معدات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	61452801-a110-4604-817d-a4374db967c0	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	380	739	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-13 08:51:19.828	2026-02-18 16:23:25.801
7d79015e-a9f5-4dfb-a097-6951260ede94	1963ba9d-85f7-4456-9803-24ff87187b82	مطلوب خدمة توصيل بضائع محلي بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في توصيل بضائع محلي. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	e0ea0aaf-8c5e-448f-97a3-c5188ec89ee9	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	301	401	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-18 00:43:43.324	2026-02-18 16:23:25.804
b4313c7b-51eb-4076-9a79-7db147cd7ca5	2dae1352-4180-4f5f-8606-7cd01c61b9d8	احتاج الى خدمة توصيل بضائع محلي بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في توصيل بضائع محلي. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	e0ea0aaf-8c5e-448f-97a3-c5188ec89ee9	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	472	951	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-15 15:29:51.786	2026-02-18 16:23:25.807
3765da0a-4550-4cf5-8e1b-787231da1600	112e2545-b79b-4375-b02e-ab398816ccd0	ابحث عن خدمة نقل معدات ثقيلة بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في نقل معدات ثقيلة. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	cfaf55d4-d957-4f91-9944-8e9262fa5c58	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	342	675	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-12 00:19:37.449	2026-02-18 16:23:25.809
d08f40d9-bd4c-48eb-84c5-a16ddcbd8743	1b804e9c-1a66-4436-b031-5f958678241c	ابحث عن خدمة نقل معدات ثقيلة بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في نقل معدات ثقيلة. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	cfaf55d4-d957-4f91-9944-8e9262fa5c58	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	326	421	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-17 06:24:29.919	2026-02-18 16:23:25.814
04edb0f3-4767-41dc-aa2b-2d1991e483c5	2a474982-5739-47fb-81f2-e1273e800c55	ابحث عن خدمة دعم فني وتقني بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في دعم فني وتقني. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	145dab2a-0441-446c-978b-42b317a37707	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	390	861	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-15 09:41:36.181	2026-02-18 16:23:25.819
e1292a6d-3466-4972-b774-28c65f11d905	18c8e3e0-1a95-467d-8a49-a027cee0e5bd	احتاج الى خدمة صناعة محتوى بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في صناعة محتوى. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	96e8b578-f00f-46c4-b0bc-9997bf549722	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	253	1192	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-14 13:03:45.403	2026-02-18 16:23:25.822
20b0e61a-4bfe-4a71-88f3-d1761097f591	15253bbb-7d62-4674-ad27-c66475936580	احتاج الى خدمة صناعة محتوى بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في صناعة محتوى. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	96e8b578-f00f-46c4-b0bc-9997bf549722	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	472	1457	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-13 19:49:36.465	2026-02-18 16:23:25.824
04761469-58c0-4ced-9987-0c0c7b04877e	1fe1195e-328a-4400-8f78-e85a8d9de7c4	احتاج الى خدمة استشارات ضريبية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في استشارات ضريبية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	8ad81af4-5eeb-4433-8c16-382b0653f1c2	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	392	722	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-15 01:49:49.711	2026-02-18 16:23:25.825
ca239912-ab69-4f2c-9762-dedb0bff2559	105bb1c7-f9b9-48b8-a031-76d2b52c2eff	احتاج الى خدمة استشارات ضريبية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في استشارات ضريبية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	8ad81af4-5eeb-4433-8c16-382b0653f1c2	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	525	1379	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-12 15:55:19.201	2026-02-18 16:23:25.827
9c0fff8a-bd5a-463d-80c4-60c76d0a8f61	134e670e-7b08-4a59-bc2d-0589d08b6dcd	احتاج الى خدمة تأسيس شركات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تأسيس شركات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	c578b972-ee6e-4efe-b2df-37efe0fcacf8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	233	563	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-18 11:45:58.123	2026-02-18 16:23:25.829
18a77b28-2965-44ba-9d7e-67f54e758bef	1dc82269-4fd8-4f16-8810-88d97fbad231	احتاج الى خدمة تأسيس شركات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تأسيس شركات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	c578b972-ee6e-4efe-b2df-37efe0fcacf8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	458	899	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-15 10:04:57.085	2026-02-18 16:23:25.833
18806526-51c7-40a6-90bb-389d96743fab	1963ba9d-85f7-4456-9803-24ff87187b82	مطلوب خدمة استشارات أعمال بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في استشارات أعمال. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	4e4ff339-844e-4804-982c-c3e7e315be9e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	149	849	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-14 17:13:32.953	2026-02-18 16:23:25.836
6570a606-7ec5-4a4e-842a-4437cef49b56	2a474982-5739-47fb-81f2-e1273e800c55	ابحث عن خدمة استشارات أعمال بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في استشارات أعمال. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	4e4ff339-844e-4804-982c-c3e7e315be9e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	273	827	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-13 22:25:58.182	2026-02-18 16:23:25.838
c17d06e4-083e-4487-a760-b1aa31b2fd0c	1cec89ac-cdb8-41fb-81ea-2650126f551f	ابحث عن خدمة تصميم داخلي بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تصميم داخلي. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	85ecc7e5-742e-4b3a-9d61-40c0e86a59c8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	367	1056	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-16 08:51:02.521	2026-02-18 16:23:25.84
d0f85b53-dacd-4c24-b628-78b53614b946	00a886d6-2514-4dd6-b1bf-96a9fa2cecb6	مطلوب خدمة تصميم داخلي بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تصميم داخلي. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	85ecc7e5-742e-4b3a-9d61-40c0e86a59c8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	245	836	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-12 02:34:57.531	2026-02-18 16:23:25.842
adb2c54a-1392-4179-85ce-5430f45c6869	35afcd35-0119-4670-955a-8bc235d4c360	Cleaning Service Required	We are looking for a professional provider for Cleaning. Please review the project requirements and submit a competitive proposal.	98d60428-77df-4a56-8bca-4025dd191119	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	387	856	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-17 19:55:55.665	2026-02-18 16:23:24.997
d5cac4cd-5eba-4ae9-a8c9-30f480ae50b0	105bb1c7-f9b9-48b8-a031-76d2b52c2eff	ابحث عن خدمة تكييف وتبريد بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تكييف وتبريد. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	a104b06f-1cb5-4e34-8567-e8c136ccf452	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	500	937	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-17 19:17:44.449	2026-02-18 16:23:25.851
67f96bff-d42a-4485-895e-7739c8cd0cf0	1b804e9c-1a66-4436-b031-5f958678241c	مطلوب خدمة تكييف وتبريد بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تكييف وتبريد. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	a104b06f-1cb5-4e34-8567-e8c136ccf452	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	539	1014	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-14 04:51:06.91	2026-02-18 16:23:25.853
f2c4a188-55d6-4cd7-94ee-a124cc443dec	15253bbb-7d62-4674-ad27-c66475936580	احتاج الى خدمة نجارة بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في نجارة. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	9216b9d5-8efb-4d0a-8d35-b5d47386c27f	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	210	1042	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-13 17:41:59.388	2026-02-18 16:23:25.855
5e79ee95-a75f-4a4c-a306-dbc3e510529f	2b1bfbaf-1f04-4124-bd01-68c75f8acd95	ابحث عن خدمة دعم تقني بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في دعم تقني. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	bc71903c-a271-4a56-b90e-f94b041f684c	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	492	1488	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-13 10:26:11.922	2026-02-18 16:23:25.859
4c8885ce-c520-4b82-be0e-035b77addd0b	1dc82269-4fd8-4f16-8810-88d97fbad231	مطلوب خدمة دعم تقني بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في دعم تقني. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	bc71903c-a271-4a56-b90e-f94b041f684c	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	147	763	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-17 03:36:49.245	2026-02-18 16:23:25.862
0bf7734e-ce8f-47fc-8364-e079398f9c8a	18c8e3e0-1a95-467d-8a49-a027cee0e5bd	مطلوب خدمة خدمات رقمية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في خدمات رقمية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	c800df55-740a-4bf4-abcf-9fb8dc54aa85	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	192	922	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-13 11:09:45.457	2026-02-18 16:23:25.865
e4772767-1603-4172-9b04-6dcb5f533fa6	1cec89ac-cdb8-41fb-81ea-2650126f551f	مطلوب خدمة خدمات رقمية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في خدمات رقمية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	c800df55-740a-4bf4-abcf-9fb8dc54aa85	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	293	544	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-15 02:09:41.134	2026-02-18 16:23:25.867
6d5ea500-6631-454b-b99d-2d7016337334	2b1bfbaf-1f04-4124-bd01-68c75f8acd95	احتاج الى خدمة أعمال بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في أعمال. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	4ff97148-cb5b-41af-b3b8-d69d88d126d9	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	436	909	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-14 08:42:47.107	2026-02-18 16:23:25.869
39b981e9-9f1c-405b-9e52-03f9d87c1586	112e2545-b79b-4375-b02e-ab398816ccd0	احتاج الى خدمة أعمال بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في أعمال. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	4ff97148-cb5b-41af-b3b8-d69d88d126d9	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	180	359	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-12 14:22:33.983	2026-02-18 16:23:25.871
1c320bcc-3536-4850-b9bb-b59b65ca6369	1cec89ac-cdb8-41fb-81ea-2650126f551f	احتاج الى خدمة تصميم بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تصميم. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	71cdffe5-1523-4ae3-82c7-d76dc438f90f	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	542	823	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-15 10:02:52.425	2026-02-18 16:23:25.874
b439a243-1e07-4fc0-a16a-89cfa0748274	2849b948-60db-409c-aac1-5dc6cf411051	مطلوب خدمة تصميم بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تصميم. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	71cdffe5-1523-4ae3-82c7-d76dc438f90f	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	517	721	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-11 22:33:37.625	2026-02-18 16:23:25.875
ed80b865-b83f-4e6c-b61f-056781f23933	068d20f7-d8fe-405f-b31b-989f997b2042	ابحث عن خدمة تكييف مركزي بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تكييف مركزي. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	e4b87995-9082-4431-b055-d53c0bea18ab	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	162	1009	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-18 07:38:01.369	2026-02-18 16:23:25.88
ee52bc27-4bb6-4a7b-9164-dda608462dbb	105bb1c7-f9b9-48b8-a031-76d2b52c2eff	ابحث عن خدمة صيانة أنظمة تدفئة بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في صيانة أنظمة تدفئة. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	99d200f3-6346-4394-b99e-f13bfcbf45b4	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	322	386	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-13 01:43:43.129	2026-02-18 16:23:25.882
13ac2ce6-4342-4bad-8ec7-9600365dd0c3	068d20f7-d8fe-405f-b31b-989f997b2042	احتاج الى خدمة صيانة أنظمة تدفئة بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في صيانة أنظمة تدفئة. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	99d200f3-6346-4394-b99e-f13bfcbf45b4	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	206	841	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-12 10:23:22.528	2026-02-18 16:23:25.883
1ee604b9-5297-4bf7-9c45-3953af6329f1	105bb1c7-f9b9-48b8-a031-76d2b52c2eff	ابحث عن خدمة تركيب وتنظيف دكت بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تركيب وتنظيف دكت. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	c51e73dc-ef12-4653-9e28-09fad77b21fc	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	444	631	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-15 13:27:45.143	2026-02-18 16:23:25.886
52ad6d4b-f182-4569-a8f6-569b5f335a46	00a886d6-2514-4dd6-b1bf-96a9fa2cecb6	احتاج الى خدمة تركيب وتنظيف دكت بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تركيب وتنظيف دكت. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	c51e73dc-ef12-4653-9e28-09fad77b21fc	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	261	963	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-16 04:31:24.789	2026-02-18 16:23:25.89
44d42f57-cf2e-4ae8-b75f-55ae8d8f3f08	18c8e3e0-1a95-467d-8a49-a027cee0e5bd	ابحث عن خدمة تركيب ترموستات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تركيب ترموستات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	998ed8b1-59de-4c05-a4f1-318c4475145f	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	424	629	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-15 03:06:20.907	2026-02-18 16:23:25.892
cb3932c1-f14e-411f-b806-50161bef2c7f	1fe1195e-328a-4400-8f78-e85a8d9de7c4	احتاج الى خدمة تركيب ترموستات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تركيب ترموستات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	998ed8b1-59de-4c05-a4f1-318c4475145f	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	268	1083	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-17 21:29:35.7	2026-02-18 16:23:25.894
afb30c2a-92db-4a4f-9686-555ef239df70	2a474982-5739-47fb-81f2-e1273e800c55	مطلوب خدمة تعبئة غاز بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تعبئة غاز. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	a2ff47e5-f2ed-41e1-867e-0345dc56eb6b	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	476	1183	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-13 21:55:49.508	2026-02-18 16:23:25.896
6cbc79be-e920-4b7d-92de-623a267b0420	284e1c70-ae85-4096-a43d-0a407ad229af	مطلوب خدمة تعبئة غاز بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تعبئة غاز. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	a2ff47e5-f2ed-41e1-867e-0345dc56eb6b	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	397	1272	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-16 03:33:03.603	2026-02-18 16:23:25.898
78273854-2aad-4701-a9c8-c5d47e106a9e	2849b948-60db-409c-aac1-5dc6cf411051	مطلوب خدمة فحص أنظمة التكييف بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في فحص أنظمة التكييف. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	a9a06bd3-95b8-4356-8ce3-c652f61f660b	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	337	1207	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-14 19:56:33.874	2026-02-18 16:23:25.9
09ac1067-aef4-49e3-a967-8982ce003947	18c8e3e0-1a95-467d-8a49-a027cee0e5bd	مطلوب خدمة تمديد شبكات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تمديد شبكات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	094e4723-4046-4698-a5e2-fe3cc59c3245	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	353	539	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-15 07:44:34.156	2026-02-18 16:23:26.613
ad40a14d-5588-4ffe-92f5-14347711e144	1dc82269-4fd8-4f16-8810-88d97fbad231	مطلوب خدمة تركيب سيرفرات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تركيب سيرفرات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	86a76eb4-918a-4476-ad5c-b1f84fe9ec4a	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	561	1045	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-14 16:15:23.547	2026-02-18 16:23:26.659
0226978e-230a-43ce-9d87-9321f2b96fdc	2dae1352-4180-4f5f-8606-7cd01c61b9d8	احتاج الى خدمة تركيب سيرفرات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تركيب سيرفرات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	86a76eb4-918a-4476-ad5c-b1f84fe9ec4a	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	401	632	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-18 05:06:17.298	2026-02-18 16:23:26.661
11776330-268b-46e9-b8ec-68ecdd271460	18c8e3e0-1a95-467d-8a49-a027cee0e5bd	مطلوب خدمة صيانة سيرفرات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في صيانة سيرفرات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	0908a7a2-ca8f-4190-8dee-a43331dd59c8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	299	849	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-14 00:43:51.453	2026-02-18 16:23:26.665
61c5ee29-186a-4d17-b6ec-2efbb9bf831d	105bb1c7-f9b9-48b8-a031-76d2b52c2eff	ابحث عن خدمة صيانة سيرفرات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في صيانة سيرفرات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	0908a7a2-ca8f-4190-8dee-a43331dd59c8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	412	698	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-14 09:25:58.876	2026-02-18 16:23:26.669
b8d59aec-447a-406c-ade3-8d3b67c7e7b8	1dc82269-4fd8-4f16-8810-88d97fbad231	مطلوب خدمة صيانة أجهزة كمبيوتر بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في صيانة أجهزة كمبيوتر. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	1b0eb73a-0e17-4dfc-8299-1376df9f40e7	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	519	1289	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-12 10:36:23.097	2026-02-18 16:23:26.671
437fe1a4-188f-42e5-a4c8-17869feb742b	2849b948-60db-409c-aac1-5dc6cf411051	احتاج الى خدمة صيانة أجهزة كمبيوتر بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في صيانة أجهزة كمبيوتر. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	1b0eb73a-0e17-4dfc-8299-1376df9f40e7	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	569	669	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-18 04:28:56.989	2026-02-18 16:23:26.673
e387bbb1-021f-426c-bd7f-07c305dfe69e	00a886d6-2514-4dd6-b1bf-96a9fa2cecb6	احتاج الى خدمة تعريف طابعات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تعريف طابعات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	6da456be-fbf2-4421-8140-0fd4efcc9edc	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	166	705	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-12 17:00:03.235	2026-02-18 16:23:26.678
57fbf2f0-db8c-45a6-9dcf-79181cc95a48	134e670e-7b08-4a59-bc2d-0589d08b6dcd	مطلوب خدمة ربط كاميرات بالشبكة بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في ربط كاميرات بالشبكة. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	7245e6a5-a8fe-4f53-85ea-86ead7b76474	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	460	617	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-17 18:07:52.54	2026-02-18 16:23:26.684
09fe3cf7-9495-451d-bf50-da7891701362	1cec89ac-cdb8-41fb-81ea-2650126f551f	احتاج الى خدمة ربط كاميرات بالشبكة بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في ربط كاميرات بالشبكة. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	7245e6a5-a8fe-4f53-85ea-86ead7b76474	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	299	600	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-15 16:17:21.512	2026-02-18 16:23:26.686
d16df73a-8b99-490c-8955-b1081958a7e1	31494848-428e-4d55-b324-2eb64c380f32	ابحث عن خدمة عقود صيانة دورية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في عقود صيانة دورية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	6c3eb205-4e70-41d4-8bee-2c8af2adadd1	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	351	937	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-18 00:49:52.124	2026-02-18 16:23:26.689
e3ae0812-6a7c-44da-bbd8-515a6d422461	1b804e9c-1a66-4436-b031-5f958678241c	احتاج الى خدمة عقود صيانة دورية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في عقود صيانة دورية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	6c3eb205-4e70-41d4-8bee-2c8af2adadd1	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	237	279	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-17 20:08:07.348	2026-02-18 16:23:26.691
ada3c525-f063-4b6d-b758-6f573f138d74	1dc82269-4fd8-4f16-8810-88d97fbad231	ابحث عن خدمة استعادة بيانات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في استعادة بيانات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	647011ed-6560-47ee-9091-7b129a07c9ae	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	264	921	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-18 11:30:08.922	2026-02-18 16:23:26.696
96ed0d6b-d2fe-4be6-89ce-8d864339266b	284e1c70-ae85-4096-a43d-0a407ad229af	ابحث عن خدمة تصميم وتطوير مواقع بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تصميم وتطوير مواقع. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	a58e3f12-ee73-4839-ada6-973b6de1db94	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	501	1416	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-13 21:33:51.247	2026-02-18 16:23:26.7
5feaeab5-9548-4015-9e95-6b902d44456f	284e1c70-ae85-4096-a43d-0a407ad229af	احتاج الى خدمة تصميم وتطوير مواقع بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تصميم وتطوير مواقع. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	a58e3f12-ee73-4839-ada6-973b6de1db94	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	510	1490	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-18 03:45:30.419	2026-02-18 16:23:26.702
34af84e8-3812-4f50-8341-9fdc10fa76c9	1963ba9d-85f7-4456-9803-24ff87187b82	ابحث عن خدمة متاجر إلكترونية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في متاجر إلكترونية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	b2a5e338-73ff-42a6-8dc3-b80d4e6fc5fc	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	396	1117	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-17 11:52:45.908	2026-02-18 16:23:26.705
988ddc82-8be2-4b7e-b8de-0f5efcbeda09	2a474982-5739-47fb-81f2-e1273e800c55	مطلوب خدمة متاجر إلكترونية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في متاجر إلكترونية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	b2a5e338-73ff-42a6-8dc3-b80d4e6fc5fc	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	262	832	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-13 11:14:58.572	2026-02-18 16:23:26.707
65cfeafa-d294-4cfc-b382-ac9ca7cc8790	1abb39df-0929-4386-aff1-8a5ae3668375	ابحث عن خدمة تطبيقات موبايل بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تطبيقات موبايل. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	9aa93818-7b3e-4196-b853-03648df182fb	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	399	1304	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-16 07:20:45.849	2026-02-18 16:23:26.709
846446b9-bdc9-4d39-98dc-e3b01f9dbd2c	1abb39df-0929-4386-aff1-8a5ae3668375	احتاج الى خدمة تطبيقات موبايل بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تطبيقات موبايل. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	9aa93818-7b3e-4196-b853-03648df182fb	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	182	788	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-12 18:47:50.83	2026-02-18 16:23:26.711
10f2fdce-dbff-4ddc-9abd-26f5f6c6a548	068d20f7-d8fe-405f-b31b-989f997b2042	مطلوب خدمة تصميم واجهات المستخدم بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تصميم واجهات المستخدم. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	50187776-a7e9-41bb-9d8f-8fcc73bf7eb0	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	412	1373	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-16 08:12:45.454	2026-02-18 16:23:26.715
e432cf15-16a5-4442-bfb9-81cf923dfe8c	1b804e9c-1a66-4436-b031-5f958678241c	مطلوب خدمة تسويق رقمي بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تسويق رقمي. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	d2c3038f-cc14-4e68-804e-03c1373cf56b	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	588	1454	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-18 10:25:28.2	2026-02-18 16:23:26.716
18164385-ec04-45b9-9f81-9809f3bd3c38	2a474982-5739-47fb-81f2-e1273e800c55	احتاج الى خدمة تسويق رقمي بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تسويق رقمي. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	d2c3038f-cc14-4e68-804e-03c1373cf56b	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	445	1241	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-14 08:35:13.686	2026-02-18 16:23:26.72
aec880ae-8fbe-48f6-9848-3b8f907a6315	1cec89ac-cdb8-41fb-81ea-2650126f551f	ابحث عن خدمة تحسين محركات البحث بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تحسين محركات البحث. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	ae53a59e-003d-49e7-9e87-697ee990cc54	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	208	319	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-13 02:05:43.127	2026-02-18 16:23:26.723
e3ad63b7-d3d8-4231-86bd-a3096d79366b	2849b948-60db-409c-aac1-5dc6cf411051	مطلوب خدمة إدارة حملات إعلانية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في إدارة حملات إعلانية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	f4f9931a-f98b-4d38-bb26-5cad9c963e15	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	112	1008	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-14 16:58:22.336	2026-02-18 16:23:26.727
24781cc7-abc3-46f8-91c3-b5b0b21f218f	1b804e9c-1a66-4436-b031-5f958678241c	ابحث عن خدمة إدارة حملات إعلانية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في إدارة حملات إعلانية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	f4f9931a-f98b-4d38-bb26-5cad9c963e15	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	534	1482	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-14 12:36:21.774	2026-02-18 16:23:26.731
8be03845-aad1-4a33-8072-18f24212b201	068d20f7-d8fe-405f-b31b-989f997b2042	احتاج الى خدمة توظيف وموارد بشرية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في توظيف وموارد بشرية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	03d91ca1-5212-4f7b-83a1-42400912048c	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	428	491	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-12 04:14:28.384	2026-02-18 16:23:26.734
3e74e3e0-430c-4db4-a74b-3c0265a661db	2849b948-60db-409c-aac1-5dc6cf411051	ابحث عن خدمة توظيف وموارد بشرية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في توظيف وموارد بشرية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	03d91ca1-5212-4f7b-83a1-42400912048c	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	281	565	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-14 01:31:28.44	2026-02-18 16:23:26.736
f35de05b-4586-4675-99b4-9e3442d68b8b	1abb39df-0929-4386-aff1-8a5ae3668375	احتاج الى خدمة تجهيز مكاتب بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تجهيز مكاتب. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	2f9602ea-0a83-4153-ab0b-3bfa296db823	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	244	606	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-16 04:22:57.447	2026-02-18 16:23:26.739
ad36061f-2765-4eb6-9810-1f9231a522a9	112e2545-b79b-4375-b02e-ab398816ccd0	ابحث عن خدمة تجهيز مكاتب بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تجهيز مكاتب. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	2f9602ea-0a83-4153-ab0b-3bfa296db823	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	124	888	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-12 21:16:56.497	2026-02-18 16:23:26.741
0f4d2de6-4d95-442e-a044-474c33cc03b5	1b804e9c-1a66-4436-b031-5f958678241c	مطلوب خدمة خدمات تعقيب بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في خدمات تعقيب. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	a32a9674-3e61-4eae-9263-8a792adf53eb	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	113	541	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-17 18:33:57.901	2026-02-18 16:23:26.743
e48164f7-8c53-4936-bc7f-380250cf01db	2dae1352-4180-4f5f-8606-7cd01c61b9d8	مطلوب خدمة خدمات تعقيب بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في خدمات تعقيب. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	a32a9674-3e61-4eae-9263-8a792adf53eb	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	326	988	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-15 15:03:44.48	2026-02-18 16:23:26.747
1c2c1184-bc13-43e2-b705-e14b252bfdb6	15253bbb-7d62-4674-ad27-c66475936580	ابحث عن خدمة ترجمة معتمدة بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في ترجمة معتمدة. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	28584798-4de1-496c-9fd0-b88f7ad41a93	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	141	696	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-15 22:38:04.025	2026-02-18 16:23:26.75
0b638c3a-9505-497f-b3dc-4a79a08ad6a0	134e670e-7b08-4a59-bc2d-0589d08b6dcd	مطلوب خدمة ترجمة معتمدة بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في ترجمة معتمدة. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	28584798-4de1-496c-9fd0-b88f7ad41a93	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	510	1323	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-14 12:19:16.756	2026-02-18 16:23:26.752
4c2522ce-1637-45e5-adb7-cbcd1decb831	31494848-428e-4d55-b324-2eb64c380f32	ابحث عن خدمة تصميم شعارات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تصميم شعارات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	06dee9e7-8564-4afe-9544-715d48872bbb	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	548	809	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-13 21:11:22.642	2026-02-18 16:23:26.753
328c4941-e861-41de-9715-d3698fb4a9b9	8083129e-0ea5-4508-b7d5-cde138d9dadb	Technical Blog Writing	Looking for a writer with tech background to write 4 detailed articles about Cloud Computing and AI.	28584798-4de1-496c-9fd0-b88f7ad41a93	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	200	400	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	58	2026-02-07 08:51:34.587	2026-02-18 16:23:24.68
bc50038d-b56c-4916-83ef-dd7d8031d791	068d20f7-d8fe-405f-b31b-989f997b2042	Promotional Video Editing	Need a professional video editor to create a 60-second promo video for our new product. Raw footage provided.	80ba105a-f0fb-4361-841c-cee2fe88003d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	300	800	USD	\N	URGENT	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	288	2026-02-14 23:19:34.493	2026-02-18 16:23:24.743
596eea6e-77a1-4b4c-bc90-8acc1cee6e12	105bb1c7-f9b9-48b8-a031-76d2b52c2eff	Custom E-commerce Website Development	Looking for a full-stack developer to build a scalable e-commerce platform using Next.js and Node.js. Must include payment integration.	a58e3f12-ee73-4839-ada6-973b6de1db94	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	2000	5000	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	15	2026-02-08 11:37:49.449	2026-02-18 16:23:24.777
f05d73a7-ef37-48ff-bf12-a1d79f7cdb26	284e1c70-ae85-4096-a43d-0a407ad229af	Brand Identity Design	Looking for a creative designer to build a complete brand identity including logo, color palette, and business cards.	ae16d3d8-b2f0-47e4-843d-d41cc8a4028d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	500	1500	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	157	2026-02-12 08:50:32.086	2026-02-18 16:23:24.799
050277e0-cdb9-4780-8d51-edf287533168	8083129e-0ea5-4508-b7d5-cde138d9dadb	Brand Identity Design	Looking for a creative designer to build a complete brand identity including logo, color palette, and business cards.	ae16d3d8-b2f0-47e4-843d-d41cc8a4028d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	500	1500	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	218	2026-01-29 15:56:41.163	2026-02-18 16:23:24.821
e154f791-5cc7-4bf5-bc8f-dcab6c25a784	bd0313b9-45a5-4ec5-84f0-bb0f8b98c7ab	Mobile App Development for Food Delivery	Need a native iOS and Android app for a new food delivery service. Features include GPS tracking, user profiles, and order management.	9aa93818-7b3e-4196-b853-03648df182fb	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	3000	8000	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	231	2026-02-03 23:23:55.243	2026-02-18 16:23:24.836
0726339e-d1a5-4dd7-acdd-df50da03d03e	dec3a0ef-1e8a-4363-bde8-73765431b2b4	SEO & Content Marketing Strategy	We need an SEO expert to improve our Google ranking and create a 3-month content calendar.	627232ef-ea4d-4ebc-8f84-9554e9f511e8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	800	2000	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	286	2026-02-02 09:17:21.442	2026-02-18 16:23:24.868
d7e9dc39-649f-40a1-9774-cbe03cb9215a	d20125d0-2ced-46c1-893f-52e813af1c53	Custom E-commerce Website Development	Looking for a full-stack developer to build a scalable e-commerce platform using Next.js and Node.js. Must include payment integration.	a58e3f12-ee73-4839-ada6-973b6de1db94	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	2000	5000	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	264	2026-02-14 13:53:22.633	2026-02-18 16:23:24.873
a9528b5e-fa56-4dfa-8a95-b3234a278b77	e37dbeda-0d5f-4a04-a0df-2fd87726258c	SEO & Content Marketing Strategy	We need an SEO expert to improve our Google ranking and create a 3-month content calendar.	627232ef-ea4d-4ebc-8f84-9554e9f511e8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	800	2000	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	418	2026-01-24 11:16:03.94	2026-02-18 16:23:24.915
3d7f02de-6402-4637-a848-be3e21dffc11	068d20f7-d8fe-405f-b31b-989f997b2042	Promotional Video Editing	Need a professional video editor to create a 60-second promo video for our new product. Raw footage provided.	80ba105a-f0fb-4361-841c-cee2fe88003d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	300	800	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	11	2026-01-26 09:14:09.934	2026-02-18 16:23:24.931
2dc95c74-797c-4880-a1ec-e5a407883d54	2a474982-5739-47fb-81f2-e1273e800c55	Plumbing Service Required	We are looking for a professional provider for Plumbing. Please review the project requirements and submit a competitive proposal.	98e85028-eaff-4c4c-a5ae-ccbe1c88e837	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	314	1363	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-13 04:38:58.431	2026-02-18 16:23:24.957
dba3cfd7-30a5-494d-98e2-f7fe1b933418	a130bf73-f351-4a22-a24d-0f9e9753cb71	SEO & Content Marketing Strategy	We need an SEO expert to improve our Google ranking and create a 3-month content calendar.	627232ef-ea4d-4ebc-8f84-9554e9f511e8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	800	2000	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	465	2026-02-01 07:54:31.504	2026-02-18 16:23:24.971
45604bf4-bcc4-456c-96a5-92f7b8d97037	112e2545-b79b-4375-b02e-ab398816ccd0	ابحث عن خدمة تصميم معماري بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تصميم معماري. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	0c401f45-8f32-4a40-81c7-c12a0063e6f3	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	530	1150	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-12 08:54:18.192	2026-02-18 16:23:26.76
f6c4013b-6014-4d2d-9542-ca8574948b23	105bb1c7-f9b9-48b8-a031-76d2b52c2eff	احتاج الى خدمة إنتاج فيديو بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في إنتاج فيديو. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	80ba105a-f0fb-4361-841c-cee2fe88003d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	442	647	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-15 07:58:16.565	2026-02-18 16:23:26.763
176e39d9-44c2-40f2-acdc-4d0b8fb631c3	1fe1195e-328a-4400-8f78-e85a8d9de7c4	مطلوب خدمة إنتاج فيديو بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في إنتاج فيديو. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	80ba105a-f0fb-4361-841c-cee2fe88003d	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	441	894	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-18 04:47:08.669	2026-02-18 16:23:26.766
824c4427-839e-4faf-b917-8b8ad113b955	8083129e-0ea5-4508-b7d5-cde138d9dadb	Moving Service Required	We are looking for a professional provider for Moving. Please review the project requirements and submit a competitive proposal.	d69b3ed6-faf5-4746-ba0f-eb57708676aa	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	226	1077	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-15 17:05:04.453	2026-02-18 16:23:24.999
b7b96988-eb92-495f-ba36-cda52dfb5032	068d20f7-d8fe-405f-b31b-989f997b2042	AC Installation Service Required	We are looking for a professional provider for AC Installation. Please review the project requirements and submit a competitive proposal.	c5168990-ce7e-4c39-b9ac-8fbbe3bdefb0	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	131	1004	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-09 09:48:12.332	2026-02-18 16:23:25.048
17c99833-f97e-4958-bc65-c5022abf774a	366db2af-9cf4-45d6-b0b7-896f68acd563	Electrical Wiring Service Required	We are looking for a professional provider for Electrical Wiring. Please review the project requirements and submit a competitive proposal.	9ac120a7-3f97-47fd-b5ee-619b7711dcf4	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	135	762	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-09 12:28:22.426	2026-02-18 16:23:25.054
880bdaa7-4274-43b3-bbdd-bc5824ef3ae8	35afcd35-0119-4670-955a-8bc235d4c360	Leak Detection & Repair Service Required	We are looking for a professional provider for Leak Detection & Repair. Please review the project requirements and submit a competitive proposal.	b52de601-ed5f-4be7-b531-55e4573892f1	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	590	721	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-13 19:03:44.518	2026-02-18 16:23:25.096
b9943c57-c6ab-4377-9ae9-08a86eec0bd6	36a2106b-e2be-4917-bdb4-abd8e97d8917	Pipe Installation Service Required	We are looking for a professional provider for Pipe Installation. Please review the project requirements and submit a competitive proposal.	6805a74f-f7f9-419c-858f-49b99247e35b	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	489	1423	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-16 20:00:33.422	2026-02-18 16:23:25.105
9e3a182c-6b8b-425a-86cf-68ac0ace9f50	5cfbcdd0-0b36-4921-a3c2-fa504ca8a20d	Photography Service Required	We are looking for a professional provider for Photography. Please review the project requirements and submit a competitive proposal.	deb10409-fb05-4a07-a0f4-dda54988cd52	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	182	1717	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-08 18:22:04.768	2026-02-18 16:23:25.134
35b8affb-3169-47f6-92ae-1e2f2364923b	5cfbcdd0-0b36-4921-a3c2-fa504ca8a20d	Water Tank Install Service Required	We are looking for a professional provider for Water Tank Install. Please review the project requirements and submit a competitive proposal.	a536318f-3dd6-4a64-ab44-cd425b104b2e	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	267	839	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-18 05:23:22.078	2026-02-18 16:23:25.144
06f0aeef-c799-41c5-9cdc-f7f4cd479166	6a4d8b84-efd3-44fd-82bc-ee188ec1776d	Flooring Installation Service Required	We are looking for a professional provider for Flooring Installation. Please review the project requirements and submit a competitive proposal.	2e57b799-12e9-40aa-9519-c462f5d458ba	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	333	1471	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-17 02:27:48.695	2026-02-18 16:23:25.17
95526207-2883-4352-9dbb-36c929e1690d	9102078e-ab50-4df9-a7ec-65c2464a03d8	Concrete & Masonry Service Required	We are looking for a professional provider for Concrete & Masonry. Please review the project requirements and submit a competitive proposal.	5794040d-4834-4d81-a7c3-99d2f4d9383b	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	334	2095	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-10 08:36:17.976	2026-02-18 16:23:25.182
e83d9bdb-864f-4ab9-a0a5-7e7635538875	63a0f3bf-e2fe-4353-88a1-8f6c12cb74c9	Office Cleaning Service Required	We are looking for a professional provider for Office Cleaning. Please review the project requirements and submit a competitive proposal.	fcd17d77-74e4-4cec-83b1-12e99b00c62f	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	442	1421	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-11 14:27:27.983	2026-02-18 16:23:25.195
a9929ad5-f0c5-4830-a3d6-8035cb7a23a5	2dae1352-4180-4f5f-8606-7cd01c61b9d8	Sofa Cleaning Service Required	We are looking for a professional provider for Sofa Cleaning. Please review the project requirements and submit a competitive proposal.	be163dd8-9324-47c1-b07a-3d727382acd4	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	209	1776	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-18 03:28:55.189	2026-02-18 16:23:25.203
fa43b43c-0ac7-44f4-8bae-56819c1f5e48	6bfe5d3c-4f60-44d0-aa2d-8ed9d0f57667	Office Moving Service Required	We are looking for a professional provider for Office Moving. Please review the project requirements and submit a competitive proposal.	0cfccd84-7b2e-460a-9075-74f3d8dc4586	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	541	1399	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-09 07:21:32.877	2026-02-18 16:23:25.223
925dc0aa-ff3b-437e-8c09-5c1672fb564e	90a57a13-7f68-46a3-92ff-d9417f02e2d9	Storage Services Service Required	We are looking for a professional provider for Storage Services. Please review the project requirements and submit a competitive proposal.	a42fec55-2abc-4caa-856b-d80e4ac7ab45	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	239	2080	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-12 14:34:44.886	2026-02-18 16:23:25.231
92175314-8df9-452c-9e60-652c3d60e72d	36a2106b-e2be-4917-bdb4-abd8e97d8917	Branding & Identity Service Required	We are looking for a professional provider for Branding & Identity. Please review the project requirements and submit a competitive proposal.	f684e579-7a25-44dc-a309-265dbfd1f2d2	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	236	868	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-08 22:41:42.318	2026-02-18 16:23:25.256
78bd991f-a90e-4bc3-9b4b-fdf4842ce75e	31494848-428e-4d55-b324-2eb64c380f32	AC Maintenance Service Required	We are looking for a professional provider for AC Maintenance. Please review the project requirements and submit a competitive proposal.	9be45a5d-3632-4446-b3ac-818c1d4afbad	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	282	1162	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-12 10:07:22.656	2026-02-18 16:23:25.265
e6738a36-a7ae-401f-bd42-ebe91c9d6c9d	7f65f52e-949f-493b-9ebf-4af5e98b832b	Pergolas & Outdoor Service Required	We are looking for a professional provider for Pergolas & Outdoor. Please review the project requirements and submit a competitive proposal.	a15ec8f6-c7e5-40bc-888c-5e6179104677	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	202	1639	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-09 09:32:20.212	2026-02-18 16:23:25.288
d4475f8b-d769-4ebd-9a25-59520d775ead	068d20f7-d8fe-405f-b31b-989f997b2042	Equipment Transport Service Required	We are looking for a professional provider for Equipment Transport. Please review the project requirements and submit a competitive proposal.	61452801-a110-4604-817d-a4374db967c0	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	453	1983	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-16 09:31:41.143	2026-02-18 16:23:25.301
94d0a6d2-9a25-49e7-a45b-b16e58596cb6	2a474982-5739-47fb-81f2-e1273e800c55	Tax Consultation Service Required	We are looking for a professional provider for Tax Consultation. Please review the project requirements and submit a competitive proposal.	8ad81af4-5eeb-4433-8c16-382b0653f1c2	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	394	1426	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-14 21:13:42.339	2026-02-18 16:23:25.326
a2c9c222-804e-4c28-966a-6e0d865e7ff0	2b1bfbaf-1f04-4124-bd01-68c75f8acd95	AC & HVAC Service Required	We are looking for a professional provider for AC & HVAC. Please review the project requirements and submit a competitive proposal.	a104b06f-1cb5-4e34-8567-e8c136ccf452	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	385	1079	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-09 23:05:18.305	2026-02-18 16:23:25.341
b3273a29-6429-4659-b21e-a41118ff00ac	00a886d6-2514-4dd6-b1bf-96a9fa2cecb6	Design Service Required	We are looking for a professional provider for Design. Please review the project requirements and submit a competitive proposal.	71cdffe5-1523-4ae3-82c7-d76dc438f90f	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	15820e35-2099-46b7-aae9-d03b92f5ba98	\N	\N	561	2012	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-09 12:21:10.567	2026-02-18 16:23:25.358
e9eefdce-3035-4863-96ff-b1a8cdefe591	1cec89ac-cdb8-41fb-81ea-2650126f551f	Duct Install & Cleaning Service Required	We are looking for a professional provider for Duct Install & Cleaning. Please review the project requirements and submit a competitive proposal.	c51e73dc-ef12-4653-9e28-09fad77b21fc	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	258	1861	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-13 06:48:50.09	2026-02-18 16:23:25.368
e9d1461d-e32c-4c10-b8bf-a3e5c46ad4fb	2dae1352-4180-4f5f-8606-7cd01c61b9d8	Server Maintenance Service Required	We are looking for a professional provider for Server Maintenance. Please review the project requirements and submit a competitive proposal.	0908a7a2-ca8f-4190-8dee-a43331dd59c8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	268	1264	USD	\N	HIGH	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-13 18:14:07.771	2026-02-18 16:23:25.391
35111b81-642b-4585-a11c-97419d635150	3da19a13-09aa-4c8c-a338-a50a373a1351	CCTV Integration Service Required	We are looking for a professional provider for CCTV Integration. Please review the project requirements and submit a competitive proposal.	7245e6a5-a8fe-4f53-85ea-86ead7b76474	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	496	1802	USD	\N	MEDIUM	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-11 12:27:10.969	2026-02-18 16:23:25.404
a1bf0337-ab4b-4838-81df-5ff613afc0ab	5a529f50-7761-4049-a023-1b9120b244d7	SEO Services Service Required	We are looking for a professional provider for SEO Services. Please review the project requirements and submit a competitive proposal.	ae53a59e-003d-49e7-9e87-697ee990cc54	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	442	1672	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-14 22:59:34.974	2026-02-18 16:23:25.426
3e5001c8-8b24-4131-a28a-79dcf6d4debf	112e2545-b79b-4375-b02e-ab398816ccd0	Logo Design Service Required	We are looking for a professional provider for Logo Design. Please review the project requirements and submit a competitive proposal.	06dee9e7-8564-4afe-9544-715d48872bbb	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	243	1673	USD	\N	LOW	PUBLIC	\N	\N	{lang:en}	f	f	ACTIVE	t	0	2026-02-12 20:41:21.055	2026-02-18 16:23:25.444
e5397ddd-6427-4489-9dea-7fd8910b740a	2849b948-60db-409c-aac1-5dc6cf411051	احتاج الى خدمة تركيب مولدات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تركيب مولدات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	a0b0eaea-a4e9-4ed0-add4-8273a72630ee	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	449	1154	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-13 13:36:17.396	2026-02-18 16:23:25.46
824eb3c5-2d3e-4ee1-aaaf-e02b47515dbb	284e1c70-ae85-4096-a43d-0a407ad229af	احتاج الى خدمة التعليم والتدريب بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في التعليم والتدريب. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	5b49ca23-0797-411a-a41f-232b402d02fe	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	125	238	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-15 18:51:30.804	2026-02-18 16:23:25.479
d8ff9dbf-7367-4435-98e6-9cc65d5647a1	31494848-428e-4d55-b324-2eb64c380f32	مطلوب خدمة كهرباء بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في كهرباء. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	c5e2b66e-b100-41d9-bba8-e110b2abab71	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	406	693	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-16 07:36:01.472	2026-02-18 16:23:25.485
81ca237f-4a5c-4704-845e-3cacafdd396c	068d20f7-d8fe-405f-b31b-989f997b2042	مطلوب خدمة كهرباء بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في كهرباء. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	c5e2b66e-b100-41d9-bba8-e110b2abab71	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	596	1380	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-17 09:49:35.862	2026-02-18 16:23:25.487
5ec876ea-eb3d-4bc4-bd9a-6aaf4e17f3cb	112e2545-b79b-4375-b02e-ab398816ccd0	مطلوب خدمة تمديدات كهربائية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تمديدات كهربائية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	9ac120a7-3f97-47fd-b5ee-619b7711dcf4	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	151	947	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-18 06:55:34.886	2026-02-18 16:23:25.511
e0b221fc-2bd3-437e-99dc-b1b6ae70fd4e	31494848-428e-4d55-b324-2eb64c380f32	ابحث عن خدمة صيانة طاقة شمسية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في صيانة طاقة شمسية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	0def337f-dd79-4734-9227-80c91e4a2bf9	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	466	679	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-11 16:32:02.238	2026-02-18 16:23:25.531
6e5d102e-1bc9-49e3-ac15-4dbb70a9488f	2b1bfbaf-1f04-4124-bd01-68c75f8acd95	احتاج الى خدمة أنظمة طاقة احتياطية بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في أنظمة طاقة احتياطية. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	c79261af-78c0-4b45-97b6-d918a3b015c0	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	194	944	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-18 00:35:30.594	2026-02-18 16:23:25.54
cfc01bd1-ebe3-43d6-87d7-ccda0a10a79b	02d635af-3510-4db3-9e4f-b0afad0cd7b3	مطلوب خدمة سباكة حمامات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في سباكة حمامات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	bd693184-a710-441e-aa8b-d7c15901bac9	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	193	1006	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-14 03:36:56.591	2026-02-18 16:23:25.565
44e4bf64-fe92-4f4f-aad4-3ac92a2e01d9	105bb1c7-f9b9-48b8-a031-76d2b52c2eff	ابحث عن خدمة سباكة مطابخ بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في سباكة مطابخ. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	e9264c4c-cd5f-4c68-acbd-e99f48182171	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	afdc544d-b2de-49df-948b-91ca4eebf02e	\N	\N	131	564	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-17 00:38:55.699	2026-02-18 16:23:25.569
f65d0468-9fdf-46d3-8c76-830920ab7a13	1dc82269-4fd8-4f16-8810-88d97fbad231	ابحث عن خدمة تركيب مضخات مياه بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تركيب مضخات مياه. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	dc97169e-d2c7-4af6-93a5-5010ab9d86f0	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	217	260	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-16 13:56:06.867	2026-02-18 16:23:25.595
37f35d4a-b260-477c-91b2-2179734b9181	2dae1352-4180-4f5f-8606-7cd01c61b9d8	ابحث عن خدمة مقاول عام بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في مقاول عام. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	3905c75e-18d0-4ef1-b58a-d3e1a7ce5463	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	488	540	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-17 04:03:25.744	2026-02-18 16:23:25.6
fc362a80-c0a1-4ef9-b416-733c3dfd3a62	18c8e3e0-1a95-467d-8a49-a027cee0e5bd	احتاج الى خدمة دهانات وديكور بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في دهانات وديكور. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	e9fcae5a-1a61-4f96-adca-e1bee96da919	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	7c135b2a-f162-49ba-85dd-d39a6c98d6eb	\N	\N	372	991	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-14 00:48:59.479	2026-02-18 16:23:25.625
997fab20-ce05-4340-96ce-ef04443f5092	2a474982-5739-47fb-81f2-e1273e800c55	ابحث عن خدمة تنظيف مكاتب بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تنظيف مكاتب. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	fcd17d77-74e4-4cec-83b1-12e99b00c62f	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	400	972	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-12 02:49:51.091	2026-02-18 16:23:25.65
5fc4f20c-3e1e-4e7e-8684-22ac0b322529	284e1c70-ae85-4096-a43d-0a407ad229af	مطلوب خدمة تنظيف كنب ومفروشات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تنظيف كنب ومفروشات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	be163dd8-9324-47c1-b07a-3d727382acd4	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	154	559	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-14 10:59:01.971	2026-02-18 16:23:25.662
c45cf474-e7b9-43e2-9aab-a15a52707861	2a474982-5739-47fb-81f2-e1273e800c55	مطلوب خدمة نقل أثاث بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في نقل أثاث. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	24ca6098-169b-46bb-993d-a130327b16f9	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	105	759	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-15 06:29:06.291	2026-02-18 16:23:25.676
8bd316ca-b60a-48ef-bd02-bc52bea99d68	2dae1352-4180-4f5f-8606-7cd01c61b9d8	ابحث عن خدمة إدارة صفحات سوشيال بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في إدارة صفحات سوشيال. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	534cc6e7-53c8-48c0-a34d-de3c0ebfeac8	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	415	1319	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-11 22:37:09.279	2026-02-18 16:23:25.7
090cb153-9586-4d44-a245-0a6b43928ff9	15253bbb-7d62-4674-ad27-c66475936580	مطلوب خدمة تصميم ثلاثي الأبعاد بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تصميم ثلاثي الأبعاد. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	e2e4e7b7-f108-4f74-a653-f52e0483fa40	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	316	600	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-12 21:48:20.878	2026-02-18 16:23:25.731
7f9730b1-bbc4-4f98-b0ad-d8b55f504b69	105bb1c7-f9b9-48b8-a031-76d2b52c2eff	ابحث عن خدمة صيانة مكيفات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في صيانة مكيفات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	3d27de5e-9b46-4986-a1ca-06f0d477a2ba	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	\N	318	1014	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-13 13:06:45.403	2026-02-18 16:23:25.734
21eba3c4-4268-46b0-9355-d0fe487d4cc5	15253bbb-7d62-4674-ad27-c66475936580	احتاج الى خدمة باركيه وأرضيات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في باركيه وأرضيات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	a4f932f4-17e0-4e68-9a2c-1c0b2f054756	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	441	1238	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-17 10:10:34.192	2026-02-18 16:23:25.779
f1bd4a2c-5620-4d0e-958a-1f7da8640f42	2a474982-5739-47fb-81f2-e1273e800c55	ابحث عن خدمة دعم فني وتقني بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في دعم فني وتقني. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	145dab2a-0441-446c-978b-42b317a37707	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	183	229	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-11 20:11:33.71	2026-02-18 16:23:25.816
4bdb5223-2713-4739-9cd7-806b33115c82	2849b948-60db-409c-aac1-5dc6cf411051	مطلوب خدمة تصميم حدائق بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تصميم حدائق. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	9e64837b-ee22-4570-b1f2-9c6c938107ea	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	105	718	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-18 05:01:11.24	2026-02-18 16:23:25.846
c787a885-5f92-46c6-ad03-401ab7a88040	284e1c70-ae85-4096-a43d-0a407ad229af	احتاج الى خدمة تصميم حدائق بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تصميم حدائق. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	9e64837b-ee22-4570-b1f2-9c6c938107ea	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	\N	185	943	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-12 22:46:16.137	2026-02-18 16:23:25.848
8c14d05b-6780-4afb-b407-72effc09a31a	2849b948-60db-409c-aac1-5dc6cf411051	مطلوب خدمة نجارة بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في نجارة. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	9216b9d5-8efb-4d0a-8d35-b5d47386c27f	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	411	582	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-12 07:06:54.496	2026-02-18 16:23:25.857
10a2e009-509e-424a-a8a4-c1b9b7f3acc6	2dae1352-4180-4f5f-8606-7cd01c61b9d8	ابحث عن خدمة تكييف مركزي بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تكييف مركزي. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	e4b87995-9082-4431-b055-d53c0bea18ab	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	\N	253	611	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-16 18:39:07.428	2026-02-18 16:23:25.877
6ca3891b-0509-4ba2-b9fc-265055c527ec	31494848-428e-4d55-b324-2eb64c380f32	ابحث عن خدمة فحص أنظمة التكييف بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في فحص أنظمة التكييف. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	a9a06bd3-95b8-4356-8ce3-c652f61f660b	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a697d691-a44d-4906-86a1-858042061d96	\N	\N	453	584	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-15 13:38:37.931	2026-02-18 16:23:25.913
28532696-e654-4f91-83e9-b8d1dffca1f4	1963ba9d-85f7-4456-9803-24ff87187b82	مطلوب خدمة تمديد شبكات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تمديد شبكات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	094e4723-4046-4698-a5e2-fe3cc59c3245	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	\N	540	786	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-15 03:00:47.053	2026-02-18 16:23:26.615
9400d529-ee62-4eef-8f06-b1a2e8461a53	2b1bfbaf-1f04-4124-bd01-68c75f8acd95	احتاج الى خدمة تعريف طابعات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تعريف طابعات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	6da456be-fbf2-4421-8140-0fd4efcc9edc	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	9c9790a2-5cff-4de9-beac-6a2d6bd38206	\N	\N	471	650	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-14 23:58:26.397	2026-02-18 16:23:26.681
2239e68c-8108-4366-ba27-2bd9ed88bb33	1dc82269-4fd8-4f16-8810-88d97fbad231	مطلوب خدمة استعادة بيانات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في استعادة بيانات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	647011ed-6560-47ee-9091-7b129a07c9ae	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	ae249f50-c0d1-450d-a049-32b4fe255055	\N	\N	102	114	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-18 15:03:57.475	2026-02-18 16:23:26.693
0d5624c5-8b5b-4627-aa36-284f977d90d0	134e670e-7b08-4a59-bc2d-0589d08b6dcd	احتاج الى خدمة تصميم واجهات المستخدم بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تصميم واجهات المستخدم. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	50187776-a7e9-41bb-9d8f-8fcc73bf7eb0	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6e129d49-c7ff-4f1f-a528-9bb3ecca9ff9	\N	\N	481	1091	SAR	\N	HIGH	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-14 06:56:01.279	2026-02-18 16:23:26.713
fa57bcff-3657-47c5-95ef-38e7b7e7f1b0	18c8e3e0-1a95-467d-8a49-a027cee0e5bd	احتاج الى خدمة تحسين محركات البحث بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تحسين محركات البحث. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	ae53a59e-003d-49e7-9e87-697ee990cc54	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	\N	464	826	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	t	f	ACTIVE	t	0	2026-02-15 09:50:51.075	2026-02-18 16:23:26.725
422d9923-ed7b-4ad8-855d-982b8b559687	1b804e9c-1a66-4436-b031-5f958678241c	ابحث عن خدمة تصميم شعارات بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تصميم شعارات. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	06dee9e7-8564-4afe-9544-715d48872bbb	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	c66a36d2-c2ab-424e-8f63-6c07cea22476	\N	\N	400	793	SAR	\N	MEDIUM	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-15 12:57:23.518	2026-02-18 16:23:26.756
c07f3707-a320-4d23-83f1-ad8eb952cb66	02d635af-3510-4db3-9e4f-b0afad0cd7b3	ابحث عن خدمة تصميم معماري بشكل عاجل	نبحث عن مقدم خدمة موثوق ومتخصص في تصميم معماري. يرجى تقديم عرض يشمل التكلفة والمدة الزمنية المتوقعة. العمل مطلوب بأسرع وقت ممكن.	0c401f45-8f32-4a40-81c7-c12a0063e6f3	\N	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	a96406fd-0fed-4163-b6e0-a92e59842a05	\N	\N	293	345	SAR	\N	LOW	PUBLIC	\N	\N	{lang:ar}	f	f	ACTIVE	t	0	2026-02-11 23:53:24.005	2026-02-18 16:23:26.758
70cb924d-fd19-4a13-ae5b-55757b1f6bca	b96647af-284a-45d0-a08d-4853f9d59fbc	nbnbnb	nbnbvnvnvnv nvn vn vnvn v	c5e2b66e-b100-41d9-bba8-e110b2abab71	a0b0eaea-a4e9-4ed0-add4-8273a72630ee	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	nvnvnvv vv h	200	400	USD	2026-04-24 00:00:00	MEDIUM	PUBLIC	["/api/files/projects/e1dc8ad6-4286-4ee5-b9da-11dde913090b.png", "/api/files/projects/8e420e60-5f1d-4ed1-b0ad-7775e8be5f5d.png", "/api/files/projects/41f12bbd-5e4a-4cd4-9b11-c9c9dd113f97.png"]	\N	{}	f	f	PENDING	t	0	2026-02-28 16:20:09.851	2026-02-28 16:20:09.851
f17606ed-dcbb-4df9-8645-bc84827f71c7	b96647af-284a-45d0-a08d-4853f9d59fbc	bhfhfh	 fhfhfh  hffhf fh fhf 	c800df55-740a-4bf4-abcf-9fb8dc54aa85	ae53a59e-003d-49e7-9e87-697ee990cc54	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	hrfh f	150	544	USD	2026-03-13 00:00:00	MEDIUM	PUBLIC	["/api/files/projects/7534dc1f-be3a-4033-8ab7-9233da496163.png"]	\N	{}	t	f	PENDING	t	0	2026-02-28 16:24:22.164	2026-02-28 16:24:22.164
7c5b15e1-7fd8-424d-9b89-64647c56b978	b96647af-284a-45d0-a08d-4853f9d59fbc	test 111	edadsfsf sf sf sf sfs fsf 	7049731f-af4e-489e-b560-096dfa6b7869	93ad7de3-d02d-47c7-9138-22daa3c2c0b4	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	f4e3d694-b3ca-48ef-8d1e-a8d23228363e	\N	fsfs  sfsf	234	444	USD	2026-03-27 00:00:00	MEDIUM	PUBLIC	["/api/files/projects/86e40582-93e9-4891-ac7a-78dc299c4370.png", "/api/files/projects/ed3256df-faf1-4a78-af04-bf8ce7a4b9ce.png"]	\N	{}	f	f	PENDING	t	0	2026-02-28 16:43:05.161	2026-02-28 16:43:05.161
7fe7a09a-e170-4901-bc2f-b19549a18f58	b96647af-284a-45d0-a08d-4853f9d59fbc	1144klkl	klklklklklklklklklklkl	98d60428-77df-4a56-8bca-4025dd191119	70eeca24-013d-4546-9567-3b42927e8364	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	6aea81c0-6329-4211-95dc-a59eaa0c121d	\N	klklklklkl	222	2222	USD	2026-05-28 00:00:00	URGENT	VERIFIED_COMPANIES	["/api/files/projects/9504b5bc-2979-4ed2-bbca-2e5b64743312.png", "/api/files/projects/f9f0b6df-892c-4192-9b6e-17957fb551f5.png"]	\N	{}	t	f	PENDING	t	0	2026-02-28 16:45:08.79	2026-02-28 16:45:08.79
9e5ea66a-acb0-4cb1-801c-f3f05c9f8d24	b96647af-284a-45d0-a08d-4853f9d59fbc	lhjljl	jljljljljljljljljljljljl	71cdffe5-1523-4ae3-82c7-d76dc438f90f	deb10409-fb05-4a07-a0f4-dda54988cd52	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	jlljljljljljl	100	1000	USD	2026-04-24 00:00:00	LOW	PUBLIC	["/api/files/projects/c2571c16-770a-42b4-be43-fd73c9ac567a.png"]	[]	{}	t	f	CANCELLED	f	0	2026-02-28 18:31:54.961	2026-02-28 18:39:16.202
30f960df-fc88-4d33-a757-cce99fa6905d	b96647af-284a-45d0-a08d-4853f9d59fbc	AAAAAAA	AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA	a104b06f-1cb5-4e34-8567-e8c136ccf452	c5168990-ce7e-4c39-b9ac-8fbbe3bdefb0	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	bd30e776-bd79-492a-96d5-fcb306c35284	\N	Telegramvägen 2	\N	\N	USD	\N	URGENT	PUBLIC	[]	\N	{lang:en,lang:ar}	f	f	ACCEPTED	t	0	2026-02-28 16:57:53.367	2026-03-02 09:31:30.068
82f95882-6f34-44ce-8c43-ad3772e10253	2849b948-60db-409c-aac1-5dc6cf411051	SSSSSSSS	SSSSSSSSSSSSSSSsssss	c5e2b66e-b100-41d9-bba8-e110b2abab71	b18f064e-30fd-4227-a6e0-94efae54d8f2	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	58158b4a-efa8-4c56-9ea5-5a52d3154058	\N	SSSSSSSSSS	500	1000	USD	2026-06-27 00:00:00	LOW	PUBLIC	["/api/files/projects/968182ea-c291-43ff-8ff3-4e77822b61bd.png"]	[]	{lang:en,lang:ar}	f	f	REVIEWING_OFFERS	t	0	2026-03-01 14:49:25.633	2026-03-02 09:32:16.372
28960d08-d878-42e7-9f4d-51fdc92abaa1	b96647af-284a-45d0-a08d-4853f9d59fbc	DDDDDD	DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD	98e85028-eaff-4c4c-a5ae-ccbe1c88e837	b52de601-ed5f-4be7-b531-55e4573892f1	578bae1f-39a4-4f77-bd22-8061a7c3a9d5	05ffd645-ae2d-4499-baad-0abf3ef162d3	\N	DDDDDDDDDDDDDDDDDDDDDDDDDDDDD	500	1000	USD	2026-06-02 00:00:00	HIGH	PUBLIC	["/api/files/projects/7c12d0fa-c01f-4709-a0ad-866b6f3d16e8.png"]	[]	{lang:ar}	f	f	ACCEPTED	t	0	2026-03-02 10:42:31.952	2026-03-02 13:24:18.285
\.


--
-- Data for Name: sla_reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sla_reports (id, year, month, "uptimePercent", "totalChecks", "failedChecks", "downtimeMinutes", "avgLatencyMs", "incidentsByCategory", "generatedAt") FROM stdin;
\.


--
-- Data for Name: staff_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.staff_members (id, "userId", "roleId", "departmentId", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: staff_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.staff_roles (id, name, "nameAr", description, permissions, "isActive", "createdAt", "updatedAt") FROM stdin;
dbb2ff93-1d27-4c49-a2c5-3d773d5f2340	Super Admin	مدير عام	Full access to all platform features and settings	[]	t	2026-02-18 11:51:07.859	2026-02-18 11:51:07.859
946a7c6c-2e9f-4d33-8004-7dcd24529798	Admin	مدير	Access to most admin features, cannot change system settings	[]	t	2026-02-18 11:51:07.868	2026-02-18 11:51:07.868
03699509-f9a7-473c-94de-120dd6b3e119	Department Admin	مدير قسم	Manages a specific department and its members	[]	t	2026-02-18 11:51:07.872	2026-02-18 11:51:07.872
dc47ac29-ee4c-4177-ac93-f6413c828c84	Support Agent	موظف دعم	Handles user support tickets and inquiries	[]	t	2026-02-18 11:51:07.876	2026-02-18 11:51:07.876
c67c6fe8-2a88-498e-a169-4a2e82f6ec2b	Content Manager	مدير المحتوى	Manages CMS pages, sections, and categories	[]	t	2026-02-18 11:51:07.88	2026-02-18 11:51:07.88
bbb576ff-6de1-4516-8b44-0bfee4827c18	Verification Officer	موظف التحقق	Reviews and approves company verification requests	[]	t	2026-02-18 11:51:07.884	2026-02-18 11:51:07.884
f664f8cf-846e-4d03-9948-29b24c7f20ad	Employee	موظف	General staff member with basic access	[]	t	2026-02-18 11:51:07.888	2026-02-18 11:51:07.888
\.


--
-- Data for Name: user_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_settings (id, "userId", "profileVisible", "showEmail", "showPhone", "allowDirectMessages", language, timezone, "deletionRequestedAt", "deletionReason", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, "emailHash", password, name, phone, role, avatar, image, "emailVerified", "createdAt", "updatedAt", "isActive", "failedLoginAttempts", "lockedUntil") FROM stdin;
1b804e9c-1a66-4436-b031-5f958678241c	companyowner@example.com	companyowner@example.com	Test123456!@	مالك الشركة	\N	COMPANY	\N	\N	\N	2026-02-15 14:24:56.446	2026-02-15 14:24:56.446	t	0	\N
cd94e3ff-3c6e-4619-ab5a-1bc0d65724b5	company_1771167476796_0@test.com	company_1771167476796_0@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Omar Othman	\N	COMPANY	\N	\N	2026-02-15 14:57:56.796	2026-02-15 14:57:56.8	2026-02-15 14:57:56.8	t	0	\N
9ece38ff-9830-43b1-adf8-567c1e002119	company_1771167476825_1@test.com	company_1771167476825_1@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Sara Hassan	\N	COMPANY	\N	\N	2026-02-15 14:57:56.825	2026-02-15 14:57:56.827	2026-02-15 14:57:56.827	t	0	\N
2a474982-5739-47fb-81f2-e1273e800c55	company_1771167476836_2@test.com	company_1771167476836_2@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Amal Ibrahim	\N	COMPANY	\N	\N	2026-02-15 14:57:56.836	2026-02-15 14:57:56.837	2026-02-15 14:57:56.837	t	0	\N
6bfe5d3c-4f60-44d0-aa2d-8ed9d0f57667	company_1771167476846_3@test.com	company_1771167476846_3@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Hussein Al-Masri	\N	COMPANY	\N	\N	2026-02-15 14:57:56.846	2026-02-15 14:57:56.847	2026-02-15 14:57:56.847	t	0	\N
1fe1195e-328a-4400-8f78-e85a8d9de7c4	company_1771167476857_4@test.com	company_1771167476857_4@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Sara Nasser	\N	COMPANY	\N	\N	2026-02-15 14:57:56.857	2026-02-15 14:57:56.859	2026-02-15 14:57:56.859	t	0	\N
544573f8-a70a-4a36-96e1-b7c0e6833973	company_1771167476868_5@test.com	company_1771167476868_5@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Youssef Al-Halabi	\N	COMPANY	\N	\N	2026-02-15 14:57:56.868	2026-02-15 14:57:56.869	2026-02-15 14:57:56.869	t	0	\N
63ce3333-64c3-4c0d-97b5-9b517d2ff19d	company_1771167476875_6@test.com	company_1771167476875_6@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Huda Assad	\N	COMPANY	\N	\N	2026-02-15 14:57:56.875	2026-02-15 14:57:56.877	2026-02-15 14:57:56.877	t	0	\N
db5f03ed-641a-4fc7-909e-50c1eaa6091d	company_1771167476884_7@test.com	company_1771167476884_7@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Salma Sleiman	\N	COMPANY	\N	\N	2026-02-15 14:57:56.884	2026-02-15 14:57:56.885	2026-02-15 14:57:56.885	t	0	\N
68c307a7-517b-4cdd-9fa2-95bf939c0b44	company_1771167476893_8@test.com	company_1771167476893_8@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Amal Al-Sayed	\N	COMPANY	\N	\N	2026-02-15 14:57:56.893	2026-02-15 14:57:56.894	2026-02-15 14:57:56.894	t	0	\N
00a886d6-2514-4dd6-b1bf-96a9fa2cecb6	company_1771167476901_9@test.com	company_1771167476901_9@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Salma Hassan	\N	COMPANY	\N	\N	2026-02-15 14:57:56.901	2026-02-15 14:57:56.902	2026-02-15 14:57:56.902	t	0	\N
ee8397dd-bcc4-41ae-b2a5-27ef6b72109a	company_1771167476909_10@test.com	company_1771167476909_10@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Ahmad Nasser	\N	COMPANY	\N	\N	2026-02-15 14:57:56.909	2026-02-15 14:57:56.91	2026-02-15 14:57:56.91	t	0	\N
9102078e-ab50-4df9-a7ec-65c2464a03d8	company_1771167476917_11@test.com	company_1771167476917_11@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Layla Saleh	\N	COMPANY	\N	\N	2026-02-15 14:57:56.917	2026-02-15 14:57:56.918	2026-02-15 14:57:56.918	t	0	\N
f89fe900-2d7f-4a6f-85c7-a33f4d06941d	company_1771167476925_12@test.com	company_1771167476925_12@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Rania Al-Halabi	\N	COMPANY	\N	\N	2026-02-15 14:57:56.925	2026-02-15 14:57:56.926	2026-02-15 14:57:56.926	t	0	\N
fc7cdc8c-efbe-410e-99dc-f94f77090096	company_1771167476934_13@test.com	company_1771167476934_13@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Huda Al-Halabi	\N	COMPANY	\N	\N	2026-02-15 14:57:56.934	2026-02-15 14:57:56.935	2026-02-15 14:57:56.935	t	0	\N
d0471954-54fd-4fdd-9dbd-5885d810cd30	company_1771167476939_14@test.com	company_1771167476939_14@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Omar Al-Sayed	\N	COMPANY	\N	\N	2026-02-15 14:57:56.939	2026-02-15 14:57:56.94	2026-02-15 14:57:56.94	t	0	\N
8b31467b-a846-4ac4-aee7-6f5880fd3e7b	company_1771167476945_15@test.com	company_1771167476945_15@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Hassan Hassan	\N	COMPANY	\N	\N	2026-02-15 14:57:56.945	2026-02-15 14:57:56.946	2026-02-15 14:57:56.946	t	0	\N
40892513-50c2-4a41-9f1a-be224ae492fa	company_1771167476950_16@test.com	company_1771167476950_16@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Layla Assad	\N	COMPANY	\N	\N	2026-02-15 14:57:56.95	2026-02-15 14:57:56.951	2026-02-15 14:57:56.951	t	0	\N
c852f2e7-95ec-4b51-a6b4-f9dd6079e64f	company_1771167476958_17@test.com	company_1771167476958_17@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Fatima Al-Sayed	\N	COMPANY	\N	\N	2026-02-15 14:57:56.958	2026-02-15 14:57:56.959	2026-02-15 14:57:56.959	t	0	\N
6a4d8b84-efd3-44fd-82bc-ee188ec1776d	company_1771167476965_18@test.com	company_1771167476965_18@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Maha Saleh	\N	COMPANY	\N	\N	2026-02-15 14:57:56.965	2026-02-15 14:57:56.966	2026-02-15 14:57:56.966	t	0	\N
2b1bfbaf-1f04-4124-bd01-68c75f8acd95	company_1771167476975_19@test.com	company_1771167476975_19@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Layla Al-Halabi	\N	COMPANY	\N	\N	2026-02-15 14:57:56.975	2026-02-15 14:57:56.976	2026-02-15 14:57:56.976	t	0	\N
8b7f1800-caca-4959-a6d8-4c763c4775f0	company_1771167476986_20@test.com	company_1771167476986_20@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Amal Khoury	\N	COMPANY	\N	\N	2026-02-15 14:57:56.986	2026-02-15 14:57:56.987	2026-02-15 14:57:56.987	t	0	\N
4f3d2896-0e00-4f98-b579-ba9254f28c1f	company_1771167476992_21@test.com	company_1771167476992_21@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Zainab Al-Masri	\N	COMPANY	\N	\N	2026-02-15 14:57:56.992	2026-02-15 14:57:56.993	2026-02-15 14:57:56.993	t	0	\N
3da19a13-09aa-4c8c-a338-a50a373a1351	company_1771167477002_22@test.com	company_1771167477002_22@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Hussein Haddad	\N	COMPANY	\N	\N	2026-02-15 14:57:57.002	2026-02-15 14:57:57.003	2026-02-15 14:57:57.003	t	0	\N
35afcd35-0119-4670-955a-8bc235d4c360	company_1771167477010_23@test.com	company_1771167477010_23@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Salma Khoury	\N	COMPANY	\N	\N	2026-02-15 14:57:57.011	2026-02-15 14:57:57.012	2026-02-15 14:57:57.012	t	0	\N
329bb7c8-2ecb-4357-aa27-6baed0b1e3b7	company_1771167477016_24@test.com	company_1771167477016_24@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Hussein Al-Shami	\N	COMPANY	\N	\N	2026-02-15 14:57:57.016	2026-02-15 14:57:57.017	2026-02-15 14:57:57.017	t	0	\N
bdc971d7-081d-41e5-97b3-507d834f66b0	company_1771167477020_25@test.com	company_1771167477020_25@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Omar Al-Shami	\N	COMPANY	\N	\N	2026-02-15 14:57:57.02	2026-02-15 14:57:57.021	2026-02-15 14:57:57.021	t	0	\N
acadb284-8dc5-470b-bdb6-6169ba6f9ba5	company_1771167477028_26@test.com	company_1771167477028_26@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Ibrahim Assad	\N	COMPANY	\N	\N	2026-02-15 14:57:57.028	2026-02-15 14:57:57.03	2026-02-15 14:57:57.03	t	0	\N
e7e2d5aa-92f8-42d8-bad0-9055614c9da9	company_1771167477034_27@test.com	company_1771167477034_27@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Salma Sleiman	\N	COMPANY	\N	\N	2026-02-15 14:57:57.034	2026-02-15 14:57:57.035	2026-02-15 14:57:57.035	t	0	\N
31494848-428e-4d55-b324-2eb64c380f32	company_1771167477044_28@test.com	company_1771167477044_28@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Hussein Khoury	\N	COMPANY	\N	\N	2026-02-15 14:57:57.044	2026-02-15 14:57:57.045	2026-02-15 14:57:57.045	t	0	\N
762f836e-6368-4fa0-9757-af9898900a8d	company_1771167477050_29@test.com	company_1771167477050_29@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Ali Haddad	\N	COMPANY	\N	\N	2026-02-15 14:57:57.05	2026-02-15 14:57:57.051	2026-02-15 14:57:57.051	t	0	\N
1963ba9d-85f7-4456-9803-24ff87187b82	company_1771167477058_30@test.com	company_1771167477058_30@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Salma Ibrahim	\N	COMPANY	\N	\N	2026-02-15 14:57:57.058	2026-02-15 14:57:57.06	2026-02-15 14:57:57.06	t	0	\N
f2315d3e-8a9c-4b13-bb8d-d6b5fe9935a2	company_1771167477063_31@test.com	company_1771167477063_31@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Rania Assad	\N	COMPANY	\N	\N	2026-02-15 14:57:57.063	2026-02-15 14:57:57.064	2026-02-15 14:57:57.064	t	0	\N
83bab9c2-d7f5-49a5-aa8e-d1a1bd06ff95	company_1771167477072_32@test.com	company_1771167477072_32@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Maha Al-Halabi	\N	COMPANY	\N	\N	2026-02-15 14:57:57.072	2026-02-15 14:57:57.073	2026-02-15 14:57:57.073	t	0	\N
c12cca1b-8fd4-4e38-8f19-528ab2a2ed33	company_1771167477082_33@test.com	company_1771167477082_33@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Omar Al-Ali	\N	COMPANY	\N	\N	2026-02-15 14:57:57.083	2026-02-15 14:57:57.084	2026-02-15 14:57:57.084	t	0	\N
596dc79c-62e9-4580-a86b-615f19709d59	company_1771167477089_34@test.com	company_1771167477089_34@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Hassan Assad	\N	COMPANY	\N	\N	2026-02-15 14:57:57.089	2026-02-15 14:57:57.09	2026-02-15 14:57:57.09	t	0	\N
ed8d9767-2516-4d15-87c4-8261b69a6ea7	company_1771167477099_35@test.com	company_1771167477099_35@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Omar Al-Ali	\N	COMPANY	\N	\N	2026-02-15 14:57:57.099	2026-02-15 14:57:57.1	2026-02-15 14:57:57.1	t	0	\N
18c8e3e0-1a95-467d-8a49-a027cee0e5bd	company_1771167477109_36@test.com	company_1771167477109_36@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Huda Nasser	\N	COMPANY	\N	\N	2026-02-15 14:57:57.109	2026-02-15 14:57:57.11	2026-02-15 14:57:57.11	t	0	\N
f0dcfb62-8351-4e33-a4e0-844c95e04c78	company_1771167477117_37@test.com	company_1771167477117_37@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Salma Saleh	\N	COMPANY	\N	\N	2026-02-15 14:57:57.117	2026-02-15 14:57:57.118	2026-02-15 14:57:57.118	t	0	\N
338a9c72-8a9b-4f08-a381-b527ceea416d	company_1771167477123_38@test.com	company_1771167477123_38@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Maha Othman	\N	COMPANY	\N	\N	2026-02-15 14:57:57.123	2026-02-15 14:57:57.124	2026-02-15 14:57:57.124	t	0	\N
134e670e-7b08-4a59-bc2d-0589d08b6dcd	company_1771167477129_39@test.com	company_1771167477129_39@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Layla Othman	\N	COMPANY	\N	\N	2026-02-15 14:57:57.129	2026-02-15 14:57:57.13	2026-02-15 14:57:57.13	t	0	\N
36a2106b-e2be-4917-bdb4-abd8e97d8917	company_1771167477139_40@test.com	company_1771167477139_40@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Ibrahim Al-Sayed	\N	COMPANY	\N	\N	2026-02-15 14:57:57.139	2026-02-15 14:57:57.14	2026-02-15 14:57:57.14	t	0	\N
112e2545-b79b-4375-b02e-ab398816ccd0	company_1771167477144_41@test.com	company_1771167477144_41@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Amal Al-Masri	\N	COMPANY	\N	\N	2026-02-15 14:57:57.144	2026-02-15 14:57:57.146	2026-02-15 14:57:57.146	t	0	\N
1dc82269-4fd8-4f16-8810-88d97fbad231	company_1771167477152_42@test.com	company_1771167477152_42@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Huda Assad	\N	COMPANY	\N	\N	2026-02-15 14:57:57.152	2026-02-15 14:57:57.153	2026-02-15 14:57:57.153	t	0	\N
15253bbb-7d62-4674-ad27-c66475936580	company_1771167477157_43@test.com	company_1771167477157_43@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Layla Haddad	\N	COMPANY	\N	\N	2026-02-15 14:57:57.157	2026-02-15 14:57:57.158	2026-02-15 14:57:57.158	t	0	\N
02d635af-3510-4db3-9e4f-b0afad0cd7b3	company_1771167477165_44@test.com	company_1771167477165_44@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Mohammad Al-Ali	\N	COMPANY	\N	\N	2026-02-15 14:57:57.165	2026-02-15 14:57:57.166	2026-02-15 14:57:57.166	t	0	\N
fec2caba-d192-4c45-ad49-3a0c9c6781e5	company_1771167477171_45@test.com	company_1771167477171_45@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Salma Saleh	\N	COMPANY	\N	\N	2026-02-15 14:57:57.171	2026-02-15 14:57:57.172	2026-02-15 14:57:57.172	t	0	\N
e3d943a7-207f-4bcd-bf06-d9a11968160f	company_1771167477177_46@test.com	company_1771167477177_46@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Ibrahim Khoury	\N	COMPANY	\N	\N	2026-02-15 14:57:57.177	2026-02-15 14:57:57.178	2026-02-15 14:57:57.178	t	0	\N
8ba353a3-cf79-4e4c-861c-e11c23537b2c	company_1771167477182_47@test.com	company_1771167477182_47@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Sara Al-Masri	\N	COMPANY	\N	\N	2026-02-15 14:57:57.182	2026-02-15 14:57:57.183	2026-02-15 14:57:57.183	t	0	\N
45b866f8-d3d2-413f-9c1b-c5763e4bc8a1	company_1771167477188_48@test.com	company_1771167477188_48@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Hassan Othman	\N	COMPANY	\N	\N	2026-02-15 14:57:57.188	2026-02-15 14:57:57.19	2026-02-15 14:57:57.19	t	0	\N
d7b8c332-1260-4ffb-9ee9-071f556c8d6f	company_1771167477196_49@test.com	company_1771167477196_49@test.com	$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0	Sami Nasser	\N	COMPANY	\N	\N	2026-02-15 14:57:57.196	2026-02-15 14:57:57.197	2026-02-15 14:57:57.197	t	0	\N
dec3a0ef-1e8a-4363-bde8-73765431b2b4	client_1771167477201_0@test.com	client_1771167477201_0@test.com	password	Omar Saleh	\N	USER	\N	\N	\N	2026-02-15 14:57:57.202	2026-02-15 14:57:57.202	t	0	\N
fc08c893-00af-44a4-b355-18d5c8b3e36f	client_1771167477204_1@test.com	client_1771167477204_1@test.com	password	Huda Saleh	\N	USER	\N	\N	\N	2026-02-15 14:57:57.205	2026-02-15 14:57:57.205	t	0	\N
5cfbcdd0-0b36-4921-a3c2-fa504ca8a20d	client_1771167477206_2@test.com	client_1771167477206_2@test.com	password	Mohammad Assad	\N	USER	\N	\N	\N	2026-02-15 14:57:57.207	2026-02-15 14:57:57.207	t	0	\N
105bb1c7-f9b9-48b8-a031-76d2b52c2eff	client_1771167477207_3@test.com	client_1771167477207_3@test.com	password	Zainab Al-Halabi	\N	USER	\N	\N	\N	2026-02-15 14:57:57.208	2026-02-15 14:57:57.208	t	0	\N
a130bf73-f351-4a22-a24d-0f9e9753cb71	client_1771167477209_4@test.com	client_1771167477209_4@test.com	password	Rania Al-Ali	\N	USER	\N	\N	\N	2026-02-15 14:57:57.21	2026-02-15 14:57:57.21	t	0	\N
bc441d06-eb20-43fe-8728-97ad52f2d99f	client_1771167477211_5@test.com	client_1771167477211_5@test.com	password	Huda Saleh	\N	USER	\N	\N	\N	2026-02-15 14:57:57.212	2026-02-15 14:57:57.212	t	0	\N
90a57a13-7f68-46a3-92ff-d9417f02e2d9	client_1771167477212_6@test.com	client_1771167477212_6@test.com	password	Zainab Hassan	\N	USER	\N	\N	\N	2026-02-15 14:57:57.213	2026-02-15 14:57:57.213	t	0	\N
9d01669c-4bd3-4f02-8179-90ca8de71870	client_1771167477213_7@test.com	client_1771167477213_7@test.com	password	Khaled Haddad	\N	USER	\N	\N	\N	2026-02-15 14:57:57.214	2026-02-15 14:57:57.214	t	0	\N
068d20f7-d8fe-405f-b31b-989f997b2042	client_1771167477214_8@test.com	client_1771167477214_8@test.com	password	Ahmad Hassan	\N	USER	\N	\N	\N	2026-02-15 14:57:57.215	2026-02-15 14:57:57.215	t	0	\N
2dae1352-4180-4f5f-8606-7cd01c61b9d8	client_1771167477215_9@test.com	client_1771167477215_9@test.com	password	Rania Haddad	\N	USER	\N	\N	\N	2026-02-15 14:57:57.217	2026-02-15 14:57:57.217	t	0	\N
8083129e-0ea5-4508-b7d5-cde138d9dadb	client_1771167477218_10@test.com	client_1771167477218_10@test.com	password	Ahmad Al-Shami	\N	USER	\N	\N	\N	2026-02-15 14:57:57.219	2026-02-15 14:57:57.219	t	0	\N
d20125d0-2ced-46c1-893f-52e813af1c53	client_1771167477220_11@test.com	client_1771167477220_11@test.com	password	Youssef Al-Ali	\N	USER	\N	\N	\N	2026-02-15 14:57:57.221	2026-02-15 14:57:57.221	t	0	\N
cbe519db-242b-4272-ba76-2a8becc4effb	client_1771167477222_12@test.com	client_1771167477222_12@test.com	password	Fatima Saleh	\N	USER	\N	\N	\N	2026-02-15 14:57:57.223	2026-02-15 14:57:57.223	t	0	\N
1cec89ac-cdb8-41fb-81ea-2650126f551f	client_1771167477223_13@test.com	client_1771167477223_13@test.com	password	Ahmad Ibrahim	\N	USER	\N	\N	\N	2026-02-15 14:57:57.224	2026-02-15 14:57:57.224	t	0	\N
284e1c70-ae85-4096-a43d-0a407ad229af	client_1771167477225_14@test.com	client_1771167477225_14@test.com	password	Maha Al-Shami	\N	USER	\N	\N	\N	2026-02-15 14:57:57.226	2026-02-15 14:57:57.226	t	0	\N
1abb39df-0929-4386-aff1-8a5ae3668375	client_1771167477226_15@test.com	client_1771167477226_15@test.com	password	Maha Sleiman	\N	USER	\N	\N	\N	2026-02-15 14:57:57.227	2026-02-15 14:57:57.227	t	0	\N
7f65f52e-949f-493b-9ebf-4af5e98b832b	client_1771167477227_16@test.com	client_1771167477227_16@test.com	password	Hassan Ibrahim	\N	USER	\N	\N	\N	2026-02-15 14:57:57.228	2026-02-15 14:57:57.228	t	0	\N
b074439b-dfb8-4bd9-92b5-b58137b917aa	client_1771167477229_17@test.com	client_1771167477229_17@test.com	password	Khaled Saleh	\N	USER	\N	\N	\N	2026-02-15 14:57:57.23	2026-02-15 14:57:57.23	t	0	\N
e37dbeda-0d5f-4a04-a0df-2fd87726258c	client_1771167477230_18@test.com	client_1771167477230_18@test.com	password	Amal Nasser	\N	USER	\N	\N	\N	2026-02-15 14:57:57.231	2026-02-15 14:57:57.231	t	0	\N
bd0313b9-45a5-4ec5-84f0-bb0f8b98c7ab	client_1771167477233_19@test.com	client_1771167477233_19@test.com	password	Fatima Assad	\N	USER	\N	\N	\N	2026-02-15 14:57:57.234	2026-02-15 14:57:57.234	t	0	\N
bf3e8af2-ec70-47f5-86f5-b95627c3bda6	ghgjgjgjgy@secure-marketplace.com	1213962c10e612bec4f6e2d4331bd91e1287e5c9efa36ce92122b00dd193211d	$argon2id$v=19$m=65536,t=3,p=4$7s+o5U97cfFId4EdGJt5oA$fogAQPkSd9vUf5ezyKoYxrwUmpF9KJnKXcGU6c2PxZQ	gfgfgfhfhfh	jhkhkhkhk	COMPANY	\N	\N	\N	2026-02-18 09:28:33.56	2026-02-18 09:28:33.56	t	0	\N
709f0a1e-1bdd-4c0d-9509-9f26a46e9d03	company@secure-hhhmarketplace.comhhhh	46418a266e48774158e732f0bc07db53b467efc192d7119db6d20deb2861eb4b	$argon2id$v=19$m=65536,t=3,p=4$qLATF/Z8MdkKzqt8jStYFg$9z162cXWLel9/k0X92lvCZEm3FFYC19g3/ficolt+5s	ghgh gh gh	0754224578	COMPANY	\N	\N	\N	2026-02-18 11:22:15.23	2026-02-18 11:22:15.23	t	0	\N
f7e8b243-5e91-46b0-befa-bdf1f7062b4d	companysdsdsdsd@secure-marketplace.com	8ea5ea21aaaf865bda27326f038b51ade5e7d33f3125ff8f139012e7bcb4edc1	$argon2id$v=19$m=65536,t=3,p=4$44nA1/VTXAU1jiQf8W3kVQ$SN2/5493Kl2GLzWRVwdpCXHj/linoANaORuPfSrpcp0	popopo444	0758585857	COMPANY	\N	\N	\N	2026-02-18 11:24:43.862	2026-02-18 11:24:43.862	t	0	\N
b87ea0b5-388a-4dff-8531-fe9cf8b0119b	co-en-c5e2b66e-mlsaheo23q1@demo.marketplace.com	7841ba201a58f68b3d6af1f34192370085d8f3aec0daa278ebce11f077a98676	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Swift Electrical Solutions Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.419	2026-02-18 17:11:40.421	2026-02-18 17:11:40.421	t	0	\N
63a0f3bf-e2fe-4353-88a1-8f6c12cb74c9	pending@secure-marketplace.com	115615d1e2a57a7bea44de8a707c1621da54d147840e3a4b086f12345687bde4	$argon2id$v=19$m=65536,t=3,p=4$ItiCxkTQappjLi6K4s6WPg$XnR1uEMC6evvlBup+vJUxdezpDPyv/Xj8LqJbrzK4ao	Pending Company	\N	COMPANY	\N	\N	2026-02-20 09:47:53.599	2026-02-17 10:51:14.674	2026-02-20 09:47:53.601	t	0	\N
fdf9e7f6-3076-4e7f-b7aa-577addb4afe9	co-ar-c5e2b66e-mlsaheo98ef@demo.marketplace.com	da1866d5e27aa0006340377a99f7fb1fe0c8b6d0ca1472f74b40511e9711009a	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة كهرباء الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.425	2026-02-18 17:11:40.427	2026-02-18 17:11:40.427	t	0	\N
def4abba-d139-47e7-93ab-e486e1a1232e	unverified@secure-marketplace.com	accc90f64c3410a88b48af93eac60bfe19061a90e15b6b6ec1b525bffc365851	$argon2id$v=19$m=65536,t=3,p=4$ItiCxkTQappjLi6K4s6WPg$XnR1uEMC6evvlBup+vJUxdezpDPyv/Xj8LqJbrzK4ao	Unverified User	\N	USER	\N	\N	\N	2026-02-17 10:51:14.683	2026-02-20 09:47:53.611	t	0	\N
c796b4d5-8c52-4c88-8266-1a1cacff7667	co-en-a0b0eaea-mlsaheof1y6@demo.marketplace.com	895bbb849d323626cc3e89150b261a6f6573f7f16dbaf2ae07b90dcbc143c6ad	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Apex Generator Installation Team Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.431	2026-02-18 17:11:40.433	2026-02-18 17:11:40.433	t	0	\N
124e0827-ed4d-4dc4-89ac-b74b53fbdab3	co-ar-a0b0eaea-mlsaheolncx@demo.marketplace.com	000a62fa212a4633327898d4dbf0338cfdebe9c0a27bc399d405898de9559c3f	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز تركيب مولدات الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.438	2026-02-18 17:11:40.44	2026-02-18 17:11:40.44	t	0	\N
4ba0a302-91cb-41a5-a28d-517c473c2065	co-en-9ac120a7-mlsaheotq9a@demo.marketplace.com	10639584705a8cba6b8b62dc342de279d41e885698e0015a8c1a9e9bf952ff0f	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Apex Electrical Wiring Co Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.445	2026-02-18 17:11:40.447	2026-02-18 17:11:40.447	t	0	\N
1d0c984f-e2c8-4cdd-a44c-76223c82e0a6	co-ar-9ac120a7-mlsaheoyw0t@demo.marketplace.com	696dd7dd04f597ed6b067641b75e52e82f648914dba9dd98742ac7beff6e8a47	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة تمديدات كهربائية المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.451	2026-02-18 17:11:40.453	2026-02-18 17:11:40.453	t	0	\N
2bc91a16-e2f1-41bf-92f6-0d1f49050b86	co-en-8981ac1a-mlsahep40ou@demo.marketplace.com	f8d675600724b7e5d9acf4a5748992988d73d623fc5c24389d85d6b4637fc3f1	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Pro Electrical Repairs Team Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.457	2026-02-18 17:11:40.459	2026-02-18 17:11:40.459	t	0	\N
8ea63e67-d7e4-4104-93de-361bba4a4aa9	locked@secure-marketplace.com	082eddafb4e597cb6cd419a4d082af5d8d579efafabed5d874bc573b520837ee	$argon2id$v=19$m=65536,t=3,p=4$ItiCxkTQappjLi6K4s6WPg$XnR1uEMC6evvlBup+vJUxdezpDPyv/Xj8LqJbrzK4ao	Locked User	\N	USER	\N	\N	2026-02-20 09:47:53.612	2026-02-17 10:51:14.687	2026-02-20 09:47:53.615	t	0	2026-02-21 09:47:53.612
62f62f5f-5b4e-496b-a6a0-ab5cee9fef2f	co-en-a0b0eaea-mlsahelkt6h@demo.marketplace.com	236789f3e42c440a26c6c3d59bd419a2077af701d7250617309e16cba3c0211c	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Elite Generator Installation Partners Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.329	2026-02-18 17:11:40.332	2026-02-18 17:11:40.332	t	0	\N
29da849a-4580-4649-867b-5fadf3717615	co-ar-a0b0eaea-mlsahenubxx@demo.marketplace.com	ffd9fa21068e01c566b15cdb25bff1a34211b6f5f3c2a7ad003605f86b378394	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء تركيب مولدات للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.411	2026-02-18 17:11:40.413	2026-02-18 17:11:40.413	t	0	\N
e839e05a-faa7-49a0-8f21-561e7876add7	co-ar-8981ac1a-mlsahepc8zl@demo.marketplace.com	b836d1895d03e79157423fe7103f885458d98a3f7e382e9bfabd19bbeb6e4f58	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة إصلاح أعطال كهرباء الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.464	2026-02-18 17:11:40.466	2026-02-18 17:11:40.466	t	0	\N
bebd56bd-920c-4191-b538-7ee6266cfcd1	co-en-b18f064e-mlsaheph4es@demo.marketplace.com	bf6468f7926f35c61a26e7715e2e51ba36985937e686e0c448f66c98755eef56	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Best Lighting Install Group Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.47	2026-02-18 17:11:40.471	2026-02-18 17:11:40.471	t	0	\N
1327c7f7-3fe2-4c3f-812f-9982d281d4dc	co-ar-b18f064e-mlsahepnf55@demo.marketplace.com	707a8352d26fae37796491cee4cb9b3c1d526e5c96430471c75348ab33c055ca	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة تركيب إنارة المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.476	2026-02-18 17:11:40.478	2026-02-18 17:11:40.478	t	0	\N
53acafe8-5155-4a19-8907-264f7a3c8a89	co-en-4acb75e6-mlsaheptetz@demo.marketplace.com	8b38f67320ef505716e0f8556740673b638144866a5301378e348008d4807ae4	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Alpha Generator Maintenance Team Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.481	2026-02-18 17:11:40.483	2026-02-18 17:11:40.483	t	0	\N
b834ecd2-6349-47ff-9e63-5e3c2a3c0c1d	co-en-e9264c4c-mlsahfdl2yb@demo.marketplace.com	d0b6aaf6e054beee8fbf448db0023a10d0c71f1715989512b85fb1a1a39b34ff	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Expert Kitchen Plumbing Agency Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.337	2026-02-18 17:11:41.339	2026-02-18 17:11:41.339	t	0	\N
b96647af-284a-45d0-a08d-4853f9d59fbc	user@secure-marketplace.com	99eeacd7a09d85cbf931b1b015d2f9aedd9883e856c0f67f2207215964e16edc	$argon2id$v=19$m=65536,t=3,p=4$ItiCxkTQappjLi6K4s6WPg$XnR1uEMC6evvlBup+vJUxdezpDPyv/Xj8LqJbrzK4ao	Standard User	\N	USER	\N	\N	2026-02-20 09:47:53.579	2026-02-17 10:51:14.635	2026-03-03 11:09:21.416	t	0	\N
5a529f50-7761-4049-a023-1b9120b244d7	owner@secure-marketplace.com	8428843abb1543023a213844bd6449a61a57e11b52eb257b35b770f04ef8cf6b	$argon2id$v=19$m=65536,t=3,p=4$ItiCxkTQappjLi6K4s6WPg$XnR1uEMC6evvlBup+vJUxdezpDPyv/Xj8LqJbrzK4ao	Website Owner	\N	SUPER_ADMIN	\N	\N	2026-02-20 09:47:53.575	2026-02-17 10:51:14.63	2026-02-20 09:47:53.578	t	0	\N
7c9b5c9a-b112-4107-a549-ee1e013cf643	co-ar-4acb75e6-mlsahepz7gl@demo.marketplace.com	0f25a95efbc1b468bf4547fa131c795e308c739885b80a5f9e9bf76b43197263	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة صيانة مولدات المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.487	2026-02-18 17:11:40.489	2026-02-18 17:11:40.489	t	0	\N
37cb05e4-eb79-476a-8afb-d1f6a7e869c8	co-en-3d4fec38-mlsaheq5j5d@demo.marketplace.com	4fcd493ad0a6c6508ba57d0f8f1eed4cf35638729033d2a4f71136e7a619b0f3	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Prime Solar Panel Install Hub Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.493	2026-02-18 17:11:40.495	2026-02-18 17:11:40.495	t	0	\N
ebc9a3e9-e67e-40b2-a88c-950d3b9d81f2	co-ar-3d4fec38-mlsaheqbrz5@demo.marketplace.com	a534154ce414de092aa12f3c54a9dc1b34fc9fb86c85b6e99cf533b0f07f1af2	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز تركيب طاقة شمسية الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.499	2026-02-18 17:11:40.501	2026-02-18 17:11:40.501	t	0	\N
07529ccc-3693-4d64-9708-7b9fde46d985	co-en-0def337f-mlsaheqhf75@demo.marketplace.com	b20c4e5ebc2e33db9d6329bf52135bdc2bcbb0cb445e329d82a392b9f694b21f	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Pro Solar System Maint Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.506	2026-02-18 17:11:40.508	2026-02-18 17:11:40.508	t	0	\N
8779106a-44b5-40dd-b98c-7174b169c716	co-ar-0def337f-mlsaheqproj@demo.marketplace.com	928a02ee06ea4dc650f507154b095974169e93cde02ab18febcec8b15835b2ad	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة صيانة طاقة شمسية المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.513	2026-02-18 17:11:40.518	2026-02-18 17:11:40.518	t	0	\N
ae70bcba-380e-4e13-a37d-149ea2e1b805	co-en-38cb0fe6-mlsaher0gff@demo.marketplace.com	902779c975ac3f675a4dcb9fd16b2cf9a3f040344ced29d8a11272680dd682de	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Pro Electrical Panel Hub Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.524	2026-02-18 17:11:40.526	2026-02-18 17:11:40.526	t	0	\N
30b8edb5-086f-4fa9-be8e-15beed418fb2	co-ar-38cb0fe6-mlsaher8wxq@demo.marketplace.com	c40805ca36346bcd3fafa5f1ec35282429dc787d4016a36f1637ec5e8ab83d22	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة تركيب لوحات كهرباء المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.532	2026-02-18 17:11:40.534	2026-02-18 17:11:40.534	t	0	\N
92feb1f4-3395-4400-8be6-d9f089da9c2c	co-en-c79261af-mlsaherdyrf@demo.marketplace.com	6f159f59e52c500085be42300dbab1487a8caaebefe9f2257bc62afbedb73afb	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Prime Backup Power Systems Hub Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.537	2026-02-18 17:11:40.539	2026-02-18 17:11:40.539	t	0	\N
7631e165-9c85-44e1-a41a-305e4ead9d56	co-ar-c79261af-mlsaherkp39@demo.marketplace.com	819b123ca2f850be198e36298919e89a08ec1711b61d48c33b8a09dcf6c6b867	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة أنظمة طاقة احتياطية المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.545	2026-02-18 17:11:40.547	2026-02-18 17:11:40.547	t	0	\N
a3426510-1570-472e-94eb-82c1fabba7ea	co-en-98e85028-mlsaherrioh@demo.marketplace.com	ad7e754082af823571bb948265f7b379fbe04831af207bdeac3a645df83888e6	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Prime Plumbing Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.551	2026-02-18 17:11:40.553	2026-02-18 17:11:40.553	t	0	\N
e7942d61-cf12-4d8c-81bc-4d18a45cfa2e	co-ar-98e85028-mlsahes2ou1@demo.marketplace.com	5ee4c390e27a4c2cf6a2eb654aa863b3dc26f6ded681f65adb2bb4ae722a8101	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة سباكة الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.563	2026-02-18 17:11:40.565	2026-02-18 17:11:40.565	t	0	\N
58edd111-7a3d-4ea5-8ecd-490eb2078eb4	co-en-b52de601-mlsahes8qja@demo.marketplace.com	bf7b6bc58333c37b59bf788edd6747687325454dc2553015c1c2e6f16c2c314a	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Expert Leak Detection & Repair Partners Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.568	2026-02-18 17:11:40.572	2026-02-18 17:11:40.572	t	0	\N
9bd504e5-9e70-473e-8d75-d44a8ac300fb	co-ar-b52de601-mlsahesgdnd@demo.marketplace.com	40a38b949a53de536349031dabe4e2f11ce3cc1fbb4b79157bc6f3d9a2785d19	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة كشف وإصلاح تسربات المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.576	2026-02-18 17:11:40.578	2026-02-18 17:11:40.578	t	0	\N
f98c5eed-fc93-4d51-a778-a55daab7cd1a	co-en-6805a74f-mlsahesma4j@demo.marketplace.com	39ab433a1ee5efc4c7a76667f7624c9c713033fa95a29d020c4bdb1d38962c4f	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Alpha Pipe Installation Works Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.582	2026-02-18 17:11:40.584	2026-02-18 17:11:40.584	t	0	\N
b2bad518-cf02-415e-900f-2d0091c7d953	co-ar-6805a74f-mlsahestzld@demo.marketplace.com	be21295eb6c493c4f14c64c42948037af2bea2dfc2bc543b6afd02c3a5a99ebf	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة تمديد أنابيب المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.589	2026-02-18 17:11:40.591	2026-02-18 17:11:40.591	t	0	\N
30e92593-0f2f-45e4-a20d-f2e48fc8c8c9	co-en-65ddaf4f-mlsahesy3jp@demo.marketplace.com	021cfa165bbfab6ef26c507a301ddd9a61fcfa6425a1b3095800ba23da3fa313	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Expert Water Heater Install Team Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.595	2026-02-18 17:11:40.596	2026-02-18 17:11:40.596	t	0	\N
073b6581-4892-4bcc-94d1-6700acf4b243	co-ar-65ddaf4f-mlsahet8uls@demo.marketplace.com	7822c3502daf8fb37aecdb71d9cc1ff0f862c26951f086028bb99cef4ceac95f	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة تركيب سخان مياه المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.604	2026-02-18 17:11:40.606	2026-02-18 17:11:40.606	t	0	\N
24ee0189-e4eb-4646-b74f-3fe744481ba4	co-en-487b84b5-mlsahetggvr@demo.marketplace.com	aae93403649618e6547b2ba176c8b4755a3d84ada965486c6c3c2cc9fc0db337	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Star Water Heater Repair Group Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.612	2026-02-18 17:11:40.614	2026-02-18 17:11:40.614	t	0	\N
e402e6f1-9878-47a0-9b2c-e778c9ed92a8	co-ar-487b84b5-mlsahetmdyr@demo.marketplace.com	ad7ec65d0ead31c7056302b979ca15dd6baf87274f9bbbc2a6e58e90f80c0072	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء صيانة سخان مياه المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.619	2026-02-18 17:11:40.621	2026-02-18 17:11:40.621	t	0	\N
bbda4294-fded-4edd-9331-89cca75e9665	co-en-bd693184-mlsahettn7h@demo.marketplace.com	2433eed16074100b5213f904316c1b1fcfddf983f930ffeec0d0c54585325cce	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Alpha Bathroom Plumbing Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.625	2026-02-18 17:11:40.628	2026-02-18 17:11:40.628	t	0	\N
52353b5c-8faa-4df5-96c0-7fd27fe758e3	co-ar-bd693184-mlsaheu0ka1@demo.marketplace.com	51569002cb8b860df63e795068f1a48721c343f6fb1ee50f9409bfe8d5b1cf45	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة سباكة حمامات للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.632	2026-02-18 17:11:40.634	2026-02-18 17:11:40.634	t	0	\N
80c90484-1b48-435c-aa44-97be6267f53f	co-en-e9264c4c-mlsaheu6rgi@demo.marketplace.com	aa42ed76f1e787637cdbe6ac36299bc745ea34f3ea2a6d4d7ab264ab057f9a0f	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Expert Kitchen Plumbing Team Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.638	2026-02-18 17:11:40.64	2026-02-18 17:11:40.64	t	0	\N
edbe7046-6c9d-404f-b423-3525a1764443	co-ar-e9264c4c-mlsaheudj8c@demo.marketplace.com	0a4134fa64ca3ac25fdcccbdc16cd078318235d98c112575e9ea2c38f2d28c4f	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة سباكة مطابخ للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.645	2026-02-18 17:11:40.647	2026-02-18 17:11:40.647	t	0	\N
0e07dc7b-5f3d-4a20-b2f0-a67ed2c08f4d	co-en-5037cea3-mlsaheuj99d@demo.marketplace.com	b0b8ba16798733b5b8d43854ec5570f0b152b6bf1892bb5d4c0e391c85fc040f	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Swift Drain Cleaning Team Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.651	2026-02-18 17:11:40.653	2026-02-18 17:11:40.653	t	0	\N
3747b232-0d7a-4944-846b-a51580a228e5	co-ar-5037cea3-mlsaheup642@demo.marketplace.com	39ac7fd2aa936ed20dc055c7416224abe926279a20cae6919afdafcb07acf263	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة تسليك مجاري المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.657	2026-02-18 17:11:40.659	2026-02-18 17:11:40.659	t	0	\N
db999a75-c6a3-494d-8eea-254adff592df	co-en-a536318f-mlsaheuvdzu@demo.marketplace.com	a065abcd40149feb95c6b7d1a87660d2a7a447b32efdf56e732775f359be2a36	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Star Water Tank Install Co Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.663	2026-02-18 17:11:40.665	2026-02-18 17:11:40.665	t	0	\N
014b31f3-b4df-4c6f-815f-f826ee095b7b	co-ar-a536318f-mlsahev1buc@demo.marketplace.com	516b758bd8c5bcb5e05ae3dd970ccfe459bd4ae1e1185b6a0afa8d9409389ccf	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة تركيب خزانات الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.669	2026-02-18 17:11:40.671	2026-02-18 17:11:40.671	t	0	\N
f0df8991-5e63-463e-973e-11cec0638e48	co-en-dc97169e-mlsahev8o6l@demo.marketplace.com	1eb087a4a7e13e2ad96dd0aac545dfcf9dd7db12431fe382b01c1f5cf9feb0e8	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Swift Pump Installation Works Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.676	2026-02-18 17:11:40.678	2026-02-18 17:11:40.678	t	0	\N
45d44eb9-38f2-4f51-ae85-c9e14a1d9d80	co-ar-dc97169e-mlsahevfhfc@demo.marketplace.com	7badfa4afd3e2e606cbfffd31c18c4f4cabba6595001f86d72b518f4f74838b9	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة تركيب مضخات مياه المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.683	2026-02-18 17:11:40.685	2026-02-18 17:11:40.685	t	0	\N
68187ef5-20a9-4632-b12e-07f04ee1242c	co-en-7049731f-mlsahevlzoi@demo.marketplace.com	d499f02c985f0db3987689f105d559863a581157b157dd51f8ce9e1be2ae111a	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Top Construction Partners Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.689	2026-02-18 17:11:40.691	2026-02-18 17:11:40.691	t	0	\N
28411ee0-719d-4592-bb85-c998a4c29687	co-ar-7049731f-mlsahevrk27@demo.marketplace.com	8c0c664f6bdb008b2700c365a99e8cf7ba87cb47c201c363534891b9b7bc67fb	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة مقاولات المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.695	2026-02-18 17:11:40.697	2026-02-18 17:11:40.697	t	0	\N
61c1d221-d6b1-4215-afc5-db6ecba9ca31	co-en-3905c75e-mlsahevw7sp@demo.marketplace.com	5f62b61e6ebb89e8572a2b6742d8101140de6efc433f273e5c7cecf2063b8c82	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Pro General Contractor Team Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.7	2026-02-18 17:11:40.702	2026-02-18 17:11:40.702	t	0	\N
943cf3bd-ccc0-4a01-aab8-7e4dcf962777	co-ar-3905c75e-mlsahew6d45@demo.marketplace.com	546ae8316dda74b3abddc79d9eed00730407e28e45f61affea391590e04a186d	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة مقاول عام للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.71	2026-02-18 17:11:40.712	2026-02-18 17:11:40.712	t	0	\N
a7c19083-22b9-48cf-bf9f-2a82b84910d5	co-en-5c720069-mlsahewb7jg@demo.marketplace.com	9443ba6dfdd1dd247353905ce5dd2cbabf3b60741c360ab27e9d1750cf3b178c	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Prime Home Renovation Co Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.716	2026-02-18 17:11:40.717	2026-02-18 17:11:40.717	t	0	\N
85f6494d-9167-473f-9947-79447cb6ec0e	co-ar-5c720069-mlsahewluzv@demo.marketplace.com	af350c72501070cf160d1387221879fca9d802cc733848c1a023057927707013	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء ترميم منازل المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.725	2026-02-18 17:11:40.728	2026-02-18 17:11:40.728	t	0	\N
e8709acd-8bf1-4ac5-b778-4317a99eff34	co-en-47186941-mlsahewup1x@demo.marketplace.com	f064f4907e47a0cf2feab8963fa73f7fbc849681b7071c738c40b0c58dad0746	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Prime Kitchen Renovation Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.734	2026-02-18 17:11:40.737	2026-02-18 17:11:40.737	t	0	\N
75c21ff1-0d09-414d-8647-4b892232d1d9	co-ar-47186941-mlsahex2kyj@demo.marketplace.com	1585b79897b696f22622676803ab653cc5cd9b61e02f7c4786805302d11e6002	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء تجديد مطابخ الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.742	2026-02-18 17:11:40.744	2026-02-18 17:11:40.744	t	0	\N
d68d97c7-fef4-4ac1-b6e3-2186d6f854cb	co-en-5db5637c-mlsahexaacu@demo.marketplace.com	3ded8f4d84167b00092612bce98d8bfda037ba0af08bd3cfc13bfefe4940be56	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Star Bathroom Renovation Co Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.751	2026-02-18 17:11:40.754	2026-02-18 17:11:40.754	t	0	\N
735d0b11-045f-46dd-b9a1-0bfc32df08cc	co-ar-5db5637c-mlsahexjf8m@demo.marketplace.com	31bf8fb6770ea080855d998193fc58b332c56279131911b51cbe69d2304ea7dc	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة تجديد حمامات المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.76	2026-02-18 17:11:40.762	2026-02-18 17:11:40.762	t	0	\N
8e646713-0a34-4e7d-acf3-129d1d0f63d1	co-en-eb3a5f87-mlsahexsszx@demo.marketplace.com	bf3767c30c63ba65b69f75c9a2a3258d63b318dec8ed849d61e184cee745e72c	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Alpha Tile Installation Experts Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.768	2026-02-18 17:11:40.77	2026-02-18 17:11:40.77	t	0	\N
d6b4ca3a-da86-425f-b40d-cbcf25f44272	co-ar-eb3a5f87-mlsahey0naj@demo.marketplace.com	a562bbf8772cf2583b9a7302f47f972ed1861267d3818b56a616096fed79ea46	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة تركيب بلاط للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.776	2026-02-18 17:11:40.778	2026-02-18 17:11:40.778	t	0	\N
73a938eb-bb07-4959-9878-2de89129e605	co-en-2e57b799-mlsahey77fu@demo.marketplace.com	6822064775d4b240dff3cdb8c51bc5e87d6308af42f52906bfe7d3081a6aae47	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Swift Flooring Installation Agency Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.783	2026-02-18 17:11:40.785	2026-02-18 17:11:40.785	t	0	\N
cfe30cdd-4d8c-40f9-ad59-224dd2f37e86	co-ar-2e57b799-mlsaheyf7q0@demo.marketplace.com	afb2e373623b98b5509f6173e5d58a16cf8f245fe5b1e21bdaa5efec4730e9e1	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة تركيب أرضيات للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.792	2026-02-18 17:11:40.797	2026-02-18 17:11:40.797	t	0	\N
f0a63e32-1d31-4fbb-bc53-e46bc4b90fd3	co-en-84885f89-mlsaheytevk@demo.marketplace.com	74b31159fae92456b2bee44c606a6760e27d475d28bc7cd0dfb47b11c95cf2c7	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Alpha Gypsum Board Team Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.805	2026-02-18 17:11:40.808	2026-02-18 17:11:40.808	t	0	\N
ae927beb-09fc-447c-a063-f06e4fbd047a	co-ar-84885f89-mlsahez1ihv@demo.marketplace.com	ab173bceb18c90c1134cd3a63c23cbec9fc43d38ff2db38374ebc8660720433b	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة جبس بورد المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.813	2026-02-18 17:11:40.815	2026-02-18 17:11:40.815	t	0	\N
763f7d6b-60aa-44ce-9074-c89a8f899fdb	co-en-e9fcae5a-mlsahez8val@demo.marketplace.com	c15a7846f4e18304dee4e963acd7e2347adbc0a9dc7a97eca1585e4563cbbacb	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Elite Painting Services Hub Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.82	2026-02-18 17:11:40.822	2026-02-18 17:11:40.822	t	0	\N
88359a10-d44a-47ee-acef-fb60d2ed0cab	co-ar-e9fcae5a-mlsahezfpgm@demo.marketplace.com	623c7502ee5b3039e46d43436e3f86095e0f7900c140f239bf8f4ca5bc018748	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء دهانات وديكور المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.827	2026-02-18 17:11:40.829	2026-02-18 17:11:40.829	t	0	\N
b18d9727-741a-4bfd-a514-deb789713c5d	co-en-93ad7de3-mlsahezn64o@demo.marketplace.com	299b791ec21b50c0b72aac87bd436b817db5de12412ae07587d0d7cb1e786e8a	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Best Roofing Agency Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.835	2026-02-18 17:11:40.837	2026-02-18 17:11:40.837	t	0	\N
67c10466-2a67-4fd7-845f-07ea928e3c0e	co-ar-93ad7de3-mlsahezuvtg@demo.marketplace.com	52751951959873e77c51a885571e7b1d50f77894b6d794b7047f1e45ae7e8014	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة عزل أسطح المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.842	2026-02-18 17:11:40.844	2026-02-18 17:11:40.844	t	0	\N
219b4f98-940f-45eb-acc9-7bbc263e725b	co-en-5794040d-mlsahf04gyl@demo.marketplace.com	a5e9fa793101f8d2d024bf892610ad4426fe2274715de39c05723f0d9ef06c14	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Apex Concrete & Masonry Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.852	2026-02-18 17:11:40.854	2026-02-18 17:11:40.854	t	0	\N
c48923d9-ff59-4c9f-84f3-1cfed056a633	co-ar-5794040d-mlsahf0cknq@demo.marketplace.com	908ee961eebf089b76f4d7fce5dddf4217db9ea6541f46b46942ccd9b8170394	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة أعمال باطون وبناء للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.861	2026-02-18 17:11:40.865	2026-02-18 17:11:40.865	t	0	\N
b0b5af49-e77a-4218-b189-2a7a92c3e05f	co-en-c0e5b849-mlsahf0nxjc@demo.marketplace.com	b30f3d3367f1b353069cfe45bf997a218cf6a9757c3eb43cea3576144e9a6dd6	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Star Structural Repairs Team Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.871	2026-02-18 17:11:40.874	2026-02-18 17:11:40.874	t	0	\N
1ff6d023-7d1c-4cf7-99ed-473a0bd7eadd	co-ar-c0e5b849-mlsahf0x8mu@demo.marketplace.com	390f796d97e3130e4f04f93e985b111aec137ee97cd8cc897668535f0718189d	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء تدعيم إنشائي المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.881	2026-02-18 17:11:40.883	2026-02-18 17:11:40.883	t	0	\N
5313b531-08a9-4a2e-a28e-82e62a3294b7	co-en-98d60428-mlsahf146px@demo.marketplace.com	6a798a1d3abcfb9217bc7c5ac267047fa9c8378c553df27b2b294ab829a347ad	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Swift Cleaning Experts Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.888	2026-02-18 17:11:40.89	2026-02-18 17:11:40.89	t	0	\N
21a7f254-a00e-4708-bfee-6fc6e1418e2d	co-ar-98d60428-mlsahf1cqdb@demo.marketplace.com	315542ea13664ddf8acca5f9c82c2bf460595dfc2b43e0c222bf8c11e88dcb6e	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز تنظيف المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.896	2026-02-18 17:11:40.898	2026-02-18 17:11:40.898	t	0	\N
2ef1b41b-1a36-48ec-8461-b9138c02bc3a	co-en-459e22dc-mlsahf1o40e@demo.marketplace.com	d7add6eac06a5ce05a9407b2c2e1d225d189a03d2b5f0bf629a21c7432af675a	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Prime Home Cleaning Works Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.908	2026-02-18 17:11:40.91	2026-02-18 17:11:40.91	t	0	\N
a198b956-8cfb-4892-8e30-40c210a4f4c1	co-ar-459e22dc-mlsahf1wu4s@demo.marketplace.com	064bc6889de10da6e8850eaf41425848ee382543740f61f9b03684c71c974635	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة تنظيف منازل للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.917	2026-02-18 17:11:40.92	2026-02-18 17:11:40.92	t	0	\N
b277c5a5-f913-472e-9962-29be2890acc2	co-en-b63a2fe5-mlsahf26i6g@demo.marketplace.com	936ca2e21a2c8fa50068d542082686b42c2631d74f5d04089218431821f937e7	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Pro Deep Cleaning Agency Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.926	2026-02-18 17:11:40.929	2026-02-18 17:11:40.929	t	0	\N
206dfa0d-c614-42a6-9ede-865e66768b98	co-ar-b63a2fe5-mlsahf2gavm@demo.marketplace.com	064a8ef7b8e5f01275904417e7f89472e6885b37334663d4f41f6677e71294ef	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة تنظيف عميق المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.937	2026-02-18 17:11:40.939	2026-02-18 17:11:40.939	t	0	\N
391ffbac-ec9a-4496-9b7c-30bbb55f858c	co-en-fcd17d77-mlsahf2n3mj@demo.marketplace.com	4601e895e0310f61285e69990f5a2243afb984b5c335258f82f6d72217e43a51	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Top Office Cleaning Agency Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.943	2026-02-18 17:11:40.945	2026-02-18 17:11:40.945	t	0	\N
d80c3bee-2c3d-4684-9ea3-069735ae3f27	co-ar-fcd17d77-mlsahf2ubih@demo.marketplace.com	71516e6b9c1dc822c75f393fa97690b87fa05e66a7c1c4be69f8c854c125c7d3	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة تنظيف مكاتب المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.95	2026-02-18 17:11:40.952	2026-02-18 17:11:40.952	t	0	\N
cd52c9c0-5a4d-4ade-a8b3-ccb5bf414380	co-en-37316c32-mlsahf2za5h@demo.marketplace.com	6c34ef0f20e922da0ffa888273ac15692d7f55dcce0386405847a3a1342ccfbf	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Apex Post-Construction Partners Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.955	2026-02-18 17:11:40.957	2026-02-18 17:11:40.957	t	0	\N
2ed0daed-6856-4924-96ab-f0d13172a34b	co-ar-37316c32-mlsahf36lrn@demo.marketplace.com	05d50e377c91334741c43010eaec0901c9fb65ca9c18cb704ae5978f2af973df	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز تنظيف بعد البناء المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.962	2026-02-18 17:11:40.964	2026-02-18 17:11:40.964	t	0	\N
d49d8464-e722-42d3-afcd-e0e08b3b8fd7	co-en-b51d67bd-mlsahf3culp@demo.marketplace.com	1cb2bbeb221f30b60124b3affe40cb96aed5400942a3f5ceb24bb150853e06ad	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Pro Carpet Cleaning Hub Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.968	2026-02-18 17:11:40.97	2026-02-18 17:11:40.97	t	0	\N
d99b37e9-eb86-4204-a848-0413ffe81365	co-ar-b51d67bd-mlsahf3j6xw@demo.marketplace.com	65d5f02c34be660b7f356c75b6bf3f810b5d5ae74d931767ef520cde5f46372e	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز تنظيف سجاد وموكيت المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.975	2026-02-18 17:11:40.977	2026-02-18 17:11:40.977	t	0	\N
c8598814-86f2-4861-b52c-d7e480ff814d	co-en-be163dd8-mlsahf3pha0@demo.marketplace.com	779cc8b894da12d4cb0569659ec216119366db79526272f8ff3c646cac850da3	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Swift Sofa Cleaning Solutions Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.981	2026-02-18 17:11:40.983	2026-02-18 17:11:40.983	t	0	\N
eac4eed1-371f-4440-ad4b-871744aa8984	co-ar-be163dd8-mlsahf3v356@demo.marketplace.com	f2f5c28c1b9cb08f93be17cd96ef2d4904bcd6d83dff0aed4bdca486138f657d	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز تنظيف كنب ومفروشات للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.987	2026-02-18 17:11:40.99	2026-02-18 17:11:40.99	t	0	\N
f7dee9c3-b6aa-4d7e-b70e-7b77b165f109	co-en-70eeca24-mlsahf42ulq@demo.marketplace.com	88dfbba7576f94cc4ac0982e03cfff15fd630c71f83ac9a4c6a91641d8cfcc3a	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Elite Window Cleaning Experts Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:40.994	2026-02-18 17:11:40.996	2026-02-18 17:11:40.996	t	0	\N
6aa4af89-1090-4508-b90c-9d41b9284746	co-ar-70eeca24-mlsahf47ldf@demo.marketplace.com	6761afb6d535a420371506d24db36af03c7429d06f7ed6a11d376c3641041121	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز تنظيف واجهات زجاجية للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:40.999	2026-02-18 17:11:41.001	2026-02-18 17:11:41.001	t	0	\N
06a50665-9217-43df-a3b6-d5f1e9a36bb9	co-en-0a715def-mlsahf4eqzf@demo.marketplace.com	777025af3648f204f58853b173eaf22307fd7f46f58733988c6cc1cf65aa58b9	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Prime Water Tank Cleaning Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.006	2026-02-18 17:11:41.008	2026-02-18 17:11:41.008	t	0	\N
3f0e11ff-d51b-46a3-b968-dde9381ecc62	co-ar-0a715def-mlsahf4j8qb@demo.marketplace.com	c237a9635a58fb699d39363bac1be9b5ffe0dd3ae76f4d944ff95dffcba04d4b	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة تعقيم خزانات المياه المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.012	2026-02-18 17:11:41.014	2026-02-18 17:11:41.014	t	0	\N
e45c2222-6280-4538-8b63-b404d0e5aaad	co-en-2f34e68f-mlsahf4sw00@demo.marketplace.com	181a67e28ee5f16b2f4fdda634618f3c3acf3fb1615101ea4b575e884a8859a2	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Alpha Disinfection Services Team Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.02	2026-02-18 17:11:41.022	2026-02-18 17:11:41.022	t	0	\N
fd13f70c-61eb-4f0a-9aed-31b3e2cc024b	co-ar-2f34e68f-mlsahf4x8t9@demo.marketplace.com	f5da5ddefeeac6705c21e07778fc23557170fd0b5117af4e54b51f54d4024595	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز خدمات تعقيم شامل المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.025	2026-02-18 17:11:41.027	2026-02-18 17:11:41.027	t	0	\N
287bad21-366b-4fb9-8063-f3d31965d548	co-en-d69b3ed6-mlsahf54rzl@demo.marketplace.com	59d57acf08aa7739e8bc6e47be4bdb503de801a9bdf5e588e0e66d569ef58dea	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Expert Moving Agency Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.033	2026-02-18 17:11:41.034	2026-02-18 17:11:41.034	t	0	\N
c4c667aa-d0aa-4377-a92b-53e7a9f08255	co-ar-d69b3ed6-mlsahf5ao0p@demo.marketplace.com	1ac096116e1235b8fa663cd603fdcaa48f8bf468834974138cc45a0f7fcb3ff1	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة نقل عفش للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.038	2026-02-18 17:11:41.04	2026-02-18 17:11:41.04	t	0	\N
c35aa196-7c98-4b2a-9cee-6ee9546e2a19	co-en-24ca6098-mlsahf5hmr0@demo.marketplace.com	a1a4fca56cefc960371b43333d27fcb3f956999244b39188e2eeab454dd7527f	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Alpha Furniture Moving Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.045	2026-02-18 17:11:41.047	2026-02-18 17:11:41.047	t	0	\N
702c4539-3155-4942-9bf7-333827fcff1f	co-ar-24ca6098-mlsahf5m99c@demo.marketplace.com	2f0590a54fd904c3837b82885c09e4dd4a4456bce9af78953931bd90ef69c6cc	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة نقل أثاث المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.051	2026-02-18 17:11:41.053	2026-02-18 17:11:41.053	t	0	\N
ae3e853c-6817-49cf-971a-b752ea1c4d0d	co-en-a3529217-mlsahf5s1xq@demo.marketplace.com	d67cac1e37becc7ddf8724f6c3dda9030f4ea8dc9945c1edcbc051250a9aecad	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Swift House Moving Experts Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.057	2026-02-18 17:11:41.06	2026-02-18 17:11:41.06	t	0	\N
665aaea9-a27f-4458-8851-9962c183cf35	co-ar-a3529217-mlsahf62xll@demo.marketplace.com	b6653a800777f64363e8d933aa2001aafd7ca38224a4c9b071c4f6734cf93d21	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز نقل منازل للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.066	2026-02-18 17:11:41.068	2026-02-18 17:11:41.068	t	0	\N
58809954-83a1-422f-aec7-d4483807247d	co-en-0cfccd84-mlsahf6a685@demo.marketplace.com	9b1a1ce86602d0f22411d39fd146f91190eb30bc911fb26d4b8e706869e31c81	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Pro Office Moving Co Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.074	2026-02-18 17:11:41.076	2026-02-18 17:11:41.076	t	0	\N
4b3a1040-2897-45c3-85c7-13769aa6ca4e	co-ar-0cfccd84-mlsahf6fiuz@demo.marketplace.com	68225147f5ea406f37f7b842afca81d02d75a04e80c3b10fc9a5c5d66169b208	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة نقل مكاتب وشركات المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.079	2026-02-18 17:11:41.081	2026-02-18 17:11:41.081	t	0	\N
0d57a830-3fb6-427b-bcb0-c1ddff25b1b9	co-en-0c79abc5-mlsahf6mfzr@demo.marketplace.com	7a15232cd62f91247fa4698f74091f739aa52e5ee37c8ca791132a66a08e18ff	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Expert Packing Services Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.086	2026-02-18 17:11:41.088	2026-02-18 17:11:41.088	t	0	\N
66b2454a-affe-4262-b11d-3b53191b0a89	co-ar-0c79abc5-mlsahf6s98y@demo.marketplace.com	3208d0d277e57758ff028dd06dd2aded64435082eff9ca233728f3832ab30556	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء خدمات تغليف للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.092	2026-02-18 17:11:41.094	2026-02-18 17:11:41.094	t	0	\N
ca3db9f5-4cb0-4377-ac2d-4ff73fdba186	co-en-a42fec55-mlsahf6ybxa@demo.marketplace.com	017eab8707478aba85aab0a30be525e95bc59aaf21ffbfc9e98bc2d84009fc34	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Top Storage Services Co Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.099	2026-02-18 17:11:41.102	2026-02-18 17:11:41.102	t	0	\N
b53783b7-7687-4cf8-a6ae-bc23cfa3ec9d	co-ar-a42fec55-mlsahf76nzo@demo.marketplace.com	9d7ce08891c6f7a87efccef732ce36a2b1122eb893bf22e0e185295e46a9cacd	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة خدمات تخزين للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.106	2026-02-18 17:11:41.108	2026-02-18 17:11:41.108	t	0	\N
e9a7c07f-4465-4590-b0bd-ac0a6b811280	co-en-61452801-mlsahf7dipb@demo.marketplace.com	cf363175787cec84d61e59575d7e1e380146042066cd1459c762fc2befb89b87	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Alpha Equipment Transport Group Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.113	2026-02-18 17:11:41.116	2026-02-18 17:11:41.116	t	0	\N
f31209f3-92a3-4c38-9400-6b0fbc97bf6d	co-ar-61452801-mlsahf7j5fw@demo.marketplace.com	905cefbd6830d7b907df585e46629db631b80e5cc7c74d3537acdeb6c7bd912d	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء نقل معدات الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.119	2026-02-18 17:11:41.121	2026-02-18 17:11:41.121	t	0	\N
0f9f89c0-6330-475d-b0d2-aff9ceeaea73	co-en-e0ea0aaf-mlsahf7okdu@demo.marketplace.com	c447b48d110a6c50f1dd87cf5b409fed7b8b1162c7afe808928f337af25e9813	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Elite Local Delivery Experts Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.124	2026-02-18 17:11:41.126	2026-02-18 17:11:41.126	t	0	\N
f1db7e7b-1ad8-4994-9f9e-d27dc838b324	co-ar-e0ea0aaf-mlsahf7w0n2@demo.marketplace.com	52e45e5940bc230c42622e4fae883d391b2c29f2dba249badf40a2007e79670a	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة توصيل بضائع محلي المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.132	2026-02-18 17:11:41.134	2026-02-18 17:11:41.134	t	0	\N
0e83bd4c-b390-41d3-8349-6719a8cc2006	co-en-cfaf55d4-mlsahf82kbg@demo.marketplace.com	5b4ed2988af5c1c6b67cde0b0b4e6bb9bcb7e619d690bf864b5d73556e30f5bb	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Alpha Heavy Equipment Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.138	2026-02-18 17:11:41.14	2026-02-18 17:11:41.14	t	0	\N
33c25a72-7632-4d3c-90fa-00aa7cd55544	co-ar-cfaf55d4-mlsahf8a342@demo.marketplace.com	9a483f946939a4dd3ea9af9eb0379b48572863279de1ed7a77da501b2028e238	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز نقل معدات ثقيلة المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.146	2026-02-18 17:11:41.148	2026-02-18 17:11:41.148	t	0	\N
a417c192-16a3-47e2-83e2-6665269563fe	co-en-c5168990-mlsahf8g3aj@demo.marketplace.com	4eaa7bd6162585380e076968bc400a332c19d7aa52eb9a317e66da151763590a	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Prime AC Installation Co Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.152	2026-02-18 17:11:41.154	2026-02-18 17:11:41.154	t	0	\N
04dc41ff-d4b6-472f-a5b1-ab83f6bb0cab	co-ar-c5168990-mlsahf8nfit@demo.marketplace.com	d05dccdddeac81d460b42926837f8cc33905c641e4dd94ed0e5ddbd76918ea57	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة تركيب مكيفات المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.159	2026-02-18 17:11:41.161	2026-02-18 17:11:41.161	t	0	\N
3dbacd10-e479-438b-8919-69dc2daf2ac7	co-en-9ac120a7-mlsahf8siva@demo.marketplace.com	58586efd7a724cd80f207360ea4c1e65bc5f321eef441b57b6a04f8d6f22564d	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Prime Electrical Wiring Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.164	2026-02-18 17:11:41.166	2026-02-18 17:11:41.166	t	0	\N
d7212165-de51-46ba-afd9-753bd7c8ad90	co-ar-9ac120a7-mlsahf8zqlr@demo.marketplace.com	758a1d5bf14ae8b34dfefbb4301617aaf3678aeddc5098cf9803121214e6936b	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة تمديدات كهربائية المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.171	2026-02-18 17:11:41.173	2026-02-18 17:11:41.173	t	0	\N
8753c12a-d43e-44bb-9aae-13a5979492a6	co-en-8981ac1a-mlsahf95lly@demo.marketplace.com	1c4b9a9c7949a48847f29a6ecdecde8881f0966ea66da4c5f4a6d400a27fc015	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Prime Electrical Repairs Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.177	2026-02-18 17:11:41.18	2026-02-18 17:11:41.18	t	0	\N
983459b2-b391-42c6-9a83-d49639abe660	co-ar-8981ac1a-mlsahf9ewed@demo.marketplace.com	041c71eb91d65175f36d81b5010ceb2baa06e4e5618b95efa77b7300abbb2cd0	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة إصلاح أعطال كهرباء للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.186	2026-02-18 17:11:41.188	2026-02-18 17:11:41.188	t	0	\N
fb2173ed-4557-472d-9997-8de481c985b7	co-en-b18f064e-mlsahf9jd1h@demo.marketplace.com	8005f6eae2d13a2625d8b34f5c7dfcbdc9456cbdf51a3473e58b97e50de0d875	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Top Lighting Install Experts Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.192	2026-02-18 17:11:41.194	2026-02-18 17:11:41.194	t	0	\N
3e11f30c-114b-4aed-9ab6-533a20657d84	co-ar-b18f064e-mlsahf9rnx9@demo.marketplace.com	a9b214aadd6b6a31758ac2974fdd25557bedb737f516e5dde2713dcdded55ca1	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة تركيب إنارة الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.199	2026-02-18 17:11:41.2	2026-02-18 17:11:41.2	t	0	\N
5997993f-b1a9-4d72-8bc2-17a4487dac76	co-en-4acb75e6-mlsahf9weg7@demo.marketplace.com	81f42897c08db82c58f9a19d518df7328837403be6331d8c7f20f4f41525593d	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Apex Generator Maintenance Solutions Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.204	2026-02-18 17:11:41.206	2026-02-18 17:11:41.206	t	0	\N
b01ce7dd-86e3-4302-888c-c0c467c1b0fd	co-ar-4acb75e6-mlsahfa1hqt@demo.marketplace.com	610d85a2ad127c8f90c36fd4c5ca7a427d038fd23e1c584b9029aebad39cdb90	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة صيانة مولدات المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.209	2026-02-18 17:11:41.212	2026-02-18 17:11:41.212	t	0	\N
da1a96a5-0238-41d0-83f5-92872e345ca7	co-en-3d4fec38-mlsahfabfc2@demo.marketplace.com	00f06fe84a08ffd5a01bf05bff71cb1f6eaad6a8aa994fcdf3e48209079d021b	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Swift Solar Panel Install Partners Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.219	2026-02-18 17:11:41.221	2026-02-18 17:11:41.221	t	0	\N
55618e79-712e-4ee0-afdf-f96133bae7ba	co-ar-3d4fec38-mlsahfai907@demo.marketplace.com	aa94a10f85808f73a1d2d36d4bd3e357897d2fdf9e0b6aa351043fba92d49712	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز تركيب طاقة شمسية الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.226	2026-02-18 17:11:41.228	2026-02-18 17:11:41.228	t	0	\N
6572478b-4699-4045-97e9-3043e273ae7a	co-en-0def337f-mlsahfaniub@demo.marketplace.com	c7c9f6a9d9aec7fb7e4952294a9dadadd37b65bc159ca1fa39ab68a3f1dc322b	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Star Solar System Maint Partners Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.231	2026-02-18 17:11:41.233	2026-02-18 17:11:41.233	t	0	\N
80d940d2-4cce-4087-82bf-a2f46b047b95	co-ar-0def337f-mlsahfatcsp@demo.marketplace.com	e586d9c39507eb47916fb10207066be4e5e4b6436abe241b3c525d1d55470182	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة صيانة طاقة شمسية المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.237	2026-02-18 17:11:41.239	2026-02-18 17:11:41.239	t	0	\N
fd7351e8-b72a-4648-aaed-9bf59e4521e5	co-en-38cb0fe6-mlsahfaz2jq@demo.marketplace.com	c47c4218fdd1c2db7d305869dd2673fcf23b0d9a8e8cd9094a8d34aa3ba9a7b8	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Swift Electrical Panel Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.243	2026-02-18 17:11:41.245	2026-02-18 17:11:41.245	t	0	\N
d73ede55-b61a-4da1-a490-d3eb6af1087f	co-ar-38cb0fe6-mlsahfb43rn@demo.marketplace.com	c2edd75ec7eda23d366177e48293efa278298cd011f091c4ef0a49fcbafa6905	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة تركيب لوحات كهرباء الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.248	2026-02-18 17:11:41.25	2026-02-18 17:11:41.25	t	0	\N
a2ed2291-7a9b-4198-87ee-8d0b75631494	co-en-c79261af-mlsahfba9as@demo.marketplace.com	680b439fe533952e4d0b0b585b66bcaf6e32ee30cbec9b020be0e18e54187513	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Best Backup Power Systems Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.254	2026-02-18 17:11:41.256	2026-02-18 17:11:41.256	t	0	\N
550a0c57-25aa-49be-bc07-ef7a7a2794e2	co-ar-c79261af-mlsahfbfrd4@demo.marketplace.com	2c2c9f0d7aa121f8b159ffae59254847411ef9fd098b5721ed0011d741769586	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز أنظمة طاقة احتياطية المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.259	2026-02-18 17:11:41.261	2026-02-18 17:11:41.261	t	0	\N
5801db4f-b3b5-41e6-afe0-c73f239acdce	co-en-b52de601-mlsahfblh57@demo.marketplace.com	e23f9842f1dba60955c62965c61ae9154030d671cb1b2f01c137d4c528a7f3f2	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Top Leak Detection & Repair Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.265	2026-02-18 17:11:41.267	2026-02-18 17:11:41.267	t	0	\N
f915186c-edab-4a8a-acd2-edc2670763c0	co-ar-b52de601-mlsahfbryge@demo.marketplace.com	c4d1f6a7e5ebbf66de14a6e08a1cf5376cbea2b4f4669b7aa00b0418754ae4cc	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة كشف وإصلاح تسربات المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.271	2026-02-18 17:11:41.273	2026-02-18 17:11:41.273	t	0	\N
95bc1e28-2fc9-446d-9ce4-9cd11b09de67	co-en-6805a74f-mlsahfbwryv@demo.marketplace.com	bbd923e374f02cf6db9c35fd3bcd5b1d95b60198cb711088ad890dc45830d783	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Prime Pipe Installation Experts Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.276	2026-02-18 17:11:41.278	2026-02-18 17:11:41.278	t	0	\N
6f4f34a3-766e-4794-8cc7-4fcaa5084007	co-ar-6805a74f-mlsahfc2zu1@demo.marketplace.com	d2d518707814467f5274844a68aa535b7826fd207e33dea5c50e26e835885a57	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز تمديد أنابيب الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.283	2026-02-18 17:11:41.284	2026-02-18 17:11:41.284	t	0	\N
51d69ec2-046e-468c-8506-82f81fc94d60	co-en-65ddaf4f-mlsahfc8d3m@demo.marketplace.com	0b1bebc9af2bbd82de39b8dc63d2ce803d8465dee9cf7717212f15103379f978	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Best Water Heater Install Experts Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.288	2026-02-18 17:11:41.29	2026-02-18 17:11:41.29	t	0	\N
71d79daa-c149-4dee-966a-f2c24d2f620b	co-ar-65ddaf4f-mlsahfcdpr2@demo.marketplace.com	fc7f66489f8f712fc32bc43b278f1cf56f2a7d30164033759b7b077733f6b4a4	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز تركيب سخان مياه الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.293	2026-02-18 17:11:41.296	2026-02-18 17:11:41.296	t	0	\N
eb8c2fe5-2d7e-454e-b752-2e8ed548101a	co-en-487b84b5-mlsahfcjf0c@demo.marketplace.com	c6884c2306a819ad2007259c37a181bdb166ff85f1a070bb0eab36dd26133d20	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Prime Water Heater Repair Team Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.3	2026-02-18 17:11:41.302	2026-02-18 17:11:41.302	t	0	\N
e317300a-0a9c-43f1-9f04-49a7c99d42ea	co-ar-487b84b5-mlsahfcvwxv@demo.marketplace.com	3d7484ade90cc081981d3bb3008bbad543a6f26448bb1ce943c8c2bce6b84243	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة صيانة سخان مياه المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.311	2026-02-18 17:11:41.313	2026-02-18 17:11:41.313	t	0	\N
1ced8951-82e9-4386-b96b-21ab93c74846	co-en-bd693184-mlsahfd3e22@demo.marketplace.com	0d0f0a203386edfbed9fe46e829f0169bcdf77ed09f55b8914c5197914ade8d8	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Prime Bathroom Plumbing Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.319	2026-02-18 17:11:41.323	2026-02-18 17:11:41.323	t	0	\N
dcfbc7e9-370a-4954-9fd0-e9038f6b050d	co-ar-bd693184-mlsahfdcajj@demo.marketplace.com	25b03cc25c18a95a99a2e458949eb34706319ac6d60125fe2ae8c78f20a0dba9	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء سباكة حمامات الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.328	2026-02-18 17:11:41.331	2026-02-18 17:11:41.331	t	0	\N
dfc80419-2af7-492e-90ae-1f33182fa61e	co-ar-e9264c4c-mlsahfdtcg8@demo.marketplace.com	04b45e8c9cdfaa84ba5d514516c85847c86a1749a09788c70912de79863c83c5	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز سباكة مطابخ الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.345	2026-02-18 17:11:41.347	2026-02-18 17:11:41.347	t	0	\N
1c9eafc8-b236-4230-86cf-53bc31844f4d	co-en-dd57d659-mlsahfe5u6u@demo.marketplace.com	81ca9382c31b9959d1c970b6bb17a4a53a02902502807c6e42a3c96902793908	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Pro Accounting Services Hub Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.357	2026-02-18 17:11:41.359	2026-02-18 17:11:41.359	t	0	\N
f36cebb3-23f3-450f-9e02-e2aef07503a7	co-ar-dd57d659-mlsahfechxv@demo.marketplace.com	2e37290151086528e538dcd948ae4d84051bafb3c6ae963cf6c45c67a7324922	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة خدمات محاسبية المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.364	2026-02-18 17:11:41.366	2026-02-18 17:11:41.366	t	0	\N
e3bf7989-b3b1-4138-b7b1-47cf93b0954f	co-en-11552f47-mlsahfeilpw@demo.marketplace.com	a0f072ed6ea48ffad16015610391c8eb2890532cb59e5220b674434ae590c234	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Alpha Legal Consultation Experts Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.37	2026-02-18 17:11:41.372	2026-02-18 17:11:41.372	t	0	\N
2b502400-6faf-4bc0-b414-9ad1d502b010	co-ar-11552f47-mlsahferrd4@demo.marketplace.com	9db12b1b65888196895ded23f564902604ab6e1579d0e9448397a298209d3a5f	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز استشارات قانونية الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.379	2026-02-18 17:11:41.381	2026-02-18 17:11:41.381	t	0	\N
ce7f6c27-4226-4971-bc9b-665c6d76e0bc	co-en-deb10409-mlsahfexlg6@demo.marketplace.com	0c235f0ddb2ee66ddf863c4dbe88727a3d8f8d09ae9708e1d6eceb16cc285da5	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Pro Photography Partners Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.385	2026-02-18 17:11:41.387	2026-02-18 17:11:41.387	t	0	\N
82e1639b-8b2b-43dd-abfb-31ca8cafd4ef	co-ar-deb10409-mlsahff506w@demo.marketplace.com	5697d851e58c19300e867cad23976954da9a373c4c11cf75e1bc71b3b5e27d6b	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز تصوير احترافي المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.393	2026-02-18 17:11:41.395	2026-02-18 17:11:41.395	t	0	\N
b9384a49-f030-4e35-bc81-6dbda9a09684	co-en-5037cea3-mlsahffd9sr@demo.marketplace.com	876adf1e42faebcf5a9f30fe9e31c37416b455785cd7d74b47340d7d765db9ae	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Alpha Drain Cleaning Team Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.401	2026-02-18 17:11:41.403	2026-02-18 17:11:41.403	t	0	\N
f2fedc70-b1a1-44e2-b0df-fd61aafa1c01	co-ar-5037cea3-mlsahffngil@demo.marketplace.com	8da218d66f674b2287c63732207159b578df384fea52203585a6f524e4f778f7	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة تسليك مجاري للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.411	2026-02-18 17:11:41.413	2026-02-18 17:11:41.413	t	0	\N
2b28d76a-9e08-4819-b3db-494d3225b003	co-en-a536318f-mlsahffutcn@demo.marketplace.com	ad90d351503c8b3d2084bc157da1088b540d4379811ceb95337ac8534f23e920	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Apex Water Tank Install Group Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.418	2026-02-18 17:11:41.421	2026-02-18 17:11:41.421	t	0	\N
6b72f3bc-4286-46bc-922f-da61137270f0	co-ar-a536318f-mlsahfg2apj@demo.marketplace.com	cd56fa16b01dd796518de1e19444d84faebe7e205becf4d818d2566dfe0466b6	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة تركيب خزانات الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.426	2026-02-18 17:11:41.428	2026-02-18 17:11:41.428	t	0	\N
88e290d9-148a-4170-931a-15a3a406d534	co-en-dc97169e-mlsahfgbjg2@demo.marketplace.com	7aeb08de49c6698ff1c51f4b70bc35af5cbfd6c1ca4c66f7ac965e4d40b4a1da	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Expert Pump Installation Team Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.435	2026-02-18 17:11:41.438	2026-02-18 17:11:41.438	t	0	\N
5b951b65-6828-427c-addc-54325cadea26	co-ar-dc97169e-mlsahfgkhjz@demo.marketplace.com	a0fc20094f149ce05760d81577f2e59be8236ba5b1602114b5063dc82f2d58e4	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز تركيب مضخات مياه المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.445	2026-02-18 17:11:41.447	2026-02-18 17:11:41.447	t	0	\N
02232b5c-571a-464c-b774-c5afc8212b65	co-en-3905c75e-mlsahfgtx40@demo.marketplace.com	d996867a77c16eff4b85739583f62f442fa5677d91a64a9cf8e83e2b2159eca1	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Elite General Contractor Partners Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.453	2026-02-18 17:11:41.455	2026-02-18 17:11:41.455	t	0	\N
66190256-af93-4386-abb4-94f142d24eb4	co-ar-3905c75e-mlsahfgyomw@demo.marketplace.com	06be0513eb30b223a13f511861d1b0f3514dd8beb3bf4c4e3f9ee5122bea5a39	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة مقاول عام المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.458	2026-02-18 17:11:41.46	2026-02-18 17:11:41.46	t	0	\N
dd3fd528-0178-430d-aad5-188e3d53f625	co-en-5c720069-mlsahfh5r7l@demo.marketplace.com	23493f7aededdc0bb2d013e5c525ea2fd02039c6dfa641b8d38ecc6b7054ca8c	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Prime Home Renovation Solutions Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.465	2026-02-18 17:11:41.467	2026-02-18 17:11:41.467	t	0	\N
732b6f66-bfd3-45ed-9c1a-d971120c01a8	co-ar-5c720069-mlsahfhb89j@demo.marketplace.com	461ced0df31994d2d3d470b479b71deb9ced49bc52c70382f95ee45004295de3	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة ترميم منازل الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.472	2026-02-18 17:11:41.474	2026-02-18 17:11:41.474	t	0	\N
7f7c2f75-cbd2-461e-8883-a5f148c457f6	co-en-47186941-mlsahfhltzt@demo.marketplace.com	b3cfbb67286a53a0f09cb073c443973996d6f950d34ef5ad6812c4b8d649c7c8	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Elite Kitchen Renovation Works Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.481	2026-02-18 17:11:41.483	2026-02-18 17:11:41.483	t	0	\N
0c487a2d-e7e1-496b-a56b-719ef219ae0f	co-ar-47186941-mlsahfhra38@demo.marketplace.com	f1154902040f1d05456e33eccb5fcf263ce032561745fc6248b638218cf3031f	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة تجديد مطابخ المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.487	2026-02-18 17:11:41.489	2026-02-18 17:11:41.489	t	0	\N
f6b84167-90ce-4b83-9df5-624c50bbff51	co-en-5db5637c-mlsahfhy8r5@demo.marketplace.com	a5d738d973a462f5943e6f25477048a5b288930edc0761febdf9ceaa2f46abaa	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Alpha Bathroom Renovation Solutions Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.494	2026-02-18 17:11:41.496	2026-02-18 17:11:41.496	t	0	\N
36e5cd34-ca04-42fd-8b80-67379c4164ac	co-ar-5db5637c-mlsahfi45dz@demo.marketplace.com	438f90aee2fc10121bf5eb81c3c0487d9a488c4616d542b03dffcaa9dcec727c	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة تجديد حمامات للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.5	2026-02-18 17:11:41.502	2026-02-18 17:11:41.502	t	0	\N
c96a1db0-27bc-4a29-a43b-95d9f995e915	co-en-eb3a5f87-mlsahfiaynq@demo.marketplace.com	bd7550529ae5faecf02c8195df31bb6c0003507fd579eabe4a81fc379b15a3d7	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Apex Tile Installation Co Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.506	2026-02-18 17:11:41.508	2026-02-18 17:11:41.508	t	0	\N
de9773e3-3f99-4aae-bbf2-491288edf6f0	co-ar-eb3a5f87-mlsahfiff01@demo.marketplace.com	429eb7aa4ac6fed2d0c81a54377e5bdd1765d5bdb057d71a294686c9ccf07335	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة تركيب بلاط المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.511	2026-02-18 17:11:41.513	2026-02-18 17:11:41.513	t	0	\N
ddace876-6789-42c2-9f48-c4a99d8afb8b	co-en-2e57b799-mlsahfilll6@demo.marketplace.com	4fa4485e46fdc7d2afeb4c71e2d2aaccef73332d524439e5d69dc40cba38448e	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Top Flooring Installation Agency Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.518	2026-02-18 17:11:41.519	2026-02-18 17:11:41.519	t	0	\N
7d87746e-cb49-444b-b1ee-08de26c8167f	co-ar-2e57b799-mlsahfirmgo@demo.marketplace.com	b70ac3af87817a1eda1e9c1d918f1c4d9adc0a63960511d6a7561b2d1061a81f	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة تركيب أرضيات المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.523	2026-02-18 17:11:41.525	2026-02-18 17:11:41.525	t	0	\N
73e51220-0138-4620-90f8-d81db2c1cd40	co-en-84885f89-mlsahfivj55@demo.marketplace.com	891c427ab74c571c18275180e38904b4763390dd3bb443e6de86beda78963351	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Best Gypsum Board Experts Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.528	2026-02-18 17:11:41.53	2026-02-18 17:11:41.53	t	0	\N
fa5b4290-8f69-4b54-98db-62bf60405727	co-ar-84885f89-mlsahfj453y@demo.marketplace.com	6c35612e46153b08269cb94cbc95a634cc0374f5989b0bea49a83bd6e9d148a9	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز جبس بورد للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.536	2026-02-18 17:11:41.538	2026-02-18 17:11:41.538	t	0	\N
7e8f59dc-cc17-4b70-9bf8-e7fd5839d840	co-en-e9fcae5a-mlsahfj977q@demo.marketplace.com	10a90bbb312a08f5b809a30cce8349985e04c2f7c60a025264ac438fcf1bbd71	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Prime Painting Services Hub Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.541	2026-02-18 17:11:41.543	2026-02-18 17:11:41.543	t	0	\N
4a53151a-df85-4799-9a5b-67ec65e6fd15	co-ar-e9fcae5a-mlsahfjf09d@demo.marketplace.com	e198127784d4bfcadf28756a61006789e963d549b5522bc32285895f34220fcf	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء دهانات وديكور للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.547	2026-02-18 17:11:41.549	2026-02-18 17:11:41.549	t	0	\N
11741cc1-cea6-44b8-9636-5b7cebf75be9	co-en-93ad7de3-mlsahfjkunm@demo.marketplace.com	9e5e3616a2706836e9f2744c3aa09500b4e544822970475cef9dafc583a50172	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Elite Roofing Works Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.552	2026-02-18 17:11:41.554	2026-02-18 17:11:41.554	t	0	\N
15bb988b-f630-4fed-a6ed-b143ae5b963c	co-ar-93ad7de3-mlsahfjrs1y@demo.marketplace.com	f9a5e287aa2ca08708f296a007392fc3db01ee8aaa0750de147a04b35ceda081	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء عزل أسطح المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.56	2026-02-18 17:11:41.562	2026-02-18 17:11:41.562	t	0	\N
623cf24f-8dea-4bba-b61e-52685553aead	co-en-5794040d-mlsahfjxx3e@demo.marketplace.com	b81fca4d54dbf551c489966493ad2c41d22930b1e10df77fba0dd1784095b055	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Apex Concrete & Masonry Agency Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.566	2026-02-18 17:11:41.567	2026-02-18 17:11:41.567	t	0	\N
2b309f45-938b-4bbf-ab8d-dfd03a6ae605	co-ar-5794040d-mlsahfk3wci@demo.marketplace.com	6593b38fc12edec6a691d09732a08920494e403728a614406c29038c6ed3ba4e	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء أعمال باطون وبناء المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.571	2026-02-18 17:11:41.573	2026-02-18 17:11:41.573	t	0	\N
cddeb485-1b3b-4b17-94b4-92bd322e316e	co-en-c0e5b849-mlsahfk8c83@demo.marketplace.com	34f9c0cfc5c376dc7bdadcc3253c4c3b4cc97aefb5db17533860c02e535c6163	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Prime Structural Repairs Team Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.576	2026-02-18 17:11:41.579	2026-02-18 17:11:41.579	t	0	\N
dbd5e625-e76f-4232-80b0-9086584f8d7a	co-ar-c0e5b849-mlsahfke9sz@demo.marketplace.com	502f2934e564797405355fb16bfea4d62345105e0b8f54f70b55133b73ff2b83	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة تدعيم إنشائي المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.582	2026-02-18 17:11:41.584	2026-02-18 17:11:41.584	t	0	\N
b259d10b-b50b-4879-98c5-d490722d7215	co-en-459e22dc-mlsahfkkkvm@demo.marketplace.com	9f2939527af0891c5c615d254d9d3951afc1ca17c0a283f2566cecfe62e92fd5	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Top Home Cleaning Co Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.588	2026-02-18 17:11:41.59	2026-02-18 17:11:41.59	t	0	\N
6bb3dd85-4c86-4f0d-b156-91ece787dff8	co-ar-459e22dc-mlsahfkpkmx@demo.marketplace.com	87549f0ed0afea0dc6ecd91bae9c2c420e9640bef1ea6e35f05acb366b884b33	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة تنظيف منازل المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.593	2026-02-18 17:11:41.595	2026-02-18 17:11:41.595	t	0	\N
85526136-5e32-4690-981c-3aaf533a15c8	co-en-b63a2fe5-mlsahfkwz1h@demo.marketplace.com	5f88c570e7abe8aa00e570e8a845034cf32c1425d86a71eda71ec391e73f3d55	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Swift Deep Cleaning Co Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.6	2026-02-18 17:11:41.602	2026-02-18 17:11:41.602	t	0	\N
560d034e-621b-49cd-98ff-8f74acbba2c9	co-ar-b63a2fe5-mlsahfl2j50@demo.marketplace.com	368fa4b327c64719cf1cbf04e9c3eb304b09e3800cb59c6b89b6a3c82bbab15f	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة تنظيف عميق الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.606	2026-02-18 17:11:41.608	2026-02-18 17:11:41.608	t	0	\N
d673fa62-c6a3-4c2b-88dd-7bb6e1e7f716	co-en-fcd17d77-mlsahfl7mhu@demo.marketplace.com	f3305e66d69206d7167c7e946ce473ee29ca5688afdd92c272c07d20af7fc3cb	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Top Office Cleaning Team Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.611	2026-02-18 17:11:41.614	2026-02-18 17:11:41.614	t	0	\N
c5b69370-8261-40f3-b78a-767cecbb952e	co-ar-fcd17d77-mlsahfleqk3@demo.marketplace.com	6f50838504dbfd70e8fe3a5624c8837fc1def1c4919016a387bd90452421b3c9	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة تنظيف مكاتب المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.618	2026-02-18 17:11:41.62	2026-02-18 17:11:41.62	t	0	\N
ebb5943d-7717-445f-8207-913f531440be	co-en-37316c32-mlsahfljt8s@demo.marketplace.com	e801913a21cdc537986fda28d8b2dbe7eee6870be2430b7cf68326cb4de9e8ed	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Star Post-Construction Solutions Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.623	2026-02-18 17:11:41.625	2026-02-18 17:11:41.625	t	0	\N
51ab4052-cc7a-437e-a705-25e88ad9f13b	co-ar-37316c32-mlsahflq51s@demo.marketplace.com	17e3e794ca2e1c5086d06898a5511a2f0cf5c52cf5e614f1da6ef6b072da53b0	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء تنظيف بعد البناء المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.63	2026-02-18 17:11:41.632	2026-02-18 17:11:41.632	t	0	\N
cba1c8e1-d0b2-47ae-8ba0-e833fb290fae	co-en-b51d67bd-mlsahflx6kq@demo.marketplace.com	6810530411aa90802e850b8204dc69bc4d16233761648951cbaef18122eb03b1	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Pro Carpet Cleaning Partners Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.637	2026-02-18 17:11:41.64	2026-02-18 17:11:41.64	t	0	\N
c2653f93-6b22-4d7a-aa7a-c11919c048bf	co-ar-b51d67bd-mlsahfm537i@demo.marketplace.com	90de794a38ba89674d65597b736901f7f7b565655e54d9e4262f09061cf62d61	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة تنظيف سجاد وموكيت المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.645	2026-02-18 17:11:41.646	2026-02-18 17:11:41.646	t	0	\N
30e1c34a-cb97-4658-9505-1aa33097d00f	co-en-be163dd8-mlsahfmax0x@demo.marketplace.com	098c84a4b04afa1ee4f382a8c60df635f2be9504bdbb2c09be51b8e0cdc316da	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Star Sofa Cleaning Hub Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.65	2026-02-18 17:11:41.652	2026-02-18 17:11:41.652	t	0	\N
6a1fadd7-2902-4dcf-a978-11b57d364031	co-ar-be163dd8-mlsahfmf2nb@demo.marketplace.com	27bce34c80b7accf4eec9335a370976eac3dbe62c7262e8733e1f6dde160751f	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء تنظيف كنب ومفروشات للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.656	2026-02-18 17:11:41.658	2026-02-18 17:11:41.658	t	0	\N
70bb61c6-ec8b-4148-b9ad-1442e20d1df1	co-en-70eeca24-mlsahfml5rk@demo.marketplace.com	9e5a847deb7bc852293241110e63c7e75f5c2907c55935ef37d533d2266d1a33	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Swift Window Cleaning Hub Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.662	2026-02-18 17:11:41.663	2026-02-18 17:11:41.663	t	0	\N
e5260403-5ddf-43b9-b3cc-1216ea2ac526	co-ar-70eeca24-mlsahfmraad@demo.marketplace.com	d755bf3120f64b35c64c817ef4982ab84fb86866a9567f1ff0ba7ce4545c875b	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز تنظيف واجهات زجاجية المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.667	2026-02-18 17:11:41.669	2026-02-18 17:11:41.669	t	0	\N
6bf09618-37cb-43a7-aadf-abbaba5c288e	co-en-0a715def-mlsahfmydju@demo.marketplace.com	7ad269f7f8ce09512c98adb73184ce7183509028b6384110b5047235a2a1a5c8	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Star Water Tank Cleaning Agency Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.674	2026-02-18 17:11:41.676	2026-02-18 17:11:41.676	t	0	\N
eec71ed8-1f5b-4546-8293-259f3e016371	co-ar-0a715def-mlsahfn33p0@demo.marketplace.com	8b7576a320a5a9f01a12348d36f920b006ff7174c5004191f7e972d9982f8ed7	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة تعقيم خزانات المياه المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.679	2026-02-18 17:11:41.681	2026-02-18 17:11:41.681	t	0	\N
304baca0-32dd-41c3-a3c6-27b776ae8056	co-en-2f34e68f-mlsahfnar6g@demo.marketplace.com	57b1dc966889a2240f8113d05ad3e1d4adf8129bd96dabce63362cdc2dd401f3	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Best Disinfection Services Experts Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.686	2026-02-18 17:11:41.688	2026-02-18 17:11:41.688	t	0	\N
23633c6a-4af7-42ed-9540-d5cb8673052d	co-ar-2f34e68f-mlsahfnfew8@demo.marketplace.com	1d0432faefdaf04ba3904b2088fd49dd5b0442a4ab1f132da19e9e49562c5b5a	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز خدمات تعقيم شامل المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.691	2026-02-18 17:11:41.693	2026-02-18 17:11:41.693	t	0	\N
de5962b7-21ea-425c-8a4c-8bca031b721f	co-en-24ca6098-mlsahfnl2km@demo.marketplace.com	2fb4a290b065e6d136de105f3ff815824593be1a9ef4b4c8a7918d136546bbbd	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Prime Furniture Moving Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.697	2026-02-18 17:11:41.699	2026-02-18 17:11:41.699	t	0	\N
7fa673b5-f717-4f97-924f-c38cc9959b37	co-ar-24ca6098-mlsahfnrvzl@demo.marketplace.com	09c03e7922338cf97f6ee6de744c42c508505a970c0863dea5fc7bbb2b6478fe	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة نقل أثاث المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.703	2026-02-18 17:11:41.705	2026-02-18 17:11:41.705	t	0	\N
599adaba-ef92-4bec-87d8-fc5642e56331	co-en-a3529217-mlsahfnwrgh@demo.marketplace.com	5734da78948f3c056d727e80ac4d74282c232689d2213e8ae74422c87ff25e3f	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Expert House Moving Agency Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.708	2026-02-18 17:11:41.71	2026-02-18 17:11:41.71	t	0	\N
55c87b89-584e-4b83-b46b-9a20fd382c3a	co-ar-a3529217-mlsahfo2c3y@demo.marketplace.com	00a9d96c28ec3dec2c9a02f6d6f4243d6e37fc2a9cc96d5849dc95f7d6f0ef1a	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز نقل منازل الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.714	2026-02-18 17:11:41.716	2026-02-18 17:11:41.716	t	0	\N
74c84929-6d74-417f-8d14-5d98f201e4ef	co-en-0cfccd84-mlsahfo8xe0@demo.marketplace.com	b409d5799cbdb2c036b8e35168a64a0da391f2e93b2064e3549114478d56a657	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Swift Office Moving Works Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.721	2026-02-18 17:11:41.723	2026-02-18 17:11:41.723	t	0	\N
24372f8b-c1a0-4c13-9272-ad0a5f8dfba8	co-ar-0cfccd84-mlsahfogz97@demo.marketplace.com	09a7f7912ec1e07668bedc5b35a369865dae1f95f764452fddec885bc6e6c005	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة نقل مكاتب وشركات المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.728	2026-02-18 17:11:41.73	2026-02-18 17:11:41.73	t	0	\N
019f2231-8f94-4aba-b806-c2f389376389	co-en-0c79abc5-mlsahfompxe@demo.marketplace.com	528be218b467c3f0833dcdba16c7ae6fc17ab69320688a4b43b750d3ddbb3efc	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Prime Packing Services Solutions Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.734	2026-02-18 17:11:41.736	2026-02-18 17:11:41.736	t	0	\N
27293b4f-f737-4d67-ab1c-5412e61eda8a	co-ar-0c79abc5-mlsahfos7oi@demo.marketplace.com	2888064b6389dd4dbbece42b4cc6f0f5560cff25da2ad40cbb822c046851fc0d	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة خدمات تغليف المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.74	2026-02-18 17:11:41.742	2026-02-18 17:11:41.742	t	0	\N
992a85a6-c39e-4f67-b7c9-043b1b3e05e5	co-en-a42fec55-mlsahfoyhnq@demo.marketplace.com	0b3fa7919c8178da0a71246d9390f6f42514babb04116b91fcf06121f687b8a2	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Best Storage Services Agency Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.746	2026-02-18 17:11:41.748	2026-02-18 17:11:41.748	t	0	\N
52f38995-cf50-46e7-8c30-6bdfa2d7fd84	co-ar-a42fec55-mlsahfp3x4z@demo.marketplace.com	0efab5bd4eb020242d145db3b76c91ab585da4db8ac7670a81bcb9d1a79974dd	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة خدمات تخزين الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.751	2026-02-18 17:11:41.753	2026-02-18 17:11:41.753	t	0	\N
52ce8591-9e6d-46f8-b2b2-f9400bbad8be	co-en-534cc6e7-mlsahfpawn8@demo.marketplace.com	e6c565e530fc610d5fc36d4bd66158d78b604c2b3dac1a23bb9ad8066f5e0141	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Elite Social Media Mgmt Experts Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.758	2026-02-18 17:11:41.76	2026-02-18 17:11:41.76	t	0	\N
a417e5d5-f08c-436a-be39-952055b0cdb5	co-ar-534cc6e7-mlsahfpgoyn@demo.marketplace.com	427d522974b6197fba402011f72408471376b91cefb6427d10efd58cedbc33d8	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة إدارة صفحات سوشيال المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.764	2026-02-18 17:11:41.766	2026-02-18 17:11:41.766	t	0	\N
5205a222-6178-46a5-b554-2bf1ac7e141c	co-en-9f883a2f-mlsahfpnfma@demo.marketplace.com	efbe15b56b3642a22c65967349fc4e3758f8443cf42ab75683b5f943835ce975	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Pro Graphic Design Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.771	2026-02-18 17:11:41.773	2026-02-18 17:11:41.773	t	0	\N
4dd79df0-29c4-4c4f-ab42-8d1b7687af3c	co-ar-9f883a2f-mlsahfptjvw@demo.marketplace.com	ef9a671f94fa446510192a1b023c79db63e81d11372ee422fa384c3be8d8f6f3	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة تصميم جرافيك للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.777	2026-02-18 17:11:41.779	2026-02-18 17:11:41.779	t	0	\N
4f6a8ca1-6ed2-47f8-b4c4-02b3acf0104f	co-en-f684e579-mlsahfq06rn@demo.marketplace.com	4bc1c42c6dc96a3468911fcf3275e493b07bce51ee144d34d1f2d0d8b3993457	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Pro Branding & Identity Agency Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.784	2026-02-18 17:11:41.786	2026-02-18 17:11:41.786	t	0	\N
0456fe2b-894b-4d44-825f-c1c975aaa6c1	co-ar-f684e579-mlsahfq6726@demo.marketplace.com	770fd31a0493f37755ce5331eae0605ecdbaa39a5479675c526a5ee0faad2b8a	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة هوية بصرية الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.79	2026-02-18 17:11:41.792	2026-02-18 17:11:41.792	t	0	\N
0426459d-ebe8-4747-b1eb-da95ec2354e3	co-en-e2e4e7b7-mlsahfqc099@demo.marketplace.com	1e1a4a0c215e3be27a7a4538f8f516a4a8ce3209ddefa57bf01cac81e7daf289	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Swift 3D Visualization Agency Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.796	2026-02-18 17:11:41.798	2026-02-18 17:11:41.798	t	0	\N
5f1740a1-c00d-4a31-a25c-7fbf3027a69b	co-ar-e2e4e7b7-mlsahfqhu14@demo.marketplace.com	ff7deca730ef3d81cacab9cb7fbf0cd7b6fbb73e4ad4d812fcddc6531e9a07ec	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة تصميم ثلاثي الأبعاد المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.802	2026-02-18 17:11:41.803	2026-02-18 17:11:41.803	t	0	\N
b854a080-5f5c-4645-bc27-8173ffd3b5a7	co-en-3d27de5e-mlsahfqn1hi@demo.marketplace.com	8cbae481326eaefe39550386e077702a00b0989058e4ebe658d0216478073174	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Pro AC Repair Works Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.807	2026-02-18 17:11:41.81	2026-02-18 17:11:41.81	t	0	\N
31f785ae-f4f8-4aa7-ac38-c6b3924dae15	co-ar-3d27de5e-mlsahfqwn19@demo.marketplace.com	6fdc132b9f11bef6b09fed8bc7938c40c4697ab296292f5633461f20327db822	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة صيانة مكيفات للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.816	2026-02-18 17:11:41.818	2026-02-18 17:11:41.818	t	0	\N
e36b910f-acaa-47b5-b1c3-49fe8676d5dc	co-en-9be45a5d-mlsahfr201s@demo.marketplace.com	7007c0b816bc5b96c17fec80f7a5ffbd688dfddcd3f61245cb04917ebd47f2be	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Swift AC Maintenance Agency Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.822	2026-02-18 17:11:41.824	2026-02-18 17:11:41.824	t	0	\N
2fef40bf-ddac-4918-ae81-0314fe9bbd8d	co-ar-9be45a5d-mlsahfr8g4r@demo.marketplace.com	b3400635c1f9a69ba0768dda28e9cc186dd2984c76ca4f09f116df98ffdbc4f7	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة عقود صيانة للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.828	2026-02-18 17:11:41.83	2026-02-18 17:11:41.83	t	0	\N
26bb26e2-dd4a-4398-9126-230dbd586fb1	co-en-fa0319a9-mlsahfrd4m5@demo.marketplace.com	9674fea41870c95f9fe31967f2bc411e9076dd2f0d1ac154121fd317cb9a8ee6	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Swift Custom Furniture Co Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.833	2026-02-18 17:11:41.835	2026-02-18 17:11:41.835	t	0	\N
87409c3e-fc66-4c66-a5b6-d753fbfa40fa	co-ar-fa0319a9-mlsahfrjjmh@demo.marketplace.com	38609d9ef7724d3baf3df135dcdde1f863fca9972496433a395deab99843cd76	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء تفصيل أثاث الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.839	2026-02-18 17:11:41.841	2026-02-18 17:11:41.841	t	0	\N
4aeaf680-084b-4d30-87ba-20da60e37af4	co-en-5fdddb70-mlsahfrq4zq@demo.marketplace.com	b6022dfa0c1318b9fe81ca7c54d0631b425d19af751eeb1001788fd12c83121d	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Expert Door Install & Repair Team Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.846	2026-02-18 17:11:41.847	2026-02-18 17:11:41.847	t	0	\N
cb99234a-53e8-40c8-bfb3-d0b620377f43	co-ar-5fdddb70-mlsahfrw08q@demo.marketplace.com	f4be910f47ee83948989a6ce936ccbc20621af2b25da5927ae94ca79e1ccc048	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة تركيب وصيانة أبواب الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.852	2026-02-18 17:11:41.854	2026-02-18 17:11:41.854	t	0	\N
8c6b4110-ed14-4a77-883a-5082235acc13	co-en-995b2165-mlsahfs1gss@demo.marketplace.com	a6e6a186b041424954cb765e985871b0b4305303e0687385710658809059cb56	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Swift Kitchen Cabinets Experts Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.857	2026-02-18 17:11:41.859	2026-02-18 17:11:41.859	t	0	\N
b6341baa-9165-4b79-b78e-eab6cdb3c2d4	co-ar-995b2165-mlsahfs7x2d@demo.marketplace.com	2ac15e58245f90b641eda917eb6375e1dc2c7e15a358454f6bd85e488dfc978a	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء خزائن مطبخ المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.863	2026-02-18 17:11:41.865	2026-02-18 17:11:41.865	t	0	\N
f2f9b28c-a583-465c-b993-27c921be404c	co-en-7f0933d0-mlsahfsdi9t@demo.marketplace.com	bb22c63fbca7c1f5b355b6cf56abac06ef4f55ce05edfa95c6d6b265dfe832f8	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Expert Bedroom Wardrobes Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.869	2026-02-18 17:11:41.871	2026-02-18 17:11:41.871	t	0	\N
b82a1192-b0f4-40bf-9c3c-1eb5b1f754c1	co-ar-7f0933d0-mlsahfsix9z@demo.marketplace.com	52df0a0b50dfdc89efe0453caedc60bc7e3776c4532ce91cdf5b010ca6b88a41	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء خزائن ملابس المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.874	2026-02-18 17:11:41.876	2026-02-18 17:11:41.876	t	0	\N
b29d524d-f7ba-4106-9923-bad2f37922fb	co-en-a4f932f4-mlsahfspa6m@demo.marketplace.com	87fa3f97a649bfd3e41e26d62c82a6b6cdff1a257e153487a436d7bfa443d1f5	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Apex Wood Flooring Experts Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.881	2026-02-18 17:11:41.883	2026-02-18 17:11:41.883	t	0	\N
d10fba07-dd0a-41d6-9453-92afd851f7c7	co-ar-a4f932f4-mlsahfsvz48@demo.marketplace.com	44d1f596fbcf198b786e8a60c853180c00f7da025354a13cad9eb6aa63bf0ca4	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء باركيه وأرضيات المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.887	2026-02-18 17:11:41.889	2026-02-18 17:11:41.889	t	0	\N
cbbb4212-5af6-4210-a81f-a9f3924e08de	co-en-a15ec8f6-mlsahft2iqs@demo.marketplace.com	f2adab4e1f26ac744a31613b7c482d0637ce917436e588fb3235e91730ed5846	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Top Pergolas & Outdoor Partners Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.894	2026-02-18 17:11:41.896	2026-02-18 17:11:41.896	t	0	\N
39729ad2-543c-4f51-b8fb-3ef8bed48dd2	co-ar-a15ec8f6-mlsahft7wbl@demo.marketplace.com	bc9159876b72a0ed61b216cfd69c25d134756f0b54af7932e6ff6fafb60e8ff9	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة مظلات خشبية الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.899	2026-02-18 17:11:41.901	2026-02-18 17:11:41.901	t	0	\N
3b347bcd-896c-446d-8243-02b572287132	co-en-5fa8962e-mlsahftd9n8@demo.marketplace.com	8e4e488b21672a42855539c299b6c6c67cb4f1bc17286a402845e2b47a6c0084	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Apex Office Furniture Agency Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.906	2026-02-18 17:11:41.909	2026-02-18 17:11:41.909	t	0	\N
1d7a13c8-7aff-4c7e-9599-f2c6bb3e1a23	co-ar-5fa8962e-mlsahftk649@demo.marketplace.com	dd08f029fe8676443558a96a66828efcf52d575f29d3628532d97e9abe2bd362	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة أثاث مكتبي المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.912	2026-02-18 17:11:41.915	2026-02-18 17:11:41.915	t	0	\N
80bf4274-7d6f-40b2-a14b-26cbc9828c37	co-en-372a27be-mlsahftr6wc@demo.marketplace.com	1c7c98e07819be9427fc163ec5a1659003bda22530629c67413b93bb32c11e03	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Star Furniture Repair Co Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.919	2026-02-18 17:11:41.921	2026-02-18 17:11:41.921	t	0	\N
aee91c4c-f77e-4644-adb0-fdd23482485d	co-ar-372a27be-mlsahftxq0z@demo.marketplace.com	c89d10a2786f005be7d654fcd61302edafd3cb6087bd8518cfa3bfa9d454d42d	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز إصلاح أثاث المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.925	2026-02-18 17:11:41.927	2026-02-18 17:11:41.927	t	0	\N
b1d443a7-d4f3-4343-ae67-f244340f16c8	co-en-61452801-mlsahfu37wh@demo.marketplace.com	837dc0c7d1d32a5c039c1bcccfae9e350472777eebf12e191f274c8e6598f0a7	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Star Equipment Transport Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.931	2026-02-18 17:11:41.934	2026-02-18 17:11:41.934	t	0	\N
cbffea3f-5f7b-4d9b-8046-886a58fc9d9d	co-ar-61452801-mlsahfuc5to@demo.marketplace.com	084d15b73528db9444cd70f4b6a4cef8ba1e9a4ca17dfdc45c8b682df3c6b3ad	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة نقل معدات للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.94	2026-02-18 17:11:41.942	2026-02-18 17:11:41.942	t	0	\N
50a6c582-8a6f-443f-8ac4-862f172cae48	co-en-e0ea0aaf-mlsahfuk998@demo.marketplace.com	40a0c08e350fbd0bcca7f60c526dc6e32a5050ce0a7fd7c0f8f35062002a328b	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Pro Local Delivery Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.948	2026-02-18 17:11:41.95	2026-02-18 17:11:41.95	t	0	\N
b51291ba-fb57-4e80-bc67-e4a0bae66c79	co-ar-e0ea0aaf-mlsahfuqblc@demo.marketplace.com	fc31133ba708b79a1bb5fcb3febc1f667b9e0cee5034ebca9e8a30550470a097	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة توصيل بضائع محلي المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.954	2026-02-18 17:11:41.956	2026-02-18 17:11:41.956	t	0	\N
97fe3cd0-68fa-4ab8-9bc4-47a68f463ae6	co-en-cfaf55d4-mlsahfuwsg1@demo.marketplace.com	a4cee2ef3ab4921c954ebdf72d91d0d6b00cb5e795f84aff6cbdb365bf7a9bf3	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Alpha Heavy Equipment Co Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.96	2026-02-18 17:11:41.962	2026-02-18 17:11:41.962	t	0	\N
31f4de5f-b174-47fb-aeb8-26caae81d7c3	co-ar-cfaf55d4-mlsahfv5tcm@demo.marketplace.com	9f5fa30822ad473abbd4c59dbe1393c1c70099bec6239644c18f2c24085aec3d	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء نقل معدات ثقيلة الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.969	2026-02-18 17:11:41.97	2026-02-18 17:11:41.97	t	0	\N
7837921f-19eb-45ca-b1bd-b6365dd40651	co-en-145dab2a-mlsahfvbvnh@demo.marketplace.com	1961fc44bfca60fdce75ff5ffd47a32df4ceb3da90c4b00eb280a323007fd211	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Elite IT Support Experts Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.975	2026-02-18 17:11:41.978	2026-02-18 17:11:41.978	t	0	\N
6512b42a-a776-4b03-9f6c-b9ba71097284	co-ar-145dab2a-mlsahfviow3@demo.marketplace.com	34f17f21c985fda14eb978a01b3675f0a4ab32753e3666d0070304de6329f1cd	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة دعم فني وتقني الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.982	2026-02-18 17:11:41.984	2026-02-18 17:11:41.984	t	0	\N
678941d1-898c-494e-97ed-0ddec9844990	co-en-96e8b578-mlsahfvoy9x@demo.marketplace.com	4c8aa2bb135b665c3c24961967c80c7f2f41ccfafb4d771333cbc8c60ce49de6	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Best Content Creation Group Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:41.988	2026-02-18 17:11:41.99	2026-02-18 17:11:41.99	t	0	\N
f78fe74c-0154-4073-b86d-92bbbecc5170	co-ar-96e8b578-mlsahfvvggz@demo.marketplace.com	0bd791a364b0a02a3f3407ceb9ec3411c4f820097809ab0b88a6a7f812b89932	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء صناعة محتوى المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:41.995	2026-02-18 17:11:41.997	2026-02-18 17:11:41.997	t	0	\N
41d6ed8b-3890-4632-9b66-fe03c8d93c67	co-en-8ad81af4-mlsahfw0nb2@demo.marketplace.com	906c47e8f0cac5e909698d8772405f5b4df1744c043d0c4c87f0f1681600504e	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Top Tax Consultation Agency Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.001	2026-02-18 17:11:42.002	2026-02-18 17:11:42.002	t	0	\N
744cb174-1d85-4ab7-b2bc-b4b41b6218cb	co-ar-8ad81af4-mlsahfw72p8@demo.marketplace.com	47a9123e591771d55e57d34b9530d76db138731d4c1d612f604ea6418c47ce6a	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة استشارات ضريبية للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.007	2026-02-18 17:11:42.009	2026-02-18 17:11:42.009	t	0	\N
902b6a26-308f-41d7-8cb2-f0bb9f4b4dc1	co-en-c578b972-mlsahfwegex@demo.marketplace.com	6d3f778aa3af7a134a7e182acd4a94eaa7d3706e29fbed7b6bc62bc93b331275	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Swift Company Registration Solutions Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.014	2026-02-18 17:11:42.015	2026-02-18 17:11:42.015	t	0	\N
00392931-c468-43aa-bbfd-64378ddebb02	co-ar-c578b972-mlsahfwkbhg@demo.marketplace.com	8234c33a6a29800a872d14326337140073cdb9b8d420cd169aae3765f5d0a3b9	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء تأسيس شركات للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.02	2026-02-18 17:11:42.022	2026-02-18 17:11:42.022	t	0	\N
d044fa29-032b-4968-96d4-3bdd482bc336	co-en-4e4ff339-mlsahfwq6gi@demo.marketplace.com	c785edb02c71ea3f39b2da269f5ca255fe41b3516245d530daf184d60dab643e	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Apex Business Consulting Works Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.026	2026-02-18 17:11:42.028	2026-02-18 17:11:42.028	t	0	\N
a7b0d785-e0e5-4bd3-bcc5-d03fcf9746c0	co-ar-4e4ff339-mlsahfwxmtf@demo.marketplace.com	ccbc640b655914e36b8a5e076df39b4cde9f708a45569ca1dcbb08adf705b08c	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء استشارات أعمال المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.033	2026-02-18 17:11:42.035	2026-02-18 17:11:42.035	t	0	\N
f658f9e7-9683-4bbb-ab8e-f323099877a7	co-en-85ecc7e5-mlsahfx31bk@demo.marketplace.com	c1f7e5a9613365e576de06ec6304a6022163ea49a8f4daecd4b78a057fbba2b1	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Apex Interior Design Co Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.039	2026-02-18 17:11:42.041	2026-02-18 17:11:42.041	t	0	\N
9b88f737-b510-403c-897f-5d35539f107b	co-ar-85ecc7e5-mlsahfx9g58@demo.marketplace.com	03f23d2715854f9bf620707424092cf9d7c784906b03f39e4285afcffe185f00	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز تصميم داخلي المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.045	2026-02-18 17:11:42.047	2026-02-18 17:11:42.047	t	0	\N
cf347d27-93e3-43b9-a573-a53ab5c3f696	co-en-9e64837b-mlsahfxfuf9@demo.marketplace.com	43922f7e3f75590a6f6418ac856250256c34f90c8cac3b8c165e6eb2d1083f3c	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Expert Landscape Design Works Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.051	2026-02-18 17:11:42.053	2026-02-18 17:11:42.053	t	0	\N
279956bc-0203-4aea-915d-2931e18aa2d3	co-ar-9e64837b-mlsahfxmtk3@demo.marketplace.com	14c1aa0ef56e9e25cd302360fe0916a231f1fbe7d1ff4c6e6e68c9124e4576fa	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة تصميم حدائق المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.058	2026-02-18 17:11:42.061	2026-02-18 17:11:42.061	t	0	\N
1d58252d-f7a3-4952-a7a2-94ab4e6159c4	co-en-a104b06f-mlsahfxu0w4@demo.marketplace.com	d428f49acc1f46dc5f45e2dec9da68ef94f621f8ae0a31b728b9a5c23d98ce63	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Alpha AC & HVAC Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.066	2026-02-18 17:11:42.068	2026-02-18 17:11:42.068	t	0	\N
67db029d-f7b5-476c-98ff-e6ba83897d59	co-ar-a104b06f-mlsahfy0hzr@demo.marketplace.com	ceb32489710dfd65e6140ce4513f44ee3d223c772e1ed07d8c165cb1261d9158	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة تكييف وتبريد المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.072	2026-02-18 17:11:42.074	2026-02-18 17:11:42.074	t	0	\N
0812d9a5-4d83-442c-b250-e18f58ec9535	co-en-c5168990-mlsahfy7yaw@demo.marketplace.com	f0a7ccf233282b87394de6f26ae61111f8b91da841c7eefb2e090b73db47e51b	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Prime AC Installation Co Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.079	2026-02-18 17:11:42.081	2026-02-18 17:11:42.081	t	0	\N
61421aa7-8466-4402-b210-216e05014fcd	co-ar-c5168990-mlsahfycodg@demo.marketplace.com	a7bfe35f789008fe7df6dab28cc933107473724f5f50d952a5e4851f8169cb08	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة تركيب مكيفات المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.085	2026-02-18 17:11:42.087	2026-02-18 17:11:42.087	t	0	\N
8761e2ab-e9ce-4fe4-8ec7-9b5cfe9d4b3d	co-en-3d27de5e-mlsahfykdb6@demo.marketplace.com	196d2ddce23a94360aa835d279042e6d69063c6aa39fa0a0b5ccba32190f6bf3	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Elite AC Repair Team Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.092	2026-02-18 17:11:42.094	2026-02-18 17:11:42.094	t	0	\N
6818a8fb-3894-4b5f-a3aa-d0d4500b249b	co-ar-3d27de5e-mlsahfyqq4u@demo.marketplace.com	318deb5b170772ebad507bb1da96a90e261cfa4fe40982fbb01393a1bf8cc7ca	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة صيانة مكيفات المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.098	2026-02-18 17:11:42.1	2026-02-18 17:11:42.1	t	0	\N
87e5255a-5521-4adf-a22e-0ad606cea0a8	co-en-9be45a5d-mlsahfyx0px@demo.marketplace.com	9eec1ae7733823dad626ab3b7261b329903465df5750853d45a5078a5d8eeb6c	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Swift AC Maintenance Partners Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.105	2026-02-18 17:11:42.107	2026-02-18 17:11:42.107	t	0	\N
f8478020-957e-4fb9-8332-a150ee6aed93	co-ar-9be45a5d-mlsahfz8l3o@demo.marketplace.com	6f119e333a08f1666e2b5f5176e2c85c9d713cbb826b99e99254bc2fd0165554	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز عقود صيانة المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.116	2026-02-18 17:11:42.12	2026-02-18 17:11:42.12	t	0	\N
69052a48-eada-4001-8cef-b10b23c4d5fd	co-en-e4b87995-mlsahfzoep5@demo.marketplace.com	be35afd46ee094ad10549cde75747868e9a325f6744fd23be3706f9afa55161a	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Swift Central AC Systems Experts Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.132	2026-02-18 17:11:42.134	2026-02-18 17:11:42.134	t	0	\N
86e74ae4-2697-4f3c-b616-1612197f418f	co-ar-e4b87995-mlsahg02sy7@demo.marketplace.com	acaa493802a26ed583b03d32cfff15a0505a3843183cf43b1558f4ea5d943bc5	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة تكييف مركزي المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.146	2026-02-18 17:11:42.148	2026-02-18 17:11:42.148	t	0	\N
74eefda0-1741-4026-ac95-a79f4ee494cb	co-en-99d200f3-mlsahg0f1i7@demo.marketplace.com	8724c4d4023684dcb3807e510824e6f6b63eb01eb0f1b4082e42be98493676c2	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Star Heating Repair Hub Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.159	2026-02-18 17:11:42.161	2026-02-18 17:11:42.161	t	0	\N
81cc9e9a-0738-41e9-92e8-7d041b2c808e	co-ar-99d200f3-mlsahg0rfnp@demo.marketplace.com	3439aae7dab8b0c5e962a9f0966966dcc4754f264850ec62f546c0d134b893de	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة صيانة أنظمة تدفئة الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.171	2026-02-18 17:11:42.174	2026-02-18 17:11:42.174	t	0	\N
05b816d7-8b53-4d98-8ca4-7e25c7df4344	co-en-c51e73dc-mlsahg15p4c@demo.marketplace.com	3658ce9d8f59dafbcbc29683fbe2d5468c60ba8cffbc55a32eaba443e2f0ca6e	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Swift Duct Install & Cleaning Agency Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.186	2026-02-18 17:11:42.188	2026-02-18 17:11:42.188	t	0	\N
458134c0-285b-4d41-a389-dbc326cdc5af	co-ar-c51e73dc-mlsahg1lspv@demo.marketplace.com	cd4f8ddd644bf02478a38ce9ceaa088fe9d94d4578ada2f743ecdffdda8246f0	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة تركيب وتنظيف دكت المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.201	2026-02-18 17:11:42.203	2026-02-18 17:11:42.203	t	0	\N
64221107-5dce-4f2d-96d2-e67f4afe062b	co-en-998ed8b1-mlsahg1xjox@demo.marketplace.com	e4537609760052a13dda9c3cbcb114f205631497fe93a8d1880be380a946df25	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Elite Thermostat Install Partners Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.213	2026-02-18 17:11:42.215	2026-02-18 17:11:42.215	t	0	\N
70200c0f-8d8b-4132-84b8-c087435f1e6e	co-ar-998ed8b1-mlsahg22o8c@demo.marketplace.com	f3d1aa6e668335bcd0e1d1fdcee84fc9bc8704e134ca95aa4ac488db8ceb1948	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز تركيب ترموستات المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.218	2026-02-18 17:11:42.22	2026-02-18 17:11:42.22	t	0	\N
88086409-4048-478c-8587-18ac3de9e3e2	co-en-a2ff47e5-mlsahg29sml@demo.marketplace.com	b4a121c15edfde870ed6cc378d43f7dabd6e2e011b45e2250579a2b8a55f7540	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Best Gas Refill Hub Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.225	2026-02-18 17:11:42.227	2026-02-18 17:11:42.227	t	0	\N
b69eedd3-bf4a-40b9-aab0-732803622ce8	co-ar-a2ff47e5-mlsahg2fe5c@demo.marketplace.com	fcacf31219256ec3ad94df201532cf7f9e1ab1a64ecef4d5df59994a8da9f33b	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة تعبئة غاز للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.231	2026-02-18 17:11:42.233	2026-02-18 17:11:42.233	t	0	\N
60ba5e1a-d3b8-42c4-a9f8-377aeac92fda	co-en-a9a06bd3-mlsahg2ron4@demo.marketplace.com	3af1c5f037604741cb470fa75bf6c0f676541d78e9ddf51ee1048178b7359fbc	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Star HVAC Inspection Co Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.243	2026-02-18 17:11:42.246	2026-02-18 17:11:42.246	t	0	\N
594740a1-89a1-4830-ae86-a68d2c641653	co-ar-a9a06bd3-mlsahg35vmx@demo.marketplace.com	480752ec4c15828a2bc853b1b37d83f437530b7fb85b20f68fcb535cdb3c38a9	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء فحص أنظمة التكييف للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.257	2026-02-18 17:11:42.259	2026-02-18 17:11:42.259	t	0	\N
e07bdb9f-85e8-4f62-b4ad-15aae616eb90	co-en-9216b9d5-mlsahg3c5fg@demo.marketplace.com	9d9bac22fb784e51467734e2dcc7b5acafe0d3f34e04632e71ce30244817467d	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Alpha Carpentry Solutions Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.264	2026-02-18 17:11:42.267	2026-02-18 17:11:42.267	t	0	\N
a1e4f4d5-15e8-48db-8841-2c8c9d1524ae	co-ar-9216b9d5-mlsahg3kksi@demo.marketplace.com	202e53697345f8664eba4c9ceb85156e60c8c5a7b492ae851a917e87b127622a	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة نجارة المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.272	2026-02-18 17:11:42.274	2026-02-18 17:11:42.274	t	0	\N
cb2e751d-735f-4e7f-86d5-53b25e19edc7	co-en-fa0319a9-mlsahg3q1r6@demo.marketplace.com	300bb0b4dbae70b936306cd514dd5ffd9f2fd912b437ac08603823ee2f066603	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Expert Custom Furniture Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.278	2026-02-18 17:11:42.281	2026-02-18 17:11:42.281	t	0	\N
0d47f840-dabc-41cb-ac5e-fc93319b458e	co-ar-fa0319a9-mlsahg3wh1q@demo.marketplace.com	4263c160ec6a8c266a9cbad09087104e32c6c9d944035efdf5525402dbe487e6	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة تفصيل أثاث المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.284	2026-02-18 17:11:42.286	2026-02-18 17:11:42.286	t	0	\N
3dc2fee9-10f4-4e5d-809f-11bb5d9c592d	co-en-5fdddb70-mlsahg42aeb@demo.marketplace.com	5b1ee74d044a4f1329155215df9aade4e9cfad6c8070a1b1cc910f348f20951d	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Star Door Install & Repair Agency Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.29	2026-02-18 17:11:42.292	2026-02-18 17:11:42.292	t	0	\N
fbc4c376-26fe-44f4-b414-da327a9ea050	co-ar-5fdddb70-mlsahg47srq@demo.marketplace.com	955533c617a41ac440ec04a013bb83b40a08e68b225f079ccafe4a89dbcd08f3	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة تركيب وصيانة أبواب الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.296	2026-02-18 17:11:42.298	2026-02-18 17:11:42.298	t	0	\N
dd22c5d6-72e9-48eb-9d62-722bcda284e0	co-en-995b2165-mlsahg4d0m1@demo.marketplace.com	06f4cd93b3f5b3dc83de519aa8dba14716e99c591d546662ca4981b66e396dfb	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Star Kitchen Cabinets Partners Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.301	2026-02-18 17:11:42.303	2026-02-18 17:11:42.303	t	0	\N
52fd6b3d-557d-4ffe-9afe-f9122050b05a	co-ar-995b2165-mlsahg4i9bt@demo.marketplace.com	d84c104f29fc007e2ba662a19654e42f4bfacc823392e03314567f94c9421ab0	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة خزائن مطبخ الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.306	2026-02-18 17:11:42.308	2026-02-18 17:11:42.308	t	0	\N
469f23b3-ea37-4756-987d-c6963f032a02	co-en-7f0933d0-mlsahg4oi8u@demo.marketplace.com	b94a8e12fbac9ccc41a461486dbdf443fdaf13f18dae8805ecd07387d498772d	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Expert Bedroom Wardrobes Group Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.312	2026-02-18 17:11:42.315	2026-02-18 17:11:42.315	t	0	\N
9139513e-aed2-4768-91c6-1288edb14468	co-ar-7f0933d0-mlsahg4uloq@demo.marketplace.com	6659a16511ef409680c0dfbaa9a20ab80260cdb44b860351ea0a3f59c86fdf4e	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة خزائن ملابس المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.318	2026-02-18 17:11:42.32	2026-02-18 17:11:42.32	t	0	\N
247feba4-3606-463b-a8d7-12e3bba429c0	co-en-a4f932f4-mlsahg5043o@demo.marketplace.com	23d855b86bd705dd1a7e43bd34a1a7f7dff7bec34f071e19d815363a1a155fef	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Best Wood Flooring Agency Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.324	2026-02-18 17:11:42.326	2026-02-18 17:11:42.326	t	0	\N
44002ec2-47b4-46b3-9bb3-0fc1ac4a119e	co-ar-a4f932f4-mlsahg573bh@demo.marketplace.com	0a44edecb28d935eefed63733f00ee887a65bc51f5ddd78c6619b350284803e2	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة باركيه وأرضيات المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.331	2026-02-18 17:11:42.333	2026-02-18 17:11:42.333	t	0	\N
bde05142-5f96-438a-ae0f-74a929a6f2c9	co-en-a15ec8f6-mlsahg5d7mc@demo.marketplace.com	a29898795b1f023aa4061e99a50343cd625aec0ed709db9f9e68fe0d035fccdf	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Alpha Pergolas & Outdoor Group Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.337	2026-02-18 17:11:42.339	2026-02-18 17:11:42.339	t	0	\N
27ad2a42-72e2-4388-8f41-5b59346ddfff	co-ar-a15ec8f6-mlsahg5i4aj@demo.marketplace.com	4b3bf2316c722e0c36c4e701b5b3b0c3de9d93265d531d468571eb5fb5c5e83d	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة مظلات خشبية للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.343	2026-02-18 17:11:42.345	2026-02-18 17:11:42.345	t	0	\N
203a79f6-b743-49a2-986b-6f5e9526eec1	co-en-5fa8962e-mlsahg5oiob@demo.marketplace.com	f3d80f8372bd4b3c0a41e383756a7f415c56cf47439989f9f1e9279eb5650b3a	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Best Office Furniture Team Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.348	2026-02-18 17:11:42.35	2026-02-18 17:11:42.35	t	0	\N
4521d63e-91a8-48b6-8c79-c2d6e3e9c029	co-ar-5fa8962e-mlsahg5u9hl@demo.marketplace.com	7e331b91e2eaf6672422dfc0a95cde0ec4a3c8113888511352579baf7af22ff9	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة أثاث مكتبي المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.354	2026-02-18 17:11:42.356	2026-02-18 17:11:42.356	t	0	\N
66988cca-3788-41ba-83ef-5c77c68faff0	co-en-372a27be-mlsahg60mjh@demo.marketplace.com	3dae91b8606d925f5655896b85b79e8821e888d0405d4a1324c4d54659173642	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Top Furniture Repair Partners Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.36	2026-02-18 17:11:42.362	2026-02-18 17:11:42.362	t	0	\N
89a6cf7b-f972-455c-b457-681fe754f9a9	co-ar-372a27be-mlsahg66qhk@demo.marketplace.com	c1b25cd41ad7833316dbd030c72af804ceafc1033d490f9a4790cbd89c0e1c93	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة إصلاح أثاث المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.366	2026-02-18 17:11:42.368	2026-02-18 17:11:42.368	t	0	\N
a2b0b46e-c3e1-43a0-bc7f-cff4527519ba	co-en-bc71903c-mlsahg6de8p@demo.marketplace.com	a34065a38a2cfa640ebf4e3a2adf421311d14867fe621607909d29f5d21e8548	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Apex IT Support Hub Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.373	2026-02-18 17:11:42.375	2026-02-18 17:11:42.375	t	0	\N
e6b3c846-9a24-4cea-9fef-05ad205be29b	co-ar-bc71903c-mlsahg6j2q1@demo.marketplace.com	d261b05426da4ab3f15968f818163c022d3a849bb7d14753c9c2388150bb158e	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة دعم تقني للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.379	2026-02-18 17:11:42.381	2026-02-18 17:11:42.381	t	0	\N
e6c502cd-084a-4714-ab7f-d970b68a36a3	co-en-145dab2a-mlsahg6pxyb@demo.marketplace.com	f70582f34acbd87daa97d95b130de56aaf318dd672269e1df18755813d824ab3	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Star IT Support Works Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.385	2026-02-18 17:11:42.386	2026-02-18 17:11:42.386	t	0	\N
ef84ebd6-e279-4151-89f9-4af43f9be931	co-ar-145dab2a-mlsahg6u9uq@demo.marketplace.com	542a766c14a66ddd186d02bc6fc98332a8685ed51f3e3599da93382b4a2a5d3a	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء دعم فني وتقني المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.39	2026-02-18 17:11:42.393	2026-02-18 17:11:42.393	t	0	\N
b91bf290-4420-4ff4-a951-fec0ac830d88	co-en-094e4723-mlsahg71hel@demo.marketplace.com	e35a0d853e818d73c8ffc2ec791e16b7f1f0fbb245ede86b7b7d28c8c35d42f3	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Top Network Installation Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.398	2026-02-18 17:11:42.4	2026-02-18 17:11:42.4	t	0	\N
5dfdd78e-1a22-4541-8a51-0752afc5f3ce	co-ar-094e4723-mlsahg77nq7@demo.marketplace.com	738ec14c6343de55cd62e3c61a6bd1beb65047238b4c93e4df9228a0f56334fb	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة تمديد شبكات للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.403	2026-02-18 17:11:42.405	2026-02-18 17:11:42.405	t	0	\N
f5f7e31a-ac7c-41bc-952b-1ba70a650996	co-en-86a76eb4-mlsahg7efzi@demo.marketplace.com	2fa076b0ac2b908b453b10be7d44c0c600b166c207e906d1e4260b1c243b4920	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Prime Server Installation Agency Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.41	2026-02-18 17:11:42.412	2026-02-18 17:11:42.412	t	0	\N
f9619203-b83a-4963-83f6-4dbee638ecd9	co-ar-86a76eb4-mlsahg7l4eh@demo.marketplace.com	5e80965431c74b0b81898b43dda370d4b3e0e17be3a94269ac94faf89f313a45	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء تركيب سيرفرات الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.417	2026-02-18 17:11:42.419	2026-02-18 17:11:42.419	t	0	\N
b8f1c024-3c33-452b-a4c8-1a2fa485de1e	co-en-0908a7a2-mlsahg7rm6u@demo.marketplace.com	6d35e7c0b950196bb7ce5a19a744d80826648c93bb8923d5d2c56c51d6238b9a	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Swift Server Maintenance Partners Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.423	2026-02-18 17:11:42.425	2026-02-18 17:11:42.425	t	0	\N
0470cafb-7b47-48ef-b420-dd2d953d44f8	co-ar-0908a7a2-mlsahg7xxcl@demo.marketplace.com	bdecd5639488820ee38ea034e411692c62014df47a79dc78c34d8533394e3aa0	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة صيانة سيرفرات المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.429	2026-02-18 17:11:42.431	2026-02-18 17:11:42.431	t	0	\N
a0e92a88-80ef-4ac2-b126-86e0555445fd	co-en-1b0eb73a-mlsahg84frq@demo.marketplace.com	09491db5d569d8f633362b2f93614ae3f9598331875e524c2d37e429afd5ff80	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Pro Hardware Repair Agency Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.436	2026-02-18 17:11:42.438	2026-02-18 17:11:42.438	t	0	\N
5f05f0d2-cea9-4818-b8b4-595b011b889e	co-ar-1b0eb73a-mlsahg8ajve@demo.marketplace.com	8aa05f02f718eaea15f1b12b1c45631067a0100ed60571f34f212f23e3603c35	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة صيانة أجهزة كمبيوتر للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.442	2026-02-18 17:11:42.444	2026-02-18 17:11:42.444	t	0	\N
73eec17f-830b-4412-9a50-1b8083c40309	co-en-6da456be-mlsahg8g7eo@demo.marketplace.com	c2ec5d254f7ae187e1e4578a9394d3e00063154ab29c76613c37a21deeb0d08a	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Prime Printer Setup Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.448	2026-02-18 17:11:42.45	2026-02-18 17:11:42.45	t	0	\N
e3ea6219-1c9d-4400-8c36-a9f3d1ebc65c	co-ar-6da456be-mlsahg8m04r@demo.marketplace.com	c1d71bbae4a8b4295c35f8ab495975565071c5298154339c3d47ce1dc8c09b64	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة تعريف طابعات المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.454	2026-02-18 17:11:42.456	2026-02-18 17:11:42.456	t	0	\N
02732adb-e1d1-4099-af24-0d3655e4234d	co-en-7245e6a5-mlsahg8scst@demo.marketplace.com	c17f8e206889676ef9e54b51c2a71aa7b183837a2d83d5c61a73c2b2cae76a3d	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Apex CCTV Integration Solutions Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.46	2026-02-18 17:11:42.462	2026-02-18 17:11:42.462	t	0	\N
d8a4c58c-1755-456a-b36b-4c0c6d577523	co-ar-7245e6a5-mlsahg8yis3@demo.marketplace.com	efb44c126cbf3f5bae146f39eb37d25b4c738b84ed21398dab5643e569eb94c9	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز ربط كاميرات بالشبكة للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.466	2026-02-18 17:11:42.469	2026-02-18 17:11:42.469	t	0	\N
fe272144-94e3-4d54-a807-fd8e5ed0c20d	co-en-6c3eb205-mlsahg9649j@demo.marketplace.com	69b9249ccf8b933b639f52219dfea949c50ed16027945d588d714dcaf2fd9e87	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Elite Maintenance Contracts Hub Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.474	2026-02-18 17:11:42.476	2026-02-18 17:11:42.476	t	0	\N
0a70a231-4b53-4a58-b68c-8b1247bd763e	co-ar-6c3eb205-mlsahg9dhyw@demo.marketplace.com	2696ad795b61a3b9c2dd8241564c4e77dbd827efa6b554ce1280dc53a2359d6e	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة عقود صيانة دورية المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.481	2026-02-18 17:11:42.484	2026-02-18 17:11:42.484	t	0	\N
92342dde-3b11-4cbf-befb-d23ce1f07627	co-en-647011ed-mlsahg9j0zk@demo.marketplace.com	573cbff0ea16b7d3e0353f4fa9d87e1f808f1aedb946c8db52a2c0cb1d3fa21b	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Expert Data Recovery Co Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.487	2026-02-18 17:11:42.49	2026-02-18 17:11:42.49	t	0	\N
ebc6c8f7-41a4-4f44-82fd-814eca2cc908	co-ar-647011ed-mlsahg9qhb4@demo.marketplace.com	2b400365fb51bccbb5bb8f17c8256cb1633a91537882b2965d60367b1b7da82f	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة استعادة بيانات المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.494	2026-02-18 17:11:42.496	2026-02-18 17:11:42.496	t	0	\N
72b76cc7-55b1-464e-bdf5-2b935e9926fc	co-en-c800df55-mlsahg9wpvk@demo.marketplace.com	db9c68ad0d53212ea305ac8691266663c87422608430692f7c260336abb99a18	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Alpha Digital Services Works Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.5	2026-02-18 17:11:42.502	2026-02-18 17:11:42.502	t	0	\N
7dd08ad6-aeee-424b-8ab5-cb1c8c33342c	co-ar-c800df55-mlsahga20v0@demo.marketplace.com	8d08450336cc6194b1ef48984fe27fd6fbaa2d03123930b057bbb4b97fc751b0	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة خدمات رقمية المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.506	2026-02-18 17:11:42.508	2026-02-18 17:11:42.508	t	0	\N
06f83626-2292-4b41-90a9-e69568120694	co-en-534cc6e7-mlsahga84pf@demo.marketplace.com	30c8409f24fdff4b3aef5efd64ee21e8d794589f8e6299149a5adf7e4b861466	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Alpha Social Media Mgmt Group Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.512	2026-02-18 17:11:42.514	2026-02-18 17:11:42.514	t	0	\N
a699c062-f277-443a-b65c-ee8e190076d7	co-ar-534cc6e7-mlsahgae3h8@demo.marketplace.com	1186a576a2dcfcddf34925dc6e8c4a423a0a5ee31a84452242b6f8af82e611f3	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة إدارة صفحات سوشيال المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.519	2026-02-18 17:11:42.52	2026-02-18 17:11:42.52	t	0	\N
37b45f0f-c74b-4ec8-ae1f-739bce39fe15	co-en-96e8b578-mlsahgal3bq@demo.marketplace.com	e45a9d050482f0e1edb529e5296652e619063574fa0834868b90005973dbcdf5	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Star Content Creation Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.525	2026-02-18 17:11:42.527	2026-02-18 17:11:42.527	t	0	\N
0824fd96-40b0-4a35-83d6-55394cf7eca7	co-ar-96e8b578-mlsahgar0lg@demo.marketplace.com	2e495e15652ac1e5d0d3bf792ac8d6ef030f0a23ae49649e7298fd4c3dcd8ccf	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة صناعة محتوى المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.532	2026-02-18 17:11:42.534	2026-02-18 17:11:42.534	t	0	\N
d4e1bab1-03b1-452c-b7a0-e7c7871d9928	co-en-a58e3f12-mlsahgayvsj@demo.marketplace.com	0fce69dcdb383235cc34606c1bbbaec9ec588802c861ab2bf4cde3b1ea521c17	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Alpha Website Development Works Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.538	2026-02-18 17:11:42.54	2026-02-18 17:11:42.54	t	0	\N
f85da087-3d66-4b01-9ca7-5d1baee8a1e7	co-ar-a58e3f12-mlsahgb46lx@demo.marketplace.com	cab3d4df69e497d49fb0e4c880aa7f6c99192e8818d7c4e8768bd8c16ddf5fff	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة تصميم وتطوير مواقع المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.544	2026-02-18 17:11:42.546	2026-02-18 17:11:42.546	t	0	\N
86009149-d8af-4380-a5d5-20ae8ec252ff	co-en-b2a5e338-mlsahgbax0z@demo.marketplace.com	4839f74652511edef7d0b536c013e506b23df11de7fb87723471e1e7d3ea84dc	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Elite E-commerce Dev Team Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.55	2026-02-18 17:11:42.552	2026-02-18 17:11:42.552	t	0	\N
1d6a0f4e-faa2-48dd-9525-05f186bf89c0	co-ar-b2a5e338-mlsahgbg81u@demo.marketplace.com	6c76e87f9bfd222d9c8603f206792906227ef0f640bc069bdbff8d5e8b9a81e9	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة متاجر إلكترونية المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.556	2026-02-18 17:11:42.558	2026-02-18 17:11:42.558	t	0	\N
842174c5-3e39-4bbd-905a-78bb52239079	co-en-9aa93818-mlsahgbo4ok@demo.marketplace.com	4986563735649942048356e07094771069f845e497e94016ce9581c8bc1a37bf	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Prime Mobile App Dev Team Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.564	2026-02-18 17:11:42.566	2026-02-18 17:11:42.566	t	0	\N
68f8e694-adf1-4aa5-8c39-b0e981538f14	co-ar-9aa93818-mlsahgbu6wp@demo.marketplace.com	884593305fe0f1660abc10bd2d14266db2bc11d264d62071189152ba05663dd7	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز تطبيقات موبايل المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.57	2026-02-18 17:11:42.572	2026-02-18 17:11:42.572	t	0	\N
2d2e9dba-aefa-4cf0-9288-a4929088321d	co-en-50187776-mlsahgc0cpg@demo.marketplace.com	c44232e78fb483247098a9b696f4cb95c566c14a03693f699fe3114719642c64	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Best UI/UX Design Experts Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.576	2026-02-18 17:11:42.578	2026-02-18 17:11:42.578	t	0	\N
f5b85036-58db-4730-8d17-2aa8dce63c2b	co-ar-50187776-mlsahgc6jl1@demo.marketplace.com	bfd83094176a2b933484d5278486c5492e74e9d9074f967c3144c3bd1bf6baa3	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة تصميم واجهات المستخدم المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.582	2026-02-18 17:11:42.584	2026-02-18 17:11:42.584	t	0	\N
f0a6b363-4455-47aa-8250-6c2338872a57	co-en-d2c3038f-mlsahgccwkk@demo.marketplace.com	85fbec72dd784220aa753a1945a9af094caf9703449751a187ae44d9e4e90903	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Expert Digital Marketing Works Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.588	2026-02-18 17:11:42.59	2026-02-18 17:11:42.59	t	0	\N
4b9b2f13-70ad-4dd4-ba90-0c172ed55d7d	co-ar-d2c3038f-mlsahgcij9p@demo.marketplace.com	14ec480d4189e0d48d146faf9b371f3221c6242ba1351da9ac7a9b2f4a58859a	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء تسويق رقمي للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.594	2026-02-18 17:11:42.597	2026-02-18 17:11:42.597	t	0	\N
284da8a7-59fc-4a36-bf56-53142735f062	co-en-ae53a59e-mlsahgcqfmw@demo.marketplace.com	bcf72743565d1f10c44419a25f758416583a2eaab1d866c8c6d0999c77ee630f	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Expert SEO Services Works Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.603	2026-02-18 17:11:42.605	2026-02-18 17:11:42.605	t	0	\N
4f34def0-b65d-4efb-b896-fdc919bc3888	co-ar-ae53a59e-mlsahgcx8n8@demo.marketplace.com	23644de12f0658a8522425ee3b7cdaf0b3116311f325fff7ef0fe339f672bb40	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة تحسين محركات البحث المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.609	2026-02-18 17:11:42.611	2026-02-18 17:11:42.611	t	0	\N
f132742e-cb92-427a-8d43-0aa34115942e	co-en-f4f9931a-mlsahgd33gk@demo.marketplace.com	59ab1968d252a25b48d6d6436e9457e36aa370b1dbcd93bd81f228f99b5e69eb	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Elite Paid Ads Mgmt Agency Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.615	2026-02-18 17:11:42.618	2026-02-18 17:11:42.618	t	0	\N
b56c99a9-2784-4a7d-97b6-7dcf34ef7bd6	co-ar-f4f9931a-mlsahgdbgdb@demo.marketplace.com	a22e030f4b10d2693e72ea84b09eabdf5f0cf3d1bfefa5fb33c41e8ba301a4d0	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة إدارة حملات إعلانية المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.623	2026-02-18 17:11:42.625	2026-02-18 17:11:42.625	t	0	\N
2fb40163-2ecc-4f2c-87ba-7ec3eafc9b27	co-en-4ff97148-mlsahgdhz7r@demo.marketplace.com	cb6a0414cb387a996613760c7890b407183ac2a77cdf5fc77ba9de0b8aefeaea	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Elite Business Group Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.629	2026-02-18 17:11:42.631	2026-02-18 17:11:42.631	t	0	\N
705ac7c7-51d3-4e41-a6ff-5b787b58134f	co-ar-4ff97148-mlsahgdne6v@demo.marketplace.com	eef58dc40a6da500d3a5ae9d17ca44e4fb9dad7840060e95c23155083cfe9525	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة أعمال المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.635	2026-02-18 17:11:42.637	2026-02-18 17:11:42.637	t	0	\N
e422a041-f75b-4228-a902-305cf80a1aae	co-en-dd57d659-mlsahgdscc7@demo.marketplace.com	45404a33e2000373341dc5b180990f991892fb4c7b82ebd99aa523d5e3424313	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Pro Accounting Services Agency Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.64	2026-02-18 17:11:42.642	2026-02-18 17:11:42.642	t	0	\N
09846831-1fdc-4d30-9998-7f54f54eaea7	co-ar-dd57d659-mlsahgdzktj@demo.marketplace.com	d64c78ae01678af5d9fdac511526ca32003940da9217a3380ac5ed4692113e5c	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة خدمات محاسبية للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.647	2026-02-18 17:11:42.649	2026-02-18 17:11:42.649	t	0	\N
5bf4c7f8-f440-42fb-925c-ed31c0b02745	co-en-11552f47-mlsahge6av5@demo.marketplace.com	db9080da178c5ce49d63412db15aa732a59d00bdb0bbc8cf508e354485544bcd	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Swift Legal Consultation Co Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.654	2026-02-18 17:11:42.656	2026-02-18 17:11:42.656	t	0	\N
98149768-4d82-44c7-a516-7f8c22c4c216	co-ar-11552f47-mlsahgecp8w@demo.marketplace.com	7fd1c3f3cc9fad074635970b5e3bb9341d383f2f9dd3335400c4293cdf8c667a	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز استشارات قانونية المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.66	2026-02-18 17:11:42.662	2026-02-18 17:11:42.662	t	0	\N
befccf5f-2c82-4b96-9669-9202750df638	co-en-8ad81af4-mlsahgei26m@demo.marketplace.com	2e62d2df525fcc3acdae11a0b21d191a3b146703cfa30bd435d4dd3b80929a43	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Star Tax Consultation Partners Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.666	2026-02-18 17:11:42.668	2026-02-18 17:11:42.668	t	0	\N
dea984e1-c198-4872-ad62-4b113e235d35	co-ar-8ad81af4-mlsahgeox6p@demo.marketplace.com	60e02174550ef5e12dbf7d7d5ed3dd225fab899b2d3c98fd33c7377a6e4c151a	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة استشارات ضريبية المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.672	2026-02-18 17:11:42.674	2026-02-18 17:11:42.674	t	0	\N
7b38ee51-d14c-4154-9cff-16e68022478e	co-en-c578b972-mlsahgeux8s@demo.marketplace.com	890840870480894de2e25352f8034945ca5a292b798023ac5e9e41b5b0c6f600	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Star Company Registration Experts Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.678	2026-02-18 17:11:42.68	2026-02-18 17:11:42.68	t	0	\N
64cc5c67-bc20-460f-809c-8ce7b3c2cb9d	co-ar-c578b972-mlsahgf0ebn@demo.marketplace.com	f3650ec965dbeb085f32099e9accdfab6e13b36998f4e1f405dfbf80f00178b8	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة تأسيس شركات المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.684	2026-02-18 17:11:42.686	2026-02-18 17:11:42.686	t	0	\N
12dfad0c-0622-4da1-9f63-4c423ea96f2a	co-en-4e4ff339-mlsahgf70bu@demo.marketplace.com	ae2a27b41ea6eac62a45f9b03b55f738251e43ad70052c96f4f0c9e3a3a7bd05	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Prime Business Consulting Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.691	2026-02-18 17:11:42.693	2026-02-18 17:11:42.693	t	0	\N
228391ff-da15-4c2b-ad6e-09f1d9619413	co-ar-4e4ff339-mlsahgfcssd@demo.marketplace.com	33b49a3df33caa60a51575e20bbf120177b4c0adce8b3cf31a3c2320c5e9db1e	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة استشارات أعمال المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.697	2026-02-18 17:11:42.699	2026-02-18 17:11:42.699	t	0	\N
1f04e16f-b733-4db5-b2fd-74df85ba9107	co-en-03d91ca1-mlsahgfjg3m@demo.marketplace.com	bd38c6546b9d2865f77a7f9e7334a5b84a46256cb1d9ca86f39deac8a2998e66	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Swift HR & Recruitment Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.704	2026-02-18 17:11:42.706	2026-02-18 17:11:42.706	t	0	\N
c5a69745-081b-4d84-a9d8-9f22b46e1dde	co-ar-03d91ca1-mlsahgfpb4w@demo.marketplace.com	8d8f22f780ddcf169007fd6097a7e2382d8b0bc58634d6b2bea17926c6b626b7	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة توظيف وموارد بشرية المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.709	2026-02-18 17:11:42.711	2026-02-18 17:11:42.711	t	0	\N
e4e478de-4b69-4463-9f74-70d77d6d3012	co-en-2f9602ea-mlsahgfvgp3@demo.marketplace.com	21fa1dcb76467d4cb42902c34a1a5f7553f6766ce2dcc87df1812f673c63336d	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Top Office Setup Experts Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.715	2026-02-18 17:11:42.717	2026-02-18 17:11:42.717	t	0	\N
8835469a-611a-4ddf-8a38-5def414ccd18	co-ar-2f9602ea-mlsahgg1x98@demo.marketplace.com	b7a4160b6f02b8d948b13bc4d90741a910961f667e28fe8d31bddaba2e413835	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة تجهيز مكاتب للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.721	2026-02-18 17:11:42.724	2026-02-18 17:11:42.724	t	0	\N
bc91a26d-cd67-4455-8209-a0e89d580c5c	co-en-a32a9674-mlsahgga9e1@demo.marketplace.com	e40dfbbdf8a499e566579063bdf9d86f8c94b150e9ea423e4f4efc8c2bf861f0	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Elite PRO Services Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.73	2026-02-18 17:11:42.733	2026-02-18 17:11:42.733	t	0	\N
e0ebcd78-9f3e-4f4b-81bc-d23c657b159a	co-ar-a32a9674-mlsahggi3qw@demo.marketplace.com	b0c6ac002a1c7ab18f5bb2517d4741e7e3906d013f4dbf4f45aa110153fa2d39	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء خدمات تعقيب المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.738	2026-02-18 17:11:42.741	2026-02-18 17:11:42.741	t	0	\N
3afada04-f187-49d8-b9af-fa2bcad702a8	co-en-28584798-mlsahggqiiv@demo.marketplace.com	ba1552e7f5d1caba75a4738ef15385009dcdb03d62b5ceeeaebee34b00acf7b6	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Pro Translation Group Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.746	2026-02-18 17:11:42.748	2026-02-18 17:11:42.748	t	0	\N
f62153d1-c3df-4cf2-a375-a37397d6d979	co-ar-28584798-mlsahggxjox@demo.marketplace.com	4ed577e472a7c35afd0b8ff021c7cebeb1be068de3109e562fa7d989cf74def2	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة ترجمة معتمدة للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.754	2026-02-18 17:11:42.756	2026-02-18 17:11:42.756	t	0	\N
bc444bd2-d77d-4f4a-8aea-5a345f988158	co-en-71cdffe5-mlsahgh5uky@demo.marketplace.com	9c08919bc225ea02c54759d8e4843cb6931c49fd3f4f5dfd18eac36f5fb35f44	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Swift Design Co Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.761	2026-02-18 17:11:42.764	2026-02-18 17:11:42.764	t	0	\N
e7b3614a-b1a8-43bd-b0bd-65e25f826837	co-ar-71cdffe5-mlsahghef5y@demo.marketplace.com	3ac129eeb8f308401d41dbfdbf9b0ea2a72cd0b44ea1af68543c6c3dc8ee2f10	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة تصميم المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.77	2026-02-18 17:11:42.772	2026-02-18 17:11:42.772	t	0	\N
f4ceb662-3ffd-45d5-935a-60593ebb1bc5	co-en-deb10409-mlsahghobzy@demo.marketplace.com	90381596c6b228a73ed83c1403ed36410bafd51e6902d0d43f23488b3f8beaa6	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Best Photography Agency Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.78	2026-02-18 17:11:42.783	2026-02-18 17:11:42.783	t	0	\N
ceff3f8a-34e1-42bf-9cf9-e86fd0f34019	co-ar-deb10409-mlsahghxc4s@demo.marketplace.com	ec4124f4264bd67217fee1c3961fffdb2e6dc6084eb3582473a1081f4b08f13a	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء تصوير احترافي للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.79	2026-02-18 17:11:42.792	2026-02-18 17:11:42.792	t	0	\N
2741ff2d-4557-41f1-b8ab-e809924aff46	co-en-9f883a2f-mlsahgi59hz@demo.marketplace.com	c9ee9dc5cbb517b053a2ce29851b93d90403e7df1952dd95c6d73667b74a6ab5	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Best Graphic Design Co Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.797	2026-02-18 17:11:42.799	2026-02-18 17:11:42.799	t	0	\N
930ce1cc-5c40-46ef-80de-04e8bf044f3c	co-ar-9f883a2f-mlsahgiduyu@demo.marketplace.com	24982b9b898947795b988f09cd5bde450b12c86e7e67862dc709c1d407e116e4	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة تصميم جرافيك المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.805	2026-02-18 17:11:42.808	2026-02-18 17:11:42.808	t	0	\N
d9124894-67f1-41d0-854e-0652add2b63c	co-en-f684e579-mlsahgim5w6@demo.marketplace.com	c8b4b4228196116b9d1238a8eaf4c28cfd1e1e96a91f14136c4c1f1a5e162d98	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Alpha Branding & Identity Solutions Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.814	2026-02-18 17:11:42.816	2026-02-18 17:11:42.816	t	0	\N
917c9f83-f5b7-448d-bf27-ff8c81b3e5f8	co-ar-f684e579-mlsahgismm0@demo.marketplace.com	ad259a476825c6c2137e464061b50f30a48a932235435fda9c56cc8bf242f26a	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة هوية بصرية المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.82	2026-02-18 17:11:42.822	2026-02-18 17:11:42.822	t	0	\N
6dd5faa3-48ea-4051-8d54-e3c6c36c2288	co-en-e2e4e7b7-mlsahgiyuqs@demo.marketplace.com	98f827729be2dcc3a4266e2c796f196934477998abe1ca4e8b0d434270b348e9	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Star 3D Visualization Experts Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.826	2026-02-18 17:11:42.828	2026-02-18 17:11:42.828	t	0	\N
175365c5-92ff-40c4-bd74-4a0a7703b781	co-ar-e2e4e7b7-mlsahgj3gbq@demo.marketplace.com	aeacacfb7368d9cf88c4fa7cba1717ac1b05668c1ca132920c89474bd63bc624	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة تصميم ثلاثي الأبعاد المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.831	2026-02-18 17:11:42.833	2026-02-18 17:11:42.833	t	0	\N
1f391e89-3b32-4bf6-bc3f-8f25f39480c7	co-en-85ecc7e5-mlsahgj9g3g@demo.marketplace.com	4506a9395297bbba6240716428ab7b0b000e183485531bf9d6cec2258c565631	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Alpha Interior Design Hub Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.837	2026-02-18 17:11:42.839	2026-02-18 17:11:42.839	t	0	\N
339d8d17-99dc-4d9a-8e32-bb8220dc757d	co-ar-85ecc7e5-mlsahgjfirb@demo.marketplace.com	1104d80c874f7aa4dca7bdbc66bba51444e25b18a3243aebdacef076c5400586	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء تصميم داخلي المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.843	2026-02-18 17:11:42.844	2026-02-18 17:11:42.844	t	0	\N
e54e148f-4412-4104-987e-36d8d50e0d39	co-en-9e64837b-mlsahgjkn6n@demo.marketplace.com	2ce77823b8dcaebd3dd70b3d515ab0b4278211f3f1fa7f642cfbfea10a2ea502	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Pro Landscape Design Experts Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.848	2026-02-18 17:11:42.849	2026-02-18 17:11:42.849	t	0	\N
b22c7a97-09ec-43e6-95e7-769ddf76fa80	co-ar-9e64837b-mlsahgjpko2@demo.marketplace.com	0e6ea89c1e59a9c46016c7d0ca3cb99d19a4bf77acee50db7ae7c9a7d5410049	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز تصميم حدائق المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.853	2026-02-18 17:11:42.855	2026-02-18 17:11:42.855	t	0	\N
85694ebe-70c9-47d3-8160-fbb9e8c6f3cf	co-en-06dee9e7-mlsahgjvu1g@demo.marketplace.com	55a72442ba78b592996c61ef4b648cce093deee61a4214c67de06a39dd10ead1	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Expert Logo Design Team Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.859	2026-02-18 17:11:42.861	2026-02-18 17:11:42.861	t	0	\N
09c56172-af36-4e8c-a9d1-8acbb359eb28	co-ar-06dee9e7-mlsahgk0rut@demo.marketplace.com	8b8ce03669fa9b65c542ca4730cdf25b54e3a19790757b2cdf660bc3f63134d5	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة تصميم شعارات المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.864	2026-02-18 17:11:42.867	2026-02-18 17:11:42.867	t	0	\N
6b6f6928-a50f-4562-b18a-c37b9283e526	co-en-0c401f45-mlsahgk6ztz@demo.marketplace.com	81a604a479fa37a1995b35010aa33defa5bc0361c222949fb5e967ce9b84bd0a	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Best Architectural Design Partners Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.87	2026-02-18 17:11:42.873	2026-02-18 17:11:42.873	t	0	\N
bcd2ecf2-23e5-473b-a1c4-2cba498d4ce2	co-ar-0c401f45-mlsahgkcm69@demo.marketplace.com	d7a7542c6b4f880b951c0f117f541bc9cdeba530d46469e8817f64e722a00c49	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة تصميم معماري الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.876	2026-02-18 17:11:42.878	2026-02-18 17:11:42.878	t	0	\N
4ef2e1fa-3b7c-46c1-8685-c0caceb17df3	co-en-80ba105a-mlsahgkhebf@demo.marketplace.com	848ab4a8894eab717fe2971d0949f9ff9edeaabc80bc7ffb7e22ce215903278e	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Swift Video Production Co Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.882	2026-02-18 17:11:42.883	2026-02-18 17:11:42.883	t	0	\N
72e5663f-9d8a-4edf-9636-4fe3f35af9d6	co-ar-80ba105a-mlsahgkn94m@demo.marketplace.com	4e82165d8b8bf9e4ad4288e2bd06bae2f83f56189d82392a6283f898cf54b5e3	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء إنتاج فيديو المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.887	2026-02-18 17:11:42.889	2026-02-18 17:11:42.889	t	0	\N
8a08973c-ebaf-4304-ac3b-2b1af0dc559a	co-en-e4b87995-mlsahgktoup@demo.marketplace.com	85e34a885b4cdd6ac430bb6ea0747565183de87622f50803060fa0c731b60894	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Prime Central AC Systems Partners Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.893	2026-02-18 17:11:42.895	2026-02-18 17:11:42.895	t	0	\N
68cbab23-12cf-4543-9e1e-a6f19f4863cf	co-ar-e4b87995-mlsahgkz6fv@demo.marketplace.com	2102a5fc66c046eb401cb7b368f1a974b733630ba34adb6754450527e04457c9	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة تكييف مركزي المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.899	2026-02-18 17:11:42.901	2026-02-18 17:11:42.901	t	0	\N
6fe2388c-d729-41ca-9a47-d03d91286ab4	co-en-99d200f3-mlsahgl5nr1@demo.marketplace.com	2f78ecd0ed604007c17d23523812de4b9734248416236e45ef33e5b596b0091d	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Elite Heating Repair Co Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.905	2026-02-18 17:11:42.907	2026-02-18 17:11:42.907	t	0	\N
b590e414-4a57-46dc-ab3b-fa541e84a9ba	co-ar-99d200f3-mlsahglbfqj@demo.marketplace.com	b4a817463d8b35fb1df4f18331eb798da47b261dba5497c1ebf6d41cca89eaeb	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة صيانة أنظمة تدفئة للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.911	2026-02-18 17:11:42.913	2026-02-18 17:11:42.913	t	0	\N
057ec602-1652-4b2a-9d5a-2db40e966dff	co-en-c51e73dc-mlsahglhq7d@demo.marketplace.com	2560f714bf7e8d7b592c965ef0743cd182f8a0d803ee918fd6c1dfa229602c8b	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Prime Duct Install & Cleaning Group Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.917	2026-02-18 17:11:42.919	2026-02-18 17:11:42.919	t	0	\N
dfe052c6-a962-4ee2-bd4c-375e34fa2da4	co-ar-c51e73dc-mlsahglohbm@demo.marketplace.com	e055553b88dccdfa2fdb9c03747f888d482174634704efb361fb25b3586c55aa	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء تركيب وتنظيف دكت المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.924	2026-02-18 17:11:42.926	2026-02-18 17:11:42.926	t	0	\N
b2993066-5dc5-4144-ab77-aa9e96522b3a	co-en-998ed8b1-mlsahglu7ox@demo.marketplace.com	3273fb9499d9ab11d88224379adf3e4a130f9ae4ca74f439075a185cb16f4da3	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Swift Thermostat Install Experts Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.93	2026-02-18 17:11:42.932	2026-02-18 17:11:42.932	t	0	\N
641bf7c2-0c19-4ccb-81ed-02efa95b8c2b	co-ar-998ed8b1-mlsahgm1173@demo.marketplace.com	b5c782b4e934c07fe87bfcf5a71d99df20ae6aa8392b517eca20c83f52582059	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة تركيب ترموستات المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.937	2026-02-18 17:11:42.939	2026-02-18 17:11:42.939	t	0	\N
8ed77bf5-9fc4-4135-9a5b-5cfc2a4a7629	co-en-a2ff47e5-mlsahgm75re@demo.marketplace.com	68de73fdfa1b896ae94a2365a1c533ffb0dd560ee01ac8893935fc6d01367a4a	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Pro Gas Refill Experts Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.943	2026-02-18 17:11:42.945	2026-02-18 17:11:42.945	t	0	\N
3429f8e8-4c12-4266-845e-bc49a56ebb06	co-ar-a2ff47e5-mlsahgmd1ek@demo.marketplace.com	302d0ad3235002249128cf5649ffda362e3a7d5136ca514b30195874beee8bc4	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة تعبئة غاز المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.949	2026-02-18 17:11:42.951	2026-02-18 17:11:42.951	t	0	\N
787d4575-c701-41fd-8990-d6ca1d09f004	co-en-a9a06bd3-mlsahgmjxgy@demo.marketplace.com	a76d3e19b42a6dfe1ccd40d624e6b5c1efbacb89722071daed3820260fe6f39c	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Apex HVAC Inspection Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.955	2026-02-18 17:11:42.957	2026-02-18 17:11:42.957	t	0	\N
d48fcf05-908b-45a5-8de2-0fbead2d8028	co-ar-a9a06bd3-mlsahgmoltr@demo.marketplace.com	19f44983975907099f5a76d30d3de5ea189751a89808f6f695917c83db105927	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة فحص أنظمة التكييف المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.96	2026-02-18 17:11:42.963	2026-02-18 17:11:42.963	t	0	\N
20b37e0d-16a0-4111-8f95-bf2186a3e8d0	co-en-094e4723-mlsahgmuu6g@demo.marketplace.com	d8c9db5bd077e5909b372bc0861d6c6e591cfe81d16bd8593853dd9a4bead55b	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Pro Network Installation Solutions Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.967	2026-02-18 17:11:42.969	2026-02-18 17:11:42.969	t	0	\N
33aa4105-0958-47d7-9285-9642e5c717fb	co-ar-094e4723-mlsahgn0ikx@demo.marketplace.com	b4acdac25c46c9aeb01476a398f41a0b4d5987b32c7c5ab376610f8086918b89	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة تمديد شبكات الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.972	2026-02-18 17:11:42.974	2026-02-18 17:11:42.974	t	0	\N
768d6504-c4bf-4289-910e-d76a7cae10d7	co-en-86a76eb4-mlsahgn73vi@demo.marketplace.com	891298d93e13104358f3c1012ebf2fdca85d70e5af9400390f23edd0efae9ec8	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Top Server Installation Co Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.979	2026-02-18 17:11:42.981	2026-02-18 17:11:42.981	t	0	\N
a86fd955-781b-475c-9dbb-4746c47581af	co-ar-86a76eb4-mlsahgnd31d@demo.marketplace.com	7f3102f8d5e2f027356bfdf3dcdddf28baed2b1eec8c556df5c78e3721c40c51	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز تركيب سيرفرات الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.985	2026-02-18 17:11:42.987	2026-02-18 17:11:42.987	t	0	\N
189568d6-c452-466e-a8ce-f1e7d5710f71	co-en-0908a7a2-mlsahgnkks9@demo.marketplace.com	aa2a5919051a059f2acc345fff398f80f4eaecc3e13e1f7d0f57886799017f3c	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Top Server Maintenance Services Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:42.992	2026-02-18 17:11:42.994	2026-02-18 17:11:42.994	t	0	\N
4495bbaf-52c0-47d8-bfe0-1cb9865b5b10	co-ar-0908a7a2-mlsahgnquzh@demo.marketplace.com	75086f445f7740fad6219bf3581c81ba1fff53184a3e6cae97741e48f09ca656	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة صيانة سيرفرات المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:42.998	2026-02-18 17:11:43	2026-02-18 17:11:43	t	0	\N
16f18bc6-5341-4724-a55c-60193bf7afda	co-en-1b0eb73a-mlsahgnxvs5@demo.marketplace.com	63a17050641bf492f2b570edd18be218576ebea76fd5ef1ab8838679fd634d9e	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Prime Hardware Repair Solutions Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:43.005	2026-02-18 17:11:43.007	2026-02-18 17:11:43.007	t	0	\N
7a75097d-47e2-4ce6-8c12-522cf1018990	co-ar-1b0eb73a-mlsahgo37l1@demo.marketplace.com	98b4bc7adf0e323fe19ca036a52a9cb3becaf27bbb7254a75cd2ac180fabcc1c	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز صيانة أجهزة كمبيوتر الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:43.012	2026-02-18 17:11:43.014	2026-02-18 17:11:43.014	t	0	\N
d0fa317a-c56b-4982-adb9-4f07c8ce9f9c	co-en-6da456be-mlsahgob4re@demo.marketplace.com	dbe709ba7b28af9bac5fcb5127890cca4a0593eeab4fef1044310c95e489cf6b	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Swift Printer Setup Partners Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:43.019	2026-02-18 17:11:43.021	2026-02-18 17:11:43.021	t	0	\N
5d9a77ee-636b-443a-868e-e642d8c1c4fa	co-ar-6da456be-mlsahgok1sy@demo.marketplace.com	29ee11de265f82b05fe341e80c4fcb1a85ed85b55692a0ff0d7c13f78deeed6c	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز تعريف طابعات المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:43.028	2026-02-18 17:11:43.03	2026-02-18 17:11:43.03	t	0	\N
e4181dba-e5c1-4c65-8c17-8ad55407a819	co-en-7245e6a5-mlsahgorh6a@demo.marketplace.com	189fe57cef74cdff204fe69f6db181a925f83cbd80e26e88ab3350053ba806b6	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Pro CCTV Integration Experts Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:43.035	2026-02-18 17:11:43.037	2026-02-18 17:11:43.037	t	0	\N
4e7ac101-1e64-40e2-897b-4868ffd77705	co-ar-7245e6a5-mlsahgoxstu@demo.marketplace.com	4415fe7c8c149f424a89fe424cdaf227ca05301bbea4fdc27f54d14e7f4e3019	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة ربط كاميرات بالشبكة المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:43.041	2026-02-18 17:11:43.043	2026-02-18 17:11:43.043	t	0	\N
f73cacc9-a823-4e36-b772-bc4eba6e50d2	co-en-6c3eb205-mlsahgp2l90@demo.marketplace.com	a6445d00f622079ce50eca96f4b9972de7d5ab6a7dc98b7e7d38f7c02c790f88	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Best Maintenance Contracts Experts Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:43.046	2026-02-18 17:11:43.048	2026-02-18 17:11:43.048	t	0	\N
fabc231a-38fe-4221-a3b2-da9d23dddf06	co-ar-6c3eb205-mlsahgp8ss3@demo.marketplace.com	5776490c93ef1e2de67aba76d9ce3f147113a0f8f289a8c9fa7d0aa7f811b536	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء عقود صيانة دورية المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:43.053	2026-02-18 17:11:43.054	2026-02-18 17:11:43.054	t	0	\N
bc0db561-fba5-44e7-8471-72854fec9f59	co-en-647011ed-mlsahgpewz2@demo.marketplace.com	0b00d50773db3a46d348dba02be5d1ec58d23e7a59053464beab00f8c6997d2b	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Best Data Recovery Partners Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:43.058	2026-02-18 17:11:43.06	2026-02-18 17:11:43.06	t	0	\N
53fd7767-37a1-4d93-aed4-32deec707197	co-ar-647011ed-mlsahgpkvut@demo.marketplace.com	8a4c936be83b3c6386a8153915847e93470366147fdca16fc3bfb5f257ad815a	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة استعادة بيانات الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:43.064	2026-02-18 17:11:43.067	2026-02-18 17:11:43.067	t	0	\N
a43dd4a2-4f3f-4837-8074-98aa8be85c3d	co-en-a58e3f12-mlsahgprfrw@demo.marketplace.com	50f06bce2d58f06c74aa527bcca8e4586fc99629e5f86efffaca4c0b7c472ebe	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Expert Website Development Experts Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:43.071	2026-02-18 17:11:43.073	2026-02-18 17:11:43.073	t	0	\N
a02be373-64ba-4a17-aefd-63e347a391df	co-ar-a58e3f12-mlsahgpxg7v@demo.marketplace.com	d5aaa51eae1ef31123f387dcfaff38554160371c878de79d7cb358656cdd5747	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة تصميم وتطوير مواقع المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:43.077	2026-02-18 17:11:43.079	2026-02-18 17:11:43.079	t	0	\N
f3e17ae5-47cc-4f14-bbe8-50654a8f6d62	co-en-b2a5e338-mlsahgq3fe8@demo.marketplace.com	8d57a24a44c5bcf37702adb9f939ff2e6b1b0f327d29fc32d96f903f3039e6b3	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Top E-commerce Dev Co Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:43.083	2026-02-18 17:11:43.085	2026-02-18 17:11:43.085	t	0	\N
2690459f-a4cc-4e89-8028-5f5c5066eb2e	co-ar-b2a5e338-mlsahgq9eec@demo.marketplace.com	54dee3e6d38347065981c23c9848157c6c448579b49788b322cad76847431f78	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة متاجر إلكترونية الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:43.089	2026-02-18 17:11:43.091	2026-02-18 17:11:43.091	t	0	\N
6b73b5b3-d4af-4048-bb10-132937dc2826	co-en-9aa93818-mlsahgqff0m@demo.marketplace.com	f6f37f6cd44ac5e62b022da74c3e5493ee5387be13c1275fdb54c69f02c16c73	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Pro Mobile App Dev Experts Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:43.095	2026-02-18 17:11:43.097	2026-02-18 17:11:43.097	t	0	\N
d3b915d5-9436-47c9-9e36-dbb6466de4b5	co-ar-9aa93818-mlsahgql797@demo.marketplace.com	9b6923b649b8d8a614c7f69e0101fc0b485fb1fb8e627be27a3924983297e5e4	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء تطبيقات موبايل المتكاملة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:43.101	2026-02-18 17:11:43.104	2026-02-18 17:11:43.104	t	0	\N
90e02423-28b2-43c6-84f4-8f0f6e1905a9	co-en-50187776-mlsahgqszq5@demo.marketplace.com	4d723b68bc8496771908fb88a03b339bf7f0f56395d33de72487377ecacdda7d	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Elite UI/UX Design Partners Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:43.108	2026-02-18 17:11:43.11	2026-02-18 17:11:43.11	t	0	\N
2e128cb7-4f9a-4a00-a7a9-df1bcf5d8b13	co-ar-50187776-mlsahgqx64c@demo.marketplace.com	8e38ed7cbacd67b988717a61b1bbe2f8a5d2df908f09afd5fc3e19a25954ca35	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء تصميم واجهات المستخدم المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:43.113	2026-02-18 17:11:43.116	2026-02-18 17:11:43.116	t	0	\N
4c6fb6c1-8d13-4397-8e22-6332906d9c33	co-en-d2c3038f-mlsahgr4xxa@demo.marketplace.com	a2767bfd0a206647cd1aef399d0e2738aedf2cb1487a6dc88cd1c11d016b7209	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Pro Digital Marketing Team Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:43.12	2026-02-18 17:11:43.122	2026-02-18 17:11:43.122	t	0	\N
be965ba5-51e2-4d1a-8337-b448eadc5d94	co-ar-d2c3038f-mlsahgraq7t@demo.marketplace.com	a405ca6feeb81c3f3ef43447b3570824df2b589816af3c7656f95605ce7d84d6	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مجموعة تسويق رقمي المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:43.127	2026-02-18 17:11:43.128	2026-02-18 17:11:43.128	t	0	\N
c5336036-266d-467b-a4fc-185dc57630c9	co-en-ae53a59e-mlsahgrhhp7@demo.marketplace.com	dca394c7121ad2771a095cbc4a1b7a496292c06fbc7813300bab498b82cb0e33	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Expert SEO Services Works Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:43.133	2026-02-18 17:11:43.135	2026-02-18 17:11:43.135	t	0	\N
c4c79b9f-ec38-479f-b71a-3d936c9c08f7	co-ar-ae53a59e-mlsahgrnt5f@demo.marketplace.com	a954364ca5893d7ed39dada50ae7e414f68359d21717abc91e6467e392851aa8	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز تحسين محركات البحث المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:43.139	2026-02-18 17:11:43.141	2026-02-18 17:11:43.141	t	0	\N
a40e94ad-8697-4e19-9061-c9066c447551	co-en-f4f9931a-mlsahgru90j@demo.marketplace.com	d97bc2e095e0d27f5112ed96d529f678df9f2454ffe7db51134b14eaa1f75dbc	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Expert Paid Ads Mgmt Team Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:43.146	2026-02-18 17:11:43.148	2026-02-18 17:11:43.148	t	0	\N
5af1e01d-8665-4992-9eb3-8092c1b574f7	co-ar-f4f9931a-mlsahgs069g@demo.marketplace.com	2cd426186b882b93ffc2f57c615db34699ee84b60c8e5605b4c7a28adcd61ebe	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة إدارة حملات إعلانية الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:43.152	2026-02-18 17:11:43.154	2026-02-18 17:11:43.154	t	0	\N
5879a4de-a93c-48ee-ac6a-d5398226b4af	co-en-03d91ca1-mlsahgs75ph@demo.marketplace.com	2243178dbf32c0d6017c130a29db35a8c215da1110ea20149468be91330c8eff	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Swift HR & Recruitment Solutions Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:43.159	2026-02-18 17:11:43.161	2026-02-18 17:11:43.161	t	0	\N
121815ba-775a-42ac-8f65-8af681c055e1	co-ar-03d91ca1-mlsahgscyh8@demo.marketplace.com	aeba2a943a5a8b04bdc9af809b7d69954af7fc3d0b6f45a705689dd353d838cb	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة توظيف وموارد بشرية المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:43.165	2026-02-18 17:11:43.167	2026-02-18 17:11:43.167	t	0	\N
845b9c4e-9f64-40d8-8537-f1dc0edb51ca	co-en-2f9602ea-mlsahgsjl9t@demo.marketplace.com	f43d4103dd8078a1bd2503b6a56433d5071632dde3946f9d38d11c06118d200e	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Swift Office Setup Solutions Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:43.171	2026-02-18 17:11:43.173	2026-02-18 17:11:43.173	t	0	\N
29f8c5e6-d0b0-4977-a9d5-b7d150626f4a	co-ar-2f9602ea-mlsahgspngc@demo.marketplace.com	3e2356ce55e439f428d70e0a23a535d05fe412c9c12d79f24ab43a11578b6f88	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مؤسسة تجهيز مكاتب الاحترافية مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:43.177	2026-02-18 17:11:43.179	2026-02-18 17:11:43.179	t	0	\N
5333d926-c10c-491e-bb99-5212c9ce5fe5	co-en-a32a9674-mlsahgsuffy@demo.marketplace.com	c4e6fb7d045bef5c25f8c09ad9f7d7091a28fc3ce5b7bdc42bee21f2097d3ffc	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Pro PRO Services Works Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:43.182	2026-02-18 17:11:43.184	2026-02-18 17:11:43.184	t	0	\N
9daa8f68-2bd0-49f0-8351-6a03d994ab74	co-ar-a32a9674-mlsahgt2blj@demo.marketplace.com	437987f9cdbeda9fd89ebbf49ffc5db06d122651c46330f9134aa445d4176ef5	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	شركة خدمات تعقيب للخدمات مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:43.19	2026-02-18 17:11:43.192	2026-02-18 17:11:43.192	t	0	\N
92fda5b7-f29a-4b99-ace9-6f46b933ae92	co-en-28584798-mlsahgt89lh@demo.marketplace.com	575d0996e49568e028723770dfe6e4e3785ec033cc8b522334d8af6d2fdf70d2	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Elite Translation Hub Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:43.196	2026-02-18 17:11:43.199	2026-02-18 17:11:43.199	t	0	\N
784c22f9-1f5f-412a-b8ee-c7366384da6a	co-ar-28584798-mlsahgtfxvi@demo.marketplace.com	4bcb3b9300aa1fd3eecfbbf6cd844496ed9be1fcd3fc48bc694f66a1962790ca	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز ترجمة معتمدة المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:43.203	2026-02-18 17:11:43.205	2026-02-18 17:11:43.205	t	0	\N
c61068a7-a02e-4d31-961f-37c3f1c0c360	co-en-06dee9e7-mlsahgtl3km@demo.marketplace.com	6ceb47618b5ffea9373fc75792b402b15a93eb93857ef5a4d1228665ef6ac846	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Expert Logo Design Group Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:43.209	2026-02-18 17:11:43.211	2026-02-18 17:11:43.211	t	0	\N
2e64fcbd-dc4a-4400-a89e-a1a86d5d8b88	co-ar-06dee9e7-mlsahgtsq7y@demo.marketplace.com	66f26e21b5a63b144570cde93ada8d03c13fa8d694808cc74ac0d8f4ee0889d2	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	مركز تصميم شعارات المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:43.216	2026-02-18 17:11:43.218	2026-02-18 17:11:43.218	t	0	\N
5aedcc26-795f-4c12-9c8a-a6ac38f98c13	co-en-0c401f45-mlsahgtzh31@demo.marketplace.com	b3034e4f5473bba2f7bc38033f45eebc7fe12fb2380c65a2f2779e2d19d04e12	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Star Architectural Design Partners Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:43.223	2026-02-18 17:11:43.225	2026-02-18 17:11:43.225	t	0	\N
d8b0e6fa-f701-43ca-9948-2e98adaea26f	co-ar-0c401f45-mlsahgu69c9@demo.marketplace.com	3bbae6c146100bfc2bb46a8bad682912b5dc4937c9da35bb69573d5683271fdf	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء تصميم معماري المتميزة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:43.23	2026-02-18 17:11:43.232	2026-02-18 17:11:43.232	t	0	\N
efb3ec23-e1c9-451b-b132-faeac6343dad	co-en-80ba105a-mlsahgucf10@demo.marketplace.com	dd23f056f485beefd15b18740f16c11779b9edb995755c2afaf245e92d02d47b	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	Top Video Production Team Admin	\N	COMPANY	\N	\N	2026-02-18 17:11:43.236	2026-02-18 17:11:43.238	2026-02-18 17:11:43.238	t	0	\N
546ef993-0ec4-434a-97be-370ac7b22791	co-ar-80ba105a-mlsahguis8l@demo.marketplace.com	0af8ddb9a7bc3ffe4f4f0f12f95e47b11a456f0c356f5cf9ee3350dfc1756d69	$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu	خبراء إنتاج فيديو المتخصصة مدير	\N	COMPANY	\N	\N	2026-02-18 17:11:43.243	2026-02-18 17:11:43.244	2026-02-18 17:11:43.244	t	0	\N
366db2af-9cf4-45d6-b0b7-896f68acd563	company@secure-marketplace.com	cceb18fbac8aede43b53cb15b543f8dc43f966a19e47dc619ad8a49d14a6d49e	$argon2id$v=19$m=65536,t=3,p=4$ItiCxkTQappjLi6K4s6WPg$XnR1uEMC6evvlBup+vJUxdezpDPyv/Xj8LqJbrzK4ao	Verified Company	\N	COMPANY	\N	\N	2026-02-20 09:47:53.583	2026-02-17 10:51:14.64	2026-03-03 11:59:29.092	t	0	\N
c10278db-184c-4242-97c2-5c2fb7ac68b1	kakelstore.se@gmail.com	0a56c3128e304492ec3be6b905d351c7224679f48c3646c115b780ef803e9332	$argon2id$v=19$m=65536,t=3,p=4$b6dSafVQ5jJqFT95+5PiAg$mPnVyRh67ev2+Vf8fGqNYhjKFiDdpNGac0mydzkgBdg	Kakel Store	+9668585621	USER	\N	\N	\N	2026-02-24 09:43:33.545	2026-02-24 09:43:33.545	t	0	\N
2849b948-60db-409c-aac1-5dc6cf411051	admin@secure-marketplace.com	8dfe093ac1c43246e7a7d6cced71a556cee2a5046be37a556aee8d74e2005e72	$argon2id$v=19$m=65536,t=3,p=4$ItiCxkTQappjLi6K4s6WPg$XnR1uEMC6evvlBup+vJUxdezpDPyv/Xj8LqJbrzK4ao	System Admin	\N	ADMIN	\N	\N	2026-02-20 09:47:53.555	2026-02-17 10:51:14.593	2026-03-02 10:43:16.943	t	0	\N
\.


--
-- Data for Name: verification_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.verification_tokens (id, email, token, expires, "createdAt") FROM stdin;
adc584d0-fc9c-4439-ba4d-4d036af33991	ghgjgjgjgy@secure-marketplace.com	6b828a798e43fd30a6319671b90a1da34bfd0eacfd64422829a4c39f9c6a9430	2026-02-19 09:28:33.551	2026-02-18 09:28:33.605
2cd0b5fc-9c4a-4873-9842-31c8ca38d8ed	company@secure-hhhmarketplace.comhhhh	ddaaec82e0f70e302223f88a1ed072ad8308ae4fea55415ce2a223e3c0e419cf	2026-02-19 11:22:15.224	2026-02-18 11:22:15.271
f7417728-a7b2-4719-8ad1-1aaa6bf8190a	companysdsdsdsd@secure-marketplace.com	cec014cf961b983f6e5c916113f0f6fb51d4efe3d5bbe7a742bf07ee9d92a4d0	2026-02-19 11:24:43.857	2026-02-18 11:24:43.873
4eeb0072-283d-4d21-99ed-b65576789daf	kakelstore.se@gmail.com	f90cb7f4781c75066a924fba0d434ce480105cc1bac7f41b99d3b3c823b1c741	2026-02-25 09:43:33.564	2026-02-24 09:43:33.566
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: alert_states alert_states_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alert_states
    ADD CONSTRAINT alert_states_pkey PRIMARY KEY (id);


--
-- Name: areas areas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.areas
    ADD CONSTRAINT areas_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: cities cities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_pkey PRIMARY KEY (id);


--
-- Name: cms_pages cms_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cms_pages
    ADD CONSTRAINT cms_pages_pkey PRIMARY KEY (id);


--
-- Name: cms_sections cms_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cms_sections
    ADD CONSTRAINT cms_sections_pkey PRIMARY KEY (id);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: company_documents company_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_documents
    ADD CONSTRAINT company_documents_pkey PRIMARY KEY (id);


--
-- Name: company_matching_preferences company_matching_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_matching_preferences
    ADD CONSTRAINT company_matching_preferences_pkey PRIMARY KEY (id);


--
-- Name: company_portfolio_items company_portfolio_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_portfolio_items
    ADD CONSTRAINT company_portfolio_items_pkey PRIMARY KEY (id);


--
-- Name: company_services company_services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_services
    ADD CONSTRAINT company_services_pkey PRIMARY KEY (id);


--
-- Name: company_social_links company_social_links_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_social_links
    ADD CONSTRAINT company_social_links_pkey PRIMARY KEY (id);


--
-- Name: company_working_hours company_working_hours_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_working_hours
    ADD CONSTRAINT company_working_hours_pkey PRIMARY KEY (id);


--
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (id);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: feature_flags feature_flags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_pkey PRIMARY KEY (id);


--
-- Name: flag_audit_logs flag_audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flag_audit_logs
    ADD CONSTRAINT flag_audit_logs_pkey PRIMARY KEY (id);


--
-- Name: health_logs health_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.health_logs
    ADD CONSTRAINT health_logs_pkey PRIMARY KEY (id);


--
-- Name: internal_messages internal_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.internal_messages
    ADD CONSTRAINT internal_messages_pkey PRIMARY KEY (id);


--
-- Name: membership_plans membership_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membership_plans
    ADD CONSTRAINT membership_plans_pkey PRIMARY KEY (id);


--
-- Name: memberships memberships_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.memberships
    ADD CONSTRAINT memberships_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: notification_settings notification_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_settings
    ADD CONSTRAINT notification_settings_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: offers offers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT offers_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: project_audit_logs project_audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_audit_logs
    ADD CONSTRAINT project_audit_logs_pkey PRIMARY KEY (id);


--
-- Name: project_files project_files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_files
    ADD CONSTRAINT project_files_pkey PRIMARY KEY (id);


--
-- Name: project_milestones project_milestones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_milestones
    ADD CONSTRAINT project_milestones_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: security_logs security_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.security_logs
    ADD CONSTRAINT security_logs_pkey PRIMARY KEY (id);


--
-- Name: service_requests service_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_requests
    ADD CONSTRAINT service_requests_pkey PRIMARY KEY (id);


--
-- Name: sla_reports sla_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sla_reports
    ADD CONSTRAINT sla_reports_pkey PRIMARY KEY (id);


--
-- Name: staff_members staff_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff_members
    ADD CONSTRAINT staff_members_pkey PRIMARY KEY (id);


--
-- Name: staff_roles staff_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff_roles
    ADD CONSTRAINT staff_roles_pkey PRIMARY KEY (id);


--
-- Name: user_settings user_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_settings
    ADD CONSTRAINT user_settings_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: verification_tokens verification_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification_tokens
    ADD CONSTRAINT verification_tokens_pkey PRIMARY KEY (id);


--
-- Name: alert_states_service_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX alert_states_service_key ON public.alert_states USING btree (service);


--
-- Name: areas_cityId_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "areas_cityId_slug_key" ON public.areas USING btree ("cityId", slug);


--
-- Name: categories_parentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "categories_parentId_idx" ON public.categories USING btree ("parentId");


--
-- Name: categories_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX categories_slug_key ON public.categories USING btree (slug);


--
-- Name: cities_countryId_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "cities_countryId_slug_key" ON public.cities USING btree ("countryId", slug);


--
-- Name: cms_pages_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX cms_pages_slug_key ON public.cms_pages USING btree (slug);


--
-- Name: cms_sections_identifier_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX cms_sections_identifier_key ON public.cms_sections USING btree (identifier);


--
-- Name: cms_sections_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX cms_sections_name_key ON public.cms_sections USING btree (name);


--
-- Name: companies_cityId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "companies_cityId_idx" ON public.companies USING btree ("cityId");


--
-- Name: companies_countryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "companies_countryId_idx" ON public.companies USING btree ("countryId");


--
-- Name: companies_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "companies_createdAt_idx" ON public.companies USING btree ("createdAt");


--
-- Name: companies_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "companies_isActive_idx" ON public.companies USING btree ("isActive");


--
-- Name: companies_isFeatured_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "companies_isFeatured_idx" ON public.companies USING btree ("isFeatured");


--
-- Name: companies_rating_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX companies_rating_idx ON public.companies USING btree (rating);


--
-- Name: companies_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX companies_slug_key ON public.companies USING btree (slug);


--
-- Name: companies_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "companies_userId_key" ON public.companies USING btree ("userId");


--
-- Name: companies_verificationStatus_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "companies_verificationStatus_idx" ON public.companies USING btree ("verificationStatus");


--
-- Name: company_documents_companyId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "company_documents_companyId_idx" ON public.company_documents USING btree ("companyId");


--
-- Name: company_matching_preferences_companyId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "company_matching_preferences_companyId_key" ON public.company_matching_preferences USING btree ("companyId");


--
-- Name: company_portfolio_items_companyId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "company_portfolio_items_companyId_idx" ON public.company_portfolio_items USING btree ("companyId");


--
-- Name: company_services_companyId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "company_services_companyId_idx" ON public.company_services USING btree ("companyId");


--
-- Name: company_social_links_companyId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "company_social_links_companyId_key" ON public.company_social_links USING btree ("companyId");


--
-- Name: company_working_hours_companyId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "company_working_hours_companyId_key" ON public.company_working_hours USING btree ("companyId");


--
-- Name: countries_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX countries_code_key ON public.countries USING btree (code);


--
-- Name: departments_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX departments_name_key ON public.departments USING btree (name);


--
-- Name: feature_flags_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX feature_flags_key_key ON public.feature_flags USING btree (key);


--
-- Name: flag_audit_logs_adminId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "flag_audit_logs_adminId_idx" ON public.flag_audit_logs USING btree ("adminId");


--
-- Name: flag_audit_logs_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "flag_audit_logs_createdAt_idx" ON public.flag_audit_logs USING btree ("createdAt");


--
-- Name: flag_audit_logs_flagId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "flag_audit_logs_flagId_idx" ON public.flag_audit_logs USING btree ("flagId");


--
-- Name: health_logs_category_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX health_logs_category_status_idx ON public.health_logs USING btree (category, status);


--
-- Name: health_logs_source_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX health_logs_source_idx ON public.health_logs USING btree (source);


--
-- Name: health_logs_testedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "health_logs_testedAt_idx" ON public.health_logs USING btree ("testedAt");


--
-- Name: internal_messages_recipientId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "internal_messages_recipientId_idx" ON public.internal_messages USING btree ("recipientId");


--
-- Name: internal_messages_senderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "internal_messages_senderId_idx" ON public.internal_messages USING btree ("senderId");


--
-- Name: membership_plans_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX membership_plans_name_key ON public.membership_plans USING btree (name);


--
-- Name: memberships_companyId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "memberships_companyId_idx" ON public.memberships USING btree ("companyId");


--
-- Name: memberships_planId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "memberships_planId_idx" ON public.memberships USING btree ("planId");


--
-- Name: messages_recipientId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "messages_recipientId_idx" ON public.messages USING btree ("recipientId");


--
-- Name: messages_senderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "messages_senderId_idx" ON public.messages USING btree ("senderId");


--
-- Name: notification_settings_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "notification_settings_userId_key" ON public.notification_settings USING btree ("userId");


--
-- Name: notifications_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "notifications_userId_idx" ON public.notifications USING btree ("userId");


--
-- Name: offers_companyId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "offers_companyId_idx" ON public.offers USING btree ("companyId");


--
-- Name: offers_requestId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "offers_requestId_idx" ON public.offers USING btree ("requestId");


--
-- Name: password_reset_tokens_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX password_reset_tokens_email_idx ON public.password_reset_tokens USING btree (email);


--
-- Name: password_reset_tokens_email_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX password_reset_tokens_email_token_key ON public.password_reset_tokens USING btree (email, token);


--
-- Name: password_reset_tokens_token_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX password_reset_tokens_token_idx ON public.password_reset_tokens USING btree (token);


--
-- Name: password_reset_tokens_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX password_reset_tokens_token_key ON public.password_reset_tokens USING btree (token);


--
-- Name: payments_companyId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "payments_companyId_idx" ON public.payments USING btree ("companyId");


--
-- Name: payments_membershipId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "payments_membershipId_idx" ON public.payments USING btree ("membershipId");


--
-- Name: project_audit_logs_adminId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "project_audit_logs_adminId_idx" ON public.project_audit_logs USING btree ("adminId");


--
-- Name: project_audit_logs_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "project_audit_logs_createdAt_idx" ON public.project_audit_logs USING btree ("createdAt");


--
-- Name: project_audit_logs_requestId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "project_audit_logs_requestId_idx" ON public.project_audit_logs USING btree ("requestId");


--
-- Name: project_files_projectId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "project_files_projectId_idx" ON public.project_files USING btree ("projectId");


--
-- Name: project_milestones_projectId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "project_milestones_projectId_idx" ON public.project_milestones USING btree ("projectId");


--
-- Name: projects_companyId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "projects_companyId_idx" ON public.projects USING btree ("companyId");


--
-- Name: projects_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "projects_userId_idx" ON public.projects USING btree ("userId");


--
-- Name: refresh_tokens_token_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX refresh_tokens_token_idx ON public.refresh_tokens USING btree (token);


--
-- Name: refresh_tokens_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX refresh_tokens_token_key ON public.refresh_tokens USING btree (token);


--
-- Name: refresh_tokens_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "refresh_tokens_userId_idx" ON public.refresh_tokens USING btree ("userId");


--
-- Name: reviews_companyId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "reviews_companyId_idx" ON public.reviews USING btree ("companyId");


--
-- Name: reviews_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "reviews_userId_idx" ON public.reviews USING btree ("userId");


--
-- Name: security_logs_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "security_logs_createdAt_idx" ON public.security_logs USING btree ("createdAt");


--
-- Name: security_logs_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX security_logs_type_idx ON public.security_logs USING btree (type);


--
-- Name: security_logs_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "security_logs_userId_idx" ON public.security_logs USING btree ("userId");


--
-- Name: service_requests_categoryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "service_requests_categoryId_idx" ON public.service_requests USING btree ("categoryId");


--
-- Name: service_requests_cityId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "service_requests_cityId_idx" ON public.service_requests USING btree ("cityId");


--
-- Name: service_requests_countryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "service_requests_countryId_idx" ON public.service_requests USING btree ("countryId");


--
-- Name: sla_reports_year_month_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sla_reports_year_month_idx ON public.sla_reports USING btree (year, month);


--
-- Name: sla_reports_year_month_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX sla_reports_year_month_key ON public.sla_reports USING btree (year, month);


--
-- Name: staff_members_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "staff_members_userId_key" ON public.staff_members USING btree ("userId");


--
-- Name: staff_roles_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX staff_roles_name_key ON public.staff_roles USING btree (name);


--
-- Name: user_settings_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "user_settings_userId_key" ON public.user_settings USING btree ("userId");


--
-- Name: users_emailHash_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "users_emailHash_key" ON public.users USING btree ("emailHash");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: verification_tokens_email_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX verification_tokens_email_token_key ON public.verification_tokens USING btree (email, token);


--
-- Name: verification_tokens_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX verification_tokens_token_key ON public.verification_tokens USING btree (token);


--
-- Name: areas areas_cityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.areas
    ADD CONSTRAINT "areas_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES public.cities(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: categories categories_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cities cities_countryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT "cities_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES public.countries(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cms_pages cms_pages_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cms_pages
    ADD CONSTRAINT "cms_pages_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cms_pages cms_pages_updatedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cms_pages
    ADD CONSTRAINT "cms_pages_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: companies companies_cityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT "companies_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES public.cities(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: companies companies_countryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT "companies_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES public.countries(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: companies companies_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT "companies_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: companies companies_verifiedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT "companies_verifiedBy_fkey" FOREIGN KEY ("verifiedBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: company_documents company_documents_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_documents
    ADD CONSTRAINT "company_documents_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: company_matching_preferences company_matching_preferences_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_matching_preferences
    ADD CONSTRAINT "company_matching_preferences_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: company_portfolio_items company_portfolio_items_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_portfolio_items
    ADD CONSTRAINT "company_portfolio_items_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: company_services company_services_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_services
    ADD CONSTRAINT "company_services_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: company_social_links company_social_links_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_social_links
    ADD CONSTRAINT "company_social_links_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: company_working_hours company_working_hours_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_working_hours
    ADD CONSTRAINT "company_working_hours_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: flag_audit_logs flag_audit_logs_flagId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flag_audit_logs
    ADD CONSTRAINT "flag_audit_logs_flagId_fkey" FOREIGN KEY ("flagId") REFERENCES public.feature_flags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: internal_messages internal_messages_recipientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.internal_messages
    ADD CONSTRAINT "internal_messages_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: internal_messages internal_messages_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.internal_messages
    ADD CONSTRAINT "internal_messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: memberships memberships_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.memberships
    ADD CONSTRAINT "memberships_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: memberships memberships_planId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.memberships
    ADD CONSTRAINT "memberships_planId_fkey" FOREIGN KEY ("planId") REFERENCES public.membership_plans(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: messages messages_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "messages_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: messages messages_recipientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "messages_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: messages messages_requestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "messages_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES public.service_requests(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: messages messages_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notification_settings notification_settings_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_settings
    ADD CONSTRAINT "notification_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notifications notifications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: offers offers_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT "offers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: offers offers_requestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT "offers_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES public.service_requests(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payments payments_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payments payments_membershipId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES public.memberships(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_files project_files_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_files
    ADD CONSTRAINT "project_files_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_milestones project_milestones_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_milestones
    ADD CONSTRAINT "project_milestones_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: projects projects_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT "projects_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: projects projects_requestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT "projects_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES public.service_requests(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: projects projects_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT "projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "reviews_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "reviews_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: reviews reviews_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: security_logs security_logs_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.security_logs
    ADD CONSTRAINT "security_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: service_requests service_requests_areaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_requests
    ADD CONSTRAINT "service_requests_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES public.areas(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: service_requests service_requests_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_requests
    ADD CONSTRAINT "service_requests_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: service_requests service_requests_cityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_requests
    ADD CONSTRAINT "service_requests_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES public.cities(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: service_requests service_requests_countryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_requests
    ADD CONSTRAINT "service_requests_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES public.countries(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: service_requests service_requests_subcategoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_requests
    ADD CONSTRAINT "service_requests_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: service_requests service_requests_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_requests
    ADD CONSTRAINT "service_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: staff_members staff_members_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff_members
    ADD CONSTRAINT "staff_members_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: staff_members staff_members_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff_members
    ADD CONSTRAINT "staff_members_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.staff_roles(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: staff_members staff_members_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff_members
    ADD CONSTRAINT "staff_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_settings user_settings_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_settings
    ADD CONSTRAINT "user_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict m08fy6fOw2bCqdQEMff7Uw82xM19wg2TpXqEfwKMnbehRZGInmdxeLSRKbAdcUp

