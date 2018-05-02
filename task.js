var util = require("util");

class Task {
  constructor(task) {
    this.task = task;
    if (task) {
      this.name = this.getName();
      this.gid = this.getGID();
      this.size = this.getSize();
      this.speed = this.getSpeed();
      this.state = this.getState();
    }
  }

  getName() {
    var path = this.task.files[0].path;
    var index = path.lastIndexOf("/") + 1;
    return path.substring(index, path.length);
  }

  getGID() {
    return this.task.gid;
  }

  convertSize(length) {
    var bytes = parseInt(length);
    var megaBytes = bytes / 1024000;
    return util.format("%d MB", megaBytes.toFixed(2));
  }

  getSize() {
    var totalSize = this.convertSize(this.task.totalLength);
    if (this.getState() !== "complete") {
      var completedSize = this.convertSize(this.task.completedLength);
      return util.format("%s / %s", completedSize, totalSize);
    } else {
      return totalSize;
    }
  }

  convertSpeed(speed, sign) {
    var bytesps = parseInt(speed);
    var kiloBytesps = bytesps / 1000;
    return util.format("%s %d KB/s", sign, kiloBytesps.toFixed(2));
  }

  getDownloadSpeed() {
    return this.convertSpeed(this.task.downloadSpeed, "↓");
  }

  getUploadSpeed() {
    return this.convertSpeed(this.task.uploadSpeed, "↑");
  }

  getSpeed() {
    if (this.getState() === "complete") {
      return this.getUploadSpeed();
    } else {
      return this.getDownloadSpeed();
    }
  }

  getState() {
    return this.task.status;
  }

  getAttrList() {
    return [this.name, this.gid, this.size, this.speed, this.state];
  }

  fromAttrList(list) {
    [this.name, this.gid, this.size, this.speed, this.state] = list;
    return this;
  }
}

module.exports = Task;
