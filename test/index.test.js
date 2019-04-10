const index = require('../lib/index')
const lunr = require('lunr')
const fs = require('fs')

test('create index at default option', (done) => {
  index.hugoLunrIndex().then(()=>{
    const data = fs.readFileSync('lunr-index.json')
    const idx = lunr.Index.load(JSON.parse(data))
    expect(idx.search('open')[0].ref).toEqual('content/1-en.md')
    done()
  })
})

test('create index which supports Japanese', (done) => {
  index.hugoLunrIndex({langs: 'ja'}).then(()=>{
    const data = fs.readFileSync('lunr-index.json')
    const idx = lunr.Index.load(JSON.parse(data))
    expect(idx.search('人')[0].ref).toEqual('content/1-ja.md')
    done()
  })
})
