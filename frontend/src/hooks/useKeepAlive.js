/**
 * useKeepAlive
 * Pings the backend /ping endpoint every 4 minutes.
 * Prevents Render free-tier cold starts (which add 10-30s to first request).
 */
import { useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BACKEND_URL = API_URL.replace('/api', '');
const INTERVAL_MS = 4 * 60 * 1000; // 4 minutes

export function useKeepAlive() {
  useEffect(() => {
    const ping = () => {
      fetch(`${BACKEND_URL}/ping`, { method: 'GET', cache: 'no-store' })
        .then(() => console.debug('[KeepAlive] Backend pinged'))
        .catch(() => {}); // silently ignore failures
    };

    // Ping immediately on mount, then every 4 minutes
    ping();
    const id = setInterval(ping, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);
}
