const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('Form.tsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('src');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  // Replace className="flex flex-col gap-5" with className="flex flex-col" style={{ gap: '24px' }}
  content = content.replace(/className="flex flex-col gap-[456]"/g, 'className="flex flex-col" style={{ gap: \'24px\' }}');
  fs.writeFileSync(f, content);
});
console.log("Forms gap fixed");
