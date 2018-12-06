/* eslint-env jest */

import * as config from './config'

describe('config', () => {
  describe('build', () => {
    afterEach(() => {
      delete process.env.LOKALISE_TOKEN
      delete process.env.LOKALISE_PROJECT
      delete process.env.LOKALISE_OUTPUT
    })

    it('loads all environment var config values', async () => {
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

    it('loads all file config values', async () => {
      expect.assertions(1)

      const conf = await config.build('fixtures/.lokalise.json', { })

      expect(conf).toEqual({
        token: 'f99e5a8a45345745d6aa49327dbbcba54b9d2f3e',
        project: '796277985a61b2cdc3bd15.32504586',
        output: 'output/path'
      })
    })

    it('env values override file values', async () => {
      expect.assertions(1)

      process.env.LOKALISE_TOKEN = 'test_token_env'
      process.env.LOKALISE_PROJECT = 'test_project_env'
      process.env.LOKALISE_OUTPUT = 'test_output_env'
      const conf = await config.build('fixtures/.lokalise.json', { })

      expect(conf).toEqual({
        token: 'test_token_env',
        project: 'test_project_env',
        output: 'test_output_env'
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
