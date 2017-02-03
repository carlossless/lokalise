import fs from 'fs'

const exit = (desc, code=1) => {
  console.error(desc)
  process.exit(code)
}

export const read = () => {
  try {
    return fs.readFileSync('.lokalise.json', 'utf8')
  } catch (err) {
    exit('Configuration file ".lokalize.json" not found in working directory.')
  }
}

export const parse = (file) => {
  try {
    return JSON.parse(file)
  } catch (err) {
    exit('Couldn\'t parse ".lokalize.json". Is it a valid JSON file?')
  }
}

export const validate = ({ api_token, project_id, output_path }) => {
  if (!api_token || !project_id || !output_path) {
    if (!api_token) console.error('"api_token" is undefined')
    if (!project_id) console.error('"project_id" is undefined')
    if (!output_path) console.error('"output_path" is undefined')
    process.exit(1)
  }
}
