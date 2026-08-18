const fs = require('fs');
const path = require('path');

const replacements = [
    { from: />\$/g, to: '>₹' },
    { from: /\(\$\)/g, to: '(₹)' },
    { from: /:\s*\$/g, to: ': ₹' },
    { from: /DEP:\s*\$/g, to: 'DEP: ₹' },
    { from: /\+\$/g, to: '+₹' },
    { from: /Paid:\s*\$/g, to: 'Paid: ₹' },
    { from: /USD/g, to: 'INR' }
];

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src'));
let changedFilesCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    replacements.forEach(rep => {
        content = content.replace(rep.from, rep.to);
    });
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedFilesCount++;
        console.log('Updated:', file);
    }
});

console.log(`Replaced currency symbols in ${changedFilesCount} files.`);
