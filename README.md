# ODPortal - ODE Food Hall B2B Portal

**URL**: https://lovable.dev/projects/ace5a7fd-30d9-4826-beef-eeaf082338ad

## Project Overview

ODPortal is a comprehensive B2B platform for ODE Food Hall in Ubud, Bali. It provides specialized portals for tenants, investors, marketing teams, and digital ecosystem management.

## UDPortal Routes & Structure

### Core Routes
- `/` - Home (all users)
- `/storytelling/*` - Brand storytelling hub (all users)
- `/guest-demo/*` - Demo showcase (all users, noindex SEO)

### Tenants Portal (`/tenants/*`) - Public showcase + tenant tools
- `/tenants/overview` - General overview
- `/tenants/long-term` - Long-term residency options
- `/tenants/open-kitchen` - Pop-up kitchen concept
- `/tenants/floor-plan` - Interactive floor plan with availability
- `/tenants/rates` - Pricing and terms
- `/tenants/services` - Included services
- `/tenants/faq` - Frequently asked questions
- `/tenants/apply` - Application form (→ space_bookings table + email)
- `/tenants/team` - Team information

### Investors Portal (`/investors/*`) - Restricted to investor/admin roles
- `/investors/deck` - Investment presentation
- `/investors/financial-model` - Financial projections
- `/investors/ode-by-night` - Evening concept details
- `/investors/roadmap` - Development roadmap
- `/investors/team` - Team profiles
- `/investors/opex-breakdown` - Operational expenses
- `/investors/intro-call` - Schedule investment call (→ contact_messages + email)

### Marketing Portal (`/marketing/*`) - For tenant/investor/admin roles
- `/marketing/taste-alley` - Main concept marketing
- `/marketing/events-nightlife` - Evening events strategy
- `/marketing/compass-passport` - Gamification features
- `/marketing/breakfast-for-villas` - Villa delivery service
- `/marketing/delivery-partnerships` - Delivery integrations
- `/marketing/pr-digital` - PR and digital marketing
- `/marketing/kids-area` - Family experience
- `/marketing/event-hall` - Event space marketing

### Digital Ecosystem (`/digital-ecosystem/*`) - For tenant/investor/admin roles
- `/digital-ecosystem/compass` - NFC Compass system
- `/digital-ecosystem/app` - Mobile app overview
- `/digital-ecosystem/guest-website` - Guest portal preview

### Data Room (`/data-room/*`) - Restricted to investor/admin roles
- `/data-room/contracts` - Legal documents
- `/data-room/financials` - Financial statements
- `/data-room/decks` - Presentation materials
- `/data-room/policies` - Internal policies (admin only)
- `/data-room/press` - Press materials

## Role-Based Access Control

### Role Hierarchy
- **guest** - Public access (home, storytelling, tenants showcase, guest-demo)
- **tenant** - Tenant access (+ marketing, digital-ecosystem)
- **investor** - Investment access (+ investors portal, data-room)
- **admin** - Full access (+ admin tools, business analytics)

### Feature Flags (`src/lib/config.ts`)
```typescript
export const CONFIG = {
  DEMO_MODE: true,                    // Disables real actions/payments
  SHOW_LOCKED_IN_MENU: true,         // Shows restricted items with lock icon
  PORTAL_PASSWORD_ENABLED: false,    // Global portal password protection
  STRIPE: { USE_TEST_KEYS: true },   // Payment configuration
  DEMO_DISABLED_FEATURES: {          // Features disabled in demo
    PAYMENTS: true,
    BOOKINGS: true,
    EMAIL_NOTIFICATIONS: true,
    // ...
  }
}
```

## Form Integration & Email Notifications

### Tenant Applications (`/tenants/apply`)
- **Database**: `space_bookings` table
- **Email**: Confirmation to applicant + notification to `ops@odefoodhall.com`
- **Edge Function**: `submit-tenant-application`

### Investor Calls (`/investors/intro-call`)
- **Database**: `contact_messages` table
- **Email**: Confirmation to investor + notification to `invest@odefoodhall.com`
- **Edge Function**: `submit-investor-call`

## Data Room & File Storage

### Supabase Storage Buckets
- `data-room/contracts` - Legal documents
- `data-room/financials` - Financial reports
- `data-room/decks` - Presentation decks
- `data-room/policies` - Internal policies
- `data-room/press` - Press materials

### Access Control
- **RLS Policies**: Restrict access to investor/admin roles only
- **Signed URLs**: Temporary access for secure downloads
- **Role Validation**: Server-side verification for all file access

## 301 Redirects (Legacy URLs)
All old guest URLs redirect to `/guest-demo` with proper SEO handling:
- `/order` → `/guest-demo`
- `/book` → `/guest-demo`
- `/menu` → `/guest-demo`
- `/passport` → `/guest-demo`
- `/compass` → `/guest-demo`
- `/taste-passport` → `/guest-demo`
- `/taste-compass` → `/guest-demo`
- `/ode-by-night` → `/guest-demo`
- `/events` → `/guest-demo`

## Development

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Technologies Used
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Email**: Resend.com
- **Storage**: Supabase Storage
- **Authentication**: Supabase Auth with role-based access

### Environment Variables
```env
VITE_SUPABASE_URL=https://ejwjrsgkxxrwlyfohdat.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
RESEND_API_KEY=re_...
```

## Security & RLS Policies

### Row Level Security (RLS)
- **Orders**: Users can only access their own orders
- **Storage**: Data room files restricted to investor/admin roles
- **Applications**: Secure tenant application submission
- **Contact Messages**: Admin-only access to investor inquiries

### Security Features
- JWT-based authentication
- Role-based route protection
- Secure file downloads via signed URLs
- CORS protection on Edge Functions
- Input validation and sanitization

## Master Specification

This implementation follows the ODPortal Master Spec (Part 1/2 + Part 2/2) which defines:
- Complete navigation structure and role matrix
- 24 portal pages across 4 main sections
- Integration requirements and form workflows
- Security policies and access control
- SEO configuration and redirect mapping

**Specification Document**: Refer to project documentation for complete requirements and acceptance criteria.

## Deployment

### Lovable Platform
Simply click "Publish" in the Lovable interface to deploy the latest version.

### Custom Domain
Navigate to Project > Settings > Domains to connect your custom domain (requires paid plan).

## Support

For technical issues or feature requests, contact the development team or refer to the project documentation.