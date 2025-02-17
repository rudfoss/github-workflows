const core = require('@actions/core');

try {
  const invalue = core.getInput("invalue")
  console.log(`Invalue is: ${invalue}`)
  core.setOutput("outvalue", invalue);
} catch (error) {
  core.setFailed(error.message);
}
