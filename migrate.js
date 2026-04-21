const fs = require('fs');

const html = fs.readFileSync('public/index.html', 'utf8');
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<script src="https:\/\/cdn.jsdelivr/i);
let bodyContent = bodyMatch ? bodyMatch[1] : '';

bodyContent = bodyContent.replace(/<!--[\s\S]*?-->/g, ''); // Remove HTML comments
bodyContent = bodyContent.replace(/\sclass=/g, ' className=');
bodyContent = bodyContent.replace(/style="display:\s*none;?"/g, "style={{ display: 'none' }}");
bodyContent = bodyContent.replace(/<img([^>]*)>/g, (m, p1) => m.endsWith('/>') ? m : `<img${p1} />`);
bodyContent = bodyContent.replace(/<hr([^>]*)>/g, (m, p1) => m.endsWith('/>') ? m : `<hr${p1} />`);
bodyContent = bodyContent.replace(/<input([^>]*)>/g, (m, p1) => m.endsWith('/>') ? m : `<input${p1} />`);
bodyContent = bodyContent.replace(/<br([^>]*)>/g, (m, p1) => m.endsWith('/>') ? m : `<br${p1} />`);
bodyContent = bodyContent.replace(/crossorigin/gi, 'crossOrigin');
bodyContent = bodyContent.replace(/\sfor=/gi, ' htmlFor=');

// Custom layout wrapper
const out = `export default function Home() {
  return (
    <>
      ${bodyContent}
    </>
  );
}`;

fs.writeFileSync('app/page.tsx', out);
console.log("Migration to page.tsx done!");
