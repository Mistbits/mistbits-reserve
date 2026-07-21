import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const htmlPath = resolve(root, 'index.html');
const html = await readFile(htmlPath, 'utf8');
const css = await readFile(resolve(root, 'styles.css'), 'utf8');
const script = await readFile(resolve(root, 'script.js'), 'utf8');
const errors = [];

for (const required of ['<main', '<h1', '<title>', 'meta name="description"', 'data-pilot-dialog']) {
  if (!html.includes(required)) errors.push(`index.html is missing ${required}`);
}

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicates.length) errors.push(`Duplicate ids: ${[...new Set(duplicates)].join(', ')}`);

const localReferences = [...html.matchAll(/(?:src|href)="((?:assets|styles\.css|script\.js)[^"]*)"/g)]
  .map((match) => match[1])
  .filter((reference) => !reference.includes('#'));

for (const reference of localReferences) {
  try {
    const file = await stat(resolve(root, reference));
    if (!file.isFile()) errors.push(`${reference} is not a file`);
  } catch {
    errors.push(`Missing referenced file: ${reference}`);
  }
}

if (!css.includes('@media (max-width: 520px)')) errors.push('Small-screen styles are missing');
if (!css.includes('prefers-reduced-motion')) errors.push('Reduced-motion styles are missing');
if (!script.includes('showModal()')) errors.push('Dialog interactions are missing');
if (!script.includes('IntersectionObserver')) errors.push('Scroll reveal interaction is missing');

if (errors.length) {
  console.error(`Validation failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

console.log(`Mistbits Reserve checks passed (${localReferences.length} local references, ${ids.length} unique ids).`);
