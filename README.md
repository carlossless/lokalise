# Lokalise - the unofficial node lokali.se client.

This is all still very WIP.

## Configuration

In your working directory create a `.lokalise.json` file with the following contents:

```
{
  "api_token": [string] (required) Your locali.se api token,
  "project_id": [string] (required) Your locali.se project ID,
  "output_path": [string (required) Path where messages files will be downloaded,
  "keys_file": [boolean | object] (optional, default false) Creates a keys file under output_path (more below)
}
```

The optional `keys_file` configuration creates a file under `output_path` that enumerates your locali.se message keys.

This may be very useful in your code, for autocompletion & type checking over the allowable message keys, for example.

You can configure the format of this keys file to suit your needs by passing the following object:

```
{
  name: [string] (optional) A name for the keys file, defaults to keys.{type-appropriate-file-extension},
  type: 'json' | 'es6_module' | 'es5_module' (optional, default 'json') the type of the output keys file
  flow: [boolean] (optional, default false) in the case {type} is a js module, adds a //@flow annotation at the top so that the keys can be used with flow type checking
}
```

Alternatively, passing `"keys_file": true` gives you the all default config - i.e. a `keys.json` file will be output

## Run

The package contains a binary.

You can install globally for example with `npm install -g lokalise` or `yarn global install lokalise`

Or you can install and run it locally, for example with `yarn lokalise`
