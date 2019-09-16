import request from 'request'

export const bundle = (apiToken, projectId) => new Promise((resolve, reject) => (
  request
    .post({
      url: `https://api.lokalise.com/api2/projects/${projectId}/files/download`,
      json: true,
      body: {
        "format": "json",
        "original_filenames": true
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
        return reject(Error(`HTTP Error ${httpResponse.statusCode}`))
      }
      resolve(body.bundle_url)
    })
))
