const fs = require("fs");

const urls = process.argv.slice(2);

if (!urls.length) return;

const url = urls[0];

console.log(url);
