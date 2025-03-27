let fs = require('fs-extra')
let path = require('path')
let json5 = require('json5')
let cwd = process.cwd()

module.exports = api => {
  if (api) api.cache(true)
  return json5.parse(fs.readFileSync(path.resolve(cwd, '.babelrc'), 'utf8'))
}
