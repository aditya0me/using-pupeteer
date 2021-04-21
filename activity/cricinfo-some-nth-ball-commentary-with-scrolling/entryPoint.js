let puppeteer=require("puppeteer");


let browserOpenP =  puppeteer.launch({
    headless:false,
    defaultViewport:false,
    args:["--start-maximized","--incognito"]
});

// so to have some settings , we can set settings in the chromium browser in gui mode, or we can also set from the code. 
//
//So we discussed some other key value pairs (and what they do )passed inside the launch function 
// for example before the web page was opening in 800x600 mode. But setting deaultViewport to null, after it we can set the size by ourself, args key re jau array  patha heichi sethire "--start-maximized" taa window ra size ku maximum kari open kariba 
// for example one key is there called argumentPath, using which we can set which browser to run
// args key re array of strings patha jae, jauthire different chromium flags pass kara jae, chromium flags are just some settings, se list of chromim flags ra url sei pptr.dev site re achi, that link is https://peter.sh/experiments/chromium-command-line-switches/ 

// launch function ra args bisyare jau lekh heichi sethi bi list of flag ra link taa achi 

let myUrl="https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/ball-by-ball-commentary";
let gPage; //global page this varibale ku globar kale karana , eta se first tab ra object taa, taa jaha bi kama haba yaa upare haba , so eta ku global kara heici 

/*
browserOpenP.then(function(browserInstance){
    console.log("Browser Opened");
    let alltabsPromise=browserInstance.pages();
    return alltabsPromise;
})
.then(function(tabs){
    gPage=tabs[0];
    let cricInfoP= gPage.goto(myUrl);
    return cricInfoP;
})
.then(function(){
    console.log("cricinfo page openedddddddddddd");
})
;

*/

/*------2nd pdao -------------*/

browserOpenP.then(function(browserInstance){
    console.log("Browser Opened");
    let alltabsPromise=browserInstance.pages();
    return alltabsPromise;
})
.then(function(tabs){
    gPage=tabs[0];
    let cricInfoPromise= gPage.goto(myUrl);
    return cricInfoPromise;
})
.then(function(){
    function tobeRunnedInBrowserConsole(){
        console.log("Hello, I am printed here"); // think where this will be printed , in our cmd or browser's conole
        return document.querySelector(".best-player-name").innerText;
     }  

    let manOfTheMatchPlayerNamePromise = gPage.evaluate(tobeRunnedInBrowserConsole);
     return manOfTheMatchPlayerNamePromise;
})
.then(function(playerName){
    console.log(playerName);
})
;
