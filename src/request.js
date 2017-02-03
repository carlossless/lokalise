import request from 'request'
import unzip from 'unzip'

export const publish = (apiToken, projectId) => new Promise((resolve, reject) => (
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
      resolve(JSON.parse(body).bundle.file)
    })
))

export const file = (filename, outputPath) => new Promise((resolve, reject) => (
  request
    .get(`https://s3-eu-west-1.amazonaws.com/lokalise-assets/${filename}`)
    .on('error', (err) => reject(err))
    .on('data', () => resolve())
    .pipe(unzip.Extract({ path: outputPath }))
))
