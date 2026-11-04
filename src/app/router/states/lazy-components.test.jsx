import fs from 'fs';
import path from 'path';

// Route components are lazy, so a path that no longer resolves only fails once
// someone opens that route. Load every one of them here instead.
const lazyImports = fs.readdirSync(__dirname)
  .filter((file) => file.endsWith('.js'))
  .flatMap((file) => [...fs.readFileSync(path.join(__dirname, file), 'utf8')
    .matchAll(/lazy\(\(\) => import\('([^']+)'\)\)/g)]
    .map((match) => [file, match[1]]));

describe('lazily loaded route components', () => {
  it('are found in the state files', () => {
    expect(lazyImports.length).toBeGreaterThan(30);
  });

  it('do not point at the removed *-wrapper components', () => {
    expect(lazyImports.filter(([, modulePath]) => modulePath.endsWith('-wrapper'))).toEqual([]);
  });

  it.each(lazyImports)('%s: %s loads, with a component as its default export', async (file, modulePath) => {
    const module = await import(modulePath);

    expect(typeof module.default).toBe('function');
  });
});
