import puppeteer from 'puppeteer-core'
import type { LaunchOptions, Browser, Page } from 'puppeteer-core'
import type { Test, Context } from 'uvu'

export type WithPuppeteerOptions = {
  launch?: LaunchOptions | ((api: WithPuppeteerLaunchApi) => LaunchOptions),
  defaultUrl?: string,
}

const defaultOptions: WithPuppeteerOptions = {
  launch: ({ executablePath: { macOS } }) => ({ product: 'chrome', executablePath: macOS }),
  defaultUrl: 'http://localhost:5173',
}

export type PuppeteerContext = {
  puppeteer: {
    browser: Browser,
    page: Page,
    mouseClick: (selector: string) => void,
    tab: ({ direction, total }: { direction: 'forward' | 'backward', total: number }) => void,
    reloadNext: (url?: string ) => void,
  },
}

export function withPuppeteer<UserContext extends Context> (suite: Test<UserContext>, options: WithPuppeteerOptions = {}): Test<UserContext & PuppeteerContext> {
  const { launch: rawLaunch, defaultUrl } = { ...defaultOptions, ...options },
        launch = ensureLaunch(rawLaunch)

  let shouldReload = true,
      url = defaultUrl;

  suite.before(async context => {
    const browser = await puppeteer.launch(launch),
          page = (await browser.pages())[0],
          mouseClick: PuppeteerContext['puppeteer']['mouseClick'] = async selector => {
            const coords: DOMRect = await page.evaluate((selector: string) => JSON.parse(JSON.stringify(document.querySelector(selector).getBoundingClientRect())), selector)
            await page.mouse.click(coords.x, coords.y)
          },
          tab: PuppeteerContext['puppeteer']['tab'] = async ({ direction, total }) => {
            switch (direction) {
              case 'forward':
                for (let i = 0; i < total; i++) {
                  await page.keyboard.press('Tab')
                }
                break
              case 'backward':
                await page.keyboard.down('Shift')
                for (let i = 0; i < total; i++) {
                  await page.keyboard.press('Tab')
                }
                await page.keyboard.up('Shift')
                break
            }
          };

    (context as unknown as UserContext & PuppeteerContext).puppeteer = {
      browser,
      page,
      mouseClick,
      tab,
      reloadNext: u => {
        shouldReload = true
        if (u) url = u
      },
    }
  })

  suite.before.each(async context => {
    const { puppeteer: { page } } = context as unknown as UserContext & PuppeteerContext
    if (shouldReload) await page.goto(url)
    shouldReload = false
    url = defaultUrl
  })
  
  suite.after(async context => {
    await (context as unknown as UserContext & PuppeteerContext).puppeteer.browser.close()
  })

  return suite as Test<UserContext & PuppeteerContext>
}

export type WithPuppeteerLaunchApi = {
  executablePath: {
    macOS: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  }
}

const launchApi: WithPuppeteerLaunchApi = {
  executablePath: {
    macOS: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  }
}

function ensureLaunch (rawLaunch: WithPuppeteerOptions['launch']): LaunchOptions {
  return typeof rawLaunch === 'function'
    ? rawLaunch(launchApi)
    : rawLaunch
}
