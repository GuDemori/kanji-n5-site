import rawVerbList from '../../LISTA_VERBOS.md?raw';
import rawNaiFormVerbList from '../../LISTA_VERBOS_NAI.md?raw';

export function parseTeFormVerbList(markdown) {
  let currentLesson = null;

  return String(markdown || '')
    .split('\n')
    .map((line, index) => {
      const cleaned = line.trim().replace(/\s{2,}$/g, '');

      const lessonMatch = cleaned.match(/^##\s+Lição\s+(.+)$/i);
      if (lessonMatch) {
        currentLesson = `Lição ${lessonMatch[1].trim()}`;
        return null;
      }

      if (!cleaned || cleaned.startsWith('#') || !cleaned.includes('->')) {
        return null;
      }

      const parts = cleaned.split('->').map(part => part.trim());
      if (parts.length !== 3 || parts.some(part => !part)) {
        return null;
      }

      const [verb, teForm, translation] = parts;
      return {
        id: `te-form-${index}`,
        verb,
        teForm,
        naiForm: '',
        translation,
        lesson: currentLesson || 'Sem lição',
      };
    })
    .filter(Boolean);
}

export function parseNaiFormVerbList(markdown) {
  let currentLesson = null;

  return String(markdown || '')
    .split('\n')
    .map(line => {
      const cleaned = line.trim().replace(/\s{2,}$/g, '');

      const lessonMatch = cleaned.match(/^##\s+Lição\s+(.+)$/i);
      if (lessonMatch) {
        currentLesson = `Lição ${lessonMatch[1].trim()}`;
        return null;
      }

      if (!cleaned || cleaned.startsWith('#') || !cleaned.includes('->')) {
        return null;
      }

      const parts = cleaned.split('->').map(part => part.trim());
      if (parts.length !== 2 || parts.some(part => !part)) {
        return null;
      }

      const [verb, naiForm] = parts;
      return {
        verb,
        naiForm,
        lesson: currentLesson || 'Sem lição',
      };
    })
    .filter(Boolean);
}

export function mergeNaiForms(verbs, naiForms) {
  const naiByLessonAndVerb = new Map(
    naiForms.map(item => [`${item.lesson}::${item.verb}`, item.naiForm]),
  );

  return verbs.map(item => ({
    ...item,
    naiForm: naiByLessonAndVerb.get(`${item.lesson}::${item.verb}`) || item.naiForm,
  }));
}

export const teFormVerbData = mergeNaiForms(
  parseTeFormVerbList(rawVerbList),
  parseNaiFormVerbList(rawNaiFormVerbList),
);
