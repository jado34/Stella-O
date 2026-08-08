import { useEffect } from 'react';

/**
 * SEOHead — Dynamically updates <title>, <meta>, and injects JSON-LD
 * structured data based on the active view. Google renders JS so this works.
 */

const BASE_URL = 'https://www.afrifoodbasket.de';
const BRAND = 'AfriFood Basket';

// ── Per-view SEO config ─────────────────────────────────────────────────────
const SEO_CONFIG = {
  home: {
    title: `${BRAND} — Authentic Nigerian & African Food Delivered Across Germany`,
    description:
      'Buy authentic Nigerian and West African food online in Germany. Garri, Ofada Rice, Egusi, Stockfish, Palm Oil, Suya Spice and more — delivered to Berlin, Hamburg, Munich, Frankfurt, Cologne via DHL.',
    keywords:
      'Nigerian food Germany, African food Germany, buy Egusi Germany, Garri Germany, Stockfish Germany, Palm Oil Germany, African grocery delivery Berlin, Nigerian groceries Hamburg, West African food Munich',
  },
  shop: {
    title: `Shop Nigerian & African Food | ${BRAND}`,
    description:
      'Browse our full range of authentic Nigerian and West African groceries — Amala Flour, Pounded Yam, Ofada Rice, Honey Beans, Egusi, Ogbono, Smoked Fish, Suya Spice and much more. Delivered anywhere in Germany.',
    keywords:
      'buy Nigerian food online Germany, African grocery store Germany, Ofada Rice delivery, Egusi buy Germany, Stockfish Germany, Pounded Yam flour Germany',
  },
  story: {
    title: `Our Story — From Lagos to Germany | ${BRAND}`,
    description:
      'Learn how AfriFood Basket started in Lagos and now delivers authentic Nigerian farm food to the African diaspora across Germany. Hand-selected, vacuum-sealed, trusted.',
    keywords:
      'AfriFood Basket story, Nigerian food shop Germany, authentic African food sourcing, Nigerian diaspora Germany food',
  },
  gallery: {
    title: `Gallery | ${BRAND}`,
    description:
      'See our hand-selected Nigerian and West African food products, fresh arrivals, and packing process at AfriFood Basket.',
    keywords: 'AfriFood Basket gallery, Nigerian food photos, African food Germany',
  },
  contact: {
    title: `Contact Us | ${BRAND}`,
    description:
      'Get in touch with AfriFood Basket. Questions about delivery, bulk orders, or payments? We respond quickly via email or WhatsApp.',
    keywords:
      'contact AfriFood Basket, African food shop contact Berlin, Nigerian food WhatsApp Germany',
  },
  faq: {
    title: `FAQ & Shipping Info | ${BRAND}`,
    description:
      'Frequently asked questions about AfriFood Basket — DHL delivery times across Germany, payment methods, food sourcing, packaging, EU returns policy and bulk ordering.',
    keywords:
      'AfriFood Basket FAQ, shipping African food Germany, DHL delivery Nigeria food, payment methods African food Germany',
  },
  privacy: {
    title: `Privacy Policy | ${BRAND}`,
    description: 'Privacy Policy for AfriFood Basket — how we collect, use and protect your personal data in accordance with GDPR.',
    keywords: 'AfriFood Basket privacy policy, GDPR African food Germany',
  },
  terms: {
    title: `Terms of Service | ${BRAND}`,
    description: 'Terms and conditions for using AfriFood Basket — ordering, delivery, returns and user responsibilities.',
    keywords: 'AfriFood Basket terms, African food Germany terms of service',
  },
};

