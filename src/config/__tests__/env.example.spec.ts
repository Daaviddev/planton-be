import { envSchema } from '../env.validation';
import * as fs from 'fs';
import * as path from 'path';

describe('env.example vs env schema checklist', () => {
  test('env.example contains required keys from schema', () => {
    const content = fs.readFileSync(
      path.join(process.cwd(), '.env.example'),
      'utf8',
    );
    const keys = new Set(
      content
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith('#'))
        .map((l) => l.split('=')[0].trim()),
    );

    const schemaKeys = Object.keys(envSchema.shape);

    // Ensure every schema key has an entry in .env.example
    for (const k of schemaKeys) {
      expect(keys.has(k)).toBeTruthy();
    }
  });
});
