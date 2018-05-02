//var Aria2 = require("aria2");

exports.open = function(aria2, fn) {
  aria2.open(fn);
};

exports.multicall = function(aria2, fn) {
  var secret = aria2.secret;
  aria2.secret = "";
  aria2.send(
    "system.multicall",
    [
      {
        methodName: "aria2.getVersion",
        params: ["token:" + secret]
      },
      {
        methodName: "aria2.tellActive",
        params: ["token:" + secret]
      },
      {
        methodName: "aria2.tellWaiting",
        params: ["token:" + secret, 0, 1000]
      },
      {
        methodName: "aria2.tellStopped",
        params: ["token:" + secret, 0, 1000]
      },
      {
        methodName: "aria2.getGlobalStat",
        params: ["token:" + secret]
      },
      {
        methodName: "aria2.getGlobalOption",
        params: ["token:" + secret]
      }
    ],
    function(err, res) {
      fn(err, res);
      aria2.secret = secret;
    }
  );
};

exports.close = function(aria2, fn) {
  aria2.close(fn);
};

exports.addTask = function(aria2, links, fn) {
  aria2.addUri(links, fn);
}

exports.removeTask = function(aria2, gid, fn) {
  aria2.removeDownloadResult(gid, fn);
}

exports.pauseTask = function(aria2, gid, fn) {
  aria2.pause(gid, fn);
}

exports.unpauseTask = function(aria2, gid, fn) {
  aria2.unpause(gid, fn);
}