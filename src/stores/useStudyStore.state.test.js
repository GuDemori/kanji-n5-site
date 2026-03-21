import { beforeEach, describe, expect, it } from 'vitest';
import {
  createStore,
  firstReadingVariant,
  SESSION_KEY,
  STORAGE_KEY,
} from './useStudyStore.test.helpers';

describe('useStudyStore (state)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('moveCard faz wrap no início e no fim do deck', () => {
    const store = createStore();

    const firstId = store.deck[0].id;
    const lastId = store.deck[store.deck.length - 1].id;

    for (let i = 0; i < store.deck.length && store.current.id !== firstId; i += 1) {
      store.moveCard(1);
    }

    store.moveCard(-1);
    expect(store.current.id).toBe(lastId);

    store.moveCard(1);
    expect(store.current.id).toBe(firstId);
  });

  it('showFlashcardHint e showFlashcardAnswer preenchem feedback', () => {
    const store = createStore();

    store.showFlashcardHint();
    expect(store.flashcardHint.length).toBeGreaterThan(0);

    store.showFlashcardAnswer();
    expect(store.flashcardAnswer).not.toBeNull();
  });

  it('hideFeedbackPanels limpa feedbacks de flashcard/leitura/quiz', () => {
    const store = createStore();

    store.showFlashcardHint();
    store.showFlashcardAnswer();
    store.setReadingInput('yama');
    store.submitReadingAttempt();
    store.showQuizHint();

    store.hideFeedbackPanels();

    expect(store.flashcardHint).toBe('');
    expect(store.flashcardAnswer).toBeNull();
    expect(store.readingInput).toBe('');
    expect(store.readingFeedback).toBe('');
    expect(store.quizFeedback).toBe('');
  });

  it('resetProgress limpa progresso e estatísticas', () => {
    const store = createStore();

    const currentBefore = store.current;
    store.setReadingInput(firstReadingVariant(currentBefore.reading));
    store.submitReadingAttempt();
    expect(store.knownCount).toBeGreaterThan(0);

    store.resetProgress();

    expect(store.knownCount).toBe(0);
    expect(store.unknownCount).toBe(0);
    expect(store.sessionStats.attempts).toBe(0);
  });

  it('persiste sessão e progresso no localStorage', () => {
    const store = createStore();

    store.setMode('quiz');
    store.setShuffle(false);

    const currentBefore = store.current;
    store.setReadingInput(firstReadingVariant(currentBefore.reading));
    store.submitReadingAttempt();

    const rawSession = localStorage.getItem(SESSION_KEY);
    const rawProgress = localStorage.getItem(STORAGE_KEY);

    expect(rawSession).toBeTruthy();
    expect(rawProgress).toBeTruthy();

    const session = JSON.parse(rawSession);
    const progress = JSON.parse(rawProgress);

    expect(session.mode).toBe('quiz');
    expect(typeof session.shuffle).toBe('boolean');
    expect(Array.isArray(progress.known)).toBe(true);
  });

  it('carrega fallback quando localStorage está inválido', () => {
    localStorage.setItem(STORAGE_KEY, '{invalid');
    localStorage.setItem(SESSION_KEY, '{invalid');

    const store = createStore();

    expect(store.mode).toBe('flashcard');
    expect(store.knownCount).toBe(0);
    expect(store.unknownCount).toBe(0);
  });

  it('filtra grid por texto e status', () => {
    const store = createStore();

    const total = store.gridFilteredData.length;
    expect(total).toBeGreaterThan(0);

    store.gridSearch = 'montanha';
    expect(store.gridFilteredData.length).toBeGreaterThan(0);

    store.gridSearch = 'ガク';
    expect(store.gridFilteredData.some(item => item.kanji === '学')).toBe(true);

    store.gridSearch = 'まな-ぶ';
    expect(store.gridFilteredData.some(item => item.kanji === '学')).toBe(true);

    const currentBefore = store.current;
    store.setReadingInput(firstReadingVariant(currentBefore.reading));
    store.submitReadingAttempt();

    store.gridSearch = '';
    store.gridStatusFilter = 'known';
    expect(store.gridFilteredData.length).toBeGreaterThan(0);

    store.gridStatusFilter = 'unmarked';
    expect(store.gridFilteredData.length).toBeLessThan(total);
  });

  it('toggleHelpTooltip e hideHelpTooltip controlam estado de ajuda', () => {
    const store = createStore();

    expect(store.helpOpen).toBe(false);
    store.toggleHelpTooltip();
    expect(store.helpOpen).toBe(true);
    store.hideHelpTooltip();
    expect(store.helpOpen).toBe(false);
  });

  it('setMode limpa feedbacks de flashcard e leitura', () => {
    const store = createStore();

    store.showFlashcardHint();
    store.showFlashcardAnswer();
    store.setReadingInput('yama');
    store.submitReadingAttempt();

    store.setMode('quiz');

    expect(store.flashcardHint).toBe('');
    expect(store.flashcardAnswer).toBeNull();
    expect(store.readingInput).toBe('');
    expect(store.readingFeedback).toBe('');
  });

  it('setShuffle preserva o card atual quando possível', () => {
    const store = createStore();

    store.moveCard(7);
    const currentId = store.current.id;

    store.setShuffle(true);

    expect(store.current.id).toBe(currentId);
  });

  it('sessionSummary reflete modo e estado de embaralhar', () => {
    const store = createStore();

    expect(store.sessionSummary).toContain('Flashcards');

    store.setMode('quiz');
    expect(store.sessionSummary).toContain('Quiz');

    store.setShuffle(false);
    expect(store.sessionSummary).toContain('embaralhar: desligado');
  });

  it('sourceData inclui kunReading e onReading para os kanjis', () => {
    const store = createStore();

    expect(store.sourceData.length).toBeGreaterThan(0);

    for (const item of store.sourceData) {
      expect(typeof item.kunReading).toBe('string');
      expect(item.kunReading.length).toBeGreaterThan(0);
      expect(typeof item.onReading).toBe('string');
      expect(item.onReading.length).toBeGreaterThan(0);
    }
  });

});
