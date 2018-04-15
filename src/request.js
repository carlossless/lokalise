import request from 'request'

export const archive = (apiToken, projectId) => new Promise((resolve, reject) => (
  request
    .post({
      url: 'https://lokalise.co/api/project/export',
      form: {
        api_token: apiToken,
        id: projectId,
        type: 'json',
        bundle_filename: '%PROJECT_NAME%-intl.zip',
        bundle_structure: '%LANG_ISO%.%FORMAT%'
      }
    },
    async (err, httpResponse, body) => {
      if (err) {
        return reject(err)
      }
      if (httpResponse.statusCode >= 400) {
        return reject(Error(`HTTP Error ${httpResponse.statusCode}`))
      }
      const parsed = await JSON.parse(body)
      if (parsed.response.status === 'error') {
        return reject(Error(body))
      }
      resolve(parsed.bundle.file)
    })
))
