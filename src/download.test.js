/* eslint-env jest */

import download from './download'
import nock from 'nock'
import rimraf from 'rimraf'
import fs from 'fs'
import path from 'path'

const outputDir = 'output_test'

describe('download', () => {
  beforeAll(() => {
    nock.disableNetConnect()
  })

  afterAll(() => {
    nock.enableNetConnect()
  })

  afterEach(() => {
    if (fs.existsSync(outputDir)) {
      rimraf.sync(outputDir)
    }
  })

  it('downloads and unzips translation payload', async () => {
    expect.assertions(2)

    nock('https://s3-eu-west-1.amazonaws.com')
      .get('/lokalise-assets/test.zip')
      .replyWithFile(
        200,
        path.join(__dirname, '../fixtures/Sample_Project-intl.zip')
      )

    await download('test.zip', outputDir)

    expect(fs.existsSync(outputDir)).toEqual(true)
    expect(fs.readdirSync(outputDir)).toEqual([
      'de.json',
      'en.json',
      'fr.json',
      'ja.json',
      'ru.json',
      'zh_CN.json'
    ])
  })
})
