// Modules to control application life and create native browser window
const {app, BrowserWindow,dialog} = require('electron')
const fs = require('fs')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
const windows = new Set()
const getFileFromUser = exports.getFileFromUser = (targetWindow)=>{
  
  const files = dialog.showOpenDialog(mainWindow,{properties:['openFile'],
  filters:[{name:"markdonw files",extensions:["md"]},{name:"all files",extensions:["*"]}]}
  )
  if (!files) return;
  const file  = files[0]
  const content = fs.readFileSync(file).toString();
  targetWindow.webContents.send("file-opened",file,content)
}

const createWindow = exports.createWindow = () => {
  
  // Create the browser window.
  let newWindow = new BrowserWindow({width: 800, height: 600,title:"Mark Down Editor",show:false})



  // and load the index.html of the app.
  newWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  newWindow.once('ready-to-show',()=>{
  
    //getFileFromUser()
    newWindow.show()
  })
  // Emitted when the window is closed.
  newWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.

    windows.delete(newWindow)
    newWindow = null
    
  })
  windows.add(newWindow)
  return newWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', ()=>{createWindow()})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (windows.size == 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
