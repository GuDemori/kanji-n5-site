import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import BaseSelect from './BaseSelect.vue';

const options = [
  { value: 'te', label: 'Forma て' },
  { value: 'nai', label: 'Forma ない' },
];

function mountSelect(props = {}) {
  return mount(BaseSelect, {
    props: {
      modelValue: 'te',
      label: 'Tipo de prática',
      options,
      ...props,
    },
    attachTo: document.body,
  });
}

describe('BaseSelect', () => {
  it('associa label real ao botão e expõe atributos acessíveis', () => {
    const wrapper = mountSelect();
    const label = wrapper.get('label');
    const button = wrapper.get('button');

    expect(label.text()).toBe('Tipo de prática');
    expect(label.attributes('for')).toBe(button.attributes('id'));
    expect(button.attributes('aria-label')).toBe('Tipo de prática');
    expect(button.attributes('aria-haspopup')).toBe('listbox');
    expect(button.attributes('aria-expanded')).toBe('false');

    wrapper.unmount();
  });

  it('abre a lista de opções e marca a opção selecionada', async () => {
    const wrapper = mountSelect();

    await wrapper.get('button').trigger('click');

    expect(wrapper.get('[role="listbox"]').exists()).toBe(true);
    expect(wrapper.get('button').attributes('aria-expanded')).toBe('true');
    expect(wrapper.get('[role="option"][aria-selected="true"]').text()).toBe('Forma て');

    wrapper.unmount();
  });

  it('emite update:modelValue e fecha ao selecionar uma opção', async () => {
    const wrapper = mountSelect();

    await wrapper.get('button').trigger('click');
    const optionButtons = wrapper.findAll('[role="option"]');
    await optionButtons[1].trigger('click');

    expect(wrapper.emitted('update:modelValue')).toEqual([['nai']]);
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false);

    wrapper.unmount();
  });

  it('fecha quando Escape é pressionado', async () => {
    const wrapper = mountSelect();

    await wrapper.get('button').trigger('click');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[role="listbox"]').exists()).toBe(false);

    wrapper.unmount();
  });

  it('fecha ao clicar fora do componente', async () => {
    const wrapper = mountSelect();

    await wrapper.get('button').trigger('click');
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[role="listbox"]').exists()).toBe(false);

    wrapper.unmount();
  });
});
