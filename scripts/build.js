const fs = require("fs");
const exec = require("child_process").execSync;
const { zip } = require('zip-a-folder');

const p = require('../package.json');

let src = '';
let commit = '?';
try {
  commit = revision = exec('git rev-parse --short HEAD')
    .toString().trim();
} catch (e) { commit = 'No GIT'; }
src += `// [${commit} v${p.version}] ${new Date()} \n
BUILD = true; `;

let files = [
  'public/latest.min.js',
  'dist/g.min.js'
];
files.forEach((file) => {
  src += fs.readFileSync(file, 'UTF8');
});

exec('rm dist/*');
exec('cp public/*.png dist/');

let html = `<!DOCTYPE html>
  <html lang="en">
  <head>
  <title>${p.meta_title}</title>
  <meta property="author" content="${p.author}"/>
  <meta property="description" content="${p.description}"/>
  <link rel="icon" type="image/png" href="favicon.png" />
  </head>
  <body>
  <noscript>This game requires javascript to be enabled.</noscript>
  <script>${src}</script>
  </body>
  </html>`;
fs.writeFileSync('dist/index.html', html);

async function zipIt(zipName) {
  await zip('dist', zipName);
}

const zipName = p.name + '.zip';
zipIt(zipName)
.then(() => {
  exec(`mv ${zipName} dist/`);
  })
