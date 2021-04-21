const puppeteer=require("puppeteer");
var ks = require('node-key-sender');
const browserLaunchPromise=puppeteer.launch({
    headless:false,
    defaultViewport:null,
    args:["--start-maximized"],
    executablePath:"C:\\Users\\Aditya\\AppData\\Local\\Microsoft\\Edge SxS\\Application\\msedge.exe",
    slowMo:50
});

let cTab;

browserLaunchPromise.then(function(browserInstance){
    let allTabsPromise=browserInstance.pages();
    return allTabsPromise;
})
.then(function(tabsArr){
    cTab=tabsArr[0];
    const hackernoonSiteOpenedPromise=cTab.goto("https://www.hackernoon.com/how-to-create-cli-apps-2i1133ak");
    return hackernoonSiteOpenedPromise;
})
// .then(function(){
//     console.log("page opened");
//     const headingTagClickedPromise=cTab.click("main h1");
//     return headingTagClickedPromise;
// }
// )
.then(function(){
    console.log("h1 tag clicked");
    const ctrlDownPromise=cTab.keyboard.down("Control");
    return ctrlDownPromise;
})
.then(function(){
    const aButtonPressed=cTab.keyboard.press("a");
    return aButtonPressed;
})
.then(function(){
    console.log("control hold down");
    const shiftDownPromise=cTab.keyboard.down("Shift");
    return shiftDownPromise;
})
.then(function(){
    console.log("Shift held down");
    const uClickedPromis=cTab.keyboard.press("U");
})
.then(function(){
    return cTab.keyboard.up("Control");
})
.then(function(){
    return cTab.keyboard.up("Shift");
})
.then(function(){
    return ks.sendCombination(['control', 'shift', 'u']);
    
    //return cTab.click("main h1");
    //return cTab.waitFor(50000);
})
.then(function(){
    return cTab.waitForTimeout(1000);
})
.then(function(){
    //console.log("u pressed");
   const waitForSelectorToVanishPromise = cTab.waitForSelector("main .msreadout-word-highlight",{
       hidden:true,
       timeout:0
   });
   return waitForSelectorToVanishPromise;
})
.then(function(){
    return cTab.goto("https://www.google.com");

})
.then(function(){
    console.log("Done");
})



















// .then(function(){
//     return cTab.waitForTimeout(10000);
// })