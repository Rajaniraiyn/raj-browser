const { ipcRenderer } = require("electron");

window.onload = (_) => {
  document.querySelector("#title-bar-buttons > img:nth-child(1)").onclick = (
    _
  ) => {
    ipcRenderer.send("minimize-window");
  };

  document.querySelector("#title-bar-buttons > img:nth-child(2)").onclick = (
    _
  ) => {
    ipcRenderer.send("maximize-window");
  };

  document.querySelector("#title-bar-buttons > img:nth-child(3)").onclick = (
    _
  ) => {
    ipcRenderer.send("close-window");
  };
};
