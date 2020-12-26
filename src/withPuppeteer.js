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
          },
          tab = async ({ direction, total }) => {
            const iterable = (new Array(total)).fill()
            switch (direction) {
              case 'forward':
                iterable.forEach(async () => await page.keyboard.press('Tab'))
                break
              case 'backward':
                await page.keyboard.down('Shift')
                iterable.forEach(async () => await page.keyboard.press('Tab'))
                await page.keyboard.up('Shift')
                break
            }
          }

    context[contextKey] = { browser, page, mouseClick, tab }
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
