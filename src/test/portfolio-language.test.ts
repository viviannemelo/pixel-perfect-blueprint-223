import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';

const sandbox = { window: {} as { PortfolioLanguage?: { normalize: (value: string) => string; text: (value: string, language: string) => string; post: (value: { link: string; title: string; excerpt: string }, language: string) => { title: string } } } };
runInNewContext(readFileSync('public/portfolio/js/i18n.js', 'utf8'), sandbox);
const language = sandbox.window.PortfolioLanguage;
if (!language) throw new Error('Missing shared language module');

describe('portfolio language selection', () => {
  it('accepts Portuguese as a shared site language', () => {
    expect(language.normalize('pt')).toBe('pt');
    expect(language.text('Projects', 'pt')).toBe('Projetos');
  });
  it('restores English content when English is selected', () => {
    expect(language.normalize('en')).toBe('en');
    expect(language.text('Projects', 'en')).toBe('Projects');
  });
  it('localizes known Medium articles without changing their destination', () => {
    const article = { link: 'https://medium.com/@viviannemelo/how-regression-testing-became-an-ai-skill-1793572c044c', title: 'Original', excerpt: 'Original' };
    expect(language.post(article, 'pt').title).toBe('Como os testes de regressão se tornaram uma skill de IA');
  });
});