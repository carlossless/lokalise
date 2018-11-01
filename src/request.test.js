/* eslint-env jest */

import * as request from './request'
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

const mockTransaction = (extraParams = null) => {
  let params = {
    api_token: apiToken,
    id: projectId,
    type: 'json',
    bundle_filename: '%PROJECT_NAME%-intl.zip',
    bundle_structure: '%LANG_ISO%.%FORMAT%'
  }

  if (extraParams) {
    Object.assign(params, extraParams)
  }

  return nock('https://lokalise.co')
    .post('/api/project/export', params)
}

describe('request', () => {
  describe('bundle', () => {
    beforeAll(() => {
      nock.disableNetConnect()
    })

    afterAll(() => {
      nock.enableNetConnect()
    })

    it('requests, parses the response and returns the file path', async () => {
      expect.assertions(1)
      mockTransaction().reply(200, responses.success)

      await expect(request.bundle(apiToken, projectId)).resolves.toEqual(responses.success.bundle.file)
    })

    it('request includes optional extra params', async () => {
      const extraParams = {
        'export_empty': 'skip',
        'indentation': '4sp'
      }

      expect.assertions(1)
      mockTransaction(extraParams).reply(200, responses.success)

      await expect(request.bundle(apiToken, projectId, extraParams)).resolves.toEqual(responses.success.bundle.file)
    })

    it('throws on a non 200 status response', async () => {
      expect.assertions(1)
      mockTransaction().reply(400, {})

      await expect(request.bundle(apiToken, projectId)).rejects.toBeInstanceOf(Error)
    })

    it('throws if the payload has an error payload', async () => {
      expect.assertions(1)
      mockTransaction().reply(200, responses.error)

      await expect(request.bundle(apiToken, projectId)).rejects.toBeInstanceOf(Error)
    })

    it('throws if request encountered an error', async () => {
      expect.assertions(1)
      mockTransaction().replyWithError('Oops!')

      await expect(request.bundle(apiToken, projectId)).rejects.toBeInstanceOf(Error)
    })
  })
})
