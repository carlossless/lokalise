import 'babel-polyfill'
import program from 'commander'
import * as config from './config'
import * as request from './request'
import * as download from './download'
import generateKeys from './generation/keys'

module.exports = async () => {
  program
    .version('0.0.5')
    .usage('[options] [config.json]')
    .description('Lokali.se client for retrieving localization files.')
    .option('-t, --token <token>', 'set the api token')
    .option('-p, --project <id>', 'set the project id')
    .option('-o, --output <path>', 'output path')
    .parse(process.argv)

  try {
    const conf = await config.build(program.args[0], program)
    const { token, project, output } = conf
    const file = await request.bundle(token, project)
    await download.archive(file, output)

    if (conf.keys) {
      await generateKeys(conf.output, conf.keys)
    }

    console.error('Localization updated')
  } catch (err) {
    console.error('Localization update failed')
    throw err
  }
}
