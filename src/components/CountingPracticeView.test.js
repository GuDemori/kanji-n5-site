import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CountingPracticeView from './CountingPracticeView.vue';

function mountView() {
  return mount(CountingPracticeView, {
    attachTo: document.body,
  });
}

async function selectType(wrapper, label) {
  await wrapper.get('button[aria-label="Tipo de contagem"]').trigger('click');
  const option = wrapper.findAll('[role="option"]').find(item => item.text() === label);
  expect(option).toBeTruthy();
  await option.trigger('click');
}

async function selectGlossaryType(wrapper, label) {
  await wrapper.get('button[aria-label="Filtrar tipo no glossário"]').trigger('click');
  const option = wrapper.findAll('[role="option"]').find(item => item.text() === label);
  expect(option).toBeTruthy();
  await option.trigger('click');
}

function getMetricValues(wrapper) {
  return wrapper.findAllComponents({ name: 'SessionMetrics' })[0]
    .findAll('strong')
    .map(item => item.text());
}

describe('CountingPracticeView', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renderiza controles, prompt inicial e glossário completo', () => {
    const wrapper = mountView();

    expect(wrapper.text()).toContain('Prática de contagem em japonês');
    expect(wrapper.text()).toContain('Embaralhar tipos');
    expect(wrapper.text()).toContain('Números em ordem');
    expect(wrapper.get('button[aria-label="Tipo de contagem"]').text()).toContain('Objetos em geral');
    expect(wrapper.text()).toContain('一つ');
    expect(wrapper.text()).toContain('55 entradas');
    expect(wrapper.text()).toContain('何回');
    expect(wrapper.text()).toContain('なんかい');

    wrapper.unmount();
  });

  it('valida resposta correta em romaji e avança o prompt', async () => {
    const wrapper = mountView();

    const input = wrapper.get('input[placeholder="Digite em romaji ou hiragana"]');
    await input.setValue('hitotsu');
    await wrapper.getComponent({ name: 'CheckAnswerButton' }).trigger('click');

    expect(getMetricValues(wrapper).slice(0, 4)).toEqual(['1', '1', '100%', '1']);
    expect(wrapper.text()).toContain('Boa! Resposta correta: ひとつ.');
    expect(wrapper.get('input[placeholder="Digite em romaji ou hiragana"]').element.value).toBe('');

    wrapper.unmount();
  });

  it('mostra erro quando a resposta está vazia ou incorreta', async () => {
    const wrapper = mountView();

    await wrapper.getComponent({ name: 'CheckAnswerButton' }).trigger('click');

    expect(getMetricValues(wrapper)[0]).toBe('0');
    expect(wrapper.text()).toContain('Digite a leitura em hiragana.');

    const input = wrapper.get('input[placeholder="Digite em romaji ou hiragana"]');
    await input.setValue('futatsu');
    await wrapper.getComponent({ name: 'CheckAnswerButton' }).trigger('click');

    expect(getMetricValues(wrapper).slice(0, 4)).toEqual(['1', '0', '0%', '0']);
    expect(wrapper.text()).toContain('Ainda não. Forma esperada: ひとつ.');

    wrapper.unmount();
  });

  it('troca tipo, ativa sequência e reinicia no número 1 do novo contador', async () => {
    const wrapper = mountView();
    const toggles = wrapper.findAll('input[type="checkbox"]');

    await toggles[1].setValue(true);
    expect(wrapper.text()).toContain('一つ');

    await wrapper.get('button.action-ghost').trigger('click');
    expect(wrapper.text()).toContain('二つ');

    await selectType(wrapper, 'Máquinas e veículos (carro, bicicleta, computador) (～台)');

    expect(wrapper.text()).toContain('Máquinas e veículos');
    expect(wrapper.text()).toContain('一台');

    wrapper.unmount();
  });

  it('ativa embaralhar tipos e ainda permite responder o prompt sorteado', async () => {
    const wrapper = mountView();
    const toggles = wrapper.findAll('input[type="checkbox"]');

    await toggles[0].setValue(true);

    expect(wrapper.text()).toContain('Objetos em geral');
    expect(wrapper.text()).toContain('一つ');

    const input = wrapper.get('input[placeholder="Digite em romaji ou hiragana"]');
    await input.setValue('ひとつ');
    await wrapper.getComponent({ name: 'CheckAnswerButton' }).trigger('click');

    expect(getMetricValues(wrapper).slice(0, 2)).toEqual(['1', '1']);

    wrapper.unmount();
  });

  it('filtra o glossário pelo tipo selecionado', async () => {
    const wrapper = mountView();

    await selectGlossaryType(wrapper, 'Número de vezes / frequência (～回)');

    expect(wrapper.text()).toContain('11 entradas');
    expect(wrapper.text()).toContain('一回');
    expect(wrapper.text()).toContain('いっかい');
    expect(wrapper.text()).toContain('十回');
    expect(wrapper.text()).toContain('じゅっかい / じっかい');
    const glossaryText = wrapper.findAll('section').at(3).text();
    expect(glossaryText).not.toContain('一つ');

    wrapper.unmount();
  });
});
