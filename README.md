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

TODO

