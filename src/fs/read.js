import fs from 'fs'

export default (file) => new Promise((resolve, reject) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) return reject(err)
    resolve(data)
  })
})
