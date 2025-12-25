# Netlify Deployment Guide - StayinUBUD

## Prerequisites
1. Netlify Account (https://netlify.com)
2. GitHub/GitLab/Bitbucket repository

## Environment Variables Setup

Di Netlify Dashboard, tambahkan environment variables berikut:

### Required Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://your-domain.netlify.app
NEXT_PUBLIC_ADMIN_WHATSAPP=6281234567890
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=StayinUBUD <noreply@stayinubud.com>
EMAIL_REPLY_TO=info@stayinubud.com
```

## Deployment Steps

### Option 1: Deploy via Netlify Dashboard (Recommended)

1. **Login ke Netlify Dashboard**
   - Buka https://app.netlify.com
   - Klik "Add new site" > "Import an existing project"

2. **Connect Repository**
   - Pilih Git provider (GitHub/GitLab/Bitbucket)
   - Authorize Netlify
   - Pilih repository "stay" atau nama repo Anda

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - (Netlify akan auto-detect Next.js)

4. **Add Environment Variables**
   - Klik "Show advanced"
   - Tambahkan semua environment variables di atas

5. **Deploy**
   - Klik "Deploy site"
   - Tunggu build selesai

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize (jika belum)
netlify init

# Deploy preview
netlify deploy

# Deploy ke production
netlify deploy --prod
```

## Fitur Netlify yang Didukung

### ✅ Fully Supported
- **SSR (Server-Side Rendering)** - Berjalan di Netlify Functions
- **API Routes** - Otomatis dikonversi ke Netlify Functions
- **ISR (Incremental Static Regeneration)** - Didukung
- **Image Optimization** - Via Netlify Image CDN
- **Dynamic Routes** - Didukung penuh
- **Middleware** - Didukung

### 🔧 Build Configuration
File `netlify.toml` sudah dikonfigurasi dengan:
- Node.js version 18
- Security headers
- Static asset caching
- @netlify/plugin-nextjs

## Custom Domain

1. Buka Site settings > Domain management
2. Klik "Add custom domain"
3. Masukkan domain Anda
4. Ikuti instruksi DNS setup
5. Netlify akan auto-provision SSL certificate

## Troubleshooting

### Build Fails
```bash
# Clear cache di Netlify Dashboard:
# Deploys > Trigger deploy > Clear cache and deploy site
```

### Function Timeout
API routes di Netlify memiliki timeout 10 detik (Free) atau 26 detik (Pro).
Pastikan API routes tidak melebihi batas ini.

### Environment Variables Tidak Terbaca
- Pastikan nama variable tepat
- Untuk client-side, gunakan prefix `NEXT_PUBLIC_`
- Redeploy setelah menambah/mengubah env vars

## Perbandingan: Vercel vs Netlify

| Feature | Vercel | Netlify |
|---------|--------|---------|
| Next.js Support | Native | Via Plugin |
| SSR | Unlimited | 100GB/bulan (Free) |
| Functions | 100GB-hrs | 125K req/bulan (Free) |
| Bandwidth | 100GB/bulan | 100GB/bulan (Free) |
| Build Minutes | 6000/bulan | 300/bulan (Free) |
| Image Optimization | Built-in | Built-in |
| Edge Functions | Yes | Yes |

## Files untuk Netlify

1. `netlify.toml` - Konfigurasi build dan deployment
2. `NETLIFY_DEPLOYMENT.md` - Panduan ini

## Catatan Penting

1. **vercel.json** - File ini bisa dihapus atau dibiarkan, tidak akan mempengaruhi Netlify

2. **Image Optimization** - Netlify secara otomatis mengoptimasi gambar menggunakan Netlify Image CDN

3. **API Routes** - Semua API routes di `/app/api/*` akan otomatis dikonversi menjadi Netlify Functions

4. **Supabase** - Tidak perlu perubahan, Supabase client akan bekerja sama seperti di Vercel
