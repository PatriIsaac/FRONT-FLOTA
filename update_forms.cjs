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
  content = content.replace(/className="flex flex-col gap-8"/g, 'className="flex flex-col gap-5"');
  content = content.replace(/gap-4 pt-6"/g, 'gap-4 pt-6 mt-2 border-t border-gray-100"');
  content = content.replace(/variant="ghost"(.*?)>Cancelar/g, 'variant="outline"$1>Cancelar');
  fs.writeFileSync(f, content);
});
console.log("Forms updated successfully");
