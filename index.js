#!/usr/bin/env node
const program = require('commander')
const SolidityPlotter = require('./src/SolidityPlotter')

let dir = undefined
let output = null

program
  .usage("<dir> [output] [options]")
  .option('-c, --colored', 'Use colored edges')
  .action((_dir, _output) => {
    dir = _dir
    output = _output
  })
  .parse(process.argv)


if(!dir) {
  console.error("Please provide a dir to analyze")
  process.exit(1);
}

const options = {
  colored: program.colored
}

new SolidityPlotter(dir, output, options).call()
