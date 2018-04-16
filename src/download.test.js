/* eslint-env jest */

import download from './download'
import nock from 'nock'
import rimraf from 'rimraf'
import fs from 'fs'
import path from 'path'

const outputDir = 'output_test'

const mockTransaction = () => (
  nock('https://s3-eu-west-1.amazonaws.com')
    .get('/lokalise-assets/test.zip')
)

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
    mockTransaction().replyWithFile(
      200,
      path.join(__dirname, '../fixtures/complete.zip'),
      { 'Content-Type': 'application/zip' }
    )

    await download('test.zip', outputDir)

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

  it('throws when a corrupted file is donwloaded', async () => {
    expect.assertions(1)
    mockTransaction().replyWithFile(
      200,
      path.join(__dirname, '../fixtures/partial.zip'),
      { 'Content-Type': 'application/zip' }
    )

    await expect(download('test.zip', outputDir)).rejects.toBeInstanceOf(Error)
  })

  it('throws when response has non successful code', async () => {
    expect.assertions(1)
    mockTransaction().reply(400, 'Not Found')

    await expect(download('test.zip', outputDir)).rejects.toBeInstanceOf(Error)
  })

  it('throws when response has non zip content-type', async () => {
    expect.assertions(1)
    mockTransaction().reply(200, 'Not a zip file!', { 'Content-Type': 'text/plain' })

    await expect(download('test.zip', outputDir)).rejects.toBeInstanceOf(Error)
  })
})
