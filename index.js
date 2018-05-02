var blessed = require("blessed");
var Aria2 = require("aria2");
var moment = require("moment");
var option = require("./connection");
var util = require("./util");
var Task = require('./task');
var ui = require('./components');

var aria2 = new Aria2(option);

var localOption = {
  shouldRender: true,
  autoUpdate: true,
  updateDelay: 3000
}

var version = {};
var globalStat = {};
var globalOption = {};

// ---------- screen BEGIN ----------
var screen = blessed.screen({
  smartCSR: true,
  log: "./output.log",
  title: "AriaEr-cli"
});

screen.key(["q", "C-c"], function(ch, key) {
  util.close(aria2, function(err, res) {
    if (err) {
      screen.log(err);
    }
  })
  return process.exit(0);
});

screen.key('n', function() {
  localOption.shouldRender = false;
  addBox.reset();
  addBox.show();
  screen.render();
});

screen.key('a', function() {
  localOption.autoUpdate = !localOption.autoUpdate;
  footerMessageBox.info('Auto update: ' + localOption.autoUpdate);
});
// ---------- screen END ----------

// ---------- header BEGIN ----------
var sslRadioSet = ui.sslRadioSet(blessed, screen);
var httpRadio = ui.httpRadio(blessed, sslRadioSet, !option.secure);
var httpsRadio = ui.httpsRadio(blessed, sslRadioSet, option.secure);
var ipAddrBox = ui.ipAddrBox(blessed, screen, option.host);
var portBox = ui.portBox(blessed, screen, option.port);
var tokenBox = ui.tokenBox(blessed, screen, option.secret);
var pathBox = ui.pathBox(blessed, screen, option.path);
// ---------- header END ----------

// ---------- footer BEGIN ----------
var footerTooltips = ui.footerTooltips(blessed, screen, 'A: Auto update\tN: New task\tR: Remove task\tP: Pause task');
var footerMessageBox = ui.footerMessageBox(blessed, screen);

footerMessageBox.__proto__.update = function(str, color) {
  this.setContent(str.toString());
  this.style.bg = color;
  if (localOption.shouldRender) {
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
var taskList = ui.taskList(blessed, screen);

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
var addBox = ui.addBox(blessed, screen);
var linkArea = ui.linkArea(blessed, addBox);
var cancelBtn = ui.cancelBtn(blessed, addBox);
var confirmBtn = ui.confirmBtn(blessed, addBox);

addBox.__proto__.reset = function() {
  linkArea.value = '';
  linkArea.setContent('');
};

var hideAddBox = function() {
  localOption.shouldRender = true;
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

var updateAria2Info = function(res) {
  version = res[0][0];
  globalStat = res[4][0];
  globalOption = res[5][0];
}

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
  if (localOption.shouldRender) {
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
  if (localOption.autoUpdate) {
    util.multicall(aria2, function(err, res) {
      if (err) {
        footerMessageBox.alert(err.message);
      } else {
        footerMessageBox.info("Updated\t" + moment().format("h:mm:ss"));
        updateAria2Info(res);
        updateTaskList(res);
      }
    });
  }
}, localOption.updateDelay);

screen.render();