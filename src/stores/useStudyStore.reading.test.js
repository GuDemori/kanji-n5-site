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
    expect(store.readingFeedback).toContain('Ainda não. Leituras aceitas:');
    expect(store.readingFeedback).toContain('* ');
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

  it('aceita leitura on como resposta correta no flashcard', () => {
    const store = createStore();

    const currentBefore = store.current;
    expect(currentBefore.onReading.length).toBeGreaterThan(0);

    const onReading = firstReadingVariant(currentBefore.onReading);
    store.setReadingInput(onReading);
    store.submitReadingAttempt();

    expect(store.current.id).not.toBe(currentBefore.id);
    expect(store.sessionStats.correct).toBe(1);
  });

  it('modo completar todas só avança após registrar todas as leituras', () => {
    const store = createStore();
    const firstId = store.current.id;

    store.setRequireAllReadings(true);

    store.setReadingInput('yama');
    store.submitReadingAttempt();

    expect(store.current.id).toBe(firstId);
    expect(store.readingsFoundCount).toBe(1);
    expect(store.readingFeedback).toContain('1/2');

    store.setReadingInput('san');
    store.submitReadingAttempt();

    expect(store.current.id).not.toBe(firstId);
  });

  it('modo completar todas não registra leitura repetida', () => {
    const store = createStore();

    store.setRequireAllReadings(true);
    store.setReadingInput('yama');
    store.submitReadingAttempt();
    const attemptsAfterFirst = store.sessionStats.attempts;

    store.setReadingInput('yama');
    store.submitReadingAttempt();

    expect(store.sessionStats.attempts).toBe(attemptsAfterFirst);
    expect(store.readingsFoundCount).toBe(1);
    expect(store.readingFeedback).toContain('já registrou');
  });
});
