// LOGO & HERO IMAGES — paste your image links here, commit, and the site rebuilds.
//
// A value can be a full link ('https://…/photo.jpg') or a file you add to  public/assets/img/  (e.g. '/assets/img/about.webp').
// Leave '' to keep the reserved empty space (heroes) or the default "N" mark (logo).
// TIP: keep hero images around 1200 × 800 px and under ~200 KB (WebP or JPG). Keep full-size originals in  source-images/  (not deployed).
//
// LOGO      Shown in the header and footer next to the name "NEXA Advisory & Consulting" (the name itself never changes).
// HERO      Each inner page has an image slot on the right side of its hero banner.
//           Lookup order: exact page → section wildcard ('/services/*') → default.
//           For the home page ('/') the image is used as the full-width hero background instead.
export const media = {
  logo: '/assets/img/logos.jpg',
  favicon: '/assets/img/favicon.png',
  appleTouchIcon: '/assets/img/apple-touch-icon.png',

  heroImages: {
    default: '/assets/img/hero-mountain.jpg',
    '/': '/assets/img/hero-mountain.jpg',

    '/services': '/assets/img/services.webp',
    '/services/*': '/assets/img/services.webp',

    '/industries': '/assets/img/industries.webp',
    '/industries/*': '/assets/img/industries.webp',

    '/why-nexa': '/assets/img/why-nexa.webp',
    '/about': '/assets/img/about.webp',
    '/outsourcing': '/assets/img/outsourcing.webp',

    // The blog now lives at blog.nexa.com.np; /blog is only a redirect page.
    '/blog': '/assets/img/blogs.webp',

    '/book': '/assets/img/contact.webp',
    '/careers': '/assets/img/careers.webp',
    '/careers/*': '/assets/img/careers.webp',

    '/faqs': '/assets/img/faqs.webp',
    '/contact': '/assets/img/contact.webp',

    '/privacy-policy': '/assets/img/legal.webp',
    '/terms-of-use': '/assets/img/legal.webp',
    '/disclaimer': '/assets/img/legal.webp',
    '/cookie-policy': '/assets/img/legal.webp',

    '/thank-you': '/assets/img/thank-you.webp',
    '/404': '/assets/img/404.webp',
  },
};
