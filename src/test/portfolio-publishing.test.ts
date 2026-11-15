import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
import { localizeMedia } from '../../scripts/export-portfolio.mjs';

const profile = runInNewContext(`${readFileSync('public/portfolio/js/data.js', 'utf8')}; ({ SITE, PROJECTS })`);

describe('portfolio publishing rules', () => {
  it('uses the supplied email', () => {
    expect(profile.SITE.email).toBe('viviannemmelo@gmail.com');
  });
  it('uses the supplied LinkedIn profile', () => {
    expect(profile.SITE.linkedin).toBe('https://linkedin.com/in/viviannemelo');
  });
  it('exports media to relative paths usable on GitHub Pages', () => {
    expect(localizeMedia('<img src="/__l5e/assets-v1/example/cover.jpg">', [{ url: '/__l5e/assets-v1/example/cover.jpg', original_filename: 'cover.jpg' }])).toBe('<img src="media/cover.jpg">');
  });
  it('includes the eight published projects with real page destinations', () => {
    expect(profile.PROJECTS.map((project: { link: string }) => project.link)).toEqual(['support-bot.html', 'feature-validator.html', 'test-generator.html', 'pre-release-smoketest.html', 'customer-articles.html', 'knowledge-base.html', 'qa-metrics.html', 'accessibility-audit.html', 'e2e-triage.html', 'e2e-mr-review.html']);
  });
});