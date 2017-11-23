const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn
const parser = require('solidity-parser-antlr')
const RelationsParser = require('./RelationsParser')

class RecursiveAnalyzer {

  constructor(dir) {
    this.dir = dir
    this.graph = {}
    this.errors = []
  }

  call() {
    console.log("Analyzing dir ", this.dir)
    this._parseFilesInDir(this.dir)
    this._printResults()
    this._outputToFile()
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

  _printResults() {
    console.log('\n')
    if(this.errors.length !== 0) console.log('Please report this errors: ', this.errors)
  }

  _outputToFile() {
    let data = "digraph Output {\n" +
      "fontname = \"Bitstream Vera Sans\"\n" +
      "fontsize = 8\n" +
      "node [\n" +
      "fontname = \"Bitstream Vera Sans\"\n" +
      "fontsize = 8\n" +
      "shape = \"record\"\n" +
      "]\n" +
      "edge [\n" +
      "arrowtail = \"empty\"\n" +
      "]\n\n"

    data += Object.keys(this.graph).map(key => {
      const inheritance = this.graph[key].inheritance.map(inheritance => `${key} -> ${inheritance} [dir=back]`).join('\n')
      const collaboration = this.graph[key].collaboration.length === 0 ? '' :
        `|${this.graph[key].collaboration.map(collaboration => `+ ${collaboration}`).join('\\l')}`
      const libraries = this.graph[key].libraries.length === 0 ? '' :
        `|${this.graph[key].libraries.map(library => `+ ${library}`).join('\\l')}`

      return `${key}[\nlabel = "{${key}${collaboration}${libraries}}"\n]\n${inheritance}`
    }).join('\n')

    data += '\n}'

    try {
      const fileName = 'graph.dot'
      const imageName = 'graph.png'
      fs.writeFileSync(fileName, data, { flag: 'w' })
      const image = fs.openSync(imageName, 'w')
      const graphviz = spawn('dot', ['-Tpng', fileName], {stdio: [process.stdin, image, process.stderr]})
      graphviz.on('close', status => {
        if (status !== 0) throw new Error("Graphviz failed with status " + status)
        fs.unlinkSync(fileName);
        console.info(`\nCheckout ${imageName}`)
      })
    } catch(error) {
      console.error(`Error saving output to file: ${data}`, error);
    }
  }
}

module.exports=RecursiveAnalyzer
