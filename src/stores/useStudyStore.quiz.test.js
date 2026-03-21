import { beforeEach, describe, expect, it } from 'vitest';
import { createStore } from './useStudyStore.test.helpers';

describe('useStudyStore (quiz)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('answerQuiz marca quizAnswered e conta tentativa', () => {
    const store = createStore();

    store.setMode('quiz');
    const option = store.quizOptions[0];

    store.answerQuiz(option);

    expect(store.quizAnswered).toBe(true);
    expect(store.sessionStats.attempts).toBe(1);
  });

  it('answerQuiz ignora segunda resposta na mesma pergunta', () => {
    const store = createStore();

    store.setMode('quiz');
    const option = store.quizOptions[0];

    store.answerQuiz(option);
    const attemptsAfterFirst = store.sessionStats.attempts;

    store.answerQuiz(store.quizOptions[1] ?? option);

    expect(store.sessionStats.attempts).toBe(attemptsAfterFirst);
  });

  it('showQuizHint preenche feedback com dica do item atual', () => {
    const store = createStore();

    store.setMode('quiz');
    store.showQuizHint();

    expect(store.quizFeedback.length).toBeGreaterThan(0);
  });
});
