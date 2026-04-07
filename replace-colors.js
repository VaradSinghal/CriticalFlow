const fs = require('fs');
const path = require('path');

const replacements = {
  // Critical (Red) -> Deep Twilight
  '#ef4444': 'var(--color-critical)',
  '#f87171': '#5f61fa',
  '#dc2626': '#0508ae',
  '#fca5a5': '#afb0fd',
  '239, 68, 68': '15, 18, 248',

  // Risk (Orange) -> Bright Teal Blue
  '#f97316': 'var(--color-risk)',
  '#fb923c': '#3bbaff',
  '249, 115, 22': '0, 119, 182',

  // Watch (Yellow) -> Turquoise Surf
  '#f59e0b': 'var(--color-watch)',
  '#fbbf24': '#4ee1ff',
  '245, 158, 11': '0, 180, 216',

  // Stable (Green) -> Frosted Blue
  '#22c55e': 'var(--color-stable)',
  '#34d399': '#bcedf5',
  '34, 197, 94': '144, 224, 239',

  // Existing theme overrides to strictly use the vars where exact hexes were used
  '#00b4d8': 'var(--color-watch)',
  '#0077b6': 'var(--color-risk)',
  '#caf0f8': 'var(--text-secondary)',
  '#020617': 'var(--bg-primary)',
  '#64748b': 'var(--text-muted)',
};

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (/\.(tsx|ts|css)$/.test(file)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // Ensure we don't mess up variable declarations in globals.css root
      if (file === 'globals.css') {
        const rootIndex = content.indexOf(':root {');
        const endRootIndex = content.indexOf('}', rootIndex);
        let before = content.slice(0, endRootIndex);
        let after = content.slice(endRootIndex);

        for (const [key, value] of Object.entries(replacements)) {
          // Escape string for regex if needed
          const regexStr = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(regexStr, 'gi');
          if (after.match(regex)) {
            after = after.replace(regex, value);
            changed = true;
          }
        }
        content = before + after;
      } else {
        for (const [key, value] of Object.entries(replacements)) {
          const regexStr = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(regexStr, 'gi');
          if (content.match(regex)) {
            content = content.replace(regex, value);
            changed = true;
          }
        }
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${file}`);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src'));
console.log('Colors replaced successfully!');
