// Utility to generate blur data URL for images
export function getBlurDataURL(width: number = 10, height: number = 10): string {
    const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#F5F3EF" offset="20%" />
      <stop stop-color="#E8E6E0" offset="50%" />
      <stop stop-color="#F5F3EF" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#F5F3EF" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

    const toBase64 = (str: string) =>
        typeof window === 'undefined'
            ? Buffer.from(str).toString('base64')
            : window.btoa(str)

    return `data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`
}

// Organic luxury themed blur placeholder
export const organicBlurDataURL = getBlurDataURL(40, 40)

// Different aspect ratios
export const blurDataURLs = {
    square: getBlurDataURL(40, 40),
    landscape: getBlurDataURL(40, 30),
    portrait: getBlurDataURL(30, 40),
    wide: getBlurDataURL(40, 20),
}
