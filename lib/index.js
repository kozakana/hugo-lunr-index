const fs = require('fs')
const path = require('path')
const lunr = require('lunr')
const matter = require('gray-matter')
const removeMarkdown = require('remove-markdown');

const documents = []

module.exports.hugoLunrIndex = (dirPath)=>{
  const dirents = fs.readdirSync(dirPath, {withFileTypes: true})

  const fileList = dirents.map((dirent)=>{
    if (dirent.isFile()) {
      return dirent.name
    }
  }).filter((fileName)=>{
    if(!fileName){ return false }
    return path.extname(fileName) === '.md'
  })

  fileList.forEach((fileName)=>{
    const filePath = path.join(dirPath, fileName)
    fs.readFile(filePath, 'utf8', (err, str)=>{
      const data = matter(str)
      documents.push({
        title: data.data.title,
        tags: data.data.tags,
        text: removeMarkdown(data.content)
      })
      console.log(documents)
    })
  })
}
