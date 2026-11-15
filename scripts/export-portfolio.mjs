import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const run = promisify(execFile);
const assetOrigin = 'https://id-preview--35d7efd2-fa45-4cb0-9899-6121d416ebf0.lovable.app';

export function localizeMedia(source, assets) {
  for (const asset of assets) {
    source = source.replaceAll(asset.url, `media/${asset.original_filename}`);
  }
  return source;
}

export async function exportPortfolio(destination) {
  if (!destination) throw new Error('An export destination is required.');
  const output = path.resolve(destination);
  if (output === process.cwd() || output.startsWith(path.resolve('public') + path.sep)) {
    throw new Error('Export to a separate staging directory, not the source site.');
  }
  await mkdir(output, { recursive: true });
  await cp('public/portfolio', output, { recursive: true });
  const pointers = (await readdir('src/assets')).filter(name => name.endsWith('.asset.json'));
  const assets = await Promise.all(pointers.map(async name => JSON.parse(await readFile(`src/assets/${name}`, 'utf8'))));
  // Export the actual media into the Pages artifact, not into the repository.
  for (const asset of assets) {
    const destinationFile = path.join(output, 'media', path.basename(asset.original_filename));
    const url = new URL(asset.url, assetOrigin);
    await run('curl', ['--fail', '--location', '--retry', '3', '--silent', '--show-error', url.href, '--output', destinationFile]);
    console.log(`Exported ${asset.original_filename}`);
  }
  async function rewrite(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) { await rewrite(file); continue; }
      if (!/\.(html|js)$/.test(entry.name)) continue;
      const source = localizeMedia(await readFile(file, 'utf8'), assets);
      if (source.includes('/__l5e/assets-v1/')) throw new Error(`Unmapped media in ${file}`);
      await writeFile(file, source);
    }
  }
  await rewrite(output);
  console.log('Static portfolio ready with local images and videos.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await exportPortfolio(process.argv[2]);
}