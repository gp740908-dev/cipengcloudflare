# StayinUBUD - Complete Deployment Guide

## Prerequisites Checklist

Before deploying, ensure you have:
- [x] Supabase account created
- [x] GitHub account
- [x] Vercel account
- [x] Node.js 20+ installed locally (for testing)

## Step 1: Supabase Database Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and set project name: `stayinubud`
4. Set a strong database password (save this!)
5. Choose region closest to your users (Singapore recommended for Bali)
6. Click "Create new project"

### 1.2 Run Database Schema

1. Once project is created, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase-setup.sql`
4. Paste into the SQL Editor
5. Click "Run" or press `Ctrl+Enter`
6. Verify tables were created:
   - Go to **Table Editor**
   - You should see: `villas`, `bookings`, `admin_users`
   - Each table should have the sample data inserted

### 1.3 Create Storage Bucket (Optional)

1. Go to **Storage** in Supabase dashboard
2. Click "Create a new bucket"
3. Name it: `villa-images`
4. Set as **Public bucket**
5. Create bucket

This bucket can be used to upload custom villa images instead of using Unsplash URLs.

### 1.4 Setup Authentication

1. Go to **Authentication** > **Providers**
2. Ensure "Email" provider is enabled
3. Go to **Authentication** > **Users**
4. Click "Add user" > "Create new user"
5. Enter:
   - Email: `admin@stayinubud.com` (or your preferred admin email)
   - Password: Create a strong password (save this!)
   - Auto Confirm User: **Enabled**
6. Click "Create user"

**IMPORTANT**: Make sure this email matches the one inserted in the `admin_users` table from the SQL script!

### 1.5 Get API Keys

1. Go to **Settings** > **API**
2. Copy these values (you'll need them for Vercel):
   - **Project URL**: `https://[your-project].supabase.co`
   - **anon/public key**: `eyJhbGc...` (long string)
   - **service_role key**: `eyJhbGc...` (long string) - Keep this SECRET!

## Step 2: Configure Environment Variables Locally

1. In your project root, copy `.env.example` to `.env.local`:
   ```bash
   copy .env.example .env.local
   ```

2. Edit `.env.local` and fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

## Step 3: Test Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Open browser to `http://localhost:3000`

4. Test the following:
   - ✅ Homepage loads with featured villas
   - ✅ Villa listing page shows all villas
   - ✅ Villa detail page works
   - ✅ Booking form accepts input (you can test with future dates)
   - ✅ Admin login works (use the email/password you created)
   - ✅ Admin dashboard shows stats

5. If everything works, proceed to deployment!

## Step 4: Push to GitHub

