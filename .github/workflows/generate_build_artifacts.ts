// deno-lint-ignore-file no-explicit-any
import { join, fromFileUrl } from 'https://deno.land/std@0.163.0/path/mod.ts';

const src = join(fromFileUrl(import.meta.url), `../../../src`);
const build = join(fromFileUrl(import.meta.url), `../../../build`);

for (const type of [ 'apps', 'bots', 'browsers', 'devices', 'libraries', 'referrers' ]) {
    const obj = JSON.parse(await Deno.readTextFile(join(src, `${type}.json`)));

    // compute a version with only the core attributes needed in production
    const runtimeContents = JSON.stringify(computeRuntimeContents(obj), undefined, 2);
    await writeTextFileIfChanged(join(build, `${type}.runtime.json`), runtimeContents);

    // compute a version with only the examples
    const examplesContents = JSON.stringify(computeExamplesContents(obj), undefined, 2);
    await writeTextFileIfChanged(join(build, `${type}.examples.json`), examplesContents);
}

function computeRuntimeContents(obj: any) {
    const entries = obj.entries.map((v: unknown) => {
        const { name, pattern, category } = v as Record<string, unknown>;
        return { name, pattern, category };
    });
    return { entries };
}

function computeExamplesContents(obj: any) {
    const entries = obj.entries.map((v: unknown) => {
        const { name, examples } = v as Record<string, unknown>;
        return { name, examples };
    });
    return { entries };
}

async function writeTextFileIfChanged(path: string, contents: string) {
    const oldContents = await tryReadTextFile(path);
    if (oldContents !== contents) {
        console.log(`Updating ${path}`);
        await Deno.writeTextFile(path, contents);
    }
}

async function tryReadTextFile(path: string): Promise<string | undefined> {
    try {
        return await Deno.readTextFile(path);
    } catch (e) {
        if (e instanceof Deno.errors.NotFound) return undefined;
        throw e;
    }
}
