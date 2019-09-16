## How to try a development build of Lokalise in another project

To link `lokalise` on the command line to `bin/lokalise.js` in a development build:

```sh-session
$ cd /path/to/your/Lokalise_clone
$ yarn link
```

To build Lokalise:

```sh-session
$ cd /path/to/your/Lokalise_clone

$ yarn build
```

To run tests in another project with the development build of Lokalise:

```sh-session
$ cd /path/to/another/project

# link development build to the other project
$ yarn link lokalise

$ yarn lokalise
```


To unlink `lokalise` on the command line from `bin/lokalise.js` in a development build:

```sh
yarn unlink lokalise
```