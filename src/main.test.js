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
    expect(fs.readdirSync(outputDir)).toEqual([
      'de.json',
      'en.json',
      'fr.json',
      'he.json',
      'ja.json',
      'ru.json',
      'zh_CN.json'
    ])
  })
})
