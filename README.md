# user-agents-v2

Comprehensive open-source collection of broadly-compatible regular expression patterns to identify and analyze podcast player user agents.

## Quick start

Given a HTTP [`User-Agent`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent) found in your podcast episode server logs, to find a deterministic entity match:
 - Remove any newlines (never occurs except from bad actors)
 - Iterate the following json files from the [`patterns`](/patterns) directory in this order: [`bots`](/patterns/bots.json), [`apps`](/patterns/apps.json), [`libraries`](/patterns/libraries.json), [`browsers`](/patterns/browsers.json)
 - Iterate the pattern file `entries` array in order, returning the first entry where `pattern` matches the User-Agent
 - This will always result in either 0 or 1 entry
 - If found, the containing file can be used as the `type` of the entry (e.g. `bot` if found in the [`bots`](/patterns/bots.json) file)

_(Optional)_ If `type` is not `bot`, to additionally break down by device:
 - Iterate the [`devices`](/patterns/devices.json) pattern file `entries` array in order, returning the first entry where `pattern` matches the User-Agent
 - This will always result in either 0 or 1 entry
 - If found, the device will also have a `category` for high-level category such as `mobile`, `smart_speaker`, or `computer`

_(Optional)_ If `type` is `browser` and you also have the HTTP [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer) header in your logs, to additionally break down by known web apps:
 - Remove any newlines (never occurs except from bad actors)
 - Iterate the [`referrers`](/patterns/referrers.json) pattern file `entries` array in order, returning the first entry where `pattern` matches the Referer
 - This will always result in either 0 or 1 entry
 - If found, the referrer entity may also have a `category` of `app` (for web-based apps) or `host` (for podcast hosting company players)

## Approach

This collection is an evolution of the original [OPAWG User agent list](https://github.com/opawg/user-agents), refactored in some ways and overlaid with ideas from the excellent [Buzzsprout Podcast Agents](https://github.com/buzzsprout/podcast-agent) Ruby gem.

Some of the goals of this collection:
 - **Data files instead of code**: This is not an NPM package or dependent on any specific programming environment or platform, the patterns files are in standard JSON format, with a shared [JSON schema](/schemas/patterns.schema.json) (automatic type-checking and code-assist in IDEs). There is no code outside of the `.github` folder, which runs the automated tests on every change.
 - **Deterministic**: Given a User-Agent, everyone should end up with the same unique result (0 or 1 entry), regardless of programming language or environment.
 - **Fast and compatible**: Keep to basic regular expression patterns, avoid features such as lookaheads that are expensive or unavailable in certain environments.
 - **Comprehensive**: Goal is to match the vast majority of current podcast user-agents in the wild.
 - **Multi-dimensional**: While basic entity matching is deterministic, optional breakdowns by device and device category are separated out into a separate file - making the patterns simpler, and focusing on attributes useful for standard podcast stats reporting.
 - **Web-aware**: Optionally identify known web-based apps and other players using the Referer header, given that web-based apps cannot set a custom User-Agent.
 - **Testable**: Examples are included attached to the entries themselves, automated checks are run against the patterns after every push and pull request, to ensure quality going forward.

## History

These patterns were initially created with a one-time automated transform of the original [OPAWG User agent list](https://github.com/opawg/user-agents), with the following transformations:
 - Convert top-level array to multiple top-level files by type, each with a top-level object - easier to deserialize in some environments than a top-level array.
 - Remove unnecessary forward-slash escaping `\/` in patterns.
 - Merge duplicate entries into a single entry, then sort alphabetically.
 - Remove lookheads, re-order certain entries if necessary to emulate.
 - Combine multiple expressions for a single entry into a single regex pattern (separated by `|`), which are simpler and faster to compile.
 - Fix some of the incorrect patterns.
 - Drop support for 'device' and 'os', instead introduce a new 'devices' entries file inspired by Buzzsprout's ruby gem. Simplify patterns that no longer need app+device+os specificity).
 - Add a JSON schema, fix validation errors found (like incorrect info urls).
 - Imported several new entries and examples from Buzzsprout's test data file.
 - Run against a large set of found data, and add yet more entities and examples.
 - Fix any issues found when running against the new automated checks.  In addition to basic JSON-level data checks, the automated tests ensure each entry example matches against its parent entry when running through the deterministic matching algorithm mentioned above.

