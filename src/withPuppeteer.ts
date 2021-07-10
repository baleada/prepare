import puppeteer from 'puppeteer-core'
import type { Test, Context as UvuContext } from 'uvu'

export type Options = {
  launch?: puppeteer.LaunchOptions | ((api: LaunchApi) => puppeteer.LaunchOptions),
}

const defaultOptions: Options = {
  launch: ({ executablePath: { macOS } }) => ({ product: 'chrome', executablePath: macOS }),
}

export type PuppeteerContext = {
  puppeteer: {
    browser: puppeteer.Browser,
    page: puppeteer.Page,
    mouseClick: (selector: string) => void,
    tab: ({ direction, total }: { direction: 'forward' | 'backward', total: number }) => void,
  }
}

export function withPuppeteer<Context extends UvuContext> (suite: Test<Context>, options = {}): Test<Context & PuppeteerContext> {
  const { launch: rawLaunch } = { ...defaultOptions, ...options },
        launch = ensureLaunch(rawLaunch)

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
          }

    (context as unknown as Context & PuppeteerContext).puppeteer = { browser, page, mouseClick, tab }
  })
  
  suite.after(async context => {
    await context.puppeteer.browser.close()
  })

  return suite as Test<Context & PuppeteerContext>
}

export type LaunchApi = {
  executablePath: {
    macOS: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  }
}

const launchApi: LaunchApi = {
  executablePath: {
    macOS: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  }
}

function ensureLaunch (rawLaunch: Options['launch']): puppeteer.LaunchOptions {
  return typeof rawLaunch === 'function'
    ? rawLaunch(launchApi)
    : rawLaunch
}
