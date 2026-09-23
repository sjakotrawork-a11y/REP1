import fs from 'node:fs/promises';
import postcss from 'postcss';

const source = await fs.readFile('index.html','utf8');
let html = source.match(/<body>([\s\S]*?)<script type="module"/)[1];
html = html.replaceAll('>ESTATE<','>__BRAND__<').replaceAll('>INTELLIGENCE<','>__SUBTITLE__<');
html = html.replace('Smart Solutions for Real<br class="desktop-title-break" /> Estate Operations','__HEADLINE__');
const cssRoot=postcss.parse((await fs.readFile('src/style.css','utf8'))+'\n'+(await fs.readFile('src/reference-refinement.css','utf8')));
cssRoot.walkRules(rule=>{
    if(rule.parent.type==='atrule' && /keyframes/.test(rule.parent.name)) return;
    rule.selectors=rule.selectors.map(selector=>{
        if(/^(:root|html|body)(?=[ .:#[]|$)/.test(selector))return selector.replace(/^(:root|html|body)/,'.estate-site');
        return '.estate-site '+selector;
    });
});
cssRoot.walkAtRules('media',rule=>{
    if(/(?:max|min)-width/.test(rule.params) && !/height/.test(rule.params)){rule.name='container';rule.params='estate '+rule.params;}
});
cssRoot.walkDecls(decl=>{
    decl.value=decl.value.replace(/([\d.]+)vw/g,'$1cqw').replace(/([\d.]+)svh/g,(_,n)=>`calc(var(--estate-vh) * ${Number(n)/100})`);
    if(decl.prop==='font-family') {
        if(decl.value.startsWith('"DM Sans"')||decl.value.startsWith("'DM Sans'"))decl.value='var(--estate-body-font)';
        if(decl.value.startsWith('"Prata"')||decl.value.startsWith("'Prata'"))decl.value='var(--estate-display-font)';
    }
});
let css=cssRoot.toString();
css+='\n.estate-site{font-family:var(--estate-body-font);isolation:isolate;}\n.estate-site .estate-content{width:100%;position:relative;}\n.estate-site[data-static="true"] .journey{height:var(--estate-vh);}\n.estate-site[data-static="true"] .journey-stage{position:relative;}\n.estate-site[data-static="true"] .journey-video{background-color:#d7cbbc;}\n.estate-site dialog{container-type:normal;}\n.estate-site .case-panel{scrollbar-width:thin;}\n';
const main=await fs.readFile('src/main.js','utf8');
const chapters=main.slice(main.indexOf('const chapters ='),main.indexOf('const video ='));
let component=await fs.readFile('framer/EstateIntelligence.template.tsx','utf8');
const icons = Object.fromEntries(await Promise.all(['claude.webp','openai.svg','google-drive.svg','cutting-edge-school-logo.png'].map(async name=>[name,`data:${name.endsWith('svg')?'image/svg+xml':name.endsWith('png')?'image/png':'image/webp'};base64,${(await fs.readFile('public/media/'+name)).toString('base64')}`])));
component=component.replace('__ESTATE_ICONS__',()=>JSON.stringify(icons));
component=component.replace('__ESTATE_CSS__',()=>JSON.stringify(css)).replace('__ESTATE_HTML__',()=>JSON.stringify(html)).replace('__ESTATE_CHAPTERS__',()=>chapters);
await fs.writeFile('framer/EstateIntelligence.tsx',component);
await fs.writeFile('.reference/create-framer-component.json',JSON.stringify({name:'EstateIntelligence.tsx',content:component}));
console.log(`Prepared Framer component (${component.length} characters)`);
