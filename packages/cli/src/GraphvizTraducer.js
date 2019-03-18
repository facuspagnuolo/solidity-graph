class GraphvizTraducer {
  constructor(graph, options) {
    this.graph = graph
    this.options = options
    this.data = undefined
  }

  call() {
    this._buildGraphMetadata()
    this._processGraph()
    return this.data
  }

  _processGraph() {
    this.data += Object.keys(this.graph).map(key => {
      const node = this.graph[key];
      const inheritances = this._traduceInheritances(key, node)
      const collaborations = this._traduceCollaborations(node)
      const libraries = this._traduceLibraries(node)
      return `${key}[\nlabel = "{${key}${collaborations}${libraries}}"\n]\n${inheritances}`
    }).join('\n')

    this.data += '\n}'
  }

  _traduceLibraries(node) {
    if(node.libraries.length === 0) return ''
    return `|${node.libraries.map(library => `+ ${library}\\l`).join('')}`;
  }

  _traduceCollaborations(node) {
    if(node.collaboration.length === 0) return ''
    return `|${node.collaboration.map(collaboration => `+ ${collaboration}\\l`).join('')}`;
  }

  _traduceInheritances(key, node) {
    const attributes = { dir: 'back', color: this.options.colored ? this._pickRandomColor() : 'black' }
    const flattedAttributes = Object.keys(attributes).map(key => `${key}=${attributes[key]}`).join(',')
    return node.inheritance.map(inheritance => `${key} -> ${inheritance} [${flattedAttributes}]`).join('\n')
  }

  _buildGraphMetadata() {
    this.data = "digraph Output {\n" +
      "fontname = \"Bitstream Vera Sans\"\n" +
      "fontsize = 8\n" +
      "node [\n" +
      "fontname = \"Bitstream Vera Sans\"\n" +
      "fontsize = 8\n" +
      "shape = \"record\"\n" +
      "]\n" +
      "edge [\n" +
      "arrowtail = \"empty\"\n" +
      "]\n\n";
  }

  _pickRandomColor() {
    const colors = ['antiquewhite', 'aqua', 'aquamarine', 'beige', 'bisque', 'black', 'blanchedalmond', 'blue',
                    'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue',
                    'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen',
                    'darkgrey', 'darkkhaki', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred',
                    'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise',
                    'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue', 'firebrick', 'forestgreen',
                    'gainsboro', 'gold', 'goldenrod', 'gray', 'grey', 'green', 'greenyellow', 'hotpink', 'indianred',
                    'indigo', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral',
                    'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon',
                    'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow',
                    'lime', 'limegreen', 'linen', 'magenta', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid',
                    'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise',
                    'mediumvioletred', 'midnightblue', 'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive',
                    'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise',
                    'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple', 'red',
                    'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'sienna',
                    'skyblue', 'slateblue', 'slategray', 'slategrey', 'springgreen', 'steelblue', 'tan', 'thistle',
                    'tomato', 'turquoise', 'violet', 'wheat', 'yellow', 'yellowgreen']
    return colors[Math.floor(Math.random() * colors.length)]
  }
}

module.exports=GraphvizTraducer
