// Debug script untuk PromoBanner
// Jalankan di browser console untuk melihat status banner

(async function debugBanner() {
    console.log('=== PromoBanner Debug ===');

    // 1. Check localStorage untuk banner yang sudah ditampilkan
    console.log('\n1. LocalStorage promo_banner keys:');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('promo_banner_')) {
            console.log(`  ${key}: ${localStorage.getItem(key)}`);
        }
    }

    // 2. Check sessionStorage
    console.log('\n2. SessionStorage promo_banner keys:');
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith('promo_banner_')) {
            console.log(`  ${key}: ${sessionStorage.getItem(key)}`);
        }
    }

    // 3. Clear all promo banner storage (uncomment to reset)
    // console.log('\n3. Clearing all promo_banner storage...');
    // for (let i = localStorage.length - 1; i >= 0; i--) {
    //     const key = localStorage.key(i);
    //     if (key && key.startsWith('promo_banner_')) {
    //         localStorage.removeItem(key);
    //         console.log(`  Removed: ${key}`);
    //     }
    // }
    // for (let i = sessionStorage.length - 1; i >= 0; i--) {
    //     const key = sessionStorage.key(i);
    //     if (key && key.startsWith('promo_banner_')) {
    //         sessionStorage.removeItem(key);
    //         console.log(`  Removed: ${key}`);
    //     }
    // }

    console.log('\n=== To reset banners, run in console: ===');
    console.log('Object.keys(localStorage).filter(k => k.startsWith("promo_banner_")).forEach(k => localStorage.removeItem(k))');
    console.log('Object.keys(sessionStorage).filter(k => k.startsWith("promo_banner_")).forEach(k => sessionStorage.removeItem(k))');
    console.log('\nThen refresh the page.');
})();
