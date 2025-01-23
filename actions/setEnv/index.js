const os = require("node:os")
const fs = require("node:fs")
const core = require("@actions/core");
const exec = require("@actions/exec")
const dotenv = require("dotenv")

const readAndParseEnv = (envFilePath) => {
  if (!fs.existsSync(envFilePath)) throw new Error(`Env file ${envFilePath} does not exist`)
  const envFile = fs.readFileSync(envFilePath, "utf8")
  return dotenv.parse(envFile)
}

const start = async () => {
  const envFile = core.getInput("envFile")
  const replace = core.getInput("replace") === "true"
  const secret = core.getInput("secret") === "true"
  console.log("settings", {envFile, replace, secret})

  const env = readAndParseEnv(envFile)
  console.log("found variables", Object.keys(env))
  for (const [name, value] of Object.entries(env)) {
    const exists = !!process.env[name]
    if (exists && !replace) {
      console.log(`SKIP: ${name} (exists and !replace)`)
      continue
    }

    console.log(`${exists ? "REPLACE" : "SET"}: ${name}`)
    core.setSecret(name, value)
    core.exportVariable(name, value)
  }
}

start().catch((error) => {
  core.setFailed(error.message)
})
