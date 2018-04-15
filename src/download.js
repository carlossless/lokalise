import request from 'request'
import unzipper from 'unzipper'

export default (filename, outputPath) => new Promise((resolve, reject) => {
  request
    .get(`https://s3-eu-west-1.amazonaws.com/lokalise-assets/${filename}`)
    .pipe(unzipper.Extract({ path: outputPath }))
    .on('error', (err) => reject(err))
    .on('finish', () => resolve())
})
