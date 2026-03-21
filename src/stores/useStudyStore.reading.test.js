import { beforeEach, describe, expect, it } from 'vitest';
import { createStore, firstReadingVariant } from './useStudyStore.test.helpers';

describe('useStudyStore (reading)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('converte romaji para hiragana no input de leitura', () => {
    const store = createStore();

    store.setReadingInput('gakkou');

    expect(store.readingInput).toBe('がっこう');
  });

  it('limpa feedback de leitura ao digitar novamente', () => {
    const store = createStore();

    store.submitReadingAttempt();
    expect(store.readingFeedback).toBe('Digite a leitura em hiragana.');

    store.setReadingInput('yama');
    expect(store.readingFeedback).toBe('');
  });

  it('avança para o próximo kanji quando a leitura está correta', () => {
    const store = createStore();

    const currentBefore = store.current;
    const attemptsBefore = store.sessionStats.attempts;
    const correctReading = firstReadingVariant(currentBefore.reading);

    store.setReadingInput(correctReading);
    store.submitReadingAttempt();

    expect(store.sessionStats.attempts).toBe(attemptsBefore + 1);
    expect(store.current.id).not.toBe(currentBefore.id);
  });

  it('marca known ao acertar leitura', () => {
    const store = createStore();

    const currentBefore = store.current;
    const correctReading = firstReadingVariant(currentBefore.reading);

    store.setReadingInput(correctReading);
    store.submitReadingAttempt();

    expect(store.knownCount).toBe(1);
    expect(store.getProgressState(currentBefore.id)).toBe('Sabia');
  });

  it('não avança quando a leitura está errada', () => {
    const store = createStore();

    const currentBefore = store.current;

    store.setReadingInput('kumo');
    store.submitReadingAttempt();

    expect(store.current.id).toBe(currentBefore.id);
    expect(store.readingFeedback).toContain('Leitura correta');
    expect(store.sessionStats.wrong).toBe(1);
  });

  it('não duplica known ao acertar o mesmo kanji duas vezes', () => {
    const store = createStore();

    const firstId = store.current.id;
    const firstReading = firstReadingVariant(store.current.reading);

    store.setReadingInput(firstReading);
    store.submitReadingAttempt();

    store.moveCard(-1);
    store.setReadingInput(firstReading);
    store.submitReadingAttempt();

    const knownIds = store.sourceData
      .filter(item => store.getProgressState(item.id) === 'Sabia')
      .map(item => item.id);

    const countFirstId = knownIds.filter(id => id === firstId).length;
    expect(countFirstId).toBe(1);
  });
});
