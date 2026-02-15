/**
 * fix-svg-viewbox.js
 * 
 * These category SVGs declare viewBox="0 0 48 48" but their actual path
 * coordinates extend far beyond that (up to 500+). This script parses each
 * SVG, calculates the true bounding box from all <path> transforms and
 * coordinate data, and rewrites the viewBox so the full icon is visible.
 */

const fs = require('fs');
const path = require('path');

const svgDir = path.join(__dirname, '..', 'public', 'images');

const svgFiles = [
    'IT .svg',
    'Plumping .svg',
    'moving .svg',
    'Cleaning .svg',
    'Construction & Building.svg',
    'interior .svg',
    'Electrical.svg',
];

for (const file of svgFiles) {
    const filePath = path.join(svgDir, file);
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${file}`);
        continue;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    let globalMinX = Infinity, globalMinY = Infinity;
    let globalMaxX = -Infinity, globalMaxY = -Infinity;

    // Match each <path ... /> element
    const pathRegex = /<path\s[^>]*?\/>/gs;
    let match;

    while ((match = pathRegex.exec(content)) !== null) {
        const pathEl = match[0];

        // Extract translate(tx, ty) from transform attribute
        const transformMatch = pathEl.match(/transform="translate\(\s*([^,\)]+)[,\s]+([^,\)]+)\s*\)"/);
        const tx = transformMatch ? parseFloat(transformMatch[1]) : 0;
        const ty = transformMatch ? parseFloat(transformMatch[2]) : 0;

        // Extract the d="..." path data
        const dMatch = pathEl.match(/d="([^"]+)"/);
        if (!dMatch) continue;

        const d = dMatch[1];

        // Extract all numbers from path data
        // For cubic beziers (C command), ALL coordinates (including control points)
        // bound the curve, so treating everything as coordinates is valid.
        const numbers = d.match(/-?\d+\.?\d*/g);
        if (!numbers || numbers.length < 2) continue;

        // Process numbers as alternating x, y pairs
        for (let i = 0; i < numbers.length - 1; i += 2) {
            const x = parseFloat(numbers[i]) + tx;
            const y = parseFloat(numbers[i + 1]) + ty;

            if (x < globalMinX) globalMinX = x;
            if (y < globalMinY) globalMinY = y;
            if (x > globalMaxX) globalMaxX = x;
            if (y > globalMaxY) globalMaxY = y;
        }
    }

    if (globalMinX === Infinity) {
        console.log(`⚠️  No paths found in: ${file}`);
        continue;
    }

    // Add padding (2 units on each side)
    const padding = 2;
    const x = Math.floor(globalMinX - padding);
    const y = Math.floor(globalMinY - padding);
    const w = Math.ceil(globalMaxX - globalMinX + padding * 2);
    const h = Math.ceil(globalMaxY - globalMinY + padding * 2);
    const viewBox = `${x} ${y} ${w} ${h}`;

    console.log(`✅ ${file}`);
    console.log(`   Old viewBox: 0 0 48 48`);
    console.log(`   Content bounds: (${globalMinX.toFixed(0)}, ${globalMinY.toFixed(0)}) → (${globalMaxX.toFixed(0)}, ${globalMaxY.toFixed(0)})`);
    console.log(`   New viewBox: ${viewBox}`);

    // Replace the viewBox attribute
    content = content.replace(/viewBox="[^"]*"/, `viewBox="${viewBox}"`);

    fs.writeFileSync(filePath, content, 'utf8');
}

console.log('\n🎉 All SVG viewBox values fixed!');
