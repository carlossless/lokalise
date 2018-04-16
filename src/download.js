import request from 'request'
import unzpr from 'unzip-stream'

export default (filename, outputPath) => new Promise((resolve, reject) => {
  const req = request.get(`https://s3-eu-west-1.amazonaws.com/lokalise-assets/${filename}`)
  req.pipe(unzpr.Extract({ path: outputPath }))
    .on('error', (err) => reject(err))
    .on('close', () => resolve())
})
