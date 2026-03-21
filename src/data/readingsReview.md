# Revisão de Leituras Kun/On

## Fonte e método
- Fonte principal: `NIHONGO CHALLENGE KANJI N4-5.pdf`.
- OCR aplicado com `ocrmypdf` + `tesseract (jpn+eng)` como apoio de consulta.
- Revisão manual consolidada para todos os 110 kanjis.

## Status geral
- Estrutura de dados (`kunReadingData.js` e `onReadingData.js`): concluída.
- Preenchimento de leituras (`kun` e `on`) para IDs 1-110: concluído.
- Revisão manual aprofundada de todos os itens: concluída.
- Testes automáticos de integridade dos dados: concluído.

## Status da revisão por lição
- Lição 1 (IDs 1-10): concluída.
- Lição 2 (IDs 11-20): concluída.
- Lição 3 (IDs 21-30): concluída.
- Lição 4 (IDs 31-40): concluída.
- Lição 5 (IDs 41-50): concluída.
- Lição 6 (IDs 51-60): concluída.
- Lição 7 (IDs 61-70): concluída.
- Lição 8 (IDs 71-80): concluída.
- Lição 9 (IDs 81-90): concluída.
- Lição 10 (IDs 91-100): concluída.
- Lição 11 (IDs 101-110): concluída.

## Critério aplicado
- `kunReadingData.js`: kun'yomi em hiragana (okurigana com hífen quando aplicável).
- `onReadingData.js`: on'yomi em katakana, variantes separadas por `・`.
- `kanjiData.js`: mantém compatibilidade via `reading = kunReading` temporariamente.
