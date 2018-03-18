
const chalk = require('chalk');
const http = require('http');
const conf = require('./config/defaultConfig');
const promisify = require('util').promisify;
const path = require('path');
const fs = require('fs');
const route = require('./helper/route')

const server = http.createServer((req, res) => {

  const filePath = path.join(conf.root, req.url)
  route(req, res, filePath);
})

server.listen(conf.port, conf.host, () => {
  const addr = `http://${conf.host}:${conf.port}`
  console.info(`Server running at ${chalk.red(addr)}`)
})
