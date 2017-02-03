#!/usr/bin/env node

import * as request from './request'
import * as config from './config'
import fs from 'fs'

const file = config.read()
const json = config.parse(file)
config.validate(json)
const { api_token, project_id, output_path } = json

request.publish(api_token, project_id)
  .then(file => request.file(file, output_path))
  .then(() => console.log('Localizations Updated'))
  .catch(err => console.error(err))
