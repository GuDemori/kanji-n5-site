import { describe, expect, it } from 'vitest';
import {
  isBaseVerbAnswerCorrect,
  isTeFormAnswerCorrect,
  isTranslationAnswerCorrect,
  normalizeSearchTerm,
  normalizeTranslation,
  useTeFormPractice,
} from './useTeFormPractice';
import { teFormVerbData } from '../data/teFormVerbData';

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
const singleNaiVerb = [{
  id: 'test-3',
  verb: 'おぼえます',
  teForm: 'おぼえて',
  naiForm: 'おぼえない',
  translation: 'memorizar',
  lesson: 'Lição 17',
}];

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

  it('normaliza espaços acidentais sem aceitar respostas parciais', () => {
    expect(isTeFormAnswerCorrect(' おぼえ ない ', 'おぼえない')).toBe(true);
    expect(isTeFormAnswerCorrect('おぼえ', 'おぼえない')).toBe(false);
  });

  it('aceita forma て em katakana ao normalizar para hiragana', () => {
    expect(isTeFormAnswerCorrect('タベテ', 'たべて')).toBe(true);
  });

  it('valida verbo base com comparação exata após trim', () => {
    expect(isBaseVerbAnswerCorrect(' たべます ', 'たべます')).toBe(true);
    expect(isBaseVerbAnswerCorrect('食べます', 'たべます')).toBe(false);
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

  it('mantém forma て como tipo padrão e permite alternar o tipo de prática', () => {
    const practice = useTeFormPractice(singleVerb);

    expect(practice.conjugationType.value).toBe('te');
    expect(practice.conjugationLabel.value).toBe('Forma て');
    expect(practice.conjugationPlaceholder.value).toBe('Digite a forma て');
    expect(practice.answerConjugationLabel.value).toBe('Responder forma て');
    expect(practice.conjugationTypeOptions.value.map(option => option.value)).toEqual(['te', 'nai']);

    practice.setTeFormInput('たべて');
    practice.setConjugationType('nai');

    expect(practice.conjugationType.value).toBe('nai');
    expect(practice.conjugationLabel.value).toBe('Forma ない');
    expect(practice.conjugationPlaceholder.value).toBe('Digite a forma ない');
    expect(practice.answerConjugationLabel.value).toBe('Responder forma ない');
    expect(practice.teFormInput.value).toBe('');

    practice.setConjugationType('valor-invalido');
    expect(practice.conjugationType.value).toBe('te');
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

  it('valida forma て do caso manual おきます -> おきて', () => {
    const practice = useTeFormPractice([{
      id: 'manual-te-okimasu',
      verb: 'おきます',
      teForm: 'おきて',
      naiForm: 'おきない',
      translation: 'levantar-se',
      lesson: 'Lição 17',
    }]);

    practice.setTeFormInput('おきて');
    practice.submitAnswer();

    expect(practice.stats.value.correct).toBe(1);
    expect(practice.feedbackState.value).toBe('idle');
  });

  it('valida somente a forma ない quando apenas o campo de conjugação está ativo', () => {
    const practice = useTeFormPractice(singleNaiVerb);

    practice.setConjugationType('nai');
    practice.setTranslationEnabled(false);
    practice.setTeFormInput(' おぼえない ');
    practice.translationInput.value = 'errado';
    practice.submitAnswer();

    expect(practice.stats.value.correct).toBe(1);
    expect(practice.feedbackState.value).toBe('idle');
    expect(practice.teFormInput.value).toBe('');
  });

  it('valida forma ない grupo I do caso manual はらいます -> はらわない', () => {
    const practice = useTeFormPractice([{
      id: 'manual-nai-haraimasu',
      verb: 'はらいます',
      teForm: 'はらって',
      naiForm: 'はらわない',
      translation: 'pagar',
      lesson: 'Lição 17',
    }]);

    practice.setConjugationType('nai');
    practice.setTeFormInput('はらわない');
    practice.submitAnswer();

    expect(practice.stats.value.correct).toBe(1);
    expect(practice.feedbackState.value).toBe('idle');
  });

  it('valida forma ない grupo III com します do caso manual しんぱいします -> しんぱいしない', () => {
    const practice = useTeFormPractice([{
      id: 'manual-nai-shinpai',
      verb: 'しんぱいします',
      teForm: 'しんぱいして',
      naiForm: 'しんぱいしない',
      translation: 'preocupar-se',
      lesson: 'Lição 17',
    }]);

    practice.setConjugationType('nai');
    practice.setTeFormInput('しんぱいしない');
    practice.submitAnswer();

    expect(practice.stats.value.correct).toBe(1);
    expect(practice.feedbackState.value).toBe('idle');
  });

  it('valida forma ない com きます do caso manual もってきます -> もってこない', () => {
    const practice = useTeFormPractice([{
      id: 'manual-nai-mottekimasu',
      verb: 'もってきます',
      teForm: 'もってきて',
      naiForm: 'もってこない',
      translation: 'trazer alguma coisa',
      lesson: 'Lição 17',
    }]);

    practice.setConjugationType('nai');
    practice.setTeFormInput('もってこない');
    practice.submitAnswer();

    expect(practice.stats.value.correct).toBe(1);
    expect(practice.feedbackState.value).toBe('idle');
  });

  it('marca incorreta a forma ない parcialmente errada', () => {
    const practice = useTeFormPractice([{
      id: 'test-4',
      verb: 'はらいます',
      teForm: 'はらって',
      naiForm: 'はらわない',
      translation: 'pagar',
      lesson: 'Lição 17',
    }]);

    practice.setConjugationType('nai');
    practice.setTeFormInput('はらあない');
    practice.submitAnswer();

    expect(practice.stats.value.wrong).toBe(1);
    expect(practice.feedback.value).toContain('Forma ない correta: はらわない');
    expect(practice.feedback.value).toContain('Tradução correta: pagar');
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

  it('valida forma ない e tradução quando os dois campos estão ativos', () => {
    const practice = useTeFormPractice(singleNaiVerb);

    practice.setConjugationType('nai');
    practice.setTranslationEnabled(true);
    practice.setTeFormInput('おぼえない');
    practice.translationInput.value = 'memorizar';
    practice.submitAnswer();

    expect(practice.stats.value.correct).toBe(1);
    expect(practice.feedbackState.value).toBe('idle');
    expect(practice.teFormInput.value).toBe('');
    expect(practice.translationInput.value).toBe('');
  });

  it('ao inverter, valida a tradução como prompt e a resposta como verbo base', () => {
    const practice = useTeFormPractice(singleVerb);

    practice.setInvertedEnabled(true);

    expect(practice.invertedEnabled.value).toBe(true);
    expect(practice.teFormEnabled.value).toBe(false);
    expect(practice.translationEnabled.value).toBe(true);

    practice.setBaseVerbInput('tabete');
    practice.submitAnswer();

    expect(practice.stats.value.wrong).toBe(1);
    expect(practice.feedback.value).toContain('Verbo correto: たべます');

    practice.setBaseVerbInput('tabemasu');
    expect(practice.translationInput.value).toBe('たべます');
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

  it('inclui Lição 17 nas opções e filtra prática e lista completa com os dados reais', () => {
    const practice = useTeFormPractice(teFormVerbData);

    expect(practice.lessonOptions.value).toEqual(expect.arrayContaining([
      { value: 'Lição 17', label: 'Lição 17' },
    ]));

    practice.setPracticeLessonFilter('Lição 17');
    expect(practice.currentVerb.value.lesson).toBe('Lição 17');

    practice.setVerbListLessonFilter('Lição 17');
    expect(practice.filteredVerbList.value).toHaveLength(14);
    expect(practice.filteredVerbList.value.every(item => item.lesson === 'Lição 17')).toBe(true);
  });

  it('exibe forma て ou forma ない na lista completa conforme o tipo de prática', () => {
    const practice = useTeFormPractice([
      {
        id: 'test-3',
        verb: 'おぼえます',
        teForm: 'おぼえて',
        naiForm: 'おぼえない',
        translation: 'memorizar',
        lesson: 'Lição 17',
      },
      {
        id: 'test-4',
        verb: 'たべます',
        teForm: 'たべて',
        naiForm: '',
        translation: 'comer',
        lesson: 'Lição 14',
      },
    ]);

    expect(practice.getDisplayConjugation(practice.verbList.value[0])).toBe('おぼえて');

    practice.setConjugationType('nai');

    expect(practice.getDisplayConjugation(practice.verbList.value[0])).toBe('おぼえない');
    expect(practice.getDisplayConjugation(practice.verbList.value[1])).toBe('たべて');
  });
});
