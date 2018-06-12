import fs from 'fs'
import path from 'path'
import promisify from 'util.promisify'
import mustache from 'mustache'
import glob from 'glob-promise'

const templatePath = path.join(__dirname, '../../templates/keys.mustache')

const render = async (messages, options) => {
  const template = await promisify(fs.readFile)(templatePath, 'utf8')
  return mustache.render(template, {
    flow: options.flow,
    es5: options.type === 'es5' || typeof options.type === 'undefined',
    es6: options.type === 'es6',
    keys: JSON.stringify(messages, null, 2)
  })
}

const parse = async (file) => {
  const content = await promisify(fs.readFile)(file, 'utf8')
  return JSON.parse(content)
}

export default async (messagePath, options) => {
  const output = options.output || `${messagePath}/keys.js`

  const files = await glob(`${messagePath}/*.json`)
  const contents = await Promise.all(files.map(f => parse(f)))
  const uniqueKeys = Object.assign({}, ...contents)
  const keys = Object.keys(uniqueKeys).reduce((obj, key) => {
    obj[key] = key
    return obj
  }, {})

  await promisify(fs.writeFile)(
    output,
    await render(keys, options),
    'utf8'
  )
}
