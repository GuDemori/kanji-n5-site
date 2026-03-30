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
});
