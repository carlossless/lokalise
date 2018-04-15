/* eslint-env jest */

import { archive } from './request'
import nock from 'nock'

const apiToken = 'apiToken'
const projectId = 'projectId'

const responses = {
  error: {
    response: {
      status: 'error',
      code: '4040',
      message: 'Project owner needs to upgrade subscription to access API'
    }
  },
  success: {
    bundle: {
      file: 'files/export/796277985a61b2cdc3bd15.32504586/1523613069/Sample_Project-intl.zip',
      full_file: 'https://s3-eu-west-1.amazonaws.com/lokalise-assets/files/export/796277985a61b2cdc3bd15.32504586/1523613069/Sample_Project-intl.zip'
    },
    response: {
      status: 'success',
      code: '200',
      message: 'OK'
    }
  }
}

const mockTransaction = (code, data) => {
  nock('https://lokalise.co')
    .post('/api/project/export', {
      api_token: apiToken,
      id: projectId,
      type: 'json',
      bundle_filename: '%PROJECT_NAME%-intl.zip',
      bundle_structure: '%LANG_ISO%.%FORMAT%'
    })
    .reply(code, data)
}

describe('request', () => {
  beforeAll(() => {
    nock.disableNetConnect()
  })

  afterAll(() => {
    nock.enableNetConnect()
  })

  it('requests, parses the response and returns the file path', async () => {
    expect.assertions(1)
    mockTransaction(200, responses.success)
    await expect(await archive(apiToken, projectId)).toEqual(responses.success.bundle.file)
  })

  it('throws on a non 200 status response', async () => {
    expect.assertions(1)
    mockTransaction(400, {})
    await expect(archive(apiToken, projectId)).rejects.toBeInstanceOf(Error)
  })

  it('throws if the payload has an error payload', async () => {
    expect.assertions(1)
    mockTransaction(200, responses.error)
    await expect(archive(apiToken, projectId)).rejects.toBeInstanceOf(Error)
  })
})
