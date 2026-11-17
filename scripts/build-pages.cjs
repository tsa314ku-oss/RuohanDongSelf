const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const script=fs.readFileSync(path.join(root,'app.js'),'utf8');
const prefix=script.slice(0,script.indexOf('function route(){'));
const {pageFiles,pageTitles,pageParents,renderPage,originalText}=vm.runInNewContext(prefix+';({pageFiles,pageTitles,pageParents,renderPage,originalText})',{document:{querySelector:()=>({})}});
const version='20261118-12pages';
let shell=fs.readFileSync(path.join(root,'index.html'),'utf8');
shell=shell.replace(/<link rel="preload" as="image"[^>]*>/g,'').replace(/<link rel="canonical"[^>]*>/g,'');
shell=shell.replace(/<nav class="site-map"[\s\S]*?<\/nav>/g,'');
const sitemap='<nav class="site-map" aria-label="All website pages">'+Object.entries(pageFiles).map(([id,file])=>`<a href="${file}">${id==='home'?'Home':pageTitles[id]}</a>`).join('')+'</nav>';
const descriptions={artemisia:originalText[6],dressing:originalText[8],orchestra:originalText[23],leadership:originalText[25],singer:originalText[27]};
for(const [id,file] of Object.entries(pageFiles)){
 let html=shell.replace(/<title>[\s\S]*?<\/title>/,`<title>${pageTitles[id]} — Ruohan Dong</title>`);
 html=html.replace(/(href="style\.css\?v=)[^"]+/,`$1${version}`).replace(/(src="app\.js\?v=)[^"]+/,`$1${version}`);
 html=html.replace(/<body[^>]*>/,`<body class="motion-paused" data-page="${id}">`);
 let content=renderPage(id).replace(/src="data:image\/gif;base64,[^"]+" data-lazy-src="([^"]+)"/g,'src="$1" data-lazy-src="$1" loading="lazy"');
 html=html.replace(/<main id="main" tabindex="-1">[\s\S]*?<\/main>/,`<main id="main" tabindex="-1">${content}</main>`);
 html=html.replace('</footer>',sitemap+'</footer>');
 html=html.replace(/<span id="year">.*?<\/span>/,'<span id="year">2026</span>');
 html=html.replace(/<a href="([^"]+)" data-page="([^"]+)"[^>]*>/g,(_,href,page)=>`<a href="${href}" data-page="${page}"${page===(pageParents[id]||id)?' class="active" aria-current="page"':''}>`);
 const description=(descriptions[id]||`${pageTitles[id]} — Ruohan Dong, Bioengineering undergraduate at Beijing University of Chemical Technology.`).slice(0,190).replace(/&/g,'&amp;').replace(/"/g,'&quot;');
 html=html.replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${description}">`);
 html=html.replace('</head>',`<link rel="canonical" href="https://tsa314ku-oss.github.io/RuohanDongSelf/${file}"></head>`);
 if(id==='home'){
  const cdn='https://cdn.jsdelivr.net/gh/tsa314ku-oss/RuohanDongSelf@3f750a5be173bf69baae815ea8f19340a98321f3/';
  html=html.replace('</head>',`<link rel="preload" as="image" href="${cdn}hero-sharp-desktop.jpg" media="(min-width:721px)" fetchpriority="high"><link rel="preload" as="image" href="${cdn}hero-sharp-mobile.jpg" media="(max-width:720px)" fetchpriority="high"></head>`);
 }
 fs.writeFileSync(path.join(root,file),html);
}
console.log(`Built ${Object.keys(pageFiles).length} independent HTML pages.`);
