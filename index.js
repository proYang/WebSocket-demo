const http = require('http')
const fs = require('fs')
const path = require('path')

const open = require('open')

const actions = require('./lib/actions')
const PORT = 3200

const server = http.createServer((req, res) => {
  if (/^\/(?=\?.*)?$/.test(req.url)) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(path.resolve(__dirname, './static/index.html')).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end()
  }
})

server.listen(PORT, () => console.log(`server start on port ${PORT}`));
open(`http://127.0.0.1:${PORT}`)


server.on('upgrade', (req, socket, head) => {
  // ws握手
  actions.handShake(req, socket)
  actions.mountCustomEvent(socket)
  actions.mountSendMethod(socket)
})
