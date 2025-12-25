# ✅ StayinUBUD Deployment Checklist

Use this checklist to track your deployment progress.

---

## 📋 Pre-Deployment Setup

### Supabase Configuration
- [ ] Created Supabase account
- [ ] Created new Supabase project named "stayinubud"
- [ ] Saved database password securely
- [ ] Ran `supabase-setup.sql` in SQL Editor
- [ ] Verified tables created: villas, bookings, admin_users
- [ ] Verified sample villas data inserted (4 villas)
- [ ] Created admin user in Authentication > Users
- [ ] Admin email: ________________
- [ ] Admin password saved securely
- [ ] Confirmed admin email matches `admin_users` table entry
- [ ] Copied Project URL: ________________
- [ ] Copied anon/public key: ________________
- [ ] Copied service_role key (SECRET): ________________
- [ ] Created Storage bucket `villa-images` (optional)

### GitHub Repository
- [ ] Created GitHub repository
- [ ] Repository name: ________________
- [ ] Repository URL: ________________
- [ ] Pushed code to GitHub successfully

---

## 🚀 Vercel Deployment

### Initial Setup
- [ ] Created Vercel account
- [ ] Imported project from GitHub
- [ ] Framework detected as Next.js
- [ ] Initial deployment completed
- [ ] Deployment URL: ________________

### Environment Variables (All Required)
In Vercel Settings > Environment Variables:

- [ ] Added `NEXT_PUBLIC_SUPABASE_URL`
  - Value: ________________
  - Applied to: Production, Preview, Development

- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Value: ________________
  - Applied to: Production, Preview, Development

- [ ] Added `SUPABASE_SERVICE_ROLE_KEY`
  - Value: ________________ (KEEP SECRET!)
  - Applied to: Production, Preview, Development

- [ ] Added `NEXT_PUBLIC_SITE_URL`
  - Value: ________________
  - Applied to: Production, Preview, Development

- [ ] Triggered redeploy after adding env variables
- [ ] New deployment successful

---

## 🔧 Post-Deployment Configuration

### Supabase Auth URLs
In Supabase: Authentication > URL Configuration

- [ ] Updated Site URL to Vercel URL
- [ ] Added Redirect URLs: `https://your-project.vercel.app/**`
- [ ] Saved configuration

### DNS & Domain (Optional)
- [ ] Added custom domain in Vercel
- [ ] Domain: ________________
- [ ] DNS configured
- [ ] SSL certificate issued
- [ ] Updated `NEXT_PUBLIC_SITE_URL` to custom domain
- [ ] Redeployed

---

## 🧪 Testing & Verification

### Public Site Tests
Visit: `https://________________` (your Vercel URL)

HomePage:
- [ ] Homepage loads without errors
- [ ] Hero section displays correctly
- [ ] Featured villas section shows 4 villas
- [ ] Villa images load properly
- [ ] Features section displays
- [ ] Testimonials slider works
- [ ] Footer displays correctly
- [ ] Navigation menu works
- [ ] Mobile menu works (on phone/narrow browser)

Villas Page (`/villas`):
- [ ] All villas display in grid
- [ ] Filter controls appear
- [ ] Can filter by price
- [ ] Can filter by guests
- [ ] Can filter by bedrooms
- [ ] Reset filters works
- [ ] Villa cards link to detail pages

Villa Detail Page (`/villas/[id]`):
- [ ] Villa detail page loads
- [ ] Image gallery displays
- [ ] Thumbnail navigation works
- [ ] Lightbox opens on click
- [ ] Villa information displays correctly
- [ ] Amenities list shows
- [ ] Booking form visible

Booking Flow:
- [ ] Can select check-in date (future date)
- [ ] Can select check-out date (after check-in)
- [ ] Can enter number of guests
- [ ] Can enter guest name
- [ ] Can enter email address
- [ ] Can enter phone number
- [ ] Special requests field works
- [ ] Price calculation shows correctly
- [ ] Total price updates when dates change
- [ ] "Book Now" button enabled with valid data
- [ ] Booking submission works
- [ ] Redirects to confirmation page
- [ ] Confirmation page shows booking details
- [ ] Booking ID displayed

Check Database:
- [ ] New booking appears in Supabase > Table Editor > bookings
- [ ] All booking data saved correctly

### Admin Panel Tests
Visit: `https://________________/admin/login`

