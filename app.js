const STORAGE_KEY = 'kanji-n5-progress-v1';
const SESSION_KEY = 'kanji-n5-session-v1';

const sourceData = normalizeData(window.KANJI_DATA || []);
const initialSession = loadSession();

const state = {
  mode: initialSession.mode,
  shuffle: initialSession.shuffle,
  deck: [],
  currentIndex: 0,
  lastMoveDirection: 0,
  isAnimating: false,
  gridSearch: '',
  gridStatusFilter: 'all',
  sessionStats: createSessionStats(),
  progress: loadProgress(),
  quizAnswered: false,
};

const el = {
  shuffleToggle: document.getElementById('shuffleToggle'),
  totalCount: document.getElementById('totalCount'),
  knownCount: document.getElementById('knownCount'),
  unknownCount: document.getElementById('unknownCount'),
  sessionSummary: document.getElementById('sessionSummary'),
  sessionSummaryToolbar: document.getElementById('sessionSummaryToolbar'),
  helpToggleBtn: document.getElementById('helpToggleBtn'),
  helpTooltip: document.getElementById('helpTooltip'),
  cardPosition: document.getElementById('cardPosition'),
  cardSource: document.getElementById('cardSource'),
  kanjiCard: document.getElementById('kanjiCard'),
  hintBox: document.getElementById('hintBox'),
  answerBox: document.getElementById('answerBox'),
  hintBtn: document.getElementById('hintBtn'),
  answerBtn: document.getElementById('answerBtn'),
  knewBtn: document.getElementById('knewBtn'),
  didntKnowBtn: document.getElementById('didntKnowBtn'),
  prevBtn: document.getElementById('prevBtn'),
  nextBtn: document.getElementById('nextBtn'),
  flashcardView: document.getElementById('flashcardView'),
  quizView: document.getElementById('quizView'),
  quizPosition: document.getElementById('quizPosition'),
  quizSource: document.getElementById('quizSource'),
  quizKanji: document.getElementById('quizKanji'),
  quizOptions: document.getElementById('quizOptions'),
  quizFeedback: document.getElementById('quizFeedback'),
  quizHintBtn: document.getElementById('quizHintBtn'),
  quizNextBtn: document.getElementById('quizNextBtn'),
  kanjiGrid: document.getElementById('kanjiGrid'),
  resetProgressBtn: document.getElementById('resetProgressBtn'),
  gridSearch: document.getElementById('gridSearch'),
  gridStatusFilter: document.getElementById('gridStatusFilter'),
  gridResultsCount: document.getElementById('gridResultsCount'),
  sessionAttempts: document.getElementById('sessionAttempts'),
  sessionCorrect: document.getElementById('sessionCorrect'),
  sessionRate: document.getElementById('sessionRate'),
  sessionStreak: document.getElementById('sessionStreak'),
  sessionBestStreak: document.getElementById('sessionBestStreak'),
  modeButtons: Array.from(document.querySelectorAll('.mode-btn')),
};

init();

function init() {
  applySessionControls();
  syncModeButtons();
  switchMode();
  attachEvents();
  buildDeck({ preferredCardId: initialSession.currentCardId });
  renderStats();
  renderSessionStats();
}

function normalizeData(data) {
  const ids = new Set();

  return data
    .filter(item => {
      const hasRequiredFields = item
        && Number.isInteger(item.id)
        && typeof item.kanji === 'string'
        && typeof item.reading === 'string'
        && typeof item.meaning === 'string'
        && Number.isInteger(item.lesson)
        && Number.isInteger(item.page)
        && typeof item.hint === 'string';

      if (!hasRequiredFields || ids.has(item.id)) {
        return false;
      }

      ids.add(item.id);
      return true;
    })
    .map(item => ({
      ...item,
      hintText: htmlToText(item.hint),
    }));
}

function applySessionControls() {
  el.shuffleToggle.checked = state.shuffle;
}

