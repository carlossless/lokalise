import { LokaliseApi } from '@lokalise/node-api'

export const bundle = async (apiToken, projectId) => {
  const lokaliseApi = new LokaliseApi({ apiKey: apiToken })
  const response = await lokaliseApi.files.download(projectId, {
    format: 'json',
    bundle_filename: '%PROJECT_NAME%-intl.zip',
    bundle_structure: '%LANG_ISO%.%FORMAT%'
  })
  if (response && response.response) {
    const apiResponse = response.response
    if (apiResponse.status === 'success') {
      return response.bundle.file
    }
    if (apiResponse.status === 'error') {
      throw new Error(apiResponse.status)
    }
  }
  throw new Error(`Invalid response: ${JSON.stringify(response)}`)
}
