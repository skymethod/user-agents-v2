import { fail } from 'https://deno.land/std@0.163.0/testing/asserts.ts';
import { join, fromFileUrl } from 'https://deno.land/std@0.163.0/path/mod.ts';

Deno.test({
    name: 'patterns',
    fn: async () => {
        const filepath = join(fromFileUrl(import.meta.url), '../../../patterns/apps.json');
        const txt = await Deno.readTextFile(filepath);
        const obj = JSON.parse(txt);
        if (!Array.isArray(obj.entries)) fail(`Bad top-level object: missing 'entries' array.`);
        obj.entries.forEach((entry: unknown, i: number) => {
            if (typeof entry !== 'object' || entry === null) fail(`Bad entry[${i}]: expected an object, found ${JSON.stringify(entry)}`);
            const { name, pattern } = entry as Record<string, unknown>;
            if (typeof name !== 'string') fail(`Bad entry[${i}]: expected a 'name' property, found ${JSON.stringify(entry)}`);
            if (typeof pattern !== 'string') fail(`Bad entry[${i}]: expected a 'pattern' property, found ${JSON.stringify(entry)}`);
        });
    }
});
