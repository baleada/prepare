import puppeteer from 'puppeteer-core'

export default function withPuppeteer (
  suite,
  options = {
    launch: ({ executablePath: { macOS } }) => ({ product: 'chrome', executablePath: macOS }),
    contextKey: 'puppeteer',
  }
) {
  const { launch: rawLaunch, contextKey } = options,
        launch = ensureLaunch(rawLaunch)

  suite.before(async context => {
    const browser = await puppeteer.launch(launch),
          page = await browser.pages()[0]

    context[contextKey] = { browser, page }
  })
  
  suite.after(async context => {
    await context[contextKey].browser.close()
  })

  return suite
}

function ensureLaunch (rawLaunch) {
  return rawLaunch === 'function'
    ? rawLaunch({
        executablePath: {
          macOS: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        }
      })
    : rawLaunch
}
