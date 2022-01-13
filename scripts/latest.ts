import { readFileSync } from 'fs'
import { execSync } from 'child_process'

const pkg = JSON.parse(readFileSync('package.json', 'utf8'))

const deps = Object.keys(pkg.dependencies || {})

const devDeps = Object.keys(pkg.devDependencies || {})

const withLogging = (command: string) => {
  execSync(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
}

console.log(`updating ${deps.length} dependencies`)
withLogging(`npm install --save ${deps.map(dep => `${dep}@latest`).join(' ')}`)


console.log(`updating ${devDeps.length} dev dependencies`)
withLogging(`npm install --save-dev ${devDeps.map(dep => `${dep}@latest`).join(' ')}`)