// ── Organization JSON-LD (always present) ───────────────────────────────────
const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AfriFood Basket',
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.svg`,
  description:
    'AfriFood Basket is a Nigerian-registered African food business operating in Germany, delivering authentic Nigerian and West African groceries to customers across Germany via DHL.',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+4915731234567',
    contactType: 'customer service',
    availableLanguage: ['English'],
  },
  sameAs: [],
  areaServed: {
    '@type': 'Country',
    name: 'Germany',
  },
};

// ── LocalBusiness JSON-LD ───────────────────────────────────────────────────
const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FoodEstablishment',
  name: 'AfriFood Basket',
  image: `${BASE_URL}/favicon.svg`,
  url: BASE_URL,
  telephone: '+4915731234567',
  email: 'hello@afrifoodbasket.de',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Kurfürstendamm 50',
    addressLocality: 'Berlin',
    postalCode: '10709',
    addressCountry: 'DE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 52.5015,
    longitude: 13.3325,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: '10:00',
      closes: '15:00',
    },
  ],
  servesCuisine: 'Nigerian, West African',
  priceRange: '₦₦',
  description:
    'Authentic Nigerian and West African food delivered anywhere in Germany. Garri, Ofada Rice, Egusi, Stockfish, Palm Oil, Suya Spice and more.',
  hasMap: 'https://maps.google.com/?q=Kurfürstendamm+50+Berlin',
};

// ── FAQ JSON-LD for the FAQ page ────────────────────────────────────────────
const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Which cities in Germany do you deliver to?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We deliver to all cities across Germany via DHL, including Berlin, Hamburg, Munich, Frankfurt, Cologne, Stuttgart, Düsseldorf, Dortmund, Bremen, Leipzig, and everywhere in between.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does delivery take within Germany?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Standard delivery via DHL takes 2–4 business days. Orders placed before 12:00 noon (CET) on weekdays are typically dispatched the same day.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are the products really hand-selected?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. AfriFood Basket has spent over twenty years building relationships with local farmers in Ogun, Ekiti, Kano, and Benue. Every batch is inspected before being vacuum-sealed and shipped to Germany.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which payment methods do you accept?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We accept PayPal, SEPA bank transfer, and all major credit/debit cards (Visa, Mastercard). For Nigerian customers, we also support direct bank transfer with WhatsApp confirmation.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is your returns and refund policy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Under EU consumer law, you have the right to return most items within 14 days of receipt. If you receive a damaged or incorrect item, contact us within 48 hours for a full replacement or refund.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer bulk supply for events or restaurants?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We supply African restaurants, churches, event caterers, and community organizations across Germany. Submit a Corporate Quote request and our team will respond within 24 hours.',
      },
    },
  ],
};

// ── Helpers ─────────────────────────────────────────────────────────────────
function setMeta(name, content, isProperty = false) {
  const attr = isProperty ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function injectJsonLd(id, schema) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(schema);
}

function removeJsonLd(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// ── Component ────────────────────────────────────────────────────────────────
export default function SEOHead({ activeView, selectedProduct }) {
  useEffect(() => {
    const config = SEO_CONFIG[activeView] || SEO_CONFIG.home;

    // ── Title ──────────────────────────────────────────────────────────────
    document.title = config.title;

    // ── Standard Meta ──────────────────────────────────────────────────────
    setMeta('description', config.description);
    setMeta('keywords', config.keywords);

    // ── Open Graph ─────────────────────────────────────────────────────────
    setMeta('og:title', config.title, true);
    setMeta('og:description', config.description, true);
    setMeta('og:url', `${BASE_URL}/${activeView === 'home' ? '' : '#' + activeView}`, true);
    setMeta('og:type', 'website', true);
    setMeta('og:site_name', BRAND, true);
    setMeta('og:locale', 'en_DE', true);

    // ── Twitter Card ───────────────────────────────────────────────────────
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', config.title);
    setMeta('twitter:description', config.description);

    // ── Always-present structured data ─────────────────────────────────────
    injectJsonLd('schema-organization', ORGANIZATION_SCHEMA);
    injectJsonLd('schema-local-business', LOCAL_BUSINESS_SCHEMA);

    // ── View-specific structured data ──────────────────────────────────────
    if (activeView === 'faq') {
      injectJsonLd('schema-faq', FAQ_SCHEMA);
    } else {
      removeJsonLd('schema-faq');
    }

    // ── Product schema when a product detail modal is open ─────────────────
    if (selectedProduct) {
      const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: selectedProduct.name,
        description: selectedProduct.description,
        image: `${BASE_URL}${selectedProduct.image}`,
        brand: {
          '@type': 'Brand',
          name: 'AfriFood Basket',
        },
        offers: selectedProduct.variants.map((v) => ({
          '@type': 'Offer',
          name: v.label,
          priceCurrency: 'NGN',
          price: v.price,
          availability:
            v.stock > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          seller: {
            '@type': 'Organization',
            name: 'AfriFood Basket',
          },
        })),
        countryOfOrigin: {
          '@type': 'Country',
          name: 'Nigeria',
        },
      };
      injectJsonLd('schema-product', productSchema);
    } else {
      removeJsonLd('schema-product');
    }
  }, [activeView, selectedProduct]);

  return null; // Renders nothing — only manipulates <head>
}
