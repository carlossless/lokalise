import 'babel-polyfill'
import program from 'commander'
import * as config from './config'
import * as request from './request'
import * as download from './download'

program
  .version('0.0.3')
  .description('Lokali.se client for retrieving localization files')
  .parse(process.argv)

const main = async () => {
  try {
    const data = await config.read()
    const json = await config.parse(data)
    await config.validate(json)
    const { api_token, project_id, output_path } = json
    const file = await request.archive(api_token, project_id)
    await download.file(file, output_path)
    console.log('Localization Updated')
  } catch (err) {
    console.log('Localization Update Failed', err)
  }
}

main()
