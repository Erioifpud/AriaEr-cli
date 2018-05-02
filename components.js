exports.taskList = function(blessed, parent) {
  return blessed.listtable({
    parent: parent,
    top: 4,
    left: 1,
    right: 1,
    bottom: 3,
    keys: true,
    mouse: true,
    vi: true,
    interactive: true,
    border: {
      type: "line"
    },
    style: {
      cell: {
        selected: {
          bg: "white",
          fg: "black"
        }
      }
    }
  });
};

exports.pathBox = function(blessed, parent, value) {
  return blessed.textbox({
    parent: parent,
    label: " Path ",
    value: value,
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
};

exports.tokenBox = function(blessed, parent, value) {
  return blessed.textbox({
    parent: parent,
    label: " Token ",
    value: value,
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
};

exports.portBox = function(blessed, parent, value) {
  return blessed.textbox({
    parent: parent,
    label: " Port ",
    value: value.toString(),
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
};

exports.ipAddrBox = function(blessed, parent, value) {
  return blessed.textbox({
    parent: parent,
    label: " IP Addr ",
    value: value,
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
};

exports.sslRadioSet = function(blessed, parent) {
  return blessed.radioset({
    parent: parent,
    left: 1,
    top: 1,
    shrink: true
  });
};

exports.httpsRadio = function(blessed, parent, value) {
  return blessed.radiobutton({
    parent: parent,
    checked: value,
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
};

exports.httpRadio = function(blessed, parent, value) {
  return blessed.radiobutton({
    parent: parent,
    checked: value,
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
};

exports.footerTooltips = function(blessed, parent, value) {
  return blessed.text({
    parent: parent,
    top: '96%',
    bottom: 2,
    left: 1,
    right: 1,
    content: value
  });
};

exports.footerMessageBox = function(blessed, parent) {
  return blessed.box({
    parent: parent,
    top: "93%",
    bottom: 2,
    left: 1,
    right: 1,
    fg: "black",
    bg: "white",
    content: ""
  });
};

exports.addBox = function(blessed, parent) {
  return blessed.box({
    parent: parent,
    top: 'center',
    left: 'center',
    width: '50%',
    height: '50%',
    tags: true,
    border: 'line',
    hidden: true
  });
};

exports.linkArea = function(blessed, parent) {
  return blessed.textarea({
    parent: parent,
    label: ' New Link ',
    left: 0,
    top: 0,
    bottom: 5,
    mouse: true,
    vi: true,
    keys: true,
    border: 'line'
  });
};

exports.cancelBtn = function(blessed, parent) {
  return blessed.button({
    parent: parent,
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
};

exports.confirmBtn = function(blessed, parent) {
  return blessed.button({
    parent: parent,
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
};