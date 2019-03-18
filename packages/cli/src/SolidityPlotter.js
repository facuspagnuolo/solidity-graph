const fs = require('fs')
const path = require('path')
const parser = require('solidity-parser-antlr')
const graphviz = require('./Graphviz')
const RelationsParser = require('./RelationsParser')
const GraphvizTraducer = require('./GraphvizTraducer')

class SolidityPlotter {

  constructor(inputDir, outputDir, options = {}) {
    this.inputDir = inputDir
    this.outputDir = outputDir
    this.options = options
    this.graph = {}
    this.errors = []
  }

  call() {
    console.log("Analyzing dir ", this.inputDir)
    this._parseFilesInDir(this.inputDir)
    this._processResults()
  }

  _parseFilesInDir(dir) {
    const list = fs.readdirSync(dir)
    list.forEach(file => {
      const filePath = path.resolve(dir, file)
      const stat = fs.statSync(filePath)
      if (!stat) this.results[file] = { error: `Could not open file ${file}` }
      else {
        if(stat.isDirectory()) this._parseFilesInDir(filePath)
        else if (path.extname(file).toLowerCase() === '.sol') this._parseFile(filePath)
      }
    })
  }

  _parseFile(filePath) {
    try {
      console.log('Parsing ', filePath, '...')
      const sources = fs.readFileSync(filePath)
      const source = "".concat(sources)
      const ast = parser.parse(source)
      const relationsParser = new RelationsParser()
      parser.visit(ast, relationsParser)
      this.graph[relationsParser.contract] = relationsParser.data
    } catch(e) { this._handleError(filePath, e) }
  }

  _handleError(filePath, e) {
    let error = ''
    if (e instanceof parser.ParserError) error = `Syntax error: ${e.message}`
    else if (e.code === 'ENOENT') error = `File not found: ${e.path}`
    else error = `Error: ${e.message}`
    if(error.length > 100) error = error.substring(0, 100) + '...'
    this.errors.push(`${error} @ ${filePath}`)
  }

  _processResults() {
    console.log('\n')
    if(this.errors.length !== 0) console.log('Please report this errors: ', this.errors)
    const data = new GraphvizTraducer(this.graph, this.options).call()
    graphviz.output(this.outputDir, data)
  }
}

module.exports=SolidityPlotter
