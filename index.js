const os = require('os')
const exec = require('./exec')
class Rasdial {
  constructor({provider, timeout = 10000}){
    if (os.type() !== 'Windows_NT') throw new Error('Rasdial current support for windows')
    if (!provider) throw new Error('Provider is required for rasdial')
    this.provider = provider
    this.timeout = timeout
  }
  makeTimeout(reject) {
    return setTimeout(() => {
      return reject(new Error('Time out'))
    }, this.timeout)
  }
  start() {
    return new Promise((resolve, reject) => {
      const timeout = this.makeTimeout(reject)
      exec(`rasdial ${this.provider}`)
        .then(data => {
          clearTimeout(timeout)
          resolve(data)
        })
        .catch(reject)
    })
  }
  stop() {
    return new Promise((resolve, reject) => {
      const timeout = this.makeTimeout(reject)
      exec(`rasdial ${this.provider} /disconnect`)
        .then(data => {
          clearTimeout(timeout)
          resolve(data)
        })
        .catch(reject)
    })
  }
  async restart() {
    try {
      await this.stop()
      await this.start()
      return 'Your connection has been restarted'
    } catch (e) {
      return Promise.reject(e)
    }
  }
}
module.exports = Rasdial