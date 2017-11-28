const fs = require('fs')
const spawn = require('child_process').spawn

const graphviz = {
  output(path, data) {
    const imageFileName = 'graph.png'
    const imageFilePath = `${path}/${imageFileName}`.replace(/(\/)+/g, "$1");

    try {
      this._processData(data, imageFilePath);
    } catch(error) {
      console.error('Error processing graphviz to output to file: ', error.message, error);
      process.exit(1);
    }
  },

  _processData(data, imageFilePath) {
    const dotFileName = 'graph.dot'
    fs.writeFileSync(dotFileName, data, {flag: 'w'})
    const image = fs.openSync(imageFilePath, 'w')
    const graphviz = spawn('dot', ['-Tpng', dotFileName], {stdio: [process.stdin, image, process.stderr]})
    graphviz.on('close', status => {
      if (status !== 0) throw new Error("Graphviz failed with status " + status)
      fs.unlinkSync(dotFileName);
      console.info(`\nCheckout ${imageFilePath}`)
    })
  },
}

module.exports=graphviz