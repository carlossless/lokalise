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

    describe('environment var config values', () => {
      it('loads environment var config values with no LOKALISE_KEYS_FILE set', async () => {
        expect.assertions(1)

        process.env.LOKALISE_TOKEN = 'test_token'
        process.env.LOKALISE_PROJECT = 'test_project'
        process.env.LOKALISE_OUTPUT = 'test_output'

        const conf = await config.build(null, { })

        expect(conf).toEqual({
          token: 'test_token',
          project: 'test_project',
          output: 'test_output'
        })
      })

      it('loads environment var config values with LOKALISE_KEYS_FILE=true', async () => {
        expect.assertions(1)

        process.env.LOKALISE_TOKEN = 'test_token'
        process.env.LOKALISE_PROJECT = 'test_project'
        process.env.LOKALISE_OUTPUT = 'test_output'

        process.env.LOKALISE_KEYS_FILE = 'true'

        const conf = await config.build(null, { })

        const expectedDefaultKeysFileValues = {
          name: 'keys.json',
          type: 'json',
          flow: false
        }

        expect(conf).toEqual({
          token: 'test_token',
          project: 'test_project',
          output: 'test_output',
          keysFile: expectedDefaultKeysFileValues
        })
      })

      it('loads environment var config values with LOKALISE_KEYS_FILE=false', async () => {
        expect.assertions(1)

        process.env.LOKALISE_TOKEN = 'test_token'
        process.env.LOKALISE_PROJECT = 'test_project'
        process.env.LOKALISE_OUTPUT = 'test_output'

        process.env.LOKALISE_KEYS_FILE = 'false'

        const conf = await config.build(null, { })

        expect(conf).toEqual({
          token: 'test_token',
          project: 'test_project',
          output: 'test_output'
        })
      })

      it('loads environment var config values with custom LOKALISE_KEYS_FILE values', async () => {
        expect.assertions(1)

        process.env.LOKALISE_TOKEN = 'test_token'
        process.env.LOKALISE_PROJECT = 'test_project'
        process.env.LOKALISE_OUTPUT = 'test_output'

        process.env.LOKALISE_KEYS_FILE = '{ "name": "custom.js", "type": "es6", "flow": true }'

        const conf = await config.build(null, { })

        // matches JSON value passed as LOKALISE_KEYS_FILE
        const expectedKeysFileValues = {
          name: 'custom.js',
          type: 'es6',
          flow: true
        }

        expect(conf).toEqual({
          token: 'test_token',
          project: 'test_project',
          output: 'test_output',
          keysFile: expectedKeysFileValues
        })
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
