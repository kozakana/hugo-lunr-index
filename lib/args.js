module.exports.parse = ()=>{
  const option = {}

 	if(process.argv.indexOf('-o') != -1){
		option.indexFile = (process.argv[process.argv.indexOf('-o') + 1])
	}

 	if(process.argv.indexOf('-i') != -1){
		option.indexFile = (process.argv[process.argv.indexOf('-o') + 1])
	}

 	if(process.argv.indexOf('-l') != -1){
		const languages = (process.argv[process.argv.indexOf('-l') + 1])
    option.langs = languages.split(',')
	}

 	if(process.argv.indexOf('--include-draft') != -1){
    option.published = false
  }

  return option
}