Admin Login:
- [ ] Login page loads
- [ ] Can enter email and password
- [ ] Login with correct credentials works
- [ ] Login with wrong credentials shows error
- [ ] Redirects to dashboard on success

Admin Dashboard (`/admin/dashboard`):
- [ ] Dashboard loads
- [ ] Shows correct total bookings count
- [ ] Shows total revenue
- [ ] Shows total villas (should be 4)
- [ ] Shows pending bookings count
- [ ] Quick action buttons work
- [ ] Sidebar navigation displays
- [ ] Logout button works

### Responsive Design Tests
- [ ] Test on mobile phone (320px - 640px)
- [ ] Test on tablet (640px - 1024px)
- [ ] Test on desktop (1024px+)
- [ ] All pages responsive
- [ ] Mobile menu works
- [ ] Forms usable on mobile
- [ ] Images load and look good
- [ ] Text readable on all devices

### Performance Tests
- [ ] Homepage loads in < 3 seconds
- [ ] Images optimized and load quickly
- [ ] No console errors in browser
- [ ] Animations smooth (60fps)
- [ ] Forms responsive to input

---

## 📊 Production Monitoring

### Week 1 Checks
- [ ] Check Vercel analytics
- [ ] Check Supabase usage
- [ ] Review any error logs
- [ ] Test booking flow again
- [ ] Verify all emails received

### Monthly Checks
- [ ] Review bookings in admin panel
- [ ] Check Supabase storage usage
- [ ] Update villa information if needed
- [ ] Review and respond to user feedback

---

## 🎯 Optional Enhancements

### Content Updates
- [ ] Replace Unsplash images with actual villa photos
- [ ] Update villa descriptions
- [ ] Add more villas
- [ ] Update pricing

### Feature Additions
- [ ] Add payment processing (Stripe/PayPal)
- [ ] Set up email notifications
- [ ] Build full admin CRUD interfaces
- [ ] Add calendar view
- [ ] Implement reviews/ratings
- [ ] Add multi-language support

### SEO & Marketing
- [ ] Submit sitemap to Google Search Console
- [ ] Add Google Analytics
- [ ] Set up Facebook Pixel
- [ ] Create social media accounts
- [ ] Launch marketing campaigns

---

## 🆘 Common Issues & Solutions

### Issue: Villas not showing
- [ ] Checked environment variables in Vercel
- [ ] Verified SQL script ran in Supabase
- [ ] Checked browser console for errors

### Issue: Admin login fails  
- [ ] Verified admin user exists in Supabase Auth
- [ ] Verified email in `admin_users` table matches
- [ ] Checked auth URLs in Supabase

### Issue: Booking creation fails
- [ ] Checked all environment variables set
- [ ] Verified RLS policies in Supabase
- [ ] Checked Supabase logs for errors

### Issue: Images not loading
- [ ] Verified image URLs are valid
- [ ] Checked network tab in browser dev tools
- [ ] Ensured no CORS issues

---

## 📝 Important Information

### Credentials Storage
Store these securely (password manager recommended):

```
Supabase Project:
- URL: ________________
- Database Password: ________________
- Anon Key: ________________
- Service Role Key: ________________

Admin Account:
- Email: ________________
- Password: ________________

Vercel:
- Project URL: ________________
- Custom Domain: ________________

GitHub:
- Repository: ________________
```

### Support Resources
- README.md - Setup instructions
- DEPLOYMENT.md - Detailed deployment guide  
- QUICKSTART.md - Fast deployment path
- PROJECT_SUMMARY.md - Feature overview
- NODE_VERSION.md - Node.js requirements

---

## ✨ Final Checklist

Before going live:
- [ ] All tests passed
- [ ] Admin can login
- [ ] Users can book villas
- [ ] Confirmation page works
- [ ] Mobile version works
- [ ] No console errors
- [ ] Images load properly
- [ ] Forms validate correctly
- [ ] Database saving bookings

### 🎉 Ready to Launch!
- [ ] Site is live and fully functional
- [ ] Team trained on admin panel
- [ ] Marketing materials prepared
- [ ] Social media accounts ready
- [ ] Customer support process in place

---

**Date Completed**: ________________

**Deployed By**: ________________

**Production URL**: ________________

**Notes**: ________________

---

Congratulations! Your StayinUBUD booking system is now live! 🏝️🎊