function syncModeButtons() {
  el.modeButtons.forEach(button => {
    const active = button.dataset.mode === state.mode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function attachEvents() {
  el.shuffleToggle.addEventListener('change', () => {
    state.shuffle = el.shuffleToggle.checked;
    buildDeck();
  });

  el.hintBtn.addEventListener('click', showFlashcardHint);
  el.answerBtn.addEventListener('click', showFlashcardAnswer);
  el.knewBtn.addEventListener('click', () => markProgress('known'));
  el.didntKnowBtn.addEventListener('click', () => markProgress('unknown'));
  el.prevBtn.addEventListener('click', () => moveCard(-1));
  el.nextBtn.addEventListener('click', () => moveCard(1));
  el.quizHintBtn.addEventListener('click', showQuizHint);
  el.quizNextBtn.addEventListener('click', () => moveCard(1));

  el.resetProgressBtn.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    state.progress = { known: [], unknown: [] };
    renderStats();
    resetSessionStats();
    buildDeck();
  });

  el.gridSearch.addEventListener('input', () => {
    state.gridSearch = el.gridSearch.value;
    renderGrid();
  });
  el.gridStatusFilter.addEventListener('change', () => {
    state.gridStatusFilter = el.gridStatusFilter.value;
    renderGrid();
  });
  el.helpToggleBtn.addEventListener('click', () => {
    toggleHelpTooltip();
  });

  el.modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      state.mode = btn.dataset.mode;
      syncModeButtons();
      switchMode();
      renderCurrent();
      saveSession();
    });
  });

  document.addEventListener('keydown', handleKeyboardNavigation);
  document.addEventListener('click', handleOutsideHelpClick);
}

function handleKeyboardNavigation(event) {
  if (event.altKey || event.ctrlKey || event.metaKey) return;

  const targetTag = event.target && event.target.tagName;
  if (targetTag === 'INPUT' || targetTag === 'SELECT' || targetTag === 'TEXTAREA' || targetTag === 'BUTTON') {
    return;
  }

  if (event.key === 'Escape') {
    hideFeedbackPanels();
    hideHelpTooltip();
    return;
  }

  if (state.mode === 'quiz' && !state.quizAnswered && /^[1-4]$/.test(event.key)) {
    const optionIndex = Number(event.key) - 1;
    const options = Array.from(el.quizOptions.querySelectorAll('button'));
    if (options[optionIndex]) {
      options[optionIndex].click();
    }
    return;
  }

  if (state.mode === 'quiz' && state.quizAnswered && event.key === 'Enter') {
    moveCard(1);
    return;
  }

  if (event.key === 'ArrowLeft') {
    moveCard(-1);
  } else if (event.key === 'ArrowRight') {
    moveCard(1);
  }
}

function showFlashcardHint() {
  const current = getCurrent();
  if (!current) return;

  setTextBox(el.hintBox, current.hintText);
}

function showFlashcardAnswer() {
  const current = getCurrent();
  if (!current) return;

  const container = document.createElement('div');

  const title = document.createElement('strong');
  title.textContent = `${current.kanji} - ${current.meaning}`;

  const readingLine = document.createElement('p');
  readingLine.className = 'answer-line';
  readingLine.append('Leitura principal: ');
  readingLine.appendChild(createRuby(current.reading, 'furigana / leitura'));

  const sourceLine = document.createElement('p');
  sourceLine.className = 'answer-line';
  sourceLine.textContent = `Fonte no PDF: lição ${current.lesson}, página ${current.page}.`;

  container.append(title, readingLine, sourceLine);

  el.answerBox.replaceChildren(container);
  el.answerBox.classList.remove('hidden');
}

function showQuizHint() {
  const current = getCurrent();
  if (!current) return;

  setTextBox(el.quizFeedback, current.hintText);
}

function setTextBox(element, text) {
  element.textContent = text;
  element.classList.remove('hidden');
}

function buildDeck({ preferredCardId = null, transitionDirection = 0 } = {}) {
  const filtered = getDeckFilteredData();

  state.deck = state.shuffle ? shuffle([...filtered]) : [...filtered];
  state.currentIndex = getDeckStartIndex(state.deck, preferredCardId);
  state.quizAnswered = false;
  state.lastMoveDirection = transitionDirection;

  renderCurrent();
  renderGrid();
  saveSession();
}

function getDeckFilteredData() {
  return [...sourceData];
}

function getDeckStartIndex(deck, preferredCardId) {
  if (!deck.length) return 0;
  if (!preferredCardId) return 0;

  const preferredIndex = deck.findIndex(item => item.id === preferredCardId);
  return preferredIndex >= 0 ? preferredIndex : 0;
}

