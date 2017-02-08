import program from 'commander'
import * as request from './request'
import * as config from './config'

program
  .version('0.0.1')
  .description('Lokali.se client for retrieving localization files')
  .parse(process.argv)

const file = config.read()
const json = config.parse(file)
config.validate(json)
const { api_token, project_id, output_path } = json

request.publish(api_token, project_id)
  .then(file => request.file(file, output_path))
  .catch(err => console.error(err))
  .then(() => console.log('Localizations Updated'))
