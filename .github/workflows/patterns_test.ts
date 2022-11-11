import { fail } from 'https://deno.land/std@0.163.0/testing/asserts.ts';
import { join, fromFileUrl } from 'https://deno.land/std@0.163.0/path/mod.ts';

Deno.test({
    name: 'patterns',
    fn: async () => {
        const filepath = join(fromFileUrl(import.meta.url), '../../../patterns/apps.json');
        const txt = await Deno.readTextFile(filepath);
        const obj = JSON.parse(txt);
        if (!Array.isArray(obj.entries)) fail(`Bad top-level object: missing 'entries' array.`);
        const names = new Set<string>();
        obj.entries.forEach((entry: unknown, i: number) => {
            if (typeof entry !== 'object' || entry === null) fail(`Bad entry[${i}]: expected an object, found ${JSON.stringify(entry)}`);
            const { name, pattern, description, examples } = entry as Record<string, unknown>;

            if (typeof name !== 'string') fail(`Bad entry[${i}].name: expected a string property, found ${JSON.stringify(entry)}`);
            if (name.trim() !== name) fail(`Bad entry[${i}].name: expected no leading or trailing whitespace, found ${name}`);
            if (name === '') fail(`Bad entry[${i}].name: expected a non-blank string`);
            if (names.has(name.toLowerCase())) fail(`Bad entry[${i}].name: expected a unique value, found ${name}`);
            names.add(name.toLowerCase());

            if (typeof pattern !== 'string') fail(`Bad entry[${i}].pattern: expected a string property, found ${JSON.stringify(entry)}`);
            if (/^\s+$/.test(pattern)) fail(`Bad entry[${i}].pattern: expected a non-blank string`);

            if (description !== undefined && typeof description !== 'string') fail(`Bad entry[${i}].description: expected an optional string property, found ${JSON.stringify(entry)}`);
            if (typeof description === 'string') {
                if (description.trim() !== description) fail(`Bad entry[${i}].description: expected no leading or trailing whitespace, found ${description}`);
                if (description === '') fail(`Bad entry[${i}].description: expected a non-blank string`);
            }

            const regex = new RegExp(pattern);
            if (examples !== undefined) {
                if (!Array.isArray(examples)) fail(`Bad entry[${i}].examples: expected an array, found ${JSON.stringify(examples)}`);
                examples.forEach((example: unknown, j: number) => {
                    if (typeof example !== 'string') fail(`Bad entry[${i}].examples[${j}]: expected a string, found ${JSON.stringify(example)}`);
                    if (!regex.test(example)) fail(`Bad entry[${i}].examples[${j}]: \"${example}\" does not match pattern \"${pattern}\"`);
                });
            }

        });
    }
});
