#!/usr/bin/env node

const index = require('./lib/index')
const args = require('./lib/args')

index.hugoLunrIndex(args.parse())
