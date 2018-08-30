#!/usr/bin/env node

require('../lib/main.js')().then(() => {
  process.exit(0)
}).catch(() => {
  process.exit(1)
})
