# 🚀 Quick Start Guide - StayinUBUD

## ⚡ Fast Track to Deployment (40 minutes)

### Prerequisites
- [ ] Supabase account (free tier works)
- [ ] GitHub account
- [ ] Vercel account (free tier works)

---

## Step 1: Supabase Setup (15 min)

### 1.1 Create Project
1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in:
   - Name: `stayinubud`
   - Database Password: (create strong password - SAVE IT!)
   - Region: `Singapore` (closest to Bali)
4. Click "Create new project" (wait ~2 min)

### 1.2 Run Database Script
1. Click **SQL Editor** in left sidebar
2. Click "+ New query"
3. Open `supabase-setup.sql` from your project
4. Copy ALL contents and paste into SQL Editor
5. Click **Run** (or Ctrl+Enter)
6. ✅ Verify: Go to **Table Editor** - you should see `villas`, `bookings`, `admin_users` tables with data

### 1.3 Create Admin User
1. Go to **Authentication** > **Users**
2. Click "Add user" > "Create new user"
3. Enter:
   - Email: `admin@stayinubud.com`
   - Password: (create strong password - SAVE IT!)
   - ✅ Check "Auto Confirm User"
4. Click "Create user"

### 1.4 Get API Keys
1. Go to **Settings** > **API**
2. Copy these (you'll need them):
   - **URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGc...` (long key)
   - **service_role**: `eyJhbGc...` (long key - KEEP SECRET!)

---

## Step 2: Deploy to Vercel (10 min)

### 2.1 Push to GitHub
```bash
cd c:\Users\Asus\Desktop\website
git init
git add .
git commit -m "Initial commit"
```

Create repo on GitHub, then:
```bash
git remote add origin https://github.com/YOUR_USERNAME/stayinubud.git
git branch -M main
git push -u origin main
```

### 2.2 Import to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Framework: Next.js (auto-detected)
4. Click "Deploy" (wait ~3 min)

### 2.3 Add Environment Variables
After first deployment:
1. Go to **Settings** > **Environment Variables**
2. Add these (from Supabase):

```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGc...
NEXT_PUBLIC_SITE_URL = https://your-project.vercel.app
```

3. Click "Save"
4. Go to **Deployments**
5. Click ⋯ on latest deployment > "Redeploy"

---

## Step 3: Final Configuration (5 min)

### 3.1 Update Supabase Auth URLs
1. In Supabase, go to **Authentication** > **URL Configuration**
2. Set **Site URL**: `https://your-project.vercel.app`
3. Add to **Redirect URLs**: `https://your-project.vercel.app/**`
4. Click "Save"

---

## Step 4: Test Your Site! (10 min)

### 4.1 Public Site
Visit: `https://your-project.vercel.app`

Test:
- [ ] Homepage loads with villas
- [ ] Click "View All Villas"
- [ ] Click on a villa
- [ ] Fill booking form with future dates
- [ ] Submit - should see confirmation page

### 4.2 Admin Panel
Visit: `https://your-project.vercel.app/admin/login`

Login with:
- Email: `admin@stayinubud.com`
- Password: (the one you created in Step 1.3)

Check:
- [ ] Dashboard shows stats
- [ ] Can see the booking you just created

---

## 🎉 Done!

Your luxury villa booking website is LIVE!

### What You Have Now:
- ✅ Live booking system
- ✅ 4 sample villas
- ✅ Working admin panel
- ✅ Real database
- ✅ Production-ready site

### Next Steps:
1. **Replace Images**: Upload actual villa photos to Supabase Storage
2. **Update Content**: Edit villa descriptions
3. **Custom Domain**: Add your own domain in Vercel
4. **Share**: Start accepting real bookings!

---

## 🆘 Troubleshooting

### Can't see villas on homepage
→ Check environment variables in Vercel are correct
→ Verify SQL script ran successfully in Supabase

### Admin login doesn't work
→ Ensure admin email in Auth matches `admin_users` table
→ Check auth URLs in Supabase include your Vercel domain

### Booking fails
→ Verify all environment variables are set
→ Check Supabase SQL Editor > Logs for errors

---

## 📞 Need Help?

1. Check `DEPLOYMENT.md` for detailed instructions
2. Check `README.md` for setup guide
3. Check Vercel deployment logs
4. Check Supabase logs: Logs > Postgres Logs

---

**Ready to launch your villa rental business!** 🏝️