function renderCurrent() {
  const current = getCurrent();
  const transitionDirection = state.lastMoveDirection;
  renderSessionSummary();
  renderSessionStats();

  if (!current) {
    renderEmptyState();
    state.lastMoveDirection = 0;
    return;
  }

  renderFlashcard(current, transitionDirection);
  renderQuiz(current, transitionDirection);
  state.lastMoveDirection = 0;
}

function renderEmptyState() {
  el.totalCount.textContent = '0';
  el.cardPosition.textContent = '0 / 0';
  el.cardSource.textContent = 'Sem itens';
  el.kanjiCard.textContent = '-';
  el.quizPosition.textContent = '0 / 0';
  el.quizSource.textContent = 'Sem itens';
  el.quizKanji.textContent = '-';

  clearBox(el.hintBox);
  clearBox(el.answerBox);
  clearBox(el.quizFeedback);

  el.quizOptions.replaceChildren();
  el.quizNextBtn.disabled = true;
}

function renderSessionSummary() {
  const modeLabel = state.mode === 'quiz' ? 'Quiz' : 'Flashcards';
  const shuffleLabel = state.shuffle ? 'embaralhar: ligado' : 'embaralhar: desligado';
  const countLabel = `${state.deck.length} kanji no treino`;
  const text = `${modeLabel} | ${shuffleLabel} | ${countLabel}`;

  el.sessionSummary.textContent = text;
  el.sessionSummaryToolbar.textContent = text;
}

function renderFlashcard(current, transitionDirection) {
  el.totalCount.textContent = String(state.deck.length);
  el.cardPosition.textContent = `${state.currentIndex + 1} / ${state.deck.length}`;
  el.cardSource.textContent = `Lição ${current.lesson} - p. ${current.page}`;
  setKanjiCard(el.kanjiCard, current.kanji, transitionDirection, state.mode === 'flashcard');

  clearBox(el.hintBox);
  clearBox(el.answerBox);
}

function renderQuiz(current, transitionDirection) {
  state.quizAnswered = false;
  el.quizPosition.textContent = `${state.currentIndex + 1} / ${state.deck.length}`;
  el.quizSource.textContent = `Lição ${current.lesson} - p. ${current.page}`;
  setKanjiCard(el.quizKanji, current.kanji, transitionDirection, state.mode === 'quiz');

  clearBox(el.quizFeedback);
  el.quizOptions.replaceChildren();

  const distractors = shuffle(
    sourceData
      .filter(item => item.id !== current.id)
      .map(item => item.meaning)
  ).slice(0, 3);

  const options = shuffle([current.meaning, ...distractors]);
  options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'quiz-option';
    button.type = 'button';
    button.setAttribute('data-key', String(index + 1));
    button.setAttribute('aria-label', `Opção ${index + 1}: ${option}`);
    button.textContent = option;
    button.addEventListener('click', () => handleQuizAnswer(button, option, current.meaning));
    el.quizOptions.appendChild(button);
  });

  el.quizNextBtn.disabled = true;
}

function handleQuizAnswer(button, selected, correct) {
  if (state.quizAnswered) return;

  state.quizAnswered = true;

  const buttons = Array.from(el.quizOptions.querySelectorAll('button'));
  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correct) {
      btn.classList.add('correct');
    }
  });

  if (selected !== correct) {
    button.classList.add('wrong');
  }

  const current = getCurrent();
  if (!current) return;
  registerQuizAttempt(selected === correct);

  const message = selected === correct
    ? `Boa. ${current.kanji} = ${correct}. Leitura: ${current.reading}.`
    : `Quase. A resposta certa é ${correct}. Dica: ${current.hintText}`;

  setTextBox(el.quizFeedback, message);
  el.quizNextBtn.disabled = false;
}

function clearBox(element) {
  element.textContent = '';
  element.classList.add('hidden');
}

function hideFeedbackPanels() {
  clearBox(el.hintBox);
  clearBox(el.answerBox);
  clearBox(el.quizFeedback);
}

function toggleHelpTooltip() {
  const isHidden = el.helpTooltip.classList.contains('hidden');
  if (isHidden) {
    el.helpTooltip.classList.remove('hidden');
    el.helpToggleBtn.setAttribute('aria-expanded', 'true');
  } else {
    hideHelpTooltip();
  }
}

