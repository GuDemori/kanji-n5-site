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
    lesson: 'Lição 14',
  },
  {
    id: 'test-2',
    verb: 'のみます',
    teForm: 'のんで',
    translation: 'beber água',
    lesson: 'Lição 15',
  },
];
const singleVerb = [verbs[0]];

describe('useTeFormPractice', () => {
  it('normaliza tradução com lowercase, trim e espaços duplicados', () => {
    expect(normalizeTranslation('  COMER   ARROZ  ')).toBe('comer arroz');
    expect(isTranslationAnswerCorrect(' COMER   ARROZ ', 'comer arroz')).toBe(true);
  });

  it('aceita qualquer variante de tradução separada por vírgula', () => {
    expect(isTranslationAnswerCorrect('ligar', 'acender, ligar')).toBe(true);
    expect(isTranslationAnswerCorrect('desligar', 'apagar, desligar')).toBe(true);
    expect(isTranslationAnswerCorrect('acender luz', 'acender, ligar')).toBe(false);
  });

  it('normaliza busca ignorando maiúsculas, espaços duplicados e acentos', () => {
    expect(normalizeSearchTerm('  BEBER   ÁGUA  ')).toBe('beber agua');
  });

  it('valida forma て com comparação exata após trim', () => {
    expect(isTeFormAnswerCorrect(' たべて ', 'たべて')).toBe(true);
    expect(isTeFormAnswerCorrect('食べて', 'たべて')).toBe(false);
  });

  it('aceita forma て em katakana ao normalizar para hiragana', () => {
    expect(isTeFormAnswerCorrect('タベテ', 'たべて')).toBe(true);
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
    practice.setTeFormInput(' たべて ');
    practice.translationInput.value = 'errado';
    practice.submitAnswer();

    expect(practice.stats.value.correct).toBe(1);
    expect(practice.feedbackState.value).toBe('idle');
    expect(practice.teFormInput.value).toBe('');
  });

  it('converte o input da forma て entre hiragana e katakana', () => {
    const practice = useTeFormPractice(singleVerb);

    practice.setTeFormInput('tabete');
    expect(practice.teFormInput.value).toBe('たべて');

    practice.toggleTeFormInputScript();
    expect(practice.teFormInputScript.value).toBe('katakana');
    expect(practice.teFormInput.value).toBe('タベテ');

    practice.submitAnswer();
    expect(practice.feedbackState.value).toBe('idle');
    expect(practice.teFormInput.value).toBe('');
  });

  it('valida somente a tradução quando apenas esse campo está ativo', () => {
    const practice = useTeFormPractice(singleVerb);

    practice.setTeFormEnabled(false);
    practice.setTranslationEnabled(true);
    practice.teFormInput.value = 'errado';
    practice.translationInput.value = ' COMER   ARROZ ';
    practice.submitAnswer();

    expect(practice.stats.value.correct).toBe(1);
    expect(practice.feedbackState.value).toBe('idle');
    expect(practice.translationInput.value).toBe('');
  });

  it('aceita uma única tradução válida quando o verbo tem múltiplas opções', () => {
    const practice = useTeFormPractice([{
      id: 'test-3',
      verb: 'つけます',
      teForm: 'つけて',
      translation: 'acender, ligar',
      lesson: 'Lição 14',
    }]);

    practice.setTeFormEnabled(false);
    practice.setTranslationEnabled(true);
    practice.translationInput.value = 'ligar';
    practice.submitAnswer();

    expect(practice.stats.value.correct).toBe(1);
    expect(practice.translationInput.value).toBe('');
  });

  it('valida forma て e tradução quando os dois campos estão ativos', () => {
    const practice = useTeFormPractice(singleVerb);

    practice.setTranslationEnabled(true);
    practice.setTeFormInput('たべて');
    practice.translationInput.value = 'comer errado';
    practice.submitAnswer();

    expect(practice.stats.value.wrong).toBe(1);
    expect(practice.feedback.value).toContain('Forma て correta: たべて');
    expect(practice.feedback.value).toContain('Tradução correta: comer arroz');

    practice.translationInput.value = 'comer arroz';
    practice.submitAnswer();

    expect(practice.stats.value.correct).toBe(1);
    expect(practice.feedbackState.value).toBe('idle');
    expect(practice.translationInput.value).toBe('');
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

  it('filtra a prática por lição específica', () => {
    const practice = useTeFormPractice(verbs);

    practice.setPracticeLessonFilter('Lição 15');

    expect(practice.currentVerb.value).toEqual(verbs[1]);
  });

  it('filtra a lista completa por lição e mantém agrupamento por lição', () => {
    const practice = useTeFormPractice(verbs);

    practice.setVerbListLessonFilter('Lição 14');

    expect(practice.filteredVerbList.value).toEqual([verbs[0]]);
    expect(practice.groupedFilteredVerbList.value).toEqual([
      {
        lesson: 'Lição 14',
        items: [verbs[0]],
      },
    ]);
  });
});
