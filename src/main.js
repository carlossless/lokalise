import 'babel-polyfill'
import program from 'commander'
import * as config from './config'
import * as request from './request'
import download from './download'
import createKeysFile from './generation/keys'

program
  .version('0.0.4')
  .usage('[options] [file.json]')
  .description('Lokali.se client for retrieving localization files.')
  .option('-t, --token', 'set the api token')
  .option('-p, --project', 'set the project id')
  .option('-o, --output', 'output Path')
  .parse(process.argv)

const main = async () => {
  try {
    const conf = await config.build(program.args[0], program)
    const { token, project, output } = conf
    const file = await request.archive(token, project)
    await download(file, output)

    if (conf.keysFile) {
      createKeysFile(conf.output, conf.keysFile)
    }

    console.log('Localization Updated')
  } catch (err) {
    console.log('Localization Update Failed', err)
  }
}

main()
