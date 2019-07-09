[![Build Status](https://travis-ci.org/carlossless/lokalise.svg?branch=master)](https://travis-ci.org/carlossless/lokalise) [![codecov](https://codecov.io/gh/carlossless/lokalise/branch/master/graph/badge.svg)](https://codecov.io/gh/carlossless/lokalise) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


# lokalise

An unofficial node client for [lokalise](https://lokali.se) to import and update localizations.

## Usage

```
  Usage: lokalise [options] [config.json]

  Lokali.se client for retrieving localization files.

  Options:

    -V, --version        output the version number
    -t, --token <token>  set the api token
    -p, --project <id>   set the project id
    -o, --output <path>  output Path
    -h, --help           output usage information
```

### .lokalise.json

If no `config.json` file argument is given `lokalise` will search for a `.lokalise.json` file in the work dir. This is useful for having different configurations per different project.

Any `config.json` file should have the following structure:

```
{
  "token": [string] (required) Your locali.se api token,
  "project": [string] (required) Your locali.se project ID,
  "output": [string (required) Path where message files will be stored,
  "keys": [object] (optional, default false) Creates a keys file under output_path (read more about it bellow),
  "extraApiParams": [object] (optional, default null) Extra params to pass to project export API call
}
```

Most of these options can also be provided via one or more of the overriding command arguments or environment variables. See [src/config.js](src/config.js) for more details.

### Keys File

The optional `keys` configuration fragment creates a file in the specified output path that enumerates your localise message keys.
This may be very useful in your code, for autocompletion & type checking over the allowable message keys, for example.
You can configure the format of the keys file to suit your needs by passing the following object:

```
{
  output: [string] (optional) A name for the keys file, defaults to output/keys.js,
  type: 'es5' | 'es6' (optional, defaults to es5) the output module type,
  flow: [boolean] (optional, default false) if true adds a //@flow annotation at the top so that the keys can be used with flow type checking
}
```

### Extra API Params

You can pass extra parameters to the API call that is made internally to fetch translations. For example you might want to pass `{ "export_empty": "skip" }` to skip exporting empty translations.

Those parameters are documented in https://lokalise.co/apidocs/#export
