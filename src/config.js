import pick from 'lodash/pick'
import read from './fs/read'
import rename from './object/rename'

const readFile = async (file) => {
  try {
    return await read(file || '.lokalise.json')
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
  let config = {}
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

const validate = (config) => {
  if (!config.token) throw Error('"token" is undefined')
  if (!config.project) throw Error('"project" is undefined')
  if (!config.output) throw Error('"output" is undefined')

  validateKeysFileConfig(config)
}

export const build = async (file, args) => {
  const envOptions = fetchEnvironmentConfig()
  const fileOptions = await fetchFileConfig(file) || {}
  const argOptions = pick(args, ['token', 'project', 'output'])

  const options = { ...envOptions, ...fileOptions, ...argOptions }

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

const validateKeysFileConfig = (config) => {
  // it's optional
  if (!config.keysFile) return

  // must be a boolean or an object
  if (typeof config.keysFile !== 'boolean' && typeof config.keysFile !== 'object') {
    throw 'keysFile must be a boolean or an object with { name, type, flow } props'
  }

  // if it's a config object, validate that
  if (typeof config.keysFile === 'object') {
    if (config.keysFile.name && typeof config.keysFile.name !== 'string') {
      throw 'keysFile.name must be a string'
    }

    if (config.keysFile.flow && typeof config.keysFile.flow !== 'boolean') {
      throw 'keysFile.flow must be a boolean'
    }

    if (
      config.keysFile.type &&
      config.keysFile.type !== 'es6_module' &&
      config.keysFile.type !== 'es5_module' &&
      config.keysFile.type !== 'json'
    ) {
      throw 'keysFile.type must be one of [ json | es6_module | es5_module ]'
    }
  }
}
