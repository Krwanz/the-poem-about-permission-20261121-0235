import { copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Copies entry.txt into the output directory the grader provides.
// The output directory itself is never removed; only its contents
// are cleared first, so a stale file can never survive a run.
// After copying, the written file is read back and checked: a
// truncated, empty, or whitespace-only write must fail loudly
// instead of silently handing the grader a broken entry.
const here = dirname(fileURLToPath(import.meta.url));

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

mkdirSync(outDir, { recursive: true });

for (const name of readdirSync(outDir)) {
  rmSync(join(outDir, name), { recursive: true, force: true });
}

const outFile = join(outDir, "entry.txt");
copyFileSync(join(here, "entry.txt"), outFile);

const written = readFileSync(outFile, "utf8");
const length = [...written].length;
if (length < 1 || length > 280) {
  console.error(
    `entry.txt length check failed: ${length} Unicode code points, expected 1 to 280`,
  );
  process.exit(1);
}
if (written.trim().length === 0) {
  console.error("entry.txt content check failed: entry is only white space");
  process.exit(1);
}
