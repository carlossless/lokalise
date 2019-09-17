import fs from 'fs'
import promisify from 'util.promisify'
import pick from 'lodash/pick'
import rename from './object/rename'

const readFile = async (file) => {
  try {
    return await promisify(fs.readFile)(file || '.lokalise.json', 'utf8')
  } catch (err) {
    if (file) {
      throw err
    }
  }
}

const bridgeLegacy = (opts) => (
  {
    ...rename(
      opts,
      ['api_token', 'project_id', 'output_path'],
      ['token', 'project', 'output']
    ),
    ...pick(opts, ['token', 'project', 'output'])
  }
)

const fetchFileConfig = async (file) => {
  const contents = await readFile(file)
  if (contents) {
    const config = JSON.parse(contents)
    return bridgeLegacy(config)
  }
  return null
}

const fetchEnvironmentConfig = () => {
  const config = {}
  if (process.env.LOKALISE_TOKEN) {
    config.token = process.env.LOKALISE_TOKEN
  }
  if (process.env.LOKALISE_PROJECT) {
    config.project = process.env.LOKALISE_PROJECT
  }
  if (process.env.LOKALISE_OUTPUT) {
    config.output = process.env.LOKALISE_OUTPUT
  }
  return config
}

const validate = ({ token, project, output }) => {
  if (!token) throw Error('"token" is undefined')
  if (!project) throw Error('"project" is undefined')
  if (!output) throw Error('"output" is undefined')
}

export const build = async (file, args) => {
  const envOptions = fetchEnvironmentConfig()
  const fileOptions = await fetchFileConfig(file) || {}
  const argOptions = pick(args, ['token', 'project', 'output'])

  const options = { ...fileOptions, ...envOptions, ...argOptions }

  try {
    validate(options)
  } catch (err) {
    if (Object.keys(fileOptions).length === 0) {
      console.warn('HINT: It seems that you don\'t have a .lokalise.json file in your directory or you haven\'t specified any options in it.')
    }
    throw err
  }

  return options
}
