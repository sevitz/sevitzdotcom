// Reversible scrambling for values that should never appear as a plain,
// contiguous string in the shipped page (phone/email, targeted by scraping
// bots). Runs here at build time to produce the two opaque parts that get
// printed into the HTML; the inverse (decode) is a small vanilla-JS snippet
// duplicated inline in Contact.astro's client script, since that runs in the
// browser, not this Node build step.
//
// Not a security boundary, just enough to defeat regex/DOM-text scraping of
// the static output. Shift by 1, reverse, then split into two interleaved
// halves so the real value never appears forwards, backwards, or shifted, in
// one contiguous piece anywhere in dist/.
export function encode(value: string): [string, string] {
  const shifted = Array.from(value)
    .map((ch) => String.fromCharCode(ch.charCodeAt(0) + 1))
    .join("");
  const reversed = shifted.split("").reverse().join("");
  const a = reversed
    .split("")
    .filter((_, i) => i % 2 === 0)
    .join("");
  const b = reversed
    .split("")
    .filter((_, i) => i % 2 === 1)
    .join("");
  return [a, b];
}
