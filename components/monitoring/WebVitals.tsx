'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vital]', metric);
    }

    const body = JSON.stringify({ ...metric, timestamp: Date.now() });

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/metrics', body);
      return;
    }

    fetch('/api/metrics', {
      method: 'POST',
      body,
      keepalive: true
    }).catch(() => undefined);
  });

  return null;
}
