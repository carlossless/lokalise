import pick from 'lodash/pick'
import includes from 'lodash/includes'
import read from './fs/read'
import rename from './object/rename'

const KEYS_FILE_CONFIG_DEFAULT = {
  name: 'keys.json',
  type: 'json',
  flow: false
}

const validateKeysFileConfig = (candidate) => {
  for (const field in candidate) {
    if (!includes(['name', 'type', 'flow'], field)) {
      throw Error(`Invalid $[{field}] field passed in keysFile config`)
    }
  }

  if (
    candidate.name !== undefined &&
    typeof candidate.name !== 'string'
  ) {
    throw Error(`keysFile.name must be a string`)
  }

  if (
    candidate.type !== undefined &&
    typeof candidate.type !== 'string'
  ) {
    if (typeof candidate.type !== 'string') {
      throw Error(`keysFile.name must be a string`)
    } else if (
      candidate.type !== 'json' &&
      candidate.type !== 'es5' &&
      candidate.type !== 'es6'
    ) {
      throw Error(`keysFile.name must be one of { 'json', 'es5', 'es6' }`)
    }
  }

  if (
    candidate.flow !== undefined &&
    typeof candidate.flow !== 'boolean'
  ) {
    throw Error(`keysFile.flow must be a boolean`)
  }
}

const populateUndefinedKeyFilesConfigValuesWithDefaults = (keyFiles) => ({
  name: keyFiles.name || KEYS_FILE_CONFIG_DEFAULT.name,
  type: keyFiles.type || KEYS_FILE_CONFIG_DEFAULT.type,
  flow: keyFiles.flow || KEYS_FILE_CONFIG_DEFAULT.flow
})

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

  if (process.env.LOKALISE_KEYS_FILE) {
    if (process.env.LOKALISE_KEYS_FILE === 'true') {
      // allow true to be passed, setting all default config if so
      config.keysFile = KEYS_FILE_CONFIG_DEFAULT
    } else if (process.env.LOKALISE_KEYS_FILE === 'false') {
      // allow 'false' to be passed, and just do nothing if it is
    } else {
      // otherwise, try to parse the passed value as JSON, erroring if it is malformed
      try {
        config.keysFile = JSON.parse(process.env.LOKALISE_KEYS_FILE)
      } catch (error) {
        throw Error('"LOKALISE_KEYS_FILE" env var value contains malformed JSON')
      }
    }
  }

  return config
}

const validate = ({ token, project, output, keysFile }) => {
  if (!token) throw Error('"token" is undefined')
  if (!project) throw Error('"project" is undefined')
  if (!output) throw Error('"output" is undefined')
  if (keysFile) validateKeysFileConfig(keysFile)
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

  if (options.keysFile) {
    options.keysFile = populateUndefinedKeyFilesConfigValuesWithDefaults(options.keysFile)
  }

  return options
}
