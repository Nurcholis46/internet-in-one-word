// The Internet in One Word — a one-word entry for make.fun.
//
// The brief asks for a single word that describes the whole internet:
// funny by itself, true of the whole network rather than one app or
// mood, surprising, and landing in one beat. Our word names the slow
// rot every platform goes through — good for users first, then good
// for business customers, then good only for shareholders until the
// thing collapses under its own ads. One word, no explanation needed:
// the reader laughs, then nods.
//
// This program publishes that word to /output/entry.txt. The word is
// the entry; the code just guards the gate (1 to 30 characters, a
// single word with no space inside) and leaves the file readable for
// collection.

import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const OUTPUT_PATH = "/output/entry.txt";
const GATE_MIN_CHARS = 1;
const GATE_MAX_CHARS = 30;
const WORLD_READABLE = 0o644;

// The word. Counted before it was typed here: 16 characters, one word,
// no space, no punctuation, no leading or trailing whitespace. It was
// picked over doomscrolling and brainrot because it covers the whole
// internet's lifecycle, not just one habit or one feed's mood.
const WORD = "enshittification";

/** Count Unicode code points, which is how the gate measures length. */
function measure(text: string): number {
  return [...text].length;
}

/**
 * Refuse anything the sealed gate would refuse: outside 1..30
 * characters, only white space, or more than one word. A phrase would
 * pass the character gate but lose to any single word under the
 * judge's first criterion, so the space check guards the brief too.
 */
function enforceGate(text: string): void {
  const length = measure(text);
  if (length < GATE_MIN_CHARS || length > GATE_MAX_CHARS) {
    throw new Error(`word length ${length} is outside ${GATE_MIN_CHARS}..${GATE_MAX_CHARS}`);
  }
  if (text.trim().length === 0) {
    throw new Error("word is only white space");
  }
  if (text.includes(" ") || text.includes("\t") || text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single word with no whitespace inside");
  }
  if (text !== text.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }
}

/** Write the word and leave it readable by every user (mode 0644). */
function publish(text: string, target: string): void {
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, text, "utf8");
  chmodSync(target, WORLD_READABLE);
}

/** Read the file back and insist it holds exactly what we wrote. */
function verifyPublished(text: string, target: string): void {
  const onDisk = readFileSync(target, "utf8");
  if (onDisk !== text) {
    throw new Error("read-back mismatch: the file does not hold the word");
  }
}

function main(): void {
  // Gate first, publish second, verify last: if the word ever stops
  // satisfying the rules, this program should say so before it writes.
  enforceGate(WORD);
  publish(WORD, OUTPUT_PATH);
  verifyPublished(WORD, OUTPUT_PATH);
  console.log(`wrote ${measure(WORD)} characters to ${OUTPUT_PATH}`);
}

main();
