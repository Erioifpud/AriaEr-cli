# AriaEr-cli

![preview1.png](/img/preview1.png)
一个命令行界面版的Aria2客户端，使用了[Blessed](https://github.com/chjj/blessed)和[Aria2.js](https://github.com/sonnyp/aria2.js)这两个库。

在根目录下创建**connection.js**，定义**连接信息**后使用，比如说：
```javascript
// connection.js
module.exports = {
  host: "localhost",
  port: 6800,
  secure: false,
  secret: "",
  path: "/jsonrpc"
}
```