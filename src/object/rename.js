import zip from 'lodash/zip'
import omitBy from 'lodash/omitBy'

export default (obj, keys, newKeys) => (
  omitBy(
    zip(keys, newKeys)
      .reduce((res, val) => {
        const [oldKey, newKey] = val
        res[newKey] = res[oldKey]
        delete res[oldKey]
        return res
      }, { ...obj }),
    x => typeof x === 'undefined'
  )
)
