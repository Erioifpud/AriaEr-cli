var blessed = require("blessed");
var Aria2 = require("aria2");
var option = require("./connection");
var util = require("./util");
var moment = require("moment");
var Task = require('./task');

var aria2 = new Aria2(option);

var cliOption = {
  shouldRender: true,
  autoUpdate: true,
  updateDelay: 3000
}

var screen = blessed.screen({
  smartCSR: true,
  log: "./output.log"
});

screen.title = "AriaEr-cli";

var sslRadioSet = blessed.radioset({
  parent: screen,
  left: 1,
  top: 1,
  shrink: true
});

var httpRadio = blessed.radiobutton({
  parent: sslRadioSet,
  checked: !option.secure,
  mouse: false,
  keys: false,
  shrink: true,
  style: {
    bg: "blue"
  },
  width: 10,
  height: 1,
  left: 1,
  top: 0,
  name: "httpRadio",
  content: "http"
});

var httpsRadio = blessed.radiobutton({
  parent: sslRadioSet,
  checked: option.secure,
  mouse: false,
  keys: false,
  shrink: true,
  style: {
    bg: "blue"
  },
  width: 10,
  height: 1,
  left: 1,
  top: 1,
  name: "httpsRadio",
  content: "https"
});

var ipAddrBox = blessed.textbox({
  parent: screen,
  label: " IP Addr ",
  value: option.host,
  border: "line",
  style: {
    fg: "blue",
    bg: "default",
    bar: {
      bg: "default",
      fg: "blue"
    },
    border: {
      fg: "default",
      bg: "default"
    }
  },
  left: "10%",
  width: "20%",
  top: 1,
  height: 3,
  keys: true,
  vi: false,
  mouse: true
});

var portBox = blessed.textbox({
  parent: screen,
  label: " Port ",
  value: option.port.toString(),
  border: "line",
  style: {
    fg: "blue",
    bg: "default",
    bar: {
      bg: "default",
      fg: "blue"
    },
    border: {
      fg: "default",
      bg: "default"
    }
  },
  left: "30%",
  width: "10%",
  top: 1,
  height: 3,
  keys: true,
  vi: false,
  mouse: true
});

var tokenBox = blessed.textbox({
  parent: screen,
  label: " Token ",
  value: option.secret,
  border: "line",
  style: {
    fg: "blue",
    bg: "default",
    bar: {
      bg: "default",
      fg: "blue"
    },
    border: {
      fg: "default",
      bg: "default"
    }
  },
  left: "40%",
  width: "40%",
  top: 1,
  height: 3,
  keys: true,
  vi: false,
  mouse: true,
  censor: true
});

/*
var connectBtn = blessed.button({
  parent: screen,
  content: "Connect",
  shrink: true,
  mouse: true,
  border: "line",
  style: {
    fg: "blue"
  },
  left: "90%",
  top: 1,
  right: 1
});
*/

var pathBox = blessed.textbox({
  parent: screen,
  label: " Path ",
  value: option.path,
  border: "line",
  style: {
    fg: "blue",
    bg: "default",
    bar: {
      bg: "default",
      fg: "blue"
    },
    border: {
      fg: "default",
      bg: "default"
    }
  },
  left: "80%",
  right: 1,
  top: 1,
  height: 3,
  keys: true,
  vi: false,
  mouse: true
});

// ---------- footer BEGIN ----------
var footerTooltips = blessed.text({
  parent: screen,
  top: '96%',
  bottom: 2,
  left: 1,
  right: 1,
  content: 'A: Auto update\tN: New task\tR: Remove task\tP: Pause task'
});

var footerMessageBox = blessed.box({
  parent: screen,
  top: "93%",
  bottom: 2,
  left: 1,
  right: 1,
  fg: "black",
  bg: "white",
  content: ""
});

footerMessageBox.__proto__.update = function(str, color) {
  this.setContent(str.toString());
  this.style.bg = color;
  if (cliOption.shouldRender) {
    screen.render();
  }
};

footerMessageBox.__proto__.alert = function(str) {
  this.update(str, "red");
};

footerMessageBox.__proto__.info = function(str) {
  this.update(str, "blue");
};

var showMessage = function(err, message) {
  if (err) {
    footerMessageBox.alert(err.message);
  } else {
    footerMessageBox.info(message);
  }
}
// ---------- footer END ----------

