import puppeteer from 'puppeteer-core'

const defaultOptions = {
  launch: ({ executablePath: { macOS } }) => ({ product: 'chrome', executablePath: macOS }),
  contextKey: 'puppeteer',
}

export default function withPuppeteer (suite, options = {}) {
  const { launch: rawLaunch, contextKey } = { ...defaultOptions, ...options },
        launch = ensureLaunch(rawLaunch)

  suite.before(async context => {
    const browser = await puppeteer.launch(launch),
          page = (await browser.pages())[0],
          mouseClick = async selector => {
            const coords = await page.evaluate(selector => JSON.parse(JSON.stringify(document.querySelector(selector).getBoundingClientRect())), selector)
            await page.mouse.click(coords.x, coords.y)
          }

    context[contextKey] = { browser, page, mouseClick }
  })
  
  suite.after(async context => {
    await context[contextKey].browser.close()
  })

  return suite
}

const launchApi = {
  executablePath: {
    macOS: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  }
}

export function ensureLaunch (rawLaunch) {
  return typeof rawLaunch === 'function'
    ? rawLaunch(launchApi)
    : rawLaunch
}
