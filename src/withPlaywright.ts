import { chromium as playwright } from 'playwright-core'
import type {
  LaunchOptions,
  Browser,
  BrowserContext,
  Page,
} from 'playwright-core'
import type { Test, Context } from 'uvu'

export type WithPlaywrightOptions = {
  launch?: LaunchOptions | ((api: WithPlaywrightLaunchApi) => LaunchOptions),
  defaultUrl?: string,
}

const defaultOptions: WithPlaywrightOptions = {
  launch: ({ executablePath: { macOS } }) => ({ product: 'chrome', executablePath: macOS }),
  defaultUrl: 'http://localhost:5173',
}

export type PlaywrightContext = {
  playwright: {
    browser: Browser,
    browserContext: BrowserContext,
    page: Page,
    mouseClick: (selector: string) => void,
    tab: ({ direction, total }: { direction: 'forward' | 'backward', total: number }) => void,
    reloadNext: (url?: string ) => void,
  },
}

export function withPlaywright<UserContext extends Context> (suite: Test<UserContext>, options: WithPlaywrightOptions = {}): Test<UserContext & PlaywrightContext> {
  const { launch: rawLaunch, defaultUrl } = { ...defaultOptions, ...options },
        launch = ensureLaunch(rawLaunch)

  const cache: {
    shouldReload: boolean,
    url: string
  } = {
    shouldReload: true,
    url: defaultUrl,
   }

  suite.before(async context => {
    const browser = await playwright.launch(launch),
          browserContext = await browser.newContext(),
          page = await browserContext.newPage(),
          mouseClick: PlaywrightContext['playwright']['mouseClick'] = async selector => {
            const coords: DOMRect = await page.evaluate((selector: string) => JSON.parse(JSON.stringify(document.querySelector(selector).getBoundingClientRect())), selector)
            await page.mouse.click(coords.x, coords.y)
          },
          tab: PlaywrightContext['playwright']['tab'] = async ({ direction, total }) => {
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

    (context as unknown as UserContext & PlaywrightContext).playwright = {
      browser,
      browserContext,
      page,
      mouseClick,
      tab,
      reloadNext: url => {
        cache.shouldReload = true
        if (url) cache.url = url
      },
    }
  })

  suite.before.each(async context => {
    const { playwright: { page } } = context as unknown as UserContext & PlaywrightContext
    if (cache.shouldReload) await page.goto(cache.url)
    cache.shouldReload = false
    cache.url = defaultUrl
  })
  
  suite.after(async context => {
    await (context as unknown as UserContext & PlaywrightContext).playwright.browser.close()
  })

  return suite as Test<UserContext & PlaywrightContext>
}

export type WithPlaywrightLaunchApi = {
  executablePath: {
    macOS: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  }
}

const launchApi: WithPlaywrightLaunchApi = {
  executablePath: {
    macOS: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  }
}

function ensureLaunch (rawLaunch: WithPlaywrightOptions['launch']): LaunchOptions {
  return typeof rawLaunch === 'function'
    ? rawLaunch(launchApi)
    : rawLaunch
}
