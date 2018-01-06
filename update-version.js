// copies the package version into a global var in the index page
// we display this version number in the header
const fs = require('fs-extra');
const replacestream = require('replacestream');
const version = require('./package.json').version;
const displayVersion = `v${version}`;

fs.createReadStream('dist/index.html')
    .pipe(replacestream('INJECT-VERSION', displayVersion))
    .pipe(fs.createWriteStream('dist/index2.html'));

fs.remove('dist/index.html')
    .then(() => {
        fs.move('dist/index2.html', 'dist/index.html')
    });
