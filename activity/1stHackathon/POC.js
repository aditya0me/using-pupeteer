const puppeteer = require("puppeteer");
var ks = require('node-key-sender');
const browserLaunchPromise = puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
    executablePath: "C:\\Users\\Aditya\\AppData\\Local\\Microsoft\\Edge SxS\\Application\\msedge.exe",
});

let cTab;

browserLaunchPromise.then(function (browserInstance) {
    let allTabsPromise = browserInstance.pages();
    return allTabsPromise;
})
    .then(function (tabsArr) {
        cTab = tabsArr[0];
        const homePageOpenedPromise = cTab.goto("https://www.indiatoday.in",{
            timeout:0
        });
        return homePageOpenedPromise;
    })
    .then(function () {
        cTab.waitForSelector("");
    })
   

    //   https://www.indiatoday.in/impact-feature/story/oppo-debuts-the-f19-in-india-boasts-the-sleekest-design-with-5000mah-battery-33w-flash-charging-and-more-1788820-2021-04-08
