/* eslint-env jest */

import main from './main'
import rimraf from 'rimraf'
import fs from 'fs'

const outputDir = 'output/path'

describe('main', () => {
  afterEach(() => {
    if (fs.existsSync(outputDir)) {
      rimraf.sync(outputDir)
    }
  })

  it('successfully retrieves and stores localizations', async () => {
    process.argv = ['lokalise', 'main.js', 'fixtures/.lokalise.json']

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
    process.argv = ['lokalise', 'main.js', 'fixtures/.lokalise.keys.json']

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
    process.argv = ['lokalise', 'main.js', 'fixtures/.lokalise.json', '--token', 'bad_token']

    await main()

    expect(fs.existsSync(outputDir)).toEqual(false)
  })
})
