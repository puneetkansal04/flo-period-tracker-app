const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(fullPath));
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk('./app');
let modified = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('SafeAreaView') && content.match(/import\s+{([^}]*SafeAreaView[^}]*)}\s+from\s+['"]react-native['"]/)) {
    content = content.replace(/import\s+{([^}]*)}\s+from\s+['"]react-native['"]/g, (match, p1) => {
      if (p1.includes('SafeAreaView')) {
        const remaining = p1.replace(/SafeAreaView,?/g, '').split(',').map(s => s.trim()).filter(Boolean);
        if (remaining.length > 0) {
          return `import { SafeAreaView } from 'react-native-safe-area-context';\nimport { ${remaining.join(', ')} } from 'react-native'`;
        } else {
          return `import { SafeAreaView } from 'react-native-safe-area-context'`;
        }
      }
      return match;
    });
    fs.writeFileSync(file, content);
    modified++;
  }
});
console.log(`Fixed SafeAreaView imports in ${modified} files.`);
