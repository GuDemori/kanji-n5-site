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
        lesson: 'Sem lição',
      },
      {
        id: 'te-form-4',
        verb: 'みます',
        teForm: 'みて',
        translation: 'ver',
        lesson: 'Sem lição',
      },
    ]);
  });

  it('associa cada verbo à lição atual do markdown', () => {
    const parsed = parseTeFormVerbList(`
## Lição 14
あけます -> あけて -> abrir

## Lição 15
おきます -> おいて -> colocar
`);

    expect(parsed).toEqual([
      {
        id: 'te-form-2',
        verb: 'あけます',
        teForm: 'あけて',
        translation: 'abrir',
        lesson: 'Lição 14',
      },
      {
        id: 'te-form-5',
        verb: 'おきます',
        teForm: 'おいて',
        translation: 'colocar',
        lesson: 'Lição 15',
      },
    ]);
  });

  it('carrega somente entradas completas de LISTA_VERBOS.md', () => {
    expect(teFormVerbData.length).toBeGreaterThan(0);
    expect(teFormVerbData.every(item => item.verb && item.teForm && item.translation && item.lesson)).toBe(true);
    expect(teFormVerbData[0]).toMatchObject({
      verb: 'つけます',
      teForm: 'つけて',
      translation: 'acender, ligar',
      lesson: 'Lição 14',
    });
  });
});
