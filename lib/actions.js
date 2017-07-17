const crypto = require('crypto')  // c++加密模块



// ws握手阶段
function handShake(req, socket) {
  /**
   * 当浏览器脚本 new WebSocket(url) 后，
   * 浏览器对服务器发送一个协议升级的请求，
   * 请求中带有 Sec-WebSocket-Key 字段。
   * 服务端接收到协议提升请求后对这个字段加上一个特定的 GUID 后做一次 sha1 运算，
   * 然后再获取结果的 base64 格式摘要，作为 Sec-WebSocket-Accept 响应头的值响应回客户端浏览器，
   * 就完成了握手
   */
  const WS_GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
  let reqKey = req.headers['sec-websocket-key']
  let resKey = crypto.createHash('sha1').update(reqKey + WS_GUID).digest('base64')

  // 返回101状态码切换协议
  const resHeader = [
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    'Sec-WebSocket-Accept: ' + resKey,
    '\r\n'
  ].join('\r\n');
  socket.write(resHeader)
}

// 挂载握手成功后的各类自定义事件处理器
function mountCustomEvent(socket) {

  socket.on('message', msg => {
    console.log(msg);
  }).on('ping', msg => {
    console.log(msg);
  }).on('pong', msg => {
    console.log(msg);
  }).on('close', msg => {
    socket.end();
  });
}

// 挂载响应方法
function mountSendMethod(socket) {
  let startFrameWrited = false;
  socket.send = function (opts) {
    console.log(opts)
  }
}

module.exports = {
  handShake,
  mountSendMethod,
  mountCustomEvent
}