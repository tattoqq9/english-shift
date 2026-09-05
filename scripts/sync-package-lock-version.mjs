import fs from 'node:fs'

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const lockPath = 'package-lock.json'

if (!fs.existsSync(lockPath)) {
  console.log('package-lock.json not found; nothing to sync.')
  process.exit(0)
}

const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'))
lock.version = packageJson.version
if (lock.packages && lock.packages['']) lock.packages[''].version = packageJson.version
fs.writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`)
console.log(`package-lock version synced to ${packageJson.version}`)
