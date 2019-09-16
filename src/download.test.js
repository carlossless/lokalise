/* eslint-env jest */

import * as download from './download'
import nock from 'nock'
import fs from 'fs-extra'
import path from 'path'

const outputDir = 'output_test'
const baseUrl = 'https://s3-eu-west-1.amazonaws.com'
const pathUrl = '/lokalise-assets/test.zip'
const fullUrl = `${baseUrl}${pathUrl}`

const mockTransaction = () => (
  nock(baseUrl)
    .get(pathUrl)
)

describe('download', () => {
  describe('archive', () => {
    beforeAll(() => {
      nock.disableNetConnect()
    })

    afterAll(() => {
      nock.cleanAll()
      nock.enableNetConnect()
    })

    afterEach(() => {
      if (fs.existsSync(outputDir)) {
        fs.removeSync(outputDir)
      }
    })

    it('downloads and unzips translation payload', async () => {
      expect.assertions(2)
      mockTransaction().replyWithFile(
        200,
        path.join(__dirname, '../fixtures/complete.zip'),
        { 'Content-Type': 'application/octet-stream' }
      )

      await download.archive(fullUrl, outputDir)

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

    it('throws when a corrupted file is downloaded', async () => {
      expect.assertions(1)
      mockTransaction().replyWithFile(
        200,
        path.join(__dirname, '../fixtures/partial.zip'),
        { 'Content-Type': 'application/octet-stream' }
      )

      await expect(download.archive(fullUrl, outputDir)).rejects.toBeInstanceOf(Error)
    })

    it('throws when response has non successful code', async () => {
      expect.assertions(1)
      mockTransaction().reply(400, 'Not Found')

      await expect(download.archive(fullUrl, outputDir)).rejects.toBeInstanceOf(Error)
    })

    it('throws when response has non zip content-type', async () => {
      expect.assertions(1)
      mockTransaction().reply(200, 'Not a zip file!', { 'Content-Type': 'text/plain' })

      await expect(download.archive(fullUrl, outputDir)).rejects.toBeInstanceOf(Error)
    })
  })
})
