import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import QuizPanel from './QuizPanel.vue';

function createProps(direction = 1) {
  return {
    cardPosition: '1 / 110',
    sourceLabel: 'Lição 1 - p. 1',
    currentKanji: '日',
    quizOptions: ['sol', 'lua', 'água', 'fogo'],
    quizAnswered: false,
    quizFeedback: '',
    selectedOption: '',
    correctMeaning: 'sol',
    shuffleEnabled: false,
    transitionDirection: direction,
  };
}

function mountPanel(direction) {
  return mount(QuizPanel, {
    props: createProps(direction),
    global: {
      stubs: {
        Transition: true,
      },
    },
  });
}

describe('QuizPanel transition', () => {
  it('usa animação down quando transitionDirection é positivo', () => {
    const wrapper = mountPanel(1);

    const transition = wrapper.find('transition-stub');
    expect(transition.exists()).toBe(true);
    expect(transition.attributes('name')).toBe('card-roulette-down');
  });

  it('usa animação up quando transitionDirection é negativo', () => {
    const wrapper = mountPanel(-1);

    const transition = wrapper.find('transition-stub');
    expect(transition.exists()).toBe(true);
    expect(transition.attributes('name')).toBe('card-roulette-up');
  });
});
