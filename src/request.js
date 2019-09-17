import request from 'request'

export const bundle = (apiToken, projectId) => new Promise((resolve, reject) => (
  request
    .post({
      url: `https://api.lokalise.com/api2/projects/${projectId}/files/download`,
      json: true,
      body: {
        format: 'json',
        original_filenames: false,
        bundle_filename: '%PROJECT_NAME%-intl.zip',
        bundle_structure: '%LANG_ISO%.%FORMAT%'
      },
      headers: {
        'x-api-token': apiToken,
        'content-type': 'application/json'
      }
    },
    async (err, httpResponse, body) => {
      if (err) {
        return reject(err)
      }
      if (httpResponse.statusCode >= 400) {
        if (body && body.error && body.error.message) {
          return reject(new Error(`API Error: ${body.error.message}`))
        } else {
          return reject(new Error(`HTTP Error ${httpResponse.statusCode}`))
        }
      }
      resolve(body.bundle_url)
    })
))
