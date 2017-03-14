import fs from 'fs'

export const read = () => new Promise((resolve, reject) => {
  fs.readFile('.lokalise.json', 'utf8', (err, data) => {
    if (err) return reject('Configuration file ".lokalise.json" not found in working directory.')
    resolve(data)
  })
})

export const parse = async (file) => {
  try {
    return await JSON.parse(file)
  } catch (err) {
    throw 'Couldn\'t parse ".lokalise.json". Is it a valid JSON file?'
  }
}

export const validate = async ({ api_token, project_id, output_path }) => {
  if (!api_token) throw '"api_token" is undefined'
  if (!project_id) throw '"project_id" is undefined'
  if (!output_path) throw '"output_path" is undefined'
  return
}
