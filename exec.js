const {exec} = require('child_process')

module.exports = async function (cmd, options) {
  return new Promise((resolve, reject) => {
    exec(cmd, function (error, stdout, stderr) {
      if (error) return reject(error)
      return resolve(stdout || stderr)
    })
  })
}