import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_ORIGIN, absoluteUrl } from '../config/siteOrigin.js';
import {
  blockSearchRobots,
  hasMaintenanceBypass,
  maintenanceMode,
} from '../config/siteVisibility.js';
import { getSeoForPath } from '../seo/seoConfig.js';

const OG_IMAGE_PATH = '/logo-mark.png';

function setMetaByName(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setMetaByProperty(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function injectJsonLdOnce() {
  if (document.getElementById('ld-json-sintegrator')) {
    return;
  }
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'Синтегратор',
        url: `${SITE_ORIGIN}/`,
        logo: `${SITE_ORIGIN}${OG_IMAGE_PATH}`,
      },
      {
        '@type': 'WebSite',
        name: 'Синтегратор',
        url: `${SITE_ORIGIN}/`,
      },
    ],
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'ld-json-sintegrator';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

export default function SeoHead() {
  const { pathname } = useLocation();

  useEffect(() => {
    injectJsonLdOnce();
  }, []);

  useEffect(() => {
    const seo = getSeoForPath(pathname);
    const url = absoluteUrl(pathname);
    const ogImage = `${SITE_ORIGIN}${OG_IMAGE_PATH}`;

    document.title = seo.title;

    let descEl = document.querySelector('meta[name="description"]');
    if (!descEl) {
      descEl = document.createElement('meta');
      descEl.setAttribute('name', 'description');
      document.head.appendChild(descEl);
    }
    descEl.setAttribute('content', seo.description);

    const maintenanceClosed = maintenanceMode && !hasMaintenanceBypass();
    const forceClosed =
      blockSearchRobots || maintenanceClosed ? 'noindex, nofollow' : null;
    const robots = forceClosed || seo.robots || 'index, follow';
    setMetaByName('robots', robots);

    setCanonical(url);

    setMetaByProperty('og:type', 'website');
    setMetaByProperty('og:locale', 'ru_RU');
    setMetaByProperty('og:url', url);
    setMetaByProperty('og:title', seo.title);
    setMetaByProperty('og:description', seo.description);
    setMetaByProperty('og:image', ogImage);

    setMetaByName('twitter:card', 'summary_large_image');
    setMetaByName('twitter:title', seo.title);
    setMetaByName('twitter:description', seo.description);
    setMetaByName('twitter:image', ogImage);
  }, [pathname]);

  return null;
}
