const fs = require('fs');
const path = require('path');

const root = __dirname;
const frontend = path.join(root, 'frontend');

if (!fs.existsSync(frontend)) {
    fs.mkdirSync(frontend);
}

const files = ['src', 'package.json', 'package-lock.json', 'vite.config.js', 'index.html', 'node_modules'];

files.forEach(f => {
    const p = path.join(root, f);
    if (fs.existsSync(p)) {
        try {
            fs.renameSync(p, path.join(frontend, f));
        } catch (e) {
            console.log('Error moving', f, e.message);
        }
    }
});
