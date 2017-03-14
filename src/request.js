import request from 'request'
import unzipper from 'unzipper'

export const archive = (apiToken, projectId) => new Promise((resolve, reject) => (
  request
    .post({
      url: 'https://lokalise.co/api/project/export',
      form: {
        api_token: apiToken,
        id: projectId,
        type: 'json',
        bundle_filename: '%PROJECT_NAME%-intl.zip',
        bundle_structure: '%LANG_ISO%.json'
      }
    },
    (err, httpResponse, body) => {
      if (err) {
        return reject(err)
      }
      if (httpResponse.statusCode >= 400) {
        return reject(`HTTP Error ${httpResponse.statusCode}`)
      }
      resolve(JSON.parse(body).bundle.file)
    })
))
