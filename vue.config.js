const fs = require('fs');

module.exports = {
  devServer: {
    https: {
      key: fs.readFileSync('./private_key.pem'),
      cert: fs.readFileSync('./Certificate.pem'),
    },
    port: 8080
  }
}
