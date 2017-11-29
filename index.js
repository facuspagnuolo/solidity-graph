#!/usr/bin/env node
const program = require('commander')
const SolidityPlotter = require('./src/SolidityPlotter')

let inputDir = undefined

program
  .usage("<inputDir> [options]")
  .option('-o, --output <outputDir>', 'Set an specific output dir')
  .option('-c, --colored', 'Use colored edges')
  .action((_inputDir) => inputDir = _inputDir)
  .parse(process.argv)

if(!inputDir) {
  console.error("Please provide an input dir to analyze")
  process.exit(1);
}

console.log()

const outputDir = program.output || '.'
const options = { colored: program.colored }

new SolidityPlotter(inputDir, outputDir, options).call()