1. Initialize git repository (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - StayinUBUD booking system"
   ```

2. Create a new repository on GitHub:
   - Go to [github.com/new](https://github.com/new)
   - Name it: `stayinubud-booking`
   - Keep it **Private** (recommended)
   - Don't initialize with README (we already have one)
   - Click "Create repository"

3. Push to GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/stayinubud-booking.git
   git branch -M main
   git push -u origin main
   ```

## Step 5: Deploy to Vercel

### 5.1 Import Project

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New..." > "Project"
3. Import your GitHub repository
4. Vercel will automatically detect Next.js

### 5.2 Configure Project

1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: `./` (leave as is)
3. **Build Command**: `npm run build` (auto-filled)
4. **Output Directory**: `.next` (auto-filled)

### 5.3 Add Environment Variables

Click "Environment Variables" and add the following:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key from Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key from Supabase |
| `NEXT_PUBLIC_SITE_URL` | Leave empty for now (will update after deployment) |

**Important**: 
- Make sure to select **Production**, **Preview**, and **Development** for all variables
- Double-check there are no extra spaces in the values

### 5.4 Deploy

1. Click "Deploy"
2. Wait for build to complete (3-5 minutes)
3. Once done, you'll get a deployed URL like: `https://stayinubud-booking.vercel.app`

## Step 6: Post-Deployment Configuration

### 6.1 Update Site URL

1. Go back to Vercel project settings
2. Find `NEXT_PUBLIC_SITE_URL` environment variable
3. Update it to your production URL: `https://your-project.vercel.app`
4. Click "Save"
5. Trigger a new deployment (or wait for next push)

### 6.2 Update Supabase Auth URLs

1. Go to your Supabase project
2. Navigate to **Authentication** > **URL Configuration**
3. Add your Vercel URL to:
   - **Site URL**: `https://your-project.vercel.app`
   - **Redirect URLs**: `https://your-project.vercel.app/**`

### 6.3 Test Production Site

Visit your production URL and test:

1. **Public Features**:
   - [ ] Homepage loads correctly
   - [ ] Villas page shows all villas
   - [ ] Villa detail pages work
   - [ ] Booking form works
   - [ ] Can create a test booking
   - [ ] Confirmation page shows

2. **Admin Features**:
   - [ ] Can login at `/admin/login`
   - [ ] Dashboard shows correct stats
   - [ ] Can view bookings the bookings you created

## Step 7: Custom Domain (Optional)

### 7.1 Method 1: Vercel Domain

Change your Vercel project URL:
1. Go to Vercel project **Settings** > **Domains**
2. Add a different Vercel domain or custom domain

### 7.2 Method 2: Custom Domain

1. Buy a domain from Namecheap, GoDaddy, etc.
2. In Vercel project settings > **Domains**
3. Add your custom domain (e.g., `stayinubud.com`)
4. Follow Vercel's instructions to configure DNS
5. Wait for DNS propagation (up to 48 hours, usually quicker)

## Troubleshooting

### Build Failures

**Error**: `Module not found: Can't resolve '@/...'`
- **Fix**: Ensure `tsconfig.json` has correct path aliases

**Error**: `Environment variable not defined`
- **Fix**: Double-check all environment variables in Vercel are set correctly

### Runtime Errors

**Error**: `Failed to fetch villas`
- **Fix**: Check Supabase URL and anon key are correct
- **Fix**: Verify RLS policies are configured (from the SQL script)

**Error**: `Admin login not working`
- **Fix**: Ensure admin user email in `admin_users` table matches the email in Auth users
- **Fix**: Check auth redirect URLs in Supabase include your domain

**Error**: `Booking creation fails`
- **Fix**: Check `check_booking_availability` function exists in Supabase
- **Fix**: Verify bookings table permissions allow public insert

### Can't See Villas on Frontend

1. Check Supabase **Table Editor** > **villas** - data should be there
2. Check browser console for errors
3. Verify RLS policy allows public SELECT on villas table

## Maintenance & Updates

### Adding New Villas

**Option 1**: Use Admin Panel (when built)
**Option 2**: Directly in Supabase:
1. Go to **Table Editor** > **villas**
2. Click "Insert" > "Insert row"
3. Fill in all required fields
4. Use Unsplash URLs for images or upload to Storage bucket

### Updating Villa Data

1. Go to Supabase **Table Editor** > **villas**
2. Click on the row to edit
3. Make changes
4. Click "Save"

### Managing Bookings

1. Login to admin panel: `yourdomain.com/admin/login`
2. Go to Dashboard
3. View/manage bookings

## Security Best Practices

1. **Never commit `.env.local`** - it's in `.gitignore` for a reason
2. **Keep service role key secret** - only add it in Vercel, never expose to frontend
3. **Regularly update dependencies**: `npm update`
4. **Monitor Supabase logs** for suspicious activity
5. **Use strong passwords** for admin accounts

## Performance Optimization

1. **Images**: Consider uploading optimized images to Supabase Storage instead of hotlinking Unsplash
2. **Caching**: Vercel automatically caches static pages
3. **Database**: Add indexes if you notice slow queries (already done in SQL script)

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Supabase logs: **Logs** > **Postgres Logs**
3. Check browser console for client-side errors
4. Verify all environment variables are set correctly

## Checklist Summary

- [ ] Supabase project created
- [ ] Database schema executed
- [ ] Sample villas data inserted
- [ ] Admin user created in Auth and admin_users table
- [ ] Storage bucket created (optional)
- [ ] API keys copied
- [ ] Local testing completed
- [ ] Pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Environment variables added to Vercel
- [ ] Production site tested
- [ ] Supabase auth URLs updated
- [ ] Admin login works
- [ ] Booking system works

---

## Next Steps After Deployment

1. **Content**: Replace Unsplash images with actual villa photos
2. **Billing**: Add Stripe/PayPal integration for payments
3. **Notifications**: Set up email notifications for new bookings
4. **Analytics**: Add Google Analytics or Vercel Analytics
5. **SEO**: Submit sitemap to Google Search Console

Congratulations! Your StayinUBUD booking system is now live! 🎉
