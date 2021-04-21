const puppeteer=require("puppeteer");

const browserLaunchPromise=puppeteer.launch({
    headless:false,
    defaultViewport:null,
    args:["--start-maximized"],
    executablePath:"C:\\Users\\Aditya\\AppData\\Local\\Microsoft\\Edge SxS\\Application\\msedge.exe"
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
})
.then(function(){
    console.log("control hold down");
    const shiftDownPromise=cTab.keyboard.down("shift");
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
    console.log("u pressed");
    console.log("until it's working fine");
})
