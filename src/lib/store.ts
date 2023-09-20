import { writable } from 'svelte/store';
import type { Citation } from '../ts/types';
export const scrapes = writable<Citation[]>([]);
export const urlHistory = writable<string[]>([]);

// css class used to expand the CitationDisplay to full width. used on line 114 of Fetcher.svelte
export const expandedClass = writable('');
