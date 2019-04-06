const fs = require('fs')
const path = require('path')
const lunr = require('lunr')
const matter = require('gray-matter')
const removeMarkdown = require('remove-markdown');

const readdirRecursive = (dirPath)=>{
  const dirents = fs.readdirSync(dirPath, {withFileTypes: true})
  const dirList = []
  dirents.forEach((dirent)=>{
    if (dirent.isDirectory()) {
      dirList.push(...readdirRecursive(path.join(dirPath, dirent.name)))
    }else if(dirent.isFile()){
      dirList.push(path.join(dirPath, dirent.name))
    }
  })
  return dirList
}

const getFileList = (dirPath)=>{
  const filePaths = readdirRecursive(dirPath)

  return filePaths.filter((fileName)=>{
      if(!fileName){ return false }
      return path.extname(fileName) === '.md'
    })
}

// return promise list
const createDocumentList = (fileList, opt)=>{
  const files = []

  fileList.forEach((filePath)=>{
    files.push(
      new Promise((resolve, reject)=>{
        fs.readFile(filePath, 'utf8', (err, str)=>{
          if(err){ reject(err) }
          const data = matter(str)
          if(opt.published && data.draft){
            resolve(null)
          }
          resolve({
            filePath: filePath,
            title: data.data.title,
            tags: data.data.tags.join(' '),
            text: removeMarkdown(data.content)
          })
        })
      })
    )
  })

  return files
}

module.exports.hugoLunrIndex = (option)=>{
  const defaultOpt = {
    dirPath: 'content',
    indexFile: 'lunr-index.json',
    published: true,
    langs: null
  }
  const opt = Object.assign(defaultOpt, option)

  const fileList = getFileList(opt['dirPath'])
  const documentList = createDocumentList(fileList, opt)

  Promise.all(documentList).then((documents)=>{
    const langs = [opt['langs']].flat().filter(Boolean)

    // load languages
    if(langs.length > 0){
      require('lunr-languages/lunr.stemmer.support.js')(lunr)
      if(langs.length > 1){
        require('lunr-languages/lunr.multi.js')(lunr)
      }
    }
    langs.forEach((lang)=>{
      if(lang === 'ja'){
        require('lunr-languages/tinyseg.js')(lunr)
      }
      require(`lunr-languages/lunr.${lang}.js`)(lunr)
    })

    const idx = lunr(function () {
      if(langs.length == 1){
        this.use(lunr[langs[0]])
      }else if(langs.length > 1){
        this.use(lunr.multiLanguage(...langs))
      }

      this.ref('title')
      this.ref('filePath')
      this.field('text')
      this.field('tags')
    
      documents.filter(Boolean).forEach(function (doc) {
        this.add(doc)
      }, this)
    })

    fs.writeFile(opt['indexFile'], JSON.stringify(idx), (err)=>{
      if(err){ throw err }
    })
  })
}