// ---------- taskList BEGIN ----------
var taskList = blessed.listtable({
  parent: screen,
  top: 4,
  left: 1,
  right: 1,
  bottom: 3,
  keys: true,
  mouse: true,
  vi: true,
  interactive: true,
  border: {
    type: 'line'
  },
  style: {
    cell: {
      selected: {
        bg: 'white',
        fg: 'black'
      }
    }
  }
});

var doPause = function(aria2, taskObj) {
  if (taskObj.state === 'paused') {
    util.unpauseTask(aria2, taskObj.gid, function(err, res) {
      showMessage(err, 'Task continue');
    });
  } else if(taskObj.state === 'waiting') {
    util.pauseTask(aria2, taskObj.gid, function(err, res) {
      showMessage(err, 'Task paused');
    });
  } else {
    footerMessageBox.alert('Current task cannnot be paused/unpaused');
  }
  screen.render();
}

taskList.on('keypress', function(ch, key) {
  var index = taskList.selected;
  if (index !== 0) {
    var item = taskList.getItem(index);
    var list = item.content.trim().split(/\s{2,}/);
    var task = new Task().fromAttrList(list);
    if (key.name === 'r') {
      util.removeTask(aria2, task.gid, function(err, res) {
        showMessage(err, 'Task removed');
        screen.render();
      });
    } else if (key.name === 'p') {
      doPause(aria2, task);
    }
  }
});

// ---------- taskList END ----------

// ---------- addBox BEGIN ----------
var addBox = blessed.box({
  parent: screen,
  top: 'center',
  left: 'center',
  width: '50%',
  height: '50%',
  tags: true,
  border: 'line',
  hidden: true
});

var linkArea = blessed.textarea({
  parent: addBox,
  label: ' New Link ',
  left: 0,
  top: 0,
  bottom: 5,
  mouse: true,
  vi: true,
  keys: true,
  border: 'line'
});

var cancelBtn = blessed.button({
  parent: addBox,
  left: 0,
  bottom: 0,
  width: '30%',
  height: 3,
  padding: 1,
  align: 'center',
  content: 'Cancel',
  bg: '#3498db',
  shrink: true,
  mouse: true
});

var confirmBtn = blessed.button({
  parent: addBox,
  right: 0,
  bottom: 0,
  width: '30%',
  height: 3,
  padding: 1,
  align: 'center',
  content: 'Confirm',
  bg: '#1abc9c',
  shrink: true,
  mouse: true
});

addBox.__proto__.reset = function() {
  linkArea.value = '';
  linkArea.setContent('');
};

var hideAddBox = function() {
  cliOption.shouldRender = true;
  addBox.hide();
  screen.render();
}

cancelBtn.on('press', function() {
  hideAddBox();
});

confirmBtn.on('press', function() {
  hideAddBox();
  var links = linkArea.getValue().split('\n');
  
  util.addTask(aria2, links, function(err, res) {
    showMessage(err, 'Task added')
    screen.render();
  });
});
// ---------- addBox END ----------

screen.key(["q", "C-c"], function(ch, key) {
  util.close(aria2, function(err, res) {
    if (err) {
      screen.log(err);
    }
  })
  return process.exit(0);
});

screen.key('n', function() {
  cliOption.shouldRender = false;
  addBox.reset();
  addBox.show();
  screen.render();
});

screen.key('a', function() {
  cliOption.autoUpdate = !cliOption.autoUpdate;
  footerMessageBox.info('Auto update: ' + cliOption.autoUpdate);
});

screen.render();

var updateTaskList = function(res) {
  var data = [['Name', 'GID', 'Size', 'Speed', 'Status']];
  for (let i = 1; i <= 3; i++) {
    var tasks = res[i][0];
    for (let task of tasks) {
      var taskObj = new Task(task);
      data.push(taskObj.getAttrList());
    }
  }
  taskList.setData(data);
  if (cliOption.shouldRender) {
    screen.render();
  }
};

util.open(aria2, function(err, res) {
  if (err) {
    screen.log(err);
    footerMessageBox.alert(err.message);
  }
});

setInterval(function() {
  if (cliOption.autoUpdate) {
    util.multicall(aria2, function(err, res) {
      if (err) {
        footerMessageBox.alert(err.message);
      } else {
        footerMessageBox.info("Updated\t" + moment().format("h:mm:ss"));
        updateTaskList(res);
      }
    });
  }
}, cliOption.updateDelay);