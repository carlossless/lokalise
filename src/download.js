import request from 'request'
import unzpr from 'unzip-stream'

export const archive = (filename, outputPath) => new Promise((resolve, reject) => {
  const req = request.get(`https://s3-eu-west-1.amazonaws.com/lokalise-assets/${filename}`)
    .on('response', function (response) {
      if (response.statusCode >= 400) {
        req.destroy()
        return reject(Error(`Bad Status Code: ${response.statusCode}`))
      }
      if (response.headers['content-type'] !== 'application/octet-stream') {
        req.destroy()
        return reject(Error(`Bad Content-Type: ${response.headers['content-type']}`))
      }
    })
  req.pipe(unzpr.Extract({ path: outputPath }))
    .on('error', (err) => reject(err))
    .on('close', () => resolve())
})
