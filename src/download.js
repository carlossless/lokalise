import request from 'request'
import unzip from 'unzip'
import https from 'https'
import fs from 'fs'

const getMessagesZipFileName = (outputPath) => `${outputPath}/messages-temporary.zip`

const downloadMessagesZip = (filename, outputPath) =>
  new Promise((resolve, reject) => {
    const file = fs.createWriteStream(getMessagesZipFileName(outputPath))

    https.get(
      `https://s3-eu-west-1.amazonaws.com/lokalise-assets/${filename}`,
      (response) => {
        response.pipe(file)

        file.on('error', (err) => {
          reject(err)
        })

        file.on('finish', () => {
          file.close(resolve)
        })
      },
    )
  })

const extractMessagesZip = (outputPath) =>
  new Promise((resolve, reject) => {
    fs
      .createReadStream(getMessagesZipFileName(outputPath))
      .pipe(unzip.Extract({ path: outputPath }))
      .on('error', (err) => reject(err))
      .on('close', () => resolve())
  })

const deleteMessagesZip = (outputPath) => {
  fs.unlinkSync(getMessagesZipFileName(outputPath))
}

const clean = (outputPath) => {
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath)
    return
  }

  const files = fs.readdirSync(outputPath)

  if (!files || files.length === 0) return

  files.forEach((file) => {
    fs.unlinkSync(`${outputPath}/${file}`)
  })
}

export const file = async (filename, outputPath) => {
  clean(outputPath)

  await downloadMessagesZip(filename, outputPath)
  await extractMessagesZip(outputPath)

  deleteMessagesZip(outputPath)
}