function hideHelpTooltip() {
  el.helpTooltip.classList.add('hidden');
  el.helpToggleBtn.setAttribute('aria-expanded', 'false');
}

function handleOutsideHelpClick(event) {
  if (el.helpTooltip.classList.contains('hidden')) return;
  const target = event.target;
  if (el.helpToggleBtn.contains(target) || el.helpTooltip.contains(target)) return;
  hideHelpTooltip();
}

function renderStats() {
  el.knownCount.textContent = String(state.progress.known.length);
  el.unknownCount.textContent = String(state.progress.unknown.length);
}

function renderGrid() {
  const filtered = getGridFilteredData();

  el.kanjiGrid.replaceChildren();
  el.gridResultsCount.textContent = `${filtered.length} resultado${filtered.length === 1 ? '' : 's'}`;

  if (!filtered.length) {
    const empty = document.createElement('article');
    empty.className = 'kanji-item empty';
    empty.textContent = 'Nenhum kanji encontrado com os filtros atuais.';
    el.kanjiGrid.appendChild(empty);
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('article');
    card.className = 'kanji-item';

    const title = document.createElement('div');
    title.className = 'big';
    title.textContent = item.kanji;

    const meaning = createLine('Significado:', item.meaning);

    const reading = document.createElement('p');
    reading.appendChild(createStrongLabel('Leitura:'));
    reading.append(' ');
    reading.appendChild(createRuby(item.reading, ''));

    const hint = createLine('Dica:', item.hintText);
    const source = createLine('Fonte:', `lição ${item.lesson}, p. ${item.page}`);
    const status = createLine('Status:', getProgressState(item.id));

    card.append(title, meaning, reading, hint, source, status);
    el.kanjiGrid.appendChild(card);
  });
}

function getGridFilteredData() {
  const query = normalizeSearchTerm(state.gridSearch);
  return getDeckFilteredData().filter(item => {
    if (!matchesGridStatus(item.id)) return false;
    if (!query) return true;

    const searchable = normalizeSearchTerm([
      item.kanji,
      item.meaning,
      item.reading,
      item.hintText,
    ].join(' '));

    return searchable.includes(query);
  });
}

function matchesGridStatus(id) {
  if (state.gridStatusFilter === 'all') return true;
  if (state.gridStatusFilter === 'known') return state.progress.known.includes(id);
  if (state.gridStatusFilter === 'unknown') return state.progress.unknown.includes(id);
  return !state.progress.known.includes(id) && !state.progress.unknown.includes(id);
}

function createLine(label, value) {
  const paragraph = document.createElement('p');
  paragraph.appendChild(createStrongLabel(label));
  paragraph.append(` ${value}`);
  return paragraph;
}

function createStrongLabel(text) {
  const strong = document.createElement('strong');
  strong.textContent = text;
  return strong;
}

function createRuby(reading, rtText) {
  const ruby = document.createElement('ruby');
  ruby.append(reading);

  if (rtText) {
    const rt = document.createElement('rt');
    rt.textContent = rtText;
    ruby.appendChild(rt);
  }

  return ruby;
}

function getProgressState(id) {
  if (state.progress.known.includes(id)) return 'Sabia';
  if (state.progress.unknown.includes(id)) return 'Não sabia';
  return 'Sem marcação';
}

function markProgress(type) {
  const current = getCurrent();
  if (!current) return;
  const nextCard = state.deck[(state.currentIndex + 1) % state.deck.length];

  const otherType = type === 'known' ? 'unknown' : 'known';

  state.progress[type] = unique([...state.progress[type], current.id]);
  state.progress[otherType] = state.progress[otherType].filter(id => id !== current.id);

  saveProgress();
  renderStats();
  buildDeck({ preferredCardId: nextCard ? nextCard.id : null, transitionDirection: 1 });
}

function moveCard(direction) {
  if (!state.deck.length || state.isAnimating) return;

  state.currentIndex += direction;
  if (state.currentIndex < 0) state.currentIndex = state.deck.length - 1;
  if (state.currentIndex >= state.deck.length) state.currentIndex = 0;
  state.lastMoveDirection = direction;

  renderCurrent();
  saveSession();
}

