import { describe, expect, it } from 'vitest';
import { kanjiData } from './kanjiData';
import { kunReadingData } from './kunReadingData';
import { onReadingData } from './onReadingData';

const MAX_ID = 110;
const ids = Array.from({ length: MAX_ID }, (_, index) => index + 1);

const KUN_ALLOWED = /^[ぁ-んー・\/\-]+$/;
const ON_ALLOWED = /^[ァ-ヶー・\/]+$/;

describe('readings data integrity', () => {
  it('kunReadingData e onReadingData cobrem IDs de 1 a 110', () => {
    const kunKeys = Object.keys(kunReadingData).map(Number).sort((a, b) => a - b);
    const onKeys = Object.keys(onReadingData).map(Number).sort((a, b) => a - b);

    expect(kunKeys).toEqual(ids);
    expect(onKeys).toEqual(ids);
  });

  it('kunReadingData usa charset esperado de hiragana/okurigana', () => {
    for (const id of ids) {
      const value = kunReadingData[id];
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
      expect(KUN_ALLOWED.test(value)).toBe(true);
    }
  });

  it('onReadingData usa charset esperado de katakana', () => {
    for (const id of ids) {
      const value = onReadingData[id];
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
      expect(ON_ALLOWED.test(value)).toBe(true);
    }
  });

  it('kanjiData mapeia reading para kunReading e inclui onReading', () => {
    expect(kanjiData).toHaveLength(MAX_ID);

    for (const item of kanjiData) {
      expect(item.kunReading).toBe(kunReadingData[item.id]);
      expect(item.onReading).toBe(onReadingData[item.id]);
      expect(item.reading).toBe(item.kunReading);
    }
  });

  it('mantém casos críticos esperados do material', () => {
    const byId = new Map(kanjiData.map(item => [item.id, item]));

    expect(byId.get(45)?.kanji).toBe('学');
    expect(byId.get(45)?.kunReading).toBe('まな-ぶ');
    expect(byId.get(45)?.onReading).toBe('ガク・ガッ');

    expect(byId.get(11)?.kunReading).toBe('ひと-つ');
    expect(byId.get(20)?.kunReading).toBe('とお');
    expect(byId.get(21)?.onReading).toBe('ヒャク');
  });
});
