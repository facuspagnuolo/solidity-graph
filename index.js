const RecursiveAnalyzer = require('./src/RecursiveAnalyzer')

const dir = process.argv.slice(2)[0]

if(!dir) throw new Error("Please provide a project folder to analyze")

new RecursiveAnalyzer(dir).call()
