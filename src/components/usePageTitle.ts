import { useEffect } from 'react';

const BASE = 'Fanitt — Where creators, brands and fans meet';

export function usePageTitle(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | Fanitt` : BASE;
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [title, description]);
}
