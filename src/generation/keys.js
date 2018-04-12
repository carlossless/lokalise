import fs from 'fs'
import keys from 'lodash/keys'

// print object as JSON string indented with 2 spaces
const prettyString = (object) => JSON.stringify(object, null, 2)

const DEFAULT_FILE_TYPE = 'json'

const getKeysFileName = (keysFile) => {
  let name = 'keys.'

  if (typeof keysFile !== 'object') {
    return name + DEFAULT_FILE_TYPE
  }

  if (keysFile.name) {
    return keysFile.name
  }

  switch (keysFile.type) {
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

const ES6_MODULE_TEMPLATE = (keyMapJSON, withFlowType) => (
  `${withFlowType ? '// @flow' : ''}
  const keys = ${keyMapJSON}

  export default keys

  `
)

const ES5_MODULE_TEMPLATE = (keyMapJSON, withFlowType) => (
  `${withFlowType ? '// @flow' : ''}
  var keys = ${keyMapJSON}

  module.exports = keys

  `
)

const getFileContent = (keyMap, keysFile) => {
  const keyMapJSON = prettyString(keyMap)

  switch (keysFile.type) {
    case 'es6_module':
      return ES6_MODULE_TEMPLATE(keyMapJSON, !!keysFile.flow)
    case 'es5_module':
      return ES5_MODULE_TEMPLATE(keyMapJSON, !!keysFile.flow)
    default:
      return keyMapJSON
  }
}

export default (outputPath, keysFile) => {
  const keysFileName = getKeysFileName(keysFile)

  const files = fs.readdirSync(outputPath)

  if (!files || files.length === 0) {
    throw Error('Could not create keys file, no messages files exist')
  }

  const keyMap = {}

  // assumption: all files have the same message keys
  // anyway the source file is logged, for info purposes
  const firstMessagesFilePath = `${outputPath}/${files[0]}`
  const firstMessagesFileContent = JSON.parse(
    fs.readFileSync(firstMessagesFilePath, 'utf8')
  )

  keys(firstMessagesFileContent).forEach((key) => {
    keyMap[key] = key
  })

  const keysFilePath = `${outputPath}/${keysFileName}`
  fs.writeFileSync(keysFilePath, getFileContent(keyMap, keysFile), 'utf8')

  console.log(
    `Created keys file\n    > ${keysFilePath}\n  using message keys from\n    > ${firstMessagesFilePath}\n`
  )
}
