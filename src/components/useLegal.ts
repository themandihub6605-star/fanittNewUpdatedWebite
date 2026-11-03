import { useEffect, useState } from 'react';
import { SITE } from '@/config/site';

// Legal documents come from the backend (src/content/legal/*.txt), so the
// app and the website always show the same, current text.

export type LegalBlock = { type: 'p' | 'h' | 'li' | 'ol'; text: string; n?: number };
export type LegalDoc = {
  slug: string;
  title: string;
  subtitle: string;
  updated: string;
  effective: string;
  intro: LegalBlock[];
  sections: { id: string; number: string; title: string; blocks: LegalBlock[] }[];
};
export type LegalSummary = { slug: string; title: string; updated: string };

export const LEGAL_ROUTES: Record<string, string> = {
  'privacy-policy': '/privacy',
  'terms-of-use': '/terms',
  'refund-policy': '/refunds',
};

let listCache: Promise<LegalSummary[]> | null = null;

export function fetchLegalList() {
  listCache ??= fetch(`${SITE.apiBase}/legal`)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((b) => (Array.isArray(b?.data) ? (b.data as LegalSummary[]) : []))
    .catch(() => {
      listCache = null;
      return [];
    });
  return listCache;
}

export function useLegalList() {
  const [list, setList] = useState<LegalSummary[]>([]);
  useEffect(() => {
    let live = true;
    fetchLegalList().then((l) => live && setList(l));
    return () => {
      live = false;
    };
  }, []);
  return list;
}

export function useLegalDoc(slug: string) {
  const [state, setState] = useState<{ doc: LegalDoc | null; error: string | null; loading: boolean }>({ doc: null, error: null, loading: true });
  useEffect(() => {
    let live = true;
    setState({ doc: null, error: null, loading: true });
    fetch(`${SITE.apiBase}/legal/${slug}`)
      .then(async (r) => {
        if (r.status === 404) throw new Error('missing');
        if (!r.ok) throw new Error('failed');
        return (await r.json()).data as LegalDoc;
      })
      .then((doc) => live && setState({ doc, error: null, loading: false }))
      .catch((e: Error) => live && setState({ doc: null, error: e.message, loading: false }));
    return () => {
      live = false;
    };
  }, [slug]);
  return state;
}
