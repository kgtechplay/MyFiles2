const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("myFiles2", {
  chooseFile: () => ipcRenderer.invoke("choose-file"),
  saveItem: (payload) => ipcRenderer.invoke("save-item", payload)
});