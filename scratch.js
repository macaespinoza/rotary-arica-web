const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');
content = content.replace('import Countdown from "../components/Countdown";', 'import Countdown from "../components/Countdown";\nimport Gallery from "../components/Gallery";');
content = content.replace(/<section id="galeria"[\s\S]*?<div className="modal fade" id="galleryModal"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '<Gallery />');
fs.writeFileSync('app/page.tsx', content);
console.log("Done");
