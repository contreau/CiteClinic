import { writable } from 'svelte/store';
import type { Citation } from '../ts/types';
export const scrapes = writable<Citation[]>([]);
export const urlHistory = writable<string[]>([]);
