import fs from 'node:fs'

function read(path) { return fs.readFileSync(path, 'utf8') }
function assert(condition, message) { if (!condition) throw new Error(message) }

const index = read('index.html')
const privacy = read('public/privacy.html')
const robots = read('public/robots.txt')
const sitemap = read('public/sitemap.xml')
const releaseDoc = read('PUBLIC_BETA_RELEASE.md')

const rootUrl = 'https://english-shift.tattoqq9.workers.dev/'
const privacyUrl = 'https://english-shift.tattoqq9.workers.dev/privacy.html'
const ogUrl = 'https://english-shift.tattoqq9.workers.dev/og-card.png'
const sitemapUrl = 'https://english-shift.tattoqq9.workers.dev/sitemap.xml'

for (const token of [
  `<link rel="canonical" href="${rootUrl}" />`,
  `<meta property="og:url" content="${rootUrl}" />`,
  `<meta property="og:image" content="${ogUrl}" />`,
  `<meta property="og:image:secure_url" content="${ogUrl}" />`,
  `<meta property="og:image:width" content="1200" />`,
  `<meta property="og:image:height" content="630" />`,
  `<meta property="og:image:alt" content="English Shift Public Beta" />`,
  `<meta name="twitter:image" content="${ogUrl}" />`,
]) assert(index.includes(token), `final public metadata missing: ${token}`)

assert(privacy.includes(`<link rel="canonical" href="${privacyUrl}" />`), 'privacy canonical missing')
assert(robots.includes(`Sitemap: ${sitemapUrl}`), 'robots sitemap directive missing')
assert(sitemap.includes(`<loc>${rootUrl}</loc>`), 'root URL missing from sitemap')
assert(sitemap.includes(`<loc>${privacyUrl}</loc>`), 'privacy URL missing from sitemap')
assert(releaseDoc.includes(rootUrl), 'final public URL missing from release document')
assert(!index.includes('content="/og-card.png"'), 'relative OG image must not remain')

console.log('English Shift v0.7.0 Public Beta metadata smoke: PASS')
console.log('canonical · og:url · absolute social image · privacy canonical · robots sitemap · sitemap.xml')
