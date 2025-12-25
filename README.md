# StayinUBUD - Premium Villa Rental Website

A fully functional, production-ready luxury villa rental booking system built with Next.js 14+, Supabase, and deployed on Vercel.

## 🌟 Features

### Public Features
- **Premium UI/UX**: Modern, luxury design with Bali villa aesthetic
- **Animated Interface**: Smooth parallax scrolling, hover effects, and micro-interactions
- **Villa Browsing**: Filter villas by price, guests, and bedrooms
- **Real-time Availability**: Calendar shows actual booking availability
- **Booking System**: Complete booking flow with validation
- **Responsive Design**: Mobile-first approach, works on all devices
- **SEO Optimized**: Proper metadata, structured data, and fast performance

### Admin Features
- **Secure Authentication**: Supabase Auth for admin access
- **Villa Management**: Full CRUD operations for villas
- **Booking Management**: View, update, and cancel bookings
- **Calendar View**: Visual overview of all bookings
- **Image Upload**: Supabase Storage integration
- **Dashboard Stats**: Revenue, occupancy, and booking analytics

## 🚀 Tech Stack

- **Framework**: Next.js 14+ (App Router, Server Components)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Deployment**: Vercel
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js 20.x or higher (recommended)
- npm or yarn
- Supabase account
- Vercel account (for deployment)

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
cd your-project-directory
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `supabase-setup.sql`
3. Go to Storage and create a public bucket called `villa-images`
4. Go to Authentication > Providers and enable Email provider
5. Create an admin user:
   - Go to Authentication > Users
   - Click "Add user" > Create new user with email/password
   - Use the same email you specified in the SQL setup

### 3. Environment Variables

1. Copy `.env.example` to `.env.local`:
```bash
copy .env.example .env.local
```

2. Fill in your Supabase credentials from supabase.com/project/settings/api:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your site!

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── (public)/                # Public routes
│   │   ├── page.tsx            # Homepage
│   │   ├── villas/             # Villa listing & details
│   │   ├── about/              # About page
│   │   └── contact/            # Contact page
│   ├── admin/                  # Admin panel (protected)
│   │   ├── login/              # Admin login
│   │   ├── dashboard/          # Admin dashboard
│   │   ├── villas/             # Villa management
│   │   ├── bookings/           # Booking management
│   │   └── calendar/           # Calendar view
│   ├── api/                    # API routes
│   │   ├── villas/             # Villa CRUD
│   │   ├── bookings/           # Booking operations
│   │   └── availability/       # Check availability
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/                  # Reusable components
│   ├── Navbar.tsx              # Navigation bar
│   ├── Footer.tsx              # Footer
│   ├── VillaCard.tsx           # Villa card component
│   ├── BookingForm.tsx         # Booking form
│   └── ...                     # Other components
├── lib/                        # Utilities
│   ├── supabase/               # Supabase clients
│   │   ├── client.ts           # Browser client
│   │   └── server.ts           # Server client
│   └── utils.ts                # Helper functions
├── types/                      # TypeScript types
│   └── index.ts                # Type definitions
├── public/                     # Static assets
├── supabase-setup.sql          # Database schema
├── .env.example                # Environment template
├── vercel.json                 # Vercel config
└── package.json                # Dependencies
```

## 🎨 Design System

### Colors
- **Background**: `#F1F3E0` (cream)
- **Primary**: `#A1BC98` (sage green)
- **Secondary**: `#778873` (olive)

### Fonts
- **Logo**: Knewave (Google Fonts)
- **Body**: Inter (Google Fonts)

### Animations
- Parallax scrolling on hero
- Hover effects on cards
- Fade-in on scroll
- Smooth page transitions
- Loading skeletons

## 🔐 Admin Access

1. Navigate to `/admin/login`
2. Use the admin email/password you created in Supabase Auth
3. Access admin dashboard to manage villas and bookings

## 📊 Database Schema

### Tables
- **villas**: Villa information, pricing, amenities, images
- **bookings**: Guest bookings with dates and status
- **admin_users**: Authorized admin emails

### Key Functions
- `check_booking_availability()`: Validates date availability
- Row Level Security (RLS) policies for secure data access

## 🚢 Deployment to Vercel

### Option 1: Deploy via Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" > Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your Vercel domain)
5. Click "Deploy"

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_SITE_URL

# Deploy to production
vercel --prod
```

## ✅ Post-Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] Supabase RLS policies enabled
- [ ] Admin user created in Supabase Auth
- [ ] Test booking flow on production URL
- [ ] Test admin login and villa management
- [ ] Verify image uploads work
- [ ] Check responsive design on mobile
- [ ] Test calendar availability display
- [ ] Verify all animations work smoothly
- [ ] Check SEO metadata in browser
- [ ] Test form validations

## 🎯 Key Features Implementation

### Real-Time Availability
The system checks Supabase for existing bookings to prevent double-booking using the `check_booking_availability()` function.

### Booking Flow
1. User selects villa and dates
2. System validates availability
3. Calculates total price (nights × price_per_night)
4. Creates booking in database
5. Shows confirmation page

### Admin Management
- Protected routes with Supabase Auth
- CRUD operations for villas and bookings
- Upload villa images to Supabase Storage
- Update booking status (pending/confirmed/cancelled)

## 🐛 Troubleshooting

### Build Errors
- Ensure Node.js version is 20.x or higher
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `npm install`

### Database Connection Issues
- Verify Supabase URL and keys are correct
- Check Supabase project is active
- Ensure RLS policies are configured

### Authentication Issues
- Verify admin user exists in Supabase Auth
- Check admin email matches entry in `admin_users` table
- Ensure Auth redirect URLs include your domain

## 📝 Environment Variables Reference

| Variable | Description | Required | Example |
|----------|------------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes | `eyJhbGc...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (admin) | Yes | `eyJhbGc...` |
| `NEXT_PUBLIC_SITE_URL` | Your site URL | Yes | `https://yourdomain.com` |

## 🎨 Customization

### Changing Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  cream: '#F1F3E0',    // Your custom color
  sage: '#A1BC98',     // Your custom color
  olive: '#778873',    // Your custom color
}
```

### Adding Villas
Use the admin panel or insert directly via SQL:
```sql
INSERT INTO villas (name, description, bedrooms, bathrooms, max_guests, price_per_night, amenities, images)
VALUES ('Villa Name', 'Description...', 3, 2, 6, 250.00, ARRAY['WiFi', 'Pool'], ARRAY['image-url']);
```

## 📄 License

This project is built for StayinUBUD. All rights reserved.

## 🤝 Support

For questions or issues:
- Email: info@stayinubud.com
- Check Supabase logs for database errors
- Check Vercel deployment logs for build issues

## 🌟 Credits

- Design inspiration: Modern Bali villa rentals
- Images: Unsplash (replace with actual villa photos)
- Icons: Lucide React
- Fonts: Google Fonts (Knewave, Inter)

---

Built with ❤️ using Next.js 14, Supabase, and Vercel
