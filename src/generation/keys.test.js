/* eslint-env jest */

import keys from './keys'
import fs from 'fs-extra'

const examples = {
  es5: 'fixtures/es5-keys.js',
  es6: 'fixtures/es6-keys.js',
  es5Flow: 'fixtures/es5-keys-flow.js',
  es6Flow: 'fixtures/es6-keys-flow.js'
}

const messagesPath = 'fixtures/messages'
const outputPath = 'output_test'
const keysFilePath = `${outputPath}/keys.js`

describe('keys', () => {
  beforeEach(() => {
    fs.mkdirSync(outputPath)
  })

  afterEach(() => {
    if (fs.existsSync(outputPath)) {
      fs.removeSync(outputPath)
    }
  })

  it('generates keys at the default path', async () => {
    fs.copySync(messagesPath, outputPath)

    await keys(outputPath, {})

    expect(fs.readFileSync(keysFilePath, 'utf8')).toEqual(fs.readFileSync(examples.es5, 'utf8'))
  })

  it('generates es5 keys', async () => {
    await keys(messagesPath, {
      output: keysFilePath,
      type: 'es5'
    })

    expect(fs.readFileSync(keysFilePath, 'utf8')).toEqual(fs.readFileSync(examples.es5, 'utf8'))
  })

  it('generates es6 keys', async () => {
    await keys(messagesPath, {
      output: keysFilePath,
      type: 'es6'
    })

    expect(fs.readFileSync(keysFilePath, 'utf8')).toEqual(fs.readFileSync(examples.es6, 'utf8'))
  })

  describe('with flow', () => {
    const flow = true
    it('generates es5 keys', async () => {
      await keys(messagesPath, {
        output: keysFilePath,
        type: 'es5',
        flow: flow
      })

      expect(fs.readFileSync(keysFilePath, 'utf8')).toEqual(fs.readFileSync(examples.es5Flow, 'utf8'))
    })

    it('generates es6 keys', async () => {
      await keys(messagesPath, {
        output: keysFilePath,
        type: 'es6',
        flow: flow
      })

      expect(fs.readFileSync(keysFilePath, 'utf8')).toEqual(fs.readFileSync(examples.es6Flow, 'utf8'))
    })
  })
})
