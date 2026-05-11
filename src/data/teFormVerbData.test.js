import { describe, expect, it } from 'vitest';
import {
  mergeNaiForms,
  parseNaiFormVerbList,
  parseTeFormVerbList,
  teFormVerbData,
} from './teFormVerbData';

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
        naiForm: '',
        translation: 'comer',
        lesson: 'Sem lição',
      },
      {
        id: 'te-form-4',
        verb: 'みます',
        teForm: 'みて',
        naiForm: '',
        translation: 'ver',
        lesson: 'Sem lição',
      },
    ]);
  });

  it('ignora linhas fora do formato verbo -> forma て -> tradução', () => {
    const parsed = parseTeFormVerbList(`
## Lição 17
おぼえます -> おぼえて -> おぼえない -> memorizar
`);

    expect(parsed).toEqual([]);
  });

  it('transforma linhas verbo -> forma ない em objetos', () => {
    const parsed = parseNaiFormVerbList(`
## Lição 17
おぼえます -> おぼえない
linha invalida
`);

    expect(parsed).toEqual([
      {
        verb: 'おぼえます',
        naiForm: 'おぼえない',
        lesson: 'Lição 17',
      },
    ]);
  });

  it('mescla forma ない por lição e verbo base', () => {
    const parsed = parseTeFormVerbList(`
## Lição 17
おぼえます -> おぼえて -> memorizar
`);
    const naiForms = parseNaiFormVerbList(`
## Lição 17
おぼえます -> おぼえない
`);

    expect(mergeNaiForms(parsed, naiForms)).toEqual([
      {
        id: 'te-form-2',
        verb: 'おぼえます',
        teForm: 'おぼえて',
        naiForm: 'おぼえない',
        translation: 'memorizar',
        lesson: 'Lição 17',
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
        naiForm: '',
        translation: 'abrir',
        lesson: 'Lição 14',
      },
      {
        id: 'te-form-5',
        verb: 'おきます',
        teForm: 'おいて',
        naiForm: '',
        translation: 'colocar',
        lesson: 'Lição 15',
      },
    ]);
  });

  it('carrega somente entradas completas de LISTA_VERBOS.md', () => {
    expect(teFormVerbData.length).toBeGreaterThan(0);
    expect(teFormVerbData.every(item => item.verb && item.teForm && item.translation && item.lesson)).toBe(true);
    expect(teFormVerbData.every(item => item.naiForm)).toBe(true);
    expect(teFormVerbData[0]).toMatchObject({
      verb: 'つけます',
      teForm: 'つけて',
      naiForm: 'つけない',
      translation: 'acender, ligar',
      lesson: 'Lição 14',
    });
  });

  it('carrega formas ない das lições 14, 15 e 16', () => {
    expect(teFormVerbData).toEqual(expect.arrayContaining([
      expect.objectContaining({
        verb: 'てつだいます',
        naiForm: 'てつだわない',
        lesson: 'Lição 14',
      }),
      expect.objectContaining({
        verb: 'おきます',
        teForm: 'おいて',
        naiForm: 'おかない',
        translation: 'colocar, pôr',
        lesson: 'Lição 15',
      }),
      expect.objectContaining({
        verb: 'けんがくします',
        naiForm: 'けんがくしない',
        lesson: 'Lição 16',
      }),
    ]));
  });

  it('carrega os verbos da lição 17 com forma ない cadastrada', () => {
    const lesson17Verbs = teFormVerbData.filter(item => item.lesson === 'Lição 17');

    expect(lesson17Verbs).toHaveLength(14);
    expect(lesson17Verbs.every(item => item.naiForm)).toBe(true);
    expect(lesson17Verbs).toEqual(expect.arrayContaining([
      expect.objectContaining({
        verb: 'なくします',
        teForm: 'なくして',
        naiForm: 'なくさない',
        translation: 'perder',
      }),
      expect.objectContaining({
        verb: 'はらいます',
        teForm: 'はらって',
        naiForm: 'はらわない',
        translation: 'pagar',
      }),
      expect.objectContaining({
        verb: 'もってきます',
        teForm: 'もってきて',
        naiForm: 'もってこない',
        translation: 'trazer alguma coisa',
      }),
    ]));
  });
});
