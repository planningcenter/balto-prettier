const io = require("@actions/io")
const { readFile } = require("fs")
const { promisify } = require("util")
const { easyExec } = require('./utils')

const readFileAsync = promisify(readFile)

let gemVersion = null

async function getGemVersion() {
  if (gemVersion) return gemVersion

  await readFileAsync("Gemfile.lock").then((data) => {
    const match = data.toString().match(/prettier \((?<version>[\d.]+)\)/)
    if (match) {
      gemVersion = match.groups.version
    } else {
      console.log("No prettier gem found in Gemfile.lock. Skipping..." )
    }
  }).catch((error) => {
    console.error(error)
  })

  return gemVersion
}

exports.setup = async function setup() {
  const version = await getGemVersion()

  await io.mv("Gemfile", "Gemfile.bak")

  if (version) {
    await easyExec(["gem install prettier -v", version].join(" "))
  }
}

exports.teardown = async function teardown() {
  await io.mv("Gemfile.bak", "Gemfile")
}

exports.packageMatcher = /prettier\/plugin-ruby/
