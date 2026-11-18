const fs = require('node:fs');
const path = require('node:path');
const {runInNewContext} = require('node:vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const {pageFiles, pageTitles, pageParents, renderPage} = runInNewContext(
  source + '\n;({pageFiles, pageTitles, pageParents, renderPage})',
);

const base = 'https://tsa314ku-oss.github.io/RuohanDongSelf/';
const revision = '20261118-resonance-3';
const descriptions = {
  home: 'Ruohan Dong studies bioengineering at Beijing University of Chemical Technology and works across plant-based research, percussion and singing.',
  academic: 'Explore Ruohan Dong’s bioengineering research projects and coursework at BUCT.',
  artemisia: 'A team research project on a fermented Artemisia annua lotion, from formulation to testing and school-level recognition.',
  dressing: 'An early-stage bioengineering project exploring a functional wound dressing made with shepherd’s-purse extract.',
  activities: 'Ruohan Dong’s campus experiences in music, performance and student leadership.',
  orchestra: 'Ruohan Dong’s experience as a percussionist in the BUCT Symphony Orchestra.',
  leadership: 'Ruohan Dong’s work as a volunteer and departmental lead in the Student Union.',
  singer: 'Ruohan Dong’s experience as a Campus Top Ten Singer, guest judge and performer.',
  plan: 'Ruohan Dong’s academic plans and goals for lifelong learning.',
  philosophy: 'Reflections on what connects Ruohan Dong’s work in the lab and on stage.',
  resume: 'View and download Ruohan Dong’s résumé with education, research and campus experience.',
  contact: 'Contact Ruohan Dong at Beijing University of Chemical Technology.',
};
const nav = [
  ['academic', 'Research'], ['activities', 'Campus life'], ['philosophy', 'Philosophy'],
  ['resume', 'Résumé'], ['contact', 'Contact'],
];
const footerGroups = [
  ['Research & study', ['academic', 'artemisia', 'dressing', 'plan']],
  ['Campus life', ['activities', 'orchestra', 'leadership', 'singer']],
  ['About', ['philosophy', 'resume', 'contact']],
];

function header(page) {
  return `<header class="site-header">
  <div class="wrap header-layout">
    <a class="brand" href="index.html"${page === 'home' ? ' aria-current="page"' : ''}><span class="brand-symbol" aria-hidden="true"><img class="brand-mark" src="brand-symbol.png" width="1254" height="1254" alt=""></span><span>Ruohan Dong</span></a>
    <button class="menu" type="button" aria-expanded="false" aria-controls="primary-nav">Menu<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 7h14M3 13h14"/></svg></button>
    <nav id="primary-nav" aria-label="Primary">${nav.map(([id, label]) =>
      `<a href="${pageFiles[id]}"${id === page ? ' aria-current="page"' : id === pageParents[page] ? ' aria-current="location"' : ''}>${label}</a>`,
    ).join('')}</nav>
  </div>
</header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="wrap footer-layout">
  <div class="footer-intro"><a class="footer-name" href="index.html"><span class="brand-symbol" aria-hidden="true"><img class="brand-mark" src="brand-symbol.png" width="1254" height="1254" alt=""></span><span>Ruohan Dong</span></a><p>Bioengineering at BUCT</p><a class="text-link" href="contact.html">Get in touch</a></div>
  <nav class="site-map" aria-label="All website pages">${footerGroups.map(([label, ids]) =>
    `<div><p>${label}</p><ul>${ids.map(id => `<li><a href="${pageFiles[id]}">${pageTitles[id]}</a></li>`).join('')}</ul></div>`,
  ).join('')}</nav>
</div></footer>`;
}

const viewer = `<dialog id="photo-viewer" aria-labelledby="viewer-title">
  <div class="lightbox-content">
    <div class="lightbox-bar"><h2 id="viewer-title">Photo viewer</h2><button class="lightbox-close" type="button">Close</button></div>
    <div class="lightbox-frame"></div>
    <div class="lightbox-caption"><p class="lightbox-status" role="status"></p><a class="original-link">Open original</a></div>
    <div class="lightbox-controls"><button class="lightbox-prev" type="button">Previous photo</button><button class="lightbox-next" type="button">Next photo</button></div>
  </div>
</dialog>`;

for (const [page, file] of Object.entries(pageFiles)) {
  const title = `${pageTitles[page]} | Ruohan Dong`;
  const canonical = base + file;
  const shareImage = base + (page === 'home' ? 'hero-sharp-desktop.jpg' : 'photo-3-lg.jpg');
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#edf4f6">
  <title>${title}</title>
  <meta name="description" content="${descriptions[page]}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${descriptions[page]}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${shareImage}">
  <link rel="icon" href="brand-symbol.png" type="image/png">
  <link rel="stylesheet" href="style.css?v=${revision}">
  <script src="app.js?v=${revision}" defer></script>
</head>
<body data-page="${page}">
  <a class="skip" href="#main">Skip to content</a>
  ${header(page)}
  <main id="main" tabindex="-1">${renderPage(page)}</main>
  ${footer()}
  ${viewer}
</body>
</html>
`;
  fs.writeFileSync(path.join(root, file), html);
}
console.log(`Built ${Object.keys(pageFiles).length} independent HTML pages.`);
