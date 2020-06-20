const {app, BrowserWindow, globalShortcut, ipcMain, screen, ipcRenderer: ipc} = require('electron');
let mainWindow = null
let beginPoint = null
let endPoint = null

app.on('ready', () => {
    console.log('Hello from Electron');
    mainWindow = new BrowserWindow({
        resizable: true,
        frame: true,
        webPreferences: {
          nodeIntegration: true,
          //preload: './capture.js'
        }
      });
    //mainWindow.loadURL("http://raddev.us")
    // ### Notice! It concatenates to the root path of location of where 
    // your project is located
    mainWindow.webContents.loadFile("app/main.htm")
    //mainWindow.webContents.loadFile(`${__dirname}/main.htm`)
    console.log(`${__dirname}`)


    console.log("before register")
    globalShortcut.register('CommandOrControl+Shift+X', () => {
        console.log("shortcut fired...")
        //mainWindow.send('capture')
        screenSize = screen.getPrimaryDisplay().workAreaSize
        mainWindow.webContents.send('capture', app.getPath('pictures'),screenSize,beginPoint,endPoint)
        
        //console.log(screen)
        
    })

    globalShortcut.register('CommandOrControl+Shift+A', () => {
        beginPoint = getScreenPoint();
        console.log(beginPoint);
    })

    globalShortcut.register('CommandOrControl+Shift+Z', () => {
        endPoint = getScreenPoint();
        console.log(endPoint);
    })

    console.log("after register")
    console.log(globalShortcut.isRegistered('CommandOrControl+Shift+X'))

    mainWindow.on ('close', _ => {
        console.log("exiting...")
        console.log(globalShortcut.unregisterAll());
        console.log(globalShortcut.isRegistered('CommandOrControl+Shift+X'))
        console.log(globalShortcut.isRegistered('CommandOrControl+Shift+Z'))
        //mainWindow = null;
    });
    console.log(screen.getPrimaryDisplay().workAreaSize)
    mainWindow.toggleDevTools()

    mainWindow.on('blur', getScreenPoint)
    //mainWindow.hide()
});

function getScreenPoint(){
    var point = screen.getCursorScreenPoint();
    console.log(point);
    return point;
}