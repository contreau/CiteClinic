import { writable } from 'svelte/store';
import type { Citation } from '../ts/types';
export const scrapes = writable<Citation[]>([]);
export const urlHistory = writable<string[]>([]);
export const firstCitationMade = writable<boolean>(false);
export const activeTabIndex = writable<number>();
export const deleteNotification = writable<number>(0);

// css class used to expand the CitationDisplay to full width. used in displayResults() function of Fetcher.svelte
export const expandedClass = writable('');
