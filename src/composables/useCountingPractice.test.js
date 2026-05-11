import { describe, expect, it } from 'vitest';
import { useCountingPractice } from './useCountingPractice';

const interrogativeByType = {
  general: 'いくつ',
  people: 'なんにん',
  mai: 'なんまい',
  dai: 'なんだい',
  kai: 'なんかい',
};

describe('useCountingPractice', () => {
  it('converte romaji para hiragana e valida resposta correta', () => {
    const practice = useCountingPractice();
    practice.onShuffleChange(false);
    practice.onTypeChange('general');
    practice.onSequentialChange(true);

    expect(practice.currentPrompt.value.counterLabel).toBe('一つ');

    practice.setInput('hitotsu');
    expect(practice.answerInput.value).toBe('ひとつ');

    practice.submitAnswer();

    expect(practice.stats.value.correct).toBe(1);
    expect(practice.stats.value.streak).toBe(1);
    expect(practice.feedback.value).toContain('ひとつ');
    expect(practice.answerInput.value).toBe('');
  });

  it('registra erro, exige resposta e mantém o prompt atual', () => {
    const practice = useCountingPractice();
    practice.onShuffleChange(false);
    practice.onTypeChange('people');
    practice.onSequentialChange(true);

    expect(practice.currentPrompt.value.counterLabel).toBe('一人');

    practice.submitAnswer();
    expect(practice.stats.value.attempts).toBe(0);
    expect(practice.feedback.value).toContain('Digite a leitura');

    practice.setInput('さんにん');
    practice.submitAnswer();

    expect(practice.stats.value.attempts).toBe(1);
    expect(practice.stats.value.wrong).toBe(1);
    expect(practice.stats.value.streak).toBe(0);
    expect(practice.feedback.value).toContain('ひとり');
    expect(practice.currentPrompt.value.counterLabel).toBe('一人');
  });

  it('aceita variantes cadastradas de leitura', () => {
    const practice = useCountingPractice();
    practice.onShuffleChange(false);
    practice.onTypeChange('people');
    practice.onSequentialChange(true);

    practice.nextPrompt();
    practice.nextPrompt();
    practice.nextPrompt();

    expect(practice.currentPrompt.value.counterLabel).toBe('四人');

    practice.setInput('よんにん');
    practice.submitAnswer();

    expect(practice.stats.value.correct).toBe(1);
  });

  it('inclui forma interrogativa na sequência ordenada para todos os tipos', () => {
    const practice = useCountingPractice();
    practice.onShuffleChange(false);

    for (const [type, expectedQuestion] of Object.entries(interrogativeByType)) {
      practice.onTypeChange(type);
      practice.onSequentialChange(true);

      let foundQuestion = false;

      for (let i = 0; i < 15; i += 1) {
        const prompt = practice.currentPrompt.value;

        if (prompt.number === '?') {
          foundQuestion = true;
          expect(prompt.expectedVariants).toContain(expectedQuestion);
          break;
        }

        practice.nextPrompt();
      }

      expect(foundQuestion).toBe(true);
    }
  });

  it('ao trocar tipo com sequência ativa, reinicia no número 1 do novo tipo', () => {
    const practice = useCountingPractice();
    practice.onShuffleChange(false);
    practice.onSequentialChange(true);

    practice.nextPrompt();
    practice.nextPrompt();
    practice.nextPrompt();

    expect(practice.currentPrompt.value.number).toBe(4);

    practice.onTypeChange('dai');

    expect(practice.currentPrompt.value.type).toBe('dai');
    expect(practice.currentPrompt.value.number).toBe(1);
    expect(practice.currentPrompt.value.counterLabel).toBe('一台');
  });

  it('filtra o glossário por tipo de contador', () => {
    const practice = useCountingPractice();

    expect(practice.glossaryRows.value).toHaveLength(55);

    practice.glossaryType.value = 'kai';

    expect(practice.glossaryRows.value).toHaveLength(11);
    expect(practice.glossaryRows.value.every(row => row.type === 'kai')).toBe(true);
    expect(practice.glossaryRows.value).toEqual(expect.arrayContaining([
      expect.objectContaining({
        expression: '一回',
        reading: 'いっかい',
      }),
      expect.objectContaining({
        expression: '十回',
        reading: 'じゅっかい / じっかい',
      }),
    ]));
  });
});
