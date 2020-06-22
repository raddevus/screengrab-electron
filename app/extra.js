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
    getMainSource(desktopCapturer, targetDir,currentScreen, beginPoint, endPoint)
  }
  
  function getMainSource(desktopCapturer,targetDir, currentScreen, beginPoint, endPoint) {
    const options = { types: ['screen'], thumbnailSize: currentScreen.size}
    console.log("getMainSource 2")
    console.log(desktopCapturer)
    desktopCapturer.getSources(options)
        .then(async sources => {
            console.log("in here...")
            console.log(sources)
            let screenChoice = -1
            let xOffset = 0;
            if (beginPoint.x > currentScreen.bounds.width){
              screenChoice = 1;
              console.log("screenChoice: " + screenChoice)
              xOffset = currentScreen.bounds.width;
            }
            else{ screenChoice = 0; console.log("screenChoice: " + screenChoice);}
            let outputWidth = Math.abs(endPoint.x - beginPoint.x);
            let outputHeight = Math.abs(endPoint.y - beginPoint.y);
            let finalBeginPoint = calcTrueBeginPoint(beginPoint,endPoint);
            const png = sources[screenChoice].thumbnail.crop({x:Math.abs(finalBeginPoint.x-xOffset),y:finalBeginPoint.y,width:outputWidth,height:outputHeight}).toPNG()
            //const png = currentScreen.thumbnail.crop({x:beginPoint.x,y:beginPoint.y,width:200,height:200}).toPNG()
            //const png = sources[0].thumbnail.toPNG()
            console.log(png);
            const filePath = path.join(targetDir, new Date() + '.png')
            writeScreenshot(png, filePath)
        })
      
    console.log("getmainSource 3")
  }

  function calcTrueBeginPoint(beginPoint, endPoint){
      // ## the user can move in any direction to 
      // draw the bounding box - this insures the values are correct
      let outX = (beginPoint.x < endPoint.x) ? beginPoint.x : endPoint.x;
      let outY = (beginPoint.y < endPoint.y) ? beginPoint.y : endPoint.y;
      return {x:outX,y:outY};
  }
  
  function writeScreenshot(png, filePath) {
    fs.writeFile(filePath, png, err => {
      if (err) return console.log('Failed to write screen:', err)
    })
  }
  
