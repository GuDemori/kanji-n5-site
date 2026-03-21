import { createPinia, setActivePinia } from 'pinia';
import { useStudyStore } from './useStudyStore';

export const STORAGE_KEY = 'kanji-n5-progress-v1';
export const SESSION_KEY = 'kanji-n5-session-v1';

export function createStore() {
  setActivePinia(createPinia());
  const store = useStudyStore();
  store.init();
  store.setShuffle(false);
  return store;
}

export function firstReadingVariant(reading) {
  return String(reading || '')
    .split(/[・/、,\s]+/)
    .find(Boolean) || '';
}
