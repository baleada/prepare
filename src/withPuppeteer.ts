import puppeteer from 'puppeteer-core'
import type { Test } from 'uvu'

type Options = {
  launch?: puppeteer.LaunchOptions | ((api: LaunchApi) => puppeteer.LaunchOptions),
  contextKey?: string,
}

const defaultOptions: Options = {
  launch: ({ executablePath: { macOS } }) => ({ product: 'chrome', executablePath: macOS }),
  contextKey: 'puppeteer',
}

export default function withPuppeteer (suite: Test, options = {}) {
  const { launch: rawLaunch, contextKey } = { ...defaultOptions, ...options },
        launch = ensureLaunch(rawLaunch)

  suite.before(async context => {
    const browser = await puppeteer.launch(launch),
          page = (await browser.pages())[0],
          mouseClick = async (selector: string) => {
            const coords: DOMRect = await page.evaluate((selector: string) => JSON.parse(JSON.stringify(document.querySelector(selector).getBoundingClientRect())), selector)
            await page.mouse.click(coords.x, coords.y)
          },
          tab = async ({ direction, total }: { direction: 'forward' | 'backward', total: number }) => {
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

    context[contextKey] = { browser, page, mouseClick, tab }
  })
  
  suite.after(async context => {
    await context[contextKey].browser.close()
  })

  return suite
}

type LaunchApi = {
  executablePath: {
    macOS: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  }
}

const launchApi: LaunchApi = {
  executablePath: {
    macOS: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  }
}

export function ensureLaunch (rawLaunch: Options['launch']): puppeteer.LaunchOptions {
  return typeof rawLaunch === 'function'
    ? rawLaunch(launchApi)
    : rawLaunch
}
