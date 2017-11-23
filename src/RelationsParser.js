class RelationsParser {

  constructor() {
    this.contract = null
    this.data = { libraries: [], inheritance: [], collaboration: [] }
  }

  ContractDefinition(node) {
    this.contract = node.name
  }

  InheritanceSpecifier(node) {
    this.data.inheritance.push(node.baseName.namePath)
  }

  UsingForDeclaration(node) {
    this.data.libraries.push(node.libraryName)
  }

  VariableDeclaration(node) {
    if(node.typeName.type === 'UserDefinedTypeName') {
      this.data.collaboration.push(`${node.name} : ${node.typeName.namePath}`)
    }
  }
}

module.exports=RelationsParser