function getCurrent() {
  return state.deck[state.currentIndex];
}

function switchMode() {
  const flash = state.mode === 'flashcard';

  el.flashcardView.classList.toggle('hidden', !flash);
  el.flashcardView.classList.toggle('active-view', flash);
  el.quizView.classList.toggle('hidden', flash);
}

function createSessionStats() {
  return {
    attempts: 0,
    correct: 0,
    wrong: 0,
    streak: 0,
    bestStreak: 0,
  };
}

function resetSessionStats() {
  state.sessionStats = createSessionStats();
  renderSessionStats();
}

function registerQuizAttempt(correct) {
  state.sessionStats.attempts += 1;
  if (correct) {
    state.sessionStats.correct += 1;
    state.sessionStats.streak += 1;
    state.sessionStats.bestStreak = Math.max(state.sessionStats.bestStreak, state.sessionStats.streak);
  } else {
    state.sessionStats.wrong += 1;
    state.sessionStats.streak = 0;
  }

  renderSessionStats();
}

function renderSessionStats() {
  const { attempts, correct, streak } = state.sessionStats;
  const rate = attempts ? Math.round((correct / attempts) * 100) : 0;

  el.sessionAttempts.textContent = String(attempts);
  el.sessionCorrect.textContent = String(correct);
  el.sessionRate.textContent = `${rate}%`;
  el.sessionStreak.textContent = String(streak);
  el.sessionBestStreak.textContent = String(state.sessionStats.bestStreak);
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { known: [], unknown: [] };

    const parsed = JSON.parse(raw);
    return {
      known: Array.isArray(parsed.known) ? parsed.known : [],
      unknown: Array.isArray(parsed.unknown) ? parsed.unknown : [],
    };
  } catch {
    return { known: [], unknown: [] };
  }
}

function loadSession() {
  const fallback = {
    mode: 'flashcard',
    shuffle: true,
    currentCardId: null,
  };

  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw);
    return {
      mode: parsed.mode === 'quiz' ? 'quiz' : 'flashcard',
      shuffle: typeof parsed.shuffle === 'boolean' ? parsed.shuffle : true,
      currentCardId: Number.isInteger(parsed.currentCardId) ? parsed.currentCardId : null,
    };
  } catch {
    return fallback;
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
}

function saveSession() {
  const current = getCurrent();
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    mode: state.mode,
    shuffle: state.shuffle,
    currentCardId: current ? current.id : null,
  }));
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function unique(array) {
  return [...new Set(array)];
}

function normalizeSearchTerm(value) {
  return String(value || '')
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim();
}

function htmlToText(value) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(value, 'text/html');
  const text = doc.body.textContent || '';

  return text.replace(/\s+/g, ' ').trim();
}

function triggerCardAnimation(element) {
  element.classList.remove('card-enter');
  void element.offsetWidth;
  element.classList.add('card-enter');
}

function setKanjiCard(element, kanji, direction, allowStackAnimation) {
  const face = getKanjiFace(element);

  if (!allowStackAnimation || direction === 0 || prefersReducedMotion()) {
    face.textContent = kanji;
    triggerCardAnimation(face);
    return;
  }

  animateStackTransition(face, kanji, direction);
}

function animateStackTransition(element, nextKanji, direction) {
  state.isAnimating = true;

  element.classList.remove('stack-next', 'stack-prev', 'card-enter');
  void element.offsetWidth;

  const className = direction > 0 ? 'stack-next' : 'stack-prev';
  element.classList.add(className);

  const swapTimer = setTimeout(() => {
    element.textContent = nextKanji;
  }, 250);
  const safetyTimer = setTimeout(() => {
    cleanup();
  }, 560);

  const cleanup = () => {
    clearTimeout(swapTimer);
    clearTimeout(safetyTimer);
    element.classList.remove('stack-next', 'stack-prev');
    state.isAnimating = false;
    element.removeEventListener('animationend', cleanup);
  };

  element.addEventListener('animationend', cleanup, { once: true });
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getKanjiFace(element) {
  let face = element.querySelector('.kanji-face');
  if (!face) {
    const existingText = element.textContent;
    face = document.createElement('span');
    face.className = 'kanji-face';
    face.textContent = existingText;
    element.replaceChildren(face);
  }

  return face;
}
