import { fail } from 'https://deno.land/std@0.163.0/testing/asserts.ts';
import { join, fromFileUrl } from 'https://deno.land/std@0.163.0/path/mod.ts';

Deno.test({
    name: 'patterns',
    fn: async () => {
        for (const file of [ 'apps', 'bots', 'browsers', 'devices', 'libraries', 'referrers' ]) {
            const filepath = join(fromFileUrl(import.meta.url), `../../../patterns/${file}.json`);
            const txt = await Deno.readTextFile(filepath);
            const obj = JSON.parse(txt);
            if (!Array.isArray(obj.entries)) fail(`Bad top-level object: missing 'entries' array.`);
            const names = new Set<string>();
            let i = 0;
            for (const entry of obj.entries) {
                const tag = `${file}.entry[${i}]`;
                if (typeof entry !== 'object' || entry === null) fail(`Bad ${tag}: expected an object, found ${JSON.stringify(entry)}`);

                const { name, pattern, description, examples, svg, comments, type, urls } = entry as Record<string, unknown>;

                // name
                if (typeof name !== 'string') fail(`Bad ${tag}.name: expected a string property, found ${JSON.stringify(entry)}`);
                if (name.trim() !== name) fail(`Bad ${tag}.name: expected no leading or trailing whitespace, found ${name}`);
                if (name === '') fail(`Bad ${tag}.name: expected a non-blank string`);
                if (names.has(name.toLowerCase())) fail(`Bad ${tag}.name: expected a unique value, found ${name}`);
                names.add(name.toLowerCase());

                // pattern
                if (typeof pattern !== 'string') fail(`Bad ${tag}.pattern: expected a string property, found ${JSON.stringify(entry)}`);
                if (/^\s+$/.test(pattern)) fail(`Bad ${tag}.pattern: expected a non-blank string`);
                const regex = new RegExp(pattern);

                // description
                if (description !== undefined && typeof description !== 'string') fail(`Bad ${tag}.description: expected an optional string property, found ${JSON.stringify(entry)}`);
                if (typeof description === 'string') {
                    if (description.trim() !== description) fail(`Bad ${tag}.description: expected no leading or trailing whitespace, found ${description}`);
                    if (description === '') fail(`Bad ${tag}.description: expected a non-blank string`);
                }

                // svg
                if (svg !== undefined && typeof svg !== 'string') fail(`Bad ${tag}.svg: expected an optional string property, found ${JSON.stringify(entry)}`);
                if (typeof svg === 'string') {
                    if (!/^[a-z]+(-[a-z]+)*\.svg$/.test(svg)) fail(`Bad ${tag}.svg: unexpected value ${JSON.stringify(svg)}`);
                    await Deno.stat(join(fromFileUrl(import.meta.url), `../../../svg/${svg}`));
                }

                // comments
                if (comments !== undefined && typeof comments !== 'string') fail(`Bad ${tag}.comments: expected an optional string property, found ${JSON.stringify(entry)}`);
                if (typeof comments === 'string') {
                    if (comments.trim() !== comments) fail(`Bad ${tag}.comments: expected no leading or trailing whitespace, found ${comments}`);
                    if (comments === '') fail(`Bad ${tag}.comments: expected a non-blank string`);
                }

                // examples
                if (examples !== undefined) {
                    if (!Array.isArray(examples)) fail(`Bad ${tag}.examples: expected an array, found ${JSON.stringify(examples)}`);
                    examples.forEach((example: unknown, j: number) => {
                        if (typeof example !== 'string') fail(`Bad ${tag}.examples[${j}]: expected a string, found ${JSON.stringify(example)}`);
                        if (!regex.test(example)) fail(`Bad ${tag}.examples[${j}]: \"${example}\" does not match pattern \"${pattern}\"`);
                    });
                }

                // urls
                if (urls !== undefined) {
                    if (!Array.isArray(urls)) fail(`Bad ${tag}.urls: expected an array, found ${JSON.stringify(urls)}`);
                    urls.forEach((url: unknown, j: number) => {
                        if (typeof url !== 'string') fail(`Bad ${tag}.urls[${j}]: expected a string, found ${JSON.stringify(url)}`);
                        if (!isValidUrl(url)) fail(`Bad ${tag}.urls[${j}]: expected url, found \"${url}\"`);
                    });
                }

                // type
                if (type !== undefined && typeof type !== 'string') fail(`Bad ${tag}.type: expected an optional type property, found ${JSON.stringify(entry)}`);
                if (typeof type === 'string') {
                    if (!/^[a-z]+(_[a-z]+)*$/.test(type)) fail(`Bad ${tag}.type: unexpected value ${JSON.stringify(type)}`);
                }

                i++;
            }
        }
    }
});

function isValidUrl(url: string): boolean {
    try {
        const u = new URL(url);
        return u.protocol === 'http:' || u.protocol === 'https:'
    } catch {
        return false;
    }
}
