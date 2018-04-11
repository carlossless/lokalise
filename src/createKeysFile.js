import fs from 'fs'
import keys from 'lodash/keys'

// print object as JSON string indented with 2 spaces
const prettyString = (object) => JSON.stringify(object, null, 2)

const DEFAULT_FILE_TYPE = 'json'

const getKeysFileName = (keys_file) => {
  let name = 'keys.'

  if (typeof keys_file !== 'object') {
    return name + DEFAULT_FILE_TYPE
  }

  if (keys_file.name) {
    return keys_file.name
  }

  switch (keys_file.type) {
    case 'es6_module':
      name += 'js'
      break
    case 'es5_module':
      name += 'js'
      break
    default:
      name += DEFAULT_FILE_TYPE
  }

  return name
}

const ES6_MODULE_TEMPLATE = (keyMapJSON, withFlowType) => `
${withFlowType ? '// @flow' : ''}
const keys = ${keyMapJSON}

export default keys

`

const ES5_MODULE_TEMPLATE = (keyMapJSON, withFlowType) => `
${withFlowType ? '// @flow' : ''}
const keys = ${keyMapJSON}

module.exports = keys

`

const getFileContent = (keyMap, keys_file) => {
  const keyMapJSON = prettyString(keyMap)

  switch (keys_file.type) {
    case 'es6_module':
      return ES6_MODULE_TEMPLATE(keyMapJSON, !!keys_file.flow)
    case 'es5_module':
      return ES5_MODULE_TEMPLATE(keyMapJSON, !!keys_file.flow)
    default:
      return keyMapJSON
  }
}

export default (output_path, keys_file) => {
  const keysFileName = getKeysFileName(keys_file)

  const files = fs.readdirSync(output_path)

  if (!files || files.length === 0) {
    throw 'Could not create keys file, no messages files exist'
  }

  const keyMap = {}

  // assumption: all files have the same message keys
  // anyway the source file is logged, for info purposes
  const firstMessagesFilePath = `${output_path}/${files[0]}`
  const firstMessagesFileContent = JSON.parse(
    fs.readFileSync(firstMessagesFilePath, 'utf8'),
  )

  keys(firstMessagesFileContent).forEach((key) => {
    keyMap[key] = key
  })

  const keysFilePath = `${output_path}/${keysFileName}`
  fs.writeFileSync(keysFilePath, getFileContent(keyMap, keys_file), 'utf8')

  console.log(
    `Created keys file\n    > ${keysFilePath}\n  using message keys from\n    > ${firstMessagesFilePath}\n`,
  )
}
