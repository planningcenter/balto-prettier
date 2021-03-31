const io = require('@actions/io')
const core = require('@actions/core')
const { easyExec } = require('./utils')

const {
  GITHUB_WORKSPACE,
  INPUT_EXTENSIONS,
} = process.env

const event = require(process.env.GITHUB_EVENT_PATH)

let yarnOutput = null

async function getYarn () {
  if (yarnOutput) return yarnOutput

  const { output } = await easyExec('yarn list --depth=0 --json')

  yarnOutput = JSON.parse(output)
  return yarnOutput
}

async function getPeerDependencies (error) {
  const peers = error
    .split('\n')
    .map(l => l.match(/ requires a peer of (?<packageName>[^@]+)@/))
    .filter(m => m)
    .map(m => m.groups.packageName)

  const versions = []

  for (var peersIndex = 0; peersIndex < peers.length; peersIndex++) {
    const peer = peers[peersIndex]

    const yarn = await getYarn()

    yarn.data.trees
      .filter(p => p.name.startsWith(`${peer}@`))
      .forEach(p => versions.push(p.name))
  }

  return versions
}

async function installPrettierPackagesAsync () {
  const yarn = await getYarn()

  const versions = yarn.data.trees
    .filter(p => p.name.match(/prettier/))
    .map(p => p.name)

  await io.mv('package.json', 'package.json-bak')

  try {
    const { error } = await easyExec(
      ['npm i', ...versions, '--no-package-lock'].join(' ')
    )
    const peerVersions = await getPeerDependencies(error)
    if (peerVersions.length > 0) {
      await easyExec(['npm i', ...peerVersions, '--no-package-lock'].join(' '))
    }
  } finally {
    await io.mv('package.json-bak', 'package.json')
  }
}

async function runPrettier () {
  const compareSha = event.pull_request.base.sha

  const { output } = await easyExec(
    `git diff --name-only --diff-filter AM ${compareSha}`
  )

  const executable = `${GITHUB_WORKSPACE}/node_modules/.bin/prettier`
  const extensions = INPUT_EXTENSIONS.split(',')

  const paths = output
    .split('\n')
    .filter(path => extensions.some(e => path.endsWith(`.${e}`)))
  await easyExec(`${executable} --write ${paths.join(' ')}`)
}

async function run () {
  try {
    process.chdir(GITHUB_WORKSPACE)
    await installPrettierPackagesAsync()
    report = await runPrettier()
  } catch (e) {
    core.setFailed(e.message)
  }
}

run()
