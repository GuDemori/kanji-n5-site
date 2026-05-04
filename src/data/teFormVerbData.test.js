import { describe, expect, it } from 'vitest';
import { parseTeFormVerbList, teFormVerbData } from './teFormVerbData';

describe('teFormVerbData', () => {
  it('transforma linhas verbo -> forma て -> tradução em objetos', () => {
    const parsed = parseTeFormVerbList(`
# Titulo

たべます -> たべて -> comer
みます -> みて -> ver
linha invalida
`);

    expect(parsed).toEqual([
      {
        id: 'te-form-3',
        verb: 'たべます',
        teForm: 'たべて',
        translation: 'comer',
      },
      {
        id: 'te-form-4',
        verb: 'みます',
        teForm: 'みて',
        translation: 'ver',
      },
    ]);
  });

  it('carrega somente entradas completas de LISTA_VERBOS.md', () => {
    expect(teFormVerbData.length).toBeGreaterThan(0);
    expect(teFormVerbData.every(item => item.verb && item.teForm && item.translation)).toBe(true);
    expect(teFormVerbData[0]).toMatchObject({
      verb: 'つけます',
      teForm: 'つけて',
      translation: 'acender, ligar',
    });
  });
});
