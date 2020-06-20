//const {ipcRenderer} = require('electron');

const electron = require('electron')
const fs = require('fs')
const path = require('path')

const { desktopCapturer, ipcRenderer: ipc } = electron
//console.log(screen.getPrimaryDisplay().workAreaSize)

console.log("loaded extra...")

ipc.on('capture', onCapture)
//ipc.on('capture', onTest)

function onTest(evt, targetDir,other) {
    console.log(other)
    console.log(targetDir);
    alert("yack!")
}

function onCapture(evt, targetDir,currentScreen,beginPoint,endPoint) {
    console.log("onCapture...")
    console.log(targetDir);
    console.log(currentScreen.size);
    getMainSource(desktopCapturer, targetDir,currentScreen.size, beginPoint, endPoint)
  }
  
  function getMainSource(desktopCapturer,targetDir, screenSize, beginPoint, endPoint) {
    const options = { types: ['screen'], thumbnailSize: screenSize}
    console.log("getMainSource 2")
    console.log(desktopCapturer)
    desktopCapturer.getSources(options)
        .then(async sources => {
            console.log("in here...")
            console.log(sources)
            const png = sources[0].thumbnail.crop({x:beginPoint.x,y:beginPoint.y,width:200,height:200}).toPNG()
            //const png = sources[0].thumbnail.toPNG()
            console.log(png);
            const filePath = path.join(targetDir, new Date() + '.png')
            writeScreenshot(png, filePath)
        })
      
    console.log("getmainSource 3")
  }
  
  function writeScreenshot(png, filePath) {
    fs.writeFile(filePath, png, err => {
      if (err) return console.log('Failed to write screen:', err)
    })
  }
  
