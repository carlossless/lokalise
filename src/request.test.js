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
    project_id: projectId,
    bundle_url: 'https://s3-eu-west-1.amazonaws.com/lokalise-assets/files/export/796277985a61b2cdc3bd15.32504586/1523613069/Sample_Project-intl.zip'
  }
}

const mockTransaction = () => (
  nock(`https://api.lokalise.com/api2/projects/${projectId}`, {
    reqheaders: {
      'x-api-token': apiToken,
      'content-type': 'application/json'
    }
  })
    .post(`/files/download`)
)

describe('request', () => {
  describe('bundle', () => {
    beforeAll(() => {
      nock.disableNetConnect()
    })

    afterAll(() => {
      nock.cleanAll()
      nock.enableNetConnect()
    })

    it('requests, parses the response and returns the file path', async () => {
      expect.assertions(1)
      mockTransaction().reply(200, responses.success)

      await expect(request.bundle(apiToken, projectId)).resolves.toEqual(responses.success.bundle_url)
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
