import { describe, expect, it } from 'vitest';
import {
  isTeFormAnswerCorrect,
  isTranslationAnswerCorrect,
  normalizeSearchTerm,
  normalizeTranslation,
  useTeFormPractice,
} from './useTeFormPractice';

const verbs = [
  {
    id: 'test-1',
    verb: 'たべます',
    teForm: 'たべて',
    translation: 'comer arroz',
  },
  {
    id: 'test-2',
    verb: 'のみます',
    teForm: 'のんで',
    translation: 'beber água',
  },
];
const singleVerb = [verbs[0]];

describe('useTeFormPractice', () => {
  it('normaliza tradução com lowercase, trim e espaços duplicados', () => {
    expect(normalizeTranslation('  COMER   ARROZ  ')).toBe('comer arroz');
    expect(isTranslationAnswerCorrect(' COMER   ARROZ ', 'comer arroz')).toBe(true);
  });

  it('normaliza busca ignorando maiúsculas, espaços duplicados e acentos', () => {
    expect(normalizeSearchTerm('  BEBER   ÁGUA  ')).toBe('beber agua');
  });

  it('valida forma て com comparação exata após trim', () => {
    expect(isTeFormAnswerCorrect(' たべて ', 'たべて')).toBe(true);
    expect(isTeFormAnswerCorrect('食べて', 'たべて')).toBe(false);
  });

  it('não registra tentativa quando os dois campos estão desabilitados', () => {
    const practice = useTeFormPractice(singleVerb);

    practice.setTeFormEnabled(false);
    practice.setTranslationEnabled(false);
    practice.submitAnswer();

    expect(practice.stats.value.attempts).toBe(0);
    expect(practice.feedback.value).toContain('Habilite pelo menos um campo');
    expect(practice.feedbackState.value).toBe('warning');
  });

  it('valida somente a forma て quando apenas esse campo está ativo', () => {
    const practice = useTeFormPractice(singleVerb);

    practice.setTranslationEnabled(false);
    practice.teFormInput.value = ' たべて ';
    practice.translationInput.value = 'errado';
    practice.submitAnswer();

    expect(practice.stats.value.correct).toBe(1);
    expect(practice.feedbackState.value).toBe('correct');
  });

  it('valida somente a tradução quando apenas esse campo está ativo', () => {
    const practice = useTeFormPractice(singleVerb);

    practice.setTeFormEnabled(false);
    practice.setTranslationEnabled(true);
    practice.teFormInput.value = 'errado';
    practice.translationInput.value = ' COMER   ARROZ ';
    practice.submitAnswer();

    expect(practice.stats.value.correct).toBe(1);
    expect(practice.feedbackState.value).toBe('correct');
  });

  it('valida forma て e tradução quando os dois campos estão ativos', () => {
    const practice = useTeFormPractice(singleVerb);

    practice.setTranslationEnabled(true);
    practice.teFormInput.value = 'たべて';
    practice.translationInput.value = 'comer errado';
    practice.submitAnswer();

    expect(practice.stats.value.wrong).toBe(1);
    expect(practice.feedback.value).toContain('Forma て correta: たべて');
    expect(practice.feedback.value).toContain('Tradução correta: comer arroz');

    practice.translationInput.value = 'comer arroz';
    practice.submitAnswer();

    expect(practice.stats.value.correct).toBe(1);
    expect(practice.feedbackState.value).toBe('correct');
  });

  it('filtra a lista completa por verbo base', () => {
    const practice = useTeFormPractice(verbs);

    practice.verbListFilter.value = 'verb';
    practice.verbListSearch.value = 'のみ';

    expect(practice.filteredVerbList.value).toEqual([verbs[1]]);
  });

  it('filtra a lista completa por tradução', () => {
    const practice = useTeFormPractice(verbs);

    practice.verbListFilter.value = 'translation';
    practice.verbListSearch.value = 'BEBER AGUA';

    expect(practice.filteredVerbList.value).toEqual([verbs[1]]);
  });
});
