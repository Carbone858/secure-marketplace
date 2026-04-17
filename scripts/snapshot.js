/**
 * scripts/snapshot.js
 * Utility to "bookmark" a known stable state.
 * Usage: node scripts/snapshot.js "Optional Note"
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const GIT_PATH = '"C:\\Program Files\\Git\\cmd\\git.exe"';

function run(cmd) {
    try {
        return execSync(`${GIT_PATH} ${cmd}`).toString().trim();
    } catch (e) {
        console.error(`Error running git ${cmd}:`, e.message);
        process.exit(1);
    }
}

const argNote = process.argv[2] || "Manual Snapshot";
const sha = run('rev-parse HEAD');
const dateStr = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0, 16);
const tagDate = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12);
const tagName = `STABLE-${tagDate}`;

console.log(`Creating snapshot: ${tagName} (${sha})`);

// 1. Create Git Tag
run(`tag -a ${tagName} -m "${argNote}"`);
console.log(`- Created Git Tag: ${tagName}`);

// 2. Update STABLE_RELS.md
const relsPath = path.join(__dirname, '..', 'STABLE_RELS.md');
if (fs.existsSync(relsPath)) {
    const entry = `| **STABLE** | ${dateStr} | ${sha} | ${argNote} (Tag: ${tagName}) |\n`;
    fs.appendFileSync(relsPath, entry);
    console.log(`- Updated STABLE_RELS.md`);
}

// 3. Inform user about push
console.log(`\nSuccess! Your stability bookmark is saved.`);
console.log(`To push this bookmark to GitHub, run: git push origin ${tagName}`);
