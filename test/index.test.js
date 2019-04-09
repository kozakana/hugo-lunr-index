const index = require('../lib/index')
const lunr = require('lunr')
const fs = require('fs')

test('create index at default option', () => {
  index.hugoLunrIndex()
  const data = fs.readFileSync('lunr-index.json')
  const idx = lunr.Index.load(JSON.parse(data))
  expect(idx.search('open')[0].ref).toEqual('content/1-en.md')
})

test('create index which supports Japanese', () => {
  index.hugoLunrIndex({langs: 'ja'})
  const data = fs.readFileSync('lunr-index.json')
  const idx = lunr.Index.load(JSON.parse(data))
  expect(idx.search('人')[0].ref).toEqual('content/1-ja.md')
})
