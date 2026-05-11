import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import TeFormPracticeView from './TeFormPracticeView.vue';

function mountView() {
  return mount(TeFormPracticeView, {
    attachTo: document.body,
  });
}

async function selectPracticeType(wrapper, label) {
  await wrapper.get('button[aria-label="Tipo de prática"]').trigger('click');
  const option = wrapper.findAll('[role="option"]').find(item => item.text() === label);
  expect(option).toBeTruthy();
  await option.trigger('click');
}

async function selectPracticeLesson(wrapper, label) {
  await wrapper.get('button[aria-label="Filtrar prática por lição"]').trigger('click');
  const option = wrapper.findAll('[role="option"]').find(item => item.text() === label);
  expect(option).toBeTruthy();
  await option.trigger('click');
}

function getMetricValues(wrapper) {
  return wrapper.findAllComponents({ name: 'SessionMetrics' })[0]
    .findAll('strong')
    .map(item => item.text());
}

describe('TeFormPracticeView', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renderiza controles principais dentro do card da prática', () => {
    const wrapper = mountView();

    expect(wrapper.get('button[aria-label="Tipo de prática"]').text()).toContain('Forma て');
    expect(wrapper.get('button[aria-label="Filtrar prática por lição"]').text()).toContain('Todas as lições');
    expect(wrapper.text()).toContain('Responder forma て');
    expect(wrapper.text()).toContain('Responder tradução');
    expect(wrapper.text()).toContain('Inverter tradução');
    expect(wrapper.get('input[placeholder="Digite a forma て"]').exists()).toBe(true);

    wrapper.unmount();
  });

  it('alterna para forma ない e atualiza textos, lista, regras e usos', async () => {
    const wrapper = mountView();

    await selectPracticeType(wrapper, 'Forma ない');

    expect(wrapper.text()).toContain('Responder forma ない');
    expect(wrapper.text()).toContain('Forma ない');
    expect(wrapper.get('input[placeholder="Digite a forma ない"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Regras da forma ない');
    expect(wrapper.text()).toContain('Usos da forma ない');
    expect(wrapper.text()).toContain('つけます -> つけない -> acender, ligar');
    expect(wrapper.text()).not.toContain('つけます -> つけて -> acender, ligar');

    wrapper.unmount();
  });

  it('filtra a prática para Lição 17 e valida uma resposta correta de forma ない', async () => {
    const wrapper = mountView();

    await selectPracticeType(wrapper, 'Forma ない');
    await selectPracticeLesson(wrapper, 'Lição 17');

    expect(wrapper.text()).toContain('おぼえます');

    const conjugationInput = wrapper.get('input[placeholder="Digite a forma ない"]');
    await conjugationInput.setValue('おぼえない');
    Math.random.mockReturnValue(0.5);
    await wrapper.getComponent({ name: 'CheckAnswerButton' }).trigger('click');

    expect(getMetricValues(wrapper).slice(0, 2)).toEqual(['1', '1']);
    expect(wrapper.text()).not.toContain('Ainda não.');

    wrapper.unmount();
  });

  it('mostra feedback incorreto com a forma ない esperada', async () => {
    const wrapper = mountView();

    await selectPracticeType(wrapper, 'Forma ない');
    await selectPracticeLesson(wrapper, 'Lição 17');

    const conjugationInput = wrapper.get('input[placeholder="Digite a forma ない"]');
    await conjugationInput.setValue('おぼえ');
    await wrapper.getComponent({ name: 'CheckAnswerButton' }).trigger('click');

    expect(getMetricValues(wrapper).slice(0, 3)).toEqual(['1', '0', '0%']);
    expect(wrapper.text()).toContain('Forma ない correta: おぼえない');
    expect(wrapper.text()).toContain('Tradução correta: memorizar');

    wrapper.unmount();
  });

  it('mantém o fluxo de tradução e inversão funcionando', async () => {
    const wrapper = mountView();

    const toggles = wrapper.findAll('input[type="checkbox"]');
    await toggles[0].setValue(false);
    await toggles[1].setValue(true);

    const translationInput = wrapper.get('input[placeholder="Digite a tradução"]');
    await translationInput.setValue('tradução errada');
    await wrapper.getComponent({ name: 'CheckAnswerButton' }).trigger('click');

    expect(getMetricValues(wrapper).slice(0, 2)).toEqual(['1', '0']);
    expect(wrapper.text()).toContain('Tradução correta: acender, ligar');

    await toggles[2].setValue(true);
    expect(wrapper.get('input[placeholder="Digite o verbo base em japonês"]').exists()).toBe(true);

    const baseVerbInput = wrapper.get('input[placeholder="Digite o verbo base em japonês"]');
    await baseVerbInput.setValue('tsukemasu');
    Math.random.mockReturnValue(0.5);
    await wrapper.getComponent({ name: 'CheckAnswerButton' }).trigger('click');

    expect(getMetricValues(wrapper).slice(0, 2)).toEqual(['2', '1']);

    wrapper.unmount();
  });

  it('recolhe e expande regras e usos', async () => {
    const wrapper = mountView();

    const rulesButton = wrapper.findAll('button').find(button => button.text().includes('Regras da forma'));
    const usesButton = wrapper.findAll('button').find(button => button.text().includes('Usos da forma'));

    expect(wrapper.text()).toContain('Antes de conjugar');
    expect(wrapper.text()).toContain('Pedido, instrução ou recomendação');

    await rulesButton.trigger('click');
    expect(wrapper.text()).not.toContain('Antes de conjugar');

    await rulesButton.trigger('click');
    expect(wrapper.text()).toContain('Antes de conjugar');

    await usesButton.trigger('click');
    expect(wrapper.text()).not.toContain('Pedido, instrução ou recomendação');

    await usesButton.trigger('click');
    expect(wrapper.text()).toContain('Pedido, instrução ou recomendação');

    wrapper.unmount();
  });
});
