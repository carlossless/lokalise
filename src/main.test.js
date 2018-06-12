/* eslint-env jest */

import main from './main'
import fs from 'fs-extra'

const outputDir = 'output/path'

let describeWithToken = describe.skip
if (process.env.LOKALISE_TOKEN) {
  describeWithToken = describe
} else {
  console.error('Skipping integration test because LOKALISE_TOKEN is not specified')
}

describeWithToken('main', () => {
  afterEach(() => {
    if (fs.existsSync(outputDir)) {
      fs.removeSync(outputDir)
    }
  })

  it('successfully retrieves and stores localizations', async () => {
    process.argv = ['lokalise', 'main.js', 'fixtures/.lokalise.partial.json']

    await main()

    expect(fs.existsSync(outputDir)).toEqual(true)
    expect(fs.readdirSync(outputDir)).toEqual(expect.arrayContaining([
      'de.json',
      'en.json',
      'fr.json',
      'he.json',
      'ja.json',
      'ru.json',
      'zh_CN.json'
    ]))
  })

  it('successfully creates a keys file', async () => {
    process.argv = ['lokalise', 'main.js', 'fixtures/.lokalise.partial.keys.json']

    await main()

    expect(fs.existsSync(outputDir)).toEqual(true)
    expect(fs.readdirSync(outputDir)).toEqual(expect.arrayContaining([
      'de.json',
      'en.json',
      'fr.json',
      'he.json',
      'ja.json',
      'keys.js',
      'ru.json',
      'zh_CN.json'
    ]))
  })

  it('fails to retrieve localizations', async () => {
    process.argv = ['lokalise', 'main.js', 'fixtures/.lokalise.partial.json', '--token', 'bad_token']

    await main()

    expect(fs.existsSync(outputDir)).toEqual(false)
  })
})
