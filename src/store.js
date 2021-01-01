import { writable } from 'svelte/store'

export const focusedGitHubPath = writable(null);
export const focusedPathisLeaf = writable(false);