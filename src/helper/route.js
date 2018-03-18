
const chalk = require('chalk');
const promisify = require('util').promisify;
const path = require('path');
const fs = require('fs');
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const config = require('../config/defaultConfig')
const Handlebars = require('handlebars')

const tplPath = path.join(__dirname, '../template/dir.tpl')
const source = fs.readFileSync(tplPath)
const template = Handlebars.compile(source.toString());

module.exports = async function (req, res, filePath) {
  try {
    const stats = await stat(filePath)
    if (stats.isFile()) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain;charset=utf-8');
      fs.createReadStream(filePath).pipe(res);
    } else if (stats.isDirectory()) {
      const files = await readdir(filePath)
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html;charset=utf-8');
      const dir = path.relative(config.root, filePath);
      const data = {
        title: path.basename(filePath),
        dir: dir ? `/${dir}` : '',
        files,
      }
      res.end(template(data))
    }
  } catch (err) {
    console.error(err)
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain;charset=utf-8');
    res.end(`兄dei你的路径有问题 ${filePath}\n${err}`);
  }
}
