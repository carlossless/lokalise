/* eslint-env jest */

import * as config from './config'

describe('config', () => {
  describe('build', () => {
    afterEach(() => {
      delete process.env.LOKALISE_TOKEN
      delete process.env.LOKALISE_PROJECT
      delete process.env.LOKALISE_OUTPUT
      delete process.env.LOKALISE_KEYS_FILE
    })

    it('loads all environment var config values', async () => {
      expect.assertions(4)

      process.env.LOKALISE_TOKEN = 'test_token'
      process.env.LOKALISE_PROJECT = 'test_project'
      process.env.LOKALISE_OUTPUT = 'test_output'

      // with no LOKALISE_KEYS_FILE set
      const conf1 = await config.build(null, { })

      expect(conf1).toEqual({
        token: 'test_token',
        project: 'test_project',
        output: 'test_output'
      })

      // with LOKALISE_KEYS_FILE set true, should be all default settings
      process.env.LOKALISE_KEYS_FILE = 'true'

      const conf2 = await config.build(null, { })

      expect(conf2).toEqual({
        token: 'test_token',
        project: 'test_project',
        output: 'test_output',
        keysFile: {
          name: 'keys.json',
          type: 'json',
          flow: false
        }
      })

      // with LOKALISE_KEYS_FILE set false
      process.env.LOKALISE_KEYS_FILE = 'false'

      const conf3 = await config.build(null, { })

      expect(conf3).toEqual({
        token: 'test_token',
        project: 'test_project',
        output: 'test_output'
      })

      // with LOKALISE_KEYS_FILE config specifified as JSON
      process.env.LOKALISE_KEYS_FILE = '{ "name": "custom.js", "type": "es6", "flow": true }'

      const conf4 = await config.build(null, { })

      expect(conf4).toEqual({
        token: 'test_token',
        project: 'test_project',
        output: 'test_output',
        // should match passed JSON
        keysFile: {
          name: 'custom.js',
          type: 'es6',
          flow: true
        }
      })
    })

    it('loads all file config values', async () => {
      expect.assertions(1)

      const conf = await config.build('fixtures/.lokalise.json', { })

      expect(conf).toEqual({
        token: 'f99e5a8a45345745d6aa49327dbbcba54b9d2f3e',
        project: '796277985a61b2cdc3bd15.32504586',
        output: 'output/path'
      })
    })

    it('loads all option config values', async () => {
      expect.assertions(1)

      const conf = await config.build('fixtures/.lokalise.json', {
        token: 'test_token',
        project: 'test_project',
        output: 'test_output'
      })

      expect(conf).toEqual({
        token: 'test_token',
        project: 'test_project',
        output: 'test_output'
      })
    })

    it('correctly collects and overrides configuration values', async () => {
      expect.assertions(1)
      process.env.LOKALISE_TOKEN = 'test_token'

      const conf = await config.build('fixtures/.lokalise.partial.json', { output: 'test' })

      expect(conf).toEqual({
        token: 'test_token',
        project: '796277985a61b2cdc3bd15.32504586',
        output: 'test'
      })
    })

    it('fails when not all required values are not collected', async () => {
      expect.assertions(4)

      await expect(config.build('fixtures/.lokalise.partial.json', { })).rejects.toBeInstanceOf(Error)
      await expect(config.build('fixtures/.lokalise.json', { project: '' })).rejects.toBeInstanceOf(Error)
      await expect(config.build('fixtures/.lokalise.json', { output: '' })).rejects.toBeInstanceOf(Error)
      await expect(config.build('', { })).rejects.toBeInstanceOf(Error)
    })

    it('fails when no file found', async () => {
      expect.assertions(1)

      await expect(config.build('fixtures/.lokalise.nothing.json', { })).rejects.toHaveProperty('code', 'ENOENT')
    })
  })
})
