import {bcv_parser} from 'bible-passage-reference-parser/js/en_bcv_parser';

function replaceSubstring(str: string, rep: string, start: number,
  end: number) {
  return str.substring(0, start) + rep + str.substring(end);
}
/**
 * @param {string} text Possible bible reference.
 * @param {string} osis Bible reference in osis format.
 * @return {string} html reference for th text specified.
 */
function getReplacement(text: string, osis: string) {
  const verses = osis.split('-');
  // Transform Exodus 34:6-Exodus 34:7 to Exodus 34:6-7
  if (verses.length > 1) {
    const verseIndex = verses[verses.length -1].lastIndexOf('.');
    if (verseIndex !== -1) {
      osis = verses[0] + '-' + verses[verses.length -1].substring(verseIndex + 1);
    }
  }
  const href = `https://www.bible.com/bible/1/${osis}.kjv`;
  return `<a class="bible" href="${href}" title="${osis}">${text}</a>`;
}

/**
 * @example
 * @param {content} content Text to parse
 * @param {string} original Potential bible verse.
 * @param {string=} context Optional contextual text for a verse.
 * @return {string} HTML text with link to all bible verses.
 */
function updateContent(content: string, original: string, context='') {
  let osises = (new bcv_parser).parse(original).osis().split(',');
  if (context && !osises.join().trim()) {
    osises = (new bcv_parser).parse_with_context(original, context).osis().split(',');
  }
  const parts = original.split(';');
  if (parts.length === osises.length) {
    for (let index = 0; index < osises.length; index++) {
      if (osises[index]) {
        content = content.replace(parts[index], getReplacement(parts[index], osises[index]));
      }
    }
  }
  else if (parts.length > 1) {
    for (const part of parts) {
      content = updateContent(content, part, parts[0]);
    }
  }
  else if (parts.length === 1) {
    const transformParts = parts.join().split(',').map((item, idx) => {
      if (idx > 0) {
        item = ',' + item
      } 
      return item;
    });
    for (const part of transformParts){
      content = updateContent(content, part, parts[0]);
    }
  }
  return content;
}

/**
 * @param {string} content Text to parse.
 * @return {string} HTML text with link to all bible verses.
 */
export function highlightReferences(content: string) {
  const parse = (new bcv_parser).parse(content);
  for (let index = parse.entities.length - 1; index >= 0; index--) {
    const entity = parse.entities[index];
    const indices: number[] = entity.absolute_indices;
    const [start, end] = indices;
    const original = content.substring(start, end);
    if (entity.type === 'b' || entity.type === 'bc') {
      continue;
    }
    const replacement = updateContent(original, original);
    content = replaceSubstring(content, replacement, start, end);
  }
  return content;
}
